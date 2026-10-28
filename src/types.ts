export interface UserProfile {
  id: string;
  fullName: string;
  businessName: string;
  businessType: string;
  currency: string;
  currencySymbol: string;
  email: string;
  createdAt: string;
}

export type LeadStage = 'new' | 'contacted' | 'quote_sent' | 'won' | 'lost';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  serviceNeeded: string;
  stage: LeadStage;
  value: number;
  source: string;
  notes: string;
  date: string;
}

export interface AdCreative {
  headline: string;
  primaryText: string;
  callToAction: string;
  targetAudience: {
    demographics: string;
    locations: string;
    interests: string;
  };
  hooks: string[];
  visualPrompt: string;
  whatsappScript: string;
}

export interface ServiceTier {
  name: string;
  desc: string;
  price: string;
}

export interface WebsiteData {
  hero: {
    kicker: string;
    headline: string;
    subheadline: string;
    ctaText: string;
  };
  services: ServiceTier[];
  features: string[];
  testimonials: {
    quote: string;
    author: string;
    role: string;
    avatar?: string;
  }[];
}
