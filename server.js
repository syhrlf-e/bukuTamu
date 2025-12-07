const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// DEBUG: Endpoint to inspect Vercel file system
app.get('/api/debug-fs', (req, res) => {
    const fs = require('fs');
    
    const listDir = (dir) => {
        try {
            return fs.readdirSync(dir).map(f => {
                const fullPath = path.join(dir, f);
                try {
                    return fs.statSync(fullPath).isDirectory() 
                        ? { name: f, children: listDir(fullPath) } 
                        : f;
                } catch { return f; }
            });
        } catch (e) {
            return e.message;
        }
    };

    res.json({
        cwd: process.cwd(),
        dirname: __dirname,
        rootDir: listDir(process.cwd()),
        clientDist: listDir(path.join(process.cwd(), 'client')),
    });
});

// Serve static files from the Vue client build directory
// Use process.cwd() for Vercel/Serverless environment compatibility
const clientBuildPath = path.join(process.cwd(), 'client/dist');
console.log('Serving static files from:', clientBuildPath);

app.use(express.static(clientBuildPath, {
    maxAge: '1y', // Cache hashed assets
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('index.html')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        }
    }
}));

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

// Only listen if run directly (local development)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log(`Press Ctrl+C to stop.`);
    });
}
