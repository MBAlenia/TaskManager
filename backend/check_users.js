const { Pool } = require('pg');

// Database configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'taskquest',
  password: 'password',
  port: 5432,
});

// Check users in database
const checkUsers = async () => {
  try {
    const result = await pool.query('SELECT id, username, level FROM users');
    console.log('Users in database:');
    console.log(result.rows);
  } catch (error) {
    console.error('Error connecting to database:', error.message);
  } finally {
    await pool.end();
  }
};

checkUsers();