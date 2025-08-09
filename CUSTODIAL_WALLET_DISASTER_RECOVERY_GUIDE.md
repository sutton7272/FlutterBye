# Custodial Wallet Disaster Recovery Guide

## Overview
This guide explains how to recover funds from Flutterbye custodial wallets in disaster scenarios using encrypted backup files.

## Backup System
- **Security Level**: AES-256-GCM encryption
- **Private Keys**: Never displayed in UI, only encrypted backups available
- **Banking Standards**: Follows enterprise security protocols
- **Audit Trail**: All backup operations are logged for compliance

## Creating Secure Backups

### 1. Access Custodial Wallet Management
- Navigate to `/admin-custodial-wallet`
- Locate the wallet you want to backup
- Click the green "Backup" button in the Security & Recovery section

### 2. Backup File Contents
Each backup file contains:
```json
{
  "walletId": "unique-wallet-identifier",
  "currency": "SOL|USDC|FLBY",
  "walletAddress": "public-wallet-address",
  "encryptedPrivateKey": "AES-256-encrypted-private-key",
  "backupDate": "ISO-timestamp",
  "recoveryInstructions": "detailed-instructions",
  "securityLevel": "AES-256",
  "requiresDecryptionKey": true
}
```

### 3. Backup File Security
- Files are named: `wallet-backup-{CURRENCY}-{ADDRESS}-{TIMESTAMP}.json`
- Contains encrypted private key data only
- Requires decryption keys to access funds
- Store in multiple secure locations

## Fund Recovery Process

### Emergency Recovery Steps

#### 1. Gather Required Items
- ✅ Backup file (.json)
- ✅ Decryption keys (stored separately)
- ✅ Recovery environment (secure computer)
- ✅ Solana CLI tools or compatible wallet software

#### 2. Decrypt Private Key
```bash
# Example decryption process (implementation specific)
# This requires the encryption key used during wallet creation
openssl enc -d -aes-256-gcm -in encrypted_key -out private_key.txt
```

#### 3. Import to Recovery Wallet
```bash
# Import private key to Solana CLI
solana-keygen recover --force --outfile recovery-wallet.json

# Or import to compatible wallet software
# Follow wallet-specific import procedures
```

#### 4. Transfer Funds
```bash
# Check balance
solana balance recovery-wallet.json

# Transfer to new secure wallet
solana transfer <NEW_WALLET_ADDRESS> <AMOUNT> --from recovery-wallet.json
```

## Security Considerations

### Critical Security Rules
- ⚠️ **Never share private keys or decryption keys**
- ⚠️ **Use secure, offline computers for recovery**
- ⚠️ **Verify wallet addresses before transfers**
- ⚠️ **Delete recovery files after use**
- ⚠️ **Test recovery process with small amounts first**

### Multi-Signature Recovery
For high-value wallets requiring multiple signatures:
1. Coordinate with authorized signers
2. Use multi-sig recovery procedures
3. Follow enterprise approval workflows
4. Document all recovery actions

### Compliance Requirements
- All recovery operations must be logged
- Maintain audit trail for regulatory compliance
- Report significant fund movements
- Follow internal approval processes

## Recovery Scenarios

### Scenario 1: Server Failure
**Situation**: Primary servers are down, need access to funds
**Solution**: Use backup files to recover to external wallets

### Scenario 2: Database Corruption
**Situation**: Database is corrupted, wallet data inaccessible
**Solution**: Restore from backup files and recreate wallet infrastructure

### Scenario 3: Key Compromise
**Situation**: Encryption keys may be compromised
**Solution**: Immediately transfer funds using backup files to new secure wallets

### Scenario 4: Infrastructure Migration
**Situation**: Moving to new infrastructure or providers
**Solution**: Use backup files to migrate wallet access seamlessly

## Testing Recovery Process

### Monthly Testing Checklist
- [ ] Verify backup file integrity
- [ ] Test decryption process with test keys
- [ ] Validate wallet import procedures
- [ ] Confirm transfer capabilities
- [ ] Update recovery documentation

### Test Wallet Setup
1. Create test wallets with small amounts
2. Generate backup files
3. Practice recovery procedures
4. Document any issues or improvements
5. Train authorized personnel

## Emergency Contacts

### Internal Team
- **Primary**: System Administrator
- **Secondary**: Security Officer
- **Backup**: Technical Lead

### External Support
- **Solana Support**: For blockchain-specific issues
- **Infrastructure Provider**: For hosting/server issues
- **Legal Counsel**: For compliance questions

## Recovery Time Estimates

| Scenario | Recovery Time | Complexity |
|----------|---------------|------------|
| Single Wallet | 15-30 minutes | Low |
| Multiple Wallets | 1-3 hours | Medium |
| Full Infrastructure | 4-8 hours | High |
| Complex Multi-Sig | 8-24 hours | Very High |

## Post-Recovery Actions

### Immediate Steps
1. ✅ Verify all funds are secure
2. ✅ Update wallet infrastructure
3. ✅ Generate new backup files
4. ✅ Update security procedures
5. ✅ Document recovery actions

### Long-term Actions
1. ✅ Review and improve backup procedures
2. ✅ Update disaster recovery plans
3. ✅ Train additional personnel
4. ✅ Implement additional security measures
5. ✅ Regular recovery testing schedule

---

**⚠️ IMPORTANT**: This guide is for authorized personnel only. Unauthorized access to custodial wallet backup files or recovery procedures is strictly prohibited and may violate regulations.

**📧 Support**: For questions about disaster recovery procedures, contact the technical team immediately.

**🔒 Security**: Always follow the principle of least privilege and multi-person authorization for fund recovery operations.