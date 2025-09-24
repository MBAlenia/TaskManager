const taskModel = require('../models/taskModel');
const { createErrorResponse, handleDatabaseError, validateInput } = require('../utils/errorHandler');

const createTask = async (req, res) => {
  // Validate input
  const validationError = validateInput(req.body, {
    title: { required: true, type: 'string', minLength: 1, maxLength: 255 },
    description: { type: 'string' },
    points: { required: true, type: 'number', min: 1 },
    level: { required: true, type: 'number', min: 1, max: 10 },
    category_id: { type: 'number' },
    due_date: { type: 'string' }
  });
  
  if (validationError) {
    return res.status(400).json(validationError);
  }
  
  try {
    const { title, description, points, level, category_id, due_date } = req.body;
    const status = req.user.level === 10 ? 'ouvert' : 'pending_validation'; // Admins create 'ouvert', others 'pending_validation'
    const task = await taskModel.createTask({ title, description, points, level, category_id, due_date, creator_id: req.user.id, status });
    res.status(201).json(task);
  } catch (error) {
    const dbError = handleDatabaseError(error);
    res.status(dbError.status).json(dbError);
  }
};

const getAvailableTasks = async (req, res) => {
  try {
    const { status, category_id, assignee_id, sort_field, sort_order } = req.query;
    const tasks = await taskModel.getTasksByLevel(req.user.level, { status, category_id, assignee_id, sort_field, sort_order });
    res.json(tasks);
  } catch (error) {
    const dbError = handleDatabaseError(error);
    res.status(dbError.status).json(dbError);
  }
};

const assignTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        
        // Validate task ID
        if (!taskId || isNaN(parseInt(taskId))) {
          return res.status(400).json(createErrorResponse(400, 'Invalid task ID'));
        }
        
        const task = await taskModel.getTaskById(taskId);

        if (!task) {
            return res.status(404).json(createErrorResponse(404, 'Task not found'));
        }

        if (task.assignee_id) {
            return res.status(400).json(createErrorResponse(400, 'Task is already assigned'));
        }

        const updatedTask = await taskModel.assignTask(taskId, req.user.id);
        res.json(updatedTask);
    } catch (error) {
        const dbError = handleDatabaseError(error);
        res.status(dbError.status).json(dbError);
    }
};

const updateTask = async (req, res) => {
  console.log('Update task request received.');
  console.log('Task ID:', req.params.id);
  // REMOVED SECURITY VULNERABILITY: Do not log sensitive information like request body
  try {
    const taskId = req.params.id;
    
    // Validate task ID
    if (!taskId || isNaN(parseInt(taskId))) {
      return res.status(400).json(createErrorResponse(400, 'Invalid task ID'));
    }
    
    const existingTask = await taskModel.getTaskById(taskId);

    if (!existingTask) {
      console.log('Task not found for update:', taskId);
      return res.status(404).json(createErrorResponse(404, 'Task not found'));
    }

    const isCreator = existingTask.creator_id === req.user.id;
    const isAdmin = req.user.level === 10;
    const isAssignee = existingTask.assignee_id === req.user.id;

    // If not creator or admin
    if (!isCreator && !isAdmin) {
      // If assignee, only allow status update
      if (isAssignee) {
        const allowedFields = ['status'];
        const incomingFields = Object.keys(req.body);
        const hasOtherFields = incomingFields.some(field => !allowedFields.includes(field));

        if (hasOtherFields) {
          return res.status(403).json(createErrorResponse(403, 'Only status can be updated by assignee'));
        }
      } else {
        // Not creator, not admin, not assignee
        return res.status(403).json(createErrorResponse(403, 'Not authorized to update this task'));
      }
    }

    console.log('Calling taskModel.updateTask...');
    const updatedTask = await taskModel.updateTask(taskId, req.body);
    console.log('taskModel.updateTask returned task ID:', updatedTask.id);
    if (!updatedTask) {
      console.log('Task not found for update:', taskId);
      return res.status(404).json(createErrorResponse(404, 'Task not found'));
    }
    console.log('Task updated successfully:', updatedTask.id);
    res.json(updatedTask);
  } catch (error) {
    console.error('Error in updateTask controller:', error);
    const dbError = handleDatabaseError(error);
    res.status(dbError.status).json(dbError);
  }
};

