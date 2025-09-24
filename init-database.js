#!/usr/bin/env node

/**
 * TaskQuest Database Initialization Script
 * 
 * This script initializes the TaskQuest database with required tables and default data.
 * It can be used to fix missing data issues in production environments.
 * 
 * Usage:
 *   node init-database.js
 * 
 * Requirements:
 *   - PostgreSQL database connection
 *   - Environment variables for database configuration
 */

const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Database configuration
const dbConfig = {
  user: process.env.DB_USER || process.env.POSTGRES_USER_PROD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || process.env.POSTGRES_DB_PROD || 'taskquest',
  password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD_PROD || 'password',
  port: process.env.DB_PORT || 5432,
};

console.log('Initializing TaskQuest database...');
console.log('Database configuration:');
console.log('- Host:', dbConfig.host);
console.log('- Database:', dbConfig.database);
console.log('- User:', dbConfig.user);
console.log('- Port:', dbConfig.port);

// Create a database pool
const pool = new Pool(dbConfig);

// Function to execute a query and handle errors
async function executeQuery(query, values = []) {
  try {
    const res = await pool.query(query, values);
    return res;
  } catch (err) {
    console.error('Error executing query:', err.message);
    throw err;
  }
}

// Function to check if a table exists
async function tableExists(tableName) {
  try {
    const res = await executeQuery(
      `SELECT EXISTS (
         SELECT FROM information_schema.tables 
         WHERE table_schema = 'public' 
         AND table_name = $1
       )`,
      [tableName]
    );
    return res.rows[0].exists;
  } catch (err) {
    console.error(`Error checking if table ${tableName} exists:`, err.message);
    return false;
  }
}

// Function to check if a column exists in a table
async function columnExists(tableName, columnName) {
  try {
    const res = await executeQuery(
      `SELECT EXISTS (
         SELECT FROM information_schema.columns 
         WHERE table_schema = 'public' 
         AND table_name = $1 
         AND column_name = $2
       )`,
      [tableName, columnName]
    );
    return res.rows[0].exists;
  } catch (err) {
    console.error(`Error checking if column ${columnName} exists in table ${tableName}:`, err.message);
    return false;
  }
}

// Function to check if the admin user exists
async function adminUserExists() {
  try {
    const res = await executeQuery(
      "SELECT COUNT(*) as count FROM users WHERE username = 'admin'"
    );
    return parseInt(res.rows[0].count) > 0;
  } catch (err) {
    console.error('Error checking if admin user exists:', err.message);
    return false;
  }
}

// Function to create tables
async function createTables() {
  console.log('Creating tables...');
  
  // Read the database schema
  const schemaPath = path.join(__dirname, 'backend', 'database.sql');
  let schemaSQL = '';
  
  try {
    schemaSQL = fs.readFileSync(schemaPath, 'utf8');
  } catch (err) {
    console.error('Error reading database schema file:', err.message);
    // Use embedded schema if file reading fails
    schemaSQL = `
-- Create the users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  parent_id INTEGER REFERENCES categories(id)
);

-- Create the tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  points INTEGER NOT NULL,
  level INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'ouvert',
  creator_id INTEGER NOT NULL REFERENCES users(id),
  assignee_id INTEGER REFERENCES users(id),
  category_id INTEGER REFERENCES categories(id),
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the comments table
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  task_id INTEGER NOT NULL REFERENCES tasks(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
    `;
  }
  
  // Split the schema into individual statements
  const statements = schemaSQL
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0);
  
  // Execute each statement
  for (const statement of statements) {
    if (!statement.startsWith('--') && statement.length > 0) {
      try {
        await executeQuery(statement);
        // Log table creation
        if (statement.toUpperCase().includes('CREATE TABLE')) {
          const tableName = statement.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)/i);
          if (tableName) {
            console.log(`  ✓ Created table: ${tableName[1]}`);
          }
        }
      } catch (err) {
        // Ignore errors for CREATE TABLE IF NOT EXISTS statements if table already exists
        if (!statement.toUpperCase().includes('IF NOT EXISTS') || !err.message.includes('already exists')) {
          console.error('Error executing statement:', err.message);
          throw err;
        }
      }
    }
  }
  
  console.log('✓ Tables created successfully');
}

// Function to insert default data
async function insertDefaultData() {
  console.log('Inserting default data...');
  
  // Check if admin user already exists
  const adminExists = await adminUserExists();
  
  if (!adminExists) {
    // Hash the default admin password
    const hashedPassword = await bcrypt.hash('adminpassword', 10);
    
    // Insert default admin user
    await executeQuery(
      'INSERT INTO users (username, password, level) VALUES ($1, $2, $3)',
      ['admin', hashedPassword, 10]
    );
    console.log('  ✓ Created default admin user (username: admin, password: adminpassword)');
  } else {
    console.log('  - Admin user already exists, skipping creation');
  }
  
  // Check if any categories exist
  const categoriesRes = await executeQuery('SELECT COUNT(*) as count FROM categories');
  const categoryCount = parseInt(categoriesRes.rows[0].count);
  
  if (categoryCount === 0) {
    // Insert default categories
    const defaultCategories = ['Development', 'Design', 'Testing', 'Documentation', 'Maintenance'];
    
    for (const categoryName of defaultCategories) {
      await executeQuery(
        'INSERT INTO categories (name) VALUES ($1)',
        [categoryName]
      );
    }
    console.log(`  ✓ Created ${defaultCategories.length} default categories`);
  } else {
    console.log(`  - ${categoryCount} categories already exist, skipping creation`);
  }
  
  console.log('✓ Default data inserted successfully');
}

// Function to verify database structure
async function verifyDatabase() {
  console.log('Verifying database structure...');
  
  const requiredTables = ['users', 'categories', 'tasks', 'comments'];
  const missingTables = [];
  
  for (const tableName of requiredTables) {
    const exists = await tableExists(tableName);
    if (!exists) {
      missingTables.push(tableName);
    }
  }
  
  if (missingTables.length > 0) {
    console.error(`  ✗ Missing tables: ${missingTables.join(', ')}`);
    return false;
  }
  
  console.log('  ✓ All required tables exist');
  
  // Check if admin user exists
  const adminExists = await adminUserExists();
  if (!adminExists) {
    console.error('  ✗ Admin user is missing');
    return false;
  }
  
  console.log('  ✓ Admin user exists');
  console.log('✓ Database verification completed successfully');
  return true;
}

// Main function
async function main() {
  try {
    // Test database connection
    console.log('Testing database connection...');
    const client = await pool.connect();
    console.log('✓ Database connection successful');
    client.release();
    
    // Create tables
    await createTables();
    
    // Insert default data
    await insertDefaultData();
    
    // Verify database structure
    const isDatabaseValid = await verifyDatabase();
    
    if (isDatabaseValid) {
      console.log('\n==========================================');
      console.log('  Database initialization completed successfully!');
      console.log('==========================================');
      console.log('Default credentials:');
      console.log('- Admin username: admin');
      console.log('- Admin password: adminpassword');
      console.log('- Please change the password after first login');
    } else {
      console.error('\n==========================================');
      console.error('  Database initialization completed with issues!');
      console.error('==========================================');
      process.exit(1);
    }
  } catch (err) {
    console.error('\n==========================================');
    console.error('  Database initialization failed!');
    console.error('==========================================');
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  createTables,
  insertDefaultData,
  verifyDatabase,
  tableExists,
  adminUserExists
};