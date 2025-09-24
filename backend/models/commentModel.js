const pool = require('../config/db');

const getCommentsByTaskId = async (taskId) => {
  try {
    const result = await pool.query(
      'SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.task_id = $1 ORDER BY c.created_at ASC',
      [taskId]
    );
    return result.rows;
  } catch (error) {
    // Re-throw the error to be handled by the controller
    throw error;
  }
};

const createComment = async (taskId, userId, content) => {
  try {
    const result = await pool.query(
      'INSERT INTO comments (task_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
      [taskId, userId, content]
    );
    return result.rows[0];
  } catch (error) {
    // Re-throw the error to be handled by the controller
    throw error;
  }
};

const updateComment = async (id, content) => {
  try {
    const result = await pool.query(
      'UPDATE comments SET content = $1 WHERE id = $2 RETURNING *',
      [content, id]
    );
    return result.rows[0];
  } catch (error) {
    // Re-throw the error to be handled by the controller
    throw error;
  }
};

const deleteComment = async (id) => {
  try {
    const result = await pool.query('DELETE FROM comments WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  } catch (error) {
    // Re-throw the error to be handled by the controller
    throw error;
  }
};

module.exports = {
  getCommentsByTaskId,
  createComment,
  updateComment,
  deleteComment,
};