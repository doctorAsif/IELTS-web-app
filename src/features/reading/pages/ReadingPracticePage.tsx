import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Layers, ChevronRight, Award } from 'lucide-react';
import { CurriculumService } from '../../../services/curriculumService';
import { ReadingPracticeItem } from '../../../types/curriculum';
import { ReadingDetailView } from '../../curriculum/components/ReadingDetailView';

export const ReadingPracticePage: React.FC = () => {
  const [readingItemsV1, setReadingItemsV1] = useState<ReadingPracticeItem[]>([]);
  const [readingItemsV2, setReadingItemsV2] = useState<ReadingPracticeItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ReadingPracticeItem | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    CurriculumService.loadAll().then(() => {
      const v1 = CurriculumService.getReadingBank(1);
      const v2 = CurriculumService.getReadingBank(2);
      setReadingItemsV1(v1);
      setReadingItemsV2(v2);
      if (v2.length > 0) setSelectedItem(v2[0]);
      else if (v1.length > 0) setSelectedItem(v1[0]);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Top Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-5 gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-2xl font-black text-white tracking-tight">IELTS Academic Reading Simulator</h1>
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs px-2.5 py-0.5 rounded-full font-bold">
              200 Passages (Vol 1 & Vol 2) • Band 6.5–9.0
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Dr. Asif Move On Rule & Synonym Radar: Search directly for factual paraphrases. Instant evaluation.
          </p>
        </div>

        {/* Test Dropdown Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-medium">Select Passage:</span>
          <select
            value={selectedItem?.id || ''}
            onChange={(e) => {
              const val = e.target.value;
              const found = readingItemsV2.find((r) => r.id === val) || readingItemsV1.find((r) => r.id === val);
              if (found) setSelectedItem(found);
            }}
            className="bg-[#131B2E] border border-white/15 text-xs text-white rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-amber-400 max-w-xs cursor-pointer"
          >
            <optgroup label="🇧🇩 Vol 2: Bangladesh Mentor Edition (100 Passages)">
              {readingItemsV2.map((r) => (
                <option key={r.id} value={r.id} className="bg-[#0B0F19] text-white">
                  {r.id}: {r.title.slice(0, 32)}...
                </option>
              ))}
            </optgroup>
            <optgroup label="📘 Vol 1: Cambridge Standard Bank (100 Passages)">
              {readingItemsV1.map((r) => (
                <option key={r.id} value={r.id} className="bg-[#0B0F19] text-white">
                  {r.id}: {r.title.slice(0, 32)}...
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      {selectedItem ? (
        <ReadingDetailView item={selectedItem} />
      ) : (
        <div className="text-center p-12 text-slate-400">Loading Reading Bank...</div>
      )}
    </div>
  );
};
