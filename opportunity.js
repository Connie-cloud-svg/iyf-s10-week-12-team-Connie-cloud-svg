const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },

    company: {
      type: String,
      required: [true, 'Company is required'],
      trim: true
    },

    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },

    type: {
      type: String,
      required: [true, 'Type is required'],
      enum: {
        values: ['Job', 'Internship', 'Announcement'],
        message: '{VALUE} is not valid'
      }
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [20, 'Description must be at least 20 characters'],
      trim: true
    },

    deadline: {
      type: Date,
      default: null
    },

    contactInfo: {
      type: String,
      trim: true,
      default: ''
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false,
    minimize: false
  }
);

// 🔥 Performance indexes (controlled, not chaotic)
opportunitySchema.index({ title: 'text', description: 'text', company: 'text' });
opportunitySchema.index({ createdAt: -1 });

// ⚠️ Prevent auto-index chaos in production (important fix)
if (process.env.NODE_ENV === 'production') {
  mongoose.set('autoIndex', false);
}

module.exports = mongoose.model('Opportunity', opportunitySchema);