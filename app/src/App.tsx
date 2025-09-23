import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import LoginPage from './pages/LoginPage';
import './App.css';

import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CategoryManagementPage from './pages/CategoryManagementPage';
import UserManagementPage from './pages/UserManagementPage';
import AssignedTasksPage from './pages/AssignedTasksPage';
import UserProfilePage from './pages/UserProfilePage'; // Import the new UserProfilePage
import authService from './services/authService';
import { getPointsForNextLevel } from './utils/levelUtils';

// Breadcrumb component
const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const { translate } = useLanguage();
  
  const pathnames = location.pathname.split('/').filter(x => x);
  
  const breadcrumbNameMap: { [key: string]: string } = {
    'dashboard': translate('dashboard'),
    'admin': translate('admin_dashboard'),
    'categories': translate('manage_categories'),
    'users': translate('manage_users'),
    'assigned-tasks': translate('my_assigned_tasks'),
    'profile': translate('user_profile')
  };

  return (
    <nav aria-label="breadcrumb" className="mb-3">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/dashboard">{translate('home')}</Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          
          return isLast ? (
            <li key={to} className="breadcrumb-item active" aria-current="page">
              {breadcrumbNameMap[value] || value}
            </li>
          ) : (
            <li key={to} className="breadcrumb-item">
              <Link to={to}>{breadcrumbNameMap[value] || value}</Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

// Main App component wrapped in Router
function App() {
  return (
    <Router>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </Router>
  );
}

// AppContent component that uses router hooks
function AppContent() {
  const { language, setLanguage, translate } = useLanguage();
  const location = useLocation();

  const [userPoints, setUserPoints] = useState<number>(authService.getCurrentUserPoints());
  const [userLevel, setUserLevel] = useState<number>(authService.getCurrentUserLevel());
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const handleStorageChange = () => {
      setUserPoints(authService.getCurrentUserPoints());
      setUserLevel(authService.getCurrentUserLevel());
    };

    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    }

    window.addEventListener('storage', handleStorageChange);
    // Also update on mount in case it's a fresh load
    setUserPoints(authService.getCurrentUserPoints());
    setUserLevel(authService.getCurrentUserLevel());

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K for quick search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Focus search input if on dashboard
        if (location.pathname === '/dashboard') {
          const searchInput = document.getElementById('task-search');
          if (searchInput) {
            searchInput.focus();
          }
        }
      }
      
      // Ctrl/Cmd + N for new task
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        // Dispatch custom event that DashboardPage can listen to
        window.dispatchEvent(new CustomEvent('createNewTask'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [location.pathname]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    if (newDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  const progressPercentage = (userLevel < 10) ? (userPoints / getPointsForNextLevel(userLevel)) * 100 : 100;

  return (
    <div className="App">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      {location.pathname !== '/' && (
        <nav className={`navbar navbar-expand-lg ${darkMode ? 'navbar-dark' : 'navbar-light'}`}>
          <div className="container-fluid">
            <Link className="navbar-brand" to="/dashboard">{translate('app_name')}</Link>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">{translate('dashboard')}</Link>
                </li>
              </ul>
              <span className="navbar-text me-3">
                {translate('level')}: {userLevel} | {translate('points')}: {userPoints}
              </span>
              {userLevel < 10 && (
                <div className="progress me-3" style={{ width: '150px' }}>
                  <div
                    className="progress-bar bg-info"
                    role="progressbar"
                    style={{ width: `${progressPercentage}%` }}
                    aria-valuenow={progressPercentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>
              )}
              <div className="d-flex align-items-center">
                <Link to="/profile" className="btn btn-outline-secondary btn-sm me-2">
                  {translate('user_profile')}
                </Link>
                <select
                  className="form-select form-select-sm me-2"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  aria-label="Language selector"
                >
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </select>
                <button 
                  className="dark-mode-toggle"
                  onClick={toggleDarkMode}
                  aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                  title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {darkMode ? '☀️' : '🌙'}
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}
      <main id="main-content" className="container-fluid">
        {location.pathname !== '/' && <Breadcrumbs />}
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/categories" element={<CategoryManagementPage />} />
          <Route path="/admin/users" element={<UserManagementPage />} />
          <Route path="/assigned-tasks" element={<AssignedTasksPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;