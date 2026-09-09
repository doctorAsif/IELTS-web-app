import React, { useState } from 'react';
import { Headphones, Play, Pause, RotateCcw, Award, CheckCircle2, AlertCircle } from 'lucide-react';
import { WebSpeechService } from '../../../services/webSpeechService';

export const ListeningPracticePage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const audioScript = `
Good morning everyone, and welcome to the Orientation Session for the International Student World Program.
My name is Dr. Harrison and I am the Academic Director.
Today I will outline three key areas of campus life: first, registration and student identity cards; second, library borrowing entitlements; and third, local transport discounts.
Please note that all registration forms must be submitted to Room 204 in the North Wing no later than Friday, October 14th at 4:00 PM.
`;

  const questions = [
    { id: 1, prompt: 'What room should registration forms be submitted to?', answer: '204' },
    { id: 2, prompt: 'Which campus wing is Room 204 located in?', answer: 'North Wing' },
    { id: 3, prompt: 'What is the final day for submission of registration forms?', answer: 'Friday' },
  ];

  const handlePlayAudio = () => {
    if (isPlaying) {
      WebSpeechService.stopSpeaking();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      WebSpeechService.speakText(audioScript, () => setIsPlaying(false));
    }
  };

  const handleInputChange = (id: number, val: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [id]: val }));
  };

  const correctCount = questions.filter(
    (q) => (answers[q.id] || '').trim().toLowerCase() === q.answer.toLowerCase()
  ).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-5 gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">IELTS Listening Practice Simulator</h1>
            <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs px-2.5 py-0.5 rounded-full font-medium">
              Section 1 & 4 Drills
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Listen once only, exactly as in the official IELTS test. Complete the notes using NO MORE THAN TWO WORDS AND/OR A NUMBER.
          </p>
        </div>

        {submitted && (
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl flex items-center space-x-2">
            <Award className="w-5 h-5 text-purple-400" />
            <span className="text-xs text-slate-300">
              Score: <strong className="text-white text-sm">{correctCount}/{questions.length}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Audio Controller Bar */}
      <div className="bg-[#0D182E] border border-slate-800 p-6 rounded-3xl flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePlayAudio}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isPlaying ? 'bg-amber-500 text-slate-950 font-bold animate-pulse' : 'bg-purple-500 hover:bg-purple-400 text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </button>

          <div>
            <h3 className="font-bold text-white text-sm">
              {isPlaying ? 'Playing Official Audio Track (British English)...' : 'Section 1: University Orientation Audio'}
            </h3>
            <p className="text-xs text-slate-400">Recorded at standard IELTS Cambridge speech rate (140 wpm)</p>
          </div>
        </div>

        <span className="text-xs font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300">
          Audio Track 1/4
        </span>
      </div>

      {/* Interactive Note Completion Questions */}
      <div className="bg-[#0B1327] border border-slate-800/90 p-6 rounded-3xl space-y-6">
        <h2 className="text-sm font-bold text-sky-400 uppercase tracking-wider">
          Questions 1–3: Complete the Notes Below
        </h2>

        <div className="space-y-4">
          {questions.map((q) => {
            const userAns = answers[q.id] || '';
            const isCorrect = userAns.trim().toLowerCase() === q.answer.toLowerCase();

            return (
              <div key={q.id} className="bg-slate-900/70 border border-slate-800 p-4 rounded-2xl space-y-2">
                <label className="text-xs text-slate-200 block font-medium">
                  {q.id}. {q.prompt}
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    disabled={submitted}
                    value={userAns}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    placeholder="Type your answer here..."
                    className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 flex-1"
                  />
                  {submitted && (
                    <span className="shrink-0">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-rose-400" />
                      )}
                    </span>
                  )}
                </div>

                {submitted && !isCorrect && (
                  <div className="text-[11px] text-amber-300">
                    Correct Answer: <strong>{q.answer}</strong>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-end">
          {!submitted ? (
            <button
              onClick={() => setSubmitted(true)}
              className="bg-purple-500 hover:bg-purple-400 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md"
            >
              Check Answers
            </button>
          ) : (
            <button
              onClick={() => {
                setAnswers({});
                setSubmitted(false);
              }}
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-5 py-2 rounded-xl text-xs transition-all"
            >
              Reset Drill
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
