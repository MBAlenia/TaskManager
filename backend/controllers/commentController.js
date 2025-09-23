const commentModel = require('../models/commentModel');

const getCommentsByTaskId = async (req, res) => {
  try {
    const comments = await commentModel.getCommentsByTaskId(req.params.taskId);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { taskId } = req.params;
    const comment = await commentModel.createComment(taskId, req.user.id, content);
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const updatedComment = await commentModel.updateComment(commentId, content);
    if (!updatedComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const deletedComment = await commentModel.deleteComment(commentId);
    if (!deletedComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCommentsByTaskId,
  createComment,
  updateComment,
  deleteComment,
};
