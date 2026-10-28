import React, { useState, useEffect } from 'react';
import { checkBackendHealth } from '../services/api';
import {
  AlertTriangle,
  CheckCircle,
  Copy,
  Download,
  ExternalLink,
  Server,
  Globe,
  ArrowRight,
  Code2,
  FileCode,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const NetlifyFixer: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [backendUrlInput, setBackendUrlInput] = useState('https://sellpilot-api.onrender.com');
  const [testResult, setTestResult] = useState<{ status: 'idle' | 'testing' | 'success' | 'error'; message: string; details?: any }>({
    status: 'idle',
    message: 'Click below to test connection to your SellPilot AI backend API.',
  });

  const runTest = async () => {
    setTestResult({ status: 'testing', message: 'Pinging /api/health endpoint...' });
    const startTime = performance.now();
    const result = await checkBackendHealth();
    const elapsed = Math.round(performance.now() - startTime);

    if (result.online) {
      setTestResult({
        status: 'success',
        message: `HTTP 200 OK (${elapsed}ms latency) - Backend API is reachable and responding!`,
        details: result.data,
      });
    } else {
      setTestResult({
        status: 'error',
        message: `Connection returned: ${result.message}`,
      });
    }
  };

  useEffect(() => {
    runTest();
  }, []);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const redirectsContent = `# Netlify Redirects Configuration for SellPilot AI
# Place this file at: public/_redirects (inside your React/Vite project)

# 1. Forward all API calls to your hosted backend (Render, Railway, Heroku, etc.)
/api/*  ${backendUrlInput}/api/:splat  200!

# 2. SPA client-side routing fallback (prevents 404 on page refresh)
/*      /index.html                     200
`;

  const tomlContent = `# netlify.toml configuration for SellPilot AI

[build]
  command = "npm run build"
  publish = "dist"

# Proxy /api requests to external backend server
[[redirects]]
  from = "/api/*"
  to = "${backendUrlInput}/api/:splat"
  status = 200
  force = true

# Single Page App routing fallback
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`;

  const downloadFile = (filename: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Issue Summary */}
      <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-red-900/40 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-red-400">
              <AlertTriangle className="w-4 h-4" />
              <span>ISSUE DIAGNOSIS: sellpilotai.netlify.app</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Why "Request failed with status 404" Happens & How to Fix It
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              When creating an account on Netlify, your browser makes a POST request to{' '}
              <code className="text-amber-300 font-mono text-xs bg-slate-950 px-1.5 py-0.5 rounded">/api/auth/register</code>.
              Netlify is a <strong>static web host</strong>. By default, it does not run Node.js/Express server files, so it returns an HTTP 404 Not Found error page.
            </p>
          </div>

          <div className="flex flex-col gap-3 shrink-0">
            <button
              onClick={runTest}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition"
            >
              <Zap className="w-4 h-4" />
              <span>Test API Status Here</span>
            </button>
            <div className="text-[11px] text-slate-400 text-center">
              Our dev server runs full-stack with 200 OK
            </div>
          </div>
        </div>

        {/* Live Diagnostics Card */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            {testResult.status === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : testResult.status === 'testing' ? (
              <span className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span className="text-slate-200 font-medium">{testResult.message}</span>
          </div>

          {testResult.details && (
            <div className="font-mono text-[11px] text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
              Server Time: {new Date(testResult.details.serverTime).toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      {/* Visual Flow Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Broken Netlify State */}
        <div className="bg-slate-900 border border-red-950/80 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
              Current Netlify Setup (Broken)
            </span>
            <span className="text-xs text-red-400 bg-red-950/60 px-2 py-0.5 rounded font-mono">
              Status 404
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">1. Client Clicks "Create Account"</span>
              <span className="text-indigo-400">POST /api/auth/register</span>
            </div>

            <div className="text-center text-slate-500">⬇️</div>

            <div className="p-3 bg-slate-950 rounded-lg border border-red-900/50 flex items-center justify-between">
              <span className="text-slate-300">2. Netlify Static CDN checks /dist</span>
              <span className="text-red-400 font-bold">File Not Found!</span>
            </div>

            <div className="text-center text-slate-500">⬇️</div>

            <div className="p-3 bg-red-950/30 rounded-lg border border-red-800/80 text-red-200">
              ❌ Returns 404 HTML: <span className="italic">"Request failed with status 404"</span>
            </div>
          </div>
        </div>

        {/* Working Architecture */}
        <div className="bg-slate-900 border border-emerald-950/80 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Working Architecture (Fixed)
            </span>
            <span className="text-xs text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded font-mono">
              Status 200 OK
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">1. Client Clicks "Create Account"</span>
              <span className="text-indigo-400">POST /api/auth/register</span>
            </div>

            <div className="text-center text-slate-500">⬇️</div>

            <div className="p-3 bg-slate-950 rounded-lg border border-emerald-900/50 flex items-center justify-between">
              <span className="text-slate-300">2. Netlify Proxy or Render/Backend</span>
              <span className="text-emerald-400 font-bold">Forward via _redirects</span>
            </div>

            <div className="text-center text-slate-500">⬇️</div>

            <div className="p-3 bg-emerald-950/30 rounded-lg border border-emerald-800/80 text-emerald-200">
              ✅ Returns 201 Created: Account registered, JWT issued, user logged in!
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Fix Solutions */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>Choose Your Fix Solution</span>
        </h2>

        {/* Solution 1: Redirects File */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="text-base font-semibold text-white">
                  Method 1 (Recommended): Add <code className="text-indigo-300 text-sm">public/_redirects</code>
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                If your backend is hosted on Render, Railway, or Heroku, tell Netlify to proxy all <code className="text-slate-300">/api/*</code> requests without CORS or 404 errors.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(redirectsContent, 'redirects')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg flex items-center gap-1.5 transition font-medium"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedKey === 'redirects' ? 'Copied!' : 'Copy Code'}</span>
              </button>
              <button
                onClick={() => downloadFile('_redirects', redirectsContent)}
                className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs rounded-lg flex items-center gap-1.5 transition font-medium border border-indigo-500/30"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download _redirects</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <label htmlFor="backendUrl">Your Backend API URL:</label>
              <input
                id="backendUrl"
                type="text"
                value={backendUrlInput}
                onChange={(e) => setBackendUrlInput(e.target.value)}
                placeholder="https://sellpilot-api.onrender.com"
                className="bg-slate-950 border border-slate-800 px-2.5 py-1 rounded text-slate-200 text-xs font-mono w-72 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
              {redirectsContent}
            </pre>
          </div>
        </div>

        {/* Solution 2: netlify.toml */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h3 className="text-base font-semibold text-white">
                  Method 2: Root <code className="text-indigo-300 text-sm">netlify.toml</code> Configuration
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Commit this file to the root of your Git repository. Netlify automatically reads it on build.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(tomlContent, 'toml')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg flex items-center gap-1.5 transition font-medium"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedKey === 'toml' ? 'Copied!' : 'Copy netlify.toml'}</span>
              </button>
              <button
                onClick={() => downloadFile('netlify.toml', tomlContent)}
                className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs rounded-lg flex items-center gap-1.5 transition font-medium border border-indigo-500/30"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download netlify.toml</span>
              </button>
            </div>
          </div>

          <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
            {tomlContent}
          </pre>
        </div>

        {/* Solution 3: Frontend ENV Variable */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h3 className="text-base font-semibold text-white">
              Method 3: Configure <code className="text-indigo-300 text-sm">VITE_API_URL</code> in Netlify Dashboard
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            If your frontend code uses <code className="text-slate-300">import.meta.env.VITE_API_URL</code>, configure the environment variable in Netlify:
          </p>

          <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300">
            <li>Go to <strong className="text-white">Netlify Dashboard</strong> &gt; Select <strong className="text-white">sellpilotai</strong>.</li>
            <li>Click <strong className="text-white">Site configuration</strong> &gt; <strong className="text-white">Environment variables</strong>.</li>
            <li>Add key: <code className="text-indigo-400 font-mono">VITE_API_URL</code> and value: <code className="text-indigo-400 font-mono">{backendUrlInput}</code>.</li>
            <li>Click <strong className="text-white">Trigger Deploy</strong> &gt; <strong className="text-white">Clear cache and deploy site</strong>.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
