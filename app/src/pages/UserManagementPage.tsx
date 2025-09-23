import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import authService from '../services/authService';
import userService from '../services/userService';
import { User } from '../types';
import ChangePasswordForm from '../components/ChangePasswordForm';

const UserManagementPage: React.FC = () => {
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for editing users
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editUsername, setEditUsername] = useState<string>('');
  const [editLevel, setEditLevel] = useState<string>('');
  const [editPassword, setEditPassword] = useState<string>('');

  // State for creating new users
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [newLevel, setNewLevel] = useState<string>('1');

  // State for changing user passwords
  const [changingPasswordForUser, setChangingPasswordForUser] = useState<User | null>(null);

  useEffect(() => {
    if (!authService.isAdmin()) {
      navigate('/dashboard'); // Redirect if not admin
      return;
    }
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data);
    } catch (err: any) {
      setError('Failed to fetch users.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setEditUsername(user.username);
    setEditLevel(user.level.toString());
    setEditPassword(''); // Clear password field when editing
    setChangingPasswordForUser(null); // Close password change form if open
    setShowCreateForm(false); // Close create form if open
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const userData: any = {
        username: editUsername,
        level: parseInt(editLevel),
      };
      if (editPassword) {
        userData.password = editPassword;
      }
      await userService.updateUser(editingUser.id, userData);
      setEditingUser(null); // Exit edit mode
      fetchUsers(); // Refresh users after update
    } catch (err: any) {
      setError('Failed to update user.');
      console.error('Error updating user:', err);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(userId);
        fetchUsers(); // Refresh users after deletion
      } catch (err: any) {
        setError('Failed to delete user.');
        console.error('Error deleting user:', err);
      }
    }
  };

  // New function to handle creating users
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userService.createUser({
        username: newUsername,
        password: newPassword,
        level: parseInt(newLevel),
      });
      // Reset form fields
      setNewUsername('');
      setNewPassword('');
      setNewLevel('1');
      setShowCreateForm(false);
      fetchUsers(); // Refresh users after creation
    } catch (err: any) {
      setError('Failed to create user.');
      console.error('Error creating user:', err);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/'); // Redirect to login page after logout
  };

  if (loading) {
    return <div className="container mt-5">{translate('loading_users')}</div>;
  }

  if (error) {
    return <div className="container mt-5 alert alert-danger">{translate('error')}: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <h1>{translate('user_management')}</h1>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <Link to="/admin" className="btn btn-secondary">{translate('back_to_admin_dashboard')}</Link>
        <button onClick={handleLogout} className="btn btn-danger">{translate('logout')}</button>
      </div>

      {/* Create User Form */}
      {!showCreateForm ? (
        <button onClick={() => {
          setShowCreateForm(true);
          setEditingUser(null);
          setChangingPasswordForUser(null);
        }} className="btn btn-primary mb-3">
          {translate('create_new_user')}
        </button>
      ) : (
        <div className="card mb-4">
          <div className="card-header">{translate('create_new_user')}</div>
          <div className="card-body">
            <form onSubmit={handleCreateUser}>
              <div className="mb-3">
                <label htmlFor="newUsername" className="form-label">{translate('username')}</label>
                <input
                  type="text"
                  className="form-control"
                  id="newUsername"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">{translate('password')}</label>
                <input
                  type="password"
                  className="form-control"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="newLevel" className="form-label">{translate('level_label')}</label>
                <input
                  type="number"
                  className="form-control"
                  id="newLevel"
                  value={newLevel}
                  onChange={(e) => setNewLevel(e.target.value)}
                  min="1"
                  max="10"
                />
              </div>
              <button type="submit" className="btn btn-success me-2">{translate('create_user')}</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowCreateForm(false)}>
                {translate('cancel')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Form */}
      {editingUser && (
        <div className="card mb-4">
          <div className="card-header">{translate('edit_user')}</div>
          <div className="card-body">
            <form onSubmit={handleUpdateUser}>
              <div className="mb-3">
                <label htmlFor="editUsername" className="form-label">{translate('username')}</label>
                <input
                  type="text"
                  className="form-control"
                  id="editUsername"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="editLevel" className="form-label">{translate('level_label')}</label>
                <input
                  type="number"
                  className="form-control"
                  id="editLevel"
                  value={editLevel}
                  onChange={(e) => setEditLevel(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="editPassword" className="form-label">{translate('new_password_optional')}</label>
                <input
                  type="password"
                  className="form-control"
                  id="editPassword"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary me-2">{translate('update_user')}</button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditingUser(null)}>{translate('cancel')}</button>
            </form>
          </div>
        </div>
      )}

      {/* Change User Password Form */}
      {changingPasswordForUser && (
        <div className="mb-4">
          <ChangePasswordForm 
            userId={changingPasswordForUser.id} 
            onPasswordChanged={() => {
              setChangingPasswordForUser(null);
              fetchUsers(); // Refresh users after password change
            }}
          />
        </div>
      )}

      {users.length === 0 ? (
        <div className="alert alert-info">{translate('no_users_found')}</div>
      ) : (
        <ul className="list-group">
          {users.map((user) => (
            <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h5>{user.username}</h5>
                <small className="text-muted">ID: {user.id} | {translate('level_label')}: {user.level}</small>
              </div>
              <div>
                <button 
                  onClick={() => {
                    setChangingPasswordForUser(user);
                    setEditingUser(null);
                    setShowCreateForm(false);
                  }} 
                  className="btn btn-info btn-sm me-2"
                >
                  {translate('change_password')}
                </button>
                <button 
                  onClick={() => handleEditClick(user)} 
                  className="btn btn-warning btn-sm me-2"
                >
                  {translate('edit')}
                </button>
                <button 
                  onClick={() => handleDeleteUser(user.id)} 
                  className="btn btn-danger btn-sm"
                >
                  {translate('delete')}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserManagementPage;