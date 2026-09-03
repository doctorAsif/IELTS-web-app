import React, { useState } from 'react';
import { 
  DollarSign, Cpu, Clock, Activity, Zap, TrendingDown, Users, 
  ShieldAlert, BarChart3, RefreshCw, ArrowUpRight, ArrowDownRight,
  PieChart, Filter, Server, CheckCircle, Database
} from 'lucide-react';

interface StudentSessionAudit {
  id: string;
  studentName: string;
  studentId: string;
  timestamp: string;
  activity: string;
  skill: 'speaking' | 'writing' | 'reading' | 'listening';
  provider: 'On-Device WebGPU' | 'Google Gemini Flash' | 'Anthropic Claude' | 'OpenAI GPT-4o';
  model: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  estimatedCostUSD: number;
  costSavedUSD: number;
}

const INITIAL_STUDENT_SESSIONS: StudentSessionAudit[] = [
  {
    id: 'ses-1092',
    studentName: 'Nusrat Jahan',
    studentId: 'SWB-8819',
    timestamp: '2 mins ago',
    activity: 'Part 2 Cue Card Speech Evaluation',
    skill: 'speaking',
    provider: 'On-Device WebGPU',
    model: 'Llama-3.2-3B-Instruct-q4f16_1-MLC',
    inputTokens: 1420,
    outputTokens: 480,
    latencyMs: 18,
    estimatedCostUSD: 0.00,
    costSavedUSD: 0.0095
  },
  {
    id: 'ses-1091',
    studentName: 'Farhan Kibria',
    studentId: 'SWB-4421',
    timestamp: '8 mins ago',
    activity: 'Task 1 Renewable Energy (Zero-Number Check)',
    skill: 'writing',
    provider: 'On-Device WebGPU',
    model: 'Llama-3.2-3B-Instruct-q4f16_1-MLC',
    inputTokens: 1850,
    outputTokens: 620,
    latencyMs: 22,
    estimatedCostUSD: 0.00,
    costSavedUSD: 0.0124
  },
  {
    id: 'ses-1090',
    studentName: 'Tasnim Ahmed',
    studentId: 'SWB-7712',
    timestamp: '14 mins ago',
    activity: 'Task 2 AI Disruption Diagnostic Essay',
    skill: 'writing',
    provider: 'Anthropic Claude',
    model: 'claude-3-5-sonnet-20241022',
    inputTokens: 2940,
    outputTokens: 890,
    latencyMs: 840,
    estimatedCostUSD: 0.0221,
    costSavedUSD: 0.00
  },
  {
    id: 'ses-1089',
    studentName: 'Arafat Rahman',
    studentId: 'SWB-3310',
    timestamp: '25 mins ago',
    activity: 'Section 4 Paleoclimatology Lecture Notes',
    skill: 'listening',
    provider: 'On-Device WebGPU',
    model: 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC',
    inputTokens: 980,
    outputTokens: 210,
    latencyMs: 14,
    estimatedCostUSD: 0.00,
    costSavedUSD: 0.0060
  },
  {
    id: 'ses-1088',
    studentName: 'Sultana Begum',
    studentId: 'SWB-5590',
    timestamp: '42 mins ago',
    activity: 'Reading TFNG Textual Citation Verification',
    skill: 'reading',
    provider: 'Google Gemini Flash',
    model: 'gemini-2.5-flash',
    inputTokens: 2450,
    outputTokens: 410,
    latencyMs: 310,
    estimatedCostUSD: 0.0014,
    costSavedUSD: 0.00
  },
  {
    id: 'ses-1087',
    studentName: 'Kazi Mahbub',
    studentId: 'SWB-9021',
    timestamp: '1 hour ago',
    activity: 'Part 3 Inversion & ARE Speaking Drills',
    skill: 'speaking',
    provider: 'On-Device WebGPU',
    model: 'Llama-3.2-3B-Instruct-q4f16_1-MLC',
    inputTokens: 1650,
    outputTokens: 520,
    latencyMs: 19,
    estimatedCostUSD: 0.00,
    costSavedUSD: 0.0108
  }
];

