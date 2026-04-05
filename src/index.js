const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const analysisRoutes = require('./routes/analysisRoutes');

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the ResumeFluxAI API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/analysis', analysisRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Connect to MongoDB first, then start the server.
// This ensures no requests are handled before the DB is ready.
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('[ERROR] MONGODB_URI is not set in your .env file. Exiting.');
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('[1/2] Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`[2/2] Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[ERROR] MongoDB connection failed:', err.message);
    process.exit(1); // crash fast so you see the error clearly
  });