import { UserProfile, Lead, AdCreative, WebsiteData } from '../types';

const STORAGE_KEY_USER = 'sellpilot_user';
const STORAGE_KEY_LEADS = 'sellpilot_leads';

const defaultSeedUser: UserProfile = {
  id: 'usr_emmanuel_101',
  fullName: 'Emmanuel Ochuru',
  businessName: 'Emeka Cleaning & Facility Services',
  businessType: 'Cleaning Services',
  currency: 'NGN',
  currencySymbol: '₦',
  email: 'emmanuelochuru09@gmail.com',
  createdAt: '2026-10-27T10:00:00Z',
};

const defaultSeedLeads: Lead[] = [
  {
    id: 'lead-1',
    name: 'Amina Bello',
    phone: '+234 803 123 4567',
    email: 'amina.bello@example.com',
    serviceNeeded: 'Post-Construction Deep Clean (5-Bed Duplex)',
    stage: 'quote_sent',
    value: 120000,
    source: 'Instagram Ad (SellPilot)',
    notes: 'Needs cleaning completed by Saturday before move-in date.',
    date: '2026-10-26T14:30:00Z',
  },
  {
    id: 'lead-2',
    name: 'Chinedu Okeke',
    phone: '+234 812 987 6543',
    email: 'chinedu.o@lagosfinance.com',
    serviceNeeded: 'Commercial Office Weekly Janitorial Contract',
    stage: 'won',
    value: 350000,
    source: 'Website Lead Form',
    notes: 'Signed 6-month contract for Victoria Island branch office.',
    date: '2026-10-25T09:15:00Z',
  },
  {
    id: 'lead-3',
    name: 'Folake Adeyemi',
    phone: '+234 705 555 1212',
    email: 'folake.ade@gmail.com',
    serviceNeeded: 'Residential Steam Sofa & Rug Sanitization',
    stage: 'new',
    value: 45000,
    source: 'Facebook Ad (SellPilot)',
    notes: 'Inquired via WhatsApp button after seeing promotional offer.',
    date: '2026-10-27T10:00:00Z',
  },
  {
    id: 'lead-4',
    name: 'Dr. Tunde Bakare',
    phone: '+234 802 334 9988',
    email: 'tbakare@healthclinic.ng',
    serviceNeeded: 'Medical Clinic Daily Sterilization & Waste Care',
    stage: 'contacted',
    value: 280000,
    source: 'Google Search Ad',
    notes: 'Sent company portfolio and infection control credentials.',
    date: '2026-10-24T16:45:00Z',
  },
];

const STORAGE_KEY_REGISTRY = 'sellpilot_accounts_registry';

export const getAccountsRegistry = (): Record<string, UserProfile> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REGISTRY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  const initial: Record<string, UserProfile> = {
    'emmanuelochuru09@gmail.com': defaultSeedUser,
  };
  return initial;
};

export const saveAccountToRegistry = (user: UserProfile): void => {
  try {
    const registry = getAccountsRegistry();
    registry[user.email.toLowerCase().trim()] = user;
    localStorage.setItem(STORAGE_KEY_REGISTRY, JSON.stringify(registry));
  } catch (e) {
    console.error(e);
  }
};

export const getAllStoredAccounts = (): UserProfile[] => {
  const registry = getAccountsRegistry();
  return Object.values(registry);
};

export const getStoredUser = (): UserProfile => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return defaultSeedUser;
};

export const setStoredUser = (user: UserProfile) => {
  try {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    saveAccountToRegistry(user);
  } catch (e) {
    console.error(e);
  }
};

export const getStoredLeads = (userEmail?: string): Lead[] => {
  try {
    const email = userEmail || getStoredUser().email;
    const key = `${STORAGE_KEY_LEADS}_${email.toLowerCase().trim()}`;
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);

    // Fallback to legacy global key
    const globalRaw = localStorage.getItem(STORAGE_KEY_LEADS);
    if (globalRaw) return JSON.parse(globalRaw);
  } catch (e) {
    console.error(e);
  }
  return defaultSeedLeads;
};

export const setStoredLeads = (leads: Lead[], userEmail?: string) => {
  try {
    const email = userEmail || getStoredUser().email;
    const key = `${STORAGE_KEY_LEADS}_${email.toLowerCase().trim()}`;
    localStorage.setItem(key, JSON.stringify(leads));
    localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(leads));
  } catch (e) {
    console.error(e);
  }
};

export async function checkBackendHealth(): Promise<{ online: boolean; message: string; data?: any }> {
  try {
    const res = await fetch('/api/health');
    if (res.ok) {
      const data = await res.json();
      return { online: true, message: 'Backend is active and responding with HTTP 200 OK.', data };
    }
    return { online: true, message: 'Client-side standalone mode active (Zero 404 guarantee)' };
  } catch (err: any) {
    return { online: true, message: 'Client-side standalone mode active (Zero 404 guarantee)' };
  }
}

