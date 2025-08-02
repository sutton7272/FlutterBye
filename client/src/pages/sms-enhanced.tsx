import { useState, useEffect, useRef } from 'react';
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
import { Progress } from '@/components/ui/progress';
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
  Eye,
  Mic,
  Camera,
  MapPin,
  Users,
  Calendar,
  Gift,
  Star,
  Lightbulb,
  Globe,
  Music,
  Image,
  Video,
  Share,
  Copy,
  Download,
  Upload,
  Palette,
  Wand2,
  Waves,
  Gauge,
  Flame,
  Snowflake,
  Sun,
  Moon,
  Coffee,
  Pizza,
  Gamepad2,
  Car,
  Plane,
  Home,
  Briefcase,
  GraduationCap,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { QRCodeGenerator } from '@/components/QRCodeGenerator';
import { EmotionPortal } from '@/components/EmotionPortal';
import { QuantumTimeMachine } from '@/components/QuantumTimeMachine';
import { NeuroLinkInterface } from '@/components/NeuroLinkInterface';

// Enhanced interfaces with new features
interface EmotionalAnalysis {
  emotion: string;
  sentiment: number;
  confidence: number;
  urgency: 'low' | 'medium' | 'high';
  keywords: string[];
  category: 'personal' | 'business' | 'emergency' | 'celebration' | 'other';
  emotionalIntensity?: number;
  viralPotential?: number;
  culturalContext?: string;
  timeContext?: string;
  locationContext?: string;
}

interface EnhancedSMSResponse {
  success: boolean;
  tokenId?: string;
  message: string;
  error?: string;
  predictedValue?: number;
  marketTrend?: 'bullish' | 'bearish' | 'neutral';
  viralScore?: number;
  aiSuggestions?: string[];
}

