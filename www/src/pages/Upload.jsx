import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { resumeAPI, analysisAPI } from '../services/api';
import './Upload.css';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError('');
      setSuccess('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false
  });

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('resume', file);
      if (jobDescription) {
        formData.append('jobDescription', jobDescription);
      }

      const response = await resumeAPI.upload(formData);
      setSuccess('Resume uploaded successfully!');
      
      // Auto-analyze after upload
      setAnalyzing(true);
      const analysisResponse = await analysisAPI.analyze(
        response.data.resume._id,
        jobDescription
      );
      
      navigate('/analysis', { 
        state: { 
          resume: response.data.resume, 
          analysis: analysisResponse.data.analysis 
        } 
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <h2>Upload Your Resume</h2>
        <p className="upload-subtitle">Upload a PDF or DOCX file (max 5MB)</p>

        <div 
          {...getRootProps()} 
          className={`dropzone ${isDragActive ? 'active' : ''}`}
        >
          <input {...getInputProps()} />
          {file ? (
            <div className="selected-file">
              <span className="file-icon">📄</span>
              <span className="file-name">{file.name}</span>
              <span className="file-size">
                ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          ) : (
            <div className="dropzone-content">
              <span className="dropzone-icon">📁</span>
              {isDragActive ? (
                <p>Drop the file here...</p>
              ) : (
                <p>Drag & drop a file here, or click to select</p>
              )}
              <span className="file-types">PDF or DOCX</span>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="jobDescription">
            Job Description (optional)
          </label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here to get matching insights..."
            rows={4}
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button 
          className="upload-button" 
          onClick={handleUpload}
          disabled={!file || uploading || analyzing}
        >
          {uploading ? 'Uploading...' : analyzing ? 'Analyzing...' : 'Upload & Analyze'}
        </button>
      </div>
    </div>
  );
};

export default Upload;