const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    
    // Validate task ID
    if (!taskId || isNaN(parseInt(taskId))) {
      return res.status(400).json(createErrorResponse(400, 'Invalid task ID'));
    }
    
    const existingTask = await taskModel.getTaskById(taskId);

    if (!existingTask) {
      return res.status(404).json(createErrorResponse(404, 'Task not found'));
    }

    const isCreator = existingTask.creator_id === req.user.id;
    const isAdmin = req.user.level === 10;

    if (!isCreator && !isAdmin) {
      return res.status(403).json(createErrorResponse(403, 'Not authorized to delete this task'));
    }

    const deletedTask = await taskModel.deleteTask(taskId);
    if (!deletedTask) {
      return res.status(404).json(createErrorResponse(404, 'Task not found'));
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    const dbError = handleDatabaseError(error);
    res.status(dbError.status).json(dbError);
  }
};

const getAssignedTasks = async (req, res) => {
  try {
    const { status, category_id, sort_field, sort_order } = req.query;
    const tasks = await taskModel.getAssignedTasksByUserId(req.user.id, { status, category_id, sort_field, sort_order });
    res.json(tasks);
  } catch (error) {
    const dbError = handleDatabaseError(error);
    res.status(dbError.status).json(dbError);
  }
};

const unassignTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    
    // Validate task ID
    if (!taskId || isNaN(parseInt(taskId))) {
      return res.status(400).json(createErrorResponse(400, 'Invalid task ID'));
    }
    
    const task = await taskModel.getTaskById(taskId);

    if (!task) {
      return res.status(404).json(createErrorResponse(404, 'Task not found'));
    }

    // Only the assignee or an admin can unassign the task
    if (task.assignee_id !== req.user.id && req.user.level !== 10) {
      return res.status(403).json(createErrorResponse(403, 'Not authorized to unassign this task'));
    }

    const unassignedTask = await taskModel.unassignTask(taskId);
    res.json(unassignedTask);
  } catch (error) {
    const dbError = handleDatabaseError(error);
    res.status(dbError.status).json(dbError);
  }
};

const completeTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    
    // Validate task ID
    if (!taskId || isNaN(parseInt(taskId))) {
      return res.status(400).json(createErrorResponse(400, 'Invalid task ID'));
    }
    
    const task = await taskModel.getTaskById(taskId);

    if (!task) {
      return res.status(404).json(createErrorResponse(404, 'Task not found'));
    }

    // Only the creator or an admin can complete the task
    if (task.creator_id !== req.user.id && req.user.level !== 10) {
      return res.status(403).json(createErrorResponse(403, 'Not authorized to complete this task'));
    }

    if (!task.assignee_id) {
      return res.status(400).json(createErrorResponse(400, 'Task must be assigned to be completed'));
    }

    const completedTask = await taskModel.completeTask(taskId);
    await taskModel.userModel.updateUserPoints(task.assignee_id, task.points);

    res.json(completedTask);
  } catch (error) {
    const dbError = handleDatabaseError(error);
    res.status(dbError.status).json(dbError);
  }
};

const validateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    
    // Validate task ID
    if (!taskId || isNaN(parseInt(taskId))) {
      return res.status(400).json(createErrorResponse(400, 'Invalid task ID'));
    }
    
    // Only admin can validate tasks
    if (req.user.level !== 10) {
      return res.status(403).json(createErrorResponse(403, 'Not authorized to validate tasks'));
    }

    const task = await taskModel.getTaskById(taskId);
    if (!task) {
      return res.status(404).json(createErrorResponse(404, 'Task not found'));
    }

    if (task.status !== 'pending_validation') {
      return res.status(400).json(createErrorResponse(400, 'Task is not in pending_validation status'));
    }

    const validatedTask = await taskModel.updateTask(taskId, { status: 'ouvert' });
    res.json(validatedTask);
  } catch (error) {
    const dbError = handleDatabaseError(error);
    res.status(dbError.status).json(dbError);
  }
};

module.exports = {
  createTask,
  getAvailableTasks,
  assignTask,
  updateTask,
  deleteTask,
  getAssignedTasks,
  unassignTask,
  completeTask,
  validateTask,
};