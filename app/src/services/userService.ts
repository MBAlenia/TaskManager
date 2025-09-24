import axios from 'axios';
import config from '../config';

// Create an axios instance with default configuration
const apiClient = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 10000,
});

// Helper function to handle API errors
const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error status
    switch (error.response.status) {
      case 400:
        throw new Error(error.response.data.error || 'Invalid request data');
      case 401:
        throw new Error(error.response.data.error || 'Authentication failed');
      case 403:
        throw new Error(error.response.data.error || 'Access denied');
      case 404:
        throw new Error(error.response.data.error || 'Resource not found');
      case 500:
        throw new Error(error.response.data.error || 'Server error occurred');
      default:
        throw new Error(error.response.data.error || `Server error: ${error.response.status}`);
    }
  } else if (error.request) {
    // Request was made but no response received
    throw new Error('Network error - please check your connection');
  } else {
    // Something else happened
    throw new Error('An unexpected error occurred');
  }
};

const getToken = () => {
  return localStorage.getItem('userToken');
};

// Add a request interceptor to add the authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const getAllUsers = async () => {
  try {
    return await apiClient.get('/auth/users');
  } catch (error) {
    handleApiError(error);
  }
};

const updateUser = async (id: number, userData: any) => {
  try {
    return await apiClient.put(`/auth/users/${id}`, userData);
  } catch (error) {
    handleApiError(error);
  }
};

const deleteUser = async (id: number) => {
  try {
    return await apiClient.delete(`/auth/users/${id}`);
  } catch (error) {
    handleApiError(error);
  }
};

const getCurrentUser = async () => {
  try {
    return await apiClient.get('/auth/me');
  } catch (error) {
    handleApiError(error);
  }
};

// Updated function to change user's own password
const changePassword = async (currentPassword: string, newPassword: string) => {
  try {
    return await apiClient.put('/auth/me/password', {
      currentPassword,
      newPassword
    });
  } catch (error) {
    handleApiError(error);
  }
};

// Updated function for admins to change any user's password
const changeUserPassword = async (id: number, newPassword: string) => {
  try {
    return await apiClient.put(`/auth/users/${id}/password`, {
      newPassword
    });
  } catch (error) {
    handleApiError(error);
  }
};

// New function to create users by admin
const createUser = async (userData: any) => {
  try {
    return await apiClient.post('/auth/users', userData);
  } catch (error) {
    handleApiError(error);
  }
};

const userService = {
  getAllUsers,
  updateUser,
  deleteUser,
  getCurrentUser,
  changePassword, // Export the new function
  changeUserPassword, // Export the new function
  createUser, // Export the new function
};

export default userService;