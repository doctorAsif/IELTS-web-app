import React, { useState, useEffect } from 'react';
import { ReadingListeningEngine } from '../../lib/engines/ReadingListeningEngine';
import listeningData from '../../assets/database/listening_modules.json';

interface ListeningModuleProps {
  practiceId?: string;
}

export const ListeningModule: React.FC<ListeningModuleProps> = ({ practiceId = 'AKHL-LS-001' }) => {
  const [module, setModule] = useState<any>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [explanations, setExplanations] = useState<Record<string, string>>({});
  const [loadingExpl, setLoadingExpl] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const data = listeningData.modules.find(m => m.practiceId === practiceId);
    if (data) {
      setModule(data);
    }
  }, [practiceId]);

  if (!module) return <div>Loading listening module...</div>;

  const handleScore = () => {
    const newResults: Record<string, boolean> = {};
    for (const [qNum, correctAnswers] of Object.entries(module.answerKey)) {
      const studentAns = userAnswers[qNum] || '';
      // Assume the answer key is an array of acceptable answers
      const isCorrect = (correctAnswers as string[]).some(ca => ReadingListeningEngine.scoreAnswer(studentAns, ca));
      newResults[qNum] = isCorrect;
    }
    setResults(newResults);
  };

  const handleExplain = async (qNum: string) => {
    setLoadingExpl(prev => ({ ...prev, [qNum]: true }));
    const studentAns = userAnswers[qNum] || '';
    const correctAns = module.answerKey[qNum][0]; // pass the primary correct answer
    
    // Find the specific question string for context
    const questionText = module.questions.find((q: string) => q.includes(`${qNum}.`)) || `Question ${qNum}`;
    
    const passage = module.script.map((s: any) => `${s.speaker}: ${s.text}`).join('\n');

    try {
      const explanation = await ReadingListeningEngine.explainAnswer(
        passage,
        questionText,
        studentAns,
        correctAns
      );
      setExplanations(prev => ({ ...prev, [qNum]: explanation }));
    } catch (e) {
      console.error("Failed to explain", e);
      setExplanations(prev => ({ ...prev, [qNum]: "Failed to get explanation. Is the model ready?" }));
    } finally {
      setLoadingExpl(prev => ({ ...prev, [qNum]: false }));
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-4">{module.topic} ({module.part})</h2>
      <div className="bg-yellow-50 p-4 rounded mb-6 text-gray-800 border border-yellow-200">
        <p className="font-semibold mb-2">Instructions:</p>
        <p>{module.instructions}</p>
      </div>
      
      <div className="mb-6 space-y-4 text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-md shadow-inner">
        <h3 className="font-bold text-gray-800 border-b pb-2 mb-2">Audio Transcript (Simulated)</h3>
        {module.script.map((s: any, idx: number) => (
          <p key={idx}>
            <span className="font-semibold text-gray-900">{s.speaker}:</span> {s.text}
          </p>
        ))}
      </div>

      <div className="border-t pt-6">
        <h3 className="text-xl font-semibold mb-4">Questions</h3>
        {module.questions.map((q: string, idx: number) => {
          // Attempt to parse the question number if it starts with or contains one, e.g., "1. Section A..." or "Date - 1. ____"
          const match = q.match(/(\d+)\./);
          const qNum = match ? match[1] : null;

          return (
            <div key={idx} className="mb-4">
              <p className="mb-2 font-medium">{q}</p>
              {qNum && (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      className="border p-2 rounded w-64 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      value={userAnswers[qNum] || ''}
                      onChange={e => setUserAnswers({ ...userAnswers, [qNum]: e.target.value })}
                      placeholder="Your answer"
                    />
                    {results[qNum] !== undefined && (
                      <span className={`font-bold ${results[qNum] ? 'text-green-600' : 'text-red-600'}`}>
                        {results[qNum] ? '✓ Correct' : '✗ Incorrect'}
                      </span>
                    )}
                    {results[qNum] !== undefined && (
                      <button 
                        onClick={() => handleExplain(qNum)}
                        className="ml-2 text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded hover:bg-yellow-200 font-medium"
                        disabled={loadingExpl[qNum]}
                      >
                        {loadingExpl[qNum] ? 'Thinking...' : 'AI Explain'}
                      </button>
                    )}
                  </div>
                  {explanations[qNum] && (
                    <div className="bg-blue-50 p-3 rounded text-sm text-blue-900 border border-blue-200 mt-2 whitespace-pre-wrap">
                      <span className="font-semibold">AI Teacher:</span> {explanations[qNum]}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-8 border-t pt-4">
        <button 
          onClick={handleScore}
          className="bg-yellow-600 text-white px-6 py-2 rounded font-semibold hover:bg-yellow-700 transition shadow-sm"
        >
          Check Answers
        </button>
      </div>
    </div>
  );
};
