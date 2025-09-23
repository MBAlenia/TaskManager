import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import authService from '../services/authService';
import categoryService from '../services/categoryService';
import { Category } from '../types';

const CategoryManagementPage: React.FC = () => {
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [newCategoryParentId, setNewCategoryParentId] = useState<string>('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editCategoryName, setEditCategoryName] = useState<string>('');
  const [editCategoryParentId, setEditCategoryParentId] = useState<string>('');

  useEffect(() => {
    if (!authService.isAdmin()) {
      navigate('/dashboard'); // Redirect if not admin
      return;
    }
    fetchCategories();
  }, [navigate]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      setCategories(response.data);
    } catch (err: any) {
      setError('Failed to fetch categories.');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await categoryService.createCategory(newCategoryName, newCategoryParentId ? parseInt(newCategoryParentId) : null);
      setNewCategoryName('');
      setNewCategoryParentId('');
      fetchCategories();
    } catch (err: any) {
      setError('Failed to create category.');
      console.error('Error creating category:', err);
    }
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setEditCategoryName(category.name);
    setEditCategoryParentId(category.parent_id ? category.parent_id.toString() : '');
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      await categoryService.updateCategory(
        editingCategory.id,
        editCategoryName,
        editCategoryParentId ? parseInt(editCategoryParentId) : null
      );
      setEditingCategory(null);
      fetchCategories();
    } catch (err: any) {
      setError('Failed to update category.');
      console.error('Error updating category:', err);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryService.deleteCategory(categoryId);
        fetchCategories();
      } catch (err: any) {
        setError('Failed to delete category.');
        console.error('Error deleting category:', err);
      }
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/'); // Redirect to login page after logout
  };

  if (loading) {
    return <div className="container mt-5">{translate('loading_categories')}</div>;
  }

  if (error) {
    return <div className="container mt-5 alert alert-danger">{translate('error')}: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <h1>{translate('category_management')}</h1>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <Link to="/admin" className="btn btn-secondary">{translate('back_to_admin_dashboard')}</Link>
        <button onClick={handleLogout} className="btn btn-danger">{translate('logout')}</button>
      </div>

      {/* Create Category Form */}
      <div className="card mb-4">
        <div className="card-header">{translate('create_new_category')}</div>
        <div className="card-body">
          <form onSubmit={handleCreateCategory}>
            <div className="mb-3">
              <label htmlFor="newCategoryName" className="form-label">{translate('category_name')}</label>
              <input
                type="text"
                className="form-control"
                id="newCategoryName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="newCategoryParentId" className="form-label">{translate('parent_category_id_optional')}</label>
              <input
                type="number"
                className="form-control"
                id="newCategoryParentId"
                value={newCategoryParentId}
                onChange={(e) => setNewCategoryParentId(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">{translate('add_category')}</button>
          </form>
        </div>
      </div>

      {/* Edit Category Form */}
      {editingCategory && (
        <div className="card mb-4">
          <div className="card-header">{translate('edit_category')}</div>
          <div className="card-body">
            <form onSubmit={handleUpdateCategory}>
              <div className="mb-3">
                <label htmlFor="editCategoryName" className="form-label">{translate('category_name')}</label>
                <input
                  type="text"
                  className="form-control"
                  id="editCategoryName"
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="editCategoryParentId" className="form-label">{translate('parent_category_id_optional')}</label>
                <input
                  type="number"
                  className="form-control"
                  id="editCategoryParentId"
                  value={editCategoryParentId}
                  onChange={(e) => setEditCategoryParentId(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary me-2">{translate('update_category')}</button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditingCategory(null)}>{translate('cancel')}</button>
            </form>
          </div>
        </div>
      )}

      {/* Categories List */}
      <h2>{translate('existing_categories')}</h2>
      {categories.length === 0 ? (
        <div className="alert alert-info">{translate('no_categories_found')}</div>
      ) : (
        <ul className="list-group">
          {categories.map((category) => (
            <li key={category.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h5>{category.name}</h5>
                <small className="text-muted">ID: {category.id} | {translate('parent_id')}: {category.parent_id || translate('none')}</small>
              </div>
              <div>
                <button onClick={() => handleEditClick(category)} className="btn btn-warning btn-sm me-2">{translate('edit')}</button>
                <button onClick={() => handleDeleteCategory(category.id)} className="btn btn-danger btn-sm">{translate('delete')}</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryManagementPage;
