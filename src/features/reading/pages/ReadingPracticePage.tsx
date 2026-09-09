import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Layers, ChevronRight, Award } from 'lucide-react';
import { CurriculumService } from '../../../services/curriculumService';
import { ReadingPracticeItem } from '../../../types/curriculum';
import { ReadingDetailView } from '../../curriculum/components/ReadingDetailView';

export const ReadingPracticePage: React.FC = () => {
  const [readingItems, setReadingItems] = useState<ReadingPracticeItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ReadingPracticeItem | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    CurriculumService.loadAll().then(() => {
      const bank = CurriculumService.getReadingBank();
      setReadingItems(bank);
      if (bank.length > 0) setSelectedItem(bank[0]);
    });
  }, []);

  const filtered = readingItems.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.domain.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Top Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-5 gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-2xl font-black text-white tracking-tight">IELTS Academic Reading Simulator</h1>
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs px-2.5 py-0.5 rounded-full font-bold">
              100 Authentic Passages • Band 6.5–9.0
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Dr. Asif Move On Rule: Search directly for factual keywords. Instant Cambridge-standard evaluation.
          </p>
        </div>

        {/* Test Dropdown Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-medium">Select Test:</span>
          <select
            value={selectedItem?.id || ''}
            onChange={(e) => {
              const found = readingItems.find((r) => r.id === e.target.value);
              if (found) setSelectedItem(found);
            }}
            className="bg-[#131B2E] border border-white/15 text-xs text-white rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-amber-400 max-w-xs cursor-pointer"
          >
            {readingItems.map((r) => (
              <option key={r.id} value={r.id} className="bg-[#0B0F19] text-white">
                {r.id}: {r.title.slice(0, 35)}...
              </option>
            ))}
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
