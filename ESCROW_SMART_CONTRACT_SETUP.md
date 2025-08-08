# Flutterbye Escrow Smart Contract Setup Guide

## Overview
Enterprise-grade Solana smart contract escrow system for secure high-value transactions ($200K-$2M). Features automatic timeouts, multi-signature support, and comprehensive audit trail.

## Features
- ✅ **Secure Escrow**: Smart contract-based fund holding
- ✅ **Timeout Protection**: Automatic fund return after expiration
- ✅ **Authority Control**: Only authorized parties can release funds
- ✅ **Multi-Token Support**: Works with SOL, USDC, FLBY, and any SPL token
- ✅ **Event Logging**: Complete audit trail for compliance
- ✅ **Emergency Recovery**: Expired funds can be claimed by anyone

## Step-by-Step Setup

### 1. Prerequisites
```bash
# Install Rust (required for Anchor)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.17.0/install)"
export PATH="/home/runner/.local/share/solana/install/active_release/bin:$PATH"

# Install Anchor (Solana smart contract framework)
npm install -g @coral-xyz/anchor-cli@0.29.0

# Install Node dependencies for smart contract interaction
npm install @coral-xyz/anchor @solana/web3.js @solana/spl-token
```

### 2. Generate Keypairs
```bash
# Generate program keypair (this will be your contract address)
solana-keygen new --outfile contracts/escrow/target/deploy/flutterbye_escrow-keypair.json

# Generate escrow authority keypair (for contract deployment)
solana-keygen new --outfile ~/.config/solana/escrow-authority.json

# Get the program ID
solana address -k contracts/escrow/target/deploy/flutterbye_escrow-keypair.json
```

### 3. Configure Environment Variables
Add to your `.env.local`:
```bash
# Escrow Contract Configuration
ESCROW_PROGRAM_ID=<YOUR_PROGRAM_ID_FROM_STEP_2>
SOLANA_ESCROW_PRIVATE_KEY=<YOUR_ESCROW_AUTHORITY_PRIVATE_KEY>

# For Mainnet deployment (when ready)
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NODE_ENV=production
```

### 4. Deploy Smart Contract

#### For DevNet (Testing):
```bash
cd contracts/escrow

# Configure for DevNet
anchor build
anchor deploy --provider.cluster devnet

# Update program ID in lib.rs and Anchor.toml with the deployed address
# Then rebuild and upgrade:
anchor build
anchor upgrade --provider.cluster devnet <PROGRAM_ID>
```

#### For MainNet (Production):
```bash
cd contracts/escrow

# Configure for MainNet
solana config set --url https://api.mainnet-beta.solana.com

# Deploy (requires SOL for deployment fees ~0.2 SOL)
anchor build
anchor deploy --provider.cluster mainnet

# Update and upgrade for MainNet
anchor build  
anchor upgrade --provider.cluster mainnet <PROGRAM_ID>
```

### 5. Backend Integration

The `EscrowContractService` is already integrated into your backend. Key endpoints:

```typescript
// Create new escrow
POST /api/escrow/create
{
  "amount": 1000000,  // Amount in smallest token units
  "recipientAddress": "8o85ELbk7Ny8WNQjCEo5pHjPctcMbWxsK1qC6tYFdHa7",
  "timeoutHours": 72,  // 3 days timeout
  "escrowId": "contract_001",
  "mintAddress": "So11111111111111111111111111111111111111112"  // SOL mint
}

// Release escrow (authority only)
POST /api/escrow/release
{
  "escrowId": "contract_001"
}

// Cancel escrow (authority only, before timeout)
POST /api/escrow/cancel  
{
  "escrowId": "contract_001"
}

// Get escrow info
GET /api/escrow/:escrowId/:authorityAddress

// List all escrows for authority
GET /api/escrow/authority/:authorityAddress
```

### 6. Frontend Integration

Connect to the smart contract from your frontend:

```typescript
import { getEscrowContractService } from '@/lib/escrow-contract';

// Create escrow
const escrowService = getEscrowContractService();
const result = await escrowService.createEscrow({
  amount: 1000000,
  recipientAddress: recipientWallet.publicKey.toString(),
  timeoutHours: 72,
  escrowId: 'contract_001',
  mintAddress: 'So11111111111111111111111111111111111111112'
});

console.log('Escrow created:', result.escrowAddress);
```

### 7. Security Best Practices

1. **Multi-Signature**: For high-value contracts, use multi-sig wallets
2. **Timeouts**: Set appropriate timeout periods (24-168 hours)
3. **Testing**: Always test on DevNet before MainNet deployment
4. **Auditing**: Consider smart contract audits for production
5. **Monitoring**: Set up alerts for escrow events

### 8. Testing the Contract

```bash
# Run the test suite
cd contracts/escrow
anchor test

# Test specific scenarios
npm run test:escrow-creation
npm run test:escrow-release  
npm run test:escrow-timeout
```

### 9. Production Deployment Checklist

- [ ] Smart contract deployed to MainNet
- [ ] Program ID updated in environment variables
- [ ] Authority keypairs secured (hardware wallet recommended)
- [ ] Frontend wallet integration tested
- [ ] Backend API endpoints tested
- [ ] Monitoring and alerting configured
- [ ] Legal compliance reviewed
- [ ] Insurance coverage considered for high-value escrows

### 10. Emergency Procedures

If funds get stuck:
1. Check escrow status via API
2. If expired, anyone can call `claimExpiredEscrow`
3. Contact support with transaction signatures
4. Use backup recovery procedures

## Contract Architecture

```
Smart Contract Features:
├── Escrow Creation (with timeout)
├── Fund Release (authority only)  
├── Fund Cancellation (authority only, before timeout)
├── Expired Fund Recovery (anyone after timeout)
├── Event Logging (all actions logged)
└── Multi-Token Support (SOL, USDC, FLBY, etc.)

Security Features:
├── PDA-based addresses (non-guessable)
├── Authority verification (only owner can release)
├── Timeout protection (automatic recovery)
├── Event auditing (complete transaction log)
└── Reentrancy protection (Anchor framework)
```

## Revenue Model

**Enterprise Contracts**: $200K-$2M value
- 0.5% escrow fee on contract value
- $50-$200 setup fee per contract
- **Target**: $5M-$50M ARR from enterprise clients

The smart contract system is now ready for production deployment!