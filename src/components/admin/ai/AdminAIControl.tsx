import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

export const AdminAIControl = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    defaultProvider: 'gemini',
    enabledProviders: ['gemini', 'openai', 'claude']
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const db = getFirestore();
      const docRef = doc(db, 'ai_settings', 'routing');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(docSnap.data() as any);
      }
    } catch (e) {
      console.error('Failed to load AI settings', e);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const db = getFirestore();
      const docRef = doc(db, 'ai_settings', 'routing');
      await setDoc(docRef, settings);
      alert('AI Settings saved successfully!');
    } catch (e) {
      console.error('Failed to save AI settings', e);
      alert('Failed to save AI settings.');
    } finally {
      setSaving(false);
    }
  };

  const toggleProvider = (provider: string) => {
    const isEnabled = settings.enabledProviders.includes(provider);
    let newProviders = [...settings.enabledProviders];
    if (isEnabled) {
      newProviders = newProviders.filter(p => p !== provider);
      if (settings.defaultProvider === provider) {
        settings.defaultProvider = newProviders[0] || '';
      }
    } else {
      newProviders.push(provider);
    }
    setSettings({ ...settings, enabledProviders: newProviders });
  };

  if (loading) return <div className="p-8">Loading AI Control Panel...</div>;

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">AI Control Panel</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Cloud Routing Policy</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Default Cloud Provider</label>
          <select 
            value={settings.defaultProvider} 
            onChange={(e) => setSettings({ ...settings, defaultProvider: e.target.value })}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            {settings.enabledProviders.map(p => (
              <option key={p} value={p}>{p.toUpperCase()}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Enabled Cloud Providers</label>
          <div className="flex space-x-4">
            {['gemini', 'openai', 'claude'].map(provider => (
              <label key={provider} className="inline-flex items-center">
                <input 
                  type="checkbox" 
                  checked={settings.enabledProviders.includes(provider)}
                  onChange={() => toggleProvider(provider)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">{provider.toUpperCase()}</span>
              </label>
            ))}
          </div>
        </div>
        
        <button 
          onClick={saveSettings}
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save AI Settings'}
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Usage Analytics (Mock)</h2>
        <p className="text-gray-600 mb-4">Aggregate AI cost and credit metrics will be displayed here.</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded border">
            <div className="text-sm text-gray-500">Total Cloud Cost (This Month)</div>
            <div className="text-2xl font-bold">$142.50</div>
          </div>
          <div className="bg-gray-50 p-4 rounded border">
            <div className="text-sm text-gray-500">Local Offload Savings</div>
            <div className="text-2xl font-bold text-green-600">$85.20</div>
          </div>
          <div className="bg-gray-50 p-4 rounded border">
            <div className="text-sm text-gray-500">Total Token Usage</div>
            <div className="text-2xl font-bold">14.2M</div>
          </div>
        </div>
      </div>
    </div>
  );
};
