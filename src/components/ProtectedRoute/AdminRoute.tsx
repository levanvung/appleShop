import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.roles?.includes('ADMIN');

  if (!isAuthenticated) {
    // Redirect to sign in page with return URL
    return <Navigate to="/signin" state={{ from: window.location.pathname }} />;
  }

  if (!isAdmin) {
    // Not an admin, redirect to home
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default AdminRoute; 