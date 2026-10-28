import React, { useState } from 'react';
import { UserProfile, Lead, LeadStage } from '../types';
import { createLead } from '../services/api';
import { X, Plus, UserPlus } from 'lucide-react';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onLeadAdded: (lead: Lead) => void;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLeadAdded,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [serviceNeeded, setServiceNeeded] = useState('');
  const [value, setValue] = useState('50000');
  const [stage, setStage] = useState<LeadStage>('new');
  const [source, setSource] = useState('Instagram Ad');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setLoading(true);
    const newLead = await createLead({
      name,
      phone,
      email,
      serviceNeeded: serviceNeeded || 'Cleaning Service Package',
      stage,
      value: Number(value) || 0,
      source,
      notes,
    });

    setLoading(false);
    onLeadAdded(newLead);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Add Inbound Lead</h2>
            <p className="text-xs text-slate-400">Record a new prospective client for {currentUser.businessName}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Client / Prospect Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Kolawole Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Phone Number <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="+234 801 234 5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="optional@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Service Requested
            </label>
            <input
              type="text"
              placeholder="e.g. 4-Bedroom Post-Renovation Deep Clean"
              value={serviceNeeded}
              onChange={(e) => setServiceNeeded(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Estimated Value ({currentUser.currencySymbol})
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Lead Source
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="Instagram Ad">Instagram Ad</option>
                <option value="Facebook Ad">Facebook Ad</option>
                <option value="Google Search">Google Search</option>
                <option value="Website Form">Website Form</option>
                <option value="Referral">Referral / Word of mouth</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Initial Funnel Stage
            </label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as LeadStage)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="new">New Inquiry</option>
              <option value="contacted">Contacted</option>
              <option value="quote_sent">Quote Sent</option>
              <option value="won">Deal Won</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Notes
            </label>
            <textarea
              rows={2}
              placeholder="Specific client instructions, timeline, address..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs shadow-md transition disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Save Lead to CRM'}
          </button>
        </form>
      </div>
    </div>
  );
};
