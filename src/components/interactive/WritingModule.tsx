import React, { useState, useEffect } from 'react';
import { WritingEngine, WritingEvaluation } from '../../lib/engines/WritingEngine';
import writingData from '../../assets/database/writing_modules.json';

interface WritingModuleProps {
  practiceId?: string;
}

export const WritingModule: React.FC<WritingModuleProps> = ({ practiceId = 'AKHL-WR-005' }) => {
  const [module, setModule] = useState<any>(null);
  const [essay, setEssay] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<WritingEvaluation | null>(null);

  useEffect(() => {
    const data = writingData.modules.find(m => m.practiceId === practiceId);
    if (data) {
      setModule(data);
    }
  }, [practiceId]);

  if (!module) return <div>Loading writing module...</div>;

  const handleEvaluate = async () => {
    if (essay.trim().length < 50) {
      alert("Please write a longer essay to evaluate.");
      return;
    }
    
    setIsEvaluating(true);
    setEvaluation(null);
    try {
      const result = await WritingEngine.evaluateEssay(essay, module.questions);
      setEvaluation(result);
    } catch (e) {
      console.error(e);
      alert("Failed to evaluate essay.");
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto my-8 text-gray-800">
      <h2 className="text-2xl font-bold mb-4">{module.topic} ({module.part})</h2>
      
      <div className="bg-blue-50 p-4 rounded mb-6 border border-blue-100">
        <p className="font-semibold text-blue-900 mb-2">Instructions:</p>
        <p className="text-blue-800 mb-4">{module.instructions}</p>
        <p className="font-bold text-lg">{module.questions}</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Essay (Word count: {essay.trim() ? essay.trim().split(/\s+/).length : 0})
        </label>
        <textarea
          className="w-full h-64 p-4 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Start typing your essay here..."
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
        />
      </div>

      <div className="flex justify-between items-center border-t pt-4">
        <button 
          onClick={handleEvaluate}
          disabled={isEvaluating}
          className={`px-6 py-2 rounded font-semibold text-white transition ${
            isEvaluating ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isEvaluating ? 'AI Examiner is grading...' : 'Submit for AI Evaluation'}
        </button>
      </div>

      {evaluation && (
        <div className="mt-8 bg-gray-50 border rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">AI Examiner Report</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white p-4 rounded shadow-sm text-center border-t-4 border-blue-500">
              <div className="text-sm text-gray-500">Est. Band</div>
              <div className="text-2xl font-bold text-blue-700">{evaluation.estimatedBand.toFixed(1)}</div>
            </div>
            <div className="bg-white p-4 rounded shadow-sm text-center">
              <div className="text-sm text-gray-500">Task Response</div>
              <div className="text-xl font-bold">{evaluation.taskResponse.toFixed(1)}</div>
            </div>
            <div className="bg-white p-4 rounded shadow-sm text-center">
              <div className="text-sm text-gray-500">Coherence</div>
              <div className="text-xl font-bold">{evaluation.coherenceCohesion.toFixed(1)}</div>
            </div>
            <div className="bg-white p-4 rounded shadow-sm text-center">
              <div className="text-sm text-gray-500">Lexical</div>
              <div className="text-xl font-bold">{evaluation.lexicalResource.toFixed(1)}</div>
            </div>
            <div className="bg-white p-4 rounded shadow-sm text-center">
              <div className="text-sm text-gray-500">Grammar</div>
              <div className="text-xl font-bold">{evaluation.grammar.toFixed(1)}</div>
            </div>
          </div>

          <div className="space-y-4">
            {evaluation.strengths && evaluation.strengths.length > 0 && (
              <div>
                <h4 className="font-semibold text-green-700 mb-2">Strengths</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {evaluation.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}
            
            {evaluation.weaknesses && evaluation.weaknesses.length > 0 && (
              <div>
                <h4 className="font-semibold text-red-700 mb-2">Areas for Improvement</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {evaluation.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            )}

            {evaluation.corrections && evaluation.corrections.length > 0 && (
              <div>
                <h4 className="font-semibold text-orange-700 mb-2">Specific Corrections</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {evaluation.corrections.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
