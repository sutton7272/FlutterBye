/**
 * Voice-to-AI Token Creator - Revolutionary voice interface for token creation
 * Converts speech to optimized token content using AI processing
 */

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, Play, Pause, Square, Wand2, Sparkles, Volume2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface VoiceToAITokenCreatorProps {
  onTokenDataGenerated: (tokenData: {
    message: string;
    description: string;
    optimizedContent: string;
    aiInsights: any;
  }) => void;
  className?: string;
}

export function VoiceToAITokenCreator({ onTokenDataGenerated, className }: VoiceToAITokenCreatorProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState('');
  const [processingStage, setProcessingStage] = useState<string>('');
  const [progress, setProgress] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "Speak your token idea - AI will optimize it for you",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processVoiceToToken = async () => {
    if (!audioBlob) return;

    setIsProcessing(true);
    setProgress(0);
    
    try {
      // Stage 1: Transcription
      setProcessingStage('Converting speech to text...');
      setProgress(20);
      
      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice-input.wav');
      
      const transcriptionResponse = await fetch('/api/ai-premium/voice-transcription', {
        method: 'POST',
        body: formData,
      });
      
      if (!transcriptionResponse.ok) {
        throw new Error('Transcription failed');
      }
      
      const { transcription } = await transcriptionResponse.json();
      setTranscription(transcription);
      setProgress(40);

      // Stage 2: AI Content Optimization
      setProcessingStage('AI optimizing your content...');
      setProgress(60);
      
      const optimizationResponse = await apiRequest('/api/ai-premium/voice-to-token-optimization', 'POST', {
        transcription,
        userTier: 'pro', // Could be dynamic based on user subscription
        optimizationLevel: 'advanced'
      });
      
      setProgress(80);

      // Stage 3: Generate Token Insights
      setProcessingStage('Generating token insights...');
      
      const insightsResponse = await apiRequest('/api/comprehensive-ai/blockchain/intelligent-analysis', 'POST', {
        tokenConcept: optimizationResponse.optimizedMessage,
        contentAnalysis: {
          originalVoice: transcription,
          optimizedContent: optimizationResponse.optimizedContent,
          emotionalTone: optimizationResponse.emotionalAnalysis
        }
      });
      
      setProgress(100);
      setProcessingStage('Complete!');

      // Prepare final token data
      const tokenData = {
        message: optimizationResponse.optimizedMessage.substring(0, 27),
        description: optimizationResponse.optimizedContent,
        optimizedContent: optimizationResponse.fullOptimizedContent,
        aiInsights: {
          ...insightsResponse,
          voiceAnalysis: optimizationResponse.voiceCharacteristics,
          originalTranscription: transcription,
          optimizationSuggestions: optimizationResponse.suggestions
        }
      };

      onTokenDataGenerated(tokenData);
      
      toast({
        title: "Voice-to-Token Complete!",
        description: "Your voice input has been transformed into an optimized token",
      });

      // Reset state
      setTimeout(() => {
        setIsProcessing(false);
        setAudioBlob(null);
        setTranscription('');
        setProgress(0);
        setProcessingStage('');
      }, 2000);

    } catch (error) {
      console.error('Voice processing error:', error);
      toast({
        title: "Processing Failed",
        description: "Could not process voice input. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const playAudio = () => {
    if (audioBlob) {
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audio.play();
    }
  };

  return (
    <Card className={`bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/30 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-400">
          <Mic className="w-5 h-5" />
          Voice-to-AI Token Creator
          <Badge className="bg-purple-500/20 text-purple-300">Revolutionary</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Recording Interface */}
        <div className="text-center space-y-4">
          {!audioBlob && !isProcessing && (
            <div className="space-y-3">
              <div className={`w-20 h-20 mx-auto rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                isRecording 
                  ? 'border-red-500 bg-red-500/20 animate-pulse' 
                  : 'border-purple-500 bg-purple-500/10 hover:bg-purple-500/20'
              }`}>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={isRecording ? stopRecording : startRecording}
                  className="w-full h-full rounded-full"
                >
                  {isRecording ? (
                    <Square className="w-8 h-8 text-red-400" />
                  ) : (
                    <Mic className="w-8 h-8 text-purple-400" />
                  )}
                </Button>
              </div>
              
              <div className="text-sm text-white/70">
                {isRecording ? (
                  <div className="space-y-1">
                    <div className="text-red-400 font-medium animate-pulse">Recording in progress...</div>
                    <div>Speak your token idea clearly</div>
                  </div>
                ) : (
                  <div>Click to start recording your token idea</div>
                )}
              </div>
            </div>
          )}

          {/* Audio Preview */}
          {audioBlob && !isProcessing && (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={playAudio}
                  className="border-purple-500/50 text-purple-400"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Preview Recording
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAudioBlob(null)}
                  className="border-gray-500/50 text-gray-400"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Re-record
                </Button>
              </div>
              
              <Button
                onClick={processVoiceToToken}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Transform to Token with AI
              </Button>
            </div>
          )}

          {/* Processing Interface */}
          {isProcessing && (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <div className="text-sm text-purple-400 font-medium">{processingStage}</div>
              </div>

              {transcription && (
                <div className="text-xs text-white/60 bg-black/20 p-3 rounded border border-purple-500/20">
                  <strong>Transcribed:</strong> {transcription}
                </div>
              )}
              
              {progress === 100 && (
                <div className="flex items-center justify-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Voice-to-Token transformation complete!</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Feature Benefits */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-purple-500/20">
          <div className="text-center space-y-1">
            <Sparkles className="w-4 h-4 mx-auto text-purple-400" />
            <div className="text-xs text-white/70">AI Optimization</div>
          </div>
          <div className="text-center space-y-1">
            <Volume2 className="w-4 h-4 mx-auto text-purple-400" />
            <div className="text-xs text-white/70">Voice Analysis</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default VoiceToAITokenCreator;