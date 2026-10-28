import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { registerUser, loginUser, getAllStoredAccounts, setStoredUser } from '../services/api';
import { X, CheckCircle2, UserPlus, LogIn, Users, ArrowRight, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUserUpdated: (user: UserProfile) => void;
  onOpenNetlifyFixer: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'register' | 'signin' | 'accounts'>('register');
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('Cleaning Services');
  const [currency, setCurrency] = useState('NGN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [storedAccounts, setStoredAccounts] = useState<UserProfile[]>([]);

  useEffect(() => {
    if (isOpen) {
      const accounts = getAllStoredAccounts();
      setStoredAccounts(accounts);
      setErrorBanner(null);
      setSuccessMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !businessName || !fullName) {
      setErrorBanner('Please fill in your name, business name, and email.');
      return;
    }

    setLoading(true);
    setErrorBanner(null);
    setSuccessMessage(null);

    try {
      const result = await registerUser({
        fullName: fullName.trim(),
        businessName: businessName.trim(),
        businessType,
        currency,
        email: email.trim(),
        password: password || 'default123',
      });

      setLoading(false);
      if (result.success && result.user) {
        onUserUpdated(result.user);
        setSuccessMessage(`Account created successfully for ${result.user.businessName}!`);
        setTimeout(() => {
          onClose();
        }, 700);
      } else {
        setErrorBanner(result.error || 'Unable to register account');
      }
    } catch (err: any) {
      setLoading(false);
      setErrorBanner('Failed to save account. Please verify input.');
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorBanner('Please enter your email address.');
      return;
    }

    setLoading(true);
    setErrorBanner(null);
    setSuccessMessage(null);

    try {
      const result = await loginUser(email.trim(), password);
      setLoading(false);
      if (result.success && result.user) {
        onUserUpdated(result.user);
        setSuccessMessage(`Welcome back, ${result.user.fullName}!`);
        setTimeout(() => {
          onClose();
        }, 700);
      } else {
        setErrorBanner(result.error || 'Sign in failed');
      }
    } catch (err: any) {
      setLoading(false);
      setErrorBanner('Sign in encountered an issue.');
    }
  };

  const handleSwitchToAccount = (user: UserProfile) => {
    setStoredUser(user);
    onUserUpdated(user);
    setSuccessMessage(`Switched to ${user.businessName}!`);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleFillDemo = () => {
    setFullName('Emmanuel Ochuru');
    setBusinessName('Emeka Cleaning Services');
    setBusinessType('Cleaning Services');
    setCurrency('NGN');
    setEmail('emmanuelochuru09@gmail.com');
    setPassword('••••••••••••');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800 focus:outline-none"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Icon */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-base shadow-md shadow-indigo-600/40">
            SP
          </div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            SellPilot Account Center
          </span>
        </div>

        {/* Modal Title */}
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          {activeTab === 'register' && 'Create Business Account'}
          {activeTab === 'signin' && 'Sign In to Your Business'}
          {activeTab === 'accounts' && 'Switch Active Account'}
        </h2>
        <p className="text-xs text-slate-400 mt-1 mb-5">
          {activeTab === 'register' && 'Register any new business. No 404 restrictions, guaranteed full access.'}
          {activeTab === 'signin' && 'Access your campaigns, landing pages, and lead pipeline with any email.'}
          {activeTab === 'accounts' && 'Switch between business profiles stored in this browser.'}
        </p>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 mb-5 bg-slate-950 border border-slate-800 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorBanner(null);
            }}
            className={`flex-1 py-1.5 font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === 'register'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>New Account</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('signin');
              setErrorBanner(null);
            }}
            className={`flex-1 py-1.5 font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === 'signin'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          {storedAccounts.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setActiveTab('accounts');
                setErrorBanner(null);
              }}
              className={`flex-1 py-1.5 font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
                activeTab === 'accounts'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Accounts ({storedAccounts.length})</span>
            </button>
          )}
        </div>

        {/* Success Message Banner */}
        {successMessage && (
          <div className="mb-4 rounded-xl border border-emerald-900/60 bg-emerald-950/40 p-3 text-emerald-200 text-xs sm:text-sm flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Banner */}
        {errorBanner && (
          <div className="mb-4 rounded-xl border border-red-900/60 bg-red-950/40 p-3 text-red-200 text-xs flex items-center gap-2 animate-in fade-in">
            <X className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorBanner}</span>
          </div>
        )}

        {/* Tab 1: Register New Account */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Your Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Kolawole Adeleke or Sarah Davis"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Business Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Adeleke Logistics or Sparkle Home Care"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Business Type
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value="Cleaning Services">Cleaning Services</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Retail & Fashion">Retail & Fashion</option>
                  <option value="Beauty & Wellness">Beauty & Wellness</option>
                  <option value="Home Services">Home Services</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Food & Catering">Food & Catering</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value="NGN">₦ NGN</option>
                  <option value="USD">$ USD</option>
                  <option value="EUR">€ EUR</option>
                  <option value="GBP">£ GBP</option>
                  <option value="KES">KSh KES</option>
                  <option value="GHS">GH₵ GHS</option>
                  <option value="CAD">C$ CAD</option>
                  <option value="ZAR">R ZAR</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.business@email.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create secure password"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Fill Emeka Cleaning Demo</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Create Business Account'
              )}
            </button>
          </form>
        )}

        {/* Tab 2: Sign In */}
        {activeTab === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter any registered or new email"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 px-4 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>
        )}

        {/* Tab 3: Saved Accounts List */}
        {activeTab === 'accounts' && (
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {storedAccounts.map((acc) => {
              const isActive = acc.email.toLowerCase() === currentUser.email.toLowerCase();
              return (
                <div
                  key={acc.id}
                  className={`p-3.5 rounded-xl border transition flex items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-indigo-950/40 border-indigo-700'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-xs truncate">
                        {acc.businessName}
                      </span>
                      {isActive && (
                        <span className="text-[10px] text-indigo-400 bg-indigo-950 px-1.5 py-0.5 rounded border border-indigo-800 font-medium">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {acc.fullName} · {acc.email}
                    </div>
                    <div className="text-[11px] text-indigo-300 font-mono mt-0.5">
                      {acc.currencySymbol} {acc.currency} · {acc.businessType}
                    </div>
                  </div>

                  {!isActive && (
                    <button
                      type="button"
                      onClick={() => handleSwitchToAccount(acc)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg shrink-0 transition flex items-center gap-1"
                    >
                      <span>Switch</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
