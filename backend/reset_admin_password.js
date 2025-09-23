const { Pool } = require('pg');
const bcrypt = require('bcrypt');

// Database configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'taskquest',
  password: 'password',
  port: 5432,
});

// Reset admin password
const resetAdminPassword = async () => {
  try {
    const hashedPassword = await bcrypt.hash('adminpassword', 10);
    
    const result = await pool.query(
      'UPDATE users SET password = $1 WHERE username = $2 RETURNING *',
      [hashedPassword, 'admin']
    );
    
    if (result.rows.length > 0) {
      console.log('Admin password reset successfully');
    } else {
      console.log('Admin user not found');
    }
  } catch (error) {
    console.error('Error resetting admin password:', error.message);
  } finally {
    await pool.end();
  }
};

resetAdminPassword();