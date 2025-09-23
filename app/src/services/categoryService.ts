import axios from 'axios';

const API_URL = 'http://localhost:3000/api/categories';

const getToken = () => {
  return localStorage.getItem('userToken');
};

const getAllCategories = () => {
  const token = getToken();
  return axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const createCategory = (name: string, parentId: number | null = null) => {
  const token = getToken();
  return axios.post(API_URL, { name, parent_id: parentId }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const updateCategory = (id: number, name: string, parentId: number | null = null) => {
  const token = getToken();
  return axios.put(`${API_URL}/${id}`, { name, parent_id: parentId }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const deleteCategory = (id: number) => {
  const token = getToken();
  return axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const categoryService = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryService;
