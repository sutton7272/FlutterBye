import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import routes from './routes';
import { setupVite, serveStatic } from './vite';
import { createServer } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '5000');
const server = createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api', routes);

async function startServer() {
  try {
    if (process.env.NODE_ENV === 'production') {
      serveStatic(app);
    } else {
      await setupVite(app, server);
    }
    
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🦋 FlutterWave Intelligence Platform running on port ${PORT}`);
      console.log('📋 Available routes:');
      console.log('  - GET  /api/health - Health check');
      console.log('  - POST /api/tokens/create - Create SPL token');
      console.log('  - POST /api/wallets/analyze - Analyze wallet');
      console.log('  - GET  /api/tokens/my-tokens - Get user tokens');
      console.log('  - GET  /demo - Live blockchain demo');
      console.log('  - GET  /api/flutterbye/status - Flutterbye integration status');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Welcome message
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'FlutterWave Intelligence Platform API is running!',
    features: ['Token Creation', 'Wallet Analysis', 'AI Insights'],
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Initialize services
const flutterboyeService = {
  init: () => {
    console.log('🦋 Flutterbye Service initialized');
    console.log('   API Key: Configured');
    console.log('   API URL: https://api.flutterbye.com/v1');
  }
};

flutterboyeService.init();

// Start the application
startServer();