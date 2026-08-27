import React, { useState, useEffect } from 'react';
import { SentenceBuilderQuestion } from '../../lib/types';
import { sound } from '../../lib/audio';

interface SentenceBuilderProps {
  question: SentenceBuilderQuestion;
  onAnswerChange: (assembledSentence: string, isReady: boolean) => void;
  isAnswerSubmitted: boolean;
}

interface TileItem {
  id: string;
  word: string;
}

export const SentenceBuilder: React.FC<SentenceBuilderProps> = ({
  question,
  onAnswerChange,
  isAnswerSubmitted,
}) => {
  // Initialize tiles with unique IDs so duplicates (like "the", "a") can be tracked independently
  const [bankTiles, setBankTiles] = useState<TileItem[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<TileItem[]>([]);

  useEffect(() => {
    // Shuffle words
    const initialTiles = question.words.map((w, idx) => ({
      id: `${w}-${idx}`,
      word: w,
    })).sort(() => Math.random() - 0.5);

    setBankTiles(initialTiles);
    setSelectedTiles([]);
  }, [question]);

  const handleSelectTile = (tile: TileItem) => {
    if (isAnswerSubmitted) return;
    sound.playTile();
    const newSelected = [...selectedTiles, tile];
    const newBank = bankTiles.filter(t => t.id !== tile.id);

    setSelectedTiles(newSelected);
    setBankTiles(newBank);

    const sentence = newSelected.map(t => t.word).join(' ');
    onAnswerChange(sentence, newSelected.length > 0);
  };

  const handleDeselectTile = (tile: TileItem) => {
    if (isAnswerSubmitted) return;
    sound.playTile();
    const newSelected = selectedTiles.filter(t => t.id !== tile.id);
    const newBank = [...bankTiles, tile];

    setSelectedTiles(newSelected);
    setBankTiles(newBank);

    const sentence = newSelected.map(t => t.word).join(' ');
    onAnswerChange(sentence, newSelected.length > 0);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto select-none">
      {/* Question Prompt */}
      <div>
        <h3 className="text-xl md:text-2xl font-black text-duo-charcoal leading-snug">
          {question.prompt}
        </h3>
        {question.subPrompt && (
          <div className="mt-2 p-3 bg-blue-50/70 rounded-2xl border border-blue-200 text-xs md:text-sm font-bold text-blue-900">
            {question.subPrompt}
          </div>
        )}
      </div>

      {/* Assembly Area (The target drop area) */}
      <div className="min-h-[120px] p-4 bg-gray-50/80 rounded-2xl border-2 border-dashed border-gray-300 flex flex-wrap gap-2.5 items-center content-start">
        {selectedTiles.length === 0 ? (
          <div className="w-full text-center text-xs font-bold text-gray-400 py-6">
            Tap the word tiles below in the correct order to construct the sentence
          </div>
        ) : (
          selectedTiles.map(tile => (
            <button
              key={tile.id}
              onClick={() => handleDeselectTile(tile)}
              disabled={isAnswerSubmitted}
              className="word-tile bg-white border-duo-blue text-duo-charcoal hover:border-red-400 hover:text-red-600 transition-all text-sm md:text-base animate-bounceSmall"
            >
              {tile.word}
            </button>
          ))
        )}
      </div>

      {/* Word Tile Bank */}
      <div className="pt-4 border-t-2 border-duo-gray">
        <div className="flex flex-wrap gap-2.5 justify-center">
          {bankTiles.map(tile => (
            <button
              key={tile.id}
              onClick={() => handleSelectTile(tile)}
              disabled={isAnswerSubmitted}
              className="word-tile hover:scale-105 active:scale-95 text-sm md:text-base"
            >
              {tile.word}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
