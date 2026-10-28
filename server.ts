import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface UserProfile {
  id: string;
  fullName: string;
  businessName: string;
  businessType: string;
  currency: string;
  currencySymbol: string;
  email: string;
  createdAt: string;
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  serviceNeeded: string;
  stage: 'new' | 'contacted' | 'quote_sent' | 'won' | 'lost';
  value: number;
  source: string;
  notes: string;
  date: string;
}

// In-memory persistent database for the applet session
const users: Map<string, UserProfile & { passwordHash: string }> = new Map();

// Seed initial profile matching the user's screenshot
const defaultUserId = 'usr_emmanuel_101';
users.set('emmanuelochuru09@gmail.com', {
  id: defaultUserId,
  fullName: 'Emmanuel Ochuru',
  businessName: 'Emeka Cleaning & Facility Services',
  businessType: 'Cleaning Services',
  currency: 'NGN',
  currencySymbol: '₦',
  email: 'emmanuelochuru09@gmail.com',
  passwordHash: 'secret_demo_hash',
  createdAt: new Date().toISOString(),
});

let leads: Lead[] = [
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

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // CORS and pre-flight handling
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Health and Netlify status check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      serverTime: new Date().toISOString(),
      uptime: process.uptime(),
      message: 'SellPilot AI API is online and responding with 200 OK.',
      env: process.env.NODE_ENV || 'development',
    });
  });

  // Netlify Configuration Diagnostic API
  app.post('/api/diagnostics/netlify', (req, res) => {
    const { netlifySiteUrl = 'https://sellpilotai.netlify.app', backendUrl = 'https://your-backend-api.onrender.com' } = req.body;
    
    const sampleRedirects = `# SellPilot AI Netlify Redirects Rule
# Place this file at: public/_redirects (for Vite/React)
# Or at the root of your publish directory

# 1. Forward all API calls to your live backend server with status 200 (proxying)
/api/*  ${backendUrl}/api/:splat  200!

# 2. Single Page App rewrite rule (ensures client-side routes don't 404 on refresh)
/*      /index.html               200
`;

    const sampleNetlifyToml = `# Place this file in the root of your repository: netlify.toml

[build]
  command = "npm run build"
  publish = "dist"

# Proxy all API requests to the backend server to avoid 404
[[redirects]]
  from = "/api/*"
  to = "${backendUrl}/api/:splat"
  status = 200
  force = true

# Fallback for Single Page React App routing
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`;

    res.json({
      siteUrl: netlifySiteUrl,
      backendUrl,
      whyItFailed: 'Netlify is a static hosting platform. When your frontend requested /api/auth/register, Netlify tried to find a static file /api/auth/register in your build output folder (dist). Because no static file or redirect proxy exists, Netlify returned HTTP 404 Not Found.',
      redirectsContent: sampleRedirects,
      tomlContent: sampleNetlifyToml,
    });
  });

  // Auth: Register
  app.post('/api/auth/register', (req, res) => {
    const { fullName, businessName, businessType, currency, email, password } = req.body;

    if (!email || !password || !businessName) {
      return res.status(400).json({
        success: false,
        error: 'Full name, business name, email, and password are required.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let symbol = '₦';
    if (currency === 'USD') symbol = '$';
    else if (currency === 'EUR') symbol = '€';
    else if (currency === 'GBP') symbol = '£';
    else if (currency === 'KES') symbol = 'KSh';
    else if (currency === 'GHS') symbol = 'GH₵';
    else if (currency === 'CAD') symbol = 'C$';
    else if (currency === 'ZAR') symbol = 'R';

    const newUser: UserProfile & { passwordHash: string } = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      fullName: (fullName || '').trim() || 'Business Owner',
      businessName: (businessName || '').trim() || 'My Business',
      businessType: businessType || 'General Services',
      currency: currency || 'NGN',
      currencySymbol: symbol,
      email: normalizedEmail,
      passwordHash: 'hashed_' + (password || 'default'),
      createdAt: new Date().toISOString(),
    };

    users.set(normalizedEmail, newUser);

    const token = `sp_tok_${Buffer.from(newUser.id).toString('base64')}_${Date.now()}`;

    // Return sanitized profile (without password hash)
    const { passwordHash, ...safeProfile } = newUser;
    return res.status(201).json({
      success: true,
      message: 'Business account created successfully!',
      user: safeProfile,
      token,
    });
  });

  // Auth: Login
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = users.get(normalizedEmail);

    if (existing) {
      const { passwordHash, ...safeProfile } = existing;
      const token = `sp_tok_${Buffer.from(existing.id).toString('base64')}_${Date.now()}`;
      return res.json({
        success: true,
        user: safeProfile,
        token,
      });
    }

    // Auto-create account for any new email without hardcoding
    const namePart = normalizedEmail.split('@')[0].replace(/[._-]/g, ' ');
    const formattedName = namePart
      .split(' ')
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const fallbackProfile: UserProfile = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      fullName: formattedName || 'Business Owner',
      businessName: `${formattedName || 'My'} Enterprises`,
      businessType: 'General Services',
      currency: 'NGN',
      currencySymbol: '₦',
      email: normalizedEmail,
      createdAt: new Date().toISOString(),
    };

    users.set(normalizedEmail, { ...fallbackProfile, passwordHash: 'demo' });
    const token = `sp_tok_demo_${Date.now()}`;
    return res.json({
      success: true,
      user: fallbackProfile,
      token,
    });
  });

  // Get current user profile
  app.get('/api/auth/me', (req, res) => {
    const authHeader = req.headers.authorization;
    // Return default or first user
    const firstUser = Array.from(users.values())[0];
    if (firstUser) {
      const { passwordHash, ...safeProfile } = firstUser;
      return res.json({ user: safeProfile });
    }
    return res.status(404).json({ error: 'User not found' });
  });

  // Leads CRUD
  app.get('/api/leads', (req, res) => {
    res.json({ leads });
  });

  app.post('/api/leads', (req, res) => {
    const { name, phone, email, serviceNeeded, stage = 'new', value = 0, source = 'Direct', notes = '' } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: 'Lead name and phone number are required.' });
    }

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name,
      phone,
      email: email || '',
      serviceNeeded: serviceNeeded || 'General Inquiry',
      stage,
      value: Number(value) || 0,
      source,
      notes,
      date: new Date().toISOString(),
    };

    leads.unshift(newLead);
    res.status(201).json({ success: true, lead: newLead });
  });

  app.put('/api/leads/:id', (req, res) => {
    const { id } = req.params;
    const index = leads.findIndex((l) => l.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    leads[index] = { ...leads[index], ...req.body, id };
    res.json({ success: true, lead: leads[index] });
  });

  app.delete('/api/leads/:id', (req, res) => {
    const { id } = req.params;
    leads = leads.filter((l) => l.id !== id);
    res.json({ success: true, message: 'Lead deleted successfully' });
  });

  // AI Ad Generation Endpoint
  app.post('/api/ai/generate-ad', async (req, res) => {
    const { businessName, businessType, targetGoal, promotionOffer, platform, currencySymbol = '₦' } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const prompt = `You are a world-class performance marketing copywriter for small and medium businesses.
Create high-converting ad copy for this business:
- Business Name: ${businessName || 'Emeka Cleaning Services'}
- Business Type / Industry: ${businessType || 'Cleaning Services'}
- Objective: ${targetGoal || 'Generate high-quality client leads & WhatsApp inquiries'}
- Special Offer / Hook: ${promotionOffer || '20% off deep cleaning this month'}
- Target Platform: ${platform || 'Instagram & Facebook Ads'}
- Local Currency Symbol: ${currencySymbol}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                headline: {
                  type: Type.STRING,
                  description: 'Punchy high-converting headline',
                },
                primaryText: {
                  type: Type.STRING,
                  description: 'Persuasive 2-3 paragraph ad body with clear pain point, solution, social proof, and call to action',
                },
                callToAction: {
                  type: Type.STRING,
                  description: 'Action-oriented call to action (e.g. Book on WhatsApp or Get Free Quote)',
                },
                targetAudience: {
                  type: Type.OBJECT,
                  properties: {
                    demographics: { type: Type.STRING },
                    locations: { type: Type.STRING },
                    interests: { type: Type.STRING },
                  },
                  required: ['demographics', 'locations', 'interests'],
                },
                hooks: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Three high-converting angle hooks',
                },
                visualPrompt: {
                  type: Type.STRING,
                  description: 'Detailed visual creative description for photo/video ad',
                },
                whatsappScript: {
                  type: Type.STRING,
                  description: 'Pre-filled WhatsApp message customer sends when clicking the ad',
                },
              },
              required: [
                'headline',
                'primaryText',
                'callToAction',
                'targetAudience',
                'hooks',
                'visualPrompt',
                'whatsappScript',
              ],
            },
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          return res.json({ success: true, ad: parsed });
        }
      } catch (err: any) {
        console.warn('Gemini API call failed, falling back to curated ad engine:', err?.message);
      }
    }

    // Curated high-performing fallback ad template
    const curatedAd = {
      headline: `✨ Tired of Dusty Spaces? Let ${businessName || 'Emeka Cleaning'} Make Your Home & Office Sparkle!`,
      primaryText: `Life in the city is hectic enough without spending your weekends scrubbing tiles, washing sofas, or stressing over post-construction dust.\n\nAt ${businessName || 'Emeka Cleaning Services'}, our vetted, insured professionals deliver thorough deep-cleaning for homes, duplexes, and commercial workspaces. We use hospital-grade disinfectants, powerful steam extraction for rugs and upholstery, and meticulous attention to every corner.\n\n🔥 Limited Time Promo: Book this week and enjoy ${promotionOffer || '20% discount on entire deep-cleaning packages'}! Free instant quote in 60 seconds on WhatsApp.`,
      callToAction: 'Claim Discount on WhatsApp',
      targetAudience: {
        demographics: 'Ages 26-58, Working professionals, busy parents, property managers, tenants moving in/out',
        locations: 'Major metropolitan hubs, residential estates, high-rise apartments, corporate corridors',
        interests: 'Home decor, residential living, Airbnb hosts, office administration, wellness & hygiene',
      },
      hooks: [
        `"Come home to a spotless sanctuary without lifting a single finger."`,
        `"Don't let dirty rugs or post-construction dust ruin your new home."`,
        `"Professional janitorial care that keeps your office clients impressed daily."`,
      ],
      visualPrompt: 'Bright, airy living room with gleaming hardwood floors, freshly steamed fabric sofa, and an Emeka Cleaning specialist smiling in clean branded uniform holding eco-friendly cleaning kit.',
      whatsappScript: `Hello ${businessName || 'Emeka Cleaning'}! I saw your ${promotionOffer || '20% off promotion'} on SellPilot AI. I would love a quick quote for my home/office.`,
    };

    return res.json({ success: true, ad: curatedAd });
  });

  // AI Website Landing Page Generator Endpoint
  app.post('/api/ai/generate-website', async (req, res) => {
    const { businessName, businessType, currencySymbol = '₦' } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const prompt = `Generate a high-converting website landing page structure for:
- Business Name: ${businessName || 'Emeka Cleaning Services'}
- Industry: ${businessType || 'Cleaning Services'}
- Currency Symbol: ${currencySymbol}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                hero: {
                  type: Type.OBJECT,
                  properties: {
                    kicker: { type: Type.STRING },
                    headline: { type: Type.STRING },
                    subheadline: { type: Type.STRING },
                    ctaText: { type: Type.STRING },
                  },
                  required: ['kicker', 'headline', 'subheadline', 'ctaText'],
                },
                services: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      desc: { type: Type.STRING },
                      price: { type: Type.STRING },
                    },
                    required: ['name', 'desc', 'price'],
                  },
                },
                features: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                testimonials: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      quote: { type: Type.STRING },
                      author: { type: Type.STRING },
                      role: { type: Type.STRING },
                    },
                    required: ['quote', 'author', 'role'],
                  },
                },
              },
              required: ['hero', 'services', 'features', 'testimonials'],
            },
          },
        });

        if (response.text) {
          return res.json({ success: true, website: JSON.parse(response.text) });
        }
      } catch (err: any) {
        console.warn('Gemini website generation fallback:', err?.message);
      }
    }

    const defaultWebsite = {
      hero: {
        kicker: 'Trusted & Insured Facility Experts',
        headline: `Impeccable Cleaning for ${businessName || 'Your Business'} Spaces`,
        subheadline: 'Book experienced, background-checked cleaning teams for your home, commercial office, or new property with instant confirmation.',
        ctaText: 'Get Instant Quote',
      },
      services: [
        {
          name: 'Residential Deep Cleaning',
          desc: 'Comprehensive floor scrubbing, kitchen degreasing, bathroom descaling, and high-dusting.',
          price: `${currencySymbol}45,000`,
        },
        {
          name: 'Post-Construction & Move-In',
          desc: 'Industrial-grade extraction of fine cement dust, paint splatters, and builder residue.',
          price: `${currencySymbol}120,000`,
        },
        {
          name: 'Sofa & Carpet Steam Wash',
          desc: 'Hot-water extraction that removes deep stains, allergens, and odors from fabrics.',
          price: `${currencySymbol}35,000`,
        },
        {
          name: 'Corporate Office Maintenance',
          desc: 'Daily or weekly janitorial scheduling with dedicated supervisors and premium hygiene supplies.',
          price: `${currencySymbol}280,000/mo`,
        },
      ],
      features: [
        'Verified & Rigorously Trained Cleaners',
        'Hospital-Grade Non-Toxic Supplies',
        'Same-Day & Weekend Scheduling',
        '100% Satisfaction or Free Re-Clean Guarantee',
      ],
      testimonials: [
        {
          quote: 'The team arrived on time with industrial equipment and left our 5-bedroom home looking like a 5-star hotel!',
          author: 'Amina Bello',
          role: 'Victoria Island Resident',
        },
        {
          quote: 'Our tech firm signed a contract with them last month. The quality and punctuality have been outstanding.',
          author: 'Chinedu Okeke',
          role: 'Head of People, Fintech Hub',
        },
      ],
    };

    return res.json({ success: true, website: defaultWebsite });
  });

  // Mount Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SellPilot AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start SellPilot server:', err);
  process.exit(1);
});
