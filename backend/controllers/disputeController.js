// backend/controllers/disputeController.js
const Dispute = require('../models/Dispute');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Milestone = require('../models/Milestone');
// Create a new dispute
exports.createDispute = async (req, res) => {
  try {
    const { milestoneId, raisedBy, description } = req.body;
    const dispute = new Dispute({ milestoneId, raisedBy, description });
    await dispute.save();
    res.status(201).json({ dispute });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating dispute' });
  }
};

// Get all disputes (optionally filtered by milestone, user, or status)
exports.getDisputes = async (req, res) => {
  try {
    const { milestoneId, raisedBy, status } = req.query;
    let filter = {};
    if (milestoneId) filter.milestoneId = milestoneId;
    if (raisedBy) filter.raisedBy = raisedBy;
    if (status) filter.status = status;
    
    const disputes = await Dispute.find(filter)
      .populate('milestoneId', 'title')
      .populate('raisedBy', 'username email');
    res.status(200).json({ disputes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching disputes' });
  }
};

// Get a specific dispute by ID
exports.getDisputeById = async (req, res) => {
  try {
    const { id } = req.params;
    const dispute = await Dispute.findById(id)
      .populate('milestoneId', 'title')
      .populate('raisedBy', 'username email');
    if (!dispute) {
      return res.status(404).json({ error: 'Dispute not found' });
    }
    res.status(200).json({ dispute });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching dispute' });
  }
};

// Update a dispute (e.g., update status, resolution notes, and action decision)
exports.updateDispute = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      let dispute = await Dispute.findById(id);
      if (!dispute) {
        return res.status(404).json({ error: 'Dispute not found' });
      }
  
      // Update the dispute with the provided resolution information.
      dispute = await Dispute.findByIdAndUpdate(id, updateData, { new: true });
  
      // Example: If the dispute is resolved with a "refund" action, process the refund.
      // We assume that the dispute metadata or resolution contains a flag "action" with value "refund"
      if (updateData.status === 'resolved' && updateData.action === 'refund') {
        // Find the associated milestone to get the PaymentIntent ID
        const milestone = await Milestone.findById(dispute.milestoneId);
        if (milestone && milestone.paymentIntentId) {
          try {
            // Process a refund for the full amount, or optionally pass a partial amount.
            const refund = await stripe.refunds.create({
              payment_intent: milestone.paymentIntentId,
              // amount: optional, if you want a partial refund, include the amount in cents.
            });
            console.log('Refund processed:', refund);
            // Optionally update the milestone status or store refund details.
          } catch (refundError) {
            console.error('Error processing refund:', refundError);
            return res.status(500).json({ error: 'Dispute resolved but refund processing failed' });
          }
        }
      }
      res.status(200).json({ dispute });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating dispute' });
    }
  };
// Delete a dispute (if necessary)
exports.deleteDispute = async (req, res) => {
  try {
    const { id } = req.params;
    const dispute = await Dispute.findByIdAndDelete(id);
    if (!dispute) {
      return res.status(404).json({ error: 'Dispute not found' });
    }
    res.status(200).json({ message: 'Dispute deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting dispute' });
  }
};
