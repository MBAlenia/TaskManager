@echo off
REM TaskQuest Production Fix Script for Windows
REM This script helps fix common production issues with TaskQuest deployment via Portainer

echo ==============================================
echo  TaskQuest Production Fix Script for Windows
echo ==============================================
echo.

REM Check prerequisites
echo Checking prerequisites...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker is not installed or not in PATH.
    echo Please install Docker and try again.
    exit /b 1
)

git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Git is not installed or not in PATH.
    echo Please install Git and try again.
    exit /b 1
)

echo ✓ Docker and Git found
echo.

REM Ensure we're in the right directory
if not exist "docker-compose-prod.yml" (
    echo Error: docker-compose-prod.yml not found.
    echo Please run this script from the TaskQuest root directory.
    exit /b 1
)

echo ✓ Running from TaskQuest root directory
echo.

REM Pull latest changes
echo Pulling latest changes from Git repository...
git pull origin main
if %errorlevel% neq 0 (
    echo Warning: Failed to pull latest changes. Continuing with current version.
) else (
    echo ✓ Successfully pulled latest changes
)
echo.

REM Check if we're using Portainer
echo Are you deploying via Portainer? (y/N):
set /p REPLY=
echo.
if /i "%REPLY%"=="y" (
    echo Please follow these steps in Portainer:
    echo 1. Go to Stacks → taskquest
    echo 2. Click 'Update the stack'
    echo 3. Select 'Pull and redeploy' option
    echo 4. Click 'Update'
    echo.
    echo After updating, check the logs of each container for any errors.
    echo.
) else (
    REM Direct Docker deployment
    echo Stopping existing services...
    docker compose -f docker-compose-prod.yml down
    echo.

    echo Removing unused volumes (optional)...
    echo Do you want to remove volumes and start fresh? This will delete all data! (y/N):
    set /p REPLY=
    echo.
    if /i "%REPLY%"=="y" (
        echo Removing volumes...
        docker volume prune -f
        echo ✓ Volumes removed
    )
    echo.

    echo Building and starting services...
    docker compose -f docker-compose-prod.yml up -d --build
    echo.

    echo Waiting for services to start (30 seconds)...
    timeout /t 30 /nobreak >nul
    echo.

    echo Checking service status...
    docker compose -f docker-compose-prod.yml ps
    echo.

    echo Checking logs for errors...
    echo === Backend Logs ===
    docker logs taskquest-backend | more
    echo.
    echo === Frontend Logs ===
    docker logs taskquest-frontend | more
    echo.
    echo === Database Logs ===
    docker logs taskquest-db | more
    echo.
)

REM Common fixes
echo Applying common fixes...
echo.

REM Fix database initialization if needed
echo Checking database initialization...
docker exec taskquest-db psql -U postgres -d taskquest -c "SELECT COUNT(*) FROM users;" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Database tables exist
) else (
    echo ⚠ Database tables may be missing. Attempting to reinitialize...
    echo    Please check if the database initialization script was properly mounted.
)
echo.

REM Verify API connectivity
echo Checking API connectivity...
curl --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Testing backend API endpoint...
    curl -s -o nul -w "HTTP Status: %%{http_code}\n" http://localhost:3000/api/health || echo API not accessible locally
) else (
    echo curl not available, skipping API test
)
echo.

REM Final instructions
echo ==============================================
echo  Fix Process Complete
echo ==============================================
echo.
echo Next steps:
echo 1. Check Portainer for any container errors
echo 2. Verify the application is accessible at https://taskquest.academy.alenia.io
echo 3. Test login with admin/adminpassword
echo 4. Verify pgAdmin is accessible at https://pgadmin.taskquest.academy.alenia.io
echo.
echo If issues persist:
echo - Check container logs in Portainer
echo - Verify environment variables are correctly set
echo - Ensure DNS records point to the correct server
echo - Confirm Traefik is properly configured
echo.
echo For detailed troubleshooting, refer to PORTAINER_DEPLOYMENT.md