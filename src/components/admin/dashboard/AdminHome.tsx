import React, { useEffect, useState } from 'react';
import { Users, Activity, Target, BrainCircuit, Cloud, Cpu, FileText } from 'lucide-react';
import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

export const AdminHome: React.FC = () => {
  const [totalStudents, setTotalStudents] = useState<number | string>('...');
  const [totalPractice, setTotalPractice] = useState<number | string>('...');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersSnap = await getCountFromServer(collection(db, 'users'));
        setTotalStudents(usersSnap.data().count);
        
        const practiceSnap = await getCountFromServer(collection(db, 'practice'));
        setTotalPractice(practiceSnap.data().count);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { label: 'Total Students', value: totalStudents, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Active Today', value: '342', icon: Activity, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Avg Target Band', value: '7.5', icon: Target, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Practice Attempts', value: totalPractice, icon: FileText, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  ];

  const aiStats = [
    { label: 'Local AI Usage', value: '82%', icon: Cpu, color: 'text-emerald-400' },
    { label: 'Cloud Fallback', value: '18%', icon: Cloud, color: 'text-rose-400' },
    { label: 'AI Cost Est.', value: '$45.20', icon: BrainCircuit, color: 'text-yellow-400' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-[#94A3B8]">High-level metrics for the AKHL IELTS platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-[#94A3B8] font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-[#38BDF8]" />
            AI Usage Metrics
          </h2>
          <div className="space-y-4">
            {aiStats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="flex items-center justify-between p-4 bg-[#0F172A] rounded-lg border border-[#334155]">
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                    <span className="text-[#94A3B8] font-medium">{stat.label}</span>
                  </div>
                  <span className="text-white font-bold">{stat.value}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Recent Registrations</h2>
          <div className="flex flex-col items-center justify-center h-48 text-[#94A3B8]">
            <p>Chart coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};
