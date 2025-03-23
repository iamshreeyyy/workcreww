// backend/controllers/workSubmissionController.js
const WorkSubmission = require('../models/WorkSubmission');
const Milestone = require('../models/Milestone');

// Create a new work submission tied to a milestone
exports.createSubmission = async (req, res) => {
  try {
    const { milestoneId, freelancerId, submissionDetails } = req.body;

    // Optional: Check if milestone exists and belongs to the freelancer
    const milestone = await Milestone.findById(milestoneId);
    if (!milestone) {
      return res.status(404).json({ error: 'Milestone not found' });
    }
    
    const submission = new WorkSubmission({ milestoneId, freelancerId, submissionDetails });
    await submission.save();
    
    // Optionally update milestone status to "submitted"
    milestone.status = 'submitted';
    await milestone.save();

    res.status(201).json({ submission });
  } catch (error) {
    console.error('Error creating submission:', error);
    res.status(500).json({ error: 'Error creating submission' });
  }
};

// Get all submissions, optionally filtered by milestone or freelancer
exports.getSubmissions = async (req, res) => {
  try {
    const { milestoneId, freelancerId } = req.query;
    let filter = {};
    if (milestoneId) filter.milestoneId = milestoneId;
    if (freelancerId) filter.freelancerId = freelancerId;
    
    const submissions = await WorkSubmission.find(filter)
      .populate('milestoneId', 'title')
      .populate('freelancerId', 'username email');
    res.status(200).json({ submissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Error fetching submissions' });
  }
};

// Update a submission status (approve or reject) and add optional feedback
exports.updateSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, feedback } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status update' });
    }
    
    const submission = await WorkSubmission.findByIdAndUpdate(id, { status, feedback }, { new: true });
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    
    // Optionally update the milestone status based on submission outcome
    const milestone = await Milestone.findById(submission.milestoneId);
    if (milestone) {
      milestone.status = status;
      await milestone.save();
    }

    res.status(200).json({ submission });
  } catch (error) {
    console.error('Error updating submission:', error);
    res.status(500).json({ error: 'Error updating submission' });
  }
};
