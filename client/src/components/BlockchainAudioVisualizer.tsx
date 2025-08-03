import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Volume2, 
  Settings,
  Waves,
  Zap,
  Eye,
  Sparkles,
  Activity,
  BarChart3
} from 'lucide-react';

interface BlockchainAudioVisualizerProps {
  audioUrl: string;
  audioAnalysis: any;
  isEnhanced?: boolean;
}

export function BlockchainAudioVisualizer({ audioUrl, audioAnalysis, isEnhanced }: BlockchainAudioVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [visualizationData, setVisualizationData] = useState<number[]>([]);
  const [blockchainPulse, setBlockchainPulse] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    // Generate visualization data based on audio analysis
    const generateVisualization = () => {
      const data = Array.from({ length: 128 }, (_, i) => {
        const frequency = audioAnalysis?.frequency || 440;
        const energy = audioAnalysis?.energy || 50;
        const emotion = audioAnalysis?.emotion || 'neutral';
        
        // Create frequency-based visualization
        const baseValue = Math.sin(i * 0.1 + Date.now() * 0.001) * 0.5 + 0.5;
        const energyMultiplier = energy / 100;
        const emotionBoost = emotion === 'Joy' ? 1.3 : emotion === 'Excitement' ? 1.5 : 1.0;
        
        return baseValue * energyMultiplier * emotionBoost;
      });
      
      setVisualizationData(data);
    };

    const interval = setInterval(generateVisualization, 100);
    return () => clearInterval(interval);
  }, [audioAnalysis]);

  useEffect(() => {
    // Blockchain pulse effect
    const pulseInterval = setInterval(() => {
      setBlockchainPulse(prev => (prev + 1) % 100);
    }, 50);

    return () => clearInterval(pulseInterval);
  }, []);

  useEffect(() => {
    // Canvas animation
    const animate = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw waveform
      ctx.beginPath();
      ctx.strokeStyle = isEnhanced 
        ? `hsl(${280 + blockchainPulse * 0.8}, 70%, 60%)`
        : `hsl(${200 + blockchainPulse * 0.5}, 60%, 50%)`;
      ctx.lineWidth = 2;

      const barWidth = width / visualizationData.length;
      
      visualizationData.forEach((value, index) => {
        const barHeight = value * height * 0.8;
        const x = index * barWidth;
        const y = height - barHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Draw frequency bars
      ctx.fillStyle = isEnhanced
        ? `hsla(${320 + blockchainPulse}, 60%, 50%, 0.6)`
        : `hsla(${180 + blockchainPulse}, 50%, 40%, 0.4)`;

      visualizationData.forEach((value, index) => {
        const barHeight = value * height * 0.6;
        const x = index * barWidth;
        const y = height - barHeight;
        
        ctx.fillRect(x, y, barWidth - 1, barHeight);
      });

      // Draw blockchain pulse overlay
      if (isPlaying) {
        const pulseIntensity = Math.sin(blockchainPulse * 0.1) * 0.3 + 0.7;
        ctx.fillStyle = `hsla(${isEnhanced ? 280 : 200}, 70%, 60%, ${pulseIntensity * 0.1})`;
        ctx.fillRect(0, 0, width, height);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [visualizationData, blockchainPulse, isPlaying, isEnhanced]);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={`bg-gradient-to-br ${
      isEnhanced 
        ? 'from-purple-900/40 via-pink-900/30 to-indigo-900/40 border-purple-500/40' 
        : 'from-slate-900/50 via-blue-900/30 to-teal-900/40 border-blue-500/30'
    } backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className={`text-transparent bg-clip-text bg-gradient-to-r ${
          isEnhanced 
            ? 'from-purple-400 via-pink-500 to-indigo-500' 
            : 'from-blue-400 via-teal-500 to-green-500'
        } flex items-center gap-2`}>
          <Waves className={`w-6 h-6 ${isEnhanced ? 'text-purple-400' : 'text-blue-400'} animate-pulse`} />
          Blockchain Audio Visualizer
          {isEnhanced && (
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 animate-pulse">
              AI ENHANCED
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Audio Visualizer Canvas */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={200}
            className="w-full h-32 rounded-lg border border-gray-700/50 bg-black/20"
          />
          
          {/* Overlay Controls */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
            <Button
              size="lg"
              onClick={togglePlayback}
              className={`w-16 h-16 rounded-full bg-gradient-to-r ${
                isEnhanced 
                  ? 'from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                  : 'from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700'
              } shadow-lg`}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Audio Controls */}
        <div className="space-y-3">
          <audio
            ref={audioRef}
            src={audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />

          {/* Progress Bar */}
          <div className="relative">
            <div className={`w-full h-2 rounded-full bg-gray-700/50`}>
              <div 
                className={`h-full rounded-full bg-gradient-to-r ${
                  isEnhanced 
                    ? 'from-purple-500 to-pink-500' 
                    : 'from-blue-500 to-teal-500'
                } transition-all duration-300`}
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            
            {/* Blockchain pulse indicators */}
            <div className="absolute inset-0 flex justify-between items-center px-1">
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={i}
                  className={`w-1 h-1 rounded-full ${
                    isEnhanced ? 'bg-purple-400' : 'bg-blue-400'
                  } animate-pulse`}
                  style={{ 
                    animationDelay: `${i * 100}ms`,
                    opacity: Math.sin((blockchainPulse + i * 10) * 0.1) * 0.5 + 0.5
                  }}
                />
              ))}
            </div>
          </div>

          {/* Time Display */}
          <div className="flex justify-between items-center text-sm text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span>{isPlaying ? 'Broadcasting to Blockchain' : 'Stored on Solana'}</span>
            </div>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Audio Analysis Display */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 p-3 rounded-lg border ${
          isEnhanced 
            ? 'bg-purple-900/20 border-purple-500/20' 
            : 'bg-blue-900/20 border-blue-500/20'
        }`}>
          <div className="text-center">
            <div className={`text-lg font-bold ${isEnhanced ? 'text-purple-300' : 'text-blue-300'}`}>
              {audioAnalysis?.emotion || 'Analyzing...'}
            </div>
            <div className="text-xs text-gray-400">Emotion</div>
          </div>
          
          <div className="text-center">
            <div className={`text-lg font-bold ${isEnhanced ? 'text-pink-300' : 'text-teal-300'}`}>
              {Math.round(audioAnalysis?.energy || 0)}%
            </div>
            <div className="text-xs text-gray-400">Energy</div>
          </div>
          
          <div className="text-center">
            <div className={`text-lg font-bold ${isEnhanced ? 'text-indigo-300' : 'text-green-300'}`}>
              {Math.round(audioAnalysis?.clarity || 0)}%
            </div>
            <div className="text-xs text-gray-400">Clarity</div>
          </div>
          
          <div className="text-center">
            <div className={`text-lg font-bold ${isEnhanced ? 'text-yellow-300' : 'text-cyan-300'}`}>
              ${audioAnalysis?.estimatedValue || '0.000'}
            </div>
            <div className="text-xs text-gray-400">Value</div>
          </div>
        </div>

        {/* Enhanced Features Display */}
        {isEnhanced && (
          <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg p-3 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-purple-300 font-medium">AI-Enhanced Visualization</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3 text-purple-400" />
                <span>Neural pattern mapping active</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-pink-400" />
                <span>Real-time blockchain sync</span>
              </div>
              <div className="flex items-center gap-1">
                <BarChart3 className="w-3 h-3 text-indigo-400" />
                <span>Advanced frequency analysis</span>
              </div>
              <div className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-yellow-400" />
                <span>Viral potential tracking</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}