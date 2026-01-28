/**
 * Main Application Logic
 */

// Spanish facts (same as Python version)
const SPANISH_FACTS = [
    ["🇲🇽 Mexico", "Mexico City was built on top of the ancient Aztec capital Tenochtitlan, which was founded on an island in Lake Texcoco in 1325."],
    ["🇪🇸 Spain", "Spain has more bars per capita than any other country in the EU - approximately 1 bar for every 175 people!"],
    ["🇦🇷 Argentina", "Argentina is home to the southernmost city in the world - Ushuaia, known as 'El Fin del Mundo' (The End of the World)."],
    ["🇨🇴 Colombia", "Colombia is the only South American country with coastlines on both the Pacific Ocean and the Caribbean Sea."],
    ["🇵🇪 Peru", "Machu Picchu was built without the use of wheels, iron tools, or mortar - yet it has withstood earthquakes for over 500 years."],
    ["🇨🇱 Chile", "Chile is so narrow that no point is more than 110 miles from the Pacific Ocean, yet it stretches 2,653 miles from north to south."],
    ["🇨🇺 Cuba", "Cuba has two currencies: the Cuban Peso (CUP) for locals and the Convertible Peso (CUC) for tourists - though this is changing."],
    ["🇪🇨 Ecuador", "Ecuador is named after the equator, which runs through the country. You can stand in both hemispheres at once!"],
    ["🇻🇪 Venezuela", "Angel Falls in Venezuela is the world's highest uninterrupted waterfall at 3,212 feet - 15 times taller than Niagara Falls."],
    ["🇬🇹 Guatemala", "Guatemala's flag is the only one in the world that features a gun (a rifle) as part of its coat of arms."],
    ["🇧🇴 Bolivia", "Bolivia has 37 official languages - the most of any country in the world."],
    ["🇺🇾 Uruguay", "Uruguay was the first country to legalize recreational cannabis nationwide in 2013."],
    ["🇵🇾 Paraguay", "Paraguay is one of the few countries where more indigenous people speak the native language (Guaraní) than Spanish."],
    ["🇩🇴 Dominican Republic", "The Dominican Republic shares the island of Hispaniola with Haiti - the only divided island in the Caribbean."],
    ["🇭🇳 Honduras", "Honduras is home to the ancient Mayan city of Copán, known for its remarkable stone sculptures and hieroglyphics."],
    ["🇳🇮 Nicaragua", "Nicaragua has two major freshwater lakes: Lake Nicaragua, the largest in Central America, contains freshwater sharks!"],
    ["🇨🇷 Costa Rica", "Costa Rica is one of the few countries with no standing army - it was abolished in 1948."],
    ["🇵🇦 Panama", "The Panama Canal uses a system of locks that raises ships 85 feet above sea level to cross from ocean to ocean."],
    ["🇸🇻 El Salvador", "El Salvador is the smallest and most densely populated country in Central America."],
    ["🇵🇷 Puerto Rico", "Puerto Rico's El Yunque is the only tropical rainforest in the U.S. National Forest System."],
    ["🌎 Spanish", "Spanish is the second most spoken native language in the world with 460 million native speakers."],
    ["🌎 Spanish", "Spanish is the official language of 21 countries across 4 continents."],
    ["🌎 Spanish", "Spanish words that start with 'al-' often come from Arabic, like 'almohada' (pillow) and 'alfombra' (carpet)."],
    ["🌎 Spanish", "The letter 'ñ' was invented in Spain as a shorthand for 'nn' - España was originally 'Espanna'."],
    ["🌎 Spanish", "Spanish is the second most studied language in the world after English."],
];

