// backend/routes/milestones.js
const express = require('express');
const router = express.Router();
const {
  createMilestone,
  getMilestones,
  getMilestoneById,
  updateMilestone,
  deleteMilestone,
} = require('../controllers/milestoneController');

// Create a new milestone
router.post('/', createMilestone);

// Get all milestones (with optional query parameters)
router.get('/', getMilestones);

// Get a specific milestone by ID
router.get('/:id', getMilestoneById);

// Update a milestone by ID
router.put('/:id', updateMilestone);

// Delete a milestone by ID
router.delete('/:id', deleteMilestone);

module.exports = router;
