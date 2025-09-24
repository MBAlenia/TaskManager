const commentModel = require('../models/commentModel');
const { createErrorResponse, handleDatabaseError, validateInput } = require('../utils/errorHandler');

const getCommentsByTaskId = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    
    // Validate task ID
    if (!taskId || isNaN(parseInt(taskId))) {
      return res.status(400).json(createErrorResponse(400, 'Invalid task ID'));
    }
    
    const comments = await commentModel.getCommentsByTaskId(taskId);
    res.json(comments);
  } catch (error) {
    const dbError = handleDatabaseError(error);
    res.status(dbError.status).json(dbError);
  }
};

const createComment = async (req, res) => {
  // Validate input
  const validationError = validateInput(req.body, {
    content: { required: true, type: 'string', minLength: 1 }
  });
  
  if (validationError) {
    return res.status(400).json(validationError);
  }
  
  try {
    const { content } = req.body;
    const { taskId } = req.params;
    
    // Validate task ID
    if (!taskId || isNaN(parseInt(taskId))) {
      return res.status(400).json(createErrorResponse(400, 'Invalid task ID'));
    }
    
    const comment = await commentModel.createComment(taskId, req.user.id, content);
    res.status(201).json(comment);
  } catch (error) {
    const dbError = handleDatabaseError(error);
    res.status(dbError.status).json(dbError);
  }
};

const updateComment = async (req, res) => {
  // Validate input
  const validationError = validateInput(req.body, {
    content: { required: true, type: 'string', minLength: 1 }
  });
  
  if (validationError) {
    return res.status(400).json(validationError);
  }
  
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    
    // Validate comment ID
    if (!commentId || isNaN(parseInt(commentId))) {
      return res.status(400).json(createErrorResponse(400, 'Invalid comment ID'));
    }
    
    const updatedComment = await commentModel.updateComment(commentId, content);
    if (!updatedComment) {
      return res.status(404).json(createErrorResponse(404, 'Comment not found'));
    }
    res.json(updatedComment);
  } catch (error) {
    const dbError = handleDatabaseError(error);
    res.status(dbError.status).json(dbError);
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    
    // Validate comment ID
    if (!commentId || isNaN(parseInt(commentId))) {
      return res.status(400).json(createErrorResponse(400, 'Invalid comment ID'));
    }
    
    const deletedComment = await commentModel.deleteComment(commentId);
    if (!deletedComment) {
      return res.status(404).json(createErrorResponse(404, 'Comment not found'));
    }
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    const dbError = handleDatabaseError(error);
    res.status(dbError.status).json(dbError);
  }
};

module.exports = {
  getCommentsByTaskId,
  createComment,
  updateComment,
  deleteComment,
};