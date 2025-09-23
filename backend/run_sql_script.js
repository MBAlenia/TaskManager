const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'taskquest',
  password: 'password',
  port: 5432,
});

const runSqlScript = async () => {
  const sqlFilePath = path.join(__dirname, 'database.sql');
  const sql = fs.readFileSync(sqlFilePath, 'utf8');

  try {
    await pool.query(sql);
    console.log('database.sql executed successfully.');
  } catch (err) {
    console.error('Error executing database.sql:', err);
  } finally {
    pool.end();
  }
};

runSqlScript();
