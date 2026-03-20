import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [pendingJob, setPendingJob] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [form, setForm] = useState({
    company: '',
    role: '',
    status: 'Applied',
    appliedDate: '',
    deadline: '',
    followUpDate: '',
    userId: localStorage.getItem('userId')
});
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = () => {
    const userId = localStorage.getItem('userId');
    axios.get(`https://jobtracker-backend-2p21.onrender.com/api/jobs/user/${userId}`)
      .then(res => setJobs(res.data))
      .catch(err => console.log(err));
};

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://jobtracker-backend-2p21.onrender.com/api/jobs/add', form);
      setMessage('Job added successfully!');
      setForm({ 
    company: '', 
    role: '', 
    status: 'Applied', 
    appliedDate: '', 
    deadline: '',
    followUpDate: '',
    userId: localStorage.getItem('userId') 
});
      setShowForm(false);
      fetchJobs();
    } catch (err) {
      setMessage('Something went wrong.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://jobtracker-backend-2p21.onrender.com/api/jobs/${id}`);
      fetchJobs();
    } catch (err) {
      console.log(err);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
        await axios.put(`https://jobtracker-backend-2p21.onrender.com/api/jobs/${id}/status?status=${newStatus}`);
        fetchJobs();
    } catch (err) {
        console.log(err);
    }
};


const handlePredict = (job) => {
    setPendingJob(job);
    setShowModal(true);
    setJobDescription('');
    setPrediction(null);
};

