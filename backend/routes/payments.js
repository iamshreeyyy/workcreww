// backend/routes/payments.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');
const Payment = require('../models/Payment');
/**
 * Create a PaymentIntent for immediate capture (for standard payments).
 */
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', milestoneId, metadata } = req.body;
    
    // Create a PaymentIntent for immediate capture
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { milestoneId, ...metadata },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent: ", error);
    res.status(500).json({ error: 'Error creating payment intent' });
  }
});

/**
 * Create a PaymentIntent with manual capture to hold funds in escrow.
 */
router.post('/create-escrow-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', milestoneId, metadata } = req.body;
    
    // Create a PaymentIntent with manual capture enabled
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      capture_method: 'manual',  // Funds held in escrow
      metadata: { milestoneId, ...metadata },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
  } catch (error) {
    console.error("Error creating escrow payment intent: ", error);
    res.status(500).json({ error: 'Error creating escrow payment intent' });
  }
});

/**
 * Capture funds from a PaymentIntent created with manual capture.
 * Secured: Only authenticated users with the 'employer' role can capture.
 */
router.post(
  '/capture-payment',
  authenticate,
  authorizeRoles('employer'),
  async (req, res) => {
    try {
      const { paymentIntentId } = req.body;
      if (!paymentIntentId) {
        return res.status(400).json({ error: 'PaymentIntent ID is required for capture' });
      }
      
      // Capture the funds
      const capturedIntent = await stripe.paymentIntents.capture(paymentIntentId);
      res.status(200).json({ capturedIntent });
    } catch (error) {
      console.error("Error capturing payment: ", error);
      res.status(500).json({ error: 'Error capturing payment' });
    }
  }
);

/**
 * Refund a captured PaymentIntent.
 * Secured: Only authenticated users with the 'employer' role can process refunds.
 */
router.post(
  '/refund-payment',
  authenticate,
  authorizeRoles('employer'),
  async (req, res) => {
    try {
      const { paymentIntentId, amount } = req.body;
      if (!paymentIntentId) {
        return res.status(400).json({ error: 'PaymentIntent ID is required for refund' });
      }
      
      // Create a refund (if amount is omitted, a full refund is applied)
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount, // amount in cents
      });
      
      res.status(200).json({ refund });
    } catch (error) {
      console.error("Error processing refund: ", error);
      res.status(500).json({ error: 'Error processing refund' });
    }
  }
);

module.exports = router;
router.get('/details', authenticate, async (req, res) => {
  try {
    // For freelancers only
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Assuming you want to return the most recent payment for the freelancer
    const paymentDetails = await Payment.findOne({ freelancerId: req.user.id })
      .sort({ date: -1 }); // Most recent payment first

    if (!paymentDetails) {
      return res.status(404).json({ error: 'Payment details not found' });
    }

    res.status(200).json({ payment: paymentDetails });
  } catch (error) {
    console.error('Payment details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;