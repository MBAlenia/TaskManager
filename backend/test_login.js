const axios = require('axios');

// Test login endpoint
const testLogin = async () => {
  try {
    console.log('Testing login endpoint...');
    const response = await axios.post('http://localhost:3000/api/auth/login', {
      username: 'admin',
      password: 'adminpassword'
    });
    console.log('Login successful:', response.data);
  } catch (error) {
    console.log('Login failed:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
};

testLogin();