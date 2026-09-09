import React, { useState } from 'react';
import { BookOpen, CheckCircle2, Clock, HelpCircle, Sparkles, Award } from 'lucide-react';

export const ReadingPracticePage: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const passage = {
    title: 'The Megafauna Extinction Debate in the Late Pleistocene',
    text: `During the Late Pleistocene epoch, approximately 50,000 to 10,000 years before the present, the Earth experienced the catastrophic loss of a vast proportion of its terrestrial megafauna—animals weighing more than 44 kilograms. In North America alone, over thirty genera of large mammals, including mammoths, mastodons, saber-toothed cats, and giant ground sloths, vanished within a remarkably brief geological window.

Two primary competing hypotheses have long dominated the scientific discourse regarding the etiology of this extinction pulse: the 'overkill hypothesis' and the 'climatic change hypothesis.' The overkill hypothesis, initially synthesized by geoscientist Paul Martin, posits that the dispersal of technologically proficient Upper Paleolithic human hunters equipped with fluted projectile points into previously uncolonized continents exerted unsustainable predatory pressure on native species unaccustomed to anthropogenic predation. Proponents argue that the chronological synchrony between human arrival and megafaunal collapse across Australasia and the Americas presents robust circumstantial evidence.

Conversely, advocates of climatic forcing contend that the abrupt temperature fluctuations and ecological restructuring characteristic of the Bølling-Allerød interstadial and the subsequent Younger Dryas cooling event precipitated widespread biome fragmentation. Shifts in vegetation patterns disrupted specialized herbivore diets, precipitating a trophic cascade that inexorably eliminated apex carnivores. Recent geochemical and ancient sedimentary DNA analyses increasingly suggest a synergistic dynamic, wherein climatic instability stressed populations while human exploitation delivered the definitive coup de grâce.`,
    questions: [
      {
        id: 1,
        text: 'Animals classified as megafauna weighed less than 44 kilograms.',
        type: 'TFNG',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        correct: 'FALSE',
        explanation: 'The passage explicitly states megafauna were "animals weighing more than 44 kilograms".',
      },
      {
        id: 2,
        text: 'Paul Martin was the primary proponent behind the overkill hypothesis.',
        type: 'TFNG',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        correct: 'TRUE',
        explanation: 'The text notes the overkill hypothesis was "initially synthesized by geoscientist Paul Martin".',
      },
      {
        id: 3,
        text: 'The overkill hypothesis was universally accepted by all Pleistocene paleontologists in 1980.',
        type: 'TFNG',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        correct: 'NOT GIVEN',
        explanation: 'The text does not mention whether it was universally accepted in 1980.',
      },
      {
        id: 4,
        text: 'Recent ancient DNA evidence suggests extinctions were caused solely by climatic disruption.',
        type: 'TFNG',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        correct: 'FALSE',
        explanation: 'Recent analyses suggest a "synergistic dynamic" involving both climate and humans, not solely climate.',
      },
    ],
  };

  const handleSelectAnswer = (qId: number, val: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const correctCount = passage.questions.filter((q) => answers[q.id] === q.correct).length;
  const estimatedBand = submitted ? (correctCount === 4 ? 9.0 : correctCount === 3 ? 7.5 : correctCount === 2 ? 6.5 : 5.5) : null;

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-5 gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">IELTS Academic Reading Simulator</h1>
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-2.5 py-0.5 rounded-full font-medium">
              Computer-Delivered UI
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Dr. Asif Move On Rule: Never stall on unknown academic jargon. Search directly for factual keywords.
          </p>
        </div>

        {submitted && (
          <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-xs text-slate-300">
              Score: <strong className="text-white text-sm">{correctCount}/{passage.questions.length}</strong> (Band {estimatedBand})
            </span>
          </div>
        )}
      </div>

      {/* Split-Screen Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Pane: Reading Passage */}
        <div className="bg-[#0D182E] border border-slate-800 p-6 rounded-3xl space-y-4 max-h-[700px] overflow-y-auto leading-relaxed text-sm text-slate-200">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Reading Passage 3</span>
            <h2 className="text-lg font-bold text-white mt-1">{passage.title}</h2>
          </div>

          <div className="space-y-4 font-serif text-[15px] leading-relaxed text-slate-300">
            {passage.text.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        {/* Right Pane: Interactive Questions */}
        <div className="bg-[#0B1327] border border-slate-800/90 p-6 rounded-3xl space-y-6 max-h-[700px] overflow-y-auto">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Questions 1–4: True / False / Not Given</span>
          </div>

          <div className="space-y-6">
            {passage.questions.map((q) => {
              const selected = answers[q.id];
              const isCorrect = selected === q.correct;

              return (
                <div key={q.id} className="bg-slate-900/70 border border-slate-800/90 p-4 rounded-2xl space-y-3">
                  <div className="text-xs font-medium text-slate-200 flex items-start space-x-2">
                    <span className="font-bold text-sky-400">{q.id}.</span>
                    <span>{q.text}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {q.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleSelectAnswer(q.id, opt)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                          selected === opt
                            ? submitted
                              ? isCorrect
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                                : 'bg-rose-500/20 border-rose-500 text-rose-300'
                              : 'bg-sky-500/20 border-sky-500 text-sky-300'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {submitted && (
                    <div className={`text-[11px] p-2.5 rounded-xl border ${
                      isCorrect ? 'bg-emerald-950/30 border-emerald-500/20 text-emerald-300' : 'bg-rose-950/30 border-rose-500/20 text-rose-300'
                    }`}>
                      <strong>Correct: {q.correct}</strong> — {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex justify-end">
            {!submitted ? (
              <button
                onClick={() => setSubmitted(true)}
                disabled={Object.keys(answers).length < passage.questions.length}
                className="bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md"
              >
                Submit Answers
              </button>
            ) : (
              <button
                onClick={() => {
                  setAnswers({});
                  setSubmitted(false);
                }}
                className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-5 py-2 rounded-xl text-xs transition-all"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
