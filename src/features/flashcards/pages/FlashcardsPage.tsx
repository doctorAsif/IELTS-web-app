import React, { useState } from 'react';
import { Layers, Sparkles, ArrowLeft, ArrowRight, RotateCw, CheckCircle2 } from 'lucide-react';

export const FlashcardsPage: React.FC = () => {
  const cards = [
    {
      word: 'Notwithstanding',
      partOfSpeech: 'Preposition / Conjunction (C1/C2)',
      meaning: 'In spite of; despite; introduces complex concessive syntactic subordination.',
      example: 'Notwithstanding the demonstrable volatility in the initial quarter, overseas remittances exhibited a pronounced upward trajectory.',
      ieltsSection: 'Writing Task 1 & 2 (Grammar Score Booster)',
    },
    {
      word: 'Precipitous decline',
      partOfSpeech: 'Academic Collocation (C2)',
      meaning: 'A very steep, rapid, and sudden decrease.',
      example: 'Following the implementation of regulatory sanctions, domestic production witnessed a precipitous decline of 34%.',
      ieltsSection: 'Writing Task 1 (Lexical Resource)',
    },
    {
      word: 'Incontrovertible',
      partOfSpeech: 'Adjective (C2)',
      meaning: 'Not able to be denied or disputed; indisputable.',
      example: 'While it is incontrovertible that automation enhances industrial throughput, human supervision remains indispensable.',
      ieltsSection: 'Writing Task 2 (Coherence & Subordination)',
    },
    {
      word: 'Profoundly captivating',
      partOfSpeech: 'Speaking Collocation (C1)',
      meaning: 'Extremely interesting or fascinating; high-level alternative to "very interesting".',
      example: 'I found the architecture of the historical library profoundly captivating due to its intricate neoclassical façade.',
      ieltsSection: 'Speaking Part 1 & 2 (ARE Method Elaboration)',
    },
    {
      word: 'Diverged markedly',
      partOfSpeech: 'Comparative Collocation (C2)',
      meaning: 'To develop or move in a completely different direction in a noticeable manner.',
      example: 'The statistical trends diverged markedly after 2018, with urban migration outstripping rural development.',
      ieltsSection: 'Writing Task 1 (Overview & Comparison)',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const activeCard = cards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-6">
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-3 mb-1">
          <h1 className="text-2xl font-bold text-white tracking-tight">Top 200 Academic Vocabulary & Collocations</h1>
          <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs px-2.5 py-0.5 rounded-full font-medium">
            Band 8.5+ Lexicon
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Curated by Dr. Asif to eliminate repetitive A1/A2 words and boost your Lexical Resource & Grammatical Range scores.
        </p>
      </div>

      {/* Interactive Flashcard */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="cursor-pointer min-h-[320px] bg-gradient-to-br from-[#0D182E] via-[#0F2244] to-[#0A1428] border border-sky-500/30 p-8 rounded-3xl shadow-xl flex flex-col justify-between transition-all hover:scale-[1.01]"
      >
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="uppercase tracking-wider font-semibold text-sky-400">{activeCard.ieltsSection}</span>
          <span className="flex items-center space-x-1 text-[11px] text-slate-500">
            <RotateCw className="w-3 h-3" />
            <span>Click to flip</span>
          </span>
        </div>

        {!isFlipped ? (
          <div className="text-center py-8 space-y-3">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">{activeCard.word}</h2>
            <p className="text-xs text-sky-300 font-medium">{activeCard.partOfSpeech}</p>
          </div>
        ) : (
          <div className="py-4 space-y-4 text-center">
            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Definition & Pedagogical Use:</span>
              <p className="text-sm text-slate-200 font-medium">{activeCard.meaning}</p>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 text-xs text-slate-300 italic">
              "{activeCard.example}"
            </div>
          </div>
        )}

        <div className="text-center text-[11px] text-slate-500 font-medium">
          Card {currentIndex + 1} of {cards.length}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-4 py-2 rounded-xl text-xs text-slate-300 font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          onClick={handleNext}
          className="flex items-center space-x-2 bg-sky-500 hover:bg-sky-400 text-slate-950 px-5 py-2 rounded-xl text-xs font-bold transition-colors shadow-md"
        >
          <span>Next Collocation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
