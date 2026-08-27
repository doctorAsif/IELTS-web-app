import React, { useState } from 'react';
import { AppProvider, useApp } from './lib/store';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
import { ActiveTab, Sidebar } from './components/layout/Sidebar';
import { RightSidebar } from './components/layout/RightSidebar';
import { TopHeader } from './components/layout/TopHeader';
import { MobileNav } from './components/layout/MobileNav';
import { LearningPath } from './components/path/LearningPath';
import { PracticeHub } from './components/practice/PracticeHub';
import { LeaderboardView } from './components/leaderboard/LeaderboardView';
import { QuestsView } from './components/quests/QuestsView';
import { ShopView } from './components/shop/ShopView';
import { ProfileView } from './components/profile/ProfileView';
import { LessonModal } from './components/lesson/LessonModal';
import { Lesson } from './lib/types';
import { Loader2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('learn');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, loading } = useAuth();
  const { stats, incrementFreeTrials } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#00205B] animate-spin" />
      </div>
    );
  }

  const handleStartLesson = (lesson: Lesson) => {
    if (!user) {
      const today = new Date().toISOString().split('T')[0];
      const trialsUsedToday = stats.freeTrialDate === today ? stats.freeTrialsUsed : 0;
      
      if (trialsUsedToday >= 2) {
        setShowAuthModal(true);
        return;
      }
      incrementFreeTrials();
    }
    setActiveLesson(lesson);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col md:flex-row font-sans text-duo-charcoal antialiased">
      {/* Mobile Top Header */}
      <TopHeader />

      {/* Desktop Left Sidebar */}
      <Sidebar activeTab={activeTab} onSelectTab={tab => setActiveTab(tab)} />

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen pb-20 md:pb-8 overflow-y-auto">
        {activeTab === 'learn' && (
          <LearningPath onStartLesson={handleStartLesson} />
        )}

        {activeTab === 'practice' && <PracticeHub onStartPractice={() => {
          if (!user) {
            const today = new Date().toISOString().split('T')[0];
            const trialsUsedToday = stats.freeTrialDate === today ? stats.freeTrialsUsed : 0;
            
            if (trialsUsedToday >= 2) {
              setShowAuthModal(true);
              return false;
            }
            incrementFreeTrials();
          }
          return true;
        }} />}

        {activeTab === 'leaderboard' && <LeaderboardView />}

        {activeTab === 'quests' && <QuestsView />}

        {activeTab === 'shop' && <ShopView />}

        {activeTab === 'profile' && <ProfileView />}
      </main>

      {/* Desktop Right Sidebar */}
      <RightSidebar onNavigate={tab => setActiveTab(tab)} />

      {/* Mobile Bottom Navigation */}
      <MobileNav activeTab={activeTab} onSelectTab={tab => setActiveTab(tab)} />

      {/* Active Lesson Modal Overlay */}
      {activeLesson && (
        <LessonModal
          lesson={activeLesson}
          onClose={() => setActiveLesson(null)}
        />
      )}

      {/* Auth Modals */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
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
