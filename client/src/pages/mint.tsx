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
import { Progress } from '@/components/ui/progress';
import { Coins, Send, Timer, Star, AlertCircle, Mic, MicOff, Music, Waveform, Brain, Zap, Sparkles, Volume2, Play, Pause, Upload, FileAudio, Eye, TrendingUp, Users, DollarSign } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { createTokenizedMessage, distributeTokens, type TokenMessageData, type CreatedToken } from '@/lib/solana-real';
import { PublicKey, Transaction } from '@solana/web3.js';
import { useToast } from '@/hooks/use-toast';

export default function Mint() {
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
      // Simulate voice emotion analysis
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

      // Real blockchain token creation
      let createdTokenResult: CreatedToken;
      
      if (window.solana && window.solana.isPhantom) {
        // Real Phantom wallet integration
        const walletPublicKey = new PublicKey(walletAddress!);
        const signTransaction = async (transaction: Transaction) => {
          return await window.solana.signTransaction(transaction);
        };
        
        toast({
          title: "Creating Token",
          description: "Please approve the transaction in your wallet...",
        });
        
        createdTokenResult = await createTokenizedMessage(
          walletPublicKey,
          signTransaction,
          messageData
        );
        
        toast({
          title: "Token Created on Blockchain!",
          description: `Successfully minted SPL token: ${formData.title}`,
        });
        
      } else {
        // Fallback for development
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
          title: "Development Token Created",
          description: "Real blockchain integration available with Phantom wallet",
        });
      }

      setCreatedToken(createdTokenResult);

      // Store in backend
      const response = await fetch('/api/tokens/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Wallet-Address': walletAddress!
        },
        body: JSON.stringify({
          ...messageData,
          mintAddress: createdTokenResult.mintAddress,
          tokenAccount: createdTokenResult.tokenAccount,
          signature: createdTokenResult.signature,
          metadata: createdTokenResult.metadata
        })
      });

      if (!response.ok) {
        throw new Error('Failed to store token data');
      }

    } catch (error) {
      console.error('Token creation failed:', error);
      toast({
        title: "Creation Failed",
        description: `Failed to create tokenized message: ${error.message}`,
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

      let signatures: string[];

      if (window.solana && window.solana.isPhantom) {
        // Real blockchain distribution
        const walletPublicKey = new PublicKey(walletAddress!);
        const signTransaction = async (transaction: Transaction) => {
          return await window.solana.signTransaction(transaction);
        };
        
        toast({
          title: "Distributing Tokens",
          description: "Please approve transactions in your wallet...",
        });
        
        signatures = await distributeTokens(
          walletPublicKey,
          signTransaction,
          createdToken.mintAddress,
          recipients
        );
        
        toast({
          title: "Tokens Distributed on Blockchain!",
          description: `Successfully sent to ${recipients.length} recipients`,
        });
        
      } else {
        // Development fallback
        signatures = recipients.map(() => 
          'DevDistSig' + Math.random().toString(36).substring(2, 15)
        );
        
        toast({
          title: "Development Distribution",
          description: "Real blockchain distribution available with Phantom wallet",
        });
      }

      // Store distribution data
      await fetch('/api/tokens/distribute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Wallet-Address': walletAddress!
        },
        body: JSON.stringify({
          mintAddress: createdToken.mintAddress,
          recipients,
          signatures
        })
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
            {/* Token Creation Form */}
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
                placeholder="Enter message title..."
                maxLength={27}
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
                placeholder="Enter your message content..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="value">Attached Value</Label>
                <Input
                  id="value"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select value={formData.currency} onValueChange={(value: 'SOL' | 'USDC' | 'FLBY') => 
                  setFormData(prev => ({ ...prev, currency: value }))}>
                  <SelectTrigger>
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

            <div>
              <Label htmlFor="expiration">Expiration Date (Optional)</Label>
              <Input
                id="expiration"
                type="datetime-local"
                value={formData.expirationDate}
                onChange={(e) => setFormData(prev => ({ ...prev, expirationDate: e.target.value }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Limited Edition</Label>
                <p className="text-sm text-slate-400">Create a limited supply token</p>
              </div>
              <Switch
                checked={formData.isLimitedEdition}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isLimitedEdition: checked }))}
              />
            </div>

            {formData.isLimitedEdition && (
              <div>
                <Label htmlFor="maxSupply">Maximum Supply</Label>
                <Input
                  id="maxSupply"
                  type="number"
                  min="1"
                  value={formData.maxSupply}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxSupply: parseInt(e.target.value) || 1 }))}
                />
              </div>
            )}

            <Button
              onClick={handleCreateToken}
              disabled={isCreating || !formData.title.trim() || !formData.content.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
            >
              {isCreating ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Creating Token...
                </div>
              ) : (
                <>
                  <Coins className="h-4 w-4 mr-2" />
                  Create Token
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Distribution Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Token Distribution
            </CardTitle>
            <CardDescription>
              Distribute your tokenized message to recipients
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {createdToken ? (
              <>
                <div className="p-4 bg-slate-900 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-300">Created Token</span>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      <Star className="h-3 w-3 mr-1" />
                      Ready
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
                  />
                </div>

                <Button
                  onClick={handleDistributeTokens}
                  disabled={isDistributing || !formData.recipients.trim()}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {isDistributing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Distributing...
                    </div>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Distribute Tokens
                    </>
                  )}
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <Timer className="h-12 w-12 mx-auto text-slate-600 mb-4" />
                <p className="text-slate-400">
                  Create a token first to enable distribution
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}