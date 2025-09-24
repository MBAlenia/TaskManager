import React, { memo } from 'react';
import authService from '../services/authService';
import { useLanguage } from '../context/LanguageContext';
import { Task, Category, User } from '../types';

interface TaskCardProps {
  task: Task;
  categories: Category[];
  users: User[];
  currentUserLevel: number;
  currentUserId: number;
  userIsAdmin: boolean;
  expandedTaskComments: number | null;
  commentsByTaskId: { [taskId: number]: any[] };
  newCommentContent: string;
  onAssignToMe: (taskId: number) => void;
  onUnassignMe: (taskId: number) => void;
  onCompleteTask: (taskId: number) => void;
  onValidateTask: (taskId: number) => void;
  onEditClick: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
  onToggleComments: (taskId: number) => void;
  onCommentChange: (content: string) => void;
  onCreateComment: (taskId: number, commentText: string) => void;
  canEditTask: (task: Task) => boolean;
  canDeleteTask: (task: Task) => boolean;
  isTaskEditableByAssignee: (task: Task) => boolean;
}

const TaskCard: React.FC<TaskCardProps> = memo(({
  task,
  categories,
  users,
  currentUserLevel,
  currentUserId,
  userIsAdmin,
  expandedTaskComments,
  commentsByTaskId,
  newCommentContent,
  onAssignToMe,
  onUnassignMe,
  onCompleteTask,
  onValidateTask,
  onEditClick,
  onDeleteTask,
  onToggleComments,
  onCommentChange,
  onCreateComment,
  canEditTask,
  canDeleteTask,
  isTaskEditableByAssignee
}) => {
  const { translate } = useLanguage();

  // Helper function to get status class
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'fermé':
        return 'list-group-item-success';
      case 'pending_validation':
        return 'list-group-item-warning';
      case 'rejeté':
        return 'list-group-item-danger';
      default:
        return !task.assignee_id ? 'list-group-item-info' : '';
    }
  };

  return (
    <div className="col-lg-6 col-xl-4 mb-4">
      <div className={`card h-100 ${getStatusClass(task.status)}`}>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{task.title}</h5>
          <p className="card-text flex-grow-1">{task.description}</p>
          <div className="mb-3">
            <small className="text-muted d-block">
              <strong>Points:</strong> {task.points} | <strong>Level:</strong> {task.level}
            </small>
            <small className="text-muted d-block">
              <strong>Status:</strong> {task.status}
            </small>
            {task.category_id && (
              <small className="text-muted d-block">
                <strong>Category:</strong> {categories.find(cat => cat.id === task.category_id)?.name || task.category_id}
              </small>
            )}
            {task.assignee_id && (
              <small className="text-muted d-block">
                <strong>Assignee:</strong> {users.find(user => user.id === task.assignee_id)?.username || `User ${task.assignee_id}`}
              </small>
            )}
            {task.due_date && (
              <small className="text-muted d-block">
                <strong>Due:</strong> {new Date(task.due_date).toLocaleDateString()}
              </small>
            )}
          </div>
          <div className="mt-auto">
            <div className="d-flex flex-wrap gap-2">
              {!task.assignee_id && (
                <button 
                  onClick={() => onAssignToMe(task.id)} 
                  className="btn btn-primary btn-sm" 
                  disabled={task.level > currentUserLevel}
                  title={task.level > currentUserLevel ? "Task level is higher than your level" : "Assign to me"}
                >
                  Assign to Me
                </button>
              )}
              {task.assignee_id === authService.getCurrentUserId() && (
                <button 
                  onClick={() => onUnassignMe(task.id)} 
                  className="btn btn-secondary btn-sm"
                >
                  Unassign Me
                </button>
              )}
              {(task.creator_id === currentUserId || userIsAdmin) && task.assignee_id && task.status !== 'fermé' && (
                <button 
                  onClick={() => onCompleteTask(task.id)} 
                  className="btn btn-success btn-sm"
                >
                  Mark as Complete
                </button>
              )}
              {userIsAdmin && task.status === 'pending_validation' && (
                <button 
                  onClick={() => onValidateTask(task.id)} 
                  className="btn btn-success btn-sm"
                >
                  Validate Task
                </button>
              )}
              <button 
                onClick={() => onEditClick(task)} 
                className="btn btn-warning btn-sm" 
                disabled={!canEditTask(task)}
                title={!canEditTask(task) ? "You don't have permission to edit this task" : "Edit task"}
              >
                Edit
              </button>
              <button 
                onClick={() => onDeleteTask(task.id)} 
                className="btn btn-danger btn-sm" 
                disabled={!canDeleteTask(task)}
                title={!canDeleteTask(task) ? "You don't have permission to delete this task" : "Delete task"}
              >
                Delete
              </button>
            </div>
            <div className="mt-2">
              <button 
                onClick={() => onToggleComments(task.id)} 
                className="btn btn-outline-primary btn-sm w-100"
              >
                {expandedTaskComments === task.id ? 'Hide Comments' : 'Show Comments'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {expandedTaskComments === task.id && (
        <div className="card mt-2">
          <div className="card-body">
            <h6>Comments:</h6>
            {commentsByTaskId[task.id] && commentsByTaskId[task.id].length > 0 ? (
              <ul className="list-group list-group-flush">
                {commentsByTaskId[task.id].map(comment => (
                  <li key={comment.id} className="list-group-item">
                    <small className="text-muted">
                      {users.find(user => user.id === comment.user_id)?.username || `User ${comment.user_id}`} 
                      {' at '} 
                      {new Date(comment.created_at).toLocaleString()}
                    </small>
                    <p className="mb-0">{comment.content}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No comments yet.</p>
            )}
            <div className="mt-3">
              <label htmlFor={`comment-${task.id}`} className="form-label">Add a comment:</label>
              <textarea
                className="form-control mb-2"
                id={`comment-${task.id}`}
                placeholder="Add a comment..."
                value={newCommentContent}
                onChange={(e) => onCommentChange(e.target.value)}
                rows={2}
              ></textarea>
              <button 
                onClick={() => onCreateComment(task.id, newCommentContent)} 
                className="btn btn-primary btn-sm"
              >
                Add Comment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default TaskCard;