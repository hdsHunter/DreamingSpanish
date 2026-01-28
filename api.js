/**
 * Dreaming Spanish API Client
 * 
 * CORS Solution: The Dreaming Spanish API blocks requests from GitHub Pages.
 * Options:
 * 1. Use a backend proxy (deploy web/proxy to Vercel/Netlify) - BEST
 * 2. Install a CORS browser extension - QUICKEST
 * 3. Run locally with "python server.py" - WORKS IMMEDIATELY
 * 4. Use the Streamlit version (main.py) - NO CORS ISSUES
 */
class DreamingSpanishAPI {
    constructor(token, proxyUrl = null) {
        this.token = token;
        this.baseUrl = 'https://app.dreaming.com/.netlify/functions';
        // If proxyUrl is set, use it. Otherwise try direct (will fail on GitHub Pages due to CORS)
        this.proxyUrl = proxyUrl || localStorage.getItem('dreamingSpanishProxyUrl') || null;
    }

    /**
     * Make a request - tries direct first, then proxy if configured
     */
    async _makeRequest(endpoint, params = {}) {
        const url = new URL(`${this.baseUrl}/${endpoint}`);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        // If proxy is configured, use it
        if (this.proxyUrl) {
            try {
                const proxyUrlObj = new URL(this.proxyUrl);
                proxyUrlObj.searchParams.set('endpoint', endpoint);
                proxyUrlObj.searchParams.set('token', this.token);
                Object.keys(params).forEach(key => {
                    proxyUrlObj.searchParams.set(key, params[key]);
                });
                
                const response = await fetch(proxyUrlObj.toString());
                if (response.ok) {
                    return await response.json();
                }
                const errorText = await response.text();
                throw new Error(`Proxy Error ${response.status}: ${errorText.substring(0, 100)}`);
            } catch (proxyError) {
                console.error('Proxy request failed:', proxyError);
                throw new Error(`Proxy Error: ${proxyError.message}. Check your proxy URL in settings.`);
            }
        }

        // Try direct request (will fail on GitHub Pages due to CORS)
        try {
            const response = await fetch(url.toString(), {
                method: 'GET',
                mode: 'cors',
                credentials: 'omit',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': '*/*',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Origin': 'https://app.dreaming.com',
                    'Referer': 'https://app.dreaming.com/',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            if (response.ok) {
                return await response.json();
            }
            throw new Error(`API Error ${response.status}`);
        } catch (error) {
            // CORS error - provide helpful message
            const isCorsError = error.message.includes('Failed to fetch') || 
                              error.name === 'TypeError' ||
                              error.message.includes('CORS');
            
            if (isCorsError) {
                throw new Error('CORS_BLOCKED');
            }
            throw error;
        }
    }

    async fetchUser(timezone = -5) {
        try {
            const data = await this._makeRequest('user', { timezone });
            return data.user || data;
        } catch (error) {
            if (error.message === 'CORS_BLOCKED') {
                throw new Error('CORS_BLOCKED');
            }
            throw error;
        }
    }

    async fetchHistory(limit = 10000) {
        try {
            const data = await this._makeRequest('history', { limit });
            return data.history || data;
        } catch (error) {
            if (error.message === 'CORS_BLOCKED') {
                throw new Error('CORS_BLOCKED');
            }
            throw error;
        }
    }

    async fetchVideos() {
        try {
            const data = await this._makeRequest('videos');
            return data.videos || data;
        } catch (error) {
            if (error.message === 'CORS_BLOCKED') {
                throw new Error('CORS_BLOCKED');
            }
            throw error;
        }
    }

    async fetchAllData() {
        const [user, history, videos] = await Promise.all([
            this.fetchUser(),
            this.fetchHistory(),
            this.fetchVideos()
        ]);

        return {
            profile: user,
            history: history || [],
            videos: videos || [],
            total_time: {
                hours: ((user.watchTime || 0) + (user.externalTimeSeconds || 0)) / 3600
            }
        };
    }
}
