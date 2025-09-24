const config = {
  // Use relative path for API requests so they go through nginx proxy
  // In production, this should be set to the external API URL
  // In development or when not set, default to '/api' to use nginx proxy
  API_BASE_URL: process.env.REACT_APP_API_URL || '/api'
};

// Log the API base URL for debugging
console.log('API_BASE_URL:', config.API_BASE_URL);
console.log('Process env REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('Window location origin:', window.location.origin);

export default config;