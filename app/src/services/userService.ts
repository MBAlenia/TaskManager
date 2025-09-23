import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

const getToken = () => {
  return localStorage.getItem('userToken');
};

const getAllUsers = () => {
  const token = getToken();
  return axios.get(`${API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const updateUser = (id: number, userData: any) => {
  const token = getToken();
  return axios.put(`${API_URL}/users/${id}`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const deleteUser = (id: number) => {
  const token = getToken();
  return axios.delete(`${API_URL}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getCurrentUser = () => {
  const token = getToken();
  return axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Updated function to change user's own password
const changePassword = (currentPassword: string, newPassword: string) => {
  const token = getToken();
  return axios.put(`${API_URL}/me/password`, {
    currentPassword,
    newPassword
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Updated function for admins to change any user's password
const changeUserPassword = (id: number, newPassword: string) => {
  const token = getToken();
  return axios.put(`${API_URL}/users/${id}/password`, {
    newPassword
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// New function to create users by admin
const createUser = (userData: any) => {
  const token = getToken();
  return axios.post(`${API_URL}/users`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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