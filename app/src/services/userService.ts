import axios from 'axios';
import config from '../config';

const API_URL = `${config.API_BASE_URL}/auth`;

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

const getAllUsers = async () => {
  try {
    const token = getToken();
    return await axios.get(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    handleApiError(error);
  }
};

const updateUser = async (id: number, userData: any) => {
  try {
    const token = getToken();
    return await axios.put(`${API_URL}/users/${id}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    handleApiError(error);
  }
};

const deleteUser = async (id: number) => {
  try {
    const token = getToken();
    return await axios.delete(`${API_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    handleApiError(error);
  }
};

const getCurrentUser = async () => {
  try {
    const token = getToken();
    return await axios.get(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    handleApiError(error);
  }
};

// Updated function to change user's own password
const changePassword = async (currentPassword: string, newPassword: string) => {
  try {
    const token = getToken();
    return await axios.put(`${API_URL}/me/password`, {
      currentPassword,
      newPassword
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    handleApiError(error);
  }
};

// Updated function for admins to change any user's password
const changeUserPassword = async (id: number, newPassword: string) => {
  try {
    const token = getToken();
    return await axios.put(`${API_URL}/users/${id}/password`, {
      newPassword
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    handleApiError(error);
  }
};

// New function to create users by admin
const createUser = async (userData: any) => {
  try {
    const token = getToken();
    return await axios.post(`${API_URL}/users`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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