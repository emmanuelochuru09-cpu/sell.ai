import React, { useState } from 'react';
import { UserProfile, WebsiteData, Lead } from '../types';
import { generateAIWebsite, createLead } from '../services/api';
import {
  Sparkles,
  Download,
  Copy,
  Check,
  CheckCircle2,
  Phone,
  MessageCircle,
  Shield,
  Star,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface AIWebsiteBuilderProps {
  currentUser: UserProfile;
  onNewLeadCreated: (lead: Lead) => void;
}

export const AIWebsiteBuilder: React.FC<AIWebsiteBuilderProps> = ({
  currentUser,
  onNewLeadCreated,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientService, setClientService] = useState('Full Duplex & Apartment Deep Clean');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [websiteData, setWebsiteData] = useState<WebsiteData>({
    hero: {
      kicker: 'Trusted & Insured Facility Cleaning Specialists',
      headline: `Spotless Living & Office Spaces with ${currentUser.businessName}`,
      subheadline: 'Book experienced, verified cleaning technicians equipped with hospital-grade sanitization gear. Transparent pricing, rapid dispatch, and 100% satisfaction guarantee.',
      ctaText: 'Claim Your Free Quote',
    },
    services: [
      {
        name: 'Full Duplex & Apartment Deep Clean',
        desc: 'Intensive scrubbing of kitchens, bathrooms, tiles, windows, and light fixtures.',
        price: `${currentUser.currencySymbol}45,000`,
      },
      {
        name: 'Post-Construction & Move-In',
        desc: 'Industrial-grade extraction of fine cement dust, paint splatters, and builder residue.',
        price: `${currentUser.currencySymbol}120,000`,
      },
      {
        name: 'Sofa & Fabric Upholstery Shampoo',
        desc: 'Deep steam stain extraction restoring freshness to fabrics and leather.',
        price: `${currentUser.currencySymbol}35,000`,
      },
      {
        name: 'Corporate Facility Janitorial',
        desc: 'Scheduled daily maintenance, trash disposal, and sanitization for office teams.',
        price: `${currentUser.currencySymbol}250,000/mo`,
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
  });

  const handleRegenerate = async () => {
    setIsGenerating(true);
    try {
      const generated = await generateAIWebsite({
        businessName: currentUser.businessName,
        businessType: currentUser.businessType,
        currencySymbol: currentUser.currencySymbol,
      });
      setWebsiteData(generated);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) return;

    let estimatedVal = 45000;
    if (clientService.includes('120,000')) estimatedVal = 120000;
    else if (clientService.includes('35,000')) estimatedVal = 35000;
    else if (clientService.includes('250,000')) estimatedVal = 250000;

    const newLead = await createLead({
      name: clientName,
      phone: clientPhone,
      serviceNeeded: clientService,
      value: estimatedVal,
      source: 'AI Landing Page Form',
      notes: `Inquiry submitted via ${currentUser.businessName} Website preview.`,
      stage: 'new',
    });

    onNewLeadCreated(newLead);
    setBookingSuccess(true);
    setClientName('');
    setClientPhone('');
    setTimeout(() => setBookingSuccess(false), 4000);
  };

  const [isEditing, setIsEditing] = useState(false);

  const generateStaticHtml = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${currentUser.businessName} - Professional Services</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 font-sans antialiased">
  <!-- Header -->
  <header class="border-b border-slate-800 bg-slate-950/90 sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">SP</div>
        <span class="text-lg font-bold text-white">${currentUser.businessName}</span>
      </div>
      <a href="#quote-form" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white transition">Book Consultation</a>
    </div>
  </header>

  <!-- Hero -->
  <main class="max-w-6xl mx-auto px-6 py-16 space-y-20">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div class="space-y-6">
        <div class="text-xs font-bold text-indigo-400 tracking-wider uppercase">${websiteData.hero.kicker}</div>
        <h1 class="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">${websiteData.hero.headline}</h1>
        <p class="text-slate-300 text-base leading-relaxed">${websiteData.hero.subheadline}</p>
        <div class="flex items-center gap-4 pt-2">
          <a href="#quote-form" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-indigo-600/30">${websiteData.hero.ctaText}</a>
          <a href="https://wa.me/2348031234567" class="px-5 py-3 bg-slate-900 border border-slate-800 text-slate-200 font-semibold rounded-xl text-sm hover:bg-slate-800 transition">Chat on WhatsApp</a>
        </div>
      </div>
      <div class="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80" alt="Spotless Property" class="w-full h-80 object-cover" />
      </div>
    </div>

    <!-- Features -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-slate-800">
      ${websiteData.features.map(f => `<div class="text-xs text-slate-200 font-medium">✓ ${f}</div>`).join('\n      ')}
    </div>

    <!-- Services -->
    <div class="space-y-8">
      <h2 class="text-2xl font-bold text-white text-center">Service Packages</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${websiteData.services.map(s => `
        <div class="p-6 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-start">
          <div>
            <h3 class="font-bold text-white text-base">${s.name}</h3>
            <p class="text-xs text-slate-400 mt-1">${s.desc}</p>
          </div>
          <span class="text-sm font-bold text-indigo-400 font-mono shrink-0 ml-4">${s.price}</span>
        </div>`).join('')}
      </div>
    </div>

    <!-- Quote Form -->
    <div id="quote-form" class="bg-slate-900 border border-indigo-900/60 rounded-2xl p-8 max-w-xl mx-auto space-y-4">
      <h3 class="text-xl font-bold text-white">Request an Instant Quote</h3>
      <p class="text-xs text-slate-400">We will respond within 15 minutes on WhatsApp or phone.</p>
      <form onsubmit="event.preventDefault(); alert('Inquiry sent! We will contact you shortly.');" class="space-y-3">
        <input type="text" required placeholder="Your Name" class="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white" />
        <input type="tel" required placeholder="Phone / WhatsApp Number" class="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white" />
        <button type="submit" class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 font-semibold text-white rounded-xl text-xs">Submit Request</button>
      </form>
    </div>
  </main>

  <footer class="border-t border-slate-900 py-8 text-center text-xs text-slate-500">
    © ${new Date().getFullYear()} ${currentUser.businessName}. All rights reserved. Powered by SellPilot AI.
  </footer>
</body>
</html>`;
  };

  const handleDownloadHtml = () => {
    const html = generateStaticHtml();
    const element = document.createElement('a');
    const file = new Blob([html], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `${currentUser.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-website.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>AI Website Builder</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Fully responsive, high-converting customer landing page built for {currentUser.businessName}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white rounded-lg transition"
          >
            {isEditing ? 'Close Editor' : 'Customize Text & Prices'}
          </button>
          <button
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isGenerating ? 'Regenerating...' : 'AI Re-Generate'}</span>
          </button>
          <button
            onClick={handleDownloadHtml}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition shadow-sm flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Website HTML</span>
          </button>
        </div>
      </div>

      {/* Inline Editor Drawer when toggled */}
      {isEditing && (
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Live Website Customizer
            </h3>
            <span className="text-[11px] text-slate-400">Edits reflect immediately in the preview below and exported HTML</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Headline</label>
              <input
                type="text"
                value={websiteData.hero.headline}
                onChange={(e) => setWebsiteData({ ...websiteData, hero: { ...websiteData.hero, headline: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Subheadline</label>
              <input
                type="text"
                value={websiteData.hero.subheadline}
                onChange={(e) => setWebsiteData({ ...websiteData, hero: { ...websiteData.hero, subheadline: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Website Live Container */}
      <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950 shadow-2xl">
        {/* Browser Mockup Chrome */}
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <div className="bg-slate-950 px-4 py-1 rounded-md text-[11px] font-mono text-slate-400 border border-slate-800 w-96 text-center truncate">
            https://{currentUser.businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.sellpilot.page
          </div>
          <div className="text-[11px] text-slate-500 font-mono">Live Customer View</div>
        </div>

        {/* Website Content */}
        <div className="p-6 sm:p-12 space-y-16 max-w-5xl mx-auto">
          {/* Landing Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                SP
              </div>
              <span className="font-bold text-white text-lg tracking-tight">
                {currentUser.businessName}
              </span>
            </div>

            <a
              href="#quote-form"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition shadow-md"
            >
              Get Free Quote
            </a>
          </div>

          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="text-xs font-bold text-indigo-400 tracking-wider uppercase">
                {websiteData.hero.kicker}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {websiteData.hero.headline}
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                {websiteData.hero.subheadline}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#quote-form"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                >
                  <span>{websiteData.hero.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href={`https://wa.me/2348031234567?text=Hello%20${encodeURIComponent(
                    currentUser.businessName
                  )},%20I%20would%20like%20to%20inquire%20about%20your%20services.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold rounded-xl text-sm transition flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Direct WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-900">
              <img
                src="/src/assets/images/hero_cleaning_service_1793126453368.jpg"
                alt="Luxury spotless interior"
                referrerPolicy="no-referrer"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>

          {/* Features Strip (Zero-Pill clean typography) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-slate-800/80">
            {websiteData.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="font-medium leading-snug">{feature}</span>
              </div>
            ))}
          </div>

          {/* Services & Pricing Packages */}
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Our Transparent Service Packages
              </h2>
              <p className="text-xs text-slate-400">
                No hidden charges. Verified technicians, guaranteed excellence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {websiteData.services.map((svc, i) => (
                <div
                  key={i}
                  className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3 hover:border-slate-700 transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-white text-sm">{svc.name}</h3>
                      <p className="text-xs text-slate-400 mt-1">{svc.desc}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-bold text-indigo-400 font-mono tabular-nums">
                        {svc.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white tracking-tight text-center">
              What Our Clients Say
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {websiteData.testimonials.map((test, i) => (
                <div
                  key={i}
                  className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4"
                >
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    "{test.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    {test.avatar && (
                      <img
                        src={test.avatar}
                        alt={test.author}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border border-slate-700"
                      />
                    )}
                    <div>
                      <div className="text-xs font-semibold text-white">{test.author}</div>
                      <div className="text-[11px] text-slate-400">{test.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Inbound Lead Capture Form */}
          <div id="quote-form" className="bg-slate-900 border border-indigo-900/60 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="max-w-md">
              <h3 className="text-xl font-bold text-white tracking-tight">
                Request an Instant Quote
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Fill in your details below. Your request immediately routes into {currentUser.businessName}'s CRM!
              </p>
            </div>

            {bookingSuccess && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-lg text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Thank you! Your quote request has been sent and logged directly in your SellPilot Leads CRM.</span>
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                placeholder="Your Name *"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />

              <input
                type="tel"
                required
                placeholder="Phone Number / WhatsApp *"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />

              <select
                value={clientService}
                onChange={(e) => setClientService(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                {websiteData.services.map((s, i) => (
                  <option key={i} value={`${s.name} (${s.price})`}>
                    {s.name} ({s.price})
                  </option>
                ))}
              </select>

              <div className="sm:col-span-3">
                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 font-semibold text-white rounded-xl text-xs shadow-lg shadow-indigo-600/30 transition"
                >
                  Submit Quote Request
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
