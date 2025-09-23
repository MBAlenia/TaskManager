const axios = require('axios');

// Test the admin password change endpoint
const testAdminPasswordChange = async () => {
  try {
    // First, login as the admin user to get a valid token
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      username: 'admin',
      password: 'adminpassword' // Use the original password
    });
    
    const token = loginResponse.data.token;
    console.log('Login successful. Token:', token);
    
    // Test changing another user's password (assuming user with ID 1 exists)
    const changePasswordResponse = await axios.put(
      'http://localhost:3000/api/auth/users/1/password',
      {
        newPassword: 'newuserpassword'
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Password changed successfully:', changePasswordResponse.data);
    
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
};

testAdminPasswordChange();