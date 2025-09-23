const axios = require('axios');

// Test the new user creation endpoint
const testUserCreation = async () => {
  try {
    // First, let's login as an admin to get a token
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      username: 'admin',
      password: 'adminpassword'
    });
    
    const token = loginResponse.data.token;
    console.log('Login successful. Token:', token);
    
    // Now let's try to create a new user
    const createUserResponse = await axios.post('http://localhost:3000/api/auth/users', {
      username: 'testuser',
      password: 'testpassword',
      level: 1
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('User created successfully:', createUserResponse.data);
    
    // Let's also test getting all users
    const getUsersResponse = await axios.get('http://localhost:3000/api/auth/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('All users:', getUsersResponse.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
};

testUserCreation();