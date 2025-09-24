@echo off
REM TaskQuest Database Initialization Script for Windows
REM This script initializes the TaskQuest database with required tables and default data

echo ==============================================
echo  TaskQuest Database Initialization
echo ==============================================
echo.

REM Check if we're in the correct directory
if not exist "backend\database.sql" (
    echo Error: backend\database.sql not found.
    echo Please run this script from the TaskQuest root directory.
    exit /b 1
)

REM Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH.
    echo Please install Node.js and try again.
    exit /b 1
)

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: npm is not installed or not in PATH.
    echo Please install npm and try again.
    exit /b 1
)

echo Installing required dependencies...
call npm install pg bcrypt dotenv >nul 2>&1
if %errorlevel% neq 0 (
    echo Warning: Failed to install dependencies. Continuing with existing installation.
)

echo Initializing database...
node init-database.js

if %errorlevel% equ 0 (
    echo.
    echo Database initialization completed successfully!
    echo You can now access the application with the default credentials:
    echo - Username: admin
    echo - Password: adminpassword
    echo Remember to change the password after first login.
) else (
    echo.
    echo Database initialization failed!
    echo Please check the error messages above.
    exit /b 1
)