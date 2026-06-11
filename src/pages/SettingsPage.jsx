import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Key, Save, LoaderIcon, Trash2, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

export default function SettingsPage() {
  const { user, updateApiKey } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState('idle'); // idle, saving, success, error
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    
    setStatus('saving');
    setError('');
    
    try {
      await updateApiKey(apiKey);
      setStatus('success');
      setApiKey(''); // Clear the input field for security
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save API key');
      setStatus('error');
    }
  };

  const handleRemove = async () => {
    if (!confirm('Are you sure you want to remove your API key? You will not be able to use the Analyzer until you provide a new one.')) return;
    
    setStatus('saving');
    try {
      await api.delete('/user/api-key');
      // Hacky refresh by calling updateApiKey with empty string will fail, 
      // instead let's just reload the page or add a removeApiKey method to context.
      window.location.reload(); 
    } catch (err) {
      setError(err.message || 'Failed to remove API key');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0414] text-white pt-28 pb-20 px-4 relative">
      <div className="max-w-2xl mx-auto relative z-10">
        
        <h1 className="text-4xl font-bold font-instrument mb-2">Settings</h1>
        <p className="text-white/40 font-cabin mb-10">Manage your profile and API integrations</p>

        <div className="bg-[#1c1528] rounded-3xl border border-white/5 overflow-hidden shadow-2xl mb-8">
          <div className="p-6 border-b border-white/5 bg-white/[0.01]">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Key size={18} className="text-white/40" />
              Gemini API Key
            </h2>
            <p className="text-sm text-white/40 font-cabin mt-1">
              Your API key is only used to process your requests and is never shared with other users. It is encrypted at rest.
            </p>
          </div>
          
          <div className="p-6">
            {user?.has_api_key && (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-emerald-400" />
                  <div>
                    <p className="text-sm font-medium text-emerald-400">API Key Configured</p>
                    <p className="text-xs text-white/40 font-mono mt-0.5">AIza••••••••••••••••</p>
                  </div>
                </div>
                <button 
                  onClick={handleRemove}
                  className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Remove API Key"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}

            <form onSubmit={handleSave}>
              <div className="mb-4">
                <label className="block text-xs text-white/50 mb-1.5 font-cabin uppercase tracking-wider">
                  {user?.has_api_key ? 'Update API Key' : 'Enter API Key'}
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono"
                />
              </div>

              {error && (
                <div className="mb-4 text-xs text-red-400 font-cabin">{error}</div>
              )}

              <button
                type="submit"
                disabled={!apiKey.trim() || status === 'saving'}
                className="bg-white text-black font-semibold rounded-xl px-5 py-2.5 flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {status === 'saving' ? <LoaderIcon className="animate-spin w-4 h-4" /> : <Save size={16} />}
                Save Key
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
