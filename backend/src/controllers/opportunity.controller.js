const Opportunity = require("../models/opportunity.model");
const mongoose = require("mongoose");


const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const validateOpportunityInput = (body, isUpdate = false) => {
  const errors = [];
  const { title, company, location, type, description, deadline, contactInfo, applicationLink } = body;


  if (!isUpdate || body.hasOwnProperty("title")) {
    if (!title?.trim()) errors.push({ field: "title", message: "Title is required" });
    else if (title.trim().length < 3) errors.push({ field: "title", message: "Title must be at least 3 characters" });
  }

  if (!isUpdate || body.hasOwnProperty("company")) {
    if (!company?.trim()) errors.push({ field: "company", message: "Company name is required" });
  }

  if (!isUpdate || body.hasOwnProperty("location")) {
    if (!location?.trim()) errors.push({ field: "location", message: "Location is required" });
  }

  if (!isUpdate || body.hasOwnProperty("type")) {
    if (!type) errors.push({ field: "type", message: "Opportunity type is required" });
    else if (!["Job", "Internship", "Announcement"].includes(type)) {
      errors.push({ field: "type", message: "Type must be Job, Internship, or Announcement" });
    }
  }

  if (!isUpdate || body.hasOwnProperty("description")) {
    if (!description?.trim()) errors.push({ field: "description", message: "Description is required" });
    else if (description.trim().length < 20) {
      errors.push({ field: "description", message: "Description must be at least 20 characters" });
    }
  }

  // Optional field validations
  if (deadline !== undefined && deadline !== null) {
    const date = new Date(deadline);
    if (isNaN(date.getTime())) {
      errors.push({ field: "deadline", message: "Deadline must be a valid date" });
    } else if (date < new Date().setHours(0, 0, 0, 0)) {
      errors.push({ field: "deadline", message: "Deadline cannot be in the past" });
    }
  }

  if (applicationLink !== undefined && applicationLink !== null) {
    try {
      new URL(applicationLink);
    } catch {
      errors.push({ field: "applicationLink", message: "Application link must be a valid URL" });
    }
  }

  return errors;
};

const checkOwnership = (opportunity, user) => {
  return (
    opportunity.postedBy.toString() === user._id.toString() ||
    user.role === "admin"
  );
};


const getAllOpportunities = async (req, res, next) => {
  try {
    const { search, type, page = 1, limit = 10 } = req.query;
    const query = {};

    // Filter by type
    if (type && ["Job", "Internship", "Announcement"].includes(type)) {
      query.type = type;
    }

    // Text search
    if (search?.trim()) {
      query.$text = { $search: search.trim() };
    }

    const skip = (Math.max(1, parseInt(page)) - 1) * Math.min(50, Math.max(1, parseInt(limit)));
    const pageSize = Math.min(50, Math.max(1, parseInt(limit)));

    const [opportunities, total] = await Promise.all([
      Opportunity.find(query)
        .populate("postedBy", "name email")
        .sort(search ? { score: { $meta: "textScore" } } : { createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Opportunity.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: opportunities,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / pageSize),
        total,
        limit: pageSize,
      },
    });
  } catch (error) {
    next(error);
  }
};


const getOpportunityById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid opportunity ID format",
      });
    }

    const opportunity = await Opportunity.findById(id)
      .populate("postedBy", "name email")
      .lean();

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: "Opportunity not found",
        hint: "The opportunity may have been removed or the ID is incorrect",
      });
    }

    res.status(200).json({
      success: true,
      data: opportunity,
    });
  } catch (error) {
    next(error);
  }
};


const createOpportunity = async (req, res, next) => {
  try {
    const errors = validateOpportunityInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors.length === 1 ? errors[0].message : "Validation failed",
        errors,
      });
    }

    const { title, company, location, type, description, deadline, contactInfo, applicationLink } = req.body;

    const opportunity = await Opportunity.create({
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      type,
      description: description.trim(),
      deadline: deadline || null,
      contactInfo: contactInfo?.trim() || null,
      applicationLink: applicationLink?.trim() || null,
      postedBy: req.user._id,
    });

    const populated = await Opportunity.findById(opportunity._id)
      .populate("postedBy", "name email")
      .lean();

    res.status(201).json({
      success: true,
      message: "Opportunity created successfully",
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};


const updateOpportunity = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid opportunity ID format",
      });
    }

    const errors = validateOpportunityInput(req.body, true);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors.length === 1 ? errors[0].message : "Validation failed",
        errors,
      });
    }

    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: "Opportunity not found",
      });
    }

    if (!checkOwnership(opportunity, req.user)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this opportunity",
        hint: "Only the poster or an admin can make changes",
      });
    }

    const allowedFields = [
      "title",
      "company",
      "location",
      "type",
      "description",
      "deadline",
      "contactInfo",
      "applicationLink",
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body.hasOwnProperty(field)) {
        updates[field] = req.body[field] === null ? null : req.body[field]?.trim?.() ?? req.body[field];
      }
    });

    const updated = await Opportunity.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate("postedBy", "name email")
      .lean();

    res.status(200).json({
      success: true,
      message: "Opportunity updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete opportunity
// @route   DELETE /api/opportunities/:id
// @access  Private
const deleteOpportunity = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid opportunity ID format",
      });
    }

    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: "Opportunity not found",
      });
    }

    if (!checkOwnership(opportunity, req.user)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this opportunity",
        hint: "Only the poster or an admin can remove this",
      });
    }

    await Opportunity.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Opportunity removed successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
};