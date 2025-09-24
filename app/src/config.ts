const config = {
  // Use relative path for API requests so they go through nginx proxy
  API_BASE_URL: process.env.REACT_APP_API_URL || '/api'
};

// Log the API base URL for debugging
console.log('API_BASE_URL:', config.API_BASE_URL);

export default config;