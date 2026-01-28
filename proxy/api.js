/**
 * CORS Proxy API for Dreaming Spanish
 * Deploy this to Vercel or Netlify to create a backend proxy
 * 
 * Vercel: Create vercel.json and deploy
 * Netlify: Create netlify/functions/api.js
 */

// For Vercel
export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { endpoint, token, ...queryParams } = req.query;

    if (!endpoint || !token) {
        return res.status(400).json({ error: 'Missing endpoint or token' });
    }

    try {
        const baseUrl = 'https://app.dreaming.com/.netlify/functions';
        const url = new URL(`${baseUrl}/${endpoint}`);
        
        // Add query parameters
        Object.keys(queryParams).forEach(key => {
            url.searchParams.append(key, queryParams[key]);
        });

        const response = await fetch(url.toString(), {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.9',
                'Origin': 'https://app.dreaming.com',
                'Referer': 'https://app.dreaming.com/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
