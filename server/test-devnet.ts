/**
 * DevNet Configuration Test Script
 */

import { devNetService, performDevNetHealthCheck } from './devnet-config';

async function testDevNetConfig() {
  console.log('🧪 Testing DevNet Configuration...');
  
  try {
    // Test 1: Connection validation
    console.log('\n1️⃣ Testing connection...');
    const validation = await devNetService.validateConnection();
    console.log('Connection result:', validation);
    
    // Test 2: Network info
    console.log('\n2️⃣ Getting network info...');
    const networkInfo = await devNetService.getNetworkInfo();
    console.log('Network info:', {
      cluster: networkInfo.cluster,
      slot: networkInfo.slot,
      blockHeight: networkInfo.blockHeight,
      epoch: networkInfo.epochInfo.epoch
    });
    
    // Test 3: Health check
    console.log('\n3️⃣ Performing health check...');
    const healthCheck = await performDevNetHealthCheck();
    console.log('Health check result:', {
      status: healthCheck.status,
      latency: healthCheck.checks.latency,
      blockHeight: healthCheck.checks.blockHeight
    });
    
    // Test 4: Configuration check
    console.log('\n4️⃣ Configuration details:');
    const config = devNetService.getConfig();
    console.log('DevNet config:', {
      endpoint: config.rpcEndpoint,
      environment: config.environment,
      commitment: config.commitment
    });
    
    console.log('\n✅ DevNet configuration test complete!');
    
  } catch (error) {
    console.error('❌ DevNet test failed:', error);
  }
}

// Run test if called directly
if (require.main === module) {
  testDevNetConfig();
}

export { testDevNetConfig };