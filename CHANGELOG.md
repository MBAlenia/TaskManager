# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.4] - 2025-09-24

### Changed
- Updated version numbers in package.json files to ensure proper version tracking
- Enhanced version display on login page to show current version for deployment verification

### Fixed
- Version synchronization across all package.json files

## [1.2.3] - 2025-09-24

### Fixed
- CORS error when accessing https://taskquest.academy.alenia.io/
- Proper API URL configuration for production deployment
- Ensured frontend uses relative path '/api' when REACT_APP_API_URL is not set
- Fixed network connectivity issues in production Docker deployments

### Changed
- Added more debugging logs to identify API URL configuration issues
- Enhanced config.ts to log environment variables and window location
- Improved frontend API call handling to work with nginx proxy
- Added version display on login page for better deployment identification
- Enhanced environment detection to properly configure API connections in Docker environments
- Updated docker-compose files to include REACT_APP_DOCKER environment variable for proper environment detection

### Added
- REACT_APP_DOCKER environment variable to explicitly identify Docker environments
- Documentation for environment configuration in PORTAINER_DEPLOYMENT.md

## [1.2.2] - 2025-09-24

### Fixed
- Nginx conflicting server name warning during startup
- Proper removal of default nginx configuration files
- Nginx configuration to prevent conflicts with default server configurations

### Changed
- Updated nginx.conf to remove inclusion of default configurations
- Enhanced Dockerfile to properly remove default nginx configuration files

## [1.2.1] - 2025-09-24

### Fixed
- 404 Not Found error when accessing https://taskquest.academy.alenia.io/
- Environment variable passing during React app build process
- Proper API URL configuration for production deployment

### Changed
- Added build arguments to Dockerfile to pass environment variables during build
- Updated docker-compose files to pass REACT_APP_API_URL as build argument
- Added debugging logs to verify API URL usage

## [1.2.0] - 2025-09-24

### Added
- pgAdmin service for database management in both development and production environments
- Documentation for pgAdmin usage and configuration
- Environment variables for pgAdmin configuration

### Changed
- Updated docker-compose files to include pgAdmin service
- Enhanced documentation with pgAdmin information

## [1.1.1] - 2025-09-24

### Fixed
- Unexpected connection error when accessing https://taskquest.academy.alenia.io/
- Hardcoded JWT secret in backend controllers and middleware
- Nginx proxy configuration issues
- Error handling in LoginPage component
- Create admin script to work properly in Docker environment
- Environment variable configuration for production deployment

### Changed
- Added JWT_SECRET environment variable support for secure token signing
- Updated docker-compose files with proper environment variables
- Enhanced documentation with JWT_SECRET information
- Added BACKEND_URL environment variable for service communication

## [1.1.0] - 2025-09-24

### Added
- Password change functionality for users and admins
- User profile page with password change capability
- Docker deployment configuration with proper networking
- Production deployment guide for Portainer
- Standardized error handling utilities
- Proxy configuration for development environment

### Changed
- Improved login page to only show application name and login fields
- Enhanced error handling with more specific error messages
- Updated API URL configuration to work with nginx proxy
- Refactored frontend service files to handle API errors consistently
- Improved proxy configuration for both development and production environments

### Fixed
- Network error during login by configuring proper API proxy
- Route conflicts in Express server
- TypeScript errors in frontend components
- Login page header issue
- 401 Unauthorized error during login
- Database connection issues in Docker environment

## [1.0.0] - 2025-09-23

### Added
- Full task management functionality
- User authentication and authorization
- Points and level system
- Task categories
- Comments on tasks
- Admin panel for user management
- Password change functionality for users and admins
- Docker deployment configuration
- Database schema with users, categories, tasks, and comments tables

### Changed
- Updated database configuration to support environment variables
- Improved login page to only show application name and login fields
- Enhanced security with proper password hashing

### Fixed
- Route conflicts in Express server
- TypeScript errors in frontend components
- Login page header issue
- 401 Unauthorized error during login

## [0.1.0] - 2025-09-20

### Added
- Initial project structure
- Basic task management features
- User registration and login
- React frontend with TypeScript
- Node.js backend with Express
- PostgreSQL database integration