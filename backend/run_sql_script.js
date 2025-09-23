const { Pool, Client } = require('pg');
const fs = require('fs');
const path = require('path');

const runSqlScript = async () => {
  try {
    // Connect directly to the taskquest database
    const pool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'taskquest',
      password: 'password',
      port: 5432,
    });

    // Check if tables exist by querying the information schema
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'categories', 'tasks', 'comments')
      ORDER BY table_name
    `);

    if (result.rows.length > 0) {
      console.log('Existing tables in the database:');
      result.rows.forEach(row => {
        console.log('- ' + row.table_name);
      });
      
      if (result.rows.length === 4) {
        console.log('All required tables already exist in the database.');
        await pool.end();
        return;
      }
    } else {
      console.log('No tables found in the database.');
    }

    const sqlFilePath = path.join(__dirname, 'database.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    // Execute the SQL script
    await pool.query(sql);
    console.log('Database tables created successfully.');

    await pool.end();
  } catch (err) {
    if (err.message.includes('database "taskquest" does not exist')) {
      console.log('Database "taskquest" does not exist. Please create it first.');
      console.log('You can create it by connecting to PostgreSQL and running:');
      console.log('CREATE DATABASE taskquest;');
    } else if (err.message.includes('password authentication failed')) {
      console.log('Authentication failed. Please check your PostgreSQL credentials.');
      console.log('Make sure PostgreSQL is running and the credentials are correct.');
    } else {
      console.error('Error:', err.message);
    }
  }
};

runSqlScript();