const axios = require('axios');

// Test the password change endpoint directly
const testPasswordChangeEndpoint = async () => {
  try {
    // First, login as the admin user to get a valid token
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      username: 'admin',
      password: 'adminpassword' // Use the original password
    });
    
    const token = loginResponse.data.token;
    console.log('Login successful. Token:', token);
    
    // Test changing the admin's own password
    const changePasswordResponse = await axios.put(
      'http://localhost:3000/api/auth/me/password',
      {
        currentPassword: 'adminpassword',
        newPassword: 'newadminpassword' // Change to new password
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

testPasswordChangeEndpoint();