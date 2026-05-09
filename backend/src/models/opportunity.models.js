const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Please add a company'],
    trim: true
  },
  location: {
    type: String,
    default: 'Remote'
  },
  type: {
    type: String,
    enum: ['Job', 'Internship', 'Announcement'],
    required: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  deadline: {
    type: Date
  },
  contactInfo: {
    type: String
  },
  applicationLink: {
    type: String
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Opportunity', opportunitySchema);