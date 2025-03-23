// backend/models/Dispute.js
const mongoose = require('mongoose');

const DisputeSchema = new mongoose.Schema({
  milestoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Milestone', required: true },
  raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['open', 'in_review', 'resolved', 'rejected'], 
    default: 'open' 
  },
  resolution: { type: String } // Resolution details when dispute is resolved
}, { timestamps: true });

module.exports = mongoose.model('Dispute', DisputeSchema);
