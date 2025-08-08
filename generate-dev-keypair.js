import { Keypair } from '@solana/web3.js';

// Generate a development keypair for testing
const keypair = Keypair.generate();

console.log('Development Escrow Keypair Generated:');
console.log('Public Key:', keypair.publicKey.toString());
console.log('Private Key (JSON Array):', JSON.stringify(Array.from(keypair.secretKey)));
console.log('');
console.log('Add this to your .env.local:');
console.log(`SOLANA_ESCROW_PRIVATE_KEY='${JSON.stringify(Array.from(keypair.secretKey))}'`);
console.log('');
console.log('For production, generate a secure keypair using:');
console.log('solana-keygen new --outfile escrow-authority.json');