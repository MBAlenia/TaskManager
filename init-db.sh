#!/bin/bash

# TaskQuest Database Initialization Script
# This script initializes the TaskQuest database with required tables and default data

echo "=============================================="
echo " TaskQuest Database Initialization"
echo "=============================================="
echo

# Check if we're in the correct directory
if [ ! -f "backend/database.sql" ]; then
    echo "Error: backend/database.sql not found."
    echo "Please run this script from the TaskQuest root directory."
    exit 1
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed or not in PATH."
    echo "Please install Node.js and try again."
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed or not in PATH."
    echo "Please install npm and try again."
    exit 1
fi

echo "Installing required dependencies..."
npm install pg bcrypt dotenv >/dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "Warning: Failed to install dependencies. Continuing with existing installation."
fi

echo "Initializing database..."
node init-database.js

if [ $? -eq 0 ]; then
    echo
    echo "Database initialization completed successfully!"
    echo "You can now access the application with the default credentials:"
    echo "- Username: admin"
    echo "- Password: adminpassword"
    echo "Remember to change the password after first login."
else
    echo
    echo "Database initialization failed!"
    echo "Please check the error messages above."
    exit 1
fi