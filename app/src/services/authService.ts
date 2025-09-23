import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:3000/api/auth';

const login = (username: string, password: string) => {
  return axios.post(`${API_URL}/login`, { username, password }).then(response => {
    if (response.data.token) {
      localStorage.setItem('userToken', response.data.token);
      localStorage.setItem('userLevel', response.data.level.toString());
      localStorage.setItem('userPoints', response.data.points.toString());
    }
    return response;
  });
};

const logout = () => {
  localStorage.removeItem('userToken'); // Simulate token removal
  localStorage.removeItem('userLevel'); // Remove user level on logout
};

const isAdmin = () => {
  const userLevel = localStorage.getItem('userLevel');
  return userLevel === '10'; // Admin level is 10
};

const getCurrentUserId = () => {
  const token = localStorage.getItem('userToken');
  if (token) {
    try {
      const decoded: { id: number } = jwtDecode(token);
      return decoded.id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  return null;
};

const getCurrentUserPoints = () => {
  const userPoints = localStorage.getItem('userPoints');
  return userPoints ? parseInt(userPoints) : 0;
};

const getCurrentUserLevel = () => {
  const userLevel = localStorage.getItem('userLevel');
  return userLevel ? parseInt(userLevel) : 1; // Default to level 1
};

const saveUserData = (token: string, level: number, points: number) => {
  localStorage.setItem('userToken', token);
  localStorage.setItem('userLevel', level.toString());
  localStorage.setItem('userPoints', points.toString());
};

const authService = {
  login,
  logout,
  isAdmin,
  getCurrentUserId,
  getCurrentUserPoints,
  getCurrentUserLevel,
  saveUserData,
};

export default authService;
