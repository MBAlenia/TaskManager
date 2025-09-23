@echo off
REM TaskQuest Deployment Script for Windows

echo Starting TaskQuest deployment...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker is not installed. Please install Docker and try again.
    exit /b 1
)

REM Check if Docker Compose is installed
docker compose version >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker Compose is not installed. Please install Docker Compose and try again.
    exit /b 1
)

REM Build and start all services
echo Building and starting services...
docker compose up -d --build

REM Wait for services to start
echo Waiting for services to start...
timeout /t 30 /nobreak >nul

REM Check if services are running
echo Checking service status...
docker compose ps

echo Deployment completed!
echo Access the application at http://localhost
echo Backend API is available at http://localhost:3000
echo Default admin credentials: admin / adminpassword