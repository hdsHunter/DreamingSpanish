# CORS Issue Fix

If you're getting "NetworkError" or "Failed to fetch" errors, the Dreaming Spanish API is blocking requests from GitHub Pages due to CORS (Cross-Origin Resource Sharing) restrictions.

## Quick Fixes:

### Option 1: Use a CORS Browser Extension (Easiest)
1. Install a CORS extension:
   - Chrome: "CORS Unblock" or "Allow CORS"
   - Firefox: "CORS Everywhere"
2. Enable the extension
3. Refresh the page

### Option 2: Use Local Version
1. Clone/download the repository
2. Run `python server.py` in the web folder
3. Open `http://localhost:8000`
4. This avoids CORS issues

### Option 3: Use Streamlit Version
The Streamlit version (`main.py`) doesn't have CORS issues since it runs on your local machine.

## Why This Happens:
- GitHub Pages hosts your site at `hdshunter.github.io`
- The Dreaming Spanish API is at `app.dreaming.com`
- Browsers block cross-origin requests unless the server explicitly allows them
- The Dreaming Spanish API likely only allows requests from `app.dreaming.com`

## Long-term Solution:
We could create a simple proxy server, but that requires hosting. For now, Option 1 (CORS extension) is the quickest fix for the GitHub Pages version.
