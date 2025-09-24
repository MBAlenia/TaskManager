const axios = require('axios');

// Create an initial admin user
const createAdminUser = async () => {
  try {
    // Use the backend service name in Docker environment, fallback to localhost for local development
    const apiUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    const response = await axios.post(`${apiUrl}/api/auth/register`, {
      username: 'admin',
      password: 'adminpassword',
      level: 10
    });
    
    console.log('Admin user created successfully:', response.data);
  } catch (error) {
    console.error('Error creating admin user:', error.response ? error.response.data : error.message);
  }
};

createAdminUser();