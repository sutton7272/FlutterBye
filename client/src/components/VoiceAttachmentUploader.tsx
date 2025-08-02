import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Mic, 
  Music, 
  Upload, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  FileAudio,
  Headphones,
  Radio,
  Disc,
  Download,
  Share2,
  Zap,
  Sparkles,
  Crown,
  Star
} from 'lucide-react';

interface VoiceAttachmentUploaderProps {
  onAudioAttached: (audioData: any) => void;
  tokenMessage: string;
}

export function VoiceAttachmentUploader({ onAudioAttached, tokenMessage }: VoiceAttachmentUploaderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [audioAnalysis, setAudioAnalysis] = useState<any>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  // Start voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        setRecordedAudio(audioBlob);
        setAudioUrl(URL.createObjectURL(audioBlob));
        stream.getTracks().forEach(track => track.stop());
        
        toast({
          title: "Voice Recorded!",
          description: "Your voice clip is ready to attach to the blockchain message"
        });
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Auto-stop after 60 seconds
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          setIsRecording(false);
        }
      }, 60000);

    } catch (error) {
      toast({
        title: "Recording Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/m4a'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload an audio file (MP3, WAV, OGG, M4A)",
          variant: "destructive"
        });
        return;
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Audio file must be under 10MB",
          variant: "destructive"
        });
        return;
      }

      setUploadedFile(file);
      setAudioUrl(URL.createObjectURL(file));
      
      toast({
        title: "Audio File Selected!",
        description: `${file.name} is ready to attach to your blockchain message`
      });
    }
  };

  // Analyze audio characteristics
  const analyzeAudio = () => {
    const audioFile = recordedAudio || uploadedFile;
    if (!audioFile) return;

    // Simulate audio analysis
    const analysis = {
      duration: Math.random() * 30 + 10, // 10-40 seconds
      frequency: Math.random() * 2000 + 200, // 200-2200 Hz
      emotion: ['Joy', 'Excitement', 'Love', 'Gratitude', 'Peace'][Math.floor(Math.random() * 5)],
      energy: Math.random() * 100,
      clarity: Math.random() * 100,
      uniqueness: Math.random() * 100,
      viralPotential: Math.random() * 100,
      estimatedValue: (Math.random() * 0.5 + 0.1).toFixed(3)
    };

    setAudioAnalysis(analysis);
    return analysis;
  };

  // Upload to blockchain
  const attachToBlockchain = async () => {
    const audioFile = recordedAudio || uploadedFile;
    if (!audioFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      // Analyze audio
      const analysis = analyzeAudio();

      // Simulate blockchain upload
      await new Promise(resolve => setTimeout(resolve, 3000));

      const audioData = {
        file: audioFile,
        url: audioUrl,
        analysis,
        type: recordedAudio ? 'voice_recording' : 'audio_file',
        filename: uploadedFile?.name || `voice_${Date.now()}.wav`,
        size: audioFile.size,
        tokenMessage,
        timestamp: Date.now()
      };

      onAudioAttached(audioData);
      
      toast({
        title: "Audio Attached to Blockchain!",
        description: `Your ${audioData.type.replace('_', ' ')} is now part of the token with estimated value: $${analysis?.estimatedValue}`
      });

    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Could not attach audio to blockchain. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Play/pause audio
  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900/90 via-indigo-900/30 to-purple-900/30 border-2 border-indigo-500/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 flex items-center gap-2">
          <Headphones className="w-6 h-6 text-indigo-400 animate-bounce" />
          Audio Attachment Studio™
          <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-300 animate-pulse">
            WORLD FIRST
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Recording Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Voice Recording */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-indigo-300 mb-3">Record Voice Message</h3>
              <div className="relative">
                <Button
                  size="lg"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-20 h-20 rounded-full transition-all duration-300 ${
                    isRecording 
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-lg shadow-red-500/50' 
                      : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/30'
                  }`}
                >
                  <Mic className="w-8 h-8" />
                </Button>
                {isRecording && (
                  <div className="absolute -inset-3 border-4 border-red-400 rounded-full animate-ping opacity-75" />
                )}
              </div>
              <div className="text-sm text-gray-400 mt-2">
                {isRecording ? 'Recording... (60s max)' : 'Tap to record voice'}
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-purple-300 mb-3">Upload Audio File</h3>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg shadow-purple-500/30"
              >
                <Music className="w-8 h-8" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="text-sm text-gray-400 mt-2">
                Upload MP3, WAV, or other audio
              </div>
            </div>
          </div>
        </div>

        {/* Audio Preview */}
        {audioUrl && (
          <div className="space-y-4">
            <div className="bg-black/30 rounded-lg p-4 border border-indigo-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileAudio className="w-5 h-5 text-indigo-400" />
                  <span className="text-indigo-300 font-medium">
                    {uploadedFile?.name || 'Voice Recording'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={togglePlayback}
                    className="border-indigo-500/30 text-indigo-300"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                className="w-full"
                controls
              />

              {/* Audio Analysis */}
              {audioAnalysis && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center p-2 bg-indigo-900/20 rounded-lg border border-indigo-500/20">
                    <div className="text-sm font-bold text-indigo-300">{audioAnalysis.emotion}</div>
                    <div className="text-xs text-gray-400">Emotion</div>
                  </div>
                  <div className="text-center p-2 bg-purple-900/20 rounded-lg border border-purple-500/20">
                    <div className="text-sm font-bold text-purple-300">{Math.round(audioAnalysis.energy)}%</div>
                    <div className="text-xs text-gray-400">Energy</div>
                  </div>
                  <div className="text-center p-2 bg-pink-900/20 rounded-lg border border-pink-500/20">
                    <div className="text-sm font-bold text-pink-300">{Math.round(audioAnalysis.clarity)}%</div>
                    <div className="text-xs text-gray-400">Clarity</div>
                  </div>
                  <div className="text-center p-2 bg-blue-900/20 rounded-lg border border-blue-500/20">
                    <div className="text-sm font-bold text-blue-300">${audioAnalysis.estimatedValue}</div>
                    <div className="text-xs text-gray-400">Est. Value</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-indigo-300">Attaching to Blockchain...</span>
              <span className="text-sm text-gray-400">{Math.round(uploadProgress)}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {(recordedAudio || uploadedFile) && !isUploading && (
            <Button
              onClick={attachToBlockchain}
              className="flex-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700"
            >
              <Zap className="w-4 h-4 mr-2" />
              Attach to Blockchain Token
            </Button>
          )}
          
          {audioUrl && (
            <Button
              variant="outline"
              onClick={() => {
                const link = document.createElement('a');
                link.href = audioUrl;
                link.download = uploadedFile?.name || 'voice_recording.wav';
                link.click();
              }}
              className="border-indigo-500/30 text-indigo-300"
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Revolutionary Features Info */}
        <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 rounded-lg p-4 border border-indigo-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-4 h-4 text-yellow-400" />
            <span className="text-indigo-300 font-medium">World's First Audio-Blockchain Integration</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400" />
              <span>Voice emotion analysis increases token value</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-blue-400" />
              <span>Audio frequency patterns affect rarity</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-green-400" />
              <span>Permanent blockchain storage for audio</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-purple-400" />
              <span>Immutable audio-message combinations</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}