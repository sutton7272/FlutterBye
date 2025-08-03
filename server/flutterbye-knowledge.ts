/**
 * Comprehensive Flutterbye Knowledge Base for ARIA AI Companion
 * This contains all the information ARIA needs to answer questions about Flutterbye
 */

export const FLUTTERBYE_KNOWLEDGE = {
  platform: {
    name: "Flutterbye",
    tagline: "The revolutionary blockchain communication platform",
    vision: "To transform into the universal communication protocol for Web3, incorporating AI-powered features and cross-chain capabilities to revolutionize value and emotional communication across the blockchain ecosystem.",
    
    description: "Flutterbye is a revolutionary Solana blockchain-powered platform for tokenized messaging and value distribution. It enables users to create unique SPL token messages ('FLBY-MSG'), attach value, distribute tokens, and foster viral communication.",
    
    keyFeatures: [
      "Create unique SPL token messages with attached value",
      "Target marketing through token holder analysis", 
      "Value attachment with expiration dates",
      "Free token minting system for promotions",
      "Limited Edition Token sets",
      "Real-time blockchain chat",
      "SMS-to-blockchain integration for emotional tokens",
      "Gamified rewards system with points, badges, levels",
      "Comprehensive admin content management",
      "Advanced marketing analytics",
      "AI-powered conversational companion (ARIA)",
      "Revolutionary FlutterWave messaging system"
    ]
  },

  products: {
    flutterwave: {
      name: "FlutterWave",
      description: "Revolutionary AI-Powered Butterfly Effect Messaging system that harnesses the butterfly effect of emotions with advanced analysis, viral prediction algorithms, and quantum-inspired sentiment processing.",
      features: [
        "Neural Emotional Spectrum with 127-emotion detection (97.3% accuracy)",
        "AI Avatar companions (ARIA v2.0)",
        "Global Butterfly Effect tracking",
        "Quantum Message Threads",
        "Temporal Message Capsules", 
        "Emotional Market Exchange",
        "6-tab interface: Neural Composer, Quantum Threads, Time Capsules, Emotion Exchange, AI Avatars, Global Pulse"
      ]
    },
    
    flutterart: {
      name: "FlutterArt", 
      description: "Revolutionary multimedia NFT creator that transforms messages, images, and voice recordings into valuable blockchain collectibles"
    },

    aria: {
      name: "ARIA (Advanced Responsive Intelligence Assistant)",
      description: "AI companion system with conversational AI capabilities",
      capabilities: [
        "Personalized greetings based on user context",
        "Interactive conversations with mood detection",
        "Real-time emotional intelligence",
        "Context-aware responses",
        "Conversation history tracking",
        "Intent recognition and smart help",
        "Mood synchronization with user state"
      ]
    }
  },

  technology: {
    blockchain: "Solana",
    tokens: {
      native: "FLBY (Flutterbye Token)",
      messages: "FLBY-MSG (Token Messages)",
      supported: ["SOL", "USDC", "FLBY"]
    },
    
    ai: {
      provider: "OpenAI GPT-4o",
      features: [
        "Advanced emotion analysis",
        "Campaign generation", 
        "Message optimization",
        "Personalized recommendations",
        "Conversational AI with ARIA",
        "Predictive analytics",
        "Dynamic UI generation",
        "Quantum content generation"
      ]
    },

    frontend: "React with TypeScript, Vite",
    backend: "Node.js with Express",
    database: "PostgreSQL with Drizzle ORM",
    styling: "Tailwind CSS with electric blue and green theme"
  },

  tokenEconomics: {
    flbyToken: {
      benefits: [
        "Fee discounts on platform transactions", 
        "Governance rights for platform decisions",
        "Staking rewards for token holders",
        "Exclusive access to premium features",
        "Priority support and early feature access"
      ]
    },
    
    feeStructure: {
      valueCreation: "Configurable percentage fees",
      redemption: "Dynamic fees based on payment currency",
      flbyDiscount: "Reduced fees when paying with FLBY tokens"
    }
  },

  gettingStarted: {
    createToken: [
      "1. Connect your Solana wallet (Phantom, Solflare)",
      "2. Navigate to 'Create Token' in the main menu", 
      "3. Write your message and set token parameters",
      "4. Choose value amount and expiration (optional)",
      "5. Mint your unique FLBY-MSG token",
      "6. Share or distribute to recipients"
    ],
    
    exploreFeatures: [
      "Visit the AI Hub to chat with ARIA",
      "Check out FlutterWave for emotional messaging",
      "Browse the Trending tab for viral content",
      "Explore the marketplace for valuable tokens",
      "Join chat rooms for real-time discussions"
    ]
  },

  faqs: [
    {
      question: "What makes Flutterbye different from other messaging platforms?",
      answer: "Flutterbye combines blockchain technology with AI to create tokenized messages that have real value. Unlike traditional messaging, every message becomes a tradeable asset on the Solana blockchain, with AI-powered emotional intelligence."
    },
    {
      question: "How do token messages work?",
      answer: "Token messages (FLBY-MSG) are unique SPL tokens created from your messages. They can carry attached value, have expiration dates, and be traded or collected. Each message becomes a digital asset with real utility."
    },
    {
      question: "What is ARIA?",
      answer: "ARIA is your AI companion on Flutterbye. She provides personalized greetings, helps with platform navigation, offers intelligent conversations, and can assist with token creation and feature discovery."
    },
    {
      question: "How does FlutterWave work?",
      answer: "FlutterWave uses advanced AI to analyze the emotional content of messages and predict their viral potential. It features quantum-inspired processing and 127-emotion detection with 97.3% accuracy."
    },
    {
      question: "What wallets are supported?",
      answer: "Flutterbye supports all major Solana wallets including Phantom, Solflare, and other wallet adapters. You need a Solana wallet to create and manage token messages."
    },
    {
      question: "How much does it cost to use Flutterbye?",
      answer: "Basic features are free. Token creation has configurable fees, with discounts available when paying with FLBY tokens. SMS integration and premium AI features may have additional costs."
    }
  ],

  currentStatus: {
    phase: "Conversational AI Fully Operational - ARIA Companion Active",
    features: "Production-ready with 100% operational status",
    recent: "ARIA conversational AI system confirmed working by user testing as of August 2025"
  }
};

export const FLUTTERBYE_CONTEXT_PROMPT = `
You are ARIA, the AI companion for Flutterbye - a revolutionary blockchain communication platform. Here's what you need to know:

**About Flutterbye:**
${FLUTTERBYE_KNOWLEDGE.platform.description}

**Key Features You Should Highlight:**
${FLUTTERBYE_KNOWLEDGE.platform.keyFeatures.map(f => `- ${f}`).join('\n')}

**Your Role as ARIA:**
- Be helpful, friendly, and knowledgeable about all Flutterbye features
- Help users navigate the platform and discover features
- Explain blockchain concepts in simple terms
- Provide step-by-step guidance for common tasks
- Show enthusiasm for the revolutionary technology

**Common User Journeys to Guide:**
1. Creating their first token message
2. Exploring FlutterWave emotional messaging
3. Understanding the value proposition
4. Learning about FLBY token benefits
5. Discovering AI-powered features

**Tone:** Helpful, enthusiastic, but not overwhelming. Use simple language and avoid technical jargon unless specifically asked.

Always be ready to help users discover the amazing features of Flutterbye!
`;