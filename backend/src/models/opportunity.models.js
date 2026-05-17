const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      maxlength: [100, "Location cannot exceed 100 characters"],
    },
    type: {
      type: String,
      required: [true, "Opportunity type is required"],
      enum: {
        values: ["Job", "Internship", "Announcement"],
        message: "Type must be Job, Internship, or Announcement",
      },
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [20, "Description must be at least 20 characters"],
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    deadline: {
      type: Date,
      validate: {
        validator: function (value) {
          return !value || value >= new Date().setHours(0, 0, 0, 0);
        },
        message: "Deadline cannot be in the past",
      },
    },
    contactInfo: {
      type: String,
      trim: true,
      maxlength: [200, "Contact info cannot exceed 200 characters"],
      default: null,
    },
    applicationLink: {
      type: String,
      trim: true,
      maxlength: [500, "Application link cannot exceed 500 characters"],
      validate: {
        validator: function (value) {
          return !value || /^https?:\/\//.test(value);
        },
        message: "Application link must be a valid URL starting with http:// or https://",
      },
      default: null,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "PostedBy reference is required"],
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
opportunitySchema.index({ title: "text", description: "text" });
opportunitySchema.index({ createdAt: -1 });
opportunitySchema.index({ type: 1, createdAt: -1 });
opportunitySchema.index({ postedBy: 1, createdAt: -1 });

// Virtual for days until deadline
opportunitySchema.virtual("daysUntilDeadline").get(function () {
  if (!this.deadline) return null;
  const diff = this.deadline - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// Virtual for expired status
opportunitySchema.virtual("isExpired").get(function () {
  if (!this.deadline) return false;
  return new Date() > this.deadline;
});

// Pre-save middleware to normalize data
opportunitySchema.pre("save", function (next) {
  if (this.title) this.title = this.title.trim();
  if (this.company) this.company = this.company.trim();
  if (this.location) this.location = this.location.trim();
  if (this.description) this.description = this.description.trim();
  if (this.contactInfo) this.contactInfo = this.contactInfo.trim();
  if (this.applicationLink) this.applicationLink = this.applicationLink.trim();
  next();
});

// Static method for search
opportunitySchema.statics.search = async function (query, options = {}) {
  const { type, page = 1, limit = 10 } = options;
  const searchQuery = {};

  if (query) searchQuery.$text = { $search: query };
  if (type) searchQuery.type = type;

  return this.find(searchQuery)
    .populate("postedBy", "name email")
    .sort(query ? { score: { $meta: "textScore" } } : { createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
};

module.exports = mongoose.model("Opportunity", opportunitySchema);