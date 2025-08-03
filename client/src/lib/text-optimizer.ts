// Smart text optimization for 27-character messages
// Uses common abbreviations, shorthand, and compression techniques
// Enhanced with AI-powered optimization

// AI-Enhanced text optimization
import { apiRequest } from './queryClient';

export async function optimizeTextWithAI(text: string, maxLength: number = 27): Promise<{
  aiOptimized: string;
  alternatives: string[];
  viralScore: number;
  fallbackOptimizations: OptimizationSuggestion[];
}> {
  try {
    // Try AI optimization first
    const response = await fetch('/api/ai/optimize-text', {
      method: 'POST',
      body: JSON.stringify({ 
        text, 
        constraints: { 
          maxLength, 
          tone: 'engaging', 
          purpose: 'token_message',
          audience: 'crypto_enthusiasts'
        } 
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const aiResult = await response.json();

    return {
      aiOptimized: aiResult.optimized || text,
      alternatives: aiResult.alternatives || [],
      viralScore: aiResult.viralScore || 70,
      fallbackOptimizations: optimizeTextFor27Chars(text)
    };
  } catch (error) {
    console.error('AI optimization failed, using fallback:', error);
    // Fallback to rule-based optimization
    return {
      aiOptimized: text,
      alternatives: [],
      viralScore: 70,
      fallbackOptimizations: optimizeTextFor27Chars(text)
    };
  }
}

interface OptimizationSuggestion {
  text: string;
  technique: string;
  score: number;
}

const COMMON_ABBREVIATIONS: Record<string, string> = {
  // Common words
  'and': '&',
  'to': '2',
  'for': '4',
  'you': 'u',
  'your': 'ur',
  'yours': 'urs',
  'with': 'w/',
  'without': 'w/o',
  'before': 'b4',
  'because': 'bc',
  'through': 'thru',
  'though': 'tho',
  'about': 'abt',
  'something': 'smth',
  'someone': 'smone',
  'today': '2day',
  'tonight': '2nite',
  'tomorrow': '2moro',
  'between': 'btwn',
  'everyone': 'every1',
  'anyone': 'any1',
  'everything': 'evrythg',
  'anything': 'anythg',
  'nothing': 'nothg',
  'awesome': 'awsm',
  'amazing': 'amzng',
  'excited': 'hype',
  'celebrate': 'party',
  'congratulations': 'congrats',
  
  // Crypto/Web3 terms
  'cryptocurrency': 'crypto',
  'blockchain': 'chain',
  'transaction': 'tx',
  'decentralized': 'defi',
  'community': 'comm',
  'technology': 'tech',
  'investment': 'inv',
  'portfolio': 'folio',
  'profitable': 'profit',
  'successful': 'success',
  
  // Common phrases
  'good morning': 'gm',
  'good night': 'gn',
  'good luck': 'gl',
  'thank you': 'ty',
  'thanks': 'thx',
  'please': 'pls',
  'probably': 'prob',
  'definitely': 'def',
  'obviously': 'obv',
  'literally': 'lit',
  'seriously': 'srsly',
  'message': 'msg',
  'picture': 'pic',
  'information': 'info',
  'favorite': 'fav',
  'business': 'biz',
  'conference': 'conf',
  'professional': 'pro',
  
  // Emotions and reactions
  'laughing': 'lol',
  'laugh out loud': 'lol',
  'rolling on floor': 'rofl',
  'oh my god': 'omg',
  'by the way': 'btw',
  'in my opinion': 'imo',
  'as far as i know': 'afaik',
  'what the': 'wt',
  'right now': 'rn',
  'see you': 'cu',
  'talk to you': 'tty',
};

const VOWEL_REMOVAL_EXCEPTIONS = new Set([
  'a', 'an', 'as', 'at', 'be', 'by', 'do', 'go', 'he', 'if', 'in', 'is', 'it', 
  'me', 'my', 'no', 'of', 'on', 'or', 'so', 'to', 'up', 'us', 'we'
]);

const EMOJI_SUBSTITUTIONS: Record<string, string> = {
  'love': '❤️',
  'heart': '❤️',
  'money': '💰',
  'cash': '💰',
  'fire': '🔥',
  'hot': '🔥',
  'rocket': '🚀',
  'moon': '🌙',
  'star': '⭐',
  'diamond': '💎',
  'gem': '💎',
  'crown': '👑',
  'king': '👑',
  'queen': '👑',
  'party': '🎉',
  'celebrate': '🎉',
  'happy': '😊',
  'sad': '😢',
  'angry': '😡',
  'thinking': '🤔',
  'wow': '😍',
  'cool': '😎',
  'thumbs up': '👍',
  'good': '👍',
  'bad': '👎',
  'thumbs down': '👎',
  'clap': '👏',
  'applause': '👏',
  'strong': '💪',
  'power': '💪',
  'eyes': '👀',
  'look': '👀',
  'watch': '👀',
};

function applyAbbreviations(text: string): string {
  let result = text.toLowerCase();
  
  // Apply abbreviations (longest first to avoid partial matches)
  const sortedKeys = Object.keys(COMMON_ABBREVIATIONS).sort((a, b) => b.length - a.length);
  
  for (const word of sortedKeys) {
    const abbrev = COMMON_ABBREVIATIONS[word];
    // Use word boundaries to avoid partial replacements
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    result = result.replace(regex, abbrev);
  }
  
  return result;
}

function removeVowels(text: string): string {
  return text
    .split(' ')
    .map(word => {
      if (word.length <= 3 || VOWEL_REMOVAL_EXCEPTIONS.has(word.toLowerCase())) {
        return word;
      }
      // Keep first character and remove internal vowels, keep consonant clusters
      let result = word[0];
      for (let i = 1; i < word.length - 1; i++) {
        const char = word[i].toLowerCase();
        if (!'aeiou'.includes(char) || 
            (i > 1 && !'aeiou'.includes(word[i-1].toLowerCase()))) {
          result += word[i];
        }
      }
      if (word.length > 1) result += word[word.length - 1];
      return result;
    })
    .join(' ');
}

function addEmojiSubstitutions(text: string): string {
  let result = text;
  
  for (const [word, emoji] of Object.entries(EMOJI_SUBSTITUTIONS)) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    result = result.replace(regex, emoji);
  }
  
  return result;
}

function removeUnnecessaryWords(text: string): string {
  const fillerWords = ['the', 'a', 'an', 'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'shall', 'must'];
  
  return text
    .split(' ')
    .filter(word => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
      return !fillerWords.includes(cleanWord);
    })
    .join(' ');
}

function capitalizeImportantWords(text: string): string {
  const importantWords = ['flutterbye', 'token', 'crypto', 'nft', 'defi', 'btc', 'eth', 'sol'];
  
  return text
    .split(' ')
    .map(word => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
      if (importantWords.includes(cleanWord)) {
        return word.toUpperCase();
      }
      return word;
    })
    .join(' ');
}

function addCryptoSlang(text: string): string {
  const cryptoReplacements: Record<string, string> = {
    'to the moon': '2moon',
    'diamond hands': '💎🙌',
    'paper hands': '📄🙌',
    'hold': 'hodl',
    'buy the dip': 'btd',
    'fear of missing out': 'fomo',
    'all time high': 'ath',
    'all time low': 'atl',
    'let me know': 'lmk',
    'going to': 'gonna',
    'want to': 'wanna',
    'have to': 'gotta',
  };
  
  let result = text;
  for (const [phrase, replacement] of Object.entries(cryptoReplacements)) {
    const regex = new RegExp(phrase, 'gi');
    result = result.replace(regex, replacement);
  }
  
  return result;
}

export function optimizeTextFor27Chars(inputText: string): OptimizationSuggestion[] {
  if (!inputText.trim()) return [];
  
  const suggestions: OptimizationSuggestion[] = [];
  
  // Original with just trimming
  const trimmed = inputText.trim();
  if (trimmed.length <= 27) {
    suggestions.push({
      text: trimmed,
      technique: 'Original (already fits)',
      score: 100
    });
    return suggestions;
  }
  
  // Strategy 1: Abbreviations only
  let abbrevText = applyAbbreviations(trimmed);
  if (abbrevText.length <= 27) {
    suggestions.push({
      text: abbrevText,
      technique: 'Common abbreviations',
      score: 95
    });
  }
  
  // Strategy 2: Abbreviations + remove filler words
  let noFillerText = removeUnnecessaryWords(abbrevText);
  if (noFillerText.length <= 27) {
    suggestions.push({
      text: noFillerText,
      technique: 'Abbreviations + removed filler words',
      score: 90
    });
  }
  
  // Strategy 3: Add crypto slang
  let cryptoText = addCryptoSlang(noFillerText);
  if (cryptoText.length <= 27) {
    suggestions.push({
      text: cryptoText,
      technique: 'Crypto slang optimization',
      score: 88
    });
  }
  
  // Strategy 4: Add emojis for common words
  let emojiText = addEmojiSubstitutions(cryptoText);
  if (emojiText.length <= 27) {
    suggestions.push({
      text: emojiText,
      technique: 'Emoji substitutions',
      score: 85
    });
  }
  
  // Strategy 5: Remove vowels from longer words
  let vowelText = removeVowels(emojiText);
  if (vowelText.length <= 27) {
    suggestions.push({
      text: vowelText,
      technique: 'Vowel removal',
      score: 80
    });
  }
  
  // Strategy 6: Aggressive truncation with ellipsis
  if (suggestions.length === 0) {
    const truncated = trimmed.substring(0, 24) + '...';
    suggestions.push({
      text: truncated,
      technique: 'Truncated with ellipsis',
      score: 60
    });
  }
  
  // Strategy 7: Take key words only
  const keyWords = trimmed
    .split(' ')
    .filter(word => word.length > 2)
    .slice(0, 4)
    .join(' ');
  
  if (keyWords.length <= 27 && keyWords.length > 0) {
    suggestions.push({
      text: keyWords,
      technique: 'Key words only',
      score: 70
    });
  }
  
  // Remove duplicates and sort by score
  const uniqueSuggestions = suggestions
    .filter((suggestion, index, self) => 
      index === self.findIndex(s => s.text === suggestion.text)
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, 5); // Return top 5 suggestions
  
  return uniqueSuggestions;
}

export function getOptimizationTips(): string[] {
  return [
    "Use '&' instead of 'and'",
    "Replace 'you' with 'u' and 'your' with 'ur'",
    "Use numbers: '2' for 'to', '4' for 'for'",
    "Try emojis: ❤️ for 'love', 🔥 for 'fire', 💰 for 'money'",
    "Remove vowels from longer words: 'awesome' → 'awsm'",
    "Use crypto slang: 'hold' → 'hodl', 'to the moon' → '2moon'",
    "Drop filler words: 'the', 'a', 'is', 'are'",
    "Abbreviate: 'because' → 'bc', 'through' → 'thru'"
  ];
}