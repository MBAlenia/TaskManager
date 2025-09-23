import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import userService from '../services/userService';

interface ChangePasswordFormProps {
  userId?: number; // If provided, admin is changing another user's password
  onPasswordChanged?: () => void; // Callback after successful password change
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ userId, onPasswordChanged }) => {
  const { translate } = useLanguage();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return;
    }
    
    setLoading(true);
    setMessage(null);
    
    try {
      if (userId) {
        // Admin changing another user's password
        await userService.changeUserPassword(userId, newPassword);
        setMessage({ type: 'success', text: 'Password changed successfully' });
      } else {
        // User changing their own password
        await userService.changePassword(currentPassword, newPassword);
        setMessage({ type: 'success', text: 'Password changed successfully' });
        // Clear the form
        setCurrentPassword('');
      }
      
      // Clear the new password fields
      setNewPassword('');
      setConfirmPassword('');
      
      // Call the callback if provided
      if (onPasswordChanged) {
        onPasswordChanged();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to change password';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        {userId ? translate('change_user_password') : translate('change_password')}
      </div>
      <div className="card-body">
        {message && (
          <div className={`alert alert-${message.type}`} role="alert">
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {!userId && ( // Only show current password field when user is changing their own password
            <div className="mb-3">
              <label htmlFor="currentPassword" className="form-label">
                {translate('current_password')}
              </label>
              <input
                type="password"
                className="form-control"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required={!userId}
              />
            </div>
          )}
          
          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label">
              {translate('new_password')}
            </label>
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
            <label htmlFor="confirmPassword" className="form-label">
              {translate('confirm_password')}
            </label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? translate('loading') : translate('change_password')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordForm;