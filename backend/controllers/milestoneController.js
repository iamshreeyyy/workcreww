// backend/controllers/milestoneController.js
const Milestone = require('../models/Milestone');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


// Create a new milestone
exports.createMilestone = async (req, res) => {
  try {
    const milestoneData = req.body;
    const milestone = new Milestone(milestoneData);
    await milestone.save();
    res.status(201).json({ milestone });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating milestone' });
  }
};

// Get all milestones (optionally, filter by project or user)
exports.getMilestones = async (req, res) => {
  try {
    const { projectId, freelancerId, employerId } = req.query;
    // Build filter dynamically based on query parameters
    let filter = {};
    if (projectId) filter.projectId = projectId;
    if (freelancerId) filter.freelancerId = freelancerId;
    if (employerId) filter.employerId = employerId;
    
    const milestones = await Milestone.find(filter);
    res.status(200).json({ milestones });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching milestones' });
  }
};

// Get a single milestone by ID
exports.getMilestoneById = async (req, res) => {
  try {
    const { id } = req.params;
    const milestone = await Milestone.findById(id);
    if (!milestone) {
      return res.status(404).json({ error: 'Milestone not found' });
    }
    res.status(200).json({ milestone });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching milestone' });
  }
};

// Update a milestone (e.g., submit work, approve/reject)
exports.updateMilestone = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      let milestone = await Milestone.findById(id);
      if (!milestone) {
        return res.status(404).json({ error: 'Milestone not found' });
      }
  
      // If the milestone is being approved and has an associated PaymentIntent, capture funds.
      if (updateData.status === 'approved' && milestone.paymentIntentId) {
        try {
          const capturedIntent = await stripe.paymentIntents.capture(milestone.paymentIntentId);
          console.log('Payment captured:', capturedIntent);
          // Optionally, store details of the capture result
        } catch (captureError) {
          console.error('Error capturing payment:', captureError);
          return res.status(500).json({ error: 'Milestone approved but failed to capture payment' });
        }
      }
  
      // Update milestone fields
      milestone = await Milestone.findByIdAndUpdate(id, updateData, { new: true });
      res.status(200).json({ milestone });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating milestone' });
    }
  };
// Delete a milestone
exports.deleteMilestone = async (req, res) => {
  try {
    const { id } = req.params;
    const milestone = await Milestone.findByIdAndDelete(id);
    if (!milestone) {
      return res.status(404).json({ error: 'Milestone not found' });
    }
    res.status(200).json({ message: 'Milestone deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting milestone' });
  }
};
