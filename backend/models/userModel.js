const pool = require('../config/db');
const bcrypt = require('bcrypt');

const createUser = async (username, password, level) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password, level) VALUES ($1, $2, $3) RETURNING *',
      [username, hashedPassword, level]
    );
    return result.rows[0];
  } catch (error) {
    // Re-throw the error to be handled by the controller
    throw error;
  }
};

const findUserByUsername = async (username) => {
  try {
    console.log('Executing database query for user:', username);
    const result = await pool.query('SELECT id, username, password, level, points FROM users WHERE username = $1', [username]);
    console.log('Database query result for user', username, ':', result.rows);
    return result.rows[0];
  } catch (error) {
    console.error('Database error when searching for user', username, ':', error);
    // Re-throw the error to be handled by the controller
    throw error;
  }
};

const findUserById = async (id) => {
  try {
    const result = await pool.query('SELECT id, username, password, level, points FROM users WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    // Re-throw the error to be handled by the controller
    throw error;
  }
};

const getAllUsers = async () => {
  try {
    const result = await pool.query('SELECT id, username, level FROM users');
    return result.rows;
  } catch (error) {
    // Re-throw the error to be handled by the controller
    throw error;
  }
};

const updateUserPoints = async (userId, points) => {
  try {
    const user = await findUserById(userId);
    if (!user) return null;

    const newPoints = user.points + points;
    const newLevel = Math.min(10, Math.floor(newPoints / 100) + 1); // Max level 10, 100 points per level

    const result = await pool.query(
      'UPDATE users SET points = $1, level = $2 WHERE id = $3 RETURNING *;',
      [newPoints, newLevel, userId]
    );
    return result.rows[0];
  } catch (error) {
    // Re-throw the error to be handled by the controller
    throw error;
  }
};

const updateUser = async (id, userData) => {
  try {
    const { username, password, level } = userData;
    const fields = [];
    const values = [];
    let queryIndex = 1;

    if (username !== undefined) { fields.push(`username = $${queryIndex++}`); values.push(username); }
    if (level !== undefined) { fields.push(`level = $${queryIndex++}`); values.push(level); }
    if (password !== undefined) {
      const hashedPassword = await bcrypt.hash(password, 10);
      fields.push(`password = $${queryIndex++}`);
      values.push(hashedPassword);
    }

    if (fields.length === 0) {
      return null; // No fields to update
    }

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${queryIndex} RETURNING *`;
    values.push(id);

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    // Re-throw the error to be handled by the controller
    throw error;
  }
};

const deleteUser = async (id) => {
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *;', [id]);
    return result.rows[0];
  } catch (error) {
    // Re-throw the error to be handled by the controller
    throw error;
  }
};

module.exports = {
  createUser,
  findUserByUsername,
  findUserById,
  getAllUsers,
  updateUserPoints,
  updateUser,
  deleteUser,
};