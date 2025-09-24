// Determine if we're running in a Docker container
const isDocker = typeof process.env.REACT_APP_DOCKER !== 'undefined' || 
                 (typeof window !== 'undefined' && window.location.hostname === 'localhost');

// Use relative path for API requests when running in Docker/local environment
// Use absolute URL for API requests when running in development with external backend
const config = {
  API_BASE_URL: isDocker ? '/api' : (process.env.REACT_APP_API_URL || '/api')
};

// Log the API base URL for debugging
console.log('API_BASE_URL:', config.API_BASE_URL);
console.log('Process env REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('Window location origin:', window.location.origin);
console.log('Is Docker environment:', isDocker);

// Enhanced debugging for API connectivity
if (typeof window !== 'undefined') {
  console.log('Full window location:', window.location.href);
  console.log('Protocol:', window.location.protocol);
  console.log('Host:', window.location.host);
}

export default config;