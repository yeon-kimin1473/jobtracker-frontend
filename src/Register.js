import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'USER' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/auth/register', form);
      setMessage(res.data);
      if (res.data === 'User registered successfully') {
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err) {
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">

        <h2>Register</h2>
        <p>Create your account to get started</p>

        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {message && <p className="message">{message}</p>}

          <button type="submit" className="btn-primary">Register</button>
        </form>

        <p style={{ marginTop: '16px', textAlign: 'center' }}>
          Already have an account?{' '}
          <button onClick={() => navigate('/login')}>Login here</button>
        </p>

      </div>
    </div>
  );
}

export default Register;