let appData = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Check if opened via file:// protocol (CORS issues)
    if (window.location.protocol === 'file:') {
        const corsWarning = document.getElementById('cors-warning');
        if (corsWarning) {
            corsWarning.style.display = 'block';
        }
        console.warn('⚠️ File opened directly - CORS errors may occur. Use a local server instead.');
    } else {
        const corsWarning = document.getElementById('cors-warning');
        if (corsWarning) {
            corsWarning.style.display = 'none';
        }
    }

    // Check for saved token and auto-load
    const savedToken = localStorage.getItem('dreamingSpanishToken');
    const tokenSectionEl = document.getElementById('token-section');
    
    if (savedToken) {
        // Hide token section immediately and auto-load
        tokenSectionEl.classList.add('hidden');
        loadData(savedToken);
    } else {
        // Show token section if no token exists
        tokenSectionEl.classList.remove('hidden');
    }

    // Token save button
    document.getElementById('save-token-btn').addEventListener('click', () => {
        const token = document.getElementById('token-input').value.trim();
        if (token) {
            localStorage.setItem('dreamingSpanishToken', token);
            tokenSectionEl.classList.add('hidden');
            loadData(token);
        } else {
            alert('Please enter a valid token');
        }
    });

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            
            // Update buttons
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update panels
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });

    // Refresh button
    document.getElementById('refresh-btn').addEventListener('click', () => {
        const token = localStorage.getItem('dreamingSpanishToken');
        if (token) {
            loadData(token);
        }
    });

    // Settings button
    document.getElementById('settings-btn').addEventListener('click', () => {
        const modal = document.getElementById('settings-modal');
        const savedGoal = localStorage.getItem('dailyGoal') || '240';
        const savedProxy = localStorage.getItem('dreamingSpanishProxyUrl') || '';
        document.getElementById('daily-goal-input').value = savedGoal;
        document.getElementById('proxy-url-input').value = savedProxy;
        modal.classList.remove('hidden');
    });

    // Close settings
    document.getElementById('close-settings-btn').addEventListener('click', () => {
        document.getElementById('settings-modal').classList.add('hidden');
    });

    // Update goal
    document.getElementById('update-goal-btn').addEventListener('click', () => {
        const goal = document.getElementById('daily-goal-input').value;
        localStorage.setItem('dailyGoal', goal);
        if (appData) {
            renderDashboard(appData.stats, appData.todayMinutes, appData.history, appData.dailyData);
        }
        document.getElementById('settings-modal').classList.add('hidden');
    });

    // Save proxy URL
    document.getElementById('save-proxy-btn').addEventListener('click', () => {
        const proxyUrl = document.getElementById('proxy-url-input').value.trim();
        if (proxyUrl) {
            localStorage.setItem('dreamingSpanishProxyUrl', proxyUrl);
            alert('Proxy URL saved! Refresh data to use it.');
        } else {
            localStorage.removeItem('dreamingSpanishProxyUrl');
            alert('Proxy URL cleared. Using direct requests (may fail due to CORS).');
        }
    });

    // Change token
    document.getElementById('change-token-btn').addEventListener('click', () => {
        localStorage.removeItem('dreamingSpanishToken');
        document.getElementById('settings-modal').classList.add('hidden');
        document.getElementById('token-section').classList.remove('hidden');
        document.getElementById('dashboard').classList.add('hidden');
        document.getElementById('header-buttons').classList.add('hidden');
        document.getElementById('token-input').value = '';
    });
});

async function loadData(token) {
    const loadingEl = document.getElementById('loading');
    const dashboardEl = document.getElementById('dashboard');
    const tokenSectionEl = document.getElementById('token-section');

    loadingEl.classList.remove('hidden');
    dashboardEl.classList.add('hidden');
    // Keep token section hidden if we're auto-loading

    try {
        const proxyUrl = localStorage.getItem('dreamingSpanishProxyUrl') || null;
        const api = new DreamingSpanishAPI(token, proxyUrl);
        const rawData = await api.fetchAllData();

        // Process data
        const history = DataProcessor.parseHistory(rawData.history, rawData.videos);
        const dailyData = DataProcessor.createDailySummary(history);
        const stats = DataProcessor.calculateStats(dailyData, history, rawData.total_time.hours);
        const todayMinutes = DataProcessor.calculateTodayHours(history);

        appData = { history, dailyData, stats, rawData, todayMinutes };

        // Render dashboard
        renderDashboard(stats, todayMinutes, history, dailyData);

        loadingEl.classList.add('hidden');
        dashboardEl.classList.remove('hidden');
        document.getElementById('header-buttons').classList.remove('hidden');
    } catch (error) {
        console.error('Error loading data:', error);
        loadingEl.classList.add('hidden');
        
        // Show detailed error message
        const errorMessage = error.message || 'Unknown error occurred';
        const isCorsError = errorMessage === 'CORS_BLOCKED' ||
                           errorMessage.includes('Failed to fetch') || 
                           errorMessage.includes('NetworkError') ||
                           error.name === 'TypeError';
        
        let userMessage = '';
        
        if (isCorsError) {
            userMessage = `
⚠️ CORS Error - API Blocked

The Dreaming Spanish API blocks requests from GitHub Pages (browser security).

🔧 SOLUTIONS (pick one):

1️⃣ CORS Browser Extension (Easiest)
   • Chrome: Install "CORS Unblock" or "Allow CORS"
   • Firefox: Install "CORS Everywhere"
   • Enable extension → Refresh page

2️⃣ Deploy Backend Proxy (Best for Production)
   • Deploy web/proxy/ to Vercel (free)
   • Get URL → Add to Settings → Save
   • See web/proxy/README.md for instructions

3️⃣ Run Locally (Works Immediately)
   • Run: python server.py
   • Open: http://localhost:8000
   • No CORS issues!

4️⃣ Use Streamlit Version
   • Run: streamlit run main.py
   • No CORS issues (server-side)

The Streamlit app works because it runs server-side, not in the browser.
            `.trim();
        } else if (errorMessage.includes('401') || errorMessage.includes('403')) {
            userMessage = `🔐 Authentication Error\n\nYour token may have expired. Please get a fresh token from Dreaming Spanish.\n\nError: ${errorMessage}`;
        } else {
            userMessage = `Error: ${errorMessage}\n\nPossible causes:\n- Token expired\n- Network error\n- API temporarily unavailable`;
        }
        
        // Show token section to allow re-entry
        tokenSectionEl.classList.remove('hidden');
        document.getElementById('header-buttons').classList.add('hidden');
        
        // Show error in a more user-friendly way
        alert(userMessage);
    }
}

