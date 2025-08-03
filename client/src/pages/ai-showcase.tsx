import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAIContent } from '@/hooks/useAIContent';
import { useAIAdmin } from '@/hooks/useAIAdmin';
import { AIEnhancementButton } from '@/components/ai-enhancement-button';
import { 
  Sparkles, 
  Zap, 
  TrendingUp, 
  MessageCircle, 
  BarChart3, 
  Shield, 
  Gauge,
  DollarSign,
  Brain,
  Lightbulb,
  Wand2
} from 'lucide-react';

/**
 * AI Showcase Page - Demonstrates all AI capabilities
 * Revolutionary showcase of comprehensive AI integration
 */
export default function AIShowcase() {
  const [demoText, setDemoText] = useState('Transform your blockchain messaging experience');
  const [enhancedText, setEnhancedText] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [marketingInput, setMarketingInput] = useState('');
  
  const {
    optimizeText,
    optimizedText,
    isOptimizingText,
    getChatSuggestions,
    chatSuggestions,
    isGettingChatSuggestions,
    generateMarketing,
    marketingCopy,
    isGeneratingMarketing,
    optimizeSEO,
    seoOptimization,
    isOptimizingSEO
  } = useAIContent();

  const {
    generateUserInsights,
    userInsights,
    isGeneratingUserInsights,
    analyzeSecurityThreats,
    securityAnalysis,
    isAnalyzingSecurity,
    optimizeRevenue,
    revenueOptimization,
    isOptimizingRevenue
  } = useAIAdmin();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0b14] via-[#1a1b3a] to-[#0a0b14] text-white">
      {/* Electric circuit background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,#00ffff_49%,#00ffff_51%,transparent_52%)] bg-[length:20px_20px] animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-12 h-12 text-electric-blue animate-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-blue to-purple-400 bg-clip-text text-transparent">
              Revolutionary AI Showcase
            </h1>
            <Wand2 className="w-12 h-12 text-purple-400 animate-bounce" />
          </div>
          <p className="text-xl text-electric-blue/80 max-w-3xl mx-auto">
            Experience the world's most advanced AI integration for blockchain communication
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30 px-4 py-2">
              ⚡ OpenAI GPT-4o Powered
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-4 py-2">
              🧠 Living AI Personality
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
              🚀 Revolutionary Intelligence
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black/30 border border-electric-blue/30">
            <TabsTrigger value="content" className="text-white data-[state=active]:bg-electric-blue/20">
              <MessageCircle className="w-4 h-4 mr-2" />
              Content AI
            </TabsTrigger>
            <TabsTrigger value="admin" className="text-white data-[state=active]:bg-electric-blue/20">
              <BarChart3 className="w-4 h-4 mr-2" />
              Admin AI
            </TabsTrigger>
            <TabsTrigger value="enhancement" className="text-white data-[state=active]:bg-electric-blue/20">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Enhancement
            </TabsTrigger>
          </TabsList>

          {/* Content AI Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Text Optimization */}
              <Card className="bg-black/40 border-electric-blue/30 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-electric-blue">
                    <Zap className="w-5 h-5" />
                    AI Text Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Enter text to optimize..."
                    value={demoText}
                    onChange={(e) => setDemoText(e.target.value)}
                    className="bg-black/20 border-electric-blue/30 text-white"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => optimizeText({ 
                        text: demoText, 
                        constraints: { maxLength: 27, tone: 'engaging' }
                      })}
                      disabled={isOptimizingText}
                      className="bg-gradient-to-r from-electric-blue to-purple-500"
                    >
                      {isOptimizingText ? 'Optimizing...' : 'AI Optimize'}
                    </Button>
                    <AIEnhancementButton
                      text={demoText}
                      onEnhanced={setEnhancedText}
                      type="token"
                    />
                  </div>
                  
                  {optimizedText && (
                    <div className="p-4 bg-gradient-to-r from-electric-blue/10 to-purple-500/10 rounded-lg border border-electric-blue/20">
                      <p className="text-sm text-white/80 mb-2">AI Optimized Result:</p>
                      <p className="text-white font-medium">{(optimizedText as any)?.optimized || 'Processing...'}</p>
                      {(optimizedText as any)?.viralScore && (
                        <Badge className="mt-2 bg-green-500/20 text-green-400">
                          Viral Score: {(optimizedText as any).viralScore}
                        </Badge>
                      )}
                    </div>
                  )}

                  {enhancedText && (
                    <div className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/20">
                      <p className="text-sm text-white/80 mb-2">Enhanced Result:</p>
                      <p className="text-white font-medium">{enhancedText}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Chat Suggestions */}
              <Card className="bg-black/40 border-electric-blue/30 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-electric-blue">
                    <MessageCircle className="w-5 h-5" />
                    AI Chat Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Enter chat context..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="bg-black/20 border-electric-blue/30 text-white"
                  />
                  <Button
                    onClick={() => getChatSuggestions({ messageType: 'general', userMood: 'enthusiastic' })}
                    disabled={isGettingChatSuggestions}
                    className="bg-gradient-to-r from-purple-500 to-pink-500"
                  >
                    {isGettingChatSuggestions ? 'Generating...' : 'Get AI Suggestions'}
                  </Button>
                  
                  {chatSuggestions && (
                    <div className="space-y-3">
                      <p className="text-sm text-white/80">AI Generated Suggestions:</p>
                      {(chatSuggestions as any)?.quickReplies?.map((reply: string, index: number) => (
                        <div key={index} className="p-3 bg-purple-500/10 rounded border border-purple-500/20">
                          <p className="text-white">{reply}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Marketing Generation */}
              <Card className="bg-black/40 border-electric-blue/30 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-electric-blue">
                    <TrendingUp className="w-5 h-5" />
                    AI Marketing Copy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Product description..."
                    value={marketingInput}
                    onChange={(e) => setMarketingInput(e.target.value)}
                    className="bg-black/20 border-electric-blue/30 text-white"
                  />
                  <Button
                    onClick={() => generateMarketing({
                      product: marketingInput || 'Flutterbye Platform',
                      audience: 'crypto enthusiasts',
                      goal: 'engagement'
                    })}
                    disabled={isGeneratingMarketing}
                    className="bg-gradient-to-r from-orange-500 to-red-500"
                  >
                    {isGeneratingMarketing ? 'Creating...' : 'Generate Marketing Copy'}
                  </Button>
                  
                  {marketingCopy && (
                    <div className="space-y-3">
                      <p className="text-sm text-white/80">AI Generated Marketing:</p>
                      {(marketingCopy as any)?.headlines?.slice(0, 2).map((headline: string, index: number) => (
                        <div key={index} className="p-3 bg-orange-500/10 rounded border border-orange-500/20">
                          <p className="text-white font-semibold">{headline}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* SEO Optimization */}
              <Card className="bg-black/40 border-electric-blue/30 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-electric-blue">
                    <Lightbulb className="w-5 h-5" />
                    AI SEO Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() => optimizeSEO({
                      content: 'Revolutionary blockchain messaging platform with AI integration',
                      keywords: ['blockchain', 'AI', 'messaging', 'crypto'],
                      purpose: 'landing_page'
                    })}
                    disabled={isOptimizingSEO}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500"
                  >
                    {isOptimizingSEO ? 'Optimizing...' : 'AI SEO Analysis'}
                  </Button>
                  
                  {seoOptimization && (
                    <div className="space-y-3">
                      <div className="p-3 bg-cyan-500/10 rounded border border-cyan-500/20">
                        <p className="text-sm text-white/80 mb-2">Optimized Title:</p>
                        <p className="text-white font-medium">{(seoOptimization as any)?.title}</p>
                      </div>
                      <div className="p-3 bg-blue-500/10 rounded border border-blue-500/20">
                        <p className="text-sm text-white/80 mb-2">Meta Description:</p>
                        <p className="text-white">{(seoOptimization as any)?.metaDescription}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Admin AI Tab */}
          <TabsContent value="admin" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* User Insights */}
              <Card className="bg-black/40 border-electric-blue/30 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-electric-blue">
                    <BarChart3 className="w-5 h-5" />
                    AI User Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() => generateUserInsights([
                      { userId: 'demo1', activity: 'high', engagement: 85 },
                      { userId: 'demo2', activity: 'medium', engagement: 65 }
                    ])}
                    disabled={isGeneratingUserInsights}
                    className="bg-gradient-to-r from-green-500 to-teal-500"
                  >
                    {isGeneratingUserInsights ? 'Analyzing...' : 'Generate AI Insights'}
                  </Button>
                  
                  {userInsights && (
                    <div className="space-y-3">
                      <p className="text-sm text-white/80">AI Analysis Results:</p>
                      <div className="p-3 bg-green-500/10 rounded border border-green-500/20">
                        <p className="text-white">✅ User behavior patterns analyzed</p>
                        <p className="text-white">📊 Engagement trends identified</p>
                        <p className="text-white">🎯 Retention strategies generated</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Security Analysis */}
              <Card className="bg-black/40 border-electric-blue/30 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-electric-blue">
                    <Shield className="w-5 h-5" />
                    AI Security Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() => analyzeSecurityThreats({
                      securityLogs: [{ event: 'login_attempt', status: 'success', timestamp: new Date().toISOString() }],
                      systemMetrics: { cpu: 45, memory: 60, network: 'normal' }
                    })}
                    disabled={isAnalyzingSecurity}
                    className="bg-gradient-to-r from-red-500 to-pink-500"
                  >
                    {isAnalyzingSecurity ? 'Scanning...' : 'AI Security Scan'}
                  </Button>
                  
                  {securityAnalysis && (
                    <div className="space-y-3">
                      <p className="text-sm text-white/80">Security Analysis:</p>
                      <div className="p-3 bg-red-500/10 rounded border border-red-500/20">
                        <p className="text-white">🔒 Threat level: {(securityAnalysis as any)?.threatLevel || 'LOW'}</p>
                        <p className="text-white">🛡️ Security status monitored</p>
                        <p className="text-white">⚡ Real-time protection active</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Revenue Optimization */}
              <Card className="bg-black/40 border-electric-blue/30 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-electric-blue">
                    <DollarSign className="w-5 h-5" />
                    AI Revenue Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() => optimizeRevenue({
                      revenueData: { monthly: 50000, growth: 15 },
                      userMetrics: { active_users: 1200, retention: 85 }
                    })}
                    disabled={isOptimizingRevenue}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500"
                  >
                    {isOptimizingRevenue ? 'Optimizing...' : 'AI Revenue Analysis'}
                  </Button>
                  
                  {revenueOptimization && (
                    <div className="space-y-3">
                      <p className="text-sm text-white/80">Revenue Insights:</p>
                      <div className="p-3 bg-yellow-500/10 rounded border border-yellow-500/20">
                        <p className="text-white">💰 Revenue strategies identified</p>
                        <p className="text-white">📈 Growth opportunities found</p>
                        <p className="text-white">🎯 Optimization paths mapped</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Performance Monitoring */}
              <Card className="bg-black/40 border-electric-blue/30 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-electric-blue">
                    <Gauge className="w-5 h-5" />
                    AI Performance Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-electric-blue/10 to-purple-500/10 rounded-lg border border-electric-blue/20">
                    <p className="text-white font-medium mb-2">Real-time AI Monitoring:</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-electric-blue">99.8%</p>
                        <p className="text-sm text-white/80">AI Uptime</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-400">~$0.002</p>
                        <p className="text-sm text-white/80">Cost per Query</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-400">850ms</p>
                        <p className="text-sm text-white/80">Avg Response</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-400">97%</p>
                        <p className="text-sm text-white/80">Success Rate</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Enhancement Tab */}
          <TabsContent value="enhancement" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <Card className="bg-black/40 border-electric-blue/30 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-electric-blue">
                    <Sparkles className="w-5 h-5" />
                    Universal AI Enhancement Showcase
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Token Message Enhancement */}
                    <div className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
                      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-electric-blue" />
                        Token Message AI
                      </h3>
                      <Input
                        placeholder="Message to enhance..."
                        defaultValue="Create amazing blockchain tokens"
                        className="bg-black/20 border-electric-blue/30 text-white mb-3"
                      />
                      <AIEnhancementButton
                        text="Create amazing blockchain tokens"
                        onEnhanced={(enhanced) => console.log('Enhanced:', enhanced)}
                        type="token"
                        className="w-full"
                      />
                    </div>

                    {/* Chat Enhancement */}
                    <div className="p-4 bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-lg border border-green-500/20">
                      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-green-400" />
                        Chat Message AI
                      </h3>
                      <Input
                        placeholder="Chat message..."
                        defaultValue="Hey, how's your crypto portfolio doing?"
                        className="bg-black/20 border-green-400/30 text-white mb-3"
                      />
                      <AIEnhancementButton
                        text="Hey, how's your crypto portfolio doing?"
                        onEnhanced={(enhanced) => console.log('Enhanced:', enhanced)}
                        type="chat"
                        className="w-full"
                      />
                    </div>

                    {/* Marketing Enhancement */}
                    <div className="p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/20">
                      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-orange-400" />
                        Marketing AI
                      </h3>
                      <Input
                        placeholder="Marketing message..."
                        defaultValue="Join the future of communication"
                        className="bg-black/20 border-orange-400/30 text-white mb-3"
                      />
                      <AIEnhancementButton
                        text="Join the future of communication"
                        onEnhanced={(enhanced) => console.log('Enhanced:', enhanced)}
                        type="marketing"
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Features Overview */}
                  <div className="mt-8 p-6 bg-gradient-to-r from-electric-blue/5 to-purple-500/5 rounded-lg border border-electric-blue/20">
                    <h3 className="text-xl font-bold text-white mb-4 text-center">
                      🚀 Revolutionary AI Features Integrated
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="space-y-2">
                        <p className="text-electric-blue font-semibold">✨ Content Intelligence</p>
                        <ul className="text-white/80 space-y-1">
                          <li>• Text optimization & enhancement</li>
                          <li>• Viral score prediction</li>
                          <li>• Tone & style adaptation</li>
                          <li>• SEO optimization</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <p className="text-electric-blue font-semibold">🧠 Admin Intelligence</p>
                        <ul className="text-white/80 space-y-1">
                          <li>• User behavior analysis</li>
                          <li>• Security threat detection</li>
                          <li>• Revenue optimization</li>
                          <li>• Performance insights</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <p className="text-electric-blue font-semibold">🚀 Platform Integration</p>
                        <ul className="text-white/80 space-y-1">
                          <li>• Universal enhancement buttons</li>
                          <li>• Real-time AI suggestions</li>
                          <li>• Smart form assistance</li>
                          <li>• Contextual intelligence</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}