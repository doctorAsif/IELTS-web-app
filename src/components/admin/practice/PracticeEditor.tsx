import React, { useState } from 'react';
import { ArrowLeft, Save, Send } from 'lucide-react';
import { getFirestore, collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { PracticeItem, PracticeStatus, SkillType } from '../../../lib/types';
import { useAuth } from '../../../lib/AuthContext';

interface PracticeEditorProps {
  item: PracticeItem | null;
  onClose: () => void;
}

export const PracticeEditor: React.FC<PracticeEditorProps> = ({ item, onClose }) => {
  const { role, user } = useAuth();
  
  // Basic form state. For a full implementation, this would use react-hook-form or similar.
  const [title, setTitle] = useState(item?.title || '');
  const [skill, setSkill] = useState<SkillType>(item?.skill || 'reading');
  const [status, setStatus] = useState<PracticeStatus>(item?.status || 'draft');
  const [targetBandMin, setTargetBandMin] = useState(item?.targetBandMin || 6.0);
  
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (submitForReview: boolean = false) => {
    if (!title) {
      alert('Title is required');
      return;
    }
    
    setIsSaving(true);
    const db = getFirestore();
    const newStatus = submitForReview ? 'human_review' : status;

    const data = {
      title,
      skill,
      status: newStatus,
      targetBandMin,
      targetBandMax: targetBandMin + 1.0,
      part: item?.part || 'Part 1',
      questionType: item?.questionType || 'multiple-choice',
      topic: item?.topic || 'General',
      difficulty: item?.difficulty || 'medium',
      curriculumClass: item?.curriculumClass || 'General',
      objective: item?.objective || 'Practice',
      instructions: item?.instructions || 'Follow instructions',
      questions: item?.questions || [], // In a real editor, this would be a complex sub-form
      answerKey: item?.answerKey || {},
      explanations: item?.explanations || 'Explanation',
      sourceType: item?.sourceType || 'original',
      version: item?.version || 1,
      updatedBy: user?.uid,
      updatedAt: new Date().toISOString(),
    };

    try {
      if (item?.id) {
        // Update existing
        // IMPORTANT: The security rules prevent updating IF the status is currently 'published'.
        // To edit a published item, they should theoretically duplicate it. 
        await updateDoc(doc(db, 'practice', item.id), data);
      } else {
        // Create new
        await addDoc(collection(db, 'practice'), {
          ...data,
          createdBy: user?.uid,
          createdAt: new Date().toISOString()
        });
      }
      alert('Saved successfully');
      onClose();
    } catch (error: any) {
      alert(`Error saving: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={onClose}
          className="p-2 text-[#94A3B8] hover:text-white hover:bg-[#1E293B] rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {item ? 'Edit Practice' : 'Create Practice'}
          </h1>
          <p className="text-[#94A3B8]">
            {item ? `Editing ID: ${item.id}` : 'Drafting a new practice item'}
          </p>
        </div>
      </div>

      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 space-y-6">
        
        {/* Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#94A3B8] mb-2">Title</label>
            <input 
              type="text" 
              className="w-full bg-[#0F172A] border border-[#334155] rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[#38BDF8]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cambridge 15 Test 1 Reading 1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94A3B8] mb-2">Skill</label>
            <select 
              className="w-full bg-[#0F172A] border border-[#334155] rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[#38BDF8]"
              value={skill}
              onChange={(e) => setSkill(e.target.value as SkillType)}
            >
              <option value="listening">Listening</option>
              <option value="reading">Reading</option>
              <option value="writing">Writing</option>
              <option value="speaking">Speaking</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94A3B8] mb-2">Target Band (Min)</label>
            <input 
              type="number" 
              step="0.5"
              min="0"
              max="9"
              className="w-full bg-[#0F172A] border border-[#334155] rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[#38BDF8]"
              value={targetBandMin}
              onChange={(e) => setTargetBandMin(parseFloat(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94A3B8] mb-2">Status</label>
            <input 
              type="text" 
              disabled
              className="w-full bg-[#0F172A]/50 border border-[#334155]/50 rounded-lg py-2 px-4 text-[#94A3B8] cursor-not-allowed"
              value={status.toUpperCase()}
            />
            <p className="text-xs text-[#94A3B8] mt-1">Status is managed via approval workflow.</p>
          </div>
        </div>

        {/* Placeholder for complex question editor */}
        <div className="border border-dashed border-[#334155] rounded-lg p-8 text-center">
          <p className="text-[#94A3B8]">Complex Question Builder UI would go here...</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 border-t border-[#334155] pt-6">
          <button 
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="px-4 py-2 bg-[#0F172A] border border-[#334155] hover:border-[#94A3B8] text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          
          {(status === 'draft' || status === 'ai_review') && (
            <button 
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="px-4 py-2 bg-[#38BDF8] hover:bg-[#0284C7] text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              Submit for Review
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
