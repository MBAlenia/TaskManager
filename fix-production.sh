#!/bin/bash

# TaskQuest Production Fix Script
# This script helps fix common production issues with TaskQuest deployment via Portainer

echo "=============================================="
echo " TaskQuest Production Fix Script"
echo "=============================================="
echo

# Check if running on Windows (Git Bash or WSL)
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    echo "Warning: This script is intended for Linux/Unix environments."
    echo "For Windows, please use fix-production.bat instead."
    echo
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "Checking prerequisites..."
if ! command_exists docker; then
    echo "Error: Docker is not installed or not in PATH."
    echo "Please install Docker and try again."
    exit 1
fi

if ! command_exists git; then
    echo "Error: Git is not installed or not in PATH."
    echo "Please install Git and try again."
    exit 1
fi

echo "✓ Docker: $(docker --version)"
echo "✓ Git: $(git --version)"
echo

# Ensure we're in the right directory
if [ ! -f "docker-compose-prod.yml" ]; then
    echo "Error: docker-compose-prod.yml not found."
    echo "Please run this script from the TaskQuest root directory."
    exit 1
fi

echo "✓ Running from TaskQuest root directory"
echo

# Pull latest changes
echo "Pulling latest changes from Git repository..."
git pull origin main
if [ $? -ne 0 ]; then
    echo "Warning: Failed to pull latest changes. Continuing with current version."
else
    echo "✓ Successfully pulled latest changes"
fi
echo

# Check if we're using Portainer
echo "Are you deploying via Portainer? (y/N): "
read -p "" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Please follow these steps in Portainer:"
    echo "1. Go to Stacks → taskquest"
    echo "2. Click 'Update the stack'"
    echo "3. Select 'Pull and redeploy' option"
    echo "4. Click 'Update'"
    echo
    echo "After updating, check the logs of each container for any errors."
    echo
else
    # Direct Docker deployment
    echo "Stopping existing services..."
    docker compose -f docker-compose-prod.yml down
    echo

    echo "Removing unused volumes (optional)..."
    echo "Do you want to remove volumes and start fresh? This will delete all data! (y/N): "
    read -p "" -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Removing volumes..."
        docker volume prune -f
        echo "✓ Volumes removed"
    fi
    echo

    echo "Building and starting services..."
    docker compose -f docker-compose-prod.yml up -d --build
    echo

    echo "Waiting for services to start (30 seconds)..."
    sleep 30
    echo

    echo "Checking service status..."
    docker compose -f docker-compose-prod.yml ps
    echo

    echo "Checking logs for errors..."
    echo "=== Backend Logs ==="
    docker logs taskquest-backend | tail -20
    echo
    echo "=== Frontend Logs ==="
    docker logs taskquest-frontend | tail -20
    echo
    echo "=== Database Logs ==="
    docker logs taskquest-db | tail -20
    echo
fi

# Common fixes
echo "Applying common fixes..."
echo

# Fix database initialization if needed
echo "Checking database initialization..."
if docker exec taskquest-db psql -U postgres -d taskquest -c "SELECT COUNT(*) FROM users;" >/dev/null 2>&1; then
    echo "✓ Database tables exist"
else
    echo "⚠ Database tables may be missing. Attempting to reinitialize..."
    echo "   Please check if the database initialization script was properly mounted."
fi
echo

# Verify API connectivity
echo "Checking API connectivity..."
if command_exists curl; then
    echo "Testing backend API endpoint..."
    curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3000/api/health || echo "API not accessible locally"
else
    echo "curl not available, skipping API test"
fi
echo

# Final instructions
echo "=============================================="
echo " Fix Process Complete"
echo "=============================================="
echo
echo "Next steps:"
echo "1. Check Portainer for any container errors"
echo "2. Verify the application is accessible at https://taskquest.academy.alenia.io"
echo "3. Test login with admin/adminpassword"
echo "4. Verify pgAdmin is accessible at https://pgadmin.taskquest.academy.alenia.io"
echo
echo "If issues persist:"
echo "- Check container logs in Portainer"
echo "- Verify environment variables are correctly set"
echo "- Ensure DNS records point to the correct server"
echo "- Confirm Traefik is properly configured"
echo
echo "For detailed troubleshooting, refer to PORTAINER_DEPLOYMENT.md"