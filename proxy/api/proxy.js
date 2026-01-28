/**
 * Vercel Serverless Function - CORS Proxy for Dreaming Spanish API
 * 
 * Deploy to Vercel:
 * 1. Install Vercel CLI: npm i -g vercel
 * 2. cd web/proxy
 * 3. vercel
 * 4. Copy the URL (e.g., https://your-app.vercel.app/api/proxy)
 * 5. Add to Settings in the web app
 */

export default async function handler(req, res) {
    // Enable CORS for all origins
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Get parameters
    const { endpoint, token, ...queryParams } = req.query;

    if (!endpoint || !token) {
        return res.status(400).json({ 
            error: 'Missing endpoint or token',
            usage: '?endpoint=user&token=YOUR_TOKEN&timezone=-5'
        });
    }

    try {
        const baseUrl = 'https://app.dreaming.com/.netlify/functions';
        const url = new URL(`${baseUrl}/${endpoint}`);
        
        // Add query parameters (excluding endpoint and token)
        Object.keys(queryParams).forEach(key => {
            if (key !== 'endpoint' && key !== 'token') {
                url.searchParams.append(key, queryParams[key]);
            }
        });

        // Make request to Dreaming Spanish API
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

        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({ 
                error: `API Error ${response.status}`,
                details: errorText.substring(0, 200)
            });
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ 
            error: 'Proxy error',
            message: error.message 
        });
    }
}
