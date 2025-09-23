import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import authService from '../services/authService';

const AdminDashboardPage: React.FC = () => {
  const { translate } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/'); // Redirect to login page after logout
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{translate('admin_dashboard_page_title')}</h1>
        <Link to="/dashboard" className="btn btn-secondary me-2">{translate('back_to_dashboard')}</Link>
        <button onClick={handleLogout} className="btn btn-danger">{translate('logout')}</button>
      </div>
      <p>{translate('welcome_admin_dashboard')}</p>
      <div className="mt-4">
        <Link to="/admin/categories" className="btn btn-primary me-2">{translate('manage_categories')}</Link>
        <Link to="/admin/users" className="btn btn-primary me-2">{translate('manage_users')}</Link>
        {/* Add more admin links here */}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
