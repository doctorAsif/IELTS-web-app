import React from 'react';
import { Users, BookOpen, Mic, Settings, LayoutDashboard, Shield, PlayCircle, HardDrive, Share2, ClipboardList } from 'lucide-react';
import { useAuth } from '../../../lib/AuthContext';

export type AdminTab = 
  | 'home' 
  | 'students' 
  | 'staff' 
  | 'curriculum' 
  | 'practice' 
  | 'media' 
  | 'ai_control' 
  | 'licenses' 
  | 'partners' 
  | 'audit';

interface AdminLayoutProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ activeTab, onSelectTab, children }) => {
  const { role } = useAuth();

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'superadmin', 'counselor', 'teacher'] },
    { id: 'students', label: 'Students', icon: Users, roles: ['admin', 'superadmin', 'counselor', 'teacher'] },
    { id: 'staff', label: 'Staff Management', icon: Shield, roles: ['admin', 'superadmin'] },
    { id: 'curriculum', label: 'Curriculum', icon: BookOpen, roles: ['admin', 'superadmin'] },
    { id: 'practice', label: 'Practice Content', icon: ClipboardList, roles: ['admin', 'superadmin', 'teacher'] },
    { id: 'media', label: 'Media Library', icon: PlayCircle, roles: ['admin', 'superadmin', 'teacher'] },
    { id: 'ai_control', label: 'AI Settings', icon: HardDrive, roles: ['admin', 'superadmin'] },
    { id: 'licenses', label: 'Licenses', icon: Settings, roles: ['admin', 'superadmin'] },
    { id: 'partners', label: 'Partners', icon: Share2, roles: ['admin', 'superadmin'] },
    { id: 'audit', label: 'Audit Logs', icon: Shield, roles: ['admin', 'superadmin'] },
  ];

  const visibleNavItems = navItems.filter(item => item.roles.includes(role || 'student'));

  return (
    <div className="flex h-full w-full bg-[#0F172A]">
      {/* Admin Sidebar */}
      <div className="w-64 bg-[#1E293B] border-r border-[#334155] flex flex-col hidden md:flex">
        <div className="p-4 border-b border-[#334155]">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#38BDF8]" />
            Admin Portal
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1 capitalize">Role: {role}</p>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {visibleNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onSelectTab(item.id as AdminTab)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive 
                        ? 'bg-[#38BDF8]/20 text-[#38BDF8] font-medium' 
                        : 'text-[#94A3B8] hover:text-white hover:bg-[#334155]/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Main Admin Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-[#334155] bg-[#1E293B] flex items-center justify-between md:hidden">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#38BDF8]" />
            Admin Portal
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-[#0F172A]">
          {children}
        </div>
      </div>
    </div>
  );
};
