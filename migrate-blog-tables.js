#!/usr/bin/env node
import { spawn } from 'child_process';

console.log('🚀 Starting blog tables migration...');

const drizzleProcess = spawn('npx', ['drizzle-kit', 'push'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  cwd: process.cwd()
});

// Auto-respond to all prompts with 'y' (yes)
const responses = ['y\n', 'y\n', 'y\n', 'y\n', 'y\n'];
let responseIndex = 0;

drizzleProcess.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(output);
  
  // If we see a prompt, send the next response
  if (output.includes('❯') || output.includes('table') || output.includes('?')) {
    if (responseIndex < responses.length) {
      setTimeout(() => {
        drizzleProcess.stdin.write(responses[responseIndex]);
        responseIndex++;
      }, 100);
    }
  }
});

drizzleProcess.stderr.on('data', (data) => {
  console.error(data.toString());
});

drizzleProcess.on('close', (code) => {
  console.log(`✅ Migration completed with code: ${code}`);
  process.exit(code);
});

// Send initial response after a short delay
setTimeout(() => {
  if (responseIndex < responses.length) {
    drizzleProcess.stdin.write(responses[responseIndex]);
    responseIndex++;
  }
}, 2000);