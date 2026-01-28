# CORS Proxy for Dreaming Spanish API

This proxy solves the CORS issue by making API requests server-side.

## Quick Deploy to Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to this folder: `cd web/proxy`
3. Deploy: `vercel`
4. Copy the deployment URL (e.g., `https://your-app.vercel.app`)
5. Update `web/api.js` to use your proxy URL

## Quick Deploy to Netlify

1. Install Netlify CLI: `npm i -g netlify-cli`
2. Navigate to this folder: `cd web/proxy`
3. Deploy: `netlify deploy --prod`
4. Copy the deployment URL
5. Update `web/api.js` to use your proxy URL

## Manual Setup

### Vercel
- Create account at vercel.com
- Import this folder as a new project
- Vercel will auto-detect and deploy

### Netlify
- Create account at netlify.com
- Drag and drop this folder
- Or use Netlify CLI: `netlify deploy --prod`

## Update Your Web App

After deploying, update `web/api.js` to use your proxy:

```javascript
this.proxyUrl = 'https://your-proxy-url.vercel.app/api';
```
