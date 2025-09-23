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

const userService = {
  getAllUsers,
  updateUser,
  deleteUser,
  getCurrentUser,
};

export default userService;