function renderDashboard(stats, todayMinutes, history, dailyData) {
    // Today's progress
    const goalMinutes = parseInt(localStorage.getItem('dailyGoal') || '240');
    const progress = Math.min(100, (todayMinutes / goalMinutes) * 100);
    
    document.getElementById('today-minutes').textContent = Math.round(todayMinutes);
    document.getElementById('goal-minutes').textContent = goalMinutes;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    
    const remaining = Math.max(0, goalMinutes - todayMinutes);
    document.getElementById('progress-message').innerHTML = progress >= 100
        ? '🎉 <strong style="color: #4ade80;">Goal reached!</strong> Keep going!'
        : `<strong style="color: #fbbf24;">${Math.round(remaining)} min</strong> left to reach your daily goal`;

    // Daily fact
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const fact = SPANISH_FACTS[dayOfYear % SPANISH_FACTS.length];
    document.getElementById('fact-text').innerHTML = `<strong>${fact[0]}</strong><br>${fact[1]}`;

    // Countdowns
    renderCountdowns(stats);

    // Key metrics
    renderMetrics(stats);

    // Charts
    ChartRenderer.renderCumulativeChart('cumulative-chart', dailyData);
    ChartRenderer.renderDailyChart('daily-chart', dailyData);
    ChartRenderer.renderDurationChart('duration-chart', history);
    ChartRenderer.renderLevelPie('level-pie', history);
}

function renderCountdowns(stats) {
    const events = [
        { name: 'World Cup 2026', date: new Date('2026-06-11'), emoji: '⚽', color: '#4ade80' },
        { name: '25th Birthday', date: new Date('2027-05-22'), emoji: '🎂', color: '#fbbf24' },
        { name: 'Cuba Trip', date: new Date('2028-02-01'), emoji: '🇨🇺', color: '#4a9eff' },
        { name: 'Olympics 2028', date: new Date('2028-07-14'), emoji: '🏅', color: '#e879f9' }
    ];

    const today = new Date();
    const countdownsHtml = events.map(event => {
        const days = Math.ceil((event.date - today) / (1000 * 60 * 60 * 24));
        const projectedHours = stats.totalHours + (days * (stats.avgDailyMinutes / 60) * 0.85);
        
        return `
            <div class="countdown-card" style="border-color: ${event.color};">
                <h3>${event.emoji} ${event.name}</h3>
                <p class="date">${event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                <p class="days">${days}</p>
                <p class="label">days to go</p>
                <hr style="border-color: ${event.color}; margin: 0.5rem 0;">
                <p class="label" style="font-size: 0.65rem;">Projected: ${Math.round(projectedHours)}h</p>
            </div>
        `;
    }).join('');

    document.getElementById('countdowns').innerHTML = countdownsHtml;
}

function renderMetrics(stats) {
    const metricsHtml = `
        <div class="metric-card">
            <div class="metric-value">${stats.totalHours.toFixed(1)}</div>
            <div class="metric-label">Total Hours</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">🔥 ${stats.currentStreak}</div>
            <div class="metric-label">Current Streak</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">${stats.totalVideos.toLocaleString()}</div>
            <div class="metric-label">Videos Watched</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">${stats.consistencyScore.toFixed(0)}%</div>
            <div class="metric-label">Consistency</div>
        </div>
    `;
    document.getElementById('key-metrics').innerHTML = metricsHtml;
}