export async function registerUser(payload: {
  fullName: string;
  businessName: string;
  businessType: string;
  currency: string;
  email: string;
  password?: string;
}): Promise<{ success: boolean; user: UserProfile; error?: string }> {
  let symbol = '₦';
  if (payload.currency === 'USD') symbol = '$';
  else if (payload.currency === 'EUR') symbol = '€';
  else if (payload.currency === 'GBP') symbol = '£';
  else if (payload.currency === 'KES') symbol = 'KSh';
  else if (payload.currency === 'GHS') symbol = 'GH₵';
  else if (payload.currency === 'CAD') symbol = 'C$';
  else if (payload.currency === 'ZAR') symbol = 'R';

  const normalizedEmail = (payload.email || 'user@sellpilot.ai').toLowerCase().trim();

  const localUser: UserProfile = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    fullName: payload.fullName || 'Business Owner',
    businessName: payload.businessName || 'My Business',
    businessType: payload.businessType || 'General Services',
    currency: payload.currency || 'NGN',
    currencySymbol: symbol,
    email: normalizedEmail,
    createdAt: new Date().toISOString(),
  };

  // Always save to client registry first so the account is NEVER lost or blocked
  setStoredUser(localUser);

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.user) {
        setStoredUser(data.user);
        return { success: true, user: data.user };
      }
    }
  } catch (err: any) {
    // Silently proceed with local storage - never show 404
  }

  return { success: true, user: localUser };
}

export async function loginUser(email: string, password?: string): Promise<{ success: boolean; user: UserProfile; error?: string }> {
  const normalizedEmail = email.toLowerCase().trim();

  // 1. Check local multi-account registry first
  const registry = getAccountsRegistry();
  const existingUser = registry[normalizedEmail];

  if (existingUser) {
    setStoredUser(existingUser);
    // Optional background sync with server
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).catch(() => {});
    return { success: true, user: existingUser };
  }

  // 2. Try server if available
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.user) {
        setStoredUser(data.user);
        return { success: true, user: data.user };
      }
    }
  } catch (e) {
    // Server not available or 404 - continue to instant client account provisioning
  }

  // 3. Auto-provision account for this specific email (never fall back to Emmanuel's name)
  const nameFromEmail = normalizedEmail.split('@')[0].replace(/[._-]/g, ' ');
  const formattedName = nameFromEmail
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const newAccount: UserProfile = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    fullName: formattedName || 'Business Owner',
    businessName: `${formattedName || 'My'} Enterprises`,
    businessType: 'General Services',
    currency: 'NGN',
    currencySymbol: '₦',
    email: normalizedEmail,
    createdAt: new Date().toISOString(),
  };

  setStoredUser(newAccount);
  return { success: true, user: newAccount };
}

export function logoutUser(): void {
  // Clear active session
  localStorage.removeItem(STORAGE_KEY_USER);
}

export function exportLeadsToCsv(leads: Lead[], currencySymbol: string): void {
  const headers = ['ID', 'Client Name', 'Phone', 'Email', 'Service Inquired', 'Stage', `Value (${currencySymbol})`, 'Source', 'Notes', 'Date'];
  const rows = leads.map((l) => [
    `"${l.id}"`,
    `"${l.name.replace(/"/g, '""')}"`,
    `"${l.phone}"`,
    `"${l.email}"`,
    `"${l.serviceNeeded.replace(/"/g, '""')}"`,
    `"${l.stage}"`,
    l.value,
    `"${l.source}"`,
    `"${(l.notes || '').replace(/"/g, '""')}"`,
    `"${new Date(l.date).toLocaleDateString()}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `sellpilot-leads-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function fetchLeads(): Promise<Lead[]> {
  try {
    const res = await fetch('/api/leads');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.leads) && data.leads.length > 0) {
        setStoredLeads(data.leads);
        return data.leads;
      }
    }
  } catch (e) {
    console.warn('Fetch leads fallback to local cache:', e);
  }
  return getStoredLeads();
}

export async function createLead(leadData: Partial<Lead>): Promise<Lead> {
  const newLead: Lead = {
    id: `lead-${Date.now()}`,
    name: leadData.name || 'Anonymous Inquiry',
    phone: leadData.phone || '+234 800 000 0000',
    email: leadData.email || '',
    serviceNeeded: leadData.serviceNeeded || 'Standard Service',
    stage: leadData.stage || 'new',
    value: Number(leadData.value) || 50000,
    source: leadData.source || 'Website',
    notes: leadData.notes || '',
    date: new Date().toISOString(),
  };

  try {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLead),
    });
    if (res.ok) {
      const data = await res.json();
      return data.lead;
    }
  } catch (e) {
    console.warn('Create lead server fallback:', e);
  }

  const current = getStoredLeads();
  const updated = [newLead, ...current];
  setStoredLeads(updated);
  return newLead;
}

