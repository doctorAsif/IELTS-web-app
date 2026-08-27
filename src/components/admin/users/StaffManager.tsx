import React, { useState } from 'react';
import { Search, Shield, UserPlus, MoreVertical } from 'lucide-react';
import { useAuth } from '../../../lib/AuthContext';

const MOCK_STAFF = [
  { id: '1', name: 'Dr. Asif', email: 'asif@akhl.com', role: 'superadmin', lastActive: 'Online' },
  { id: '2', name: 'John Doe', email: 'john@akhl.com', role: 'admin', lastActive: '1 hour ago' },
  { id: '3', name: 'Sarah Jane', email: 'sarah@akhl.com', role: 'teacher', lastActive: '2 days ago' },
  { id: '4', name: 'Mark Smith', email: 'mark@akhl.com', role: 'counselor', lastActive: 'Just now' },
];

export const StaffManager: React.FC = () => {
  const { role } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Only admins/superadmins should even see this module (enforced by AdminLayout),
  // but we double-check here just in case.
  if (role !== 'admin' && role !== 'superadmin') {
    return <div className="text-white">You do not have permission to view this page.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Staff Management</h1>
          <p className="text-[#94A3B8]">Manage teachers, counselors, and administrative access.</p>
        </div>
        
        <button className="px-4 py-2 bg-[#38BDF8] hover:bg-[#0284C7] text-white rounded-lg font-medium transition-colors flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Add Staff Member
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-[#1E293B] p-4 rounded-xl border border-[#334155] flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search staff by name or email..."
            className="w-full bg-[#0F172A] border border-[#334155] rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-[#38BDF8]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F172A] text-[#94A3B8] text-sm uppercase tracking-wider border-b border-[#334155]">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Last Active</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {MOCK_STAFF.map((staffMember) => (
                <tr key={staffMember.id} className="hover:bg-[#334155]/30 transition-colors">
                  <td className="p-4">
                    <p className="text-white font-medium">{staffMember.name}</p>
                    <p className="text-sm text-[#94A3B8]">{staffMember.email}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Shield className={`w-4 h-4 ${
                        staffMember.role === 'superadmin' ? 'text-purple-400' :
                        staffMember.role === 'admin' ? 'text-rose-400' :
                        'text-blue-400'
                      }`} />
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                        staffMember.role === 'superadmin' ? 'bg-purple-400/10 text-purple-400 border-purple-400/20' :
                        staffMember.role === 'admin' ? 'bg-rose-400/10 text-rose-400 border-rose-400/20' :
                        'bg-blue-400/10 text-blue-400 border-blue-400/20'
                      }`}>
                        {staffMember.role}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-[#94A3B8] text-sm">
                    {staffMember.lastActive}
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 text-[#94A3B8] hover:text-white rounded-lg hover:bg-[#0F172A] transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
