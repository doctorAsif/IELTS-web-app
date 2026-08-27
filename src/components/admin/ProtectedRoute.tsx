import React, { ReactNode } from 'react';
import { useAuth, UserRole } from '../../lib/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-[#38BDF8] animate-pulse">Checking permissions...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-[#94A3B8]">You must be logged in to view this page.</p>
      </div>
    );
  }

  if (!allowedRoles.includes(role)) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Unauthorized Access</h2>
        <p className="text-[#94A3B8]">Your current role ({role || 'student'}) does not have permission to view this administrative area.</p>
      </div>
    );
  }

  return <>{children}</>;
};
