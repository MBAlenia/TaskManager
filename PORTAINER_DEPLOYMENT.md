# Deploying TaskQuest with Portainer

This guide explains how to deploy the TaskQuest application using Portainer.

## Prerequisites

1. Portainer instance running
2. Access to Portainer UI
3. Docker environment connected to Portainer

## Deployment Steps

### 1. Create Environment Variables

In Portainer, go to:
1. **Environment** → Select your environment
2. **Configurations** → **Environment variables**
3. Create the following variables:
   - `POSTGRES_USER_PROD`: postgres
   - `POSTGRES_PASSWORD_PROD`: [your_secure_password]
   - `POSTGRES_DB_PROD`: taskquest
   - `JWT_SECRET_PROD`: [your_secure_jwt_secret]
   - `PGADMIN_DEFAULT_EMAIL`: [your_pgadmin_email] (optional, defaults to admin@taskquest.com)
   - `PGADMIN_DEFAULT_PASSWORD`: [your_pgadmin_password] (optional, defaults to adminpassword)

### 2. Deploy Stack

1. In Portainer, go to **Stacks** → **Add stack**
2. Choose **Repository** option
3. Fill in the following details:
   - **Name**: taskquest
   - **Repository URL**: [your repository URL]
   - **Compose path**: docker-compose-prod.yml
   - **Environment variables**: Select the variables created in step 1

4. Click **Deploy the stack**

### 3. Configure Traefik (if using)

If you're using Traefik for reverse proxy (as configured in the docker-compose-prod.yml):

1. Update the domain names in the labels section of docker-compose-prod.yml:
   - Replace `taskquest.yourdomain.com` with your frontend domain
   - Replace `taskquest-api.yourdomain.com` with your backend API domain
   - Replace `pgadmin.taskquest.yourdomain.com` with your pgAdmin domain

2. For alenia.io deployment, the domains are already configured as:
   - Frontend: `taskquest.academy.alenia.io`
   - Backend API: `taskquest-api.academy.alenia.io`
   - pgAdmin: `pgadmin.taskquest.academy.alenia.io`

3. Ensure your DNS records point to the server running Portainer/Traefik

### 4. Initial Setup

After deployment:

1. Access the application through your configured domain
2. Use the default admin credentials:
   - Username: admin
   - Password: adminpassword
3. Change the admin password immediately after first login

4. Access pgAdmin:
   - URL: https://pgadmin.taskquest.academy.alenia.io (if using Traefik) or http://[your-server-ip]:5050
   - Default credentials: admin@taskquest.com / adminpassword
   - Change these credentials after first login

## Updating the Application

To update the application:

1. In Portainer, go to **Stacks** → **taskquest**
2. Click **Update the stack**
3. If you have new code, update the repository first
4. Click **Pull and redeploy** to fetch the latest code and restart services

## Production Fix Scripts

To help with common production issues, we've provided fix scripts:

- **Windows**: `fix-production.bat`
- **Linux/Unix**: `fix-production.sh`

These scripts will:
1. Pull the latest code from the repository
2. Update the stack in Portainer
3. Check service status and logs
4. Apply common fixes for database and connectivity issues

To use these scripts:
1. Ensure you're in the TaskQuest root directory
2. Run the appropriate script for your OS
3. Follow the prompts to complete the fix process

## Database Initialization Scripts

If you encounter database issues or need to reinitialize the database with default data:

### SQL Script
For direct SQL execution, use `init-database.sql`:
```sql
-- Run this directly on your PostgreSQL database
\i init-database.sql
```

### Programmatic Scripts
Alternatively, you can use the programmatic scripts:

- **Windows**: `init-db.bat`
- **Linux/Unix**: `init-db.sh`
- **Direct Node.js**: `node init-database.js`

These scripts will:
1. Create all required tables if they don't exist
2. Insert the default admin user if missing
3. Add default categories if none exist
4. Verify the database structure

To use these scripts:
1. Ensure you're in the TaskQuest root directory
2. Set the required environment variables (DB_HOST, DB_NAME, DB_USER, DB_PASSWORD)
3. Run the appropriate script for your OS

Alternatively, you can execute the script directly with Node.js:
```bash
node init-database.js
```

## Backup and Recovery

### Database Backup

The PostgreSQL data is stored in a Docker volume. To backup:

1. In Portainer, go to **Volumes**
2. Find the volume named `taskquest_postgres_data`
3. Create a backup using Docker commands or Portainer's backup feature

### Database Recovery

1. Stop the stack
2. Restore the volume from backup
3. Restart the stack

## Troubleshooting

### Common Issues

1. **Application not accessible**: Check Traefik configuration and DNS settings
2. **Database connection failed**: Verify environment variables and network connectivity
3. **Permission denied errors**: Check file permissions in containers
4. **Network errors**: Ensure services can communicate through Docker network
5. **Authentication errors**: Verify JWT_SECRET is properly configured
6. **pgAdmin not accessible**: Check if port 5050 is available and not blocked by firewall
7. **Login issues**: Check that the frontend is correctly configured to communicate with the backend
8. **404 errors**: Verify that the frontend files are properly built and served by nginx
9. **Database table errors**: Verify that the database initialization script is properly mounted and executed

### Connecting pgAdmin to PostgreSQL

To connect pgAdmin to the PostgreSQL database:

1. Login to pgAdmin at https://pgadmin.taskquest.academy.alenia.io (if using Traefik) or http://[your-server-ip]:5050
2. Click "Add New Server"
3. In the "General" tab:
   - Name: TaskQuest DB
4. In the "Connection" tab:
   - Host name/address: postgres (or taskquest-db in production)
   - Port: 5432
   - Maintenance database: taskquest
   - Username: postgres (or your POSTGRES_USER_PROD value)
   - Password: [your POSTGRES_PASSWORD_PROD value]
5. Click "Save"

### Logs

Check logs in Portainer:
1. Go to **Containers**
2. Find the relevant container (taskquest-frontend, taskquest-backend, taskquest-db, or taskquest-pgadmin)
3. Click on the container name
4. View logs in the **Logs** tab

## Security Considerations

1. Change default passwords immediately after deployment
2. Use strong, unique passwords for production
3. Use a strong JWT secret for token signing
4. Change pgAdmin default credentials after first login
5. Restrict access to pgAdmin by using firewall rules to limit access to specific IPs
6. Regularly update the application and base images
7. Restrict access to Portainer UI with proper authentication
8. Use HTTPS in production (Traefik configuration includes TLS settings)

## Version Information

Current version: 1.2.11

For version history, see [CHANGELOG.md](CHANGELOG.md)

### Environment Configuration

The application now uses relative paths (`/api`) for all API calls, which are properly proxied by nginx in Docker environments. This ensures consistent connectivity both in local development and production deployments.