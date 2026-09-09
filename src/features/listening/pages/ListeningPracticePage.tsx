import React, { useState, useEffect } from 'react';
import { Headphones, Search, Layers, ChevronRight, Award } from 'lucide-react';
import { CurriculumService } from '../../../services/curriculumService';
import { ListeningPracticeItem } from '../../../types/curriculum';
import { ListeningDetailView } from '../../curriculum/components/ListeningDetailView';

export const ListeningPracticePage: React.FC = () => {
  const [listeningItemsV1, setListeningItemsV1] = useState<ListeningPracticeItem[]>([]);
  const [listeningItemsV2, setListeningItemsV2] = useState<ListeningPracticeItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ListeningPracticeItem | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    CurriculumService.loadAll().then(() => {
      const v1 = CurriculumService.getListeningBank(1);
      const v2 = CurriculumService.getListeningBank(2);
      setListeningItemsV1(v1);
      setListeningItemsV2(v2);
      if (v2.length > 0) setSelectedItem(v2[0]);
      else if (v1.length > 0) setSelectedItem(v1[0]);
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Top Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-5 gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-2xl font-black text-white tracking-tight">IELTS Listening Practice Simulator</h1>
            <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs px-2.5 py-0.5 rounded-full font-bold">
              200 Sections (Vol 1 & Vol 2) • Cambridge Audio
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Listen once only, exactly as in the official IELTS test. Distractor Catcher & British Speech audio synthesis.
          </p>
        </div>

        {/* Test Dropdown Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-medium">Select Section:</span>
          <select
            value={selectedItem?.id || ''}
            onChange={(e) => {
              const val = e.target.value;
              const found = listeningItemsV2.find((l) => l.id === val) || listeningItemsV1.find((l) => l.id === val);
              if (found) setSelectedItem(found);
            }}
            className="bg-[#131B2E] border border-white/15 text-xs text-white rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-purple-400 max-w-xs cursor-pointer"
          >
            <optgroup label="🇧🇩 Vol 2: Bangladesh Mentor Edition (100 Sections)">
              {listeningItemsV2.map((l) => (
                <option key={l.id} value={l.id} className="bg-[#0B0F19] text-white">
                  {l.id}: Sec {l.section} - {l.scenario.slice(0, 28)}...
                </option>
              ))}
            </optgroup>
            <optgroup label="📘 Vol 1: Cambridge Standard Bank (100 Sections)">
              {listeningItemsV1.map((l) => (
                <option key={l.id} value={l.id} className="bg-[#0B0F19] text-white">
                  {l.id}: Sec {l.section} - {l.scenario.slice(0, 28)}...
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      {selectedItem ? (
        <ListeningDetailView item={selectedItem} />
      ) : (
        <div className="text-center p-12 text-slate-400">Loading Listening Bank...</div>
      )}
    </div>
  );
};