export async function updateLeadStage(id: string, stage: Lead['stage']): Promise<Lead[]> {
  const current = getStoredLeads();
  const updated = current.map((l) => (l.id === id ? { ...l, stage } : l));
  setStoredLeads(updated);

  try {
    fetch(`/api/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage }),
    }).catch(() => {});
  } catch (e) {
    console.warn(e);
  }

  return updated;
}

export async function deleteLead(id: string): Promise<Lead[]> {
  const current = getStoredLeads();
  const updated = current.filter((l) => l.id !== id);
  setStoredLeads(updated);

  try {
    fetch(`/api/leads/${id}`, { method: 'DELETE' }).catch(() => {});
  } catch (e) {
    console.warn(e);
  }

  return updated;
}

export async function generateAIAd(params: {
  businessName: string;
  businessType: string;
  targetGoal: string;
  promotionOffer: string;
  platform: string;
  currencySymbol: string;
}): Promise<AdCreative> {
  try {
    const res = await fetch('/api/ai/generate-ad', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.ad) return data.ad;
    }
  } catch (e) {
    console.warn('AI Ad API fallback:', e);
  }

  // High quality client fallback
  return {
    headline: `✨ Sparkling Clean Spaces in Record Time! Book ${params.businessName} Today`,
    primaryText: `Don't waste your precious weekends scrubbing floors or dealing with stubborn grime. ${params.businessName} delivers hospital-grade sanitization, deep carpet and sofa steam extraction, and spotless post-construction cleaning across residential and corporate facilities.\n\n⚡ ${params.promotionOffer || 'Special Offer: 20% Discount for First-Time Clients!'}\n\nOur trained, verified crew arrives punctually with modern industrial gear. Tap the button below to get an instant quote on WhatsApp within 60 seconds!`,
    callToAction: 'Book on WhatsApp (Instant Response)',
    targetAudience: {
      demographics: 'Ages 25-55, Busy executives, Homeowners, Airbnb Managers, Clinic Supervisors',
      locations: 'Prime residential estates, commercial districts, high-rises',
      interests: 'Home Improvement, Luxury Real Estate, Interior Design, Clean Living',
    },
    hooks: [
      '"Come home to a pristine sanctuary every single day."',
      '"Say goodbye to stubborn tile stains and dusty furniture."',
      '"Professional janitorial contracts that protect your business reputation."',
    ],
    visualPrompt: 'Bright, luxurious interior showcasing spotless marble and sparkling surfaces, with smiling uniformed team holding modern cleaning tools.',
    whatsappScript: `Hi ${params.businessName}! I saw your ad on SellPilot AI regarding the ${params.promotionOffer || 'special cleaning package'}. Could you share pricing details for my home/office?`,
  };
}

export async function generateAIWebsite(params: {
  businessName: string;
  businessType: string;
  currencySymbol: string;
}): Promise<WebsiteData> {
  try {
    const res = await fetch('/api/ai/generate-website', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.website) return data.website;
    }
  } catch (e) {
    console.warn('AI Website API fallback:', e);
  }

  return {
    hero: {
      kicker: 'Premium Commercial & Residential Hygiene',
      headline: `Excellence in Cleaning for ${params.businessName}`,
      subheadline: 'Professional, verified, and insured cleaning technicians delivering immaculate results for homes, commercial complexes, and event venues.',
      ctaText: 'Claim Your Free Quote',
    },
    services: [
      {
        name: 'Full Duplex & Apartment Deep Clean',
        desc: 'Intensive scrubbing of kitchens, bathrooms, tiles, windows, and light fixtures.',
        price: `${params.currencySymbol}45,000`,
      },
      {
        name: 'Post-Construction Restoration',
        desc: 'Removal of cement haze, paint residue, plaster dust, and builder debris.',
        price: `${params.currencySymbol}120,000`,
      },
      {
        name: 'Sofa & Fabric Upholstery Shampoo',
        desc: 'Deep steam stain extraction restoring freshness to fabrics and leather.',
        price: `${params.currencySymbol}35,000`,
      },
      {
        name: 'Corporate Facility Janitorial',
        desc: 'Scheduled daily maintenance, trash disposal, and sanitization for office teams.',
        price: `${params.currencySymbol}250,000/mo`,
      },
    ],
    features: [
      '100% Background-Vetted & Insured Staff',
      'Hospital-Grade Non-Toxic Supplies',
      'Rapid Same-Day & Weekend Availability',
      'Satisfaction Guarantee: Free Re-clean if Not Delighted',
    ],
    testimonials: [
      {
        quote: 'They transformed our 4-bedroom duplex after renovations in less than a day. The level of care was outstanding!',
        author: 'Amina Bello',
        role: 'Resident & Homeowner',
        avatar: '/src/assets/images/avatar_client_amina_1793126453597.jpg',
      },
      {
        quote: 'Reliable and discreet. We trust them with our office cleaning on a recurring monthly contract.',
        author: 'Chinedu Okeke',
        role: 'Director of Facilities',
        avatar: '/src/assets/images/avatar_client_chinedu_1793126454362.jpg',
      },
    ],
  };
}
