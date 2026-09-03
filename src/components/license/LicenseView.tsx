import React, { useState, useEffect } from 'react';
import { Key, ShieldCheck, Laptop, AlertTriangle, RefreshCw, Smartphone, CheckCircle, Trash2, ArrowRight } from 'lucide-react';
import { LicenseSyncEngine, LocalLicenseStatus } from '../../lib/license/LicenseSyncEngine';
import { sound } from '../../lib/audio';

export const LicenseView: React.FC = () => {
  const [licenseStatus, setLicenseStatus] = useState<LocalLicenseStatus>(LicenseSyncEngine.getLocalLicenseStatus());
  const [inputKey, setInputKey] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    refreshStatus();
  }, []);

  const refreshStatus = () => {
    setLicenseStatus(LicenseSyncEngine.getLocalLicenseStatus());
  };

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) return;

    sound.playClick();
    const result = LicenseSyncEngine.activateLicense(inputKey);
    if (result.success) {
      sound.playVictory();
      setMessage({ text: result.message, type: 'success' });
      setInputKey('');
      refreshStatus();
    } else {
      sound.playWrong();
      setMessage({ text: result.message, type: 'error' });
    }
  };

  const handleSyncOnline = () => {
    setIsSyncing(true);
    sound.playClick();
    setTimeout(() => {
      const updated = LicenseSyncEngine.syncLicenseWithCloud();
      setLicenseStatus(updated);
      setIsSyncing(false);
      sound.playCorrect();
      setMessage({ text: 'License successfully synced with cloud server! Offline grace period reset.', type: 'success' });
    }, 600);
  };

  const handleDeauthorizeSlot = (deviceId: string) => {
    if (!confirm('Are you sure you want to deauthorize this device? It will free up a license slot.')) return;
    sound.playTile();
    LicenseSyncEngine.deauthorizeDevice(deviceId);
    refreshStatus();
    setMessage({ text: 'Device slot deauthorized.', type: 'info' });
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6 text-white animate-fadeInUp">
      {/* Header */}
      <div className="bg-[#1E293B] border border-[#334155] p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#38BDF8]/10 text-[#38BDF8] text-xs font-bold px-3 py-1 rounded-full border border-[#38BDF8]/30 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" /> Hardware UUID & Offline License
            </span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
              licenseStatus.status === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
              licenseStatus.status === 'grace_period' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
              'bg-red-500/10 text-red-400 border-red-500/30'
            }`}>
              {licenseStatus.status.toUpperCase().replace('_', ' ')}
            </span>
          </div>
          <h1 className="text-2xl font-black text-white">Device Authorization</h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            AKHL IELTS licenses authorize up to 2 simultaneous hardware devices with a 30–60 day offline grace window.
          </p>
        </div>

        <button
          onClick={handleSyncOnline}
          disabled={isSyncing || !licenseStatus.hasLicense}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 rounded-xl text-xs font-bold transition disabled:opacity-40"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#38BDF8]' : ''}`} />
          {isSyncing ? 'Syncing Cloud...' : 'Sync License Online'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl border text-xs font-medium flex items-center gap-2.5 animate-fadeInUp ${
          message.type === 'success' ? 'bg-green-500/15 border-green-500/30 text-green-200' :
          message.type === 'error' ? 'bg-red-500/15 border-red-500/30 text-red-200' :
          'bg-sky-500/15 border-sky-500/30 text-sky-200'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0 text-green-400" /> : <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Current Hardware Fingerprint Card */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-3xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Laptop className="w-4 h-4 text-[#38BDF8]" /> This Computer's Hardware Slot
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-[#0F172A] rounded-2xl border border-[#334155]">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Hardware UUID:</span>
            <span className="font-mono text-white font-bold">{licenseStatus.currentDeviceId}</span>
          </div>
          <div className="p-3 bg-[#0F172A] rounded-2xl border border-[#334155]">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Device Name:</span>
            <span className="text-white font-bold">{LicenseSyncEngine.getDeviceName()}</span>
          </div>
          <div className="p-3 bg-[#0F172A] rounded-2xl border border-[#334155]">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Offline Grace Remaining:</span>
            <span className="font-bold text-[#38BDF8]">
              {licenseStatus.hasLicense ? `${licenseStatus.daysRemainingInGrace} Days` : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Active License Details & Authorized Slots */}
      {licenseStatus.license ? (
        <div className="bg-[#1E293B] border border-[#334155] rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
              Enrolled License Information
            </h3>
            <span className="font-mono font-bold text-sky-400 text-sm bg-sky-500/10 px-3 py-1 rounded-xl border border-sky-500/30">
              {licenseStatus.license.licenseKey}
            </span>
          </div>

          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-slate-400 uppercase">
              Authorized Device Slots ({licenseStatus.license.activeDevices.length} / {licenseStatus.license.maxDevices} maximum):
            </span>

            <div className="space-y-2">
              {licenseStatus.license.activeDevices.map(slot => {
                const isCurrent = slot.deviceId === licenseStatus.currentDeviceId;
                return (
                  <div
                    key={slot.deviceId}
                    className={`p-4 rounded-2xl border flex items-center justify-between transition ${
                      isCurrent
                        ? 'bg-sky-500/10 border-sky-500/40 text-white'
                        : 'bg-[#0F172A] border-[#334155] text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl border ${isCurrent ? 'bg-sky-500/20 border-sky-400 text-sky-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                        {slot.deviceName.includes('iOS') || slot.deviceName.includes('Android') ? (
                          <Smartphone className="w-4 h-4" />
                        ) : (
                          <Laptop className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs">{slot.deviceName}</span>
                          {isCurrent && (
                            <span className="text-[10px] bg-[#38BDF8] text-slate-950 font-black px-2 py-0.5 rounded-full">
                              CURRENT DEVICE
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                          UUID: {slot.deviceId} • Verified: {new Date(slot.lastVerifiedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeauthorizeSlot(slot.deviceId)}
                      className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl transition"
                      title="Deauthorize device slot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* License Key Input Form */
        <div className="bg-[#1E293B] border border-[#334155] rounded-3xl p-6 md:p-8 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Activate 16-Character License Key</h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Provided upon enrollment by Dr. Asif Kibria / Student World Bangladesh.
            </p>
          </div>

          <form onSubmit={handleActivate} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                License Key (XXXX-XXXX-XXXX-XXXX):
              </label>
              <input
                type="text"
                maxLength={19}
                placeholder="e.g. AKHL-9942-8812-4410"
                value={inputKey}
                onChange={e => setInputKey(e.target.value.toUpperCase())}
                className="w-full bg-[#0F172A] border border-[#334155] rounded-2xl px-4 py-3 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-[#38BDF8]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl transition shadow-lg flex items-center justify-center gap-2"
            >
              Authorize This Device <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
