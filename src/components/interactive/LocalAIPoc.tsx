import React, { useState, useEffect } from 'react';
import { Send, Bot, User, Loader2, CheckCircle2, XCircle, HardDrive } from 'lucide-react';
import { LocalAITier } from '../../lib/ai/DeviceCapabilityEngine';
import { ModelManager, AIState } from '../../lib/ai/ModelManager';
import { AIRouter } from '../../lib/ai/AIRouter';

export const LocalAIPoc: React.FC = () => {
  const [aiState, setAiState] = useState<AIState>(AIState.UNINITIALIZED);
  const [initProgress, setInitProgress] = useState<string>('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const modelManager = ModelManager.getInstance();
  const aiRouter = AIRouter.getInstance();

  useEffect(() => {
    const unsubscribe = modelManager.subscribe(setAiState);
    if (modelManager.currentState === AIState.UNINITIALIZED) {
      modelManager.initialize();
    }
    return unsubscribe;
  }, [modelManager]);

  const initLocalAI = async () => {
    try {
      setInitProgress('Initializing Local AI...');
      await aiRouter.startLocalEngine((progress) => setInitProgress(progress));
    } catch (err) {
      setInitProgress('Error initializing Local AI. Please check console.');
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;
    
    const userMsg = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user' as const, content: userMsg }];
    setMessages(newMessages);
    setIsGenerating(true);
    
    try {
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      
      await aiRouter.chat(newMessages, (chunk) => {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: chunk };
          return updated;
        });
      });
    } catch (err) {
      console.error("Generation Error:", err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error during generation.' }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const isReady = aiState === AIState.READY || aiState === AIState.FALLBACK;
  const isLoading = aiState === AIState.DOWNLOADING || aiState === AIState.LOADING;
  const deviceCaps = modelManager.deviceCapabilities;
  const isCheckingDevice = aiState === AIState.DETECTING_DEVICE || aiState === AIState.UNINITIALIZED;

  return (
    <div className="flex flex-col h-full bg-[#0F172A] p-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Bot className="w-6 h-6 text-[#38BDF8]" />
          Local AI Proof of Concept
        </h2>
        
        {aiState === AIState.READY_TO_INSTALL ? (
          <button 
            onClick={initLocalAI}
            disabled={isLoading}
            className="px-4 py-2 bg-[#38BDF8] text-[#0F172A] font-medium rounded-lg hover:bg-sky-400 disabled:opacity-50 flex items-center gap-2 transition-colors"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isLoading ? 'Installing Local AI...' : 'Install Local AI'}
          </button>
        ) : isReady ? (
          <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/30 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            {aiState === AIState.FALLBACK ? 'Cloud AI Fallback Active' : 'Qwen Local Active'}
          </div>
        ) : null}
      </div>

      {isCheckingDevice && (
        <div className="bg-[#1E293B] p-6 rounded-xl border border-[#334155] mb-6 flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#38BDF8] animate-spin mb-4" />
          <p className="text-white font-medium">Checking your device...</p>
        </div>
      )}

      {aiState === AIState.READY_TO_INSTALL && deviceCaps && (
        <div className="bg-[#1E293B] p-6 rounded-xl border border-[#334155] mb-6">
          <h3 className="text-lg font-bold text-white mb-4">Device Compatibility</h3>
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              {deviceCaps.hasWebGPU ? <CheckCircle2 className="text-green-400 w-5 h-5" /> : <XCircle className="text-red-400 w-5 h-5" />}
              <span className="text-[#94A3B8]">WebGPU Available ({deviceCaps.gpuAdapterInfo})</span>
            </div>
            <div className="flex items-center gap-3">
              {deviceCaps.storageEstimateMB > 1500 ? <CheckCircle2 className="text-green-400 w-5 h-5" /> : <XCircle className="text-yellow-400 w-5 h-5" />}
              <span className="text-[#94A3B8]">Storage: {deviceCaps.storageEstimateMB > 0 ? `~${Math.round(deviceCaps.storageEstimateMB / 1024)} GB free` : 'Unknown'}</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-400 w-5 h-5" />
              <span className="text-[#94A3B8]">Browser: {deviceCaps.browser} on {deviceCaps.os}</span>
            </div>
          </div>
          
          <div className="p-4 bg-[#0F172A] rounded-lg border border-[#334155]">
            <div className="text-sm text-[#94A3B8] mb-1">Recommended AI:</div>
            <div className="text-white font-bold text-lg mb-2">Qwen IELTS 1.5B (WebGPU)</div>
            <div className="text-sm text-[#94A3B8] flex items-center gap-2">
              <HardDrive className="w-4 h-4" /> Download size: ~1.1 GB
            </div>
          </div>
          
          {deviceCaps.tier === LocalAITier.CLOUD_ONLY && (
             <div className="mt-4 p-3 bg-red-500/20 text-red-300 rounded-lg text-sm">
               Your device does not support Local AI (WebGPU required). You will be routed to Cloud AI.
             </div>
          )}
        </div>
      )}

      {(isLoading || (!isReady && initProgress)) && (
        <div className="bg-[#1E293B] p-4 rounded-xl border border-[#334155] mb-6">
          <p className="text-sm text-[#94A3B8] font-mono">{initProgress}</p>
        </div>
      )}

      {isReady && (
        <div className="flex-1 flex flex-col bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden">
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
            {messages.length === 0 ? (
              <div className="text-center text-[#94A3B8] my-auto">
                <Bot className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Local AI is ready. Send a message to test inference.</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'user' ? 'bg-[#38BDF8]/20 text-[#38BDF8]' : 'bg-slate-700 text-white'
                  }`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${
                    msg.role === 'user' 
                      ? 'bg-[#38BDF8] text-[#0F172A] rounded-tr-none' 
                      : 'bg-slate-700 text-white rounded-tl-none'
                  }`}>
                    {msg.content || (isGenerating && i === messages.length - 1 ? (
                      <span className="flex gap-1">
                        <span className="animate-bounce">.</span>
                        <span className="animate-bounce delay-100">.</span>
                        <span className="animate-bounce delay-200">.</span>
                      </span>
                    ) : '')}
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-4 border-t border-[#334155] bg-slate-800/50">
            <div className="flex gap-2">
              <input 
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Message Local Qwen..."
                className="flex-1 bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-2 text-white placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8] transition-colors"
                disabled={isGenerating}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isGenerating}
                className="p-2 bg-[#38BDF8] text-[#0F172A] rounded-lg hover:bg-sky-400 disabled:opacity-50 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
