import React, { useState, useEffect } from 'react';
import { PairMatchingQuestion } from '../../lib/types';
import { sound } from '../../lib/audio';

interface PairMatchingProps {
  question: PairMatchingQuestion;
  onAllMatched: (isComplete: boolean) => void;
  isAnswerSubmitted: boolean;
}

interface Tile {
  id: string;
  text: string;
  pairKey: string; // the common identifier connecting left and right
  side: 'left' | 'right';
}

export const PairMatching: React.FC<PairMatchingProps> = ({
  question,
  onAllMatched,
  isAnswerSubmitted,
}) => {
  const [leftTiles, setLeftTiles] = useState<Tile[]>([]);
  const [rightTiles, setRightTiles] = useState<Tile[]>([]);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [matchedPairKeys, setMatchedPairKeys] = useState<string[]>([]);
  const [wrongPairKeys, setWrongPairKeys] = useState<string[]>([]);

  useEffect(() => {
    const lefts: Tile[] = question.pairs.map((p, i) => ({
      id: `l-${i}`,
      text: p.left,
      pairKey: `pair-${i}`,
      side: 'left' as const,
    })).sort(() => Math.random() - 0.5);

    const rights: Tile[] = question.pairs.map((p, i) => ({
      id: `r-${i}`,
      text: p.right,
      pairKey: `pair-${i}`,
      side: 'right' as const,
    })).sort(() => Math.random() - 0.5);

    setLeftTiles(lefts);
    setRightTiles(rights);
    setSelectedTile(null);
    setMatchedPairKeys([]);
    setWrongPairKeys([]);
  }, [question]);

  const handleTileClick = (tile: Tile) => {
    if (isAnswerSubmitted || matchedPairKeys.includes(tile.pairKey)) return;

    sound.playTile();

    if (!selectedTile) {
      setSelectedTile(tile);
      return;
    }

    if (selectedTile.id === tile.id) {
      setSelectedTile(null);
      return;
    }

    // Check if matching pair
    if (selectedTile.side !== tile.side && selectedTile.pairKey === tile.pairKey) {
      // MATCH!
      sound.playCorrect();
      const newMatched = [...matchedPairKeys, tile.pairKey];
      setMatchedPairKeys(newMatched);
      setSelectedTile(null);

      if (newMatched.length === question.pairs.length) {
        onAllMatched(true);
      }
    } else {
      // MISMATCH
      sound.playWrong();
      const currentMismatch = [selectedTile.id, tile.id];
      setWrongPairKeys(currentMismatch);
      setTimeout(() => {
        setWrongPairKeys([]);
        setSelectedTile(null);
      }, 700);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto select-none">
      <div>
        <h3 className="text-xl md:text-2xl font-black text-duo-charcoal leading-snug">
          {question.prompt}
        </h3>
        <p className="text-xs md:text-sm font-bold text-gray-500 mt-1">
          Tap matching pairs to link them ({matchedPairKeys.length}/{question.pairs.length} completed)
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Left column */}
        <div className="flex flex-col gap-3">
          {leftTiles.map(tile => {
            const isMatched = matchedPairKeys.includes(tile.pairKey);
            const isSelected = selectedTile?.id === tile.id;
            const isWrong = wrongPairKeys.includes(tile.id);

            let style = 'bg-white border-duo-gray text-duo-charcoal hover:bg-gray-50';
            if (isMatched) {
              style = 'bg-green-50/80 border-duo-green text-duo-green opacity-50 cursor-default line-through';
            } else if (isWrong) {
              style = 'bg-red-50 border-duo-red text-duo-red animate-shake';
            } else if (isSelected) {
              style = 'bg-blue-50 border-duo-blue text-duo-blue border-b-4 scale-102';
            }

            return (
              <button
                key={tile.id}
                onClick={() => handleTileClick(tile)}
                disabled={isMatched || isAnswerSubmitted}
                className={`p-4 rounded-2xl border-2 border-b-4 font-black text-sm md:text-base text-center transition-all ${style}`}
              >
                {tile.text}
              </button>
            );
          })}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-3">
          {rightTiles.map(tile => {
            const isMatched = matchedPairKeys.includes(tile.pairKey);
            const isSelected = selectedTile?.id === tile.id;
            const isWrong = wrongPairKeys.includes(tile.id);

            let style = 'bg-white border-duo-gray text-duo-charcoal hover:bg-gray-50';
            if (isMatched) {
              style = 'bg-green-50/80 border-duo-green text-duo-green opacity-50 cursor-default line-through';
            } else if (isWrong) {
              style = 'bg-red-50 border-duo-red text-duo-red animate-shake';
            } else if (isSelected) {
              style = 'bg-blue-50 border-duo-blue text-duo-blue border-b-4 scale-102';
            }

            return (
              <button
                key={tile.id}
                onClick={() => handleTileClick(tile)}
                disabled={isMatched || isAnswerSubmitted}
                className={`p-4 rounded-2xl border-2 border-b-4 font-black text-sm md:text-base text-center transition-all ${style}`}
              >
                {tile.text}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
