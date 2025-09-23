const axios = require('axios');

// Test the password change functionality
const testPasswordChange = async () => {
  try {
    // First, login as the admin user
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      username: 'admin',
      password: 'adminpassword'
    });
    
    const token = loginResponse.data.token;
    console.log('Login successful. Token:', token);
    
    // Get all users to find a test user
    const usersResponse = await axios.get('http://localhost:3000/api/auth/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('All users:', usersResponse.data);
    
    // Find a test user to change password for
    const testUser = usersResponse.data.find(user => user.username === 'testuser');
    if (!testUser) {
      console.log('Test user not found');
      return;
    }
    
    console.log('Test user found:', testUser);
    
    // Change the test user's password as admin
    const changePasswordResponse = await axios.put(
      `http://localhost:3000/api/auth/users/${testUser.id}/change-password`,
      {
        newPassword: 'newpassword123'
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log('Password changed successfully:', changePasswordResponse.data);
    
    // Try to login as the test user with the new password
    const testUserLoginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      username: 'testuser',
      password: 'newpassword123'
    });
    
    console.log('Test user login successful with new password:', testUserLoginResponse.data);
    
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
};

testPasswordChange();