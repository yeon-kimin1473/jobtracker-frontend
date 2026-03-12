import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">

      <nav className="navbar">
        <h2 className="logo">Job Tracker</h2>
        <div className="nav-links">
          <button onClick={() => navigate('/login')}>Login</button>
          <button onClick={() => navigate('/register')}>Register</button>
        </div>
      </nav>

      <div className="hero">
        <h1>Track Your Job Applications</h1>
        <p>Stay organized and never miss a follow-up again.</p>
        <button className="btn-primary hero-btn" onClick={() => navigate('/register')}>
          Get Started
        </button>
      </div>

      <div className="cards">
        <div className="card">
          <h3>📋 Manage Applications</h3>
          <p>Keep all your job applications in one place.</p>
        </div>
        <div className="card">
          <h3>🔐 Secure Login</h3>
          <p>Your data is safe and only accessible by you.</p>
        </div>
        <div className="card">
          <h3>📊 View Dashboard</h3>
          <p>See a summary of all users and activity.</p>
        </div>
      </div>

    </div>
  );
}

export default Home;