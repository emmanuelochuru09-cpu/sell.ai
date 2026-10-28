import React from 'react';
import { UserProfile } from '../types';
import { AlertCircle, Plus, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'ad_studio' | 'website_builder' | 'netlify_fixer';
  setActiveTab: (tab: 'dashboard' | 'ad_studio' | 'website_builder' | 'netlify_fixer') => void;
  currentUser: UserProfile;
  onOpenAuthModal: () => void;
  onOpenAddLeadModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuthModal,
  onOpenAddLeadModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single element) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center font-bold text-white text-base shadow-lg shadow-indigo-600/30">
              SP
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors whitespace-nowrap">
                SellPilot AI
              </span>
              <span className="hidden sm:inline-block text-xs text-slate-400 ml-2">
                Sales Machine
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4 Clean Single-Line Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activeTab === 'dashboard'
                ? 'text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Dashboard & Leads
            {activeTab === 'dashboard' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('ad_studio')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activeTab === 'ad_studio'
                ? 'text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            AI Ad Studio
            {activeTab === 'ad_studio' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('website_builder')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activeTab === 'website_builder'
                ? 'text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            AI Website Builder
            {activeTab === 'website_builder' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('netlify_fixer')}
            className={`whitespace-nowrap transition-colors py-1 relative flex items-center gap-1.5 ${
              activeTab === 'netlify_fixer'
                ? 'text-amber-400 font-semibold'
                : 'text-amber-400/80 hover:text-amber-300'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Netlify 404 Fixer</span>
            {activeTab === 'netlify_fixer' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + User Profile Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAuthModal}
            title="Switch Business Profile / Account Settings"
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:border-indigo-500/50 hover:bg-slate-800/80 transition-colors whitespace-nowrap cursor-pointer"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-white max-w-[120px] truncate">{currentUser.businessName}</span>
            <span className="text-slate-500">·</span>
            <span className="text-indigo-400 font-mono font-medium">{currentUser.currencySymbol} {currentUser.currency}</span>
          </button>

          <button
            onClick={onOpenAddLeadModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 active:scale-95 transition shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Mobile nav strip */}
      <div className="md:hidden border-t border-slate-800/80 bg-slate-950 px-4 py-2 flex items-center justify-between text-xs overflow-x-auto gap-4">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`whitespace-nowrap py-1 ${activeTab === 'dashboard' ? 'text-indigo-400 font-semibold' : 'text-slate-400'}`}
        >
          Leads CRM
        </button>
        <button
          onClick={() => setActiveTab('ad_studio')}
          className={`whitespace-nowrap py-1 ${activeTab === 'ad_studio' ? 'text-indigo-400 font-semibold' : 'text-slate-400'}`}
        >
          AI Ads
        </button>
        <button
          onClick={() => setActiveTab('website_builder')}
          className={`whitespace-nowrap py-1 ${activeTab === 'website_builder' ? 'text-indigo-400 font-semibold' : 'text-slate-400'}`}
        >
          Website
        </button>
        <button
          onClick={() => setActiveTab('netlify_fixer')}
          className={`whitespace-nowrap py-1 flex items-center gap-1 ${activeTab === 'netlify_fixer' ? 'text-amber-400 font-semibold' : 'text-amber-400/80'}`}
        >
          <AlertCircle className="w-3 h-3" />
          404 Fix
        </button>
      </div>
    </header>
  );
};
