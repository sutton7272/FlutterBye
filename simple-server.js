const express = require('express');
const path = require('path');
const compression = require('compression');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(compression());
app.use(express.json());
app.use(express.static('public'));

// Serve static files from dist/public
app.use(express.static(path.join(__dirname, 'dist', 'public')));

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API endpoint
app.get('/api/status', (req, res) => {
  res.json({ 
    message: 'FlutterBye API is running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'production'
  });
});

// Catch-all handler: send back React's index.html file for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'public', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`FlutterBye server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'production'}`);
});