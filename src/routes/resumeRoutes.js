const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// POST /api/resume/upload - Upload a new resume
router.post('/upload', resumeController.uploadResume);

// GET /api/resume - Get all resumes for current user
router.get('/', resumeController.getAllResumes);

// GET /api/resume/:id - Get single resume by ID
router.get('/:id', resumeController.getResumeById);

module.exports = router;
