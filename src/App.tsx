import React, { useState } from 'react';
import { AppProvider, useApp } from './lib/store';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
import { ActiveTab, Sidebar } from './components/layout/Sidebar';
import { LessonModal } from './components/lesson/LessonModal';
import { Lesson } from './lib/types';
import { Loader2, Menu } from 'lucide-react';
import { DashboardView } from './components/dashboard/DashboardView';
import { DailyTeacherView } from './components/dashboard/DailyTeacherView';
import { LearningPath } from './components/path/LearningPath';
import { ScaffoldingPractice } from './components/practice/ScaffoldingPractice';
import { LocalAISetup } from './components/interactive/LocalAISetup';
import { ReadingModule } from './components/interactive/ReadingModule';
import { WritingModule } from './components/interactive/WritingModule';
import { SpeakingModule } from './components/interactive/SpeakingModule';
import { ListeningModule } from './components/interactive/ListeningModule';
import { LicenseView } from './components/license/LicenseView';
import { AdminApp } from './components/admin/AdminApp';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTrialCompleteModal, setShowTrialCompleteModal] = useState(false);
  const { user, loading } = useAuth();
  const { stats, consumeTrialCredit } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#38BDF8] animate-spin" />
      </div>
    );
  }

  const handleStartLesson = async (lesson: Lesson, category: 'speaking' | 'writing' | 'listening' | 'reading' | 'mock' = 'mock') => {
    const requiredCredits = category === 'mock' ? 5 : 20;
    if (stats.trialCreditsRemaining < requiredCredits) {
      setShowTrialCompleteModal(true);
      return;
    }

    const success = await consumeTrialCredit(category === 'mock' ? 'mock_exam' : category);
    if (success) {
      setActiveLesson(lesson);
    } else {
      setShowTrialCompleteModal(true);
    }
  };

  const handleSelectTab = async (tab: ActiveTab) => {
    setMobileMenuOpen(false);

    const practiceTabs = ['speaking', 'writing', 'reading', 'listening'];

    if (practiceTabs.includes(tab)) {
      if (stats.trialCreditsRemaining < 20) {
        setShowTrialCompleteModal(true);
        return;
      }

      const success = await consumeTrialCredit(tab);
      if (!success) {
        setShowTrialCompleteModal(true);
        return;
      }
    }

    if (tab === 'mock_exam') {
      handleStartLesson({
        id: 'practice-mock_exam',
        title: 'Full IELTS Mock Exam',
        type: 'practice',
        xpReward: 50,
        unitId: 0,
        skill: 'overall',
        gemsReward: 20,
        description: 'Practice your overall IELTS test skills under exam timing.',
        questions: []
      }, 'mock');
      return;
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
        {/* Top Header - Mobile Only */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-[#1E293B] bg-[#0F172A]">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2 rounded-lg hover:bg-white/10">
              <Menu className="w-6 h-6 text-white" />
            </button>
            <div className="font-bold tracking-wider text-[#38BDF8]">AKHL IELTS</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-8">
          {activeTab === 'dashboard' && (
            <DashboardView onStartLesson={handleStartLesson} onSelectTab={handleSelectTab} />
          )}

          {activeTab === 'daily_teacher' && (
            <DailyTeacherView onSelectTab={handleSelectTab} />
          )}

          {activeTab === 'path' && (
            <LearningPath onStartLesson={handleStartLesson} />
          )}

          {activeTab === 'scaffolding' && (
            <ScaffoldingPractice />
          )}

          {/* Flashcards View */}
          {activeTab === 'flashcards' && (
            <div className="p-6 text-center text-[#94A3B8]">
              <h2 className="text-2xl font-bold text-white mb-2">Vocabulary Flashcards</h2>
              <p>Flashcards module is ready for your vocabulary practice.</p>
            </div>
          )}

          {/* Local AI Setup & Hub */}
          {activeTab === 'ai_setup' && <LocalAISetup />}
          {activeTab === 'ai_tutor' && <LocalAISetup />}

          {/* Core Practice Modules */}
          {activeTab === 'reading' && <ReadingModule />}
          {activeTab === 'writing' && <WritingModule />}
          {activeTab === 'speaking' && <SpeakingModule />}
          {activeTab === 'listening' && <ListeningModule />}

          {/* Hardware UUID Slot & Offline License */}
          {activeTab === 'license' && <LicenseView />}

          {/* Faculty & Administrator Portal */}
          {activeTab === 'admin' && <AdminApp />}

          {['founder', 'study_abroad', 'register'].includes(activeTab) && (
            <div className="p-6 text-center text-[#94A3B8]">
              <h2 className="text-2xl font-bold text-white mb-2">{activeTab.replace('_', ' ').toUpperCase()}</h2>
              <p>This module is available in this version.</p>
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

      {/* Trial Complete Modal */}
      {showTrialCompleteModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="bg-[#1E293B] p-6 rounded-2xl max-w-sm w-full mx-4 border border-[#38BDF8]/20 text-center shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Free Trial Complete</h3>
            <p className="text-[#94A3B8] mb-6">
              Your free trial credits are complete. Activate AKHL IELTS for unlimited access to all practice modules.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowTrialCompleteModal(false);
                  setActiveTab('license');
                }}
                className="w-full bg-[#38BDF8] hover:bg-[#0284C7] text-slate-950 font-bold py-3 px-4 rounded-xl transition-colors"
              >
                [ Activate AKHL IELTS License ]
              </button>
              <button
                onClick={() => setShowTrialCompleteModal(false)}
                className="w-full bg-transparent hover:bg-white/5 text-[#94A3B8] font-medium py-3 px-4 rounded-xl transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
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
