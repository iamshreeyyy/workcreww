// backend/routes/disputes.js
const express = require('express');
const router = express.Router();
const {
  createDispute,
  getDisputes,
  getDisputeById,
  updateDispute,
  deleteDispute,
} = require('../controllers/disputeController');

// Create a new dispute
router.post('/', createDispute);

// Get all disputes (with optional query parameters)
router.get('/', getDisputes);

// Get a specific dispute by ID
router.get('/:id', getDisputeById);

// Update a dispute by ID
router.put('/:id', updateDispute);

// Delete a dispute by ID
router.delete('/:id', deleteDispute);

module.exports = router;
