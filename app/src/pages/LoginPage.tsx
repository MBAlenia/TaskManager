import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { useLanguage } from '../context/LanguageContext';
import packageInfo from '../../package.json';

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
      // Extract error message from different possible sources
      let errorMsg = 'An unexpected error occurred during login. Please try again.';
      
      // Since authService now throws Error objects with messages, we can use error.message directly
      if (error.message) {
        errorMsg = error.message;
      } else if (error.response) {
        // Axios error with response
        if (error.response.status === 401) {
          // Check if there's a specific error message from the backend
          const backendErrorMessage = error.response.data?.error;
          if (backendErrorMessage) {
            errorMsg = backendErrorMessage;
          } else {
            errorMsg = 'Invalid username or password. Please try again.';
          }
        } else if (error.response.status === 404) {
          errorMsg = 'User not found. Please check your username.';
        } else if (error.response.data && error.response.data.error) {
          errorMsg = error.response.data.error;
        } else {
          errorMsg = `Login failed with status: ${error.response.status}`;
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMsg = 'Unable to connect to the server. Please check your network connection and ensure the application is running.';
      }
      
      setErrorMessage(errorMsg);
    }
  };

  return (
    <div className="container container-login">
      <div className="card">
        <div className="card-body">
          <div className="login-header">
            <h1>{translate('app_name')}</h1>
            <p className="version-info">Version {packageInfo.version}</p>
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
                required
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
                required
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