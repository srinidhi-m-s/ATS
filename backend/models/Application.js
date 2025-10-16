const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    default: ''
  },
  updatedBy: {
    type: String, // 'Bot Mimic', 'Admin', 'Applicant'
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicantName: {
    type: String,
    required: true
  },
  applicantEmail: {
    type: String,
    required: true
  },
  resume: {
    type: String,
    default: ''
  },
  coverLetter: {
    type: String,
    default: ''
  },
  currentStatus: {
    type: String,
    enum: ['Applied', 'Reviewed', 'Interview', 'Offer', 'Rejected', 'Accepted'],
    default: 'Applied'
  },
  roleType: {
    type: String,
    enum: ['technical', 'non-technical'],
    required: true
  },
  activityLog: [activityLogSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Application', applicationSchema);