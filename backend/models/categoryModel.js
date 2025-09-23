
const pool = require('../config/db');

const createCategory = async (name, parent_id = null) => {
  const result = await pool.query(
    'INSERT INTO categories (name, parent_id) VALUES ($1, $2) RETURNING *',
    [name, parent_id]
  );
  return result.rows[0];
};

const getAllCategories = async () => {
  const result = await pool.query('SELECT * FROM categories');
  return result.rows;
};

const updateCategory = async (id, name, parent_id) => {
  const result = await pool.query(
    'UPDATE categories SET name = $1, parent_id = $2 WHERE id = $3 RETURNING *',
    [name, parent_id, id]
  );
  return result.rows[0];
};

const deleteCategory = async (id) => {
  const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
