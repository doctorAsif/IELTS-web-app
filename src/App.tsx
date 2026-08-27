import React, { useState } from 'react';
import { AppProvider, useApp } from './lib/store';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
import { ActiveTab, Sidebar } from './components/layout/Sidebar';
import { LessonModal } from './components/lesson/LessonModal';
import { Lesson } from './lib/types';
import { Loader2, Menu } from 'lucide-react';
import { DashboardView } from './components/dashboard/DashboardView';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const { stats, incrementCategoryTrial } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#38BDF8] animate-spin" />
      </div>
    );
  }

  const handleStartLesson = (lesson: Lesson, category: 'speaking' | 'writing' | 'listening' | 'reading' | 'mock' = 'mock') => {
    if (!user) {
      const today = new Date().toISOString().split('T')[0];
      const key = category === 'mock' ? 'freeMockTestsUsed' : 
                 category === 'speaking' ? 'freeSpeakingUsed' :
                 category === 'writing' ? 'freeWritingUsed' :
                 category === 'listening' ? 'freeListeningUsed' : 'freeReadingUsed';
      const trialsUsedToday = stats.freeTrialDate === today ? stats[key] : 0;
      
      if (trialsUsedToday >= 2) {
        setShowAuthModal(true);
        return;
      }
      incrementCategoryTrial(category);
    }
    setActiveLesson(lesson);
  };

  const handleSelectTab = (tab: ActiveTab) => {
    setMobileMenuOpen(false);
    
    // Launch practice modals directly from sidebar clicks
    if (['speaking', 'writing', 'reading', 'listening', 'mock_exam'].includes(tab)) {
      const category = tab === 'mock_exam' ? 'mock' : tab as any;
      handleStartLesson({
        id: `practice-${tab}`,
        title: tab === 'mock_exam' ? 'Full IELTS Mock Exam' : `${tab.charAt(0).toUpperCase() + tab.slice(1)} Practice`,
        type: tab === 'mock_exam' ? 'practice' : tab as any,
        xpReward: 50,
        unitId: 0,
        skill: tab === 'mock_exam' ? 'overall' : tab as any,
        gemsReward: 20,
        description: `Practice your ${tab} skills.`,
        questions: []
      }, category);
      return; // Keep current active tab behind the modal
    }
    
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex font-sans text-white antialiased">
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static z-50 transition-transform duration-200 ease-in-out h-screen`}>
        <Sidebar activeTab={activeTab} onSelectTab={handleSelectTab} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen flex flex-col h-screen overflow-hidden bg-[#0F172A]">
        {/* Top Header - Mobile Only or Minimal Desktop */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-[#1E293B] bg-[#0F172A]">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2 rounded-lg hover:bg-white/10">
              <Menu className="w-6 h-6 text-white" />
            </button>
            <div className="font-bold tracking-wider text-[#38BDF8]">AKHL IELTS</div>
          </div>
          {/* User badge or other header items */}
        </div>
        
        {/* Hidden Desktop TopHeader to preserve any logic inside if needed, but styling is dark */}
        <div className="hidden md:block">
          {/* We remove TopHeader from Desktop to match the Android App which uses Drawer only */}
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-8">
          {activeTab === 'dashboard' && (
            <DashboardView onStartLesson={handleStartLesson} onSelectTab={handleSelectTab} />
          )}

          {/* Flashcards View (Previously in PracticeHub) */}
          {activeTab === 'flashcards' && (
            <div className="p-6 text-center text-[#94A3B8]">
              <h2 className="text-2xl font-bold text-white mb-2">Vocabulary Flashcards</h2>
              <p>Flashcards module will go here.</p>
            </div>
          )}

          {/* Fallback for other tabs */}
          {['ai_tutor', 'ai_setup', 'founder', 'study_abroad', 'license', 'register', 'admin'].includes(activeTab) && (
            <div className="p-6 text-center text-[#94A3B8]">
              <h2 className="text-2xl font-bold text-white mb-2">{activeTab.replace('_', ' ').toUpperCase()}</h2>
              <p>This module is currently under construction in the web version.</p>
            </div>
          )}
        </div>
      </main>

      {/* Active Lesson Modal Overlay */}
      {activeLesson && (
        <LessonModal
          lesson={activeLesson}
          onClose={() => setActiveLesson(null)}
        />
      )}

      {/* Auth Modals */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <AuthModal />
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}
