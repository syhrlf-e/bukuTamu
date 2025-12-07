const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the Vue client build directory
const clientBuildPath = path.resolve(__dirname, 'client/dist');
console.log('Serving static files from:', clientBuildPath);
app.use(express.static(clientBuildPath));

// In-memory store for scan status (Note: Ephemeral on serverless/Vercel)
const scanStatus = new Map();

// API Endpoint to check scan status
app.get('/api/check-scan/:id', (req, res) => {
    const { id } = req.params;
    const isScanned = scanStatus.get(id) || false;
    res.json({ scanned: isScanned });
});

// API Endpoint for the phone to hit when scanning QR
app.get('/api/scan/:id', (req, res) => {
    const { id } = req.params;
    scanStatus.set(id, true);
    
    // Simple response for the phone user
    res.send(`
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;text-align:center;padding:20px;">
            <div style="font-size:50px;color:green;margin-bottom:20px;">✓</div>
            <h2>Scan Berhasil!</h2>
            <p>Silakan lihat layar utama untuk melihat souvenir Anda.</p>
        </div>
    `);
});

// API Endpoint for random merchandise (optional health check)
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date() });
});

// Handle SPA routing: serve index.html for any unknown routes
// app.get('*', (req, res) => {
//     const indexPath = path.join(clientBuildPath, 'index.html');
//     if (fs.existsSync(indexPath)) {
//         res.sendFile(indexPath);
//     } else {
//         res.status(404).send('Not found');
//     }
// });

// Export the app for Vercel (serverless)
module.exports = app;

// Only listen if run directly (local development)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log(`Press Ctrl+C to stop.`);
    });
}
