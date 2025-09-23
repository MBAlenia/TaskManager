import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import authService from '../services/authService';
import ChangePasswordForm from '../components/ChangePasswordForm';

const UserProfilePage: React.FC = () => {
  const { translate } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/'); // Redirect to login page after logout
  };

  return (
    <div className="container mt-5">
      <h1>{translate('user_profile')}</h1>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          {translate('back')}
        </button>
        <button onClick={handleLogout} className="btn btn-danger">
          {translate('logout')}
        </button>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              {translate('user_information')}
            </div>
            <div className="card-body">
              <p><strong>{translate('username')}:</strong> {authService.getCurrentUsername()}</p>
              <p><strong>{translate('level_label')}:</strong> {authService.getCurrentUserLevel()}</p>
              <p><strong>{translate('points')}:</strong> {authService.getCurrentUserPoints()}</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;