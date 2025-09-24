const axios = require('axios');

const testApi = async () => {
  try {
    console.log('Testing API connection...');
    
    // Test direct backend connection
    console.log('1. Testing direct backend connection...');
    const directResponse = await axios.post('http://backend:3000/api/auth/login', {
      username: 'admin',
      password: 'adminpassword'
    });
    console.log('Direct connection successful:', directResponse.status);
    
    // Test through nginx proxy (this is what the frontend does)
    console.log('2. Testing nginx proxy connection...');
    const proxyResponse = await axios.post('/api/auth/login', {
      username: 'admin',
      password: 'adminpassword'
    });
    console.log('Proxy connection successful:', proxyResponse.status);
    
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
};

testApi();