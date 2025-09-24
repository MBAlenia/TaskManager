const categoryModel = require('../models/categoryModel');
const { createErrorResponse, handleDatabaseError, validateInput } = require('../utils/errorHandler');

const createCategory = async (req, res) => {
  // Validate input
  const validationError = validateInput(req.body, {
    name: { required: true, type: 'string', minLength: 1, maxLength: 255 },
    parent_id: { type: 'number' }
  });
  
  if (validationError) {
    return res.status(400).json(validationError);
  }
  
  const { name, parent_id } = req.body;
  try {
    const category = await categoryModel.createCategory(name, parent_id);
    res.status(201).json(category);
  } catch (error) {
    const dbError = handleDatabaseError(error);
    res.status(dbError.status).json(dbError);
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.getAllCategories();
    res.json(categories);
  } catch (error) {
    const dbError = handleDatabaseError(error);
    res.status(dbError.status).json(dbError);
  }
};

const updateCategory = async (req, res) => {
  const categoryId = req.params.id;
  
  // Validate category ID
  if (!categoryId || isNaN(parseInt(categoryId))) {
    return res.status(400).json(createErrorResponse(400, 'Invalid category ID'));
  }
  
  // Validate input
  const validationError = validateInput(req.body, {
    name: { required: true, type: 'string', minLength: 1, maxLength: 255 },
    parent_id: { type: 'number' }
  });
  
  if (validationError) {
    return res.status(400).json(validationError);
  }
  
  const { name, parent_id } = req.body;
  try {
    const updatedCategory = await categoryModel.updateCategory(categoryId, name, parent_id);
    if (!updatedCategory) {
      return res.status(404).json(createErrorResponse(404, 'Category not found'));
    }
    res.json(updatedCategory);
  } catch (error) {
    const dbError = handleDatabaseError(error);
    res.status(dbError.status).json(dbError);
  }
};

const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;
  
  // Validate category ID
  if (!categoryId || isNaN(parseInt(categoryId))) {
    return res.status(400).json(createErrorResponse(400, 'Invalid category ID'));
  }
  
  try {
    const deletedCategory = await categoryModel.deleteCategory(categoryId);
    if (!deletedCategory) {
      return res.status(404).json(createErrorResponse(404, 'Category not found'));
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    const dbError = handleDatabaseError(error);
    res.status(dbError.status).json(dbError);
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};