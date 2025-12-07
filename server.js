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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Press Ctrl+C to stop.`);
});
