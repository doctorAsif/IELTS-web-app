import React, { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { GraduationCap, Mail, Lock, AlertCircle, Loader2, X } from 'lucide-react';

interface AuthModalProps {
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { login, signup, loginWithGoogle } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      onClose?.();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      onClose?.();
    } catch (err: any) {
      setError(err.message || 'Google Sign-In failed.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1E293B] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col font-sans border border-[#334155] text-white relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="bg-gradient-to-b from-[#1E3A8A] to-[#1E293B] p-8 text-center relative overflow-hidden border-b border-[#334155]">
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 bg-sky-500/10 rounded-2xl flex items-center justify-center border border-sky-400/30 mb-3">
              <GraduationCap className="w-8 h-8 text-[#38BDF8]" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">AKHL IELTS</h2>
            <p className="text-sky-300 text-xs mt-1 font-semibold">
              Sign in to save your progress across devices
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="p-6 md:p-8">
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 pb-3 text-xs font-bold tracking-wide uppercase transition-colors border-b-2 ${
                isLogin ? 'text-[#38BDF8] border-[#38BDF8]' : 'text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 pb-3 text-xs font-bold tracking-wide uppercase transition-colors border-b-2 ${
                !isLogin ? 'text-[#38BDF8] border-[#38BDF8]' : 'text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 rounded-xl flex items-start gap-3 border border-red-500/30">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-300 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition font-medium text-white text-sm"
                  placeholder="student@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition font-medium text-white text-sm"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full py-3.5 bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-slate-950 rounded-xl font-bold tracking-wide text-sm transition disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                isLogin ? 'Secure Log In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-[#334155] space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3 bg-[#0F172A] border border-[#334155] hover:bg-slate-800 text-white rounded-xl font-semibold text-sm transition flex items-center justify-center gap-3"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>Continue with Google</span>
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 text-xs text-slate-400 hover:text-slate-200 transition text-center"
              >
                Continue without signing in
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
