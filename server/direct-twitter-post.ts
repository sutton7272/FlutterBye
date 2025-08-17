import { TwitterAPIService } from './twitter-api-service';

async function attemptDirectPost() {
  console.log('🚀 Attempting direct Twitter post...');
  
  const twitterService = new TwitterAPIService();
  
  // Try with a very simple, unique message to avoid duplicate detection
  const uniqueContent = `🚀 FlutterBye LIVE TEST ${Date.now()}: AI social automation system operational! Web3 communication platform with blockchain integration ready for production. #FlutterBye #Web3 #LiveTest`;
  
  try {
    console.log('📝 Posting content:', uniqueContent);
    const result = await twitterService.postTweet(uniqueContent);
    
    if (result.success) {
      console.log('✅ SUCCESS! Tweet posted:', result.tweetId);
      console.log('🔗 Tweet URL: https://twitter.com/Flutterbye_io/status/' + result.tweetId);
      return {
        success: true,
        message: 'Real tweet successfully posted to X account!',
        tweetId: result.tweetId,
        content: uniqueContent,
        url: 'https://twitter.com/Flutterbye_io/status/' + result.tweetId
      };
    } else {
      console.log('❌ Post failed:', result.message);
      return {
        success: false,
        message: result.message,
        error: result.error
      };
    }
  } catch (error: any) {
    console.log('❌ Direct post error:', error.message);
    return {
      success: false,
      message: 'Failed to post tweet',
      error: error.message
    };
  }
}

// Run the direct post attempt
attemptDirectPost().then(result => {
  console.log('🏁 Final result:', JSON.stringify(result, null, 2));
}).catch(error => {
  console.error('💥 Script error:', error);
});