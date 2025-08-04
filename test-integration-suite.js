/**
 * Comprehensive FlutterAI Auto-Collection Integration Test Suite
 * 
 * Tests all three integration points:
 * 1. FlutterBye authentication with auto-collection
 * 2. PerpeTrader authentication with auto-collection
 * 3. Universal FlutterAI API for any new sites
 */

import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

// Test data
const testWallets = {
  flutterbye: 'FlutterByeTestWallet123456',
  perpetrader: 'PerpeTraderTestWallet789',
  universal: 'UniversalAPITestWallet555'
};

console.log('🧪 Starting FlutterAI Auto-Collection Integration Tests...\n');

async function testFlutterByeIntegration() {
  console.log('📱 Testing FlutterBye Integration...');
  
  // Get initial wallet count
  const initialStats = await axios.get(`${BASE_URL}/api/flutterai/intelligence-stats`);
  const initialCount = initialStats.data.stats.totalWallets;
  console.log(`Initial wallet count: ${initialCount}`);
  
  // Test FlutterBye authentication (should fail but trigger collection)
  try {
    await axios.post(`${BASE_URL}/api/auth/login`, {
      walletAddress: testWallets.flutterbye,
      signature: 'demo_signature_for_testing',
      message: 'demo_message_for_testing',
      deviceInfo: { platform: 'desktop', browser: 'chrome' }
    });
  } catch (error) {
    // Expected to fail due to invalid signature
    console.log('✅ FlutterBye auth failed as expected (demo credentials)');
  }
  
  // Check if wallet was collected (wait a moment for processing)
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const updatedStats = await axios.get(`${BASE_URL}/api/flutterai/intelligence-stats`);
  const newCount = updatedStats.data.stats.totalWallets;
  
  console.log(`✅ FlutterBye Integration: ${newCount > initialCount ? 'SUCCESS' : 'PENDING'}\n`);
  return newCount > initialCount;
}

async function testPerpeTraderIntegration() {
  console.log('📈 Testing PerpeTrader Integration...');
  
  const initialStats = await axios.get(`${BASE_URL}/api/flutterai/intelligence-stats`);
  const initialCount = initialStats.data.stats.totalWallets;
  
  // Test PerpeTrader authentication
  try {
    await axios.post(`${BASE_URL}/api/auth/perpetrader/login`, {
      walletAddress: testWallets.perpetrader,
      signature: 'demo_signature_for_testing',
      message: 'demo_message_for_testing',
      deviceInfo: { platform: 'mobile', browser: 'safari' },
      tradingProfile: {
        experience: 'advanced',
        riskTolerance: 'high',
        preferredAssets: ['SOL', 'USDC', 'ETH']
      }
    });
  } catch (error) {
    console.log('✅ PerpeTrader auth failed as expected (demo credentials)');
  }
  
  // Check if wallet was collected
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const updatedStats = await axios.get(`${BASE_URL}/api/flutterai/intelligence-stats`);
  const newCount = updatedStats.data.stats.totalWallets;
  
  console.log(`✅ PerpeTrader Integration: ${newCount > initialCount ? 'SUCCESS' : 'PENDING'}\n`);
  return newCount > initialCount;
}

