import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Edit2, CheckCircle, Trash2, BookOpen, 
  Sparkles, Send, Award, Globe, RotateCcw, Filter, Eye
} from 'lucide-react';
import { getFirestore, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { PracticeItem, PracticeStatus, SkillType } from '../../../lib/types';
import { useAuth } from '../../../lib/AuthContext';
import { PracticeEditor } from './PracticeEditor';

const STORAGE_KEY_PRACTICE = 'akhl_admin_practice_items_v2';

const SEED_PRACTICE_ITEMS: PracticeItem[] = [
  {
    id: 'prc-spk-001',
    title: 'Part 2 Cue Card: Decisive Career Crossroads',
    skill: 'speaking',
    part: 'Part 2',
    questionType: 'multiple-choice',
    topic: 'Career Decisions & Mentorship',
    difficulty: 'hard',
    targetBandMin: 7.0,
    targetBandMax: 8.5,
    curriculumClass: 'Class 7 - Speaking Part 2 Mastery & ARE Framework',
    objective: 'Demonstrate sustained fluency over 2 uninterrupted minutes with syntactic inversion and advanced discourse markers.',
    instructions: 'Prepare for 1 minute using the bullet prompts, then speak uninterrupted for 2 full minutes.',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        skill: 'speaking',
        prompt: 'Describe a pivotal decision you made regarding your academic or professional pathway.',
        options: ['Pathway A', 'Pathway B'],
        correctIndex: 0,
        explanation: 'Model Band 9.0 incorporates cleft sentences ("What proved truly decisive was...") and inversion ("Not only did my advisor propose...").'
      }
    ],
    answerKey: { "1": "ARE framework compliance >= 90%" },
    explanations: 'Band 9.0 model notes: emphasize concrete examples, precise idioms, and avoided repetition of base adjectives.',
    status: 'published',
    version: 3,
    createdBy: 'faculty-asif-kibria',
    createdAt: '2026-08-10T10:00:00Z',
    updatedBy: 'faculty-asif-kibria',
    updatedAt: '2026-08-25T14:30:00Z'
  },
  {
    id: 'prc-wri-001',
    title: 'Academic Task 1: Renewable Energy Transition (1995-2025)',
    skill: 'writing',
    part: 'Task 1',
    questionType: 'multiple-choice',
    topic: 'Renewable Power Infrastructure',
    difficulty: 'medium',
    targetBandMin: 6.5,
    targetBandMax: 8.0,
    curriculumClass: 'Class 9 - Task 1 Academic & Zero-Number Overview Rule',
    objective: 'Synthesize complex comparative line graphs and compose an overview paragraph with strictly zero numerical figures.',
    instructions: 'Summarize the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        skill: 'writing',
        prompt: 'Write a comprehensive 150-word report analyzing global wind and solar investment trends.',
        options: ['Overview with figures', 'Zero-Number Overview (Compliant)'],
        correctIndex: 1,
        explanation: 'The overview must describe overall upward trajectories without quoting any exact gigawatts or percentages.'
      }
    ],
    answerKey: { "rule": "Zero-Number Overview strictly verified" },
    explanations: 'Model Overview: "Overall, renewable energy consumption witnessed significant exponential growth across the thirty-year timeframe, whereas conventional thermal sources experienced a corresponding decline."',
    status: 'published',
    version: 2,
    createdBy: 'faculty-asif-kibria',
    createdAt: '2026-08-12T09:00:00Z',
    updatedBy: 'faculty-asif-kibria',
    updatedAt: '2026-08-28T16:00:00Z'
  },
  {
    id: 'prc-rdg-001',
    title: 'Academic Passage 3: Marine Bioluminescence & Deep-Sea Chemosynthesis',
    skill: 'reading',
    part: 'Passage 3',
    questionType: 'multiple-choice',
    topic: 'Oceanography & Marine Biology',
    difficulty: 'hard',
    targetBandMin: 7.0,
    targetBandMax: 8.5,
    curriculumClass: 'Class 5 - Reading True/False/Not Given & Textual Citations',
    objective: 'Differentiate between factual confirmation, direct refutation, and unsubstantiated conjecture under strict 20-min timing.',
    instructions: 'Read the text and determine whether each statement agrees with the information in the passage.',
    passage: [
      'Bioluminescence in abyssal organisms represents an evolutionary marvel of biochemical engineering, where luciferin molecules oxidize under the enzymatic catalysis of luciferase.',
      'Unlike surface illumination, benthic glow serves complex multi-spectral signaling functions, including deceptive counter-illumination against ventral predators.',
      'Recent submersibles have verified that approximately 76 percent of oceanic species possess indigenous photophore organs capable of emitting blue-green wavelength light.'
    ],
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        skill: 'reading',
        prompt: 'Benthic photophores emit light exclusively in the red spectral band.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        correctIndex: 1,
        explanation: 'Direct refutation in paragraph 3: emission occurs in "blue-green wavelength light", refuting exclusive red emission.'
      }
    ],
    answerKey: { "1": "FALSE" },
    explanations: 'Paragraph 3 provides explicit textual refutation for statement 1.',
    status: 'approved',
    version: 2,
    createdBy: 'teacher-kibria',
    createdAt: '2026-08-18T11:20:00Z',
    updatedBy: 'faculty-asif-kibria',
    updatedAt: '2026-08-30T10:15:00Z'
  },
  {
    id: 'prc-wri-002',
    title: 'Academic Task 2: Autonomous AI Workforce Disruption',
    skill: 'writing',
    part: 'Task 2',
    questionType: 'multiple-choice',
    topic: 'Artificial Intelligence & Labor Economics',
    difficulty: 'hard',
    targetBandMin: 7.5,
    targetBandMax: 8.5,
    curriculumClass: 'Class 11 - Task 2 Discursive Argumentation & C1/C2 Lexis',
    objective: 'Develop a balanced discursive essay examining societal ramifications of cognitive automation with cohesive paragraph development.',
    instructions: 'Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        skill: 'writing',
        prompt: 'Some experts assert that AI automation will cause widespread unemployment, while others maintain it will create superior intellectual professions. Discuss both views and state your opinion.',
        options: ['One-sided argument', 'Balanced discursive synthesis'],
        correctIndex: 1,
        explanation: 'Requires balanced two-sided body paragraphs followed by a nuanced, reasoned thesis stance.'
      }
    ],
    answerKey: { "minWords": 250 },
    explanations: 'High-scoring essays deploy cohesive ties ("Whereas proponents champion...", "Conversely, critics argue...") and sophisticated lexis ("intellectual displacement", "paradigmatic transition").',
    status: 'faculty_review',
    version: 1,
    createdBy: 'faculty-teacher',
    createdAt: '2026-08-28T15:00:00Z',
    updatedBy: 'faculty-teacher',
    updatedAt: '2026-08-29T11:45:00Z'
  },
  {
    id: 'prc-lst-001',
    title: 'Section 4 Lecture: Antarctic Ice Core Paleoclimatology',
    skill: 'listening',
    part: 'Section 4',
    questionType: 'multiple-choice',
    topic: 'Paleoclimatology & Glacial Geophysics',
    difficulty: 'hard',
    targetBandMin: 7.0,
    targetBandMax: 8.5,
    curriculumClass: 'Class 3 - Listening Section 3 & 4 Academic Discourse',
    objective: 'Follow uninterrupted academic lectures and extract precise technical vocabulary without distraction traps.',
    instructions: 'Listen to the university lecture and complete the notes below with NO MORE THAN TWO WORDS.',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        skill: 'listening',
        prompt: 'Atmospheric gas bubbles trapped inside polar ice offer an accurate chemical snapshot of prehistoric carbon dioxide levels.',
        options: ['nitrogen', 'carbon dioxide', 'ozone'],
        correctIndex: 1,
        explanation: 'The lecturer notes: "trapped air bubbles furnish an pristine archive of ancient carbon dioxide concentrations."'
      }
    ],
    answerKey: { "1": "carbon dioxide" },
    explanations: 'Phonetic transcription and synonym awareness ("pristine archive" = "accurate chemical snapshot").',
    status: 'ai_review',
    version: 1,
    createdBy: 'curriculum-dev',
    createdAt: '2026-08-30T09:30:00Z',
    updatedBy: 'ai-validator',
    updatedAt: '2026-08-30T10:00:00Z'
  },
  {
    id: 'prc-spk-002',
    title: 'Foundation Tier S-V-O Sentence Builder: Urban Greenery',
    skill: 'speaking',
    part: 'Part 1',
    questionType: 'multiple-choice',
    topic: 'Parks and Public Spaces',
    difficulty: 'easy',
    targetBandMin: 3.5,
    targetBandMax: 5.0,
    curriculumClass: 'Class 1 - Foundation Grammar: Subject-Verb-Object & Elimination of L1 Transfer',
    objective: 'Build grammatically robust English sentences using active word tiles without translation delay.',
    instructions: 'Construct complete sentences responding to the examiner prompt.',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        skill: 'speaking',
        prompt: 'Do you enjoy spending time in public parks? (Construct response with Reason + Example)',
        options: ['Yes, because public parks provide tranquility.', 'Yes I like.'],
        correctIndex: 0,
        explanation: 'Foundation practice emphasizing Subject-Verb agreement and basic linking words.'
      }
    ],
    answerKey: { "structure": "SVO + Conjunction" },
    explanations: 'Avoid fragment clauses and maintain clear present simple cadence.',
    status: 'draft',
    version: 1,
    createdBy: 'faculty-teacher',
    createdAt: '2026-09-01T08:00:00Z',
    updatedBy: 'faculty-teacher',
    updatedAt: '2026-09-01T08:00:00Z'
  }
];

