import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, MessageCircle, Sparkles, User, Bot, Lightbulb, Target, Heart, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface FlutterinaMessage {
  id: string;
  messageType: 'user' | 'ai' | 'system';
  message: string;
  timestamp: Date;
  containsRecommendations?: boolean;
  recommendationData?: {
    products: Array<{
      type: string;
      title: string;
      description: string;
      action: string;
      priority: 'high' | 'medium' | 'low';
      reasoning: string;
    }>;
    nextActions: string[];
    learningPath: string[];
    customizedTips: string[];
  };
  costInfo?: {
    allowed: boolean;
    reason?: string;
    usageStats?: any;
  };
}

interface PersonalityProfile {
  communicationStyle: 'technical' | 'casual' | 'formal' | 'enthusiastic';
  knowledgeLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  interests: string[];
  personalityTraits: string[];
  preferredHelpStyle: 'detailed' | 'quick' | 'examples' | 'explanations' | 'balanced';
  engagementLevel: 'high' | 'medium' | 'low';
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  socialLevel: 'introvert' | 'balanced' | 'extrovert';
  confidenceScore: number;
}

interface SmartAssistance {
  greeting: string;
  contextualHelp: string[];
  recommendations: {
    products: Array<{
      type: string;
      title: string;
      description: string;
      action: string;
      priority: 'high' | 'medium' | 'low';
      reasoning: string;
    }>;
    nextActions: string[];
    learningPath: string[];
    customizedTips: string[];
  };
  quickActions: Array<{ label: string; action: string; description: string }>;
  learningOpportunities: string[];
}

