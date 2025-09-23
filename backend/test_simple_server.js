const axios = require('axios');

// Test the routes on the simple server
const testRoutes = async () => {
  try {
    console.log('Testing GET /api/auth/me');
    const response1 = await axios.get('http://localhost:3002/api/auth/me');
    console.log('Response:', response1.data);
  } catch (error) {
    console.log('GET /api/auth/me error:', error.response ? error.response.data : error.message);
  }

  try {
    console.log('Testing PUT /api/auth/me/password');
    const response2 = await axios.put('http://localhost:3002/api/auth/me/password');
    console.log('Response:', response2.data);
  } catch (error) {
    console.log('PUT /api/auth/me/password error:', error.response ? error.response.data : error.message);
  }
};

testRoutes();