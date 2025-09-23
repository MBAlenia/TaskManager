
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware'); // admin à ajouter

router.post('/', protect, admin, categoryController.createCategory);
router.get('/', protect, categoryController.getAllCategories);
router.put('/:id', protect, admin, categoryController.updateCategory); // New route for updating a category
router.delete('/:id', protect, admin, categoryController.deleteCategory); // New route for deleting a category

module.exports = router;
