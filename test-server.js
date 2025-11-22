// Simple test server to demonstrate the dev-tunnel CLI tool
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5173;

// Serve a simple HTML page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Dev Tunnel Test Server</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
          h1 { color: #2c3e50; }
          p { color: #7f8c8d; }
        </style>
      </head>
      <body>
        <h1>Dev Tunnel Test Server</h1>
        <p>This server is running on port ${PORT}</p>
        <p>Access it locally at <a href="http://localhost:${PORT}">http://localhost:${PORT}</a></p>
        <p>Or through the dev-tunnel when exposed via ngrok!</p>
      </body>
    </html>
  `);
});

// API endpoint for testing
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

app.listen(PORT, () => {
  console.log(`Test server running at http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop the server');
});