#!/bin/bash

# TaskQuest Deployment Script

echo "Starting TaskQuest deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null
then
    echo "Docker is not installed. Please install Docker and try again."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker compose &> /dev/null
then
    echo "Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

# Build and start all services
echo "Building and starting services..."
docker compose up -d --build

# Wait for services to start
echo "Waiting for services to start..."
sleep 30

# Check if services are running
echo "Checking service status..."
docker compose ps

echo "Deployment completed!"
echo "Access the application at http://localhost"
echo "Backend API is available at http://localhost:3000"
echo "Default admin credentials: admin / adminpassword"