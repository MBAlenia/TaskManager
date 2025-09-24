const axios = require('axios');

const testBackend = async () => {
  try {
    console.log('Testing backend connection...');
    
    const response = await axios.post('http://localhost:3000/api/auth/login', {
      username: 'admin',
      password: 'adminpassword'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
};

testBackend();