// Keep-alive script for Render free tier
const https = require('https');

const BACKEND_URL = 'https://your-backend-app.onrender.com'; // Replace with your actual Render URL

function pingBackend() {
    console.log(`Pinging backend at ${new Date().toISOString()}`);
    
    https.get(`${BACKEND_URL}/health`, (res) => {
        console.log(`Status: ${res.statusCode}`);
    }).on('error', (err) => {
        console.error('Ping failed:', err.message);
    });
}

// Ping every 10 minutes (600000 ms)
setInterval(pingBackend, 600000);

// Initial ping
pingBackend();

console.log('Keep-alive script started. Pinging every 10 minutes...');
