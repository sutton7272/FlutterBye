import express from 'express';
import cors from 'cors';
import { createServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import routes from './routes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '5000');

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api', routes);

// Development mode: use Vite dev server
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
      root: join(__dirname, '../client'),
    });
    
    app.use(vite.ssrFixStacktrace);
    app.use('*', vite.middlewares);
  } else {
    // Production mode: serve static files
    app.use(express.static(join(__dirname, '../dist')));
    
    app.get('*', (req, res) => {
      res.sendFile(join(__dirname, '../dist/index.html'));
    });
  }
  
  // Start server after Vite is set up
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🏊‍♀️ PoolPal server running on port ${PORT}`);
    console.log('📋 Available routes:');
    console.log('  - GET  /api/health - Health check');
    console.log('  - POST /api/auth/register - Register user');
    console.log('  - POST /api/auth/login - Login user');
    console.log('  - GET  /api/jobs/open - Get open jobs');
    console.log('  - POST /api/jobs - Create job');
    console.log('  - GET  /api/cleaners - Get all cleaners');
    console.log('  - GET  /api/flutterbye/status - Flutterbye integration status');
  });
}

// Welcome message
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'PoolPal API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

setupVite();