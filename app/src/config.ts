// Force using relative path for API requests in all environments
// This ensures proper connectivity in both local development and production Docker deployments
const config = {
  API_BASE_URL: '/api'
};

// Log the API base URL for debugging
console.log('API_BASE_URL:', config.API_BASE_URL);
console.log('Process env REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('Window location origin:', window.location.origin);

// Enhanced debugging for API connectivity
if (typeof window !== 'undefined') {
  console.log('Full window location:', window.location.href);
  console.log('Protocol:', window.location.protocol);
  console.log('Host:', window.location.host);
}

export default config;