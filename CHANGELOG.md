# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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