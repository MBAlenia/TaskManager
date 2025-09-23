
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const commentController = require('../controllers/commentController'); // New import
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, taskController.createTask);
router.get('/', protect, taskController.getAvailableTasks);
router.get('/assigned', protect, taskController.getAssignedTasks); // New route for assigned tasks
router.put('/:id/assign', protect, taskController.assignTask);
router.put('/:id/unassign', protect, taskController.unassignTask); // New route for unassigning a task
router.put('/:id', protect, taskController.updateTask);
router.put('/:id/complete', protect, taskController.completeTask); // New route for completing a task
router.put('/:id/validate', protect, taskController.validateTask); // New route for validating a task
router.delete('/:id', protect, taskController.deleteTask);

// Comment routes
router.get('/:taskId/comments', protect, commentController.getCommentsByTaskId);
router.post('/:taskId/comments', protect, commentController.createComment);
router.put('/comments/:commentId', protect, commentController.updateComment);
router.delete('/comments/:commentId', protect, commentController.deleteComment);

module.exports = router;
