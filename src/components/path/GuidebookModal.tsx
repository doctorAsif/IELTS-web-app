import React from 'react';
import { X, BookOpen, Lightbulb, Sparkles, CheckCircle } from 'lucide-react';
import { Unit } from '../../lib/types';
import { sound } from '../../lib/audio';

interface GuidebookModalProps {
  unit: Unit;
  onClose: () => void;
}

export const GuidebookModal: React.FC<GuidebookModalProps> = ({ unit, onClose }) => {
  const gb = unit.guidebook;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="card-duo max-w-2xl w-full max-h-[90vh] flex flex-col bg-white overflow-hidden shadow-2xl animate-bounceSmall">
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white border-b-2 border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-200">
                Unit {unit.id} Guidebook
              </span>
              <h3 className="text-xl font-black">{unit.title}</h3>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Overview */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
            <h4 className="text-sm font-black text-emerald-900 uppercase tracking-wider mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Strategic Overview
            </h4>
            <p className="text-sm text-emerald-950 font-semibold leading-relaxed">
              {gb.overview}
            </p>
          </div>

          {/* Key Tips */}
          <div>
            <h4 className="text-sm font-black text-duo-charcoal uppercase tracking-wider mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-duo-gold" />
              Examiner Pro Tips & Traps
            </h4>
            <div className="space-y-2.5">
              {gb.keyTips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-200">
                  <CheckCircle className="w-5 h-5 text-duo-green shrink-0 mt-0.5" />
                  <p className="text-xs md:text-sm font-bold text-duo-charcoal leading-snug">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* High-Band Vocabulary */}
          {gb.vocabulary.length > 0 && (
            <div>
              <h4 className="text-sm font-black text-duo-charcoal uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="text-base">💎</span>
                Band 8.0+ Lexical Resource
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {gb.vocabulary.map((vocab, idx) => (
                  <div key={idx} className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-200/80">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-duo-blue text-base">{vocab.word}</span>
                      <span className="text-[11px] font-bold text-gray-500 italic">{vocab.pos}</span>
                    </div>
                    <p className="text-xs text-gray-700 font-semibold mb-2">{vocab.def}</p>
                    <div className="text-xs font-bold text-gray-600 bg-white p-2 rounded-xl border border-blue-100 italic">
                      "{vocab.example}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grammar Patterns */}
          {gb.grammarPatterns.length > 0 && (
            <div>
              <h4 className="text-sm font-black text-duo-charcoal uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="text-base">📐</span>
                Band 8.5+ Grammar Architectures
              </h4>
              <div className="space-y-3">
                {gb.grammarPatterns.map((gp, idx) => (
                  <div key={idx} className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
                    <div className="font-black text-sm text-purple-900 mb-1">{gp.title}</div>
                    <div className="text-xs font-mono font-bold text-purple-700 bg-purple-100/70 p-2 rounded-xl mb-2">
                      {gp.pattern}
                    </div>
                    <div className="text-xs font-bold text-gray-700 italic">
                      Example: {gp.example}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-duo-gray bg-gray-50 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="btn-duo-green px-6 py-2.5 text-xs font-black uppercase tracking-wider"
          >
            GOT IT!
          </button>
        </div>
      </div>
    </div>
  );
};
