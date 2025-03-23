// backend/routes/submissions.js
const express = require('express');
const router = express.Router();
const {
  createSubmission,
  getSubmissions,
  updateSubmission,
} = require('../controllers/workSubmissionController');

// Route to create a new work submission
router.post('/', createSubmission);

// Route to get work submissions (optionally filtered)
router.get('/', getSubmissions);

// Route to update a submission (e.g., approve or reject with feedback)
router.put('/:id', updateSubmission);

module.exports = router;
