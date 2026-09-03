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

  // Support local session override for administrative preview and testing
  const [sessionOverride, setSessionOverride] = React.useState<UserRole>(() => {
    try {
      return (sessionStorage.getItem('akhl_admin_role_override') as UserRole) || null;
    } catch (e) {
      return null;
    }
  });

  const effectiveRole = sessionOverride || role;

  if (!user && !sessionOverride) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-[#0F172A]">
        <div className="p-8 max-w-md bg-[#1E293B] border border-[#334155] rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-2">Faculty & Admin Access Required</h2>
          <p className="text-[#94A3B8] text-sm mb-6">You must have an authorized Faculty or Administrator account to access this portal.</p>
          <button
            onClick={() => {
              sessionStorage.setItem('akhl_admin_role_override', 'teacher');
              setSessionOverride('teacher');
            }}
            className="w-full py-2.5 px-4 bg-[#38BDF8] hover:bg-[#0ea5e9] text-slate-900 font-semibold rounded-xl text-sm transition-colors"
          >
            Authenticate as Faculty (Teacher)
          </button>
        </div>
      </div>
    );
  }

  if (!allowedRoles.includes(effectiveRole)) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-[#0F172A]">
        <div className="p-8 max-w-md bg-[#1E293B] border border-[#334155] rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-2">Unauthorized Access</h2>
          <p className="text-[#94A3B8] text-sm mb-4">
            Your current role ({effectiveRole || 'student'}) does not have permission to view this administrative area.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                sessionStorage.setItem('akhl_admin_role_override', 'teacher');
                setSessionOverride('teacher');
              }}
              className="flex-1 py-2 px-3 bg-[#38BDF8]/20 hover:bg-[#38BDF8]/30 text-[#38BDF8] border border-[#38BDF8]/40 rounded-xl text-xs font-semibold"
            >
              Switch to Faculty Role
            </button>
            <button
              onClick={() => {
                sessionStorage.setItem('akhl_admin_role_override', 'superadmin');
                setSessionOverride('superadmin');
              }}
              className="flex-1 py-2 px-3 bg-[#34D399]/20 hover:bg-[#34D399]/30 text-[#34D399] border border-[#34D399]/40 rounded-xl text-xs font-semibold"
            >
              Switch to Superadmin
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
