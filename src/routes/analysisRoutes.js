const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// POST /api/analysis/analyze - Analyze a resume
router.post('/analyze', analysisController.analyzeResume);

// GET /api/analysis/resume/:resumeId - Get analysis for a resume
router.get('/resume/:resumeId', analysisController.getAnalysisByResumeId);

// GET /api/analysis/history - Get analysis history
router.get('/history', analysisController.getHistory);

module.exports = router;
