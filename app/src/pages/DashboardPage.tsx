import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import authService from '../services/authService';
import taskService from '../services/taskService';
import categoryService from '../services/categoryService';
import userService from '../services/userService';
import commentService from '../services/commentService';
import HelpModal from '../components/HelpModal';
import TaskCard from '../components/TaskCard';
import { Task, Category, User, Comment } from '../types';

const DashboardPage: React.FC = () => {
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskDescription, setNewTaskDescription] = useState<string>('');
  const [newTaskPoints, setNewTaskPoints] = useState<number>(0);
  const [newTaskLevel, setNewTaskLevel] = useState<number>(1);
  const [newTaskCategoryId, setNewTaskCategoryId] = useState<string>('');
  const [newTaskDueDate, setNewTaskDueDate] = useState<string>('');

  // Form validation states
  const [newTaskTitleError, setNewTaskTitleError] = useState<string>('');
  const [newTaskPointsError, setNewTaskPointsError] = useState<string>('');
  const [newTaskLevelError, setNewTaskLevelError] = useState<string>('');

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState<string>('');
  const [editTaskDescription, setEditTaskDescription] = useState<string>('');
  const [editTaskPoints, setEditTaskPoints] = useState<number>(0);
  const [editTaskLevel, setEditTaskLevel] = useState<number>(1);
  const [editTaskStatus, setEditTaskStatus] = useState<string>('');
  const [editTaskCategoryId, setEditTaskCategoryId] = useState<string>('');
  const [editTaskAssigneeId, setEditTaskAssigneeId] = useState<string>('');
  const [editTaskDueDate, setEditTaskDueDate] = useState<string>('');

  // Edit form validation states
  const [editTaskTitleError, setEditTaskTitleError] = useState<string>('');
  const [editTaskPointsError, setEditTaskPointsError] = useState<string>('');
  const [editTaskLevelError, setEditTaskLevelError] = useState<string>('');

  const [commentsByTaskId, setCommentsByTaskId] = useState<{ [taskId: number]: Comment[] }>({});
  const [newCommentContent, setNewCommentContent] = useState<string>('');
  const [expandedTaskComments, setExpandedTaskComments] = useState<number | null>(null);
  const [showCompletionAnimation, setShowCompletionAnimation] = useState<boolean>(false);
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState<boolean>(false);
  const [levelUpMessage, setLevelUpMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [newTaskAutoSave, setNewTaskAutoSave] = useState<boolean>(false);
  const [editTaskAutoSave, setEditTaskAutoSave] = useState<boolean>(false);

  // Comment editing states
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentText, setEditingCommentText] = useState<string>('');

  // State for filtering and sorting
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterAssignee, setFilterAssignee] = useState<string>('');
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const userIsAdmin = authService.isAdmin();
  const currentUserId = authService.getCurrentUserId();
  const currentUserLevel = authService.getCurrentUserLevel();

  // Check if it's the user's first visit
  useEffect(() => {
    const isFirstVisit = localStorage.getItem('taskquest_first_visit') !== 'false';
    if (isFirstVisit) {
      setShowHelpModal(true);
      localStorage.setItem('taskquest_first_visit', 'false');
    }
  }, []);

  // Fetch tasks, categories, and users
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch tasks, categories, and users in parallel
        const [tasksResponse, categoriesResponse] = await Promise.all([
          taskService.getTasks(),
          categoryService.getAllCategories()
        ]);
        
        // Add null checks for responses
        if (tasksResponse && tasksResponse.data) {
          setTasks(tasksResponse.data);
        }
        if (categoriesResponse && categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        }

        // Only fetch users if the current user is an admin
        if (authService.isAdmin()) {
          const usersResponse = await userService.getAllUsers();
          if (usersResponse && usersResponse.data) {
            setUsers(usersResponse.data);
          }
        }
      } catch (err) {
        setError('Failed to load data.');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Listen for keyboard shortcut event
  useEffect(() => {
    const handleCreateNewTask = () => {
      setShowCreateForm(true);
    };

    window.addEventListener('createNewTask', handleCreateNewTask);
    return () => {
      window.removeEventListener('createNewTask', handleCreateNewTask);
    };
  }, []);

  // Auto-save for new task form
  useEffect(() => {
    if (newTaskAutoSave && showCreateForm) {
      const timer = setTimeout(() => {
        localStorage.setItem('taskquest_new_task_draft', JSON.stringify({
          title: newTaskTitle,
          description: newTaskDescription,
          points: newTaskPoints,
          level: newTaskLevel,
          categoryId: newTaskCategoryId,
          dueDate: newTaskDueDate
        }));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [newTaskAutoSave, showCreateForm, newTaskTitle, newTaskDescription, newTaskPoints, newTaskLevel, newTaskCategoryId, newTaskDueDate]);

  // Auto-save for edit task form
  useEffect(() => {
    if (editTaskAutoSave && editingTask) {
      const timer = setTimeout(() => {
        localStorage.setItem('taskquest_edit_task_draft', JSON.stringify({
          taskId: editingTask.id,
          title: editTaskTitle,
          description: editTaskDescription,
          points: editTaskPoints,
          level: editTaskLevel,
          status: editTaskStatus,
          categoryId: editTaskCategoryId,
          assigneeId: editTaskAssigneeId,
          dueDate: editTaskDueDate
        }));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [editTaskAutoSave, editingTask, editTaskTitle, editTaskDescription, editTaskPoints, editTaskLevel, editTaskStatus, editTaskCategoryId, editTaskAssigneeId, editTaskDueDate]);

  // Load draft on component mount
  useEffect(() => {
    const newTaskDraft = localStorage.getItem('taskquest_new_task_draft');
    if (newTaskDraft) {
      try {
        const draft = JSON.parse(newTaskDraft);
        setNewTaskTitle(draft.title || '');
        setNewTaskDescription(draft.description || '');
        setNewTaskPoints(draft.points || 0);
        setNewTaskLevel(draft.level || 1);
        setNewTaskCategoryId(draft.categoryId || '');
        setNewTaskDueDate(draft.dueDate || '');
      } catch (e) {
        console.error('Failed to parse new task draft', e);
      }
    }

    const editTaskDraft = localStorage.getItem('taskquest_edit_task_draft');
    if (editTaskDraft) {
      try {
        const draft = JSON.parse(editTaskDraft);
        // We'll only load the draft if we're editing the same task
        if (editingTask && editingTask.id === draft.taskId) {
          setEditTaskTitle(draft.title || '');
          setEditTaskDescription(draft.description || '');
          setEditTaskPoints(draft.points || 0);
          setEditTaskLevel(draft.level || 1);
          setEditTaskStatus(draft.status || 'ouvert');
          setEditTaskCategoryId(draft.categoryId || '');
          setEditTaskAssigneeId(draft.assigneeId || '');
          setEditTaskDueDate(draft.dueDate || '');
        }
      } catch (e) {
        console.error('Failed to parse edit task draft', e);
      }
    }
  }, []);

  // Validate form inputs
  const validateCreateTaskForm = () => {
    let isValid = true;

    if (!newTaskTitle) {
      setNewTaskTitleError('Title is required.');
      isValid = false;
    } else {
      setNewTaskTitleError('');
    }

    if (newTaskPoints < 0) {
      setNewTaskPointsError('Points must be non-negative.');
      isValid = false;
    } else {
      setNewTaskPointsError('');
    }

    if (newTaskLevel < 1) {
      setNewTaskLevelError('Level must be at least 1.');
      isValid = false;
    } else {
      setNewTaskLevelError('');
    }

    return isValid;
  };

  const validateEditTaskForm = () => {
    let isValid = true;

    if (!editTaskTitle) {
      setEditTaskTitleError('Title is required.');
      isValid = false;
    } else {
      setEditTaskTitleError('');
    }

    if (editTaskPoints < 0) {
      setEditTaskPointsError('Points must be non-negative.');
      isValid = false;
    } else {
      setEditTaskPointsError('');
    }

    if (editTaskLevel < 1) {
      setEditTaskLevelError('Level must be at least 1.');
      isValid = false;
    } else {
      setEditTaskLevelError('');
    }

    return isValid;
  };

  // Handle task creation
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCreateTaskForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    try {
      await taskService.createTask(
        newTaskTitle,
        newTaskDescription,
        newTaskPoints,
        newTaskLevel,
        newTaskCategoryId ? parseInt(newTaskCategoryId) : null,
        newTaskDueDate || null
      );

      // Reset form
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskPoints(0);
      setNewTaskLevel(1);
      setNewTaskCategoryId('');
      setNewTaskDueDate('');
      setShowCreateForm(false);

      // Refresh tasks after creation
      const tasksResponse = await taskService.getTasks();
      if (tasksResponse && tasksResponse.data) {
        setTasks(tasksResponse.data);
      }
    } catch (err: any) {
      setError('Failed to create task.');
      console.error('Error creating task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle task editing
  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setEditTaskTitle(task.title);
    setEditTaskDescription(task.description);
    setEditTaskPoints(task.points);
    setEditTaskLevel(task.level);
    setEditTaskStatus(task.status);
    setEditTaskCategoryId(task.category_id?.toString() || '');
    setEditTaskAssigneeId(task.assignee_id?.toString() || '');
    setEditTaskDueDate(task.due_date || '');
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    if (!validateEditTaskForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    try {
      await taskService.updateTask(editingTask.id, {
        title: editTaskTitle,
        description: editTaskDescription,
        points: editTaskPoints,
        level: editTaskLevel,
        category_id: editTaskCategoryId ? parseInt(editTaskCategoryId) : undefined,
        due_date: editTaskDueDate || undefined,
      });

      setEditingTask(null);

      // Refresh tasks after update
      const tasksResponse = await taskService.getTasks();
      if (tasksResponse && tasksResponse.data) {
        setTasks(tasksResponse.data);
      }
    } catch (err: any) {
      setError('Failed to update task.');
      console.error('Error updating task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId: number) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError('Failed to delete task.');
      console.error('Error deleting task:', err);
    }
  };

  // Handle task completion
  const handleCompleteTask = async (taskId: number) => {
    try {
      await taskService.completeTask(taskId);
      
      // Refresh tasks after completion
      const tasksResponse = await taskService.getTasks();
      if (tasksResponse && tasksResponse.data) {
        setTasks(tasksResponse.data);
      }

      setShowCompletionAnimation(true);
      setTimeout(() => setShowCompletionAnimation(false), 3000);

      // Check for level up
      const userResponse = await userService.getCurrentUser();
      if (userResponse && userResponse.data) {
        const userData = userResponse.data;
        authService.saveUserData(
          localStorage.getItem('userToken') || '',
          userData.level,
          userData.points
        );
        
        // Update localStorage directly instead of using userContext
        localStorage.setItem('userLevel', userData.level.toString());
        localStorage.setItem('userPoints', userData.points.toString());
      }
    } catch (err) {
      setError('Failed to complete task.');
      console.error('Error completing task:', err);
    }
  };

  // Handle task validation (admin only)
  const handleValidateTask = async (taskId: number) => {
    try {
      await taskService.validateTask(taskId);
      
      // Refresh tasks after validation
      const tasksResponse = await taskService.getTasks();
      if (tasksResponse && tasksResponse.data) {
        setTasks(tasksResponse.data);
      }
    } catch (err) {
      setError('Failed to validate task.');
      console.error('Error validating task:', err);
    }
  };

  // Handle task assignment (admin only)
  const handleAssignTask = async (taskId: number) => {
    try {
      await taskService.assignTask(taskId);
      
      // Refresh tasks after assignment
      const tasksResponse = await taskService.getTasks();
      if (tasksResponse && tasksResponse.data) {
        setTasks(tasksResponse.data);
      }
    } catch (err) {
      setError('Failed to assign task.');
      console.error('Error assigning task:', err);
    }
  };

  // Handle task unassignment
  const handleUnassignTask = async (taskId: number) => {
    try {
      await taskService.unassignTask(taskId);
      
      // Refresh tasks after unassignment
      const tasksResponse = await taskService.getTasks();
      if (tasksResponse && tasksResponse.data) {
        setTasks(tasksResponse.data);
      }
    } catch (err) {
      setError('Failed to unassign task.');
      console.error('Error unassigning task:', err);
    }
  };

  // Handle task assignment to current user
  const handleAssignToMe = async (taskId: number) => {
    if (!currentUserId) return;
    
    try {
      await taskService.assignTask(taskId);
      
      // Refresh tasks after assignment
      const tasksResponse = await taskService.getTasks();
      if (tasksResponse && tasksResponse.data) {
        setTasks(tasksResponse.data);
      }
    } catch (err) {
      setError('Failed to assign task.');
      console.error('Error assigning task:', err);
    }
  };

  // Handle task unassignment
  const handleUnassignMe = async (taskId: number) => {
    try {
      await taskService.unassignTask(taskId);
      
      // Refresh tasks after unassignment
      const tasksResponse = await taskService.getTasks();
      if (tasksResponse && tasksResponse.data) {
        setTasks(tasksResponse.data);
      }
    } catch (err) {
      setError('Failed to unassign task.');
      console.error('Error unassigning task:', err);
    }
  };

  // Handle comment creation
  const handleCreateComment = async (taskId: number, commentText: string) => {
    if (!commentText.trim()) return;

    try {
      const response = await commentService.createComment(taskId, commentText);
      if (response && response.data) {
        setCommentsByTaskId(prev => ({
          ...prev,
          [taskId]: [...(prev[taskId] || []), response.data]
        }));
      }
      setNewCommentContent(''); // Clear the comment input
    } catch (err) {
      setError('Failed to add comment.');
      console.error('Error adding comment:', err);
    }
  };

  // Handle comment deletion
  const handleDeleteComment = async (commentId: number, taskId: number) => {
    try {
      await commentService.deleteComment(commentId);
      setCommentsByTaskId(prev => ({
        ...prev,
        [taskId]: (prev[taskId] || []).filter(comment => comment.id !== commentId)
      }));
    } catch (err) {
      setError('Failed to delete comment.');
      console.error('Error deleting comment:', err);
    }
  };

  // Handle comment editing
  const handleEditComment = async (commentId: number, taskId: number, newText: string) => {
    if (!newText.trim()) return;

    try {
      const response = await commentService.updateComment(commentId, newText);
      if (response && response.data) {
        setCommentsByTaskId(prev => ({
          ...prev,
          [taskId]: (prev[taskId] || []).map(comment =>
            comment.id === commentId ? response.data : comment
          )
        }));
      }
      setEditingCommentId(null);
      setEditingCommentText('');
    } catch (err) {
      setError('Failed to update comment.');
      console.error('Error updating comment:', err);
    }
  };

  // Toggle comments visibility
  const handleToggleComments = (taskId: number) => {
    setExpandedTaskComments(expandedTaskComments === taskId ? null : taskId);
    
    // Load comments if not already loaded
    if (expandedTaskComments !== taskId && !commentsByTaskId[taskId]) {
      commentService.getCommentsByTaskId(taskId)
        .then(response => {
          // Add null check for response
          if (response && response.data) {
            setCommentsByTaskId(prev => ({
              ...prev,
              [taskId]: response.data
            }));
          }
        })
        .catch(err => {
          setError('Failed to load comments.');
          console.error('Error loading comments:', err);
        });
    }
  };

  // Handle logout
  const handleLogout = () => {
    authService.logout();
    navigate('/'); // Redirect to login page
  };

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter(task => {
      // Search term filter
      if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(lowerSearch);
        const matchesDescription = task.description.toLowerCase().includes(lowerSearch);
        const matchesCategory = categories.find(cat => cat.id === task.category_id)?.name?.toLowerCase().includes(lowerSearch);
        if (!matchesTitle && !matchesDescription && !matchesCategory) {
          return false;
        }
      }
      
      // Status filter
      if (filterStatus && task.status !== filterStatus) {
        return false;
      }
      
      // Category filter
      if (filterCategory && task.category_id !== parseInt(filterCategory)) {
        return false;
      }
      
      // Assignee filter (admin only)
      if (filterAssignee && task.assignee_id !== parseInt(filterAssignee)) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'due_date':
          aValue = a.due_date ? new Date(a.due_date).getTime() : 0;
          bValue = b.due_date ? new Date(b.due_date).getTime() : 0;
          break;
        case 'points':
          aValue = a.points;
          bValue = b.points;
          break;
        case 'level':
          aValue = a.level;
          bValue = b.level;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default: // created_at
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Check if user can edit a task
  const canEditTask = (task: Task) => {
    // Admins can edit any task
    if (userIsAdmin) return true;
    
    // Task creator can edit their own tasks
    if (task.creator_id === currentUserId) return true;
    
    // Assignee can edit if task is open
    if (task.assignee_id === currentUserId && task.status === 'ouvert') return true;
    
    return false;
  };

  // Check if user can delete a task
  const canDeleteTask = (task: Task) => {
    // Admins can delete any task
    if (userIsAdmin) return true;
    
    // Task creator can delete their own tasks
    if (task.creator_id === currentUserId) return true;
    
    return false;
  };

  // Check if task is editable by assignee
  const isTaskEditableByAssignee = (task: Task) => {
    return task.assignee_id === currentUserId && task.status === 'ouvert';
  };

  if (loading) {
    return <div className="container mt-5">{translate('loading_tasks')}</div>;
  }

  if (error) {
    return <div className="container mt-5 alert alert-danger">Error: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
      
      {showCompletionAnimation && (
        <div className="completion-animation">
          <i className="bi bi-check-circle-fill"></i> Task Completed!
        </div>
      )}

      {showLevelUpAnimation && (
        <div className="level-up-animation">
          <h2>{levelUpMessage}</h2>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h1>{translate('dashboard')}</h1>
        <div className="mt-2 mt-md-0">
          <Link to="/profile" className="btn btn-outline-secondary me-2 mb-2 mb-md-0">
            {translate('user_profile')}
          </Link>
          {userIsAdmin && (
            <Link to="/admin" className="btn btn-info me-2 mb-2 mb-md-0">{translate('admin_dashboard')}</Link>
          )}
          <button 
            onClick={() => setShowCreateForm(!showCreateForm)} 
            className="btn btn-success me-2 mb-2 mb-md-0"
          >
            {showCreateForm ? translate('cancel') : translate('create_new_task')}
          </button>
          <Link to="/assigned-tasks" className="btn btn-primary me-2 mb-2 mb-md-0">{translate('my_assigned_tasks')}</Link>
          <button 
            onClick={() => setShowHelpModal(true)} 
            className="btn btn-outline-info me-2 mb-2 mb-md-0"
            title="Show help (Ctrl/Cmd + H)"
          >
            ?
          </button>
          <button onClick={handleLogout} className="btn btn-danger mb-2 mb-md-0">{translate('logout')}</button>
        </div>
      </div>

      {/* Search and Summary Cards */}
      <div className="row mb-4">
        <div className="col-12 mb-3">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              id="task-search"
              placeholder="Search tasks by title, description, or category... (Ctrl/Cmd + K)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="btn btn-outline-secondary" 
                type="button"
                onClick={() => setSearchTerm('')}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Total Tasks</h5>
              <p className="card-text display-4">{tasks.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Assigned to Me</h5>
              <p className="card-text display-4">{tasks.filter(t => t.assignee_id === currentUserId).length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Completed</h5>
              <p className="card-text display-4">{tasks.filter(t => t.status === 'fermé').length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">My Level</h5>
              <p className="card-text display-4">{currentUserLevel}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Sort Controls */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span>Filter and Sort Tasks</span>
          <button 
            className="btn btn-sm btn-outline-primary"
            onClick={() => {
              setFilterStatus('');
              setFilterCategory('');
              setFilterAssignee('');
              setSortField('created_at');
              setSortOrder('desc');
            }}
          >
            Reset Filters
          </button>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label htmlFor="filterStatus" className="form-label">Status</label>
              <select
                className="form-select"
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All</option>
                <option value="ouvert">Open</option>
                <option value="fermé">Closed</option>
                <option value="expiré">Expired</option>
                <option value="rejeté">Rejected</option>
                <option value="abandonné">Abandoned</option>
                <option value="reporté">Deferred</option>
                <option value="pending_validation">Pending Validation</option>
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="filterCategory" className="form-label">Category</label>
              <select
                className="form-select"
                id="filterCategory"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="filterAssignee" className="form-label">Assignee</label>
              <select
                className="form-select"
                id="filterAssignee"
                value={filterAssignee}
                onChange={(e) => setFilterAssignee(e.target.value)}
                disabled={!authService.isAdmin()}
              >
                <option value="">All</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
              {!authService.isAdmin() && (
                <small className="text-muted">Only admins can filter by assignee</small>
              )}
            </div>
            <div className="col-md-4">
              <label htmlFor="sortField" className="form-label">Sort By</label>
              <select
                className="form-select"
                id="sortField"
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
              >
                <option value="created_at">Created At</option>
                <option value="due_date">Due Date</option>
                <option value="points">Points</option>
                <option value="level">Level</option>
                <option value="title">Title</option>
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="sortOrder" className="form-label">Sort Order</label>
              <select
                className="form-select"
                id="sortOrder"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
            <div className="col-12">
              <button 
                className="btn btn-primary" 
                onClick={async () => {
                  try {
                    const tasksResponse = await taskService.getTasks({
                      status: filterStatus || undefined,
                      category_id: filterCategory ? parseInt(filterCategory) : undefined,
                      assignee_id: filterAssignee ? parseInt(filterAssignee) : undefined,
                      sort_field: sortField,
                      sort_order: sortOrder,
                    });
                    // Add null check for tasksResponse
                    if (tasksResponse && tasksResponse.data) {
                      setTasks(tasksResponse.data);
                    }
                  } catch (err) {
                    setError('Failed to filter tasks.');
                    console.error('Error filtering tasks:', err);
                  }
                }}
              >
                Apply Filters & Sort
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Task Form */}
      {showCreateForm && (
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <span>Create New Task</span>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="autoSaveNewTask"
                checked={newTaskAutoSave}
                onChange={(e) => setNewTaskAutoSave(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="autoSaveNewTask">
                Auto-save draft
              </label>
            </div>
          </div>
          <div className="card-body">
            {newTaskAutoSave && (
              <div className="alert alert-info">
                <i className="bi bi-info-circle"></i> Draft will be automatically saved as you type
              </div>
            )}
            <form onSubmit={handleCreateTask}>
              <div className="mb-3">
                <label htmlFor="taskTitle" className="form-label">Title *</label>
                <input
                  type="text"
                  className={`form-control ${newTaskTitleError ? 'is-invalid' : ''}`}
                  id="taskTitle"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  required
                  aria-describedby="taskTitleError"
                />
                {newTaskTitleError && <div className="invalid-feedback" id="taskTitleError">{newTaskTitleError}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="taskDescription" className="form-label">Description</label>
                <textarea
                  className="form-control"
                  id="taskDescription"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  rows={3}
                ></textarea>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="taskPoints" className="form-label">Points *</label>
                  <input
                    type="number"
                    className={`form-control ${newTaskPointsError ? 'is-invalid' : ''}`}
                    id="taskPoints"
                    value={newTaskPoints}
                    onChange={(e) => setNewTaskPoints(parseInt(e.target.value) || 0)}
                    min="0"
                    required
                    aria-describedby="taskPointsError"
                  />
                  {newTaskPointsError && <div className="invalid-feedback" id="taskPointsError">{newTaskPointsError}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="taskLevel" className="form-label">Level *</label>
                  <input
                    type="number"
                    className={`form-control ${newTaskLevelError ? 'is-invalid' : ''}`}
                    id="taskLevel"
                    value={newTaskLevel}
                    onChange={(e) => setNewTaskLevel(parseInt(e.target.value) || 1)}
                    min="1"
                    required
                    aria-describedby="taskLevelError"
                  />
                  {newTaskLevelError && <div className="invalid-feedback" id="taskLevelError">{newTaskLevelError}</div>}
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="taskCategory" className="form-label">Category</label>
                  <select
                    className="form-select"
                    id="taskCategory"
                    value={newTaskCategoryId}
                    onChange={(e) => setNewTaskCategoryId(e.target.value)}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="taskDueDate" className="form-label">Due Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="taskDueDate"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end">
                <button 
                  type="submit" 
                  className="btn btn-success"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                      Creating...
                    </>
                  ) : (
                    'Create Task'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Form */}
      {editingTask && (
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <span>Edit Task</span>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="autoSaveEditTask"
                checked={editTaskAutoSave}
                onChange={(e) => setEditTaskAutoSave(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="autoSaveEditTask">
                Auto-save draft
              </label>
            </div>
          </div>
          <div className="card-body">
            {editTaskAutoSave && (
              <div className="alert alert-info">
                <i className="bi bi-info-circle"></i> Draft will be automatically saved as you type
              </div>
            )}
            <form onSubmit={handleUpdateTask}>
              <div className="mb-3">
                <label htmlFor="editTaskTitle" className="form-label">Title *</label>
                <input
                  type="text"
                  className={`form-control ${editTaskTitleError ? 'is-invalid' : ''}`}
                  id="editTaskTitle"
                  value={editTaskTitle}
                  onChange={(e) => setEditTaskTitle(e.target.value)}
                  required
                  aria-describedby="editTaskTitleError"
                />
                {editTaskTitleError && <div className="invalid-feedback" id="editTaskTitleError">{editTaskTitleError}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="editTaskDescription" className="form-label">Description</label>
                <textarea
                  className="form-control"
                  id="editTaskDescription"
                  value={editTaskDescription}
                  onChange={(e) => setEditTaskDescription(e.target.value)}
                  rows={3}
                ></textarea>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="editTaskPoints" className="form-label">Points *</label>
                  <input
                    type="number"
                    className={`form-control ${editTaskPointsError ? 'is-invalid' : ''}`}
                    id="editTaskPoints"
                    value={editTaskPoints}
                    onChange={(e) => setEditTaskPoints(parseInt(e.target.value) || 0)}
                    min="0"
                    required
                    aria-describedby="editTaskPointsError"
                  />
                  {editTaskPointsError && <div className="invalid-feedback" id="editTaskPointsError">{editTaskPointsError}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="editTaskLevel" className="form-label">Level *</label>
                  <input
                    type="number"
                    className={`form-control ${editTaskLevelError ? 'is-invalid' : ''}`}
                    id="editTaskLevel"
                    value={editTaskLevel}
                    onChange={(e) => setEditTaskLevel(parseInt(e.target.value) || 1)}
                    min="1"
                    required
                    aria-describedby="editTaskLevelError"
                  />
                  {editTaskLevelError && <div className="invalid-feedback" id="editTaskLevelError">{editTaskLevelError}</div>}
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="editTaskStatus" className="form-label">Status</label>
                  <select
                    className="form-select"
                    id="editTaskStatus"
                    value={editTaskStatus}
                    onChange={(e) => setEditTaskStatus(e.target.value)}
                  >
                    <option value="ouvert">Open</option>
                    <option value="fermé">Closed</option>
                    <option value="expiré">Expired</option>
                    <option value="rejeté">Rejected</option>
                    <option value="abandonné">Abandoned</option>
                    <option value="reporté">Deferred</option>
                    <option value="pending_validation">Pending Validation</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="editTaskCategory" className="form-label">Category</label>
                  <select
                    className="form-select"
                    id="editTaskCategory"
                    value={editTaskCategoryId}
                    onChange={(e) => setEditTaskCategoryId(e.target.value)}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="editTaskAssignee" className="form-label">Assignee</label>
                  <select
                    className="form-select"
                    id="editTaskAssignee"
                    value={editTaskAssigneeId}
                    onChange={(e) => setEditTaskAssigneeId(e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.username}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="editTaskDueDate" className="form-label">Due Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="editTaskDueDate"
                    value={editTaskDueDate}
                    onChange={(e) => setEditTaskDueDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end">
                <button 
                  type="button" 
                  className="btn btn-secondary me-2"
                  onClick={() => setEditingTask(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                      Updating...
                    </>
                  ) : (
                    'Update Task'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="row">
        {filteredTasks.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info text-center">
              No tasks found. {searchTerm ? 'Try adjusting your search terms.' : 'Create a new task to get started!'}
            </div>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              categories={categories}
              users={users}
              currentUserLevel={currentUserLevel}
              currentUserId={currentUserId || 0}
              userIsAdmin={userIsAdmin}
              expandedTaskComments={expandedTaskComments}
              commentsByTaskId={commentsByTaskId}
              newCommentContent={newCommentContent}
              onAssignToMe={handleAssignToMe}
              onUnassignMe={handleUnassignMe}
              onCompleteTask={handleCompleteTask}
              onValidateTask={handleValidateTask}
              onEditClick={handleEditClick}
              onDeleteTask={handleDeleteTask}
              onToggleComments={handleToggleComments}
              onCommentChange={setNewCommentContent}
              onCreateComment={handleCreateComment}
              canEditTask={canEditTask}
              canDeleteTask={canDeleteTask}
              isTaskEditableByAssignee={isTaskEditableByAssignee}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardPage;