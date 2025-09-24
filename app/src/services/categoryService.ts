import axios from 'axios';
import config from '../config';

const API_URL = `${config.API_BASE_URL}/categories`;

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

const getAllCategories = async () => {
  try {
    const token = getToken();
    return await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    handleApiError(error);
  }
};

const createCategory = async (name: string, parentId: number | null = null) => {
  try {
    const token = getToken();
    return await axios.post(API_URL, { name, parent_id: parentId }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    handleApiError(error);
  }
};

const updateCategory = async (id: number, name: string, parentId: number | null = null) => {
  try {
    const token = getToken();
    return await axios.put(`${API_URL}/${id}`, { name, parent_id: parentId }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    handleApiError(error);
  }
};

const deleteCategory = async (id: number) => {
  try {
    const token = getToken();
    return await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    handleApiError(error);
  }
};

const categoryService = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryService;