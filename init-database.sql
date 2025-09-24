-- TaskQuest Database Initialization Script
-- This script initializes the TaskQuest database with required tables and default data
-- Run this script directly on your PostgreSQL database to fix missing data issues

-- Create the users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  parent_id INTEGER REFERENCES categories(id)
);

-- Create the tasks table if it doesn't exist
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  points INTEGER NOT NULL,
  level INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'ouvert', -- ouvert, fermé, expiré, rejeté, abandonné, reporté
  creator_id INTEGER NOT NULL REFERENCES users(id),
  assignee_id INTEGER REFERENCES users(id),
  category_id INTEGER REFERENCES categories(id),
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the comments table if it doesn't exist
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  task_id INTEGER NOT NULL REFERENCES tasks(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user if not exists
INSERT INTO users (username, password, level) 
SELECT 'admin', '$2b$10$dIUUnlhxGdUUHWBtV/6h0uFr29IVA6aL98Md3RgadhW6/Tv/70oBO', 10
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

-- Insert default categories if none exist
INSERT INTO categories (name) 
SELECT 'Development' 
WHERE NOT EXISTS (SELECT 1 FROM categories);

INSERT INTO categories (name) 
SELECT 'Design' 
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Design');

INSERT INTO categories (name) 
SELECT 'Testing' 
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Testing');

INSERT INTO categories (name) 
SELECT 'Documentation' 
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Documentation');

INSERT INTO categories (name) 
SELECT 'Maintenance' 
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Maintenance');

-- Verify data was inserted
SELECT 'Database initialization completed successfully!' as message;

-- Show counts
SELECT 'Users:' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Categories:', COUNT(*) FROM categories
UNION ALL
SELECT 'Tasks:', COUNT(*) FROM tasks
UNION ALL
SELECT 'Comments:', COUNT(*) FROM comments;

-- Show admin user info
SELECT 'Admin user exists with username: ' || username || ' and level: ' || level as info 
FROM users WHERE username = 'admin';