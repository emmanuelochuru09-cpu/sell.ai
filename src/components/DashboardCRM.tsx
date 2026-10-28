import React, { useState } from 'react';
import { Lead, UserProfile, LeadStage } from '../types';
import { updateLeadStage, deleteLead, exportLeadsToCsv } from '../services/api';
import {
  MessageSquare,
  Search,
  Plus,
  Trash2,
  ExternalLink,
  ChevronDown,
  TrendingUp,
  Users,
  Briefcase,
  CheckCircle,
  Clock,
  Sparkles,
  Download,
} from 'lucide-react';

interface DashboardCRMProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  currentUser: UserProfile;
  onOpenAddLeadModal: () => void;
  onNavigateToAdStudio: () => void;
}

export const DashboardCRM: React.FC<DashboardCRMProps> = ({
  leads,
  setLeads,
  currentUser,
  onOpenAddLeadModal,
  onNavigateToAdStudio,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<'all' | LeadStage>('all');

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.serviceNeeded.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery);
    const matchesStage = stageFilter === 'all' || lead.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const totalValue = leads.reduce((sum, l) => sum + (l.value || 0), 0);
  const wonValue = leads
    .filter((l) => l.stage === 'won')
    .reduce((sum, l) => sum + (l.value || 0), 0);
  const wonCount = leads.filter((l) => l.stage === 'won').length;
  const conversionRate = leads.length > 0 ? Math.round((wonCount / leads.length) * 100) : 0;

  const handleStageChange = async (id: string, newStage: LeadStage) => {
    const updated = await updateLeadStage(id, newStage);
    setLeads(updated);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this lead entry?')) {
      const updated = await deleteLead(id);
      setLeads(updated);
    }
  };

  const formatCurrency = (amount: number) => {
    return `${currentUser.currencySymbol}${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Business Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {currentUser.businessName}
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>{currentUser.businessType}</span>
            <span aria-hidden="true">·</span>
            <span>Currency: {currentUser.currencySymbol} {currentUser.currency}</span>
            <span aria-hidden="true">·</span>
            <span>Account: {currentUser.email}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => exportLeadsToCsv(leads, currentUser.currencySymbol)}
            className="px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 hover:text-white transition flex items-center gap-1.5"
            title="Download CSV spreadsheet of all customer leads"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Leads</span>
          </button>
          <button
            onClick={onNavigateToAdStudio}
            className="px-3.5 py-2 text-xs font-semibold text-indigo-300 bg-indigo-950/60 border border-indigo-800/80 rounded-lg hover:bg-indigo-900/60 transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Generate New Ad</span>
          </button>
          <button
            onClick={onOpenAddLeadModal}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Inbound Lead</span>
          </button>
        </div>
      </div>

      {/* High-Density Metric Strip (Anti-Slop: single level flat border, tabular numerals) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Pipeline Value</span>
          <div className="text-xl sm:text-2xl font-bold text-white font-mono tabular-nums">
            {formatCurrency(totalValue)}
          </div>
          <div className="text-[11px] text-slate-500">Across {leads.length} customer opportunities</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-medium">Closed Won Revenue</span>
          <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono tabular-nums">
            {formatCurrency(wonValue)}
          </div>
          <div className="text-[11px] text-emerald-500/80">{wonCount} confirmed contracts</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-medium">Lead Conversion</span>
          <div className="text-xl sm:text-2xl font-bold text-white font-mono tabular-nums">
            {conversionRate}%
          </div>
          <div className="text-[11px] text-slate-500">Inbound lead to contract rate</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-medium">Active Leads in Funnel</span>
          <div className="text-xl sm:text-2xl font-bold text-indigo-400 font-mono tabular-nums">
            {leads.filter((l) => l.stage !== 'won' && l.stage !== 'lost').length}
          </div>
          <div className="text-[11px] text-slate-500">Require follow-up or quotes</div>
        </div>
      </div>

      {/* Leads Table Management */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search leads by name, phone, or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Functional Filter Tabs (Zero-Pill: segmented button controls) */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs overflow-x-auto">
            {(['all', 'new', 'contacted', 'quote_sent', 'won', 'lost'] as const).map((stage) => (
              <button
                key={stage}
                onClick={() => setStageFilter(stage)}
                className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap capitalize ${
                  stageFilter === stage
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {stage === 'quote_sent' ? 'Quote Sent' : stage}
              </button>
            ))}
          </div>
        </div>

        {/* High-Density Data Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-medium">
                <th className="py-3 px-3">Lead / Client</th>
                <th className="py-3 px-3">Service Inquired</th>
                <th className="py-3 px-3">Estimated Value</th>
                <th className="py-3 px-3">Stage</th>
                <th className="py-3 px-3">Source</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No leads found matching your search.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const whatsappCleanPhone = lead.phone.replace(/[^0-9]/g, '');
                  const whatsappUrl = `https://wa.me/${whatsappCleanPhone}?text=${encodeURIComponent(
                    `Hello ${lead.name}, this is ${currentUser.fullName} from ${currentUser.businessName}. We received your inquiry regarding "${lead.serviceNeeded}" and would love to assist you!`
                  )}`;

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-100">{lead.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{lead.phone}</div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="text-slate-200">{lead.serviceNeeded}</div>
                        {lead.notes && (
                          <div className="text-[11px] text-slate-400 italic truncate max-w-xs">
                            {lead.notes}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3 font-mono font-semibold text-slate-200 tabular-nums">
                        {formatCurrency(lead.value)}
                      </td>

                      <td className="py-3 px-3">
                        <select
                          value={lead.stage}
                          onChange={(e) => handleStageChange(lead.id, e.target.value as LeadStage)}
                          className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-indigo-500"
                        >
                          <option value="new">New Inquiry</option>
                          <option value="contacted">Contacted</option>
                          <option value="quote_sent">Quote Sent</option>
                          <option value="won">Deal Won</option>
                          <option value="lost">Lost</option>
                        </select>
                      </td>

                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        {lead.source}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Chat on WhatsApp"
                            className="p-1.5 bg-emerald-950/60 border border-emerald-800/80 hover:bg-emerald-900/60 text-emerald-300 rounded-md transition flex items-center gap-1 text-[11px]"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">WhatsApp</span>
                          </a>

                          <button
                            onClick={() => handleDelete(lead.id)}
                            title="Delete Lead"
                            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-md transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