const handleSubmitPredict = async () => {
    setShowModal(false);
    setSelectedJob(pendingJob);
    setPredicting(true);
    setPrediction(null);

    try {
        const formData = new FormData();
        formData.append('company', pendingJob.company);
        formData.append('role', pendingJob.role);
        formData.append('jobDescription', jobDescription);
        formData.append('resume', resumeFile);

        const res = await axios.post(
            'https://jobtracker-backend-2p21.onrender.com/api/ai/predict',
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setPrediction(res.data.prediction);
    } catch (err) {
        setPrediction('Could not get prediction. Please try again.');
    }
    setPredicting(false);
};


  const filtered = jobs.filter(j =>
    j.company.toLowerCase().includes(search.toLowerCase()) ||
    j.role.toLowerCase().includes(search.toLowerCase())
  );

  const isExpired = (date) => {
    if (!date) return false;
    return new Date(date) < new Date();
};

const isDueSoon = (date) => {
    if (!date) return false;
    const today = new Date();
    const followUp = new Date(date);
    const diff = (followUp - today) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 3;
};

  return (
    <div className="dashboard-container">

      {/* Header */}
      <div className="dashboard-header">
        <h2>Job Tracker Dashboard</h2>
        <button className="logout-btn" onClick={() => { localStorage.clear(); navigate('/login'); }}>Logout</button>
      </div>

      {/* Summary Cards */}
      <div className="summary">
        <div className="summary-card">
          <h3>{jobs.length}</h3>
          <p>Total Applications</p>
        </div>
        <div className="summary-card">
          <h3>{jobs.filter(j => j.status === 'Applied').length}</h3>
          <p>Applied</p>
        </div>
        <div className="summary-card">
          <h3>{jobs.filter(j => j.status === 'Interview').length}</h3>
          <p>Interview</p>
        </div>
        <div className="summary-card">
          <h3>{jobs.filter(j => j.status === 'Waiting').length}</h3>
          <p>Waiting</p>
        </div>
        <div className="summary-card">
          <h3>{jobs.filter(j => j.status === 'Offered').length}</h3>
          <p>Offered</p>
        </div>
        <div className="summary-card">
          <h3>{jobs.filter(j => j.status === 'Rejected').length}</h3>
          <p>Rejected</p>
        </div>
      </div>

      {/* Add Job Button */}
      <div className="add-section">
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Job Application'}
        </button>
        {message && <p className="success-msg">{message}</p>}
      </div>

      {/* Add Job Form */}
      {showForm && (
        <div className="form-section">
          <h3>Add New Job Application</h3>
          <form onSubmit={handleSubmit} className="job-form">
            <div className="form-row">
              <div className="form-group">
                <label>Company</label>
                <input
                  type="text"
                  name="company"
                  placeholder="e.g. Google"
                  value={form.company}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <input
                  type="text"
                  name="role"
                  placeholder="e.g. Software Engineer"
                  value={form.role}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleChange}>
                    <option value="Applied">Applied</option>
                    <option value="Waiting">Waiting</option>
                    <option value="Interview">Interview</option>
                    <option value="Offered">Offered</option>
                    <option value="Rejected">Rejected</option>
                  </select>
              </div>
              <div className="form-group">
                <label>Applied Date</label>
                <input
                  type="date"
                  name="appliedDate"
                  value={form.appliedDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
    <div className="form-group">
        <label>Application Deadline</label>
        <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
        />
    </div>
    <div className="form-group">
        <label>Follow Up Date</label>
        <input
            type="date"
            name="followUpDate"
            value={form.followUpDate}
            onChange={handleChange}
        />
    </div>
</div>
            <button type="submit" className="submit-btn">Add Application</button>
          </form>
        </div>
      )}

      {/* Jobs Table */}
      <div className="table-section">
        <div className="table-header">
          <h3>All Job Applications</h3>
          <input
            type="text"
            placeholder="Search by company or role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Company</th>
              <th>Role</th>
              <th>Status</th>
              <th>Applied Date</th>
              <th>Deadline</th>
              <th>Follow Up</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">No job applications found</td>
              </tr>
            ) : (
              filtered.map(job => (
                <tr key={job.id}>
                  <td>{job.id}</td>
                  <td>{job.company}</td>
                  <td>{job.role}</td>
                  <td>
                    <span className={`status-badge ${job.status.toLowerCase()}`}>
                      {job.status}
                    </span>
                  </td>
                  <td>{job.appliedDate}</td>
<td className={isExpired(job.deadline) ? 'expired-date' : 'normal-date'}>
    {job.deadline ? job.deadline : '—'}
</td>
<td className={isDueSoon(job.followUpDate) ? 'due-soon-date' : 'normal-date'}>
    {job.followUpDate ? job.followUpDate : '—'}
</td>
<td className="action-cell">
    <select
    className="status-select"
    value={job.status}
    onChange={(e) => handleStatusUpdate(job.id, e.target.value)}
>
    <option value="Applied">Applied</option>
    <option value="Waiting">Waiting</option>
    <option value="Interview">Interview</option>
    <option value="Offered">Offered</option>
    <option value="Rejected">Rejected</option>
</select>
    <button className="delete-btn" onClick={() => handleDelete(job.id)}>
        Delete
    </button>
    <button className="predict-btn" onClick={() => handlePredict(job)}>
    🤖 Predict
</button>
</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    {selectedJob && (
    <div className="prediction-card">
        <div className="prediction-header">
            <h3>🤖 AI Prediction</h3>
            <button className="close-btn" onClick={() => { setPrediction(null); setSelectedJob(null); }}>✕</button>
        </div>
        <p className="prediction-job">{selectedJob.company} — {selectedJob.role}</p>
        {predicting ? (
            <p className="predicting-text">Analyzing your application...</p>
        ) : (
            <div className="prediction-result">
    {prediction && prediction.split('\n').map((line, i) => (
        <p key={i} className={
            line.startsWith('Match Score:') ? 'score-line' :
            line.startsWith('Verdict:') ? 'verdict-line' :
            line.trim() === '' ? '' :
            'reason-line'
        }>
            {line}
        </p>
    ))}
</div>
        )}
    </div>
)}

{showModal && (
    <div className="modal-overlay">
        <div className="modal-box">
            <div className="modal-header">
                <h3>📋 Paste Job Description</h3>
                <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <p className="modal-sub">{pendingJob.company} — {pendingJob.role}</p>
            <textarea
                className="jd-textarea"
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                rows={6}
            />
            <div className="resume-upload">
                <label>Upload Resume (PDF)</label>
                <input
                    type="file"
                    accept=".pdf"
                    onChange={e => setResumeFile(e.target.files[0])}
                    className="file-input"
                />
                {resumeFile && <p className="file-name">✅ {resumeFile.name}</p>}
            </div>
            <button
                className="btn-primary submit-btn"
                onClick={handleSubmitPredict}
                disabled={!jobDescription.trim() || !resumeFile}
            >
                Analyze Match 🤖
            </button>
        </div>
    </div>
)}
    </div>

  );
}

export default Dashboard;