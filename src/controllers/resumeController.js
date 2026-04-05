const path = require('path');
const Resume = require('../models/Resume');
const { extractText } = require('../services/resumeParser');

// Configure multer for file uploads
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and DOCX are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Upload and parse resume
exports.uploadResume = async (req, res) => {
  try {
    // Handle file upload
    upload.single('resume')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      try {
        // Extract text from the file
        const extractedText = await extractText(req.file.path, path.extname(req.file.originalname));
        
        // Get job description if provided
        const jobDescription = req.body.jobDescription || '';

        // Save to database
        const resume = new Resume({
          userId: req.user.userId,
          originalFileName: req.file.originalname,
          extractedText,
          jobDescription
        });

        await resume.save();

        // Clean up the uploaded file (we only keep the text)
        const fs = require('fs');
        fs.unlinkSync(req.file.path);

        res.status(201).json({
          message: 'Resume uploaded successfully',
          resume: {
            _id: resume._id,
            originalFileName: resume.originalFileName,
            uploadDate: resume.uploadDate
          }
        });
      } catch (parseError) {
        console.error('Parse error:', parseError);
        // Clean up on error
        const fs = require('fs');
        if (req.file && req.file.path) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ message: parseError.message });
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading resume', error: error.message });
  }
};

// Get all resumes for current user
exports.getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.userId })
      .sort({ uploadDate: -1 });
    
    res.json({ resumes });
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ message: 'Error fetching resumes', error: error.message });
  }
};

// Get single resume by ID
exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json({ resume });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ message: 'Error fetching resume', error: error.message });
  }
};
