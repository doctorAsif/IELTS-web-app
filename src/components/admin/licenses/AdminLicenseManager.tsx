import React, { useState, useEffect } from 'react';
import { 
  Key, Plus, ShieldCheck, Laptop, Smartphone, Trash2, CheckCircle, 
  Search, RefreshCw, AlertTriangle, Download, Clock, Users, Shield, Copy, Check
} from 'lucide-react';
import { LicenseSyncEngine, StudentLicense } from '../../../lib/license/LicenseSyncEngine';

export const AdminLicenseManager: React.FC = () => {
  const [licenses, setLicenses] = useState<StudentLicense[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationMode, setGenerationMode] = useState<'single' | 'cohort'>('single');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Form state for generating new license
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [cohortName, setCohortName] = useState('IELTS Master Class');
  const [cohortCount, setCohortCount] = useState(5);
  const [newGraceDays, setNewGraceDays] = useState<number>(45);

  useEffect(() => {
    loadLicenses();
  }, []);

  const loadLicenses = () => {
    const list = LicenseSyncEngine.getAllAdminLicenses();
    setLicenses(list);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();

    if (generationMode === 'single') {
      if (!newEmail.trim() || !newName.trim()) {
        alert('Candidate name and email are required to issue a license.');
        return;
      }
      const created = LicenseSyncEngine.generateNewLicenseKey(newEmail, newName, 2, newGraceDays);
      loadLicenses();
      setIsGenerating(false);
      setNewEmail('');
      setNewName('');
      alert(`New Student License Issued!\n\nKey: ${created.licenseKey}\nCandidate: ${created.studentName}\nOffline Grace: ${created.gracePeriodDays} Days`);
    } else {
      if (!cohortName.trim()) {
        alert('Please specify a cohort name/prefix.');
        return;
      }
      const batch = LicenseSyncEngine.batchGenerateLicenses(cohortCount, cohortName, newGraceDays);
      loadLicenses();
      setIsGenerating(false);
      alert(`Batch Generated ${batch.length} Student Licenses for cohort "${cohortName}"!\nAll bound to max 2 hardware device slots.`);
    }
  };

  const handleDeauthorizeDevice = (deviceId: string, licenseKey: string) => {
    if (!confirm(`Deauthorize device ${deviceId} from student license ${licenseKey}?\n\nThis will free up one of the 2 hardware slots for this candidate.`)) return;
    LicenseSyncEngine.deauthorizeDevice(deviceId);
    loadLicenses();
  };

  const handleExtendGrace = (licenseKey: string) => {
    LicenseSyncEngine.extendGracePeriod(licenseKey, 30);
    loadLicenses();
    alert(`Granted +30 days offline grace extension to license ${licenseKey}.`);
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExportCSV = () => {
    const csvContent = LicenseSyncEngine.exportLicensesCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `akhl_student_licenses_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLicenses = licenses.filter(l =>
    l.licenseKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getGraceStatusInfo = (lic: StudentLicense) => {
    const lastSyncMs = new Date(lic.lastOnlineSync).getTime();
    const nowMs = Date.now();
    const elapsedDays = Math.floor((nowMs - lastSyncMs) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, (lic.gracePeriodDays || 45) - elapsedDays);

    if (daysRemaining === 0) {
      return {
        label: 'Grace Expired',
        color: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        daysRemaining,
        isExpired: true
      };
    } else if (daysRemaining <= 10) {
      return {
        label: 'Check-in Imminent',
        color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        daysRemaining,
        isExpired: false
      };
    } else {
      return {
        label: 'Grace Active',
        color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        daysRemaining,
        isExpired: false
      };
    }
  };

  return (
    <div className="space-y-6 text-white animate-fadeInUp">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#334155] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase text-[#38BDF8] bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/30 flex items-center gap-1">
              <Key className="w-3 h-3" /> License & Hardware Slot Manager
            </span>
            <span className="text-xs text-slate-400">Dr. Asif Kibria Security Protocol</span>
          </div>
          <h1 className="text-2xl font-black">Student Licensing & Device Slot Manager</h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Manage 16-character keys, hardware UUID slot limits (max 2 devices), and 30-60 day offline grace windows.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            title="Download CSV for administration"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>

          {/* Issue New Key Button */}
          <button
            onClick={() => setIsGenerating(!isGenerating)}
            className="px-4 py-2 bg-[#38BDF8] hover:bg-[#0284C7] text-slate-950 font-black text-xs uppercase rounded-xl transition shadow flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Issue Licenses
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#1E293B] border border-[#334155] p-5 rounded-3xl space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Issued Licenses</span>
          <div className="text-2xl font-black text-white">{licenses.length} Candidates</div>
          <p className="text-[11px] text-sky-400 font-semibold">100% compliant with 2-device policy</p>
        </div>

        <div className="bg-[#1E293B] border border-[#334155] p-5 rounded-3xl space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Active Bound Hardware Slots</span>
          <div className="text-2xl font-black text-emerald-400">
            {licenses.reduce((acc, l) => acc + l.activeDevices.length, 0)} / {licenses.length * 2} Slots
          </div>
          <p className="text-[11px] text-emerald-400 font-semibold">Tracked via unique DEV-UUID hash</p>
        </div>

        <div className="bg-[#1E293B] border border-[#334155] p-5 rounded-3xl space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Offline Grace Window</span>
          <div className="text-2xl font-black text-purple-400">30 – 60 Days</div>
          <p className="text-[11px] text-purple-300 font-semibold">Automatic background verification</p>
        </div>
      </div>

      {/* Generate Form Drawer */}
      {isGenerating && (
        <form onSubmit={handleGenerate} className="bg-[#1E293B] border border-[#38BDF8]/40 rounded-3xl p-6 space-y-5 animate-fadeInUp shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#334155] pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Key className="w-4 h-4 text-[#38BDF8]" />
              Issue Student License Activation Keys
            </h3>
            
            {/* Toggle Single vs Cohort */}
            <div className="flex bg-[#0F172A] p-1 rounded-xl border border-[#334155] text-xs">
              <button
                type="button"
                onClick={() => setGenerationMode('single')}
                className={`px-3 py-1 rounded-lg font-bold transition ${generationMode === 'single' ? 'bg-[#38BDF8] text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
              >
                Individual Candidate
              </button>
              <button
                type="button"
                onClick={() => setGenerationMode('cohort')}
                className={`px-3 py-1 rounded-lg font-bold transition ${generationMode === 'cohort' ? 'bg-[#38BDF8] text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
              >
                Batch Cohort Intake
              </button>
            </div>
          </div>

          {generationMode === 'single' ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Candidate Full Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mahfuzur Rahman"
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#38BDF8]"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Candidate Email Address:</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. mahfuz.swb@gmail.com"
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#38BDF8]"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Offline Grace Window:</label>
                <select
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#38BDF8]"
                  value={newGraceDays}
                  onChange={e => setNewGraceDays(parseInt(e.target.value))}
                >
                  <option value={30}>30 Days Offline Grace</option>
                  <option value={45}>45 Days Offline Grace (Standard)</option>
                  <option value={60}>60 Days Offline Grace (Extended)</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Cohort Batch Name / Prefix:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IELTS Master Class Batch 24"
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#38BDF8]"
                  value={cohortName}
                  onChange={e => setCohortName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Number of Student Keys:</label>
                <select
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#38BDF8]"
                  value={cohortCount}
                  onChange={e => setCohortCount(parseInt(e.target.value))}
                >
                  <option value={5}>5 Student Licenses</option>
                  <option value={10}>10 Student Licenses</option>
                  <option value={20}>20 Student Licenses</option>
                  <option value={30}>30 Student Licenses</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Offline Grace Window:</label>
                <select
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#38BDF8]"
                  value={newGraceDays}
                  onChange={e => setNewGraceDays(parseInt(e.target.value))}
                >
                  <option value={30}>30 Days Grace</option>
                  <option value={45}>45 Days Grace (Standard)</option>
                  <option value={60}>60 Days Grace</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-[#334155]">
            <button
              type="button"
              onClick={() => setIsGenerating(false)}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#38BDF8] text-slate-950 font-black text-xs uppercase rounded-xl shadow hover:bg-[#0284C7] transition"
            >
              {generationMode === 'single' ? 'Generate 16-Char License' : `Batch Issue ${cohortCount} Keys`}
            </button>
          </div>
        </form>
      )}

      {/* Search Filter Bar */}
      <div className="flex items-center gap-3 bg-[#1E293B] border border-[#334155] px-4 py-3 rounded-2xl">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Filter by license key (AKHL-XXXX-XXXX-XXXX), candidate name, or student email..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* License Cards List */}
      <div className="space-y-4">
        {filteredLicenses.map(lic => {
          const graceInfo = getGraceStatusInfo(lic);

          return (
            <div key={lic.licenseKey} className="bg-[#1E293B] border border-[#334155] rounded-3xl p-6 space-y-5 shadow-lg">
              {/* Top Row: License Key, Status, Grace Countdown */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#334155] pb-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-base font-black text-[#38BDF8] tracking-wider">
                      {lic.licenseKey}
                    </span>
                    <button
                      onClick={() => handleCopy(lic.licenseKey)}
                      className="p-1 hover:bg-slate-700 text-slate-400 hover:text-white rounded transition"
                      title="Copy Key"
                    >
                      {copiedKey === lic.licenseKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/30">
                      {lic.status}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${graceInfo.color}`}>
                      {graceInfo.label} ({graceInfo.daysRemaining}d left)
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    Candidate: <span className="font-bold text-white">{lic.studentName}</span> ({lic.studentEmail})
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="text-right text-slate-400">
                    <span>Grace Window: <b className="text-white">{lic.gracePeriodDays} Days</b></span>
                    <span className="block text-[11px] text-slate-500">
                      Last Check-in: {new Date(lic.lastOnlineSync).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Extend Grace Button */}
                  <button
                    onClick={() => handleExtendGrace(lic.licenseKey)}
                    className="px-2.5 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-xl text-[11px] font-bold transition flex items-center gap-1"
                    title="Add 30 days to offline grace window"
                  >
                    <Clock className="w-3 h-3" /> +30d Grace
                  </button>
                </div>
              </div>

              {/* Hardware Device Slots (Explicitly Max 2 Slots per Dr. Asif Kibria's requirement) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-sky-400" />
                    Bound Hardware Slots ({lic.activeDevices.length} of {lic.maxDevices} maximum devices locked)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Max 2 devices per student license
                  </span>
                </div>

                {/* 2-Slot Grid Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Slot 1 */}
                  {lic.activeDevices[0] ? (
                    <div className="p-3.5 bg-[#0F172A] rounded-2xl border border-sky-500/30 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-sky-500/20 text-[#38BDF8]">Slot 1</span>
                          <span className="font-bold text-white">{lic.activeDevices[0].deviceName}</span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-400 block mt-1">UUID: {lic.activeDevices[0].deviceId}</span>
                        <span className="text-[10px] text-slate-500">Registered: {new Date(lic.activeDevices[0].registeredAt).toLocaleDateString()}</span>
                      </div>
                      <button
                        onClick={() => handleDeauthorizeDevice(lic.activeDevices[0].deviceId, lic.licenseKey)}
                        className="px-2.5 py-1.5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/30 rounded-xl text-[11px] font-bold transition flex items-center gap-1"
                        title="Deauthorize device to free slot"
                      >
                        <Trash2 className="w-3 h-3" /> Deauthorize
                      </button>
                    </div>
                  ) : (
                    <div className="p-3.5 bg-[#0F172A] rounded-2xl border border-dashed border-[#334155] flex items-center justify-between text-xs text-slate-500">
                      <div>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">Slot 1</span>
                        <span className="block mt-1 font-medium">Available (Unbound)</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Binds automatically on candidate login</span>
                    </div>
                  )}

                  {/* Slot 2 */}
                  {lic.activeDevices[1] ? (
                    <div className="p-3.5 bg-[#0F172A] rounded-2xl border border-sky-500/30 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-sky-500/20 text-[#38BDF8]">Slot 2</span>
                          <span className="font-bold text-white">{lic.activeDevices[1].deviceName}</span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-400 block mt-1">UUID: {lic.activeDevices[1].deviceId}</span>
                        <span className="text-[10px] text-slate-500">Registered: {new Date(lic.activeDevices[1].registeredAt).toLocaleDateString()}</span>
                      </div>
                      <button
                        onClick={() => handleDeauthorizeDevice(lic.activeDevices[1].deviceId, lic.licenseKey)}
                        className="px-2.5 py-1.5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/30 rounded-xl text-[11px] font-bold transition flex items-center gap-1"
                        title="Deauthorize device to free slot"
                      >
                        <Trash2 className="w-3 h-3" /> Deauthorize
                      </button>
                    </div>
                  ) : (
                    <div className="p-3.5 bg-[#0F172A] rounded-2xl border border-dashed border-[#334155] flex items-center justify-between text-xs text-slate-500">
                      <div>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">Slot 2</span>
                        <span className="block mt-1 font-medium">Available (Unbound)</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Binds automatically on 2nd device login</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredLicenses.length === 0 && (
          <div className="p-12 bg-[#1E293B] border border-[#334155] rounded-3xl text-center text-slate-400 text-xs">
            No student licenses matching search filter.
          </div>
        )}
      </div>
    </div>
  );
};
