import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resumeAPI, analysisAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const response = await resumeAPI.getAll();
      setResumes(response.data.resumes || []);
    } catch (error) {
      console.error('Error loading resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getScoreColor = (score) => {
    if (score >= 71) return 'green';
    if (score >= 41) return 'yellow';
    return 'red';
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="logo">
          <h1>ResumeFlux AI</h1>
        </div>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="action-cards">
          <div className="action-card" onClick={() => navigate('/upload')}>
            <div className="card-icon">📤</div>
            <h3>Upload Resume</h3>
            <p>Analyze your resume with AI</p>
          </div>
          <div className="action-card" onClick={() => navigate('/history')}>
            <div className="card-icon">📊</div>
            <h3>View History</h3>
            <p>See your past analyses</p>
          </div>
        </div>

        <section className="recent-analyses">
          <h2>Recent Analyses</h2>
          {loading ? (
            <p>Loading...</p>
          ) : resumes.length === 0 ? (
            <div className="empty-state">
              <p>No resumes uploaded yet.</p>
              <button onClick={() => navigate('/upload')} className="primary-btn">
                Upload Your First Resume
              </button>
            </div>
          ) : (
            <div className="resume-list">
              {resumes.map((resume) => (
                <div key={resume._id} className="resume-card">
                  <div className="resume-info">
                    <h3>{resume.originalFileName}</h3>
                    <p className="upload-date">
                      Uploaded: {new Date(resume.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                  {resume.score && (
                    <div className={`score-badge ${getScoreColor(resume.score)}`}>
                      {resume.score}/100
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
