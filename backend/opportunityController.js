const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ["Job", "Internship", "Announcement"]
    },
    description: {
      type: String,
      required: true,
      minlength: 20
    },
    deadline: { type: Date },
    contactInfo: { type: String, trim: true },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

opportunitySchema.index({ title: "text", description: "text" });
opportunitySchema.index({ createdAt: -1 });

module.exports = mongoose.model("Opportunity", opportunitySchema);