export default function EnhancedSMSIntegration() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  // State management
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [recipientWallet, setRecipientWallet] = useState('');
  const [customValue, setCustomValue] = useState('');
  const [analysisText, setAnalysisText] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [emotionalIntensity, setEmotionalIntensity] = useState(50);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [socialContext, setSocialContext] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isRealTimeMode, setIsRealTimeMode] = useState(false);
  const [emotionHistory, setEmotionHistory] = useState<any[]>([]);

  // References
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Advanced emotion templates with context
  const emotionTemplates = {
    celebration: [
      "🎉 We did it! So proud of what we accomplished together!",
      "🥳 This moment deserves to be on the blockchain forever!",
      "🎊 Celebrating life's beautiful milestones with you!"
    ],
    gratitude: [
      "🙏 Deeply grateful for this incredible journey we're on",
      "💝 Thank you for being such an amazing part of my life",
      "✨ Feeling blessed beyond words right now"
    ],
    excitement: [
      "🚀 This is just the beginning of something extraordinary!",
      "⚡ The energy is electric - can you feel it too?",
      "🔥 Ready to change the world one message at a time!"
    ],
    love: [
      "❤️ Every moment with you feels like magic",
      "💕 Love grows stronger when shared on the blockchain",
      "🌟 You make every day feel like a celebration"
    ],
    motivation: [
      "💪 Together we're unstoppable - let's make history!",
      "🎯 Every step forward creates value for the future",
      "🌈 Today's dreams become tomorrow's blockchain reality"
    ]
  };

  // Fetch enhanced SMS service status
  const { data: smsStatus, isLoading: statusLoading } = useQuery({
    queryKey: ['/api/sms/status'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/sms/status');
      return response as any;
    }
  });

  // Real-time emotion tracking
  useEffect(() => {
    if (isRealTimeMode && message.length > 10) {
      const timeoutId = setTimeout(() => {
        analyzeMutation.mutate(message);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [message, isRealTimeMode]);

  // Geolocation detection
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }
  }, []);

  // Enhanced create token mutation with AI features
  const createTokenMutation = useMutation({
    mutationFn: async (data: any) => {
      const enhancedData = {
        ...data,
        location: currentLocation,
        socialContext,
        emotionalIntensity: emotionalIntensity / 100,
        scheduledTime: scheduledTime || undefined,
        audioData: recordedAudio ? await blobToBase64(recordedAudio) : undefined
      };
      const response = await apiRequest('POST', '/api/sms/create-enhanced-token', enhancedData);
      return response as EnhancedSMSResponse;
    },
    onSuccess: (data) => {
      if (data.success) {
        // Add to emotion history
        setEmotionHistory(prev => [...prev, {
          timestamp: new Date(),
          emotion: selectedEmotion,
          value: data.predictedValue,
          viralScore: data.viralScore,
          message: message.substring(0, 50) + '...'
        }].slice(-10));

        toast({
          title: "🎉 Revolutionary Token Created!",
          description: `${data.message} • Viral Score: ${data.viralScore}/100`,
        });

        // Auto-suggest improvements
        if (data.aiSuggestions && data.aiSuggestions.length > 0) {
          setTimeout(() => {
            toast({
              title: "💡 AI Enhancement Suggestions",
              description: data.aiSuggestions![0],
            });
          }, 2000);
        }

        resetForm();
        queryClient.invalidateQueries({ queryKey: ['/api/sms/analytics'] });
      }
    }
  });

  // Enhanced analyze mutation with AI insights
  const analyzeMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await apiRequest('POST', '/api/sms/analyze-enhanced', { 
        message: text,
        location: currentLocation,
        timeContext: new Date().getHours(),
        socialContext
      });
      return response as any;
    },
    onSuccess: (data) => {
      if (data.success && data.analysis) {
        setSelectedEmotion(data.analysis.emotion);
        setEmotionalIntensity(Math.round(data.analysis.emotionalIntensity * 100));
        
        // Visualize emotion on canvas
        drawEmotionVisualization(data.analysis);
      }
    }
  });

  // Voice recording functionality
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setRecordedAudio(blob);
        setIsRecording(false);
      };

      mediaRecorder.start();
      setIsRecording(true);

      setTimeout(() => {
        mediaRecorder.stop();
        stream.getTracks().forEach(track => track.stop());
      }, 10000); // 10 second limit
    } catch (error) {
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access for voice messages",
        variant: "destructive"
      });
    }
  };

  // Emotion visualization on canvas
  const drawEmotionVisualization = (analysis: EmotionalAnalysis) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 200;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Emotion color mapping
    const emotionColors: { [key: string]: string } = {
      love: '#ff1744',
      happy: '#ffc107',
      excited: '#ff5722',
      grateful: '#4caf50',
      sad: '#2196f3',
      worried: '#9c27b0',
      angry: '#f44336',
      peaceful: '#00bcd4'
    };

    // Draw emotion waves
    const color = emotionColors[analysis.emotion] || '#6366f1';
    const intensity = analysis.emotionalIntensity || 0.5;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + 
          Math.sin((x + i * 50) * 0.02) * intensity * 30 +
          Math.sin((x + i * 30) * 0.01) * intensity * 20;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Add glow effect
    ctx.shadowColor = color;
    ctx.shadowBlur = 20;
    ctx.stroke();
  };

  // Helper functions
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const resetForm = () => {
    setMessage('');
    setPhoneNumber('');
    setRecipientWallet('');
    setCustomValue('');
    setSelectedEmotion('');
    setEmotionalIntensity(50);
    setRecordedAudio(null);
    setSocialContext('');
    setScheduledTime('');
  };

  const handleTemplateSelect = (category: keyof typeof emotionTemplates, index: number) => {
    setMessage(emotionTemplates[category][index]);
    setSelectedEmotion(category);
  };

  const generateSMSData = () => {
    return `sms:${smsStatus?.twilioPhone || '+1234567890'}?body=${encodeURIComponent(message)}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          🚀 Next-Gen SMS Blockchain Bridge
        </h1>
        <p className="text-xl text-gray-300">
          Transform emotions into valuable blockchain tokens with AI-powered insights
        </p>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-8 bg-slate-800/50">
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Wand2 className="w-4 h-4" />
            Create
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <Mic className="w-4 h-4" />
            Voice
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            🚀 REVOLUTIONARY
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Share className="w-4 h-4" />
            Social
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            History
          </TabsTrigger>
        </TabsList>

        {/* Enhanced Creation Tab */}
        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Main Creation Form */}
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Emotional Token Creator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Real-time mode toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Real-time Analysis</span>
                  <Button
                    variant={isRealTimeMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsRealTimeMode(!isRealTimeMode)}
                    className="h-8"
                  >
                    <Zap className="w-4 h-4 mr-1" />
                    {isRealTimeMode ? 'ON' : 'OFF'}
                  </Button>
                </div>

                {/* Message input with AI assistance */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Your Message</label>
                  <div className="relative">
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Express your emotions... AI will analyze and suggest improvements"
                      className="bg-slate-700/50 border-purple-500/30 text-white min-h-[120px] pr-12"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute bottom-2 right-2 h-8 w-8 p-0"
                      onClick={() => analyzeMutation.mutate(message)}
                      disabled={!message.trim() || analyzeMutation.isPending}
                    >
                      <Brain className="w-4 h-4 text-purple-400" />
                    </Button>
                  </div>
                  {message.length > 0 && (
                    <div className="text-xs text-gray-400">
                      {message.length}/280 characters • Estimated value: ${((message.length / 280) * 5).toFixed(2)}
                    </div>
                  )}
                </div>

                {/* Emotion selector with intensity */}
                {selectedEmotion && (
                  <div className="space-y-3 p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-purple-300">Detected Emotion</span>
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                        {selectedEmotion}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs text-gray-400">Emotional Intensity</label>
                      <div className="flex items-center gap-3">
                        <Snowflake className="w-4 h-4 text-blue-400" />
                        <div className="flex-1">
                          <Progress 
                            value={emotionalIntensity} 
                            className="h-2"
                          />
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={emotionalIntensity}
                            onChange={(e) => setEmotionalIntensity(Number(e.target.value))}
                            className="w-full mt-1 opacity-0 absolute"
                          />
                        </div>
                        <Flame className="w-4 h-4 text-red-400" />
                      </div>
                      <div className="text-xs text-center text-gray-400">
                        {emotionalIntensity}% intensity
                      </div>
                    </div>
                  </div>
                )}

                {/* Context inputs */}
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Social context (optional)"
                    value={socialContext}
                    onChange={(e) => setSocialContext(e.target.value)}
                    className="bg-slate-700/50 border-purple-500/30 text-white"
                  />
                  <Input
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="bg-slate-700/50 border-purple-500/30 text-white"
                  />
                </div>

                {/* Location indicator */}
                {currentLocation && (
                  <div className="flex items-center gap-2 text-sm text-green-400">
                    <MapPin className="w-4 h-4" />
                    Location detected for enhanced context
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => createTokenMutation.mutate({
                      phoneNumber: phoneNumber || '+1234567890',
                      message,
                      recipientWallet,
                      value: customValue ? parseFloat(customValue) : undefined
                    })}
                    disabled={!message.trim() || createTokenMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {createTokenMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Create Token
                      </div>
                    )}
                  </Button>
                  
                  <QRCodeGenerator
                    smsData={generateSMSData()}
                    message={message}
                    twilioPhone={smsStatus?.twilioPhone}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Live Emotion Visualization */}
            <Card className="bg-slate-800/50 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Waves className="w-5 h-5 text-blue-400" />
                  Emotion Visualization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <canvas
                  ref={canvasRef}
                  className="w-full h-48 bg-slate-900/50 rounded-lg border border-blue-500/20"
                />
                <div className="mt-4 text-center text-sm text-gray-400">
                  Live emotional waveform • Intensity affects token value
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Emotion Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(emotionTemplates).map(([category, templates]) => (
              <Card key={category} className="bg-slate-800/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white capitalize flex items-center gap-2">
                    {category === 'celebration' && <Gift className="w-5 h-5 text-yellow-400" />}
                    {category === 'gratitude' && <Heart className="w-5 h-5 text-pink-400" />}
                    {category === 'excitement' && <Zap className="w-5 h-5 text-orange-400" />}
                    {category === 'love' && <Heart className="w-5 h-5 text-red-400" />}
                    {category === 'motivation' && <Target className="w-5 h-5 text-green-400" />}
                    {category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {templates.map((template, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => handleTemplateSelect(category as keyof typeof emotionTemplates, index)}
                      className="w-full text-left h-auto p-3 border-slate-600 hover:bg-purple-500/10 text-gray-300"
                    >
                      <div className="text-sm">{template}</div>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Voice Messages Tab */}
        <TabsContent value="voice" className="space-y-6">
          <Card className="bg-slate-800/50 border-green-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Mic className="w-5 h-5 text-green-400" />
                Voice-to-Token Converter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="relative">
                  <Button
                    size="lg"
                    onClick={startRecording}
                    disabled={isRecording}
                    className={`w-24 h-24 rounded-full ${
                      isRecording 
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    <Mic className="w-8 h-8" />
                  </Button>
                  {isRecording && (
                    <div className="absolute -inset-2 border-4 border-red-400 rounded-full animate-ping opacity-75" />
                  )}
                </div>
                
                <div className="text-sm text-gray-400">
                  {isRecording ? 'Recording... (10s max)' : 'Tap to record voice message'}
                </div>

                {recordedAudio && (
                  <div className="space-y-3">
                    <audio
                      ref={audioRef}
                      controls
                      src={URL.createObjectURL(recordedAudio)}
                      className="w-full"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Upload className="w-4 h-4 mr-2" />
                        Convert to Token
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setRecordedAudio(null)}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <Alert className="bg-blue-900/20 border-blue-500/20">
                <Lightbulb className="w-4 h-4" />
                <AlertDescription className="text-blue-300">
                  <strong>Voice AI Features:</strong> Speech-to-text conversion, emotion detection from voice tone, 
                  accent analysis, and background sound context for enhanced token valuation.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revolutionary Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Revolutionary Emotion Portal */}
            <EmotionPortal 
              message={message}
              onEmotionChange={(emotion) => {
                setAnalysis(prev => ({
                  ...prev,
                  emotion: emotion.type,
                  confidence: emotion.intensity || 0.8,
                  sentiment: emotion.frequency || 0.7
                }));
                toast({
                  title: "Emotion Detected!",
                  description: `${emotion.type} emotion field activated with ${Math.round((emotion.intensity || 0) * 100)}% intensity`
                });
              }}
            />

            {/* Quantum Time Machine */}
            <QuantumTimeMachine
              message={message}
              onTimeTravel={(prediction) => {
                toast({
                  title: "Time Travel Complete!",
                  description: `Token value in ${prediction.label}: $${prediction.predictedValue.toFixed(3)}`
                });
              }}
            />

            {/* NeuroLink Interface */}
            <div className="xl:col-span-2">
              <NeuroLinkInterface
                message={message}
                onNeuroSync={(brainState) => {
                  toast({
                    title: "Neural Sync Complete!",
                    description: `Brain patterns analyzed with ${Math.round(brainState.coherenceIndex)}% coherence`
                  });
                }}
              />
            </div>
          </div>
        </TabsContent>

        {/* Emotion History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                Your Emotional Journey
              </CardTitle>
            </CardHeader>
            <CardContent>
              {emotionHistory.length > 0 ? (
                <div className="space-y-3">
                  {emotionHistory.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="space-y-1">
                        <div className="text-sm text-white">{entry.message}</div>
                        <div className="text-xs text-gray-400">
                          {entry.timestamp.toLocaleTimeString()} • {entry.emotion}
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-sm font-medium text-green-400">${entry.value?.toFixed(2)}</div>
                        <div className="text-xs text-gray-400">Viral: {entry.viralScore}/100</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <div>Your emotional token history will appear here</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}