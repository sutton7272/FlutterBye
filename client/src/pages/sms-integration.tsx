import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MessageSquare, 
  Smartphone, 
  Heart, 
  Zap,
  Send,
  Brain,
  TrendingUp,
  Clock,
  Target,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Sparkles,
  Phone,
  MessageCircle,
  Eye
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface EmotionalAnalysis {
  emotion: string;
  sentiment: number;
  confidence: number;
  urgency: 'low' | 'medium' | 'high';
  keywords: string[];
  category: 'personal' | 'business' | 'emergency' | 'celebration' | 'other';
}

interface SMSResponse {
  success: boolean;
  tokenId?: string;
  message: string;
  error?: string;
}

export default function SMSIntegration() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [recipientWallet, setRecipientWallet] = useState('');
  const [customValue, setCustomValue] = useState('');
  const [analysisText, setAnalysisText] = useState('');

  // Fetch SMS service status
  const { data: smsStatus, isLoading: statusLoading } = useQuery({
    queryKey: ['/api/sms/status'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/sms/status');
      return response as any;
    }
  });

  // Fetch SMS analytics
  const { data: smsAnalytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/sms/analytics'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/sms/analytics');
      return response as any;
    }
  });

  // Create token from SMS mutation
  const createTokenMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/sms/create-token', data);
      return response as SMSResponse;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Emotional Token Created",
          description: data.message,
        });
        setMessage('');
        setPhoneNumber('');
        setRecipientWallet('');
        setCustomValue('');
        queryClient.invalidateQueries({ queryKey: ['/api/sms/analytics'] });
      } else {
        toast({
          title: "Token Creation Failed",
          description: data.message,
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create emotional token",
        variant: "destructive",
      });
    }
  });

  // Analyze message mutation
  const analyzeMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await apiRequest('POST', '/api/sms/analyze', { message: text });
      return response as any;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Message Analyzed",
          description: `Emotion: ${data.analysis.emotion}, Sentiment: ${(data.analysis.sentiment * 100).toFixed(0)}%`,
        });
      }
    },
    onError: () => {
      toast({
        title: "Analysis Failed",
        description: "Could not analyze message emotion",
        variant: "destructive",
      });
    }
  });

  const handleCreateToken = () => {
    if (!phoneNumber || !message) {
      toast({
        title: "Missing Information",
        description: "Please provide both phone number and message",
        variant: "destructive",
      });
      return;
    }

    createTokenMutation.mutate({
      phoneNumber,
      message,
      recipientWallet: recipientWallet || undefined,
      value: customValue ? parseFloat(customValue) : undefined
    });
  };

  const handleAnalyze = () => {
    if (!analysisText.trim()) {
      toast({
        title: "No Message",
        description: "Please enter a message to analyze",
        variant: "destructive",
      });
      return;
    }

    analyzeMutation.mutate(analysisText);
  };

  const getEmotionColor = (emotion: string) => {
    const colors: { [key: string]: string } = {
      happy: 'text-yellow-400',
      love: 'text-pink-400',
      excited: 'text-orange-400',
      grateful: 'text-green-400',
      sad: 'text-blue-400',
      worried: 'text-purple-400',
      angry: 'text-red-400',
      peaceful: 'text-teal-400',
      neutral: 'text-gray-400'
    };
    return colors[emotion] || 'text-gray-400';
  };

  const getUrgencyColor = (urgency: string) => {
    const colors = {
      low: 'text-green-400',
      medium: 'text-yellow-400',
      high: 'text-red-400'
    };
    return colors[urgency as keyof typeof colors] || 'text-gray-400';
  };

  const getStatusIcon = (configured: boolean) => {
    return configured ? (
      <CheckCircle className="w-5 h-5 text-green-400" />
    ) : (
      <XCircle className="w-5 h-5 text-red-400" />
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <Card className="bg-slate-900/50 border-purple-500/20 p-8">
          <CardContent className="text-center">
            <Smartphone className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-purple-400 mb-2">Authentication Required</h2>
            <p className="text-gray-400">Please connect your wallet to access SMS integration</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-400 mb-4 flex items-center justify-center gap-3">
            <MessageSquare className="w-10 h-10" />
            SMS Integration
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Transform your text messages into emotional blockchain tokens. 
            Bridge traditional communication with Web3 through AI-powered emotion analysis.
          </p>
        </div>

        {/* Service Status */}
        <Card className="bg-slate-900/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-purple-400 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Service Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statusLoading ? (
              <div className="text-center py-4 text-gray-400">Loading service status...</div>
            ) : smsStatus ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(smsStatus.configured)}
                    <span className="text-gray-300">SMS Service</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(smsStatus.features?.emotionalAnalysis)}
                    <span className="text-gray-300">Emotion Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(smsStatus.features?.tokenCreation)}
                    <span className="text-gray-300">Token Creation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(smsStatus.features?.confirmationSMS)}
                    <span className="text-gray-300">SMS Confirmations</span>
                  </div>
                </div>
                
                {smsStatus && smsStatus.twilioPhone && (
                  <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg">
                    <div className="text-sm text-blue-300">
                      <strong>Twilio Phone:</strong> {smsStatus.twilioPhone}
                    </div>
                    {smsStatus.webhookUrl && (
                      <div className="text-xs text-blue-400 mt-1">
                        <strong>Webhook URL:</strong> {smsStatus.webhookUrl}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-red-400">Failed to load service status</div>
            )}
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="bg-slate-900/50 border-purple-500/20">
            <TabsTrigger value="create" className="data-[state=active]:bg-purple-600">
              Create Token
            </TabsTrigger>
            <TabsTrigger value="analyze" className="data-[state=active]:bg-purple-600">
              Analyze Message
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="guide" className="data-[state=active]:bg-purple-600">
              How It Works
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create Token Form */}
              <Card className="bg-slate-900/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-purple-400 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Create Emotional Token
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Phone Number</label>
                    <Input
                      placeholder="+1234567890"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="bg-slate-800 border-purple-500/20 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Message</label>
                    <Textarea
                      placeholder="I'm so excited about this new project! Can't wait to share it with everyone..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="bg-slate-800 border-purple-500/20 text-white min-h-24"
                      maxLength={280}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {message.length}/280 characters
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Recipient Wallet (Optional)</label>
                    <Input
                      placeholder="Recipient's Solana wallet address"
                      value={recipientWallet}
                      onChange={(e) => setRecipientWallet(e.target.value)}
                      className="bg-slate-800 border-purple-500/20 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Custom Value (Optional)</label>
                    <Input
                      type="number"
                      placeholder="Auto-calculated based on emotion"
                      value={customValue}
                      onChange={(e) => setCustomValue(e.target.value)}
                      step="0.01"
                      min="0.1"
                      max="100"
                      className="bg-slate-800 border-purple-500/20 text-white"
                    />
                  </div>

                  <Button
                    onClick={handleCreateToken}
                    disabled={createTokenMutation.isPending}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {createTokenMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                        Creating...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Create Emotional Token
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Live Preview */}
              <Card className="bg-slate-900/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-purple-400 flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {message ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-800/50 rounded-lg">
                        <div className="text-sm text-gray-400 mb-2">Message</div>
                        <div className="text-white">{message}</div>
                      </div>
                      
                      <div className="text-sm text-gray-400">
                        This message will be analyzed for emotional content and converted into a unique SPL token on the Solana blockchain.
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-3 bg-slate-800/30 rounded">
                          <Brain className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                          <div className="text-xs text-gray-400">AI Analysis</div>
                        </div>
                        <div className="p-3 bg-slate-800/30 rounded">
                          <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                          <div className="text-xs text-gray-400">Blockchain Token</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Enter a message to see live preview</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analyze" className="space-y-6">
            <Card className="bg-slate-900/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Emotional Message Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Message to Analyze</label>
                  <Textarea
                    placeholder="I love spending time with my family on weekends!"
                    value={analysisText}
                    onChange={(e) => setAnalysisText(e.target.value)}
                    className="bg-slate-800 border-purple-500/20 text-white min-h-24"
                  />
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={analyzeMutation.isPending}
                  className="bg-gradient-to-r from-purple-600 to-blue-600"
                >
                  {analyzeMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                      Analyzing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      Analyze Emotion
                    </div>
                  )}
                </Button>

                {analyzeMutation.data?.success && (
                  <div className="mt-6 p-4 bg-slate-800/50 rounded-lg space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Analysis Results</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Primary Emotion</div>
                        <Badge className={`${getEmotionColor(analyzeMutation.data.analysis.emotion)} bg-slate-700`}>
                          <Heart className="w-3 h-3 mr-1" />
                          {analyzeMutation.data.analysis.emotion}
                        </Badge>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Sentiment Score</div>
                        <div className="text-white font-semibold">
                          {(analyzeMutation.data.analysis.sentiment * 100).toFixed(0)}%
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Urgency Level</div>
                        <Badge className={`${getUrgencyColor(analyzeMutation.data.analysis.urgency)} bg-slate-700`}>
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {analyzeMutation.data.analysis.urgency}
                        </Badge>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Category</div>
                        <Badge className="text-blue-400 bg-slate-700">
                          <Target className="w-3 h-3 mr-1" />
                          {analyzeMutation.data.analysis.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Keywords</div>
                      <div className="flex flex-wrap gap-2">
                        {analyzeMutation.data.analysis.keywords.map((keyword: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-gray-300 border-gray-600">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-slate-900/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  SMS Integration Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analyticsLoading ? (
                  <div className="text-center py-8 text-gray-400">Loading analytics...</div>
                ) : smsAnalytics ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                      <div className="text-2xl font-bold text-purple-400">{smsAnalytics.totalSMSTokens}</div>
                      <div className="text-sm text-gray-400">Total SMS Tokens</div>
                    </div>
                    <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">${smsAnalytics.averageValue.toFixed(2)}</div>
                      <div className="text-sm text-gray-400">Average Token Value</div>
                    </div>
                    <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">{smsAnalytics.timeRange}</div>
                      <div className="text-sm text-gray-400">Time Range</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">No analytics data available</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guide" className="space-y-6">
            <Card className="bg-slate-900/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  How SMS Integration Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">1. Send Message</h3>
                    <p className="text-gray-400 text-sm">
                      Send any text message through the platform or via SMS webhook
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Brain className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">2. AI Analysis</h3>
                    <p className="text-gray-400 text-sm">
                      Advanced emotion detection analyzes sentiment, urgency, and context
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">3. Token Creation</h3>
                    <p className="text-gray-400 text-sm">
                      Emotional token is minted on Solana blockchain with calculated value
                    </p>
                  </div>
                </div>

                <Alert className="bg-blue-900/20 border-blue-500/20">
                  <Sparkles className="w-4 h-4" />
                  <AlertDescription className="text-blue-300">
                    <strong>Pro Tip:</strong> Higher emotional intensity and urgency result in more valuable tokens. 
                    Messages expressing love, excitement, or gratitude typically generate premium-valued tokens.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Supported Emotions</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { emotion: 'Love', color: 'text-pink-400', icon: '❤️' },
                      { emotion: 'Happy', color: 'text-yellow-400', icon: '😊' },
                      { emotion: 'Excited', color: 'text-orange-400', icon: '🚀' },
                      { emotion: 'Grateful', color: 'text-green-400', icon: '🙏' },
                      { emotion: 'Sad', color: 'text-blue-400', icon: '😢' },
                      { emotion: 'Worried', color: 'text-purple-400', icon: '😟' },
                      { emotion: 'Angry', color: 'text-red-400', icon: '😠' },
                      { emotion: 'Peaceful', color: 'text-teal-400', icon: '☮️' }
                    ].map((item) => (
                      <div key={item.emotion} className="p-3 bg-slate-800/30 rounded text-center">
                        <div className="text-2xl mb-1">{item.icon}</div>
                        <div className={`text-sm ${item.color}`}>{item.emotion}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}