const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // General analysis fields
  score: {
    type: Number,
    default: null
  },
  strengths: [{
    type: String
  }],
  improvements: [{
    type: String
  }],
  missingKeywords: [{
    type: String
  }],
  summary: {
    type: String,
    default: ''
  },
  // Job description matching fields
  jobDescription: {
    type: String,
    default: ''
  },
  matchScore: {
    type: Number,
    default: null
  },
  matchedSkills: [{
    type: String
  }],
  missingSkills: [{
    type: String
  }],
  // Interview prep
  questions: [{
    type: String
  }],
  importantTopics: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Analysis', analysisSchema);
