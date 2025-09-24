import axios from 'axios';
import config from '../config';

const API_URL = `${config.API_BASE_URL}/tasks`;

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

interface TaskFilterOptions {
  status?: string;
  category_id?: number;
  assignee_id?: number;
  sort_field?: string;
  sort_order?: string;
}

const getTasks = async (options?: TaskFilterOptions) => {
  try {
    const token = getToken();
    return await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: options,
    });
  } catch (error) {
    handleApiError(error);
  }
};

const createTask = async (title: string, description: string, points: number, level: number, categoryId: number | null, dueDate: string | null) => {
  try {
    const token = getToken();
    return await axios.post(API_URL, { title, description, points, level, category_id: categoryId, due_date: dueDate }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    handleApiError(error);
  }
};

const updateTask = async (id: number, taskData: any) => {
  try {
    const token = getToken();
    return await axios.put(`${API_URL}/${id}`, taskData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    handleApiError(error);
  }
};

const deleteTask = async (id: number) => {
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

const assignTask = async (id: number) => {
  try {
    const token = getToken();
    return await axios.put(`${API_URL}/${id}/assign`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    handleApiError(error);
  }
};

const getAssignedTasks = async (options?: TaskFilterOptions) => {
  try {
    const token = getToken();
    return await axios.get(`${API_URL}/assigned`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: options,
    });
  } catch (error) {
    handleApiError(error);
  }
};

const unassignTask = async (id: number) => {
  try {
    const token = getToken();
    return await axios.put(`${API_URL}/${id}/unassign`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    handleApiError(error);
  }
};

const completeTask = async (id: number) => {
  try {
    const token = getToken();
    return await axios.put(`${API_URL}/${id}/complete`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    handleApiError(error);
  }
};

const validateTask = async (id: number) => {
  try {
    const token = getToken();
    return await axios.put(`${API_URL}/${id}/validate`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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