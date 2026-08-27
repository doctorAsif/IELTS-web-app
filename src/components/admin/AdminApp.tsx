import React, { useState } from 'react';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminLayout, AdminTab } from './layout/AdminLayout';
import { AdminHome } from './dashboard/AdminHome';
import { StudentManager } from './users/StudentManager';
import { StaffManager } from './users/StaffManager';
import { PracticeManager } from './practice/PracticeManager';
import { AdminAIControl } from './ai/AdminAIControl';

export const AdminApp: React.FC = () => {
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('home');

  return (
    <ProtectedRoute allowedRoles={['admin', 'superadmin', 'teacher', 'counselor']}>
      <AdminLayout activeTab={activeAdminTab} onSelectTab={setActiveAdminTab}>
        {activeAdminTab === 'home' && <AdminHome />}
        
        {activeAdminTab === 'students' && <StudentManager />}
        
        {activeAdminTab === 'staff' && <StaffManager />}
        
        {activeAdminTab === 'practice' && <PracticeManager />}
        
        {activeAdminTab === 'ai_control' && <AdminAIControl />}

        {/* Other tabs will render their respective components here */}
        {['curriculum', 'media', 'licenses', 'partners', 'audit'].includes(activeAdminTab) && (
          <div className="text-white text-center py-20">
            <h1 className="text-2xl font-bold mb-4 capitalize">{activeAdminTab.replace('_', ' ')} Module</h1>
            <p className="text-[#94A3B8]">This module is currently being implemented.</p>
          </div>
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
};
