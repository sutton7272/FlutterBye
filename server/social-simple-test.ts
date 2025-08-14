import type { Express } from 'express';

export function registerSimpleTestEndpoint(app: Express) {
  // Simple test endpoint that simulates successful posting for dashboard testing
  app.post('/api/social-automation/simple-test', async (req, res) => {
    try {
      console.log('🚀 Simple test endpoint called');
      
      // Set proper response headers
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      });
      
      // Send starting status
      res.write(JSON.stringify({
        status: 'starting',
        message: 'Browser automation starting...',
        step: 1
      }) + '\n');
      
      // Simulate some processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Send posting status
      res.write(JSON.stringify({
        status: 'posting',
        message: 'Logging into Twitter and posting...',
        step: 2
      }) + '\n');
      
      // Simulate posting time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Send success result
      res.write(JSON.stringify({
        status: 'complete',
        success: true,
        message: 'Tweet posted successfully with browser automation!',
        step: 3,
        loginVerified: true,
        method: 'browser_automation'
      }) + '\n');
      
      res.end();
      
    } catch (error: any) {
      console.error('Simple test error:', error);
      try {
        res.write(JSON.stringify({
          status: 'error',
          success: false,
          error: error.message || 'Test failed',
          step: 'error'
        }) + '\n');
        res.end();
      } catch (e) {
        // Response already closed
      }
    }
  });
  
  console.log('⚡ Simple Social Test Endpoint registered');
}