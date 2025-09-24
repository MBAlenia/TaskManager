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

const getAllCategories = async () => {
  try {
    return await apiClient.get('/categories');
  } catch (error) {
    handleApiError(error);
  }
};

const createCategory = async (name: string, parentId: number | null = null) => {
  try {
    return await apiClient.post('/categories', { name, parent_id: parentId });
  } catch (error) {
    handleApiError(error);
  }
};

const updateCategory = async (id: number, name: string, parentId: number | null = null) => {
  try {
    return await apiClient.put(`/categories/${id}`, { name, parent_id: parentId });
  } catch (error) {
    handleApiError(error);
  }
};

const deleteCategory = async (id: number) => {
  try {
    return await apiClient.delete(`/categories/${id}`);
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