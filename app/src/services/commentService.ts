import axios from 'axios';
import config from '../config';

const API_URL = `${config.API_BASE_URL}/tasks`; // Base URL for tasks, comments are nested under tasks

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

const getCommentsByTaskId = async (taskId: number) => {
  try {
    const token = getToken();
    return await axios.get(`${API_URL}/${taskId}/comments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    handleApiError(error);
  }
};

const createComment = async (taskId: number, content: string) => {
  try {
    const token = getToken();
    return await axios.post(`${API_URL}/${taskId}/comments`, { content }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    handleApiError(error);
  }
};

const updateComment = async (commentId: number, content: string) => {
  try {
    const token = getToken();
    return await axios.put(`${API_URL}/comments/${commentId}`, { content }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    handleApiError(error);
  }
};

const deleteComment = async (commentId: number) => {
  try {
    const token = getToken();
    return await axios.delete(`${API_URL}/comments/${commentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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