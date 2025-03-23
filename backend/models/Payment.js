const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true }, // amount in cents
  status: { type: String, enum: ['pending', 'succeeded', 'failed'], default: 'pending' },
  date: { type: Date, default: Date.now },
  // add any additional fields as needed (e.g., transactionId, etc.)
});

module.exports = mongoose.model('Payment', PaymentSchema);
