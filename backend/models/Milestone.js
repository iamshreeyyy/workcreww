// backend/models/Milestone.js
const mongoose = require('mongoose');

const MilestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  deliverable: { type: String },
  amount: { type: Number, required: true },
  dueDate: { type: Date },
  status: { 
    type: String, 
    enum: ['pending', 'submitted', 'approved', 'rejected'], 
    default: 'pending' 
  },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // New field for escrow payment integration:
  paymentIntentId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Milestone', MilestoneSchema);
