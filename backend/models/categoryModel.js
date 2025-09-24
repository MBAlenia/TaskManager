const pool = require('../config/db');

const createCategory = async (name, parentId = null) => {
  try {
    const result = await pool.query(
      'INSERT INTO categories (name, parent_id) VALUES ($1, $2) RETURNING *',
      [name, parentId]
    );
    return result.rows[0];
  } catch (error) {
    // Re-throw the error to be handled by the controller
    throw error;
  }
};

const getAllCategories = async () => {
  try {
    const result = await pool.query('SELECT * FROM categories');
    return result.rows;
  } catch (error) {
    // Re-throw the error to be handled by the controller
    throw error;
  }
};

const updateCategory = async (id, name, parentId = null) => {
  try {
    const result = await pool.query(
      'UPDATE categories SET name = $1, parent_id = $2 WHERE id = $3 RETURNING *',
      [name, parentId, id]
    );
    return result.rows[0];
  } catch (error) {
    // Re-throw the error to be handled by the controller
    throw error;
  }
};

const deleteCategory = async (id) => {
  try {
    const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  } catch (error) {
    // Re-throw the error to be handled by the controller
    throw error;
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};