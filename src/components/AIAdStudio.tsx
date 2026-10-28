import React, { useState } from 'react';
import { UserProfile, AdCreative } from '../types';
import { generateAIAd } from '../services/api';
import {
  Sparkles,
  Copy,
  Check,
  Instagram,
  Facebook,
  Search,
  MessageCircle,
  Target,
  Send,
  Eye,
} from 'lucide-react';

interface AIAdStudioProps {
  currentUser: UserProfile;
}

export const AIAdStudio: React.FC<AIAdStudioProps> = ({ currentUser }) => {
  const [platform, setPlatform] = useState<'instagram' | 'facebook' | 'google'>('instagram');
  const [targetGoal, setTargetGoal] = useState('Generate WhatsApp Inquiries & Same-Week Bookings');
  const [promotionOffer, setPromotionOffer] = useState('20% Discount for First-Time Clients + Free Sanitization');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [currentAd, setCurrentAd] = useState<AdCreative>({
    headline: `✨ Tired of Dusty Spaces? Let ${currentUser.businessName} Make Your Space Sparkle!`,
    primaryText: `Life in the city is hectic enough without spending your valuable weekends scrubbing bathroom tiles or cleaning dusty upholstery.\n\nAt ${currentUser.businessName}, our background-vetted, insured cleaning specialists deliver spotless deep cleaning for homes, duplexes, and commercial facilities. We use hospital-grade disinfectants, deep steam shampoo for rugs and sofas, and uncompromising attention to detail.\n\n🔥 Limited-Time Offer: Book this week and enjoy ${promotionOffer}! Get an instant free quote in 60 seconds on WhatsApp.`,
    callToAction: 'Book on WhatsApp (Instant Response)',
    targetAudience: {
      demographics: 'Ages 25-55, Working professionals, homeowners, facility managers, busy parents',
      locations: 'Major residential estates, executive districts, commercial hubs',
      interests: 'Home decor, residential living, interior design, office facilities',
    },
    hooks: [
      '"Come home to a pristine sanctuary without lifting a finger."',
      '"Don\'t let dirty rugs or post-construction dust ruin your property."',
      '"Professional facility janitorial contracts that protect your company brand."',
    ],
    visualPrompt: 'Bright, luxurious interior showcasing spotless marble and sparkling surfaces, with smiling uniformed team holding modern cleaning tools.',
    whatsappScript: `Hi ${currentUser.businessName}! I saw your ad on SellPilot AI regarding the ${promotionOffer}. Could you share pricing details for my home/office?`,
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const generated = await generateAIAd({
        businessName: currentUser.businessName,
        businessType: currentUser.businessType,
        targetGoal,
        promotionOffer,
        platform,
        currencySymbol: currentUser.currencySymbol,
      });
      setCurrentAd(generated);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>AI Ad Studio</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate high-converting performance ads tailored to {currentUser.businessName} and test ad previews.
          </p>
        </div>

        {/* Platform tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setPlatform('instagram')}
            className={`px-3 py-1.5 font-medium rounded-md transition flex items-center gap-1.5 ${
              platform === 'instagram' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>Instagram Feed</span>
          </button>
          <button
            onClick={() => setPlatform('facebook')}
            className={`px-3 py-1.5 font-medium rounded-md transition flex items-center gap-1.5 ${
              platform === 'facebook' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Facebook className="w-3.5 h-3.5" />
            <span>Facebook Post</span>
          </button>
          <button
            onClick={() => setPlatform('google')}
            className={`px-3 py-1.5 font-medium rounded-md transition flex items-center gap-1.5 ${
              platform === 'google' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Google Search</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleGenerate} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Campaign Parameters
            </h2>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Campaign Goal
              </label>
              <input
                type="text"
                value={targetGoal}
                onChange={(e) => setTargetGoal(e.target.value)}
                placeholder="e.g. Generate high-intent WhatsApp leads"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Special Offer / Promotional Hook
              </label>
              <input
                type="text"
                value={promotionOffer}
                onChange={(e) => setPromotionOffer(e.target.value)}
                placeholder="e.g. 20% discount on deep cleaning"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Ad Headline (Editable)
                </label>
                <input
                  type="text"
                  value={currentAd.headline}
                  onChange={(e) => setCurrentAd({ ...currentAd, headline: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Ad Primary Body Text (Editable)
                </label>
                <textarea
                  rows={4}
                  value={currentAd.primaryText}
                  onChange={(e) => setCurrentAd({ ...currentAd, primaryText: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating Optimized Creative...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Regenerate Ad with AI</span>
                </>
              )}
            </button>
          </form>

          {/* Audience & Angles Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
            <h3 className="font-semibold text-white flex items-center gap-1.5">
              <Target className="w-4 h-4 text-indigo-400" />
              <span>Recommended Ad Targeting</span>
            </h3>

            <div className="space-y-2 text-slate-300">
              <div>
                <span className="text-slate-400 block text-[11px]">Demographics:</span>
                <span>{currentAd.targetAudience.demographics}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Locations:</span>
                <span>{currentAd.targetAudience.locations}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Interest Keywords:</span>
                <span>{currentAd.targetAudience.interests}</span>
              </div>
            </div>
          </div>

          {/* Quick Copy Script */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Lead Auto-Response</span>
              </span>
              <button
                onClick={() => copyToClipboard(currentAd.whatsappScript, 'wa')}
                className="text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedKey === 'wa' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'wa' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-300 font-mono text-[11px]">
              {currentAd.whatsappScript}
            </p>
          </div>
        </div>

        {/* Live Mockup Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              <span>Live Social Ad Simulator</span>
            </span>
            <button
              onClick={() => copyToClipboard(`${currentAd.headline}\n\n${currentAd.primaryText}`, 'all')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              {copiedKey === 'all' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'all' ? 'Copied Full Copy!' : 'Copy Ad Copy'}</span>
            </button>
          </div>

          {/* Instagram / Facebook Mockup */}
          {platform === 'instagram' && (
            <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              {/* Profile Bar */}
              <div className="p-3.5 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                    SP
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <span>{currentUser.businessName}</span>
                      <span className="text-[10px] text-slate-400 font-normal">Sponsored</span>
                    </div>
                    <div className="text-[10px] text-slate-400">Verified Business Partner</div>
                  </div>
                </div>
              </div>

              {/* Ad Creative Image */}
              <div className="relative aspect-square w-full bg-slate-950 overflow-hidden">
                <img
                  src="/src/assets/images/ad_creative_cleaning_1793126454092.jpg"
                  alt="High quality cleaning ad creative"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 right-3 p-3 bg-slate-950/85 backdrop-blur-md rounded-xl border border-white/10 text-white flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">{currentAd.headline}</div>
                    <div className="text-[11px] text-indigo-300 font-semibold">{promotionOffer}</div>
                  </div>
                  <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs shrink-0 whitespace-nowrap shadow-md">
                    {currentAd.callToAction}
                  </button>
                </div>
              </div>

              {/* Caption */}
              <div className="p-4 space-y-2 text-xs">
                <div className="text-slate-200 whitespace-pre-line leading-relaxed">
                  <span className="font-bold text-white mr-1.5">{currentUser.businessName}</span>
                  {currentAd.primaryText}
                </div>
                <div className="pt-2 text-[11px] text-indigo-400">
                  #CleaningServices #LagosLiving #OfficeMaintenance #DeepCleaning #HomeCare
                </div>
              </div>
            </div>
          )}

          {platform === 'facebook' && (
            <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                  SP
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{currentUser.businessName}</div>
                  <div className="text-[11px] text-slate-400">Sponsored · Paid for by SellPilot AI</div>
                </div>
              </div>

              <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                {currentAd.primaryText}
              </p>

              <div className="rounded-lg overflow-hidden border border-slate-800">
                <img
                  src="/src/assets/images/hero_cleaning_service_1793126453368.jpg"
                  alt="Service preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-48 object-cover"
                />
                <div className="p-3 bg-slate-950 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-medium">{currentUser.businessType}</div>
                    <div className="text-xs font-bold text-white">{currentAd.headline}</div>
                  </div>
                  <button className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg shrink-0">
                    Send WhatsApp Message
                  </button>
                </div>
              </div>
            </div>
          )}

          {platform === 'google' && (
            <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2.5 shadow-xl">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="font-bold text-white bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">
                  Sponsored
                </span>
                <span>https://www.sellpilotai.com/{currentUser.businessName.toLowerCase().replace(/\s+/g, '-')}</span>
              </div>

              <h3 className="text-base font-semibold text-indigo-400 hover:underline cursor-pointer">
                {currentUser.businessName} | {currentAd.headline}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                Top-rated {currentUser.businessType}. Background-vetted staff, hospital-grade supplies, and 100% satisfaction guarantee. Get a free WhatsApp quote in 60 seconds!
              </p>

              <div className="pt-2 grid grid-cols-2 gap-2 text-xs text-indigo-300 font-medium">
                <div className="hover:underline cursor-pointer">› Book Residential Deep Clean</div>
                <div className="hover:underline cursor-pointer">› Office Janitorial Plans</div>
                <div className="hover:underline cursor-pointer">› Post-Construction Cleaning</div>
                <div className="hover:underline cursor-pointer">› WhatsApp Instant Contact</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
