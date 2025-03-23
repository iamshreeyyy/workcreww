// backend/models/WorkSubmission.js
const mongoose = require('mongoose');

const WorkSubmissionSchema = new mongoose.Schema({
  milestoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Milestone', required: true },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // The submission can include text details, a URL to uploaded files, screenshots, etc.
  submissionDetails: { type: String, required: true },
  // Status for the submission: submitted, approved, or rejected
  status: { 
    type: String, 
    enum: ['submitted', 'approved', 'rejected'], 
    default: 'submitted' 
  },
  // Feedback from the employer when rejecting or requesting revisions
  feedback: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('WorkSubmission', WorkSubmissionSchema);