export const PracticeManager: React.FC = () => {
  const { role } = useAuth();
  const [practiceItems, setPracticeItems] = useState<PracticeItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRACTICE);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return SEED_PRACTICE_ITEMS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [skillFilter, setSkillFilter] = useState('All');
  
  const [editingItem, setEditingItem] = useState<PracticeItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Sync with Firestore if available, otherwise retain rich local seed/cache
  useEffect(() => {
    try {
      const db = getFirestore();
      const q = query(collection(db, 'practice'), orderBy('createdAt', 'desc'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const items: PracticeItem[] = [];
          snapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as PracticeItem);
          });
          setPracticeItems(items);
          try {
            localStorage.setItem(STORAGE_KEY_PRACTICE, JSON.stringify(items));
          } catch (e) {}
        }
      }, (err) => {
        console.warn('Firestore offline/read fallback to local practice items:', err);
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn('Using local practice database');
    }
  }, []);

  const saveItems = (items: PracticeItem[]) => {
    setPracticeItems(items);
    try {
      localStorage.setItem(STORAGE_KEY_PRACTICE, JSON.stringify(items));
    } catch (e) {}
  };

  /**
   * 5-Stage Approval Lifecycle Transition Handlers
   */
  const handleAdvanceStage = (item: PracticeItem) => {
    const stageSequence: PracticeStatus[] = ['draft', 'ai_review', 'faculty_review', 'approved', 'published'];
    const currentIdx = stageSequence.indexOf(item.status);
    if (currentIdx < 0 || currentIdx >= stageSequence.length - 1) return;

    const nextStage = stageSequence[currentIdx + 1];
    const updated = practiceItems.map(p => {
      if (p.id === item.id) {
        return {
          ...p,
          status: nextStage,
          updatedAt: new Date().toISOString(),
          version: (p.version || 1) + 1
        };
      }
      return p;
    });

    saveItems(updated);
  };

  const handleRevokeToDraft = (id: string) => {
    if (!window.confirm('Revoke this practice module back to draft for further faculty revision?')) return;
    const updated = practiceItems.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: 'draft' as PracticeStatus,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    });
    saveItems(updated);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this practice module?')) return;
    const updated = practiceItems.filter(p => p.id !== id);
    saveItems(updated);
  };

  const filteredItems = practiceItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.curriculumClass.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSkill = skillFilter === 'All' || item.skill.toLowerCase() === skillFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesSkill;
  });

  const getStatusBadge = (status: PracticeStatus) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/30">
            <Globe className="w-3.5 h-3.5" /> Published
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Award className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case 'faculty_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <CheckCircle className="w-3.5 h-3.5" /> Faculty Review
          </span>
        );
      case 'ai_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30">
            <Sparkles className="w-3.5 h-3.5" /> AI Review
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-500/10 text-slate-400 border border-slate-500/30">
            <Edit2 className="w-3.5 h-3.5" /> Draft
          </span>
        );
    }
  };

  if (isCreating || editingItem) {
    return (
      <PracticeEditor 
        item={editingItem} 
        onClose={() => {
          setIsCreating(false);
          setEditingItem(null);
          // Reload local storage in case editor saved changes
          try {
            const saved = localStorage.getItem(STORAGE_KEY_PRACTICE);
            if (saved) setPracticeItems(JSON.parse(saved));
          } catch (e) {}
        }} 
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#1E293B] p-6 rounded-3xl border border-[#334155]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30">
              Curriculum & Practice CMS
            </span>
            <span className="text-xs text-slate-400">Dr. Asif Kibria 16-Class Master Suite</span>
          </div>
          <h1 className="text-2xl font-black text-white">Practice Modules & Approval Portal</h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Manage practice content across all 4 IELTS skills with strict 5-stage faculty approval gates.
          </p>
        </div>
        
        <button 
          onClick={() => setIsCreating(true)}
          className="px-5 py-2.5 bg-[#38BDF8] hover:bg-[#0284C7] text-slate-950 font-black rounded-xl text-sm transition-all shadow-lg shadow-sky-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New Module
        </button>
      </div>

      {/* 5-Stage Approval Lifecycle Summary Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Draft', count: practiceItems.filter(p => p.status === 'draft').length, color: 'text-slate-400', border: 'border-slate-700' },
          { label: 'AI Review', count: practiceItems.filter(p => p.status === 'ai_review').length, color: 'text-sky-400', border: 'border-sky-500/30' },
          { label: 'Faculty Review', count: practiceItems.filter(p => p.status === 'faculty_review').length, color: 'text-purple-400', border: 'border-purple-500/30' },
          { label: 'Approved', count: practiceItems.filter(p => p.status === 'approved').length, color: 'text-emerald-400', border: 'border-emerald-500/30' },
          { label: 'Published', count: practiceItems.filter(p => p.status === 'published').length, color: 'text-green-400', border: 'border-green-500/30' },
        ].map((stage, idx) => (
          <div key={stage.label} className={`bg-[#1E293B] border ${stage.border} rounded-2xl p-3.5 flex flex-col justify-between`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Step {idx + 1}</span>
              <span className={`text-lg font-black ${stage.color}`}>{stage.count}</span>
            </div>
            <p className="text-xs font-bold text-white mt-1">{stage.label}</p>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-[#1E293B] p-4 rounded-2xl border border-[#334155] flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search by title, topic, or Dr. Asif curriculum class..."
            className="w-full bg-[#0F172A] border border-[#334155] rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-[#38BDF8]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Status Lifecycle Filter */}
        <div className="flex items-center gap-2">
          <select 
            className="bg-[#0F172A] border border-[#334155] rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#38BDF8]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Stages (5-Stage Gate)</option>
            <option value="draft">Stage 1: Draft</option>
            <option value="ai_review">Stage 2: AI Review</option>
            <option value="faculty_review">Stage 3: Faculty Review</option>
            <option value="approved">Stage 4: Approved</option>
            <option value="published">Stage 5: Published</option>
          </select>

          {/* Skill Filter */}
          <select 
            className="bg-[#0F172A] border border-[#334155] rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#38BDF8]"
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
          >
            <option value="All">All 4 Skills</option>
            <option value="listening">Listening</option>
            <option value="reading">Reading</option>
            <option value="writing">Writing</option>
            <option value="speaking">Speaking</option>
          </select>
        </div>
      </div>

      {/* Table of Practice Modules */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F172A] text-[#94A3B8] text-[11px] font-bold uppercase tracking-wider border-b border-[#334155]">
                <th className="p-4">Practice Module</th>
                <th className="p-4">Skill & Part</th>
                <th className="p-4">Curriculum Mapping</th>
                <th className="p-4">Approval Stage</th>
                <th className="p-4">Target Band</th>
                <th className="p-4 text-right">Lifecycle Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155] text-xs">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#334155]/20 transition-colors">
                  <td className="p-4">
                    <p className="text-white font-bold text-sm">{item.title}</p>
                    <p className="text-[#94A3B8] text-[11px] mt-0.5">{item.topic}</p>
                  </td>
                  <td className="p-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase ${
                      item.skill === 'speaking' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                      item.skill === 'writing' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30' :
                      item.skill === 'reading' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                    }`}>
                      {item.skill} • {item.part}
                    </span>
                  </td>
                  <td className="p-4 text-[#94A3B8] max-w-xs">
                    <p className="truncate font-medium text-slate-300">{item.curriculumClass}</p>
                    <span className="text-[10px] text-slate-500">v{item.version || 1} • {new Date(item.updatedAt).toLocaleDateString()}</span>
                  </td>
                  <td className="p-4">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-white">Band {item.targetBandMin} - {item.targetBandMax}</span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Advance Stage Button */}
                      {item.status === 'draft' && (
                        <button
                          onClick={() => handleAdvanceStage(item)}
                          className="px-2.5 py-1 bg-sky-500/20 hover:bg-sky-500/30 text-[#38BDF8] border border-sky-500/30 rounded-lg text-[11px] font-bold flex items-center gap-1 transition"
                          title="Advance to AI Review"
                        >
                          <Sparkles className="w-3 h-3" /> To AI Review
                        </button>
                      )}

                      {item.status === 'ai_review' && (
                        <button
                          onClick={() => handleAdvanceStage(item)}
                          className="px-2.5 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 rounded-lg text-[11px] font-bold flex items-center gap-1 transition"
                          title="Submit for Faculty Review"
                        >
                          <Send className="w-3 h-3" /> To Faculty
                        </button>
                      )}

                      {item.status === 'faculty_review' && (
                        <button
                          onClick={() => handleAdvanceStage(item)}
                          className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-[11px] font-bold flex items-center gap-1 transition"
                          title="Approve Content"
                        >
                          <CheckCircle className="w-3 h-3" /> Approve
                        </button>
                      )}

                      {item.status === 'approved' && (
                        <button
                          onClick={() => handleAdvanceStage(item)}
                          className="px-2.5 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30 rounded-lg text-[11px] font-bold flex items-center gap-1 transition"
                          title="Publish Live"
                        >
                          <Globe className="w-3 h-3" /> Publish
                        </button>
                      )}

                      {item.status === 'published' && (
                        <button
                          onClick={() => handleRevokeToDraft(item.id)}
                          className="p-1.5 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-[#0F172A] transition"
                          title="Revoke to Draft"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}

                      {/* Edit Button */}
                      <button 
                        onClick={() => setEditingItem(item)}
                        className="p-1.5 text-[#94A3B8] hover:text-[#38BDF8] rounded-lg hover:bg-[#0F172A] transition"
                        title="Edit Module"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-[#94A3B8] hover:text-rose-400 rounded-lg hover:bg-[#0F172A] transition"
                        title="Delete Module"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-[#94A3B8]">
                    No practice items matching the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
