const { Pool } = require('pg');

// Log the database configuration for debugging
console.log('Database configuration:');
console.log('DB_USER:', process.env.DB_USER || 'postgres');
console.log('DB_HOST:', process.env.DB_HOST || 'localhost');
console.log('DB_NAME:', process.env.DB_NAME || 'taskquest');
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '****' : 'password');
console.log('DB_PORT:', process.env.DB_PORT || 5432);

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'taskquest',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Add error handling for the database connection
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test the database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Successfully connected to database at:', res.rows[0].now);
  }
});

module.exports = pool;