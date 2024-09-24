import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isLoginMode ? 'http://localhost:5000/api/login' : 'http://localhost:5000/api/register';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Login/Registration successful:', result);
        if (isLoginMode) {
          console.log('Navigating to second-page...');
          navigate('/second-page');
        } else {
          setIsLoginMode(true); // Switch to login mode after successful registration
          setError('Registration successful. Please log in.');
        }
      } else {
        console.log('Error:', result.error);
        setError(result.error || 'Error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Network Error:', error);
      setError('Error occurred. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="form-wrapper">
        <form className="form" onSubmit={handleSubmit}>
          <h1 className="glowing-text">{isLoginMode ? 'Login' : 'Sign Up'}</h1>
          {error && <p className="error">{error}</p>}

          {/* Username Field Visible in Both Modes */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="input"
          />
          
          {!isLoginMode && (
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="input"
            />
          )}
          
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="input"
          />
          
          {!isLoginMode && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input"
            />
          )}
          
          <button type="submit" className="btn">
            {isLoginMode ? 'Login' : 'Sign Up'}
          </button>
          <p className="toggle-mode" onClick={() => setIsLoginMode(!isLoginMode)}>
            {isLoginMode ? 'Don’t have an account? Sign Up' : 'Already have an account? Login'}
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
