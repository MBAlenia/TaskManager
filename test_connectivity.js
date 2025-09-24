// Simple connectivity test script
const testConnectivity = async () => {
  console.log('Testing connectivity to backend...');
  
  // Test if we can reach the backend API
  try {
    const response = await fetch('/api', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      console.log('✅ Successfully connected to backend API');
      const data = await response.text();
      console.log('Response:', data);
    } else {
      console.log('❌ Failed to connect to backend API');
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
    }
  } catch (error) {
    console.log('❌ Network error when connecting to backend:');
    console.log('Error:', error.message);
  }
  
  // Test if we can reach the login endpoint specifically
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'test',
        password: 'test'
      })
    });
    
    console.log('Login endpoint test:');
    console.log('Status:', response.status);
    const data = await response.text();
    console.log('Response:', data);
  } catch (error) {
    console.log('❌ Network error when connecting to login endpoint:');
    console.log('Error:', error.message);
  }
};

// Run the test
testConnectivity();