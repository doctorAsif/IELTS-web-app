import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Shield } from 'lucide-react';
import { useAuth } from '../../../lib/AuthContext';

// Mock data to represent what would come from Firestore
const MOCK_STUDENTS = [
  { id: '1', name: 'Alice Chen', email: 'alice@example.com', targetBand: 7.5, status: 'Active', lastActive: '2 hours ago' },
  { id: '2', name: 'Bob Smith', email: 'bob.smith@example.com', targetBand: 6.5, status: 'Inactive', lastActive: '5 days ago' },
  { id: '3', name: 'Carlos Rodriguez', email: 'carlos@example.com', targetBand: 8.0, status: 'Active', lastActive: 'Just now' },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', targetBand: 7.0, status: 'Suspended', lastActive: '2 weeks ago' },
];

export const StudentManager: React.FC = () => {
  const { role } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Student Management</h1>
          <p className="text-[#94A3B8]">View and manage registered students.</p>
        </div>
        
        {/* Only admins can manually add students (typically they self-register) */}
        {(role === 'superadmin' || role === 'admin') && (
          <button className="px-4 py-2 bg-[#38BDF8] hover:bg-[#0284C7] text-white rounded-lg font-medium transition-colors">
            Invite Student
          </button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-[#1E293B] p-4 rounded-xl border border-[#334155] flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search students by name or email..."
            className="w-full bg-[#0F172A] border border-[#334155] rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-[#38BDF8]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="px-4 py-2 bg-[#0F172A] border border-[#334155] hover:border-[#94A3B8] text-white rounded-lg flex items-center gap-2 transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F172A] text-[#94A3B8] text-sm uppercase tracking-wider border-b border-[#334155]">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Target Band</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Last Active</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {MOCK_STUDENTS.map((student) => (
                <tr key={student.id} className="hover:bg-[#334155]/30 transition-colors">
                  <td className="p-4">
                    <p className="text-white font-medium">{student.name}</p>
                    <p className="text-sm text-[#94A3B8]">{student.email}</p>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20">
                      {student.targetBand}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                      student.status === 'Active' ? 'bg-green-400/10 text-green-400 border-green-400/20' :
                      student.status === 'Inactive' ? 'bg-orange-400/10 text-orange-400 border-orange-400/20' :
                      'bg-rose-400/10 text-rose-400 border-rose-400/20'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="p-4 text-[#94A3B8] text-sm">
                    {student.lastActive}
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
