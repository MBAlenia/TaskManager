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

2. For alenia.io deployment, the domains are already configured as:
   - Frontend: `taskquest.academy.alenia.io`
   - Backend API: `taskquest-api.academy.alenia.io`

3. Ensure your DNS records point to the server running Portainer/Traefik

### 4. Initial Setup

After deployment:

1. Access the application through your configured domain
2. Use the default admin credentials:
   - Username: admin
   - Password: adminpassword
3. Change the admin password immediately after first login

## Updating the Application

To update the application:

1. In Portainer, go to **Stacks** → **taskquest**
2. Click **Update the stack**
3. If you have new code, update the repository first
4. Click **Pull and redeploy** to fetch the latest code and restart services

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

### Logs

Check logs in Portainer:
1. Go to **Containers**
2. Find the relevant container (taskquest-frontend, taskquest-backend, or taskquest-db)
3. Click on the container name
4. View logs in the **Logs** tab

## Security Considerations

1. Change default passwords immediately after deployment
2. Use strong, unique passwords for production
3. Regularly update the application and base images
4. Restrict access to Portainer UI with proper authentication
5. Use HTTPS in production (Traefik configuration includes TLS settings)