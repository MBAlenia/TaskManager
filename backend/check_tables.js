const pool = require('./config/db');

const checkTables = async () => {
  try {
    console.log('Checking if tables exist...');
    
    // Check if users table exists
    const usersResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);
    console.log('Users table exists:', usersResult.rows[0].exists);
    
    // Check if categories table exists
    const categoriesResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'categories'
      );
    `);
    console.log('Categories table exists:', categoriesResult.rows[0].exists);
    
    // Check if tasks table exists
    const tasksResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'tasks'
      );
    `);
    console.log('Tasks table exists:', tasksResult.rows[0].exists);
    
    // Check if comments table exists
    const commentsResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'comments'
      );
    `);
    console.log('Comments table exists:', commentsResult.rows[0].exists);
    
    // If users table exists, check if admin user exists
    if (usersResult.rows[0].exists) {
      const adminResult = await pool.query(`
        SELECT username, level FROM users WHERE username = 'admin';
      `);
      if (adminResult.rows.length > 0) {
        console.log('Admin user found:', adminResult.rows[0]);
      } else {
        console.log('Admin user not found');
      }
    }
    
    // Close the pool
    await pool.end();
  } catch (error) {
    console.error('Error checking tables:', error);
    await pool.end();
  }
};

checkTables();