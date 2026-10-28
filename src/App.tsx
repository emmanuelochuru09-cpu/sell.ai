/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, Lead } from './types';
import { getStoredUser, fetchLeads } from './services/api';
import { Header } from './components/Header';
import { DashboardCRM } from './components/DashboardCRM';
import { AIAdStudio } from './components/AIAdStudio';
import { AIWebsiteBuilder } from './components/AIWebsiteBuilder';
import { NetlifyFixer } from './components/NetlifyFixer';
import { AuthModal } from './components/AuthModal';
import { AddLeadModal } from './components/AddLeadModal';
import { AlertTriangle, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(getStoredUser());
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ad_studio' | 'website_builder' | 'netlify_fixer'>('dashboard');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [addLeadModalOpen, setAddLeadModalOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(true);

  useEffect(() => {
    fetchLeads().then((loadedLeads) => {
      setLeads(loadedLeads);
    });
  }, [currentUser.email]);

  const handleUserUpdated = (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
  };

  const handleLeadAdded = (newLead: Lead) => {
    setLeads((prev) => [newLead, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Netlify 404 Solution Alert Banner */}
      {!bannerDismissed && (
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-indigo-950 border-b border-red-900/40 px-4 py-2.5 text-xs text-slate-200">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
              <span>
                <strong>Netlify Error Solved:</strong> We identified why{' '}
                <code className="text-amber-300 font-mono">sellpilotai.netlify.app</code> gave{' '}
                <span className="text-red-300 font-semibold">"Request failed with status 404"</span> on signup.
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('netlify_fixer')}
                className="text-indigo-400 hover:text-indigo-300 font-semibold underline flex items-center gap-1 whitespace-nowrap"
              >
                <span>View 1-Click Fix & Config</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              <button
                onClick={() => setAuthModalOpen(true)}
                className="text-slate-400 hover:text-slate-200 text-[11px] whitespace-nowrap"
              >
                Inspect Signup Modal
              </button>

              <button
                onClick={() => setBannerDismissed(true)}
                className="text-slate-500 hover:text-slate-300 px-1 text-xs"
                title="Dismiss banner"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main App Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onOpenAddLeadModal={() => setAddLeadModalOpen(true)}
      />

      {/* Main Application Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardCRM
            leads={leads}
            setLeads={setLeads}
            currentUser={currentUser}
            onOpenAddLeadModal={() => setAddLeadModalOpen(true)}
            onNavigateToAdStudio={() => setActiveTab('ad_studio')}
          />
        )}

        {activeTab === 'ad_studio' && (
          <AIAdStudio currentUser={currentUser} />
        )}

        {activeTab === 'website_builder' && (
          <AIWebsiteBuilder
            currentUser={currentUser}
            onNewLeadCreated={handleLeadAdded}
          />
        )}

        {activeTab === 'netlify_fixer' && (
          <NetlifyFixer />
        )}
      </main>

      {/* Anti-Slop Compliant Quiet Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">SellPilot AI</span>
            <span>·</span>
            <span>AI Sales & Marketing Infrastructure for Growing Businesses</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setActiveTab('netlify_fixer')}
              className="hover:text-slate-300 transition"
            >
              Netlify 404 Guide
            </button>
            <span>·</span>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="hover:text-slate-300 transition"
            >
              Business Profile
            </button>
            <span>·</span>
            <span className="font-mono text-slate-600">v1.0.0</span>
          </div>
        </div>
      </footer>

      {/* Auth Modal (replicates screenshot modal with live submit & 404 inspector) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={currentUser}
        onUserUpdated={handleUserUpdated}
        onOpenNetlifyFixer={() => setActiveTab('netlify_fixer')}
      />

      {/* Add Lead CRM Modal */}
      <AddLeadModal
        isOpen={addLeadModalOpen}
        onClose={() => setAddLeadModalOpen(false)}
        currentUser={currentUser}
        onLeadAdded={handleLeadAdded}
      />
    </div>
  );
}
