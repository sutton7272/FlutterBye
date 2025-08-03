import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, Play, Pause, Square, Music, Upload, Volume2, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceMessageRecorderProps {
  onVoiceAttached: (audioData: { url: string; duration: number; type: 'voice' | 'music' }) => void;
  maxDuration?: number;
  showMusicUpload?: boolean;
}

export function VoiceMessageRecorder({ 
  onVoiceAttached, 
  maxDuration = 60,
  showMusicUpload = true 
}: VoiceMessageRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [uploadedMusic, setUploadedMusic] = useState<{ name: string; url: string; duration: number } | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Calculate duration
        const audio = new Audio(url);
        audio.onloadedmetadata = () => {
          setAudioDuration(audio.duration);
        };
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= maxDuration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

      toast({
        title: "Recording Started",
        description: "Speak clearly for best quality"
      });

    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Could not access microphone",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }

      toast({
        title: "Recording Complete",
        description: `${recordingTime}s voice message recorded`
      });
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const attachVoiceMessage = () => {
    if (audioUrl) {
      onVoiceAttached({
        url: audioUrl,
        duration: audioDuration,
        type: 'voice'
      });
      
      toast({
        title: "Voice Message Attached",
        description: "Your voice message has been added to the token"
      });
    }
  };

  const handleMusicUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      const url = URL.createObjectURL(file);
      const audio = new Audio(url);
      
      audio.onloadedmetadata = () => {
        setUploadedMusic({
          name: file.name,
          url: url,
          duration: audio.duration
        });
        
        toast({
          title: "Music Uploaded",
          description: `${file.name} ready to attach`
        });
      };
    }
  };

  const attachMusic = () => {
    if (uploadedMusic) {
      onVoiceAttached({
        url: uploadedMusic.url,
        duration: uploadedMusic.duration,
        type: 'music'
      });
      
      toast({
        title: "Music Attached",
        description: `${uploadedMusic.name} added to your message`
      });
    }
  };

  const clearRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
      setAudioDuration(0);
      setRecordingTime(0);
    }
  };

  return (
    <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-400/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Volume2 className="h-5 w-5 text-purple-400" />
          Voice & Music Attachment 🎵
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Voice Recording Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">Voice Message</span>
            <Badge className="bg-purple-600/20 text-purple-200">
              {isRecording ? 'Recording...' : 'Ready'}
            </Badge>
          </div>
          
          {!audioUrl ? (
            <div className="text-center space-y-3">
              <Button
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onMouseLeave={stopRecording}
                disabled={isRecording}
                className={`w-16 h-16 rounded-full ${
                  isRecording 
                    ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {isRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
              </Button>
              
              <div className="text-sm text-gray-400">
                {isRecording ? (
                  <div className="space-y-2">
                    <div className="text-red-400 font-bold">
                      Recording: {recordingTime}s / {maxDuration}s
                    </div>
                    <Progress value={(recordingTime / maxDuration) * 100} className="h-2" />
                  </div>
                ) : (
                  "Hold to record voice message"
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    onClick={playAudio}
                    className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-700"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <div className="text-sm">
                    <div className="text-white font-medium">Voice Message</div>
                    <div className="text-gray-400">{Math.round(audioDuration)}s duration</div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearRecording}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <Button
                onClick={attachVoiceMessage}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Volume2 className="h-4 w-4 mr-2" />
                Attach Voice Message
              </Button>
            </div>
          )}
        </div>

        {/* Music Upload Section */}
        {showMusicUpload && (
          <div className="space-y-3 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">Background Music</span>
              <Badge className="bg-blue-600/20 text-blue-200">
                Optional
              </Badge>
            </div>
            
            {!uploadedMusic ? (
              <div className="text-center space-y-3">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Music/Song
                </Button>
                <div className="text-xs text-gray-400">
                  Supports MP3, WAV, OGG files
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleMusicUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Music className="h-5 w-5 text-blue-400" />
                    <div className="text-sm">
                      <div className="text-white font-medium">{uploadedMusic.name}</div>
                      <div className="text-gray-400">{Math.round(uploadedMusic.duration)}s</div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setUploadedMusic(null)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button
                  onClick={attachMusic}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  <Music className="h-4 w-4 mr-2" />
                  Attach Background Music
                </Button>
              </div>
            )}
          </div>
        )}

        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        )}
      </CardContent>
    </Card>
  );
}