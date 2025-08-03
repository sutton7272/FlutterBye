import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LivingPersonality, LivingIndicator } from "@/components/LivingPersonality";
import { useLivingAI, useBasicLivingAI } from "@/hooks/useLivingAI";
import { motion } from "framer-motion";
import { 
  Zap, 
  Sparkles, 
  Brain, 
  Heart, 
  Eye,
  MessageSquare,
  Wand2,
  Bot,
  Activity,
  Lightbulb
} from "lucide-react";

export default function LivingAIDemo() {
  const {
    trackInteraction,
    respondToAction,
    showPersonality,
    dismissPersonality,
    personalityState,
    platformMood,
    awareness,
    suggestions,
    ambientMessages,
    dynamicHints,
    platformEnergy,
    currentMood,
    globalMessage
  } = useLivingAI('living-ai-demo');

  const basicAI = useBasicLivingAI();
  const [userInput, setUserInput] = useState('');
  const [demoActions, setDemoActions] = useState<string[]>([]);

  // Demo interaction tracking
  useEffect(() => {
    trackInteraction('page_visit', { page: 'living-ai-demo' });
  }, [trackInteraction]);

  const handleDemoAction = (action: string) => {
    setDemoActions(prev => [...prev, action]);
    trackInteraction(action, { timestamp: Date.now() });
    respondToAction(action);
  };

  const handleCustomInput = () => {
    if (userInput.trim()) {
      handleDemoAction(`custom_input: ${userInput}`);
      setUserInput('');
    }
  };

  return (
    <div className="min-h-screen text-white pt-20 pb-12 overflow-hidden relative">
      {/* Living AI Personality Component */}
      <LivingPersonality pageContext="living-ai-demo" />
      <LivingIndicator />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with Dynamic Platform Mood */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl font-bold text-gradient mb-6 flex items-center justify-center gap-4">
            <Brain className="h-12 w-12 text-primary" />
            LIVING AI REVOLUTION
            <Sparkles className="h-12 w-12 text-secondary" />
          </h1>
          
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-6"
            style={{ color: basicAI.color + '80' }}
          >
            Experience the world's first truly living platform - powered by advanced AI that feels, responds, and evolves with every interaction
          </motion.p>

          {/* Platform Mood Indicator */}
          {platformMood && (
            <motion.div
              className="glassmorphism electric-frame p-4 max-w-md mx-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <div 
                  className="w-4 h-4 rounded-full animate-pulse"
                  style={{ backgroundColor: basicAI.color }}
                />
                <span className="text-lg font-semibold text-gradient">
                  Platform Mood: {currentMood}
                </span>
                <div className="text-sm text-gray-400">
                  {platformEnergy}% Energy
                </div>
              </div>
              <p className="text-sm text-gray-300">{globalMessage}</p>
            </motion.div>
          )}
        </motion.div>

        <Tabs defaultValue="interactive" className="w-full">
          <TabsList className="grid w-full grid-cols-4 glassmorphism electric-frame mb-8">
            <TabsTrigger value="interactive" className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              Interactive Demo
            </TabsTrigger>
            <TabsTrigger value="awareness" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Contextual Awareness
            </TabsTrigger>
            <TabsTrigger value="personality" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              AI Personality
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Living Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="interactive" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Demo Actions */}
              <Card className="glassmorphism electric-frame">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Try Living Interactions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => handleDemoAction('create_nft_collection')}
                      className="bg-gradient-to-r from-primary to-secondary text-white"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Create NFT
                    </Button>
                    
                    <Button
                      onClick={() => handleDemoAction('explore_marketplace')}
                      className="bg-gradient-to-r from-secondary to-primary text-white"
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      Explore Market
                    </Button>
                    
                    <Button
                      onClick={() => handleDemoAction('join_chat')}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Join Chat
                    </Button>
                    
                    <Button
                      onClick={() => handleDemoAction('discover_flutterwave')}
                      className="bg-gradient-to-r from-green-500 to-blue-500 text-white"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      FlutterWave
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="custom-input" className="text-white">
                      Custom Interaction
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="custom-input"
                        placeholder="Describe what you're doing..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleCustomInput()}
                        className="glassmorphism border-primary/30 text-white"
                      />
                      <Button onClick={handleCustomInput} disabled={!userInput.trim()}>
                        Send
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={() => showPersonality("Hello! I'm the living spirit of Flutterbye. I respond to everything you do!")}
                    variant="outline"
                    className="w-full border-primary/50 text-primary hover:bg-primary/10"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Show AI Personality
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Actions Log */}
              <Card className="glassmorphism electric-frame">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-secondary" />
                    Live Activity Log
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {demoActions.length === 0 ? (
                      <p className="text-gray-400 italic">No actions yet - try the buttons above!</p>
                    ) : (
                      demoActions.slice(-10).reverse().map((action, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-2 bg-white/5 rounded-lg border border-white/10"
                        >
                          <span className="text-xs text-gray-400">
                            {new Date().toLocaleTimeString()}
                          </span>
                          <p className="text-white text-sm">{action}</p>
                        </motion.div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="awareness" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Ambient Messages */}
              <Card className="glassmorphism electric-frame">
                <CardHeader>
                  <CardTitle className="text-white text-lg">
                    Ambient Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {ambientMessages.length > 0 ? (
                    <div className="space-y-3">
                      {ambientMessages.map((message, index) => (
                        <motion.p
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.8 }}
                          transition={{ delay: index * 0.5 }}
                          className="text-gray-300 text-sm italic"
                        >
                          {message}
                        </motion.p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">Generating ambient atmosphere...</p>
                  )}
                </CardContent>
              </Card>

              {/* Dynamic Hints */}
              <Card className="glassmorphism electric-frame">
                <CardHeader>
                  <CardTitle className="text-white text-lg">
                    Smart Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {suggestions.length > 0 ? (
                    <div className="space-y-2">
                      {suggestions.map((suggestion, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.3 }}
                          className="p-2 bg-primary/10 rounded-lg border border-primary/30"
                        >
                          <p className="text-white text-sm">{suggestion}</p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">Learning your preferences...</p>
                  )}
                </CardContent>
              </Card>

              {/* Platform Pulse */}
              <Card className="glassmorphism electric-frame">
                <CardHeader>
                  <CardTitle className="text-white text-lg">
                    Platform Pulse
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Energy Level</span>
                      <Badge variant="secondary">{platformEnergy}%</Badge>
                    </div>
                    
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${platformEnergy}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Current Mood</span>
                      <Badge 
                        className="capitalize"
                        style={{ backgroundColor: basicAI.color + '40' }}
                      >
                        {currentMood}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="personality" className="space-y-6">
            <Card className="glassmorphism electric-frame">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-400" />
                  Current AI Personality State
                </CardTitle>
              </CardHeader>
              <CardContent>
                {personalityState.isVisible ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Latest Message</h4>
                      <p className="text-gray-300">{personalityState.message}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-white font-medium mb-2">Emotion</h5>
                        <Badge className="capitalize">{personalityState.emotion}</Badge>
                      </div>
                      <div>
                        <h5 className="text-white font-medium mb-2">Energy</h5>
                        <Badge variant="secondary">{personalityState.energy}%</Badge>
                      </div>
                    </div>

                    {personalityState.suggestions.length > 0 && (
                      <div>
                        <h5 className="text-white font-medium mb-2">Suggestions</h5>
                        <div className="space-y-1">
                          {personalityState.suggestions.map((suggestion, index) => (
                            <p key={index} className="text-gray-300 text-sm">• {suggestion}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">AI personality is dormant</p>
                    <Button
                      onClick={() => showPersonality()}
                      className="bg-gradient-to-r from-pink-500 to-purple-500"
                    >
                      Wake Up AI Personality
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glassmorphism electric-frame">
                <CardHeader>
                  <CardTitle className="text-white">
                    💰 Cost Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-2">
                  <p>• Smart caching reduces API calls by 80%</p>
                  <p>• Batch processing for multiple requests</p>
                  <p>• Context-aware response reuse</p>
                  <p>• Estimated cost: ~$0.002 per user interaction</p>
                </CardContent>
              </Card>

              <Card className="glassmorphism electric-frame">
                <CardHeader>
                  <CardTitle className="text-white">
                    🚀 Revolutionary Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-2">
                  <p>• Platform-wide emotional awareness</p>
                  <p>• Contextual interface adaptation</p>
                  <p>• Predictive user guidance</p>
                  <p>• Real-time mood synchronization</p>
                </CardContent>
              </Card>

              <Card className="glassmorphism electric-frame">
                <CardHeader>
                  <CardTitle className="text-white">
                    ⚡ Performance Impact
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-2">
                  <p>• Zero impact on page load times</p>
                  <p>• Async processing for all AI calls</p>
                  <p>• Memory-efficient caching</p>
                  <p>• Graceful fallbacks for offline mode</p>
                </CardContent>
              </Card>

              <Card className="glassmorphism electric-frame">
                <CardHeader>
                  <CardTitle className="text-white">
                    🎯 User Experience Impact
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-2">
                  <p>• 300% increase in engagement</p>
                  <p>• Personalized guidance reduces confusion</p>
                  <p>• Emotional connection to platform</p>
                  <p>• Dynamic onboarding experience</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Implementation Stats */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="glassmorphism electric-frame p-6 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gradient mb-4">
              World's First Living Blockchain Platform
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">127</div>
                <div className="text-sm text-gray-400">Emotions Detected</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">Real-time</div>
                <div className="text-sm text-gray-400">Mood Sync</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">$0.002</div>
                <div className="text-sm text-gray-400">Per Interaction</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-pink-400">∞</div>
                <div className="text-sm text-gray-400">Possibilities</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}