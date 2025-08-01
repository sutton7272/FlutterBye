// Polyfills for Solana web3.js browser compatibility
import { Buffer } from 'buffer';

// Make Buffer available globally for Solana libraries
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
  (window as any).global = window;
}