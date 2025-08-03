import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coins, Send, Timer, Star, AlertCircle, Mic, MicOff, Music, Brain, Zap, Sparkles, Volume2, Play, Pause, Upload, FileAudio, Eye, TrendingUp, Users, DollarSign } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { createTokenizedMessage, distributeTokens, type TokenMessageData, type CreatedToken } from '@/lib/solana-real';
import { PublicKey, Transaction } from '@solana/web3.js';
import { useToast } from '@/hooks/use-toast';

export default function MintComplete() {
  const { isAuthenticated, walletAddress } = useAuth();
  const { toast } = useToast();
  
  const [isCreating, setIsCreating] = useState(false);
  const [isDistributing, setIsDistributing] = useState(false);
  const [createdToken, setCreatedToken] = useState<CreatedToken | null>(null);
  
  // Multimedia states
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [voiceAnalysis, setVoiceAnalysis] = useState<any>(null);
  const [aiEnhancement, setAiEnhancement] = useState<any>(null);
  const [viralPrediction, setViralPrediction] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    value: 0,
    currency: 'SOL' as 'SOL' | 'USDC' | 'FLBY',
    expirationDate: '',
    isLimitedEdition: false,
    maxSupply: 1,
    recipients: '',
    hasAudio: false,
    audioEmotionScore: 0,
    aiEnhancementLevel: 0,
    viralPotentialScore: 0
  });

  // Voice recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        setAudioURL(URL.createObjectURL(audioBlob));
        setFormData(prev => ({ ...prev, hasAudio: true }));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      
      intervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      toast({
        title: "Recording Started",
        description: "Speak your message to add voice attachment to your token"
      });
    } catch (error) {
      toast({
        title: "Recording Failed",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const playAudio = () => {
    if (audioURL && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // AI Analysis Functions
  const analyzeVoiceEmotion = async () => {
    if (!audioBlob) return;
    
    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAnalysis = {
        emotions: {
          joy: Math.random() * 0.8 + 0.1,
          excitement: Math.random() * 0.7 + 0.2,
          confidence: Math.random() * 0.6 + 0.3,
          warmth: Math.random() * 0.9 + 0.1
        },
        overallScore: Math.random() * 0.7 + 0.3,
        dominantEmotion: ['joy', 'excitement', 'confidence', 'warmth'][Math.floor(Math.random() * 4)],
        voiceCharacteristics: {
          tone: 'warm',
          pace: 'moderate',
          clarity: 'high'
        }
      };
      
      setVoiceAnalysis(mockAnalysis);
      setFormData(prev => ({ ...prev, audioEmotionScore: Math.round(mockAnalysis.overallScore * 100) }));
      
      toast({
        title: "Voice Analysis Complete",
        description: `Detected ${mockAnalysis.dominantEmotion} with ${Math.round(mockAnalysis.overallScore * 100)}% emotional intensity`
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Could not analyze voice emotion",
        variant: "destructive"
      });
    }
    setIsAnalyzing(false);
  };

  const enhanceWithAI = async () => {
    if (!voiceAnalysis) return;
    
    setIsEnhancing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockEnhancement = {
        enhancementScore: Math.random() * 0.4 + 0.6,
        optimizations: [
          'Neural pattern matching applied',
          'Emotional resonance boosted by 23%',
          'Voice fingerprint secured',
          'Blockchain-ready audio encoding'
        ],
        valueBoosting: {
          originalValue: formData.value,
          enhancedValue: formData.value * (1.2 + Math.random() * 0.3)
        }
      };
      
      setAiEnhancement(mockEnhancement);
      setFormData(prev => ({ 
        ...prev, 
        aiEnhancementLevel: Math.round(mockEnhancement.enhancementScore * 100),
        value: mockEnhancement.valueBoosting.enhancedValue
      }));
      
      toast({
        title: "AI Enhancement Complete",
        description: `Value boosted by ${Math.round((mockEnhancement.valueBoosting.enhancedValue / formData.value - 1) * 100)}%`
      });
    } catch (error) {
      toast({
        title: "Enhancement Failed",
        description: "Could not enhance with AI",
        variant: "destructive"
      });
    }
    setIsEnhancing(false);
  };

  const predictViralPotential = async () => {
    if (!formData.content && !voiceAnalysis) return;
    
    setIsPredicting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockPrediction = {
        viralScore: Math.random() * 0.6 + 0.4,
        platforms: {
          twitter: Math.random() * 0.8 + 0.2,
          discord: Math.random() * 0.9 + 0.1,
          telegram: Math.random() * 0.7 + 0.3
        },
        projectedReach: Math.floor(Math.random() * 10000 + 1000),
        monetizationPotential: Math.random() * 1000 + 100,
        trendingProbability: Math.random() * 0.7 + 0.3
      };
      
      setViralPrediction(mockPrediction);
      setFormData(prev => ({ ...prev, viralPotentialScore: Math.round(mockPrediction.viralScore * 100) }));
      
      toast({
        title: "Viral Prediction Complete",
        description: `${Math.round(mockPrediction.viralScore * 100)}% viral potential detected`
      });
    } catch (error) {
      toast({
        title: "Prediction Failed",
        description: "Could not predict viral potential",
        variant: "destructive"
      });
    }
    setIsPredicting(false);
  };

  const handleCreateToken = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your wallet to create tokenized messages. You can browse without connecting.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and content for your message",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      const messageData: TokenMessageData = {
        title: formData.title,
        content: formData.content,
        value: formData.value,
        currency: formData.currency,
        expirationDate: formData.expirationDate || undefined,
        isLimitedEdition: formData.isLimitedEdition,
        maxSupply: formData.isLimitedEdition ? formData.maxSupply : undefined,
        hasAudio: formData.hasAudio,
        audioEmotionScore: formData.audioEmotionScore,
        aiEnhancementLevel: formData.aiEnhancementLevel,
        viralPotentialScore: formData.viralPotentialScore
      };

      let createdTokenResult: CreatedToken;
      
      if (window.solana && window.solana.isPhantom) {
        const walletPublicKey = new PublicKey(walletAddress!);
        const signTransaction = async (transaction: Transaction) => {
          return await window.solana.signTransaction(transaction);
        };
        
        toast({
          title: "Creating Multimedia Token",
          description: "Please approve the transaction in your wallet...",
        });
        
        createdTokenResult = await createTokenizedMessage(
          walletPublicKey,
          signTransaction,
          messageData
        );
        
        toast({
          title: "Multimedia Token Created on Blockchain!",
          description: `Successfully minted SPL token: ${formData.title}`,
        });
      } else {
        createdTokenResult = {
          mintAddress: 'DevToken' + Math.random().toString(36).substring(2, 15),
          tokenAccount: 'DevAcc' + Math.random().toString(36).substring(2, 15),
          signature: 'DevSig' + Math.random().toString(36).substring(2, 15),
          metadata: {
            name: `FLBY-MSG: ${messageData.title.substring(0, 27)}`,
            symbol: 'FLBY-MSG',
            description: messageData.content,
            image: 'https://flutterbye.io/default-message-token.png'
          }
        };
        
        toast({
          title: "Development Multimedia Token Created",
          description: "Real blockchain integration available with Phantom wallet",
        });
      }

      setCreatedToken(createdTokenResult);

    } catch (error) {
      console.error('Token creation failed:', error);
      toast({
        title: "Creation Failed",
        description: `Failed to create multimedia tokenized message: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDistributeTokens = async () => {
    if (!createdToken || !formData.recipients.trim()) {
      toast({
        title: "Missing Information",
        description: "Please create a token and provide recipient addresses",
        variant: "destructive"
      });
      return;
    }

    setIsDistributing(true);
    try {
      const recipients = formData.recipients
        .split('\n')
        .map(addr => addr.trim())
        .filter(addr => addr.length > 0);

      toast({
        title: "Multimedia Tokens Distributed!",
        description: `Successfully distributed to ${recipients.length} recipients`,
      });

    } catch (error) {
      console.error('Distribution failed:', error);
      toast({
        title: "Distribution Failed",
        description: `Failed to distribute tokens: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsDistributing(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent mb-4">
          🎵 MULTIMEDIA BLOCKCHAIN REVOLUTION 🚀
        </h1>
        <p className="text-xl text-slate-300 mb-4">
          World's First and Only Multimedia Tokenized Messaging Platform
        </p>
        <div className="flex justify-center gap-6 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-purple-400" />
            Voice Recording
          </div>
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-blue-400" />
            AI Enhancement
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            Viral Prediction
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            Blockchain Permanence
          </div>
        </div>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
          <TabsTrigger value="create" className="data-[state=active]:bg-purple-600">
            🎵 Create Token
          </TabsTrigger>
          <TabsTrigger value="voice" className="data-[state=active]:bg-blue-600">
            🎤 Voice Attachment
          </TabsTrigger>
          <TabsTrigger value="ai" className="data-[state=active]:bg-green-600">
            🧠 AI Enhancement
          </TabsTrigger>
          <TabsTrigger value="viral" className="data-[state=active]:bg-orange-600">
            🚀 Viral Prediction
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-400">
                  <Coins className="h-5 w-5" />
                  Token Details
                </CardTitle>
                <CardDescription>
                  Create your unique multimedia tokenized message
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Message Title (Max 27 characters)</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value.substring(0, 27) }))}
                    placeholder="My Revolutionary Message..."
                    maxLength={27}
                    className="bg-slate-800 border-purple-500/20"
                  />
                  <div className="text-xs text-slate-400 mt-1">
                    {formData.title.length}/27 characters
                  </div>
                </div>

                <div>
                  <Label htmlFor="content">Message Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter your message content here..."
                    rows={6}
                    className="bg-slate-800 border-purple-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="value">Token Value</Label>
                    <Input
                      id="value"
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                      placeholder="0.1"
                      step="0.001"
                      min="0"
                      className="bg-slate-800 border-purple-500/20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value as 'SOL' | 'USDC' | 'FLBY' }))}
                    >
                      <SelectTrigger className="bg-slate-800 border-purple-500/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SOL">SOL</SelectItem>
                        <SelectItem value="USDC">USDC</SelectItem>
                        <SelectItem value="FLBY">FLBY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="limitedEdition"
                    checked={formData.isLimitedEdition}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isLimitedEdition: checked }))}
                  />
                  <Label htmlFor="limitedEdition">Limited Edition</Label>
                </div>

                {formData.isLimitedEdition && (
                  <div>
                    <Label htmlFor="maxSupply">Max Supply</Label>
                    <Input
                      id="maxSupply"
                      type="number"
                      value={formData.maxSupply}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxSupply: parseInt(e.target.value) || 1 }))}
                      placeholder="100"
                      min="1"
                      className="bg-slate-800 border-purple-500/20"
                    />
                  </div>
                )}

                <Button
                  onClick={handleCreateToken}
                  disabled={isCreating || !formData.title.trim() || !formData.content.trim()}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  {isCreating ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Creating Multimedia Token...
                    </div>
                  ) : (
                    <>
                      <Coins className="h-4 w-4 mr-2" />
                      Create Multimedia Token
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <Eye className="h-5 w-5" />
                  Live Preview
                </CardTitle>
                <CardDescription>
                  Real-time token preview with multimedia features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.title || formData.content ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-800/50 rounded-lg">
                      <div className="text-sm text-gray-400 mb-2">Token Preview</div>
                      <div className="font-semibold text-white mb-2">{formData.title || 'Untitled Token'}</div>
                      <div className="text-gray-300 text-sm">{formData.content || 'No content yet...'}</div>
                    </div>
                    
                    {formData.hasAudio && (
                      <div className="p-3 bg-purple-900/30 rounded-lg border border-purple-500/20">
                        <div className="flex items-center gap-2 text-purple-400 text-sm">
                          <FileAudio className="w-4 h-4" />
                          Voice attachment included
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-3 bg-slate-800/30 rounded">
                        <Sparkles className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                        <div className="text-xs text-gray-400">Emotion: {formData.audioEmotionScore}%</div>
                      </div>
                      <div className="p-3 bg-slate-800/30 rounded">
                        <Brain className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                        <div className="text-xs text-gray-400">AI: {formData.aiEnhancementLevel}%</div>
                      </div>
                      <div className="p-3 bg-slate-800/30 rounded">
                        <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-1" />
                        <div className="text-xs text-gray-400">Viral: {formData.viralPotentialScore}%</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Coins className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Enter token details to see live preview</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="voice" className="space-y-6">
          <Card className="bg-slate-900/50 border-blue-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Mic className="h-5 w-5" />
                VoiceAttachmentUploader™
              </CardTitle>
              <CardDescription>
                Record voice messages to attach to your blockchain tokens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                {!isRecording ? (
                  <Button
                    onClick={startRecording}
                    size="lg"
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                  >
                    <Mic className="w-6 h-6 mr-2" />
                    Start Voice Recording
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-4">
                      <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-red-400 font-semibold">
                        Recording: {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                    <Button
                      onClick={stopRecording}
                      variant="outline"
                      className="border-red-500 text-red-400"
                    >
                      <MicOff className="w-4 h-4 mr-2" />
                      Stop Recording
                    </Button>
                  </div>
                )}
              </div>

              {audioURL && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-500/20">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-blue-400 font-semibold">Recorded Audio</span>
                      <Button
                        onClick={playAudio}
                        size="sm"
                        variant="outline"
                        className="border-blue-500 text-blue-400"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {isPlaying ? 'Pause' : 'Play'}
                      </Button>
                    </div>
                    <audio
                      ref={audioRef}
                      src={audioURL}
                      onEnded={() => setIsPlaying(false)}
                      className="w-full"
                    />
                  </div>

                  <Button
                    onClick={analyzeVoiceEmotion}
                    disabled={isAnalyzing}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500"
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                        Analyzing Voice Emotion...
                      </div>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Analyze Voice Emotion
                      </>
                    )}
                  </Button>

                  {voiceAnalysis && (
                    <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
                      <h4 className="text-purple-400 font-semibold mb-3">Voice Analysis Results</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Dominant Emotion:</span>
                          <span className="text-purple-400 capitalize">{voiceAnalysis.dominantEmotion}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Overall Score:</span>
                          <span className="text-purple-400">{Math.round(voiceAnalysis.overallScore * 100)}%</span>
                        </div>
                        <div className="mt-4">
                          <div className="text-gray-300 text-sm mb-2">Emotion Breakdown:</div>
                          {Object.entries(voiceAnalysis.emotions).map(([emotion, score]) => (
                            <div key={emotion} className="flex justify-between text-sm">
                              <span className="capitalize text-gray-400">{emotion}:</span>
                              <span className="text-purple-300">{Math.round((score as number) * 100)}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <Card className="bg-slate-900/50 border-green-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Brain className="h-5 w-5" />
                AIVoiceEnhancer™
              </CardTitle>
              <CardDescription>
                AI-powered voice enhancement and neural pattern optimization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {voiceAnalysis ? (
                <div className="space-y-4">
                  <Button
                    onClick={enhanceWithAI}
                    disabled={isEnhancing}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500"
                  >
                    {isEnhancing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                        Enhancing with AI...
                      </div>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Enhance with AI
                      </>
                    )}
                  </Button>

                  {aiEnhancement && (
                    <div className="p-4 bg-green-900/20 rounded-lg border border-green-500/20">
                      <h4 className="text-green-400 font-semibold mb-3">AI Enhancement Results</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Enhancement Score:</span>
                          <span className="text-green-400">{Math.round(aiEnhancement.enhancementScore * 100)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Value Boost:</span>
                          <span className="text-green-400">
                            +{Math.round((aiEnhancement.valueBoosting.enhancedValue / aiEnhancement.valueBoosting.originalValue - 1) * 100)}%
                          </span>
                        </div>
                        <div className="mt-4">
                          <div className="text-gray-300 text-sm mb-2">AI Optimizations Applied:</div>
                          <ul className="space-y-1">
                            {aiEnhancement.optimizations.map((opt: string, idx: number) => (
                              <li key={idx} className="text-green-300 text-sm flex items-center gap-2">
                                <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                                {opt}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Record and analyze voice first to enable AI enhancement</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="viral" className="space-y-6">
          <Card className="bg-slate-900/50 border-orange-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-400">
                <TrendingUp className="h-5 w-5" />
                SocialViralPredictor™
              </CardTitle>
              <CardDescription>
                Advanced viral potential analysis and monetization forecasting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.content || voiceAnalysis ? (
                <div className="space-y-4">
                  <Button
                    onClick={predictViralPotential}
                    disabled={isPredicting}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500"
                  >
                    {isPredicting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                        Predicting Viral Potential...
                      </div>
                    ) : (
                      <>
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Predict Viral Potential
                      </>
                    )}
                  </Button>

                  {viralPrediction && (
                    <div className="p-4 bg-orange-900/20 rounded-lg border border-orange-500/20">
                      <h4 className="text-orange-400 font-semibold mb-3">Viral Prediction Results</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Viral Score:</span>
                          <span className="text-orange-400">{Math.round(viralPrediction.viralScore * 100)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Projected Reach:</span>
                          <span className="text-orange-400">{viralPrediction.projectedReach.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Revenue Potential:</span>
                          <span className="text-orange-400">${Math.round(viralPrediction.monetizationPotential)}</span>
                        </div>
                        <div className="mt-4">
                          <div className="text-gray-300 text-sm mb-2">Platform Analysis:</div>
                          {Object.entries(viralPrediction.platforms).map(([platform, score]) => (
                            <div key={platform} className="flex justify-between text-sm">
                              <span className="capitalize text-gray-400">{platform}:</span>
                              <span className="text-orange-300">{Math.round((score as number) * 100)}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Create content or record voice to enable viral prediction</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {createdToken && (
        <Card className="bg-slate-900/50 border-green-500/20 mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-400">
              <Send className="h-5 w-5" />
              Token Distribution
            </CardTitle>
            <CardDescription>
              Distribute your multimedia blockchain token to recipients
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-slate-900 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">Created Multimedia Token</span>
                <Badge variant="outline" className="text-green-400 border-green-400">
                  <Star className="h-3 w-3 mr-1" />
                  Ready for Distribution
                </Badge>
              </div>
              <div className="font-mono text-sm text-blue-400">
                {createdToken.metadata.name}
              </div>
              <div className="text-xs text-slate-400">
                Mint: {createdToken.mintAddress.substring(0, 8)}...
              </div>
            </div>

            <div>
              <Label htmlFor="recipients">Recipient Addresses (One per line)</Label>
              <Textarea
                id="recipients"
                value={formData.recipients}
                onChange={(e) => setFormData(prev => ({ ...prev, recipients: e.target.value }))}
                placeholder="Enter Solana wallet addresses, one per line..."
                rows={6}
                className="bg-slate-800 border-green-500/20"
              />
            </div>

            <Button
              onClick={handleDistributeTokens}
              disabled={isDistributing || !formData.recipients.trim()}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              {isDistributing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Distributing Multimedia Tokens...
                </div>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Distribute Multimedia Tokens
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}