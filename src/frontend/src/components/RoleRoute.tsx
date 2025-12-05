import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;   
}

const RoleRoute: React.FC<RoleRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = "/unauthorized" 
}) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra vai trò
  if (!allowedRoles.includes(user.vai_tro)) {
    return <Navigate to={redirectTo} replace />;   // 👈 redirect tùy biến
  }

  return <>{children}</>;
};

export default RoleRoute;
