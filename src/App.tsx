import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './features/dashboard/pages/DashboardPage';
import { SpeakingTrainerPage } from './features/speaking/pages/SpeakingTrainerPage';
import { WritingTrainerPage } from './features/writing/pages/WritingTrainerPage';
import { ReadingPracticePage } from './features/reading/pages/ReadingPracticePage';
import { ListeningPracticePage } from './features/listening/pages/ListeningPracticePage';
import { CurriculumPage } from './features/curriculum/pages/CurriculumPage';
import { FlashcardsPage } from './features/flashcards/pages/FlashcardsPage';
import { AiSetupPage } from './features/ai-setup/pages/AiSetupPage';
import { LicensingPage } from './features/licensing/pages/LicensingPage';
import { CreativeMasteryPage } from './features/creative/pages/CreativeMasteryPage';

import { detectHardwareProfile } from './services/hardwareDetector';
import { WebLlmProvider } from './services/webLlmProvider';
import { AIProgress, HardwareProfile, ModelTier } from './types/ai';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [hardwareProfile, setHardwareProfile] = useState<HardwareProfile | null>(null);
  const [isAiReady, setIsAiReady] = useState(false);
  const [aiProgress, setAiProgress] = useState<AIProgress>({
    status: 'idle',
    progress: 0,
    receivedMB: 0,
    totalMB: 0,
    currentStepText: 'Edge AI standing by...',
  });

  const initHardwareAndAi = async (forceTier?: ModelTier) => {
    setAiProgress({
      status: 'detecting',
      progress: 0.02,
      receivedMB: 0,
      totalMB: 0,
      currentStepText: 'Analyzing PC RAM and WebGPU hardware profile...',
    });

    const profile = await detectHardwareProfile();
    setHardwareProfile(profile);

    const provider = WebLlmProvider.getInstance();
    provider.onProgress((progress) => {
      setAiProgress(progress);
      if (progress.status === 'ready') {
        setIsAiReady(true);
      }
    });

    await provider.initialize(profile, forceTier);
  };

  useEffect(() => {
    initHardwareAndAi();
  }, []);

  const renderActiveContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage onNavigate={(tab) => setActiveTab(tab)} />;
      case 'speaking':
        return <SpeakingTrainerPage />;
      case 'writing':
        return <WritingTrainerPage />;
      case 'reading':
        return <ReadingPracticePage />;
      case 'listening':
        return <ListeningPracticePage />;
      case 'curriculum':
        return <CurriculumPage onNavigate={(tab) => setActiveTab(tab)} />;
      case 'flashcards':
        return <FlashcardsPage />;
      case 'creative':
        return <CreativeMasteryPage />;
      case 'ai-setup':
        return (
          <AiSetupPage
            hardwareProfile={hardwareProfile}
            aiProgress={aiProgress}
            onRefreshHardware={() => initHardwareAndAi()}
            onSelectTier={(tier) => initHardwareAndAi(tier)}
          />
        );
      case 'licensing':
        return <LicensingPage />;
      default:
        return <DashboardPage onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A1124] text-slate-100">
      <Navbar
        hardwareProfile={hardwareProfile}
        isAiReady={isAiReady}
        onOpenAiSetup={() => setActiveTab('ai-setup')}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />
        <main className="flex-1 overflow-y-auto bg-[#070D1E]/60">
          {renderActiveContent()}
        </main>
      </div>
    </div>
  );
}
