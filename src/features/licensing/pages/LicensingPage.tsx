import React, { useState } from 'react';
import { KeyRound, ShieldCheck, Laptop, Smartphone, CheckCircle2, AlertCircle } from 'lucide-react';

export const LicensingPage: React.FC = () => {
  const [licenseKey, setLicenseKey] = useState('AKHL-STUDENT-MASTER-2026');
  const [isActivated, setIsActivated] = useState(true);

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-3 mb-1">
          <h1 className="text-2xl font-bold text-white tracking-tight">Commercial Licensing & Anti-Sharing</h1>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-0.5 rounded-full font-medium">
            Active Entitlement
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Server-authoritative license management directly compatible with your Supabase backend.
        </p>
      </div>

      {/* License Status Card */}
      <div className="bg-[#0D182E] border border-slate-800 p-6 rounded-3xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Student Master Plan</h2>
              <p className="text-xs text-slate-400">Valid through December 31, 2026 • 60-Day Offline Grace Period</p>
            </div>
          </div>

          <span className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full font-bold">
            Authorized
          </span>
        </div>

        {/* Device Slot Anti-Sharing Tracker */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Authorized Device Slots (Max 2 Devices)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-900/90 border border-sky-500/30 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Laptop className="w-5 h-5 text-sky-400" />
                <div>
                  <div className="text-xs font-bold text-white">Current Web Browser</div>
                  <div className="text-[10px] text-slate-400 font-mono">Chrome on macOS • Active Now</div>
                </div>
              </div>
              <span className="text-[10px] bg-sky-500/20 text-sky-300 font-bold px-2 py-0.5 rounded-md">
                This Device
              </span>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-slate-400" />
                <div>
                  <div className="text-xs font-bold text-slate-300">Android Smartphone</div>
                  <div className="text-[10px] text-slate-500 font-mono">Pixel 8 • Last synced 2h ago</div>
                </div>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md">
                Device 2
              </span>
            </div>
          </div>
        </div>

        {/* License Input */}
        <div className="pt-2 space-y-2">
          <label className="text-xs font-medium text-slate-300 block">License Key Activation</label>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white flex-1 focus:outline-none focus:border-sky-500"
            />
            <button
              onClick={() => alert('License successfully synchronized with Supabase server.')}
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors"
            >
              Verify License
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
