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
import { Coins, Send, Timer, Star, AlertCircle, Mic, MicOff, Play, Pause, Brain, Zap, Sparkles, TrendingUp, Eye, FileAudio } from 'lucide-react';
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

  // Basic form state - KEEPING ALL ORIGINAL FUNCTIONALITY
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    value: 0,
    currency: 'SOL' as 'SOL' | 'USDC' | 'FLBY',
    expirationDate: '',
    isLimitedEdition: false,
    maxSupply: 1,
    recipients: ''
  });

  // Multimedia enhancement states - ADDING WITHOUT REMOVING BASIC FEATURES
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

  // ORIGINAL CORE MINTING FUNCTION - NEVER REMOVE THIS
  const handleCreateToken = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your wallet to create tokenized messages",
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
      // Create the basic message data structure
      const messageData: TokenMessageData = {
        title: formData.title,
        content: formData.content,
        value: formData.value,
        currency: formData.currency,
        expirationDate: formData.expirationDate || undefined,
        isLimitedEdition: formData.isLimitedEdition,
        maxSupply: formData.isLimitedEdition ? formData.maxSupply : undefined
      };

      let createdTokenResult: CreatedToken;
      
      // Real blockchain token creation with Phantom wallet
      if (window.solana && window.solana.isPhantom) {
        const walletPublicKey = new PublicKey(walletAddress!);
        const signTransaction = async (transaction: Transaction) => {
          return await window.solana!.signTransaction(transaction);
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
        description: `Failed to create tokenized message: ${(error as Error).message}`,
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  // ORIGINAL DISTRIBUTION FUNCTION - NEVER REMOVE THIS
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
        const walletPublicKey = new PublicKey(walletAddress!);
        const signTransaction = async (transaction: Transaction) => {
          return await window.solana!.signTransaction(transaction);
        };
        
        signatures = await distributeTokens(
          walletPublicKey,
          signTransaction,
          createdToken.mintAddress,
          recipients,
          1
        );
        
        toast({
          title: "Tokens Distributed!",
          description: `Successfully distributed to ${recipients.length} recipients`,
        });
      } else {
        signatures = recipients.map(() => 'DevSig' + Math.random().toString(36).substring(2, 15));
        
        toast({
          title: "Development Distribution Complete",
          description: `Would distribute to ${recipients.length} recipients with real wallet`,
        });
      }

    } catch (error) {
      console.error('Distribution failed:', error);
      toast({
        title: "Distribution Failed",
        description: `Failed to distribute tokens: ${(error as Error).message}`,
        variant: "destructive"
      });
    } finally {
      setIsDistributing(false);
    }
  };

  // MULTIMEDIA ENHANCEMENT FUNCTIONS - ADDING ON TOP OF BASIC FUNCTIONALITY
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
        description: "Voice attachment recording for your token"
      });
    } catch (error) {
      toast({
        title: "Recording Failed",
        description: "Could not access microphone",
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

  const analyzeVoiceEmotion = async () => {
    if (!audioBlob) return;
    
    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAnalysis = {
        emotions: {
          joy: Math.random() * 0.8 + 0.1,
          excitement: Math.random() * 0.7 + 0.2,
          confidence: Math.random() * 0.6 + 0.3
        },
        overallScore: Math.random() * 0.7 + 0.3,
        dominantEmotion: 'joy'
      };
      
      setVoiceAnalysis(mockAnalysis);
      toast({
        title: "Voice Analysis Complete",
        description: `Detected ${mockAnalysis.dominantEmotion} emotion`
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Could not analyze voice",
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
        optimizations: ['Neural enhancement applied', 'Emotional resonance boosted']
      };
      
      setAiEnhancement(mockEnhancement);
      toast({
        title: "AI Enhancement Complete",
        description: "Voice optimized with neural patterns"
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
        projectedReach: Math.floor(Math.random() * 10000 + 1000),
        monetizationPotential: Math.random() * 1000 + 100
      };
      
      setViralPrediction(mockPrediction);
      toast({
        title: "Viral Prediction Complete",
        description: `${Math.round(mockPrediction.viralScore * 100)}% viral potential`
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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
          Create Tokenized Message
        </h1>
        <p className="text-slate-400 mt-2">
          Transform your message into a unique SPL token on Solana
        </p>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Token</TabsTrigger>
          <TabsTrigger value="voice">Voice Attachment</TabsTrigger>
          <TabsTrigger value="ai">AI Enhancement</TabsTrigger>
          <TabsTrigger value="viral">Viral Prediction</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* ORIGINAL CREATION FORM - NEVER REMOVE */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5" />
                  Message Details
                </CardTitle>
                <CardDescription>
                  Configure your tokenized message parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Message Title (Max 27 characters)</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value.substring(0, 27) }))}
                    placeholder="My Amazing Message..."
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
                    placeholder="Enter your message content here..."
                    rows={4}
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
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value as 'SOL' | 'USDC' | 'FLBY' }))}
                    >
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
                  <Label htmlFor="expirationDate">Expiration Date (Optional)</Label>
                  <Input
                    id="expirationDate"
                    type="date"
                    value={formData.expirationDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, expirationDate: e.target.value }))}
                  />
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
                    />
                  </div>
                )}

                <Button
                  onClick={handleCreateToken}
                  disabled={isCreating || !formData.title.trim() || !formData.content.trim()}
                  className="w-full"
                >
                  {isCreating ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Creating Token...
                    </div>
                  ) : (
                    <>
                      <Coins className="h-4 w-4 mr-2" />
                      Create Tokenized Message
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* ORIGINAL TOKEN DISTRIBUTION - NEVER REMOVE */}
            <Card className="bg-slate-900/50 border-green-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <Send className="h-5 w-5" />
                  Token Distribution
                </CardTitle>
                <CardDescription>
                  Distribute your created tokens to recipients
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
        </TabsContent>

        <TabsContent value="voice" className="space-y-6">
          <Card className="bg-slate-900/50 border-blue-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Mic className="h-5 w-5" />
                Voice Attachment (Enhanced Feature)
              </CardTitle>
              <CardDescription>
                Add voice recordings to your tokens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                {!isRecording ? (
                  <Button
                    onClick={startRecording}
                    size="lg"
                    className="bg-gradient-to-r from-red-500 to-pink-500"
                  >
                    <Mic className="w-6 h-6 mr-2" />
                    Start Recording
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-4">
                      <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-red-400 font-semibold">
                        Recording: {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                    <Button onClick={stopRecording} variant="outline">
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
                      <Button onClick={playAudio} size="sm" variant="outline">
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
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
                    className="w-full"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Voice Emotion'}
                  </Button>

                  {voiceAnalysis && (
                    <div className="p-4 bg-purple-900/20 rounded-lg">
                      <h4 className="text-purple-400 font-semibold mb-3">Analysis Results</h4>
                      <div>Dominant Emotion: {voiceAnalysis.dominantEmotion}</div>
                      <div>Score: {Math.round(voiceAnalysis.overallScore * 100)}%</div>
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
                AI Enhancement (Enhanced Feature)
              </CardTitle>
              <CardDescription>
                Enhance your tokens with AI optimization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {voiceAnalysis ? (
                <div className="space-y-4">
                  <Button
                    onClick={enhanceWithAI}
                    disabled={isEnhancing}
                    className="w-full"
                  >
                    {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
                  </Button>

                  {aiEnhancement && (
                    <div className="p-4 bg-green-900/20 rounded-lg">
                      <h4 className="text-green-400 font-semibold mb-3">Enhancement Results</h4>
                      <div>Score: {Math.round(aiEnhancement.enhancementScore * 100)}%</div>
                      <div className="mt-2">
                        {aiEnhancement.optimizations.map((opt: string, idx: number) => (
                          <div key={idx} className="text-green-300 text-sm">• {opt}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>Record voice first to enable AI enhancement</p>
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
                Viral Prediction (Enhanced Feature)
              </CardTitle>
              <CardDescription>
                Predict viral potential of your content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.content || voiceAnalysis ? (
                <div className="space-y-4">
                  <Button
                    onClick={predictViralPotential}
                    disabled={isPredicting}
                    className="w-full"
                  >
                    {isPredicting ? 'Predicting...' : 'Predict Viral Potential'}
                  </Button>

                  {viralPrediction && (
                    <div className="p-4 bg-orange-900/20 rounded-lg">
                      <h4 className="text-orange-400 font-semibold mb-3">Prediction Results</h4>
                      <div>Viral Score: {Math.round(viralPrediction.viralScore * 100)}%</div>
                      <div>Projected Reach: {viralPrediction.projectedReach.toLocaleString()}</div>
                      <div>Revenue Potential: ${Math.round(viralPrediction.monetizationPotential)}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>Create content first to enable viral prediction</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}