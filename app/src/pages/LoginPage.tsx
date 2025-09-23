import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { useLanguage } from '../context/LanguageContext';

const LoginPage: React.FC = () => {
  const { translate } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null); // Clear previous errors
    setSuccessMessage(null); // Clear previous success messages
    try {
      const response = await authService.login(username, password);
      console.log('Login successful:', response.data);
      localStorage.setItem('userToken', response.data.token); // Store the token
      localStorage.setItem('userLevel', response.data.level.toString()); // Store the user level
      localStorage.setItem('userPoints', response.data.points.toString()); // Store the user points
      setSuccessMessage('Login successful! Redirecting...');
      navigate('/dashboard'); // Redirect to dashboard
    } catch (error: any) {
      console.error('Login failed:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('An unexpected error occurred during login.');
      }
    }
  };

  return (
    <div className="container container-login">
      <div className="card">
        <div className="card-body">
          <div className="login-header">
            <h1>{translate('login_page_title')}</h1>
            <p>Welcome to TaskQuest</p>
          </div>
          
          {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
          {successMessage && <div className="alert alert-success" role="alert">{successMessage}</div>}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">{translate('username')}</label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">{translate('password')}</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="btn btn-primary">{translate('login_button')}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;