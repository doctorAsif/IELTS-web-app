import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit2, CheckCircle, Eye, MoreVertical, Trash2 } from 'lucide-react';
import { getFirestore, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { PracticeItem } from '../../../lib/types';
import { useAuth } from '../../../lib/AuthContext';
import { PracticeEditor } from './PracticeEditor';

export const PracticeManager: React.FC = () => {
  const { role } = useAuth();
  const [practiceItems, setPracticeItems] = useState<PracticeItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [skillFilter, setSkillFilter] = useState('All');
  
  const [editingItem, setEditingItem] = useState<PracticeItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const db = getFirestore();
    const q = query(collection(db, 'practice'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: PracticeItem[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as PracticeItem);
      });
      setPracticeItems(items);
    });

    return () => unsubscribe();
  }, []);

  const handleApprove = async (id: string) => {
    if (!window.confirm('Are you sure you want to approve this practice item?')) return;
    try {
      const functions = getFunctions();
      const approve = httpsCallable(functions, 'approvePractice');
      await approve({ practiceId: id });
      alert('Approved successfully.');
    } catch (error: any) {
      alert(`Error approving: ${error.message}`);
    }
  };

  const handlePublish = async (id: string) => {
    if (!window.confirm('Are you sure you want to publish this practice item?')) return;
    try {
      const functions = getFunctions();
      const publish = httpsCallable(functions, 'publishPractice');
      await publish({ practiceId: id });
      alert('Published successfully.');
    } catch (error: any) {
      alert(`Error publishing: ${error.message}`);
    }
  };

  const handleRetire = async (id: string) => {
    if (!window.confirm('Are you sure you want to retire this practice item?')) return;
    try {
      const functions = getFunctions();
      const retire = httpsCallable(functions, 'retirePractice');
      await retire({ practiceId: id });
      alert('Retired successfully.');
    } catch (error: any) {
      alert(`Error retiring: ${error.message}`);
    }
  };

  const filteredItems = practiceItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter.toLowerCase();
    const matchesSkill = skillFilter === 'All' || item.skill === skillFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesSkill;
  });

  if (isCreating || editingItem) {
    return (
      <PracticeEditor 
        item={editingItem} 
        onClose={() => {
          setIsCreating(false);
          setEditingItem(null);
        }} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Practice Management</h1>
          <p className="text-[#94A3B8]">Create, review, approve, and publish practice content.</p>
        </div>
        
        <button 
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-[#38BDF8] hover:bg-[#0284C7] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Practice
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[#1E293B] p-4 rounded-xl border border-[#334155] flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search practice items..."
            className="w-full bg-[#0F172A] border border-[#334155] rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-[#38BDF8]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select 
          className="bg-[#0F172A] border border-[#334155] rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[#38BDF8]"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Draft">Draft</option>
          <option value="AI Review">AI Review</option>
          <option value="Human Review">Human Review</option>
          <option value="Approved">Approved</option>
          <option value="Published">Published</option>
          <option value="Retired">Retired</option>
        </select>

        <select 
          className="bg-[#0F172A] border border-[#334155] rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[#38BDF8]"
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)}
        >
          <option value="All">All Skills</option>
          <option value="Listening">Listening</option>
          <option value="Reading">Reading</option>
          <option value="Writing">Writing</option>
          <option value="Speaking">Speaking</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F172A] text-[#94A3B8] text-sm uppercase tracking-wider border-b border-[#334155]">
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium">Skill & Band</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Version</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#334155]/30 transition-colors">
                  <td className="p-4">
                    <p className="text-white font-medium">{item.title}</p>
                    <p className="text-sm text-[#94A3B8]">ID: {item.id}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-white capitalize">{item.skill}</p>
                    <p className="text-sm text-[#94A3B8]">Band {item.targetBandMin} - {item.targetBandMax}</p>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                      item.status === 'published' ? 'bg-green-400/10 text-green-400 border-green-400/20' :
                      item.status === 'approved' ? 'bg-blue-400/10 text-blue-400 border-blue-400/20' :
                      item.status === 'draft' ? 'bg-slate-400/10 text-slate-400 border-slate-400/20' :
                      item.status === 'retired' ? 'bg-red-400/10 text-red-400 border-red-400/20' :
                      'bg-orange-400/10 text-orange-400 border-orange-400/20'
                    }`}>
                      {item.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-[#94A3B8]">
                    v{item.version || 1}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setEditingItem(item)}
                        className="p-2 text-[#94A3B8] hover:text-[#38BDF8] rounded-lg hover:bg-[#0F172A] transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>

                      {/* Approval Workflow Actions */}
                      {(role === 'admin' || role === 'superadmin') && (
                        <>
                          {item.status === 'human_review' && (
                            <button 
                              onClick={() => handleApprove(item.id)}
                              className="p-2 text-[#94A3B8] hover:text-green-400 rounded-lg hover:bg-[#0F172A] transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          )}
                          {item.status === 'approved' && (
                            <button 
                              onClick={() => handlePublish(item.id)}
                              className="p-2 text-[#94A3B8] hover:text-blue-400 rounded-lg hover:bg-[#0F172A] transition-colors"
                              title="Publish"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          )}
                          {item.status === 'published' && (
                            <button 
                              onClick={() => handleRetire(item.id)}
                              className="p-2 text-[#94A3B8] hover:text-red-400 rounded-lg hover:bg-[#0F172A] transition-colors"
                              title="Retire"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#94A3B8]">
                    No practice items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
