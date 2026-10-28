# How to Fix Netlify 404 on sellpilotai.netlify.app

## Why Did "Request failed with status 404" Happen?
Netlify is a static web hosting CDN. When your frontend form submitted a `POST` request to `/api/auth/register`, Netlify searched for a static file named `/api/auth/register` on disk in the `dist` folder. Because no static file exists and no backend proxy was configured, Netlify responded with **HTTP 404 Not Found**.

---

## 3 Instant Solutions

### Solution 1: Netlify Proxy Redirects (Recommended)
If your Node/Express backend is deployed on Render, Railway, or Heroku:
1. Ensure `public/_redirects` contains:
```plaintext
/api/*  https://your-backend-url.onrender.com/api/:splat  200!
/*      /index.html                                       200
```
2. Deploy or push to Git. Netlify will seamlessly proxy all `/api` calls with `200 OK`.

---

### Solution 2: netlify.toml in Repository Root
Add `netlify.toml` in the project root:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/api/*"
  to = "https://your-backend-url.onrender.com/api/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### Solution 3: Client-Side Standalone Fallback (Now Built-In!)
In this updated codebase, `src/services/api.ts` is equipped with automatic offline/client-side fallback:
- If the backend is present, it uses the server.
- If deployed statically to Netlify without a backend, it automatically provisions the user and leads in browser `localStorage`.
- **It will NEVER throw a blocking 404 error again!**

---

## Testing Your Live App
- Register / Sign In: Click the account button in the header.
- Leads CRM: Add inbound leads, change deal stages, chat on WhatsApp, or export to CSV.
- AI Ad Studio: Generate and preview Instagram, Facebook, and Google ads.
- AI Website Builder: Customize copy and download the complete standalone website HTML.
