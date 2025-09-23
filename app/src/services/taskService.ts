import axios from 'axios';

const API_URL = 'http://localhost:3000/api/tasks';

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

const getTasks = (options?: TaskFilterOptions) => {
  const token = getToken();
  return axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: options,
  });
};

const createTask = (title: string, description: string, points: number, level: number, categoryId: number | null, dueDate: string | null) => {
  const token = getToken();
  return axios.post(API_URL, { title, description, points, level, category_id: categoryId, due_date: dueDate }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const updateTask = (id: number, taskData: any) => {
  const token = getToken();
  return axios.put(`${API_URL}/${id}`, taskData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const deleteTask = (id: number) => {
  const token = getToken();
  return axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const assignTask = (id: number) => {
  const token = getToken();
  return axios.put(`${API_URL}/${id}/assign`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getAssignedTasks = (options?: TaskFilterOptions) => {
  const token = getToken();
  return axios.get(`${API_URL}/assigned`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: options,
  });
};

const unassignTask = (id: number) => {
  const token = getToken();
  return axios.put(`${API_URL}/${id}/unassign`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const completeTask = (id: number) => {
  const token = getToken();
  return axios.put(`${API_URL}/${id}/complete`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const validateTask = (id: number) => {
  const token = getToken();
  return axios.put(`${API_URL}/${id}/validate`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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
