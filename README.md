# TaskQuest - Gamified Task Management Application

TaskQuest is a gamified task management application that allows users to create, assign, and complete tasks while earning points and leveling up.

## Features

- User authentication (registration and login)
- Task creation, assignment, and management
- Points and level system
- Task categories
- Comments on tasks
- Admin panel for user management
- Password change functionality for users and admins
- User profile management

## Prerequisites

- Docker and Docker Compose installed
- Git (for cloning the repository)

## Quick Start with Docker

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd taskquest
   ```

2. Build and start all services:
   ```bash
   docker compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:3000

4. Default admin credentials:
   - Username: admin
   - Password: adminpassword

## Troubleshooting Common Issues

### Login Problems
If you encounter login issues:
1. Verify you're using the correct credentials (admin/adminpassword)
2. If you get a 401 Unauthorized error, reset the admin password:
   ```bash
   docker compose exec backend node reset_admin_password.js
   ```
3. Check backend logs for authentication errors:
   ```bash
   docker compose logs backend
   ```

### Database Connection Issues
If the application can't connect to the database:
1. Ensure the database container is running:
   ```bash
   docker compose ps
   ```
2. Check database logs for connection errors:
   ```bash
   docker compose logs db
   ```
3. Verify environment variables in docker-compose.yml match database configuration

### Network and Proxy Issues
If you encounter network errors during development:
1. Ensure both frontend and backend servers are running
2. Check that the proxy configuration is correctly set up
3. Verify API requests are being properly forwarded to the backend

### Deployment Scripts

For easier deployment, we provide scripts for both Unix-like systems and Windows:

- **Unix/Linux/macOS**: Run `./deploy.sh`
- **Windows**: Run `deploy.bat`

These scripts will automatically build and start all services, and provide status information once deployment is complete.

## Production Deployment with Portainer

For production deployment using Portainer:

1. Use the `docker-compose-prod.yml` file
2. Configure environment variables in Portainer
3. Follow the detailed guide in [PORTAINER_DEPLOYMENT.md](PORTAINER_DEPLOYMENT.md)

## Services Overview

The application consists of three main services:

1. **Database (PostgreSQL)**: Stores all application data
2. **Backend (Node.js/Express)**: REST API for the application
3. **Frontend (React)**: User interface

## Environment Variables

The application can be configured using environment variables. When using Docker, these are set in the `docker-compose.yml` file.

### Backend Environment Variables

- `DB_HOST`: Database host (default: localhost)
- `DB_PORT`: Database port (default: 5432)
- `DB_NAME`: Database name (default: taskquest)
- `DB_USER`: Database user (default: postgres)
- `DB_PASSWORD`: Database password (default: password)
- `JWT_SECRET`: Secret key for JWT token signing (default: secret)

## Database Setup

The database schema is automatically applied when the PostgreSQL container starts, using the `database.sql` file.

To manually run the database setup:
```bash
docker compose exec backend npm run db:setup
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info
- `PUT /api/auth/me/password` - Change current user's password

### User Management (Admin only)
- `GET /api/auth/users` - Get all users
- `POST /api/auth/users` - Create a new user
- `PUT /api/auth/users/:userId/password` - Change a user's password
- `PUT /api/auth/users/:userId` - Update a user
- `DELETE /api/auth/users/:userId` - Delete a user

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `PUT /api/tasks/:id/assign` - Assign a task to current user
- `PUT /api/tasks/:id/unassign` - Unassign a task
- `PUT /api/tasks/:id/complete` - Mark a task as complete
- `PUT /api/tasks/:id/validate` - Validate a completed task

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category

### Comments
- `GET /api/tasks/:taskId/comments` - Get comments for a task
- `POST /api/tasks/:taskId/comments` - Add a comment to a task

## Development

### Running Locally

1. Start the database:
   ```bash
   docker compose up -d db
   ```

2. Install backend dependencies and start the server:
   ```bash
   cd backend
   npm install
   npm start
   ```

3. Install frontend dependencies and start the development server:
   ```bash
   cd app
   npm install
   npm start
   ```

### Building for Production

To build the frontend for production:
```bash
cd app
npm run build
```

## Versioning

Current version: 1.1.0

## License

ISC