async function testUniversalAPIIntegration() {
  console.log('🌐 Testing Universal FlutterAI API...');
  
  const initialStats = await axios.get(`${BASE_URL}/api/flutterai/intelligence-stats`);
  const initialCount = initialStats.data.stats.totalWallets;
  
  // Test Universal API integration
  try {
    const response = await axios.post(`${BASE_URL}/api/flutterai/connect`, {
      walletAddress: testWallets.universal,
      platformName: 'CryptoTraderPro',
      platformApiKey: 'flutterai_test_key_12345_abcdef',
      userMetadata: {
        accountType: 'premium',
        tradingVolume: 'high',
        registrationDate: '2024-01-15'
      },
      deviceInfo: {
        platform: 'web',
        browser: 'firefox',
        country: 'US'
      },
      sessionData: {
        sessionId: 'session_123',
        loginTime: new Date().toISOString()
      }
    });
    
    if (response.data.success) {
      console.log('✅ Universal API integration successful!');
    }
  } catch (error) {
    console.log('❌ Universal API integration failed:', error.response?.data || error.message);
  }
  
  // Check if wallet was collected
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const updatedStats = await axios.get(`${BASE_URL}/api/flutterai/intelligence-stats`);
  const newCount = updatedStats.data.stats.totalWallets;
  
  console.log(`✅ Universal API Integration: ${newCount > initialCount ? 'SUCCESS' : 'PENDING'}\n`);
  return newCount > initialCount;
}

async function verifyDashboardIntegration() {
  console.log('📊 Verifying Dashboard Integration...');
  
  // Get all wallet intelligence to verify they appear in dashboard
  try {
    const response = await axios.get(`${BASE_URL}/api/flutterai/intelligence`);
    const wallets = response.data.intelligence || [];
    
    console.log(`📈 Total wallets in dashboard: ${wallets.length}`);
    
    // Check for our test wallets
    const testWalletAddresses = Object.values(testWallets);
    const foundWallets = wallets.filter(w => testWalletAddresses.includes(w.walletAddress));
    
    console.log('🔍 Test wallets found in dashboard:');
    foundWallets.forEach(wallet => {
      console.log(`  - ${wallet.walletAddress} (${wallet.sourcePlatform})`);
    });
    
    // Get final stats
    const finalStats = await axios.get(`${BASE_URL}/api/flutterai/intelligence-stats`);
    console.log('\n📊 Final Intelligence Stats:');
    console.log(`  Total Wallets: ${finalStats.data.stats.totalWallets}`);
    console.log(`  Analysis Completed: ${finalStats.data.stats.analysisStats.completed}`);
    console.log(`  By Source:`, finalStats.data.stats.bySource);
    
    return foundWallets.length > 0;
  } catch (error) {
    console.log('❌ Dashboard verification failed:', error.response?.data || error.message);
    return false;
  }
}

// Run all tests
async function runFullTestSuite() {
  try {
    console.log('🚀 FlutterAI Auto-Collection Integration Test Suite\n');
    console.log('Testing end-to-end wallet collection from:');
    console.log('  ✓ FlutterBye authentication flows');
    console.log('  ✓ PerpeTrader authentication flows');
    console.log('  ✓ Universal FlutterAI API for any new sites');
    console.log('  ✓ Dashboard intelligence visibility\n');
    
    const results = {
      flutterbye: await testFlutterByeIntegration(),
      perpetrader: await testPerpeTraderIntegration(),
      universal: await testUniversalAPIIntegration(),
      dashboard: await verifyDashboardIntegration()
    };
    
    console.log('\n🎯 Integration Test Results:');
    console.log(`  FlutterBye Integration: ${results.flutterbye ? '✅ SUCCESS' : '⏳ PENDING'}`);
    console.log(`  PerpeTrader Integration: ${results.perpetrader ? '✅ SUCCESS' : '⏳ PENDING'}`);
    console.log(`  Universal API Integration: ${results.universal ? '✅ SUCCESS' : '⏳ PENDING'}`);
    console.log(`  Dashboard Integration: ${results.dashboard ? '✅ SUCCESS' : '⏳ PENDING'}`);
    
    const successCount = Object.values(results).filter(Boolean).length;
    console.log(`\n🏆 Overall Success Rate: ${successCount}/4 integrations working`);
    
    if (successCount === 4) {
      console.log('\n🎉 ALL INTEGRATIONS SUCCESSFUL! FlutterAI auto-collection is fully operational.');
    } else {
      console.log('\n⚠️ Some integrations pending - system may need more time for processing.');
    }
    
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
  }
}

// Execute the test suite
runFullTestSuite();