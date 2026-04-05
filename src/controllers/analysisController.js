const Resume = require('../models/Resume');
const Analysis = require('../models/Analysis');
const { analyzeResume, generateInterviewPrep } = require('../services/aiService');

// Analyze a resume
exports.analyzeResume = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;

    // Get the resume
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Verify ownership
    if (resume.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Analyze with AI
    const analysisResult = await analyzeResume(resume.extractedText, jobDescription || '');

    // Generate interview prep if requested
    let interviewPrep = null;
    try {
      interviewPrep = await generateInterviewPrep(resume.extractedText, jobDescription || '');
    } catch (prepError) {
      console.error('Interview prep generation failed:', prepError);
    }

    // Create analysis record
    const analysis = new Analysis({
      resumeId: resume._id,
      userId: req.user.userId,
      // General analysis
      score: analysisResult.score || null,
      strengths: analysisResult.strengths || [],
      improvements: analysisResult.improvements || [],
      missingKeywords: analysisResult.missingKeywords || [],
      summary: analysisResult.summary || '',
      // Job matching
      jobDescription: jobDescription || '',
      matchScore: analysisResult.matchScore || null,
      matchedSkills: analysisResult.matchedSkills || [],
      missingSkills: analysisResult.missingSkills || [],
      // Interview prep
      questions: interviewPrep?.questions || [],
      importantTopics: interviewPrep?.importantTopics || []
    });

    await analysis.save();

    // Update resume with score
    resume.score = analysisResult.score || analysisResult.matchScore || null;
    await resume.save();

    res.status(201).json({
      message: 'Analysis completed successfully',
      analysis
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ message: 'Error analyzing resume', error: error.message });
  }
};

// Get analysis by resume ID
exports.getAnalysisByResumeId = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      resumeId: req.params.resumeId,
      userId: req.user.userId
    }).sort({ createdAt: -1 });

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    res.json({ analysis });
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({ message: 'Error fetching analysis', error: error.message });
  }
};

// Get analysis history
exports.getHistory = async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.user.userId })
      .populate('resumeId', 'originalFileName uploadDate')
      .sort({ createdAt: -1 });

    res.json({ analyses });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ message: 'Error fetching history', error: error.message });
  }
};
