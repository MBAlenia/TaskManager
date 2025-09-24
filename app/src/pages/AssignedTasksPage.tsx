import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import authService from '../services/authService';
import taskService from '../services/taskService';
import categoryService from '../services/categoryService';
import userService from '../services/userService';
import { Task, Category, User } from '../types';

const AssignedTasksPage: React.FC = () => {
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for filtering and sorting
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<string>('desc');

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState<string>('');
  const [editTaskDescription, setEditTaskDescription] = useState<string>('');
  const [editTaskPoints, setEditTaskPoints] = useState<number>(0);
  const [editTaskLevel, setEditTaskLevel] = useState<number>(1);
  const [editTaskStatus, setEditTaskStatus] = useState<string>('');
  const [editTaskCategoryId, setEditTaskCategoryId] = useState<string>('');
  const [editTaskAssigneeId, setEditTaskAssigneeId] = useState<string>('');
  const [editTaskDueDate, setEditTaskDueDate] = useState<string>('');

  const userIsAdmin = authService.isAdmin();
  const currentUserId = authService.getCurrentUserId();

  const canEditTask = (task: Task) => {
    return userIsAdmin || task.creator_id === currentUserId || task.assignee_id === currentUserId;
  };

  const canDeleteTask = (task: Task) => {
    return userIsAdmin || task.creator_id === currentUserId;
  };

  const isTaskEditableByAssignee = (task: Task) => {
    return task.assignee_id === currentUserId && !userIsAdmin && task.creator_id !== currentUserId;
  };

  const fetchAssignedTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await taskService.getAssignedTasks({
        status: filterStatus || undefined,
        category_id: filterCategory ? parseInt(filterCategory) : undefined,
        sort_field: sortField,
        sort_order: sortOrder,
      });
      
      // Add null check for response
      if (response && response.data) {
        setTasks(response.data);
      }
    } catch (err: any) {
      setError('Failed to fetch assigned tasks.');
      console.error('Error fetching assigned tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterCategory, sortField, sortOrder]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoryService.getAllCategories();
      // Add null check for response
      if (response && response.data) {
        setCategories(response.data);
      }
    } catch (err: any) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    if (userIsAdmin) { // Only fetch users if admin
      try {
        const response = await userService.getAllUsers();
        // Add null check for response
        if (response && response.data) {
          setUsers(response.data);
        }
      } catch (err: any) {
        console.error('Error fetching users:', err);
      }
    }
  }, [userIsAdmin]);

  useEffect(() => {
    fetchAssignedTasks();
    fetchCategories();
    fetchUsers();
  }, [userIsAdmin, filterStatus, filterCategory, sortField, sortOrder, fetchAssignedTasks, fetchCategories, fetchUsers]);

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setEditTaskTitle(task.title);
    setEditTaskDescription(task.description);
    setEditTaskPoints(task.points);
    setEditTaskLevel(task.level);
    setEditTaskStatus(task.status);
    setEditTaskCategoryId(task.category_id ? task.category_id.toString() : '');
    setEditTaskAssigneeId(task.assignee_id ? task.assignee_id.toString() : '');
    setEditTaskDueDate(task.due_date ? task.due_date.split('T')[0] : '');
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    try {
      await taskService.updateTask(editingTask.id, {
        title: editTaskTitle,
        description: editTaskDescription,
        points: editTaskPoints,
        level: editTaskLevel,
        status: editTaskStatus,
        category_id: editTaskCategoryId ? parseInt(editTaskCategoryId) : null,
        assignee_id: editTaskAssigneeId ? parseInt(editTaskAssigneeId) : null,
        due_date: editTaskDueDate || null,
      });
      setEditingTask(null); // Exit edit mode
      fetchAssignedTasks(); // Refresh tasks after update
    } catch (err: any) {
      setError('Failed to update task.');
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId);
        fetchAssignedTasks(); // Refresh tasks after deletion
      } catch (err: any) {
        setError('Failed to delete task.');
        console.error('Error deleting task:', err);
      }
    }
  };

  const handleCompleteTask = async (taskId: number) => {
    if (window.confirm('Are you sure you want to mark this task as complete?')) {
      try {
        await taskService.completeTask(taskId);
        fetchAssignedTasks(); // Refresh tasks after completion
      } catch (err: any) {
        setError('Failed to complete task.');
        console.error('Error completing task:', err);
      }
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/'); // Redirect to login page after logout
  };

  if (loading) {
    return <div className="container mt-5">{translate('loading_tasks')}</div>;
  }

  if (error) {
    return <div className="container mt-5 alert alert-danger">{translate('error')}: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <h1>{translate('my_assigned_tasks_page_title')}</h1>
      <div className="mb-3">
        <Link to="/dashboard" className="btn btn-secondary me-2">{translate('back_to_dashboard')}</Link>
        <button onClick={handleLogout} className="btn btn-danger">{translate('logout')}</button>
      </div>

      {/* Filter and Sort Controls */}
      <div className="card mb-4">
        <div className="card-header">{translate('filter_and_sort_assigned_tasks')}</div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label htmlFor="filterStatus" className="form-label">{translate('status')}</label>
              <select
                className="form-select"
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">{translate('all')}</option>
                <option value="ouvert">{translate('open')}</option>
                <option value="fermé">{translate('closed')}</option>
                <option value="expiré">{translate('expired')}</option>
                <option value="rejeté">{translate('rejected')}</option>
                <option value="abandonné">{translate('abandoned')}</option>
                <option value="reporté">{translate('deferred')}</option>
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="filterCategory" className="form-label">{translate('category')}</label>
              <select
                className="form-select"
                id="filterCategory"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">{translate('all')}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="sortField" className="form-label">{translate('sort_by')}</label>
              <select
                className="form-select"
                id="sortField"
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
              >
                <option value="created_at">{translate('created_at')}</option>
                <option value="due_date">{translate('due_date')}</option>
                <option value="points">{translate('points_label')}</option>
                <option value="level">{translate('level_label')}</option>
                <option value="title">{translate('title_sort')}</option>
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="sortOrder" className="form-label">{translate('sort_order')}</label>
              <select
                className="form-select"
                id="sortOrder"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="desc">{translate('descending')}</option>
                <option value="asc">{translate('ascending')}</option>
              </select>
            </div>
            <div className="col-12">
              <button className="btn btn-primary" onClick={fetchAssignedTasks}>{translate('apply_filters_sort')}</button>
            </div>
          </div>
        </div>
      </div>

      {editingTask && (
        <div className="card mb-4">
          <div className="card-header">{translate('edit_task')}</div>
          <div className="card-body">
            <form onSubmit={handleUpdateTask}>
              <div className="mb-3">
                <label htmlFor="editTaskTitle" className="form-label">{translate('title')}</label>
                <input
                  type="text"
                  className="form-control"
                  id="editTaskTitle"
                  value={editTaskTitle}
                  onChange={(e) => setEditTaskTitle(e.target.value)}
                  required
                  disabled={isTaskEditableByAssignee(editingTask)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="editTaskDescription" className="form-label">{translate('description')}</label>
                <textarea
                  className="form-control"
                  id="editTaskDescription"
                  value={editTaskDescription}
                  onChange={(e) => setEditTaskDescription(e.target.value)}
                  disabled={isTaskEditableByAssignee(editingTask)}
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="editTaskPoints" className="form-label">{translate('points_label')}</label>
                <input
                  type="number"
                  className="form-control"
                  id="editTaskPoints"
                  value={editTaskPoints}
                  onChange={(e) => setEditTaskPoints(parseInt(e.target.value))}
                  required
                  disabled={isTaskEditableByAssignee(editingTask)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="editTaskLevel" className="form-label">{translate('level_label')}</label>
                <input
                  type="number"
                  className="form-control"
                  id="editTaskLevel"
                  value={editTaskLevel}
                  onChange={(e) => setEditTaskLevel(parseInt(e.target.value))}
                  required
                  disabled={isTaskEditableByAssignee(editingTask)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="editTaskStatus" className="form-label">{translate('status')}</label>
                <select
                  className="form-select"
                  id="editTaskStatus"
                  value={editTaskStatus}
                  onChange={(e) => setEditTaskStatus(e.target.value)}
                >
                  <option value="ouvert">{translate('open')}</option>
                  <option value="fermé">{translate('closed')}</option>
                  <option value="expiré">{translate('expired')}</option>
                  <option value="rejeté">{translate('rejected')}</option>
                  <option value="abandonné">{translate('abandoned')}</option>
                  <option value="reporté">{translate('deferred')}</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="editTaskCategory" className="form-label">{translate('category')}</label>
                <select
                  className="form-select"
                  id="editTaskCategory"
                  value={editTaskCategoryId}
                  onChange={(e) => setEditTaskCategoryId(e.target.value)}
                  disabled={isTaskEditableByAssignee(editingTask)}
                >
                  <option value="">{translate('select_category_optional')}</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="editTaskAssignee" className="form-label">{translate('assignee')}</label>
                <select
                  className="form-select"
                  id="editTaskAssignee"
                  value={editTaskAssigneeId}
                  onChange={(e) => setEditTaskAssigneeId(e.target.value)}
                  disabled={isTaskEditableByAssignee(editingTask)}
                >
                  <option value="">{translate('select_assignee_optional')}</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="editTaskDueDate" className="form-label">{translate('due_date')}</label>
                <input
                  type="date"
                  className="form-control"
                  id="editTaskDueDate"
                  value={editTaskDueDate}
                  onChange={(e) => setEditTaskDueDate(e.target.value)}
                  disabled={isTaskEditableByAssignee(editingTask)}
                />
              </div>
              <button type="submit" className="btn btn-primary me-2">{translate('update_task')}</button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditingTask(null)}>{translate('cancel')}</button>
            </form>
          </div>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="alert alert-info">{translate('no_tasks_assigned_to_you')}</div>
      ) : (
        <ul className="list-group">
          {tasks.map((task) => (
            <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h5>{task.title}</h5>
                <p className="mb-1">{task.description}</p>
                <small className="text-muted">
                  {translate('points_label')}: {task.points} | {translate('level_label')}: {task.level} | {translate('status')}: {task.status}
                  {task.category_id ? ` | ${translate('category')}: ${categories.find(cat => cat.id === task.category_id)?.name || task.category_id}` : ''}
                  {task.assignee_id ? ` | ${translate('assignee')}: ${users.find(user => user.id === task.assignee_id)?.username || task.assignee_id}` : ''}
                  {task.due_date ? ` | ${translate('due_date')}: ${new Date(task.due_date).toLocaleDateString()}` : ''}
                </small>
              </div>
              <div>
                <button onClick={() => handleEditClick(task)} className="btn btn-warning btn-sm me-2" disabled={!canEditTask(task)}>{translate('edit')}</button>
                {(task.creator_id === currentUserId || userIsAdmin) && task.assignee_id === currentUserId && task.status !== 'fermé' && (
                  <button onClick={() => handleCompleteTask(task.id)} className="btn btn-success btn-sm me-2">{translate('mark_as_complete')}</button>
                )}
                <button onClick={() => handleDeleteTask(task.id)} className="btn btn-danger btn-sm" disabled={!canDeleteTask(task)}>{translate('delete')}</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AssignedTasksPage;
