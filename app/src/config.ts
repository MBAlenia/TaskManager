const config = {
  // Use relative path for API requests so they go through nginx proxy
  API_BASE_URL: process.env.REACT_APP_API_URL || '/api'
};

export default config;