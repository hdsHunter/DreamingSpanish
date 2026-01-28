/**
 * Dreaming Spanish API Client
 */
class DreamingSpanishAPI {
    constructor(token) {
        this.token = token;
        this.baseUrl = 'https://app.dreaming.com/.netlify/functions';
    }

    async fetchUser(timezone = -5) {
        try {
            const response = await fetch(
                `${this.baseUrl}/user?timezone=${timezone}`,
                {
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
                }
            );
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API Error ${response.status}: ${errorText.substring(0, 100)}`);
            }
            
            const data = await response.json();
            return data.user || data;
        } catch (error) {
            if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
                throw new Error('CORS/Network Error: The Dreaming Spanish API may block requests from GitHub Pages. Try: 1) Using a CORS browser extension, 2) Opening the site locally, or 3) The API may be temporarily unavailable.');
            }
            throw error;
        }
    }

    async fetchHistory(limit = 10000) {
        try {
            const response = await fetch(
                `${this.baseUrl}/history?limit=${limit}`,
                {
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
                }
            );
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API Error ${response.status}: ${errorText.substring(0, 100)}`);
            }
            
            const data = await response.json();
            return data.history || data;
        } catch (error) {
            if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
                throw new Error('CORS Error: The API may not allow requests from this origin.');
            }
            throw error;
        }
    }

    async fetchVideos() {
        try {
            const response = await fetch(
                `${this.baseUrl}/videos`,
                {
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
                }
            );
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API Error ${response.status}: ${errorText.substring(0, 100)}`);
            }
            
            const data = await response.json();
            return data.videos || data;
        } catch (error) {
            if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
                throw new Error('CORS Error: The API may not allow requests from this origin.');
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
