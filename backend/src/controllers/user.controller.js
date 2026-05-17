const User = require("../models/user.model");
const mongoose = require("mongoose");
const { AppError } = require("../middleware/error.middleware");

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);


const PUBLIC_FIELDS = "name bio skills courses cohort profilePhoto linkedIn createdAt";

// @desc    Get current user's profile
// @route   GET /api/users/me
// @access  Private
const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password -__v")
      .lean();

    if (!user) {
      throw new AppError("User not found", 404, null, "Your account may have been removed");
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user's profile
// @route   PUT /api/users/me
// @access  Private
const updateMyProfile = async (req, res, next) => {
  try {
    // Explicitly block sensitive fields from being updated through this endpoint
    const blockedFields = ["email", "password", "role", "tokenVersion", "_id", "createdAt", "updatedAt"];
    const blockedAttempted = blockedFields.filter((field) => req.body.hasOwnProperty(field));

    if (blockedAttempted.length > 0) {
      throw new AppError(
        "Cannot update restricted fields through this endpoint",
        403,
        blockedAttempted.map((field) => ({
          field,
          message: `${field} cannot be modified here`,
        })),
        `Use dedicated endpoints for: ${blockedAttempted.join(", ")}`
      );
    }

    // Only allow these profile fields to be updated
    const allowedFields = ["name", "bio", "skills", "courses", "cohort", "profilePhoto", "linkedIn"];
    const updates = {};
    let hasUpdates = false;

    allowedFields.forEach((field) => {
      if (req.body.hasOwnProperty(field)) {
        // Trim string fields
        updates[field] = typeof req.body[field] === "string" ? req.body[field].trim() : req.body[field];
        hasUpdates = true;
      }
    });

    if (!hasUpdates) {
      throw new AppError(
        "No valid fields provided for update",
        400,
        null,
        `Allowed fields: ${allowedFields.join(", ")}`
      );
    }

    // Validate name length if provided
    if (updates.name && updates.name.length < 2) {
      throw new AppError("Name must be at least 2 characters", 400, [
        { field: "name", message: "Name too short" },
      ]);
    }

    // Validate linkedIn URL if provided
    if (updates.linkedIn) {
      try {
        new URL(updates.linkedIn);
        if (!updates.linkedIn.includes("linkedin.com")) {
          throw new Error();
        }
      } catch {
        throw new AppError("Invalid LinkedIn URL", 400, [
          { field: "linkedIn", message: "Must be a valid linkedin.com URL" },
        ]);
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password -__v");

    if (!updatedUser) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (public directory)
// @route   GET /api/users
// @access  Private
const getAllUsers = async (req, res, next) => {
  try {
    const { search, skills, cohort, page = 1, limit = 20 } = req.query;
    const query = {};

    // Text search on name or bio
    if (search?.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { bio: { $regex: search.trim(), $options: "i" } },
      ];
    }

    // Filter by skills (comma-separated)
    if (skills?.trim()) {
      const skillArray = skills.split(",").map((s) => s.trim()).filter(Boolean);
      if (skillArray.length > 0) {
        query.skills = { $in: skillArray };
      }
    }

    // Filter by cohort
    if (cohort?.trim()) {
      query.cohort = cohort.trim();
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * pageSize;

    const [users, total] = await Promise.all([
      User.find(query)
        .select(PUBLIC_FIELDS)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page: pageNum,
        pages: Math.ceil(total / pageSize),
        total,
        limit: pageSize,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID (public profile)
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      throw new AppError("Invalid user ID format", 400);
    }

    const user = await User.findById(id).select(PUBLIC_FIELDS).lean();

    if (!user) {
      throw new AppError("User not found", 404, null, "The user may not exist or has been removed");
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getAllUsers,
  getUserById,
};