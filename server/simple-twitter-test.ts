import { TwitterAPIService } from './twitter-api-service';

async function directTwitterTest() {
  console.log('🚀 Starting direct Twitter test...');
  
  try {
    const twitterService = new TwitterAPIService();
    
    // Test credentials first
    console.log('🔍 Verifying credentials...');
    const credentialCheck = await twitterService.verifyCredentials();
    console.log('Credential check result:', credentialCheck);
    
    if (!credentialCheck.success) {
      console.log('❌ Credentials failed, cannot post');
      return;
    }
    
    // Create a real test post
    const testContent = `🚀 LIVE TEST: FlutterBye social automation system is working! Revolutionary Web3 communication platform with AI-powered content generation and blockchain integration. 

#FlutterBye #Web3 #BlockchainInnovation #AI #SocialAutomation #LiveTest

Time: ${new Date().toLocaleTimeString()}`;
    
    console.log('📝 Attempting to post:', testContent);
    
    const result = await twitterService.postTweet(testContent);
    
    console.log('🎯 Post result:', result);
    
    if (result.success) {
      console.log('✅ SUCCESS! Tweet posted with ID:', result.tweetId);
    } else {
      console.log('❌ FAILED:', result.message);
    }
    
    return result;
    
  } catch (error) {
    console.error('💥 Direct Twitter test error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the test immediately
directTwitterTest().then(result => {
  console.log('🏁 Final result:', result);
}).catch(error => {
  console.error('🚨 Test execution error:', error);
});