export const AdminAuditDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d'>('30d');
  const [skillFilter, setSkillFilter] = useState<'all' | 'speaking' | 'writing' | 'reading' | 'listening'>('all');
  const [sessions, setSessions] = useState<StudentSessionAudit[]>(INITIAL_STUDENT_SESSIONS);
  const [isSimulating, setIsSimulating] = useState(false);

  // Daily inference counts (Past 7 Days): WebLLM (Edge) vs Cloud Gateway
  const timelineData = [
    { day: 'Mon', edge: 2450, cloud: 680 },
    { day: 'Tue', edge: 2890, cloud: 720 },
    { day: 'Wed', edge: 3120, cloud: 810 },
    { day: 'Thu', edge: 3450, cloud: 940 },
    { day: 'Fri', edge: 3820, cloud: 1050 },
    { day: 'Sat', edge: 4150, cloud: 1180 },
    { day: 'Sun', edge: 4480, cloud: 1240 },
  ];

  const maxInferences = Math.max(...timelineData.map(d => d.edge + d.cloud));

  const filteredSessions = sessions.filter(s => {
    return skillFilter === 'all' || s.skill === skillFilter;
  });

  const totalTokensRun = 42850210;
  const localTokensSaved = 31240000;
  const cloudTokensBilled = 11610210;
  const totalCostUSD = 24.38;
  const costSavingsUSD = 94.62;

  const handleSimulateNewSession = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const candidates = [
        { name: 'Dr. Asif Student A', id: 'SWB-1102' },
        { name: 'Dr. Asif Student B', id: 'SWB-6623' },
        { name: 'Farzana Haque', id: 'SWB-9931' }
      ];
      const randomCand = candidates[Math.floor(Math.random() * candidates.length)];
      const skills: ('speaking' | 'writing' | 'reading' | 'listening')[] = ['speaking', 'writing', 'reading', 'listening'];
      const chosenSkill = skills[Math.floor(Math.random() * skills.length)];
      const isEdge = Math.random() > 0.25;

      const newSession: StudentSessionAudit = {
        id: `ses-${Date.now().toString().slice(-4)}`,
        studentName: randomCand.name,
        studentId: randomCand.id,
        timestamp: 'Just now',
        activity: chosenSkill === 'speaking' ? 'ARE Speaking Drill Live Evaluation' :
                  chosenSkill === 'writing' ? 'Task 2 Discursive Cohesion Analysis' :
                  chosenSkill === 'reading' ? 'TFNG Citation Locator' : 'Listening Phonetic Transcription',
        skill: chosenSkill,
        provider: isEdge ? 'On-Device WebGPU' : 'Google Gemini Flash',
        model: isEdge ? 'Llama-3.2-3B-Instruct-q4f16_1-MLC' : 'gemini-2.5-flash',
        inputTokens: Math.floor(Math.random() * 1000) + 1200,
        outputTokens: Math.floor(Math.random() * 400) + 300,
        latencyMs: isEdge ? Math.floor(Math.random() * 10) + 15 : Math.floor(Math.random() * 150) + 280,
        estimatedCostUSD: isEdge ? 0.00 : 0.0018,
        costSavedUSD: isEdge ? 0.0089 : 0.00
      };

      setSessions(prev => [newSession, ...prev]);
      setIsSimulating(false);
    }, 400);
  };

  return (
    <div className="space-y-6 text-white animate-fadeInUp">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#334155] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase text-[#38BDF8] bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/30 flex items-center gap-1">
              <BarChart3 className="w-3 h-3" /> Token & Infrastructure Telemetry
            </span>
            <span className="text-xs text-slate-400">Dr. Asif Kibria Executive Dashboard</span>
          </div>
          <h1 className="text-2xl font-black">AI Token & Cost Audit Dashboard</h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Comparative analysis of WebLLM Edge on-device inferences ($0.00) vs. Cloud Gateway fallbacks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Simulate Live Influx */}
          <button
            onClick={handleSimulateNewSession}
            disabled={isSimulating}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin text-[#38BDF8]' : ''}`} />
            Simulate Session
          </button>

          {/* Date Filter */}
          <div className="flex bg-[#0F172A] p-1 rounded-xl border border-[#334155]">
            {(['today', '7d', '30d'] as const).map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                  dateRange === range ? 'bg-[#38BDF8] text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {range === 'today' ? 'Today' : range === '7d' ? '7 Days' : '30 Days'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Metrics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cost USD */}
        <div className="bg-[#1E293B] border border-[#334155] p-5 rounded-3xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Cloud AI Billed Cost</span>
            <div className="p-2 rounded-xl bg-green-500/10 text-green-400 border border-green-500/30">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">${totalCostUSD.toFixed(2)}</div>
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" />
            Saved ${costSavingsUSD.toFixed(2)} via WebGPU Edge AI
          </div>
        </div>

        {/* Edge Offload Ratio */}
        <div className="bg-[#1E293B] border border-[#334155] p-5 rounded-3xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">On-Device Edge Ratio</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-[#38BDF8] border border-sky-500/30">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">72.9%</div>
          <div className="text-[11px] text-sky-400 font-semibold">
            {(localTokensSaved / 1000000).toFixed(1)}M tokens run locally ($0 server cost)
          </div>
        </div>

        {/* Latency WebGPU vs Cloud */}
        <div className="bg-[#1E293B] border border-[#334155] p-5 rounded-3xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Avg Response Latency</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">18.4 ms (Edge)</div>
          <div className="text-[11px] text-purple-300 font-semibold">
            Cloud Fallback: ~310ms (Gemini) • ~840ms (Claude)
          </div>
        </div>

        {/* Enrolled Students */}
        <div className="bg-[#1E293B] border border-[#334155] p-5 rounded-3xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Active Student Cohort</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">148 Students</div>
          <div className="text-[11px] text-amber-300 font-semibold">
            All bound to max 2 hardware device slots
          </div>
        </div>
      </div>

      {/* Visual Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Chart 1: Daily Timeline (WebLLM On-Device vs Cloud Fallback) */}
        <div className="lg:col-span-2 bg-[#1E293B] border border-[#334155] rounded-3xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#38BDF8]" />
                Inference Volume: WebLLM Edge vs. Cloud Gateway Fallback
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Past 7 days tracking local WebGPU executions vs. remote multi-cloud API fallbacks
              </p>
            </div>
            
            {/* Chart Legend */}
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-sky-400">
                <span className="w-3 h-3 rounded-sm bg-[#38BDF8]" /> WebLLM Edge ($0.00)
              </span>
              <span className="flex items-center gap-1.5 text-purple-400">
                <span className="w-3 h-3 rounded-sm bg-[#A855F7]" /> Cloud Fallback
              </span>
            </div>
          </div>

          {/* SVG Comparative Bar / Area Chart */}
          <div className="h-56 w-full flex items-end justify-between gap-3 pt-6 px-2 border-b border-[#334155]">
            {timelineData.map((item) => {
              const edgeHeight = Math.round((item.edge / maxInferences) * 160);
              const cloudHeight = Math.round((item.cloud / maxInferences) * 160);
              const totalReqs = item.edge + item.cloud;
              const edgePct = Math.round((item.edge / totalReqs) * 100);

              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-900 border border-slate-700 px-2 py-1 rounded-lg text-[10px] text-slate-200 pointer-events-none whitespace-nowrap z-10 shadow-lg">
                    {item.day}: {item.edge.toLocaleString()} Edge ({edgePct}%) | {item.cloud.toLocaleString()} Cloud
                  </div>

                  {/* Stacked Bars */}
                  <div className="w-full max-w-[40px] flex flex-col items-center justify-end rounded-t-lg overflow-hidden gap-1">
                    {/* Cloud Bar */}
                    <div 
                      style={{ height: `${cloudHeight}px` }} 
                      className="w-full bg-[#A855F7] hover:bg-[#C084FC] transition-all rounded-t"
                      title={`Cloud: ${item.cloud}`}
                    />
                    {/* Edge Bar */}
                    <div 
                      style={{ height: `${edgeHeight}px` }} 
                      className="w-full bg-[#38BDF8] hover:bg-[#7DD3FC] transition-all rounded-t shadow-sm shadow-sky-500/20"
                      title={`Edge: ${item.edge}`}
                    />
                  </div>

                  {/* Day Label */}
                  <span className="text-xs font-bold text-slate-400 group-hover:text-white transition">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-2">
            <span>Client Hardware: Apple Silicon (M-series), NVIDIA RTX, Intel Iris Xe</span>
            <span className="text-emerald-400 font-semibold">Zero Server GPU Infrastructure Overhead</span>
          </div>
        </div>

        {/* Visual Chart 2: Token Volume & Latency Comparison */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-3xl p-6 space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              Latency & Token Breakdown
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Average execution latency (ms) by provider
            </p>
          </div>

          {/* Latency comparison progress bars */}
          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-emerald-400 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> WebLLM WebGPU (Llama 3.2 3B)
                </span>
                <span className="font-mono text-white">16 ms</span>
              </div>
              <div className="w-full bg-[#0F172A] rounded-full h-2.5 overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: '4%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-sky-400">Google Gemini 2.5 Flash</span>
                <span className="font-mono text-white">310 ms</span>
              </div>
              <div className="w-full bg-[#0F172A] rounded-full h-2.5 overflow-hidden">
                <div className="bg-sky-400 h-full rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-purple-400">Anthropic Claude 3.5 Sonnet</span>
                <span className="font-mono text-white">840 ms</span>
              </div>
              <div className="w-full bg-[#0F172A] rounded-full h-2.5 overflow-hidden">
                <div className="bg-purple-400 h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-amber-400">OpenAI GPT-4o</span>
                <span className="font-mono text-white">920 ms</span>
              </div>
              <div className="w-full bg-[#0F172A] rounded-full h-2.5 overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
          </div>

          {/* Token Totals Summary Box */}
          <div className="bg-[#0F172A] p-4 rounded-2xl border border-[#334155] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Input (Prompt) Tokens:</span>
              <span className="font-bold text-white">28,410,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Output (Completion) Tokens:</span>
              <span className="font-bold text-white">14,440,210</span>
            </div>
            <div className="pt-2 border-t border-[#334155] flex justify-between font-bold">
              <span className="text-emerald-400">WebGPU Edge Ratio:</span>
              <span className="text-emerald-400">72.9% Client-Side</span>
            </div>
          </div>
        </div>
      </div>

      {/* Per-Student Session Cost Estimator & Telemetry Table */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-[#38BDF8]" />
              Per-Student Session Cost Estimator & Telemetry
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live audit stream tracking individual candidate sessions, token consumption, and edge vs. cloud costs.
            </p>
          </div>

          {/* Filter by skill */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={skillFilter}
              onChange={e => setSkillFilter(e.target.value as any)}
              className="bg-[#0F172A] border border-[#334155] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-400"
            >
              <option value="all">All Skills</option>
              <option value="speaking">Speaking</option>
              <option value="writing">Writing</option>
              <option value="reading">Reading</option>
              <option value="listening">Listening</option>
            </select>
          </div>
        </div>

        {/* Telemetry Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0F172A] text-slate-400 uppercase text-[10px] font-bold border-b border-[#334155]">
              <tr>
                <th className="p-3.5 rounded-l-xl">Student & ID</th>
                <th className="p-3.5">IELTS Activity</th>
                <th className="p-3.5">Execution Engine</th>
                <th className="p-3.5">Tokens (In / Out)</th>
                <th className="p-3.5">Latency</th>
                <th className="p-3.5">Session Cost</th>
                <th className="p-3.5 rounded-r-xl text-right">Edge Savings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]/60 text-slate-200">
              {filteredSessions.map((ses) => (
                <tr key={ses.id} className="hover:bg-white/5 transition">
                  <td className="p-3.5">
                    <p className="font-bold text-white">{ses.studentName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{ses.studentId} • {ses.timestamp}</p>
                  </td>
                  <td className="p-3.5">
                    <span className="font-medium text-slate-200 block">{ses.activity}</span>
                    <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase mt-0.5 ${
                      ses.skill === 'speaking' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                      ses.skill === 'writing' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30' :
                      ses.skill === 'reading' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                    }`}>
                      {ses.skill}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5">
                      {ses.provider === 'On-Device WebGPU' ? (
                        <span className="flex items-center gap-1 text-emerald-400 font-bold">
                          <Zap className="w-3.5 h-3.5 shrink-0" /> Edge WebGPU
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-purple-400 font-bold">
                          <Server className="w-3.5 h-3.5 shrink-0" /> {ses.provider}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono block truncate max-w-[140px]">
                      {ses.model}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-[11px]">
                    <span className="text-slate-300">{ses.inputTokens} in</span> / <span className="text-[#38BDF8]">{ses.outputTokens} out</span>
                  </td>
                  <td className="p-3.5 font-mono">
                    <span className={ses.latencyMs < 50 ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                      {ses.latencyMs} ms
                    </span>
                  </td>
                  <td className="p-3.5 font-mono font-bold">
                    {ses.estimatedCostUSD === 0 ? (
                      <span className="text-emerald-400 font-bold">$0.000 (Free)</span>
                    ) : (
                      <span className="text-slate-200">${ses.estimatedCostUSD.toFixed(4)}</span>
                    )}
                  </td>
                  <td className="p-3.5 text-right font-mono">
                    {ses.costSavedUSD > 0 ? (
                      <span className="text-emerald-400 font-bold">
                        +${ses.costSavedUSD.toFixed(4)}
                      </span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
