import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', form);
      setMessage(res.data);
      if (res.data === 'Login successful') {
        setTimeout(() => navigate('/dashboard'), 1000);
      }
    } catch (err) {
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">

        <h2>Login</h2>
        <p>Welcome back! Please sign in.</p>

        <form onSubmit={handleSubmit}>
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

          <button type="submit" className="btn-primary">Login</button>
        </form>

        <p style={{ marginTop: '16px', textAlign: 'center' }}>
          Don't have an account?{' '}
          <a onClick={() => navigate('/register')}>Register here</a>
        </p>

      </div>
    </div>
  );
}

export default Login;