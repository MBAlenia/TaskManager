# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.12] - 2025-09-24

### Added
- Simple SQL database initialization script for fixing missing data issues in production
- `init-database.sql` - Pure SQL script to create tables and insert default data
- Script uses `IF NOT EXISTS` clauses to safely run multiple times
- Includes verification queries to confirm successful initialization
- Added documentation for SQL script usage in README.md and PORTAINER_DEPLOYMENT.md

## [1.2.11] - 2025-09-24

### Added
- Database initialization scripts to fix missing data issues in production
- `init-database.js` - Node.js script to initialize database with required tables and default data
- `init-db.sh` - Shell script for Unix/Linux/macOS environments
- `init-db.bat` - Batch script for Windows environments
- Scripts can create tables, insert default data, and verify database structure
- Added documentation for database initialization scripts in README.md and PORTAINER_DEPLOYMENT.md

## [1.2.10] - 2025-09-24

### Added
- Production fix scripts for easier deployment and troubleshooting
- `fix-production.sh` for Unix/Linux/macOS environments
- `fix-production.bat` for Windows environments
- Scripts automate common production fixes including code updates, stack redeployment, and service checks

### Changed
- Updated PORTAINER_DEPLOYMENT.md with information about production fix scripts
- Enhanced README.md with documentation for production fix scripts

## [1.2.9] - 2025-09-24

### Fixed
- pgAdmin access issue by adding Traefik labels for proper routing
- Added proper Traefik configuration for pgAdmin service

### Added
- Traefik labels to pgAdmin service in docker-compose-prod.yml
- pgAdmin will be accessible at https://pgadmin.taskquest.academy.alenia.io

## [1.2.8] - 2025-09-24

### Fixed
- Database connection and initialization debugging
- Added detailed logging to identify "relation users does not exist" error

### Added
- Enhanced database configuration logging
- Additional debugging in user controller and user model
- Database table existence check script (check_tables.js)

### Changed
- Improved error handling and logging in database operations
- Added more detailed logging for login process

## [1.2.7] - 2025-09-24

### Fixed
- Database initialization issue in production by adding database.sql volume mount to postgres service
- "relation users does not exist" error by ensuring proper database schema initialization

### Changed
- Added ./backend/database.sql:/docker-entrypoint-initdb.d/init.sql volume mount to postgres service in docker-compose-prod.yml

## [1.2.6] - 2025-09-24

### Fixed
- Production frontend 404 error by removing hardcoded API URL from docker-compose files
- Ensured consistent environment configuration across all deployment methods

### Changed
- Removed `REACT_APP_API_URL` from docker-compose-prod.yml to prevent overriding runtime configuration
- Removed `REACT_APP_API_URL` build argument from docker-compose.yml for consistency

## [1.2.5] - 2025-09-24

### Fixed
- Production API connectivity issues by removing hardcoded API URL in Docker build
- Forced use of relative paths (`/api`) for all API calls to ensure proper nginx proxying

### Changed
- Modified frontend Dockerfile to not set `REACT_APP_API_URL` during build process
- Simplified config.ts to always use relative paths for API calls

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

## [1.0.0] - 2025-09-24

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