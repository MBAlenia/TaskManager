const pool = require('../config/db');
const userModel = require('./userModel');

const createTask = async (task) => {
  try {
    const { title, description, points, level, creator_id, category_id, due_date, status } = task;
    const result = await pool.query(
      'INSERT INTO tasks (title, description, points, level, creator_id, category_id, due_date, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [title, description, points, level, creator_id, category_id, due_date, status]
    );
    return result.rows[0];
  } catch (error) {
    // Re-throw the error to be handled by the controller
    throw error;
  }
};

const getTasksByLevel = async (level, options = {}) => {
  try {
    let query = 'SELECT * FROM tasks WHERE level <= $1';
    const values = [level];
    let paramIndex = 2;

    if (options.status) {
      query += ` AND status = $${paramIndex++}`;
      values.push(options.status);
    }
    if (options.category_id) {
      query += ` AND category_id = $${paramIndex++}`;
      values.push(options.category_id);
    }
    if (options.assignee_id) {
      query += ` AND assignee_id = $${paramIndex++}`;
      values.push(options.assignee_id);
    } else if (options.assignee_id === null) { // Explicitly filter for unassigned tasks
      query += ` AND assignee_id IS NULL`;
    }

    if (options.sort_field) {
      const sortOrder = options.sort_order && options.sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      query += ` ORDER BY ${options.sort_field} ${sortOrder}`;
    }

    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    // Re-throw the error to be handled by the controller
    throw error;
  }
};

const getTaskById = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    // Re-throw the error to be handled by the controller
    throw error;
  }
};

const assignTask = async (taskId, userId) => {
  try {
    const result = await pool.query(
      'UPDATE tasks SET assignee_id = $1, status = \'assigné\' WHERE id = $2 RETURNING *',
      [userId, taskId]
    );
    return result.rows[0];
  } catch (error) {
    // Re-throw the error to be handled by the controller
    throw error;
  }
};

const updateTask = async (id, taskData) => {
  try {
    const fields = [];
    const values = [];
    let queryIndex = 1;

    for (const key in taskData) {
      if (taskData[key] !== undefined) {
        fields.push(`${key} = $${queryIndex++}`);
        values.push(taskData[key]);
      }
    }

    if (fields.length === 0) {
      return null; // No fields to update
    }

    const query = `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${queryIndex} RETURNING *`;
    values.push(id);

    console.log('Generated SQL Query:', query);
    console.log('Query Values:', values);

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    // Re-throw the error to be handled by the controller
    throw error;
  }
};

const deleteTask = async (id) => {
  try {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *;', [id]);
    return result.rows[0];
  } catch (error) {
    // Re-throw the error to be handled by the controller
    throw error;
  }
};

const getAssignedTasksByUserId = async (userId, options = {}) => {
  try {
    let query = 'SELECT * FROM tasks WHERE assignee_id = $1';
    const values = [userId];
    let paramIndex = 2;

    if (options.status) {
      query += ` AND status = $${paramIndex++}`;
      values.push(options.status);
    }
    if (options.category_id) {
      query += ` AND category_id = $${paramIndex++}`;
      values.push(options.category_id);
    }

    if (options.sort_field) {
      const sortOrder = options.sort_order && options.sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      query += ` ORDER BY ${options.sort_field} ${sortOrder}`;
    }

    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    // Re-throw the error to be handled by the controller
    throw error;
  }
};

const unassignTask = async (taskId) => {
  try {
    const result = await pool.query(
      'UPDATE tasks SET assignee_id = NULL, status = \'ouvert\' WHERE id = $1 RETURNING *',
      [taskId]
    );
    return result.rows[0];
  } catch (error) {
    // Re-throw the error to be handled by the controller
    throw error;
  }
};

const completeTask = async (taskId) => {
  try {
    const result = await pool.query(
      'UPDATE tasks SET status = \'fermé\' WHERE id = $1 RETURNING *',
      [taskId]
    );
    return result.rows[0];
  } catch (error) {
    // Re-throw the error to be handled by the controller
    throw error;
  }
};

module.exports = {
  createTask,
  getTasksByLevel,
  getTaskById,
  assignTask,
  updateTask,
  deleteTask,
  getAssignedTasksByUserId,
  unassignTask,
  completeTask,
};