import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import config from '../config';

const API_URL = `${config.API_BASE_URL}/auth`;

// Log the API URL for debugging
console.log('API_URL:', API_URL);

// Helper function to handle API errors
const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error status
    switch (error.response.status) {
      case 400:
        return error.response.data.error || 'Invalid request data';
      case 401:
        return error.response.data.error || 'Authentication failed';
      case 403:
        return error.response.data.error || 'Access denied';
      case 404:
        return error.response.data.error || 'Resource not found';
      case 500:
        return error.response.data.error || 'Server error occurred';
      default:
        return error.response.data.error || `Server error: ${error.response.status}`;
    }
  } else if (error.request) {
    // Request was made but no response received
    return 'Network error - please check your connection';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred';
  }
};

const login = async (username: string, password: string) => {
  try {
    // Log the full URL being used for debugging
    const fullUrl = `${API_URL}/login`;
    console.log('Making login request to:', fullUrl);
    
    const response = await axios.post(fullUrl, { username, password });
    if (response.data.token) {
      localStorage.setItem('userToken', response.data.token); // Store the token
      localStorage.setItem('userLevel', response.data.level.toString()); // Store the user level
      localStorage.setItem('userPoints', response.data.points.toString()); // Store the user points
    }
    return response;
  } catch (error) {
    // Instead of throwing, we'll create a proper error object with the message
    const errorMessage = handleApiError(error);
    throw new Error(errorMessage);
  }
};

const logout = () => {
  localStorage.removeItem('userToken'); // Simulate token removal
  localStorage.removeItem('userLevel'); // Remove user level on logout
};

const isAdmin = () => {
  const userLevel = localStorage.getItem('userLevel');
  return userLevel === '10'; // Admin level is 10
};

const getCurrentUserId = () => {
  const token = localStorage.getItem('userToken');
  if (token) {
    try {
      const decoded: { id: number, username: string } = jwtDecode(token);
      return decoded.id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  return null;
};

const getCurrentUserPoints = () => {
  const userPoints = localStorage.getItem('userPoints');
  return userPoints ? parseInt(userPoints) : 0;
};

const getCurrentUserLevel = () => {
  const userLevel = localStorage.getItem('userLevel');
  return userLevel ? parseInt(userLevel) : 1; // Default to level 1
};

const getCurrentUsername = () => {
  const token = localStorage.getItem('userToken');
  if (token) {
    try {
      const decoded: { id: number, username: string } = jwtDecode(token);
      return decoded.username;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  return null;
};

const saveUserData = (token: string, level: number, points: number) => {
  localStorage.setItem('userToken', token);
  localStorage.setItem('userLevel', level.toString());
  localStorage.setItem('userPoints', points.toString());
};

const authService = {
  login,
  logout,
  isAdmin,
  getCurrentUserId,
  getCurrentUserPoints,
  getCurrentUserLevel,
  getCurrentUsername, // Add the new function
  saveUserData,
};

export default authService;