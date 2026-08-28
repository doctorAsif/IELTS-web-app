import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Shield } from 'lucide-react';
import { useAuth } from '../../../lib/AuthContext';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

interface StudentData {
  id: string;
  name: string;
  email: string;
  targetBand: number | string;
  status: string;
  lastActive: string;
}

export const StudentManager: React.FC = () => {
  const { role } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const q = query(collection(db, 'users'), limit(50));
        const querySnapshot = await getDocs(q);
        const loadedStudents: StudentData[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          loadedStudents.push({
            id: doc.id,
            name: data.profile?.name || 'Unknown Student',
            email: data.profile?.email || 'No Email',
            targetBand: data.stats?.targetBand || '-',
            status: data.stats?.lastActiveDate ? 'Active' : 'New',
            lastActive: data.stats?.lastActiveDate || 'Never'
          });
        });
        
        setStudents(loadedStudents);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

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
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-[#94A3B8]">Loading students...</td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-[#94A3B8]">No students found.</td>
                </tr>
              ) : students.map((student) => (
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
