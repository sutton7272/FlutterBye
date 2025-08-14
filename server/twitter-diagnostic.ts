import puppeteer from 'puppeteer';
import type { Express } from 'express';

export function registerTwitterDiagnosticEndpoint(app: Express) {
  app.post('/api/social-automation/twitter-diagnostic', async (req, res) => {
    try {
      console.log('🔍 Twitter Diagnostic Tool Started');
      
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      });
      
      res.write(JSON.stringify({
        status: 'starting',
        message: 'Launching diagnostic browser...',
        step: 1
      }) + '\n');
      
      const browser = await puppeteer.launch({
        headless: false, // Keep visible for debugging
        args: [
          '--no-sandbox', 
          '--disable-setuid-sandbox',
          '--disable-blink-features=AutomationControlled',
          '--disable-dev-shm-usage'
        ],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/nix/store/zi4f80l169xlmivz8vja8wlphq74qqk0-chromium-125.0.6422.141/bin/chromium'
      });
      
      const page = await browser.newPage();
      
      // Set realistic user agent
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      
      res.write(JSON.stringify({
        status: 'navigating',
        message: 'Navigating to Twitter login...',
        step: 2
      }) + '\n');
      
      await page.goto('https://x.com/login', { waitUntil: 'networkidle2', timeout: 30000 });
      
      res.write(JSON.stringify({
        status: 'analyzing',
        message: 'Analyzing Twitter login page...',
        step: 3
      }) + '\n');
      
      // Take initial screenshot
      const screenshot1 = await page.screenshot({ encoding: 'base64', fullPage: true });
      
      // Enter username
      await page.waitForSelector('input[name="text"]', { timeout: 10000 });
      await page.type('input[name="text"]', 'flutterbye_io');
      
      // Click Next
      await new Promise(resolve => setTimeout(resolve, 1000));
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('[role="button"]'));
        const nextButton = buttons.find(btn => 
          btn.textContent?.includes('Next') ||
          btn.textContent?.includes('Continue')
        );
        if (nextButton) nextButton.click();
      });
      
      // Wait for next page to load
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Take screenshot after clicking Next
      const screenshot2 = await page.screenshot({ encoding: 'base64', fullPage: true });
      
      // Analyze what Twitter is showing
      const currentUrl = page.url();
      const pageContent = await page.content();
      
      // Check for various Twitter challenges/blocks
      const analysis = {
        url: currentUrl,
        hasPasswordField: pageContent.includes('name="password"'),
        hasRecaptcha: pageContent.includes('recaptcha') || pageContent.includes('captcha'),
        hasVerification: pageContent.includes('verification') || pageContent.includes('verify'),
        hasChallenge: pageContent.includes('challenge') || pageContent.includes('suspicious'),
        hasPhoneVerification: pageContent.includes('phone') && pageContent.includes('verify'),
        hasEmailVerification: pageContent.includes('email') && pageContent.includes('verify'),
        hasRateLimiting: pageContent.includes('rate limit') || pageContent.includes('try again'),
        hasSuspiciousActivity: pageContent.includes('suspicious activity') || pageContent.includes('unusual activity'),
        screenshots: {
          initial: screenshot1,
          afterNext: screenshot2
        }
      };
      
      res.write(JSON.stringify({
        status: 'complete',
        message: 'Diagnostic analysis complete',
        step: 4,
        analysis,
        recommendations: [
          analysis.hasRecaptcha ? 'CAPTCHA challenge detected - requires manual solving' : null,
          analysis.hasVerification ? 'Account verification required - complete manually' : null,
          analysis.hasPhoneVerification ? 'Phone verification needed' : null,
          analysis.hasEmailVerification ? 'Email verification needed' : null,
          analysis.hasSuspiciousActivity ? 'Account flagged for suspicious activity' : null,
          analysis.hasPasswordField ? 'Password field available - automation should work' : null
        ].filter(Boolean)
      }) + '\n');
      
      await browser.close();
      res.end();
      
    } catch (error: any) {
      console.error('Diagnostic error:', error);
      try {
        res.write(JSON.stringify({
          status: 'error',
          error: error.message || 'Diagnostic failed',
          step: 'error'
        }) + '\n');
        res.end();
      } catch (e) {
        // Response already closed
      }
    }
  });
  
  console.log('🔧 Twitter Diagnostic Endpoint registered');
}