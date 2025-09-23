import axios from 'axios';

const API_URL = 'http://localhost:3000/api/tasks'; // Base URL for tasks, comments are nested under tasks

const getToken = () => {
  return localStorage.getItem('userToken');
};

const getCommentsByTaskId = (taskId: number) => {
  const token = getToken();
  return axios.get(`${API_URL}/${taskId}/comments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const createComment = (taskId: number, content: string) => {
  const token = getToken();
  return axios.post(`${API_URL}/${taskId}/comments`, { content }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const updateComment = (commentId: number, content: string) => {
  const token = getToken();
  return axios.put(`${API_URL}/comments/${commentId}`, { content }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const deleteComment = (commentId: number) => {
  const token = getToken();
  return axios.delete(`${API_URL}/comments/${commentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const commentService = {
  getCommentsByTaskId,
  createComment,
  updateComment,
  deleteComment,
};

export default commentService;
