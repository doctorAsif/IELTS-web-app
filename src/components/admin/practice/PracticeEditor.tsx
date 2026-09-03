import React, { useState } from 'react';
import { ArrowLeft, Save, Send, Eye, Sparkles, CheckCircle, AlertTriangle, BookOpen, Mic, PenTool, Headphones } from 'lucide-react';
import { getFirestore, collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { PracticeItem, PracticeStatus, SkillType } from '../../../lib/types';
import { useAuth } from '../../../lib/AuthContext';
import { AudioPlayer } from '../../interactive/AudioPlayer';

interface PracticeEditorProps {
  item: PracticeItem | null;
  onClose: () => void;
}

export const PracticeEditor: React.FC<PracticeEditorProps> = ({ item, onClose }) => {
  const { role, user } = useAuth();

  // Basic metadata
  const [title, setTitle] = useState(item?.title || '');
  const [skill, setSkill] = useState<SkillType>(item?.skill || 'reading');
  const [status, setStatus] = useState<PracticeStatus>(item?.status || 'draft');
  const [targetBandMin, setTargetBandMin] = useState(item?.targetBandMin || 6.5);
  const [part, setPart] = useState(item?.part || 'Part 1');
  const [topic, setTopic] = useState(item?.topic || 'Academic Discourse');
  const [curriculumClass, setCurriculumClass] = useState(item?.curriculumClass || 'Class 4 - Academic Foundations');
  const [instructions, setInstructions] = useState(item?.instructions || 'Read the following instructions carefully and answer all questions.');

  // Content fields for the 4 skills
  const [passageText, setPassageText] = useState(
    Array.isArray((item as any)?.passage) ? (item as any).passage.join('\n\n') : ((item as any)?.passage || '')
  );
  const [questionsText, setQuestionsText] = useState(
    Array.isArray(item?.questions) ? item.questions.join('\n') : ''
  );
  const [answersText, setAnswersText] = useState(
    item?.answerKey ? JSON.stringify(item.answerKey, null, 2) : '{\n  "1": ["TRUE"],\n  "2": ["FALSE"],\n  "3": ["NOT GIVEN"]\n}'
  );
  const [modelAnswer, setModelAnswer] = useState(item?.explanations || '');
  const [audioScript, setAudioScript] = useState(
    Array.isArray((item as any)?.script)
      ? JSON.stringify((item as any).script, null, 2)
      : '[\n  {"speaker": "Examiner", "text": "Good morning. Could you tell me your full name please?"},\n  {"speaker": "Candidate", "text": "Good morning. My name is Alex..."}\n]'
  );

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [isSaving, setIsSaving] = useState(false);

  // Review lifecycle transitions
  const handleTransitionStatus = async (newStatus: PracticeStatus) => {
    setStatus(newStatus);
    await handleSave(newStatus);
  };

  const handleSave = async (overrideStatus?: PracticeStatus) => {
    if (!title.trim()) {
      alert('Practice title is required.');
      return;
    }

    setIsSaving(true);
    const db = getFirestore();
    const finalStatus = overrideStatus || status;

    let parsedAnswerKey = {};
    try {
      parsedAnswerKey = JSON.parse(answersText);
    } catch (e) {
      parsedAnswerKey = { "1": [answersText.trim()] };
    }

    let parsedScript = [];
    if (skill === 'listening') {
      try {
        parsedScript = JSON.parse(audioScript);
      } catch (e) {
        parsedScript = [{ speaker: 'Examiner', text: audioScript }];
      }
    }

    const data: any = {
      title,
      skill,
      status: finalStatus,
      targetBandMin,
      targetBandMax: targetBandMin + 1.0,
      part,
      topic,
      curriculumClass,
      instructions,
      passage: passageText ? passageText.split(/\n\s*\n/) : [],
      questions: questionsText.split('\n').filter(q => q.trim().length > 0),
      answerKey: parsedAnswerKey,
      explanations: modelAnswer,
      script: parsedScript,
      updatedBy: user?.uid || 'faculty-admin',
      updatedAt: new Date().toISOString(),
    };

    // Always update local storage first so changes reflect immediately in CRM
    const STORAGE_KEY_PRACTICE = 'akhl_admin_practice_items_v2';
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRACTICE);
      let list: any[] = saved ? JSON.parse(saved) : [];
      if (item?.id) {
        list = list.map(p => p.id === item.id ? { ...p, ...data, id: item.id } : p);
      } else {
        const newItem = {
          ...data,
          id: `prc-${skill.slice(0, 3)}-${Date.now().toString().slice(-4)}`,
          version: 1,
          createdBy: user?.uid || 'faculty-admin',
          createdAt: new Date().toISOString()
        };
        list.unshift(newItem);
      }
      localStorage.setItem(STORAGE_KEY_PRACTICE, JSON.stringify(list));
    } catch (e) {
      console.warn('Local storage write warning:', e);
    }

    try {
      if (item?.id) {
        await updateDoc(doc(db, 'practice', item.id), data);
      } else {
        await addDoc(collection(db, 'practice'), {
          ...data,
          createdBy: user?.uid || 'faculty-admin',
          createdAt: new Date().toISOString()
        });
      }
      alert(`Saved successfully! Status: ${finalStatus.toUpperCase()}`);
      onClose();
    } catch (error: any) {
      console.warn('Firestore write notice (saved locally):', error);
      alert(`Practice item saved locally (Status: ${finalStatus.toUpperCase()}).`);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-white max-w-5xl mx-auto pb-12 animate-fadeInUp">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#334155] pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 text-[#94A3B8] hover:text-white hover:bg-[#1E293B] rounded-xl transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-[#38BDF8] bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/30">
                WYSIWYG Practice Editor
              </span>
              <span className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full border ${
                status === 'published' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                status === 'faculty_review' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                status === 'ai_review' ? 'bg-sky-500/10 text-sky-400 border-sky-500/30' :
                'bg-slate-500/10 text-slate-400 border-slate-500/30'
              }`}>
                Status: {status.replace('_', ' ')}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black mt-1">
              {item ? `Edit: ${item.title}` : 'Draft New IELTS Practice Material'}
            </h1>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex bg-[#0F172A] p-1 rounded-xl border border-[#334155]">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'editor' ? 'bg-[#38BDF8] text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Authoring Editor
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'preview' ? 'bg-[#38BDF8] text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Live Candidate Preview
          </button>
        </div>
      </div>

      {/* 5-Stage Approval Lifecycle Stepper Bar */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            5-Stage Approval Lifecycle:
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-[#38BDF8] font-semibold border border-sky-500/30">
            Dr. Asif Master Curriculum Standard
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => handleTransitionStatus('draft')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              status === 'draft' ? 'bg-slate-700 text-white border-slate-500 shadow' : 'bg-[#0F172A] text-slate-400 border-[#334155]'
            }`}
          >
            1. Draft
          </button>
          <span className="text-slate-600">→</span>
          <button
            onClick={() => handleTransitionStatus('ai_review')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              status === 'ai_review' ? 'bg-sky-500 text-slate-950 border-sky-400 shadow' : 'bg-[#0F172A] text-slate-400 border-[#334155]'
            }`}
          >
            2. AI Review
          </button>
          <span className="text-slate-600">→</span>
          <button
            onClick={() => handleTransitionStatus('faculty_review')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              status === 'faculty_review' ? 'bg-purple-500 text-slate-950 border-purple-400 shadow' : 'bg-[#0F172A] text-slate-400 border-[#334155]'
            }`}
          >
            3. Faculty Review
          </button>
          <span className="text-slate-600">→</span>
          <button
            onClick={() => handleTransitionStatus('approved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              status === 'approved' ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow' : 'bg-[#0F172A] text-slate-400 border-[#334155]'
            }`}
          >
            4. Approved
          </button>
          <span className="text-slate-600">→</span>
          <button
            onClick={() => handleTransitionStatus('published')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              status === 'published' ? 'bg-green-500 text-slate-950 border-green-400 shadow' : 'bg-[#0F172A] text-slate-400 border-[#334155]'
            }`}
          >
            5. Published
          </button>
        </div>
      </div>

      {activeTab === 'editor' ? (
        /* WYSIWYG Authoring Form */
        <div className="bg-[#1E293B] border border-[#334155] rounded-3xl p-6 md:p-8 space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase block mb-1">Title</label>
              <input
                type="text"
                className="w-full bg-[#0F172A] border border-[#334155] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-sky-400"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Cambridge Academic Reading Test 3"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase block mb-1">IELTS Skill</label>
              <select
                className="w-full bg-[#0F172A] border border-[#334155] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-sky-400"
                value={skill}
                onChange={e => setSkill(e.target.value as SkillType)}
              >
                <option value="reading">Reading</option>
                <option value="writing">Writing</option>
                <option value="speaking">Speaking</option>
                <option value="listening">Listening</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase block mb-1">Target Band Min</label>
              <select
                className="w-full bg-[#0F172A] border border-[#334155] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-sky-400"
                value={targetBandMin}
                onChange={e => setTargetBandMin(parseFloat(e.target.value))}
              >
                <option value={4.0}>Band 4.0 (Foundation)</option>
                <option value={5.5}>Band 5.5 (Intermediate)</option>
                <option value={6.5}>Band 6.5 (Standard Academic)</option>
                <option value={7.5}>Band 7.5 (Mastery C1)</option>
                <option value={8.5}>Band 8.5+ (Expert C2)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase block mb-1">Part / Section</label>
              <input
                type="text"
                className="w-full bg-[#0F172A] border border-[#334155] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-sky-400"
                value={part}
                onChange={e => setPart(e.target.value)}
                placeholder="e.g. Passage 1, Task 2, Part 2"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase block mb-1">Topic Category</label>
              <input
                type="text"
                className="w-full bg-[#0F172A] border border-[#334155] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-sky-400"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="e.g. Environmental Science, Education"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase block mb-1">Dr. Asif Kibria Curriculum</label>
              <input
                type="text"
                className="w-full bg-[#0F172A] border border-[#334155] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-sky-400"
                value={curriculumClass}
                onChange={e => setCurriculumClass(e.target.value)}
                placeholder="e.g. Class 7 - Task 2 Essay Structure"
              />
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase block mb-1">Candidate Exam Instructions</label>
            <textarea
              className="w-full h-20 bg-[#0F172A] border border-[#334155] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-sky-400"
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
            />
          </div>

          {/* Skill-Specific Content Areas */}
          {skill === 'reading' && (
            <div>
              <label className="text-xs font-bold text-purple-400 uppercase block mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Reading Passage Text (Separate paragraphs with double newline)
              </label>
              <textarea
                className="w-full h-48 bg-[#0F172A] border border-[#334155] rounded-2xl p-4 text-xs text-white font-serif leading-relaxed focus:outline-none focus:border-purple-400"
                value={passageText}
                onChange={e => setPassageText(e.target.value)}
                placeholder="Paste the IELTS reading passage paragraphs here..."
              />
            </div>
          )}

          {skill === 'listening' && (
            <div>
              <label className="text-xs font-bold text-cyan-400 uppercase block mb-1 flex items-center gap-1.5">
                <Headphones className="w-3.5 h-3.5" /> Listening Audio Script (JSON format: [{`"speaker": "...", "text": "..."`}])
              </label>
              <textarea
                className="w-full h-36 bg-[#0F172A] border border-[#334155] rounded-2xl p-4 text-xs text-white font-mono leading-relaxed focus:outline-none focus:border-cyan-400"
                value={audioScript}
                onChange={e => setAudioScript(e.target.value)}
              />
            </div>
          )}

          {skill === 'writing' && (
            <div>
              <label className="text-xs font-bold text-[#FB923C] uppercase block mb-1 flex items-center gap-1.5">
                <PenTool className="w-3.5 h-3.5" /> Task Prompt & Zero-Number Overview Guidance
              </label>
              <textarea
                className="w-full h-28 bg-[#0F172A] border border-[#334155] rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-amber-400"
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                placeholder="Provide the exact Task 1 or Task 2 prompt here..."
              />
            </div>
          )}

          {skill === 'speaking' && (
            <div>
              <label className="text-xs font-bold text-[#F43F5E] uppercase block mb-1 flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5" /> Speaking Examiner Questions (One per line)
              </label>
              <textarea
                className="w-full h-32 bg-[#0F172A] border border-[#334155] rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-rose-400"
                value={questionsText}
                onChange={e => setQuestionsText(e.target.value)}
                placeholder="1. Do you work or are you a student?&#10;2. What do you enjoy most about your studies?"
              />
            </div>
          )}

          {/* Reading & Listening Questions & Answer Keys */}
          {(skill === 'reading' || skill === 'listening') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                  Questions (One per line)
                </label>
                <textarea
                  className="w-full h-36 bg-[#0F172A] border border-[#334155] rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-sky-400"
                  value={questionsText}
                  onChange={e => setQuestionsText(e.target.value)}
                  placeholder="1. The initial plan was approved immediately.&#10;2. Residential costs surged by 20%."
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                  Answer Key (JSON Map)
                </label>
                <textarea
                  className="w-full h-36 bg-[#0F172A] border border-[#334155] rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-sky-400"
                  value={answersText}
                  onChange={e => setAnswersText(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Model Answer & Pedagogical Explanation */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
              Band 9.0 Model Answer / Pedagogical Rationale
            </label>
            <textarea
              className="w-full h-28 bg-[#0F172A] border border-[#334155] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-sky-400"
              value={modelAnswer}
              onChange={e => setModelAnswer(e.target.value)}
              placeholder="Detailed explanation, citations, or sample high-band response..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#334155]">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSave()}
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-slate-950 rounded-xl font-bold text-xs transition shadow flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Draft'}
            </button>
          </div>
        </div>
      ) : (
        /* Live Candidate Preview Tab */
        <div className="bg-[#1E293B] border border-[#334155] rounded-3xl p-6 space-y-6">
          <div className="border-b border-[#334155] pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#38BDF8]">
              Live Candidate Rendering • IELTS {skill.toUpperCase()}
            </span>
            <h2 className="text-2xl font-black text-white mt-1">{title || 'Untitled Practice Item'}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{curriculumClass} • Target Band {targetBandMin.toFixed(1)}+</p>
          </div>

          <div className="bg-[#0F172A] p-4 rounded-2xl border border-[#334155] text-xs text-slate-300">
            <span className="font-bold text-slate-200 block mb-1 uppercase text-[10px]">Candidate Instructions:</span>
            {instructions}
          </div>

          {skill === 'reading' && passageText && (
            <div className="bg-[#0F172A] p-5 rounded-2xl border border-[#334155] text-sm text-slate-200 leading-relaxed max-h-72 overflow-y-auto space-y-3">
              {passageText.split(/\n\s*\n/).map((p: string, idx: number) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          )}

          {skill === 'listening' && (
            <AudioPlayer title={`${title} (Candidate Track)`} />
          )}

          <div className="space-y-3">
            <span className="text-xs font-bold uppercase text-slate-400">Questions:</span>
            {questionsText.split('\n').map((q, idx) => (
              <div key={idx} className="p-3 bg-[#0F172A] rounded-xl border border-[#334155] text-xs text-slate-200">
                {q}
              </div>
            ))}
          </div>

          {modelAnswer && (
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-2xl text-xs text-green-200">
              <span className="font-bold block mb-1 uppercase text-[10px]">Model Band 9.0 Solution:</span>
              {modelAnswer}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