export default function SkyeEnhancedChatbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<FlutterinaMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState('/');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [personalityProfile, setPersonalityProfile] = useState<PersonalityProfile | null>(null);
  const [smartAssistance, setSmartAssistance] = useState<SmartAssistance | null>(null);
  const [showPersonalityInsights, setShowPersonalityInsights] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [usageStats, setUsageStats] = useState<any>(null);
  const [systemEnabled, setSystemEnabled] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Phase 2: Wallet Detection
  useEffect(() => {
    const detectWallet = () => {
      const wallet = (window as any)?.solana?.publicKey?.toString();
      if (wallet && wallet !== walletAddress) {
        setWalletAddress(wallet);
        console.log('Wallet connected:', wallet);
      }
    };

    detectWallet();
    const interval = setInterval(detectWallet, 1000);
    return () => clearInterval(interval);
  }, [walletAddress]);

  // Track current page for context awareness
  useEffect(() => {
    setCurrentPage(window.location.pathname);
    
    const handleLocationChange = () => {
      setCurrentPage(window.location.pathname);
    };
    
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Initialize conversation and load smart assistance
  useEffect(() => {
    if (isOpen && !conversationId && systemEnabled) {
      initializeConversation();
    }
  }, [isOpen, walletAddress, systemEnabled]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeConversation = async () => {
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const response = await apiRequest('/api/flutterina/conversation', {
        method: 'POST',
        body: JSON.stringify({
          sessionId,
          currentPage,
          walletAddress,
          userIntent: 'help'
        })
      });

      setConversationId(response.id);
      
      // Load smart assistance (Phase 4)
      await loadSmartAssistance(response.id);
      
      // Add welcome message with personality
      if (smartAssistance?.greeting) {
        const welcomeMessage: FlutterinaMessage = {
          id: `welcome_${Date.now()}`,
          messageType: 'ai',
          message: smartAssistance.greeting,
          timestamp: new Date(),
          containsRecommendations: smartAssistance.recommendations.products.length > 0,
          recommendationData: smartAssistance.recommendations
        };
        setMessages([welcomeMessage]);
      }
      
    } catch (error) {
      console.error('Failed to initialize conversation:', error);
      setSystemEnabled(false);
      toast({
        title: "Connection Issue",
        description: "Flutterina is temporarily unavailable. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const loadSmartAssistance = async (convId: string) => {
    try {
      const response = await apiRequest(`/api/flutterina/smart-assistance/${convId}`);
      setSmartAssistance(response);
      
      // Load personality profile if available
      if (walletAddress) {
        try {
          const profileResponse = await apiRequest(`/api/flutterina/personality/${walletAddress}`);
          setPersonalityProfile(profileResponse);
        } catch (error) {
          // Profile doesn't exist yet - will be created after enough interactions
          console.log('No personality profile yet - will be created automatically');
        }
      }
    } catch (error) {
      console.error('Failed to load smart assistance:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !conversationId || !systemEnabled) return;

    const userMessage: FlutterinaMessage = {
      id: `user_${Date.now()}`,
      messageType: 'user',
      message: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await apiRequest('/api/flutterina/message', {
        method: 'POST',
        body: JSON.stringify({
          conversationId,
          message: inputMessage.trim(),
          messageType: 'user'
        })
      });

      const aiMessage: FlutterinaMessage = {
        id: `ai_${Date.now()}`,
        messageType: 'ai',
        message: response.response,
        timestamp: new Date(),
        containsRecommendations: response.containsRecommendations,
        recommendationData: response.recommendationData,
        costInfo: response.costInfo
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Update usage stats
      if (response.costInfo?.usageStats) {
        setUsageStats(response.costInfo.usageStats);
      }
      
      // Check if personality profile was updated
      if (response.personalityUpdated && walletAddress) {
        const profileResponse = await apiRequest(`/api/flutterina/personality/${walletAddress}`);
        setPersonalityProfile(profileResponse);
      }

    } catch (error: any) {
      console.error('Failed to send message:', error);
      
      let errorMessage = "I'm having trouble connecting right now. Please try again.";
      
      if (error.message?.includes('token limit')) {
        errorMessage = "You've reached your daily conversation limit. Try again tomorrow or contact support for increased limits.";
        setSystemEnabled(false);
      } else if (error.message?.includes('system disabled')) {
        errorMessage = "I'm temporarily offline for maintenance. Please check back soon!";
        setSystemEnabled(false);
      }

      const errorAiMessage: FlutterinaMessage = {
        id: `error_${Date.now()}`,
        messageType: 'ai',
        message: errorMessage,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorAiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const executeQuickAction = async (action: string) => {
    const actionMessages = {
      'create-token': "I'd like to create my first token. Can you guide me through the process?",
      'explore-marketplace': "Show me what's available in the marketplace and help me understand how trading works.",
      'premium-trading': "I'm interested in high-value trading features. What advanced options are available?",
      'learn-features': "Help me understand all the platform features and how to use them effectively."
    };

    const message = actionMessages[action as keyof typeof actionMessages] || `Help me with ${action}`;
    setInputMessage(message);
    await sendMessage();
  };

  const getPriorityIcon = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return <TrendingUp className="w-3 h-3 text-red-400" />;
      case 'medium': return <Target className="w-3 h-3 text-yellow-400" />;
      case 'low': return <Lightbulb className="w-3 h-3 text-blue-400" />;
    }
  };

  const getEngagementColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (!systemEnabled) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-red-900/90 backdrop-blur-sm border border-red-700 rounded-lg p-4 max-w-sm">
          <div className="flex items-center gap-2 text-red-100">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">Flutterina is temporarily offline</span>
          </div>
        </div>
      </div>
    );
  }

  const chatboxContent = (
    <div className={`
      fixed bottom-4 right-4 z-50 
      ${isOpen ? 'w-96 h-[600px]' : 'w-auto h-auto'}
      transition-all duration-300 ease-in-out
    `}>
      {!isOpen ? (
        // Floating Button with Personality Indicator
        <Button
          onClick={() => setIsOpen(true)}
          className="
            relative w-14 h-14 rounded-full 
            bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600
            hover:from-blue-500 hover:via-purple-500 hover:to-pink-500
            border-2 border-white/20 shadow-lg hover:shadow-xl
            transition-all duration-300 group
          "
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 animate-pulse" />
          <MessageCircle className="w-6 h-6 text-white relative z-10" />
          <Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1 animate-bounce" />
          
          {/* Personality Level Indicator */}
          {personalityProfile && (
            <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
              <Heart className="w-3 h-3 text-white" />
            </div>
          )}
        </Button>
      ) : (
        // Enhanced Chat Interface
        <div className="
          bg-gray-900/95 backdrop-blur-lg border border-gray-700 rounded-xl shadow-2xl
          flex flex-col overflow-hidden
          border-t-4 border-t-gradient-to-r from-blue-500 via-purple-500 to-pink-500
        ">
          {/* Header with Advanced Controls */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-400 border border-gray-900" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Flutterina AI</h3>
                <p className="text-gray-400 text-xs">
                  {personalityProfile ? 
                    `${personalityProfile.knowledgeLevel} • ${personalityProfile.communicationStyle}` : 
                    'Learning about you...'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Personality Insights Button */}
              {personalityProfile && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowPersonalityInsights(!showPersonalityInsights)}
                  className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 p-1"
                >
                  <User className="w-4 h-4" />
                </Button>
              )}
              
              {/* Recommendations Button */}
              {smartAssistance?.recommendations.products.length > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowRecommendations(!showRecommendations)}
                  className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 p-1"
                >
                  <Lightbulb className="w-4 h-4" />
                </Button>
              )}
              
              {/* Minimize/Close */}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-gray-400 hover:text-gray-300 hover:bg-gray-500/10 p-1"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-300 hover:bg-gray-500/10 p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Personality Insights Panel */}
              {showPersonalityInsights && personalityProfile && (
                <div className="p-3 bg-purple-900/20 border-b border-gray-700">
                  <h4 className="text-purple-300 font-medium text-sm mb-2">Your AI Personality Profile</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400">Style:</span>
                      <span className="text-white ml-1">{personalityProfile.communicationStyle}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Level:</span>
                      <span className="text-white ml-1">{personalityProfile.knowledgeLevel}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Engagement:</span>
                      <span className={`ml-1 ${getEngagementColor(personalityProfile.engagementLevel)}`}>
                        {personalityProfile.engagementLevel}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Risk:</span>
                      <span className="text-white ml-1">{personalityProfile.riskTolerance}</span>
                    </div>
                  </div>
                  {personalityProfile.interests.length > 0 && (
                    <div className="mt-2">
                      <span className="text-gray-400 text-xs">Interests:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {personalityProfile.interests.slice(0, 3).map((interest, idx) => (
                          <span key={idx} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Smart Recommendations Panel */}
              {showRecommendations && smartAssistance?.recommendations && (
                <div className="p-3 bg-yellow-900/20 border-b border-gray-700 max-h-40 overflow-y-auto">
                  <h4 className="text-yellow-300 font-medium text-sm mb-2">Personalized Recommendations</h4>
                  {smartAssistance.recommendations.products.slice(0, 2).map((product, idx) => (
                    <div key={idx} className="mb-2 p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
                      <div className="flex items-center gap-2 mb-1">
                        {getPriorityIcon(product.priority)}
                        <span className="text-yellow-200 text-sm font-medium">{product.title}</span>
                      </div>
                      <p className="text-gray-300 text-xs mb-1">{product.description}</p>
                      <p className="text-yellow-400 text-xs italic">{product.reasoning}</p>
                    </div>
                  ))}
                  
                  {smartAssistance.recommendations.customizedTips.length > 0 && (
                    <div className="mt-2">
                      <span className="text-yellow-300 text-xs font-medium">💡 Personalized Tips:</span>
                      <ul className="text-xs text-gray-300 mt-1 space-y-1">
                        {smartAssistance.recommendations.customizedTips.slice(0, 2).map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-yellow-400">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Actions */}
              {smartAssistance?.quickActions && smartAssistance.quickActions.length > 0 && (
                <div className="p-3 bg-blue-900/20 border-b border-gray-700">
                  <h4 className="text-blue-300 font-medium text-sm mb-2">Quick Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    {smartAssistance.quickActions.slice(0, 3).map((action, idx) => (
                      <Button
                        key={idx}
                        size="sm"
                        variant="outline"
                        onClick={() => executeQuickAction(action.action)}
                        className="text-xs px-2 py-1 h-auto bg-blue-500/10 border-blue-500/30 text-blue-300 hover:bg-blue-500/20"
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-80">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.messageType === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.messageType === 'ai' && (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                    )}
                    
                    <div className={`
                      max-w-[75%] rounded-lg p-3 
                      ${message.messageType === 'user' 
                        ? 'bg-blue-600 text-white ml-auto' 
                        : 'bg-gray-800 text-gray-100 border border-gray-700'
                      }
                    `}>
                      <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                      
                      {/* Enhanced Recommendations Display */}
                      {message.containsRecommendations && message.recommendationData && (
                        <div className="mt-3 pt-3 border-t border-gray-600">
                          {message.recommendationData.products.length > 0 && (
                            <div className="space-y-2">
                              <h5 className="text-xs font-semibold text-purple-300 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                Smart Recommendations
                              </h5>
                              {message.recommendationData.products.slice(0, 2).map((product, idx) => (
                                <div key={idx} className="bg-purple-500/10 rounded p-2 border border-purple-500/20">
                                  <div className="flex items-center gap-2 mb-1">
                                    {getPriorityIcon(product.priority)}
                                    <span className="text-purple-200 text-xs font-medium">{product.title}</span>
                                  </div>
                                  <p className="text-gray-300 text-xs">{product.description}</p>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {message.recommendationData.nextActions.length > 0 && (
                            <div className="mt-2">
                              <h6 className="text-xs font-medium text-blue-300 mb-1">Next Steps:</h6>
                              <ul className="text-xs text-gray-300 space-y-1">
                                {message.recommendationData.nextActions.slice(0, 2).map((action, idx) => (
                                  <li key={idx} className="flex items-start gap-1">
                                    <span className="text-blue-400">•</span>
                                    <span>{action}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-600">
                        <span className="text-xs text-gray-400">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        
                        {/* Cost Information */}
                        {message.costInfo && (
                          <div className="text-xs text-gray-500">
                            {message.costInfo.usageStats?.userUsage?.remaining && (
                              <span title="Remaining daily messages">
                                {message.costInfo.usageStats.userUsage.remaining} left
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {message.messageType === 'user' && (
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Enhanced Input Area */}
              <div className="p-4 border-t border-gray-700 bg-gray-900/50">
                {/* Usage Stats Display */}
                {usageStats && (
                  <div className="mb-2 text-xs text-gray-500 flex justify-between">
                    <span>Daily usage: {usageStats.userUsage?.daily || 0}</span>
                    <span>Remaining: {usageStats.userUsage?.remaining || 0}</span>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Textarea
                    ref={textareaRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      personalityProfile?.preferredHelpStyle === 'quick' ?
                        "Ask me anything (I'll keep it brief)" :
                        "Ask me anything about Flutterbye..."
                    }
                    className="
                      flex-1 resize-none bg-gray-800 border-gray-600 text-white 
                      placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500
                      min-h-[40px] max-h-[120px]
                    "
                    disabled={isLoading || !systemEnabled}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading || !systemEnabled}
                    className="
                      bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600
                      hover:from-blue-500 hover:via-purple-500 hover:to-pink-500
                      text-white border-0 self-end px-4
                    "
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span>Send</span>
                    )}
                  </Button>
                </div>
                
                {/* Contextual Help */}
                {smartAssistance?.contextualHelp && (
                  <div className="mt-2 text-xs text-gray-500">
                    💡 {smartAssistance.contextualHelp[0]}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );

  return createPortal(chatboxContent, document.body);
}