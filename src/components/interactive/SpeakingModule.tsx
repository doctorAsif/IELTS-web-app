import React, { useState, useEffect } from 'react';
import { SpeakingEngine, SpeakingEvaluation } from '../../lib/engines/SpeakingEngine';
import speakingData from '../../assets/database/speaking_modules.json';

interface SpeakingModuleProps {
  practiceId?: string;
}

export const SpeakingModule: React.FC<SpeakingModuleProps> = ({ practiceId = 'AKHL-SP-001' }) => {
  const [module, setModule] = useState<any>(null);
  const [transcript, setTranscript] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<SpeakingEvaluation | null>(null);

  useEffect(() => {
    const data = speakingData.modules.find(m => m.practiceId === practiceId);
    if (data) {
      setModule(data);
    }
  }, [practiceId]);

  if (!module) return <div>Loading speaking module...</div>;

  const handleEvaluate = async () => {
    if (transcript.trim().length < 10) {
      alert("Please provide a longer transcript to evaluate.");
      return;
    }
    
    setIsEvaluating(true);
    setEvaluation(null);
    try {
      const taskPrompt = module.questions.join('\\n');
      const result = await SpeakingEngine.evaluateSpeaking(transcript, taskPrompt, { pauses: 2, wpm: 120 });
      setEvaluation(result);
    } catch (e) {
      console.error(e);
      alert("Failed to evaluate speaking.");
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto my-8 text-gray-800">
      <h2 className="text-2xl font-bold mb-4">{module.topic} ({module.part})</h2>
      
      <div className="bg-purple-50 p-4 rounded mb-6 border border-purple-100">
        <p className="font-semibold text-purple-900 mb-2">Instructions:</p>
        <p className="text-purple-800 mb-4">{module.instructions}</p>
        <div className="bg-white p-3 rounded">
          <p className="font-bold text-lg mb-2">Questions to answer:</p>
          <ul className="list-disc pl-5">
            {module.questions.map((q: string, idx: number) => (
              <li key={idx} className="mb-1">{q}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Response Transcript (Simulated Speech-to-Text)
        </label>
        <textarea
          className="w-full h-40 p-4 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          placeholder="Type what you would say in response to the questions..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
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
          {isEvaluating ? 'AI Examiner is evaluating...' : 'Evaluate Transcript'}
        </button>
      </div>

      {evaluation && (
        <div className="mt-8 bg-gray-50 border rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Speaking Examiner Report</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <div className="bg-white p-4 rounded shadow-sm text-center border-t-4 border-purple-500 col-span-2 md:col-span-2">
              <div className="text-sm text-gray-500">Est. Band</div>
              <div className="text-3xl font-bold text-purple-700">{evaluation.estimatedBand.toFixed(1)}</div>
            </div>
            <div className="bg-white p-4 rounded shadow-sm text-center">
              <div className="text-sm text-gray-500">Fluency</div>
              <div className="text-xl font-bold">{evaluation.fluency.toFixed(1)}</div>
            </div>
            <div className="bg-white p-4 rounded shadow-sm text-center">
              <div className="text-sm text-gray-500">Coherence</div>
              <div className="text-xl font-bold">{evaluation.coherence.toFixed(1)}</div>
            </div>
            <div className="bg-white p-4 rounded shadow-sm text-center">
              <div className="text-sm text-gray-500">Vocabulary</div>
              <div className="text-xl font-bold">{evaluation.vocabulary.toFixed(1)}</div>
            </div>
            <div className="bg-white p-4 rounded shadow-sm text-center">
              <div className="text-sm text-gray-500">Grammar</div>
              <div className="text-xl font-bold">{evaluation.grammar.toFixed(1)}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-4 rounded shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-2">Examiner Feedback</h4>
              <p className="text-gray-700">{evaluation.feedback}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
