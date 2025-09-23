const pool = require('../config/db');

const getCommentsByTaskId = async (taskId) => {
  const result = await pool.query('SELECT * FROM comments WHERE task_id = $1 ORDER BY created_at ASC', [taskId]);
  return result.rows;
};

const createComment = async (taskId, userId, content) => {
  const result = await pool.query(
    'INSERT INTO comments (task_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
    [taskId, userId, content]
  );
  return result.rows[0];
};

const updateComment = async (commentId, content) => {
  const result = await pool.query(
    'UPDATE comments SET content = $1 WHERE id = $2 RETURNING *',
    [content, commentId]
  );
  return result.rows[0];
};

const deleteComment = async (commentId) => {
  const result = await pool.query('DELETE FROM comments WHERE id = $1 RETURNING *', [commentId]);
  return result.rows[0];
};

module.exports = {
  getCommentsByTaskId,
  createComment,
  updateComment,
  deleteComment,
};
