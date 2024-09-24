import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css'; 


const SignUpPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { username, email, password, confirmPassword } = formData;
    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email address.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch('http://localhost:5000/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        if (response.ok) {
          navigate('/login');
        } else {
          setError('Failed to register. Please try again.');
        }
      } catch (error) {
        setError('Error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="login-page">
      <div className="form-wrapper">
        <form className="form" onSubmit={handleSubmit}>
          <h1>Sign Up</h1>
          {error && <p className="error">{error}</p>}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="input"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="input"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="input"
          />
          <button type="submit" className="button">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
