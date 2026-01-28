# Dreaming Spanish Stats - Web Version

A standalone web application for tracking your Dreaming Spanish learning progress. Built with vanilla JavaScript and D3.js - no backend required!

**🌐 Live Demo**: [View on GitHub Pages](https://yourusername.github.io/dreaming-spanish-stats)

## Features

- 📊 **Today's Progress** - See how much you've watched today vs your daily goal
- 📈 **Cumulative Progress Chart** - Track your learning journey over time
- 📏 **Video Duration Distribution** - See what length videos you prefer
- 📚 **Content Level Breakdown** - Visualize your level distribution
- 🔮 **Milestone Predictions** - See when you'll reach each level
- 🗓️ **Activity Heatmap** - GitHub-style activity visualization
- 💡 **Daily Facts** - Learn something new about Spanish-speaking countries each day

## Quick Start

### Option 1: Use GitHub Pages (Recommended)

1. **Deploy to GitHub Pages** - See [DEPLOY.md](./DEPLOY.md) for instructions
2. Visit your deployed site
3. Enter your Dreaming Spanish Bearer Token
4. Bookmark it!

### Option 2: Local Development

```bash
# Using Python
cd web
python server.py

# Or using Node.js
npx http-server -p 8000

# Then open http://localhost:8000
```

### Option 3: Open Directly

Just open `index.html` in your browser (may have CORS limitations).

## Getting Your Bearer Token

1. Log into [dreamingspanish.com](https://dreamingspanish.com)
2. Open browser DevTools (F12)
3. Go to the **Network** tab
4. Refresh the page
5. Look for API requests (usually to `.netlify/functions/user`)
6. Click on the request and find the **Authorization** header
7. Copy the Bearer token (starts with `eyJ...`)

**⚠️ Security Note:** Your token is stored locally in your browser's localStorage. Never share your token or commit it to version control.

## Usage

1. **First Time**: Enter your Bearer Token and click "Save & Load"
2. **Subsequent Visits**: Your token is saved automatically - just refresh the page
3. **Refresh Data**: Click the refresh button or reload the page
4. **Settings**: Click the settings button to update your daily goal or change your token

## File Structure

```
web/
├── index.html          # Main HTML structure
├── styles.css          # All styling
├── api.js              # API client for Dreaming Spanish
├── data-processor.js   # Data processing utilities
├── charts.js           # D3.js chart rendering
├── app.js              # Main application logic
├── server.py           # Local development server
├── README.md           # This file
└── DEPLOY.md           # Deployment instructions
```

## Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ Internet Explorer (not supported)

## Differences from Streamlit Version

- ✅ No Python/Streamlit required - pure web app
- ✅ Can be hosted anywhere (GitHub Pages, Netlify, etc.)
- ✅ Faster loading (no server needed)
- ✅ Works offline after initial load
- ⚠️ Some advanced features may be simplified
- ⚠️ Requires manual refresh (no auto-update)

## Contributing

Feel free to improve this! Some ideas:
- Add more chart types
- Improve mobile responsiveness
- Add export functionality
- Add more statistics
- Improve error handling

## License

Free to use and modify as you wish!

## Credits

Inspired by [HarryPeach/dreamingspanishstats](https://github.com/HarryPeach/dreamingspanishstats)
