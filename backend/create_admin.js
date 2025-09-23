const axios = require('axios');

// Create an initial admin user
const createAdminUser = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/auth/register', {
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