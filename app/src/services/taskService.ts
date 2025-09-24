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

interface TaskFilterOptions {
  status?: string;
  category_id?: number;
  assignee_id?: number;
  sort_field?: string;
  sort_order?: string;
}

const getTasks = async (options?: TaskFilterOptions) => {
  try {
    return await apiClient.get('/tasks', {
      params: options,
    });
  } catch (error) {
    handleApiError(error);
  }
};

const createTask = async (title: string, description: string, points: number, level: number, categoryId: number | null, dueDate: string | null) => {
  try {
    return await apiClient.post('/tasks', { title, description, points, level, category_id: categoryId, due_date: dueDate });
  } catch (error) {
    handleApiError(error);
  }
};

const updateTask = async (id: number, taskData: any) => {
  try {
    return await apiClient.put(`/tasks/${id}`, taskData);
  } catch (error) {
    handleApiError(error);
  }
};

const deleteTask = async (id: number) => {
  try {
    return await apiClient.delete(`/tasks/${id}`);
  } catch (error) {
    handleApiError(error);
  }
};

const assignTask = async (id: number) => {
  try {
    return await apiClient.put(`/tasks/${id}/assign`, {});
  } catch (error) {
    handleApiError(error);
  }
};

const getAssignedTasks = async (options?: TaskFilterOptions) => {
  try {
    return await apiClient.get('/tasks/assigned', {
      params: options,
    });
  } catch (error) {
    handleApiError(error);
  }
};

const unassignTask = async (id: number) => {
  try {
    return await apiClient.put(`/tasks/${id}/unassign`, {});
  } catch (error) {
    handleApiError(error);
  }
};

const completeTask = async (id: number) => {
  try {
    return await apiClient.put(`/tasks/${id}/complete`, {});
  } catch (error) {
    handleApiError(error);
  }
};

const validateTask = async (id: number) => {
  try {
    return await apiClient.put(`/tasks/${id}/validate`, {});
  } catch (error) {
    handleApiError(error);
  }
};

const taskService = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  assignTask,
  getAssignedTasks,
  unassignTask,
  completeTask,
  validateTask,
};

export default taskService;