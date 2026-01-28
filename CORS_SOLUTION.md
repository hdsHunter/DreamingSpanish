# CORS Solution Guide

The Dreaming Spanish API blocks requests from GitHub Pages due to browser CORS (Cross-Origin Resource Sharing) restrictions.

## Why This Happens

- **Streamlit Cloud**: Runs server-side → No CORS issues ✅
- **GitHub Pages**: Runs in browser → CORS blocks API calls ❌

## Solutions (Pick One)

### 1. CORS Browser Extension (Easiest) ⚡

**Chrome:**
- Install [CORS Unblock](https://chrome.google.com/webstore/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino)
- Or [Allow CORS](https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf)

**Firefox:**
- Install [CORS Everywhere](https://addons.mozilla.org/en-US/firefox/addon/cors-everywhere/)

**Steps:**
1. Install extension
2. Enable it
3. Refresh GitHub Pages site
4. Done! ✅

---

### 2. Deploy Backend Proxy (Best for Production) 🚀

This creates a server-side proxy that bypasses CORS.

#### Option A: Vercel (Recommended - Free)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   cd web/proxy
   vercel
   ```

3. **Follow prompts:**
   - Link to existing project? No
   - Project name? (press enter)
   - Directory? `./api`
   - Deploy? Yes

4. **Copy the URL** (e.g., `https://your-app.vercel.app/api/proxy`)

5. **Add to web app:**
   - Open Settings ⚙️
   - Paste URL in "CORS Proxy URL"
   - Click "Save Proxy URL"
   - Refresh data

#### Option B: Netlify (Free)

1. **Install Netlify CLI:**
   ```bash
   npm i -g netlify-cli
   ```

2. **Create `netlify/functions/proxy.js`** (copy from `web/proxy/api/proxy.js`)

3. **Deploy:**
   ```bash
   cd web/proxy
   netlify deploy --prod
   ```

4. **Add URL to Settings** (same as Vercel)

---

### 3. Run Locally (Works Immediately) 💻

No deployment needed!

1. **Run local server:**
   ```bash
   cd web
   python server.py
   ```

2. **Open browser:**
   ```
   http://localhost:8000
   ```

3. **No CORS issues!** ✅

---

### 4. Use Streamlit Version (No CORS) 🐍

The Streamlit app runs server-side, so no CORS issues.

```bash
streamlit run main.py
```

---

## Which Solution Should I Use?

- **Quick test?** → Browser extension
- **Production/public site?** → Deploy proxy to Vercel
- **Local development?** → Run `python server.py`
- **Already using Streamlit?** → Keep using it!

---

## Troubleshooting

**Proxy returns 400 error:**
- Check that URL ends with `/api/proxy` (Vercel) or `/api` (Netlify)
- Ensure token is valid

**Still getting CORS errors:**
- Clear browser cache
- Check browser console for errors
- Verify proxy URL is correct in Settings

**Proxy not working:**
- Check Vercel/Netlify logs
- Verify function is deployed
- Test proxy URL directly in browser
