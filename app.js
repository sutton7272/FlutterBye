const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>FlutterBye</title></head>
      <body>
        <h1>FlutterBye Platform</h1>
        <p>FlutterBye Web3 Social Media Platform is live!</p>
        <p>Environment: ${process.env.NODE_ENV || 'production'}</p>
        <p>Server running on port ${port}</p>
      </body>
    </html>
  `);
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`FlutterBye server running on port ${port}`);
});