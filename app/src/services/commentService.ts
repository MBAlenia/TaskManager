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

const getCommentsByTaskId = async (taskId: number) => {
  try {
    return await apiClient.get(`/tasks/${taskId}/comments`);
  } catch (error) {
    handleApiError(error);
  }
};

const createComment = async (taskId: number, content: string) => {
  try {
    return await apiClient.post(`/tasks/${taskId}/comments`, { content });
  } catch (error) {
    handleApiError(error);
  }
};

const updateComment = async (commentId: number, content: string) => {
  try {
    return await apiClient.put(`/tasks/comments/${commentId}`, { content });
  } catch (error) {
    handleApiError(error);
  }
};

const deleteComment = async (commentId: number) => {
  try {
    return await apiClient.delete(`/tasks/comments/${commentId}`);
  } catch (error) {
    handleApiError(error);
  }
};

const commentService = {
  getCommentsByTaskId,
  createComment,
  updateComment,
  deleteComment,
};

export default commentService;