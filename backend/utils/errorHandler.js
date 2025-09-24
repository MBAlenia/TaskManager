// Utility functions for standardized error handling

/**
 * Create a standardized error response
 * @param {number} status - HTTP status code
 * @param {string} message - Error message
 * @param {object} details - Additional error details (optional)
 * @returns {object} Standardized error response object
 */
const createErrorResponse = (status, message, details = null) => {
  const errorResponse = {
    status,
    error: message,
    timestamp: new Date().toISOString()
  };
  
  if (details) {
    errorResponse.details = details;
  }
  
  return errorResponse;
};

/**
 * Handle database errors and convert them to appropriate HTTP errors
 * @param {object} error - Database error object
 * @returns {object} Standardized error response
 */
const handleDatabaseError = (error) => {
  console.error('Database error:', error);
  
  // Handle specific PostgreSQL error codes
  switch (error.code) {
    case '23505': // Unique violation
      return createErrorResponse(400, 'Resource already exists', { constraint: error.constraint });
    case '23503': // Foreign key violation
      return createErrorResponse(400, 'Invalid reference', { constraint: error.constraint });
    case '23502': // Not null violation
      return createErrorResponse(400, 'Required field missing', { column: error.column });
    case '23514': // Check violation
      return createErrorResponse(400, 'Data validation failed', { constraint: error.constraint });
    default:
      // Log the actual error for debugging but don't expose details to client
      return createErrorResponse(500, 'Internal server error');
  }
};

/**
 * Handle authentication errors
 * @param {object} error - Authentication error
 * @returns {object} Standardized error response
 */
const handleAuthError = (error) => {
  console.error('Authentication error:', error);
  
  if (error.name === 'JsonWebTokenError') {
    return createErrorResponse(401, 'Invalid token');
  }
  
  if (error.name === 'TokenExpiredError') {
    return createErrorResponse(401, 'Token expired');
  }
  
  return createErrorResponse(401, 'Authentication failed');
};

/**
 * Validate user input
 * @param {object} data - Input data to validate
 * @param {object} rules - Validation rules
 * @returns {object|null} Error response if validation fails, null if valid
 */
const validateInput = (data, rules) => {
  for (const field in rules) {
    const value = data[field];
    const rule = rules[field];
    
    // Required field check
    if (rule.required && (value === undefined || value === null || value === '')) {
      return createErrorResponse(400, `${field} is required`);
    }
    
    // Type check
    if (value !== undefined && rule.type) {
      if (rule.type === 'string' && typeof value !== 'string') {
        return createErrorResponse(400, `${field} must be a string`);
      }
      if (rule.type === 'number' && (typeof value !== 'number' || isNaN(value))) {
        return createErrorResponse(400, `${field} must be a number`);
      }
      if (rule.type === 'boolean' && typeof value !== 'boolean') {
        return createErrorResponse(400, `${field} must be a boolean`);
      }
    }
    
    // String length check
    if (typeof value === 'string' && rule.minLength && value.length < rule.minLength) {
      return createErrorResponse(400, `${field} must be at least ${rule.minLength} characters long`);
    }
    
    if (typeof value === 'string' && rule.maxLength && value.length > rule.maxLength) {
      return createErrorResponse(400, `${field} must be no more than ${rule.maxLength} characters long`);
    }
    
    // Number range check
    if (typeof value === 'number' && rule.min !== undefined && value < rule.min) {
      return createErrorResponse(400, `${field} must be at least ${rule.min}`);
    }
    
    if (typeof value === 'number' && rule.max !== undefined && value > rule.max) {
      return createErrorResponse(400, `${field} must be no more than ${rule.max}`);
    }
  }
  
  return null; // Valid input
};

module.exports = {
  createErrorResponse,
  handleDatabaseError,
  handleAuthError,
  validateInput
};