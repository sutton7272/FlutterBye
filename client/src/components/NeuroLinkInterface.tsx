import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Zap, 
  Activity, 
  Waves, 
  Radio,
  Cpu,
  Eye,
  Heart,
  Sparkles,
  Target,
  Wifi,
  Power,
  Shield,
  Lock,
  Unlock,
  Signal,
  Database,
  CloudLightning
} from 'lucide-react';

interface NeuroLinkInterfaceProps {
  message: string;
  onNeuroSync: (brainState: any) => void;
}

export function NeuroLinkInterface({ message, onNeuroSync }: NeuroLinkInterfaceProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [brainActivity, setBrainActivity] = useState(0);
  const [emotionalSync, setEmotionalSync] = useState(0);
  const [neuralPatterns, setNeuralPatterns] = useState<any[]>([]);
  const [syncLevel, setSyncLevel] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Simulated Brainwave Patterns
  const brainwaveTypes = [
    { name: 'Alpha', frequency: '8-13 Hz', color: '#3B82F6', associated: 'Creativity' },
    { name: 'Beta', frequency: '13-30 Hz', color: '#10B981', associated: 'Focus' },
    { name: 'Gamma', frequency: '30-100 Hz', color: '#F59E0B', associated: 'Insight' },
    { name: 'Theta', frequency: '4-8 Hz', color: '#8B5CF6', associated: 'Emotion' },
    { name: 'Delta', frequency: '0.5-4 Hz', color: '#EC4899', associated: 'Deep State' }
  ];

  // Neural Activity Visualization
  useEffect(() => {
    if (!isConnected || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 200;

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Background grid
      ctx.strokeStyle = 'rgba(100, 100, 100, 0.2)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Neural waveforms
      brainwaveTypes.forEach((wave, index) => {
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const yOffset = (canvas.height / brainwaveTypes.length) * (index + 0.5);
        const amplitude = 20 + Math.sin(time * 0.01) * 10;
        const frequency = (index + 1) * 0.1;
        
        for (let x = 0; x < canvas.width; x++) {
          const y = yOffset + Math.sin((x + time) * frequency) * amplitude;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      time += 2;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isConnected]);

  // Neural Pattern Analysis
  const analyzeNeuralPatterns = () => {
    const patterns: any[] = [];
    const textLength = message.length;
    const emotionWords = (message.match(/love|amazing|incredible|excited|grateful|happy|wonderful|brilliant|fantastic/gi) || []).length;
    
    // Generate patterns based on message analysis
    brainwaveTypes.forEach((wave, index) => {
      const intensity = Math.min(100, (textLength * 2) + (emotionWords * 10) + Math.random() * 30);
      const coherence = Math.min(100, intensity * 0.8 + Math.random() * 20);
      
      patterns.push({
        ...wave,
        intensity,
        coherence,
        dominance: intensity > 70 ? 'high' : intensity > 40 ? 'medium' : 'low',
        synchronization: coherence
      });
    });

    setNeuralPatterns(patterns);
    return patterns;
  };

  // Initiate Neural Sync
  const startNeuroSync = () => {
    setIsConnected(true);
    setIsScanning(true);
    
    // Simulated connection sequence
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      setBrainActivity(Math.min(100, progress));
      setEmotionalSync(Math.min(100, progress * 0.8));
      setSyncLevel(Math.min(100, progress * 0.9));
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        const patterns = analyzeNeuralPatterns();
        onNeuroSync({
          patterns,
          syncLevel: 100,
          timestamp: Date.now(),
          coherenceIndex: patterns.reduce((sum, p) => sum + p.coherence, 0) / patterns.length
        });
      }
    }, 200);
  };

  const disconnectNeuroLink = () => {
    setIsConnected(false);
    setIsScanning(false);
    setBrainActivity(0);
    setEmotionalSync(0);
    setSyncLevel(0);
    setNeuralPatterns([]);
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900/90 via-green-900/20 to-blue-900/30 border-2 border-green-500/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 flex items-center gap-2">
          <Brain className="w-6 h-6 text-green-400 animate-pulse" />
          NeuroLink Interface™
          <Badge variant="secondary" className="bg-green-500/20 text-green-300 animate-bounce">
            MIND-BENDING
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-green-500/20">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full animate-pulse ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className="text-green-300 font-medium">
              {isConnected ? 'Neural Link Active' : 'Neural Link Offline'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Signal className={`w-4 h-4 ${isConnected ? 'text-green-400' : 'text-gray-400'}`} />
            <Wifi className={`w-4 h-4 ${isConnected ? 'text-green-400' : 'text-gray-400'}`} />
            <Shield className={`w-4 h-4 ${isConnected ? 'text-green-400' : 'text-gray-400'}`} />
          </div>
        </div>

        {/* Neural Sync Controls */}
        <div className="text-center space-y-4">
          <Button
            size="lg"
            onClick={isConnected ? disconnectNeuroLink : startNeuroSync}
            disabled={isScanning}
            className={`
              ${isConnected 
                ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600' 
                : 'bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 hover:from-green-600 hover:via-blue-600 hover:to-purple-600'
              } 
              text-white border-none text-lg px-8 py-4 transition-all duration-300 transform hover:scale-105
              ${isScanning ? 'animate-pulse' : ''}
            `}
          >
            {isScanning ? (
              <>
                <Activity className="w-5 h-5 mr-2 animate-spin" />
                Syncing Neural Patterns...
              </>
            ) : isConnected ? (
              <>
                <Power className="w-5 h-5 mr-2" />
                Disconnect NeuroLink
              </>
            ) : (
              <>
                <Brain className="w-5 h-5 mr-2" />
                Connect to NeuroLink
              </>
            )}
          </Button>

          {isScanning && (
            <div className="space-y-2">
              <div className="text-sm text-green-300">Establishing neural connection...</div>
              <Progress value={syncLevel} className="w-full" />
            </div>
          )}
        </div>

        {/* Neural Activity Monitor */}
        {isConnected && (
          <div className="space-y-6">
            {/* Brainwave Visualization */}
            <div className="bg-black/30 rounded-lg border border-green-500/20 overflow-hidden">
              <div className="p-3 border-b border-green-500/20">
                <div className="flex items-center gap-2">
                  <Waves className="w-4 h-4 text-green-400" />
                  <span className="text-green-300 font-medium">Live Brainwave Patterns</span>
                </div>
              </div>
              <canvas ref={canvasRef} className="w-full h-48" />
            </div>

            {/* Neural Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-black/30 rounded-lg p-4 border border-green-500/20 text-center">
                <Activity className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-300">{Math.round(brainActivity)}%</div>
                <div className="text-xs text-gray-400">Brain Activity</div>
              </div>
              
              <div className="bg-black/30 rounded-lg p-4 border border-blue-500/20 text-center">
                <Heart className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-300">{Math.round(emotionalSync)}%</div>
                <div className="text-xs text-gray-400">Emotional Sync</div>
              </div>
              
              <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20 text-center">
                <Target className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-300">{Math.round(syncLevel)}%</div>
                <div className="text-xs text-gray-400">Sync Level</div>
              </div>
            </div>

            {/* Brainwave Analysis */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Database className="w-4 h-4 text-green-400" />
                <span className="text-green-300 font-medium">Neural Pattern Analysis</span>
              </div>
              
              {neuralPatterns.map((pattern, index) => (
                <div key={index} className="bg-black/30 rounded-lg p-3 border border-gray-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full animate-pulse"
                        style={{ backgroundColor: pattern.color }}
                      />
                      <span className="text-white font-medium">{pattern.name} Wave</span>
                      <span className="text-gray-400 text-sm">{pattern.frequency}</span>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`
                        ${pattern.dominance === 'high' ? 'bg-green-500/20 text-green-300' :
                          pattern.dominance === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-gray-500/20 text-gray-300'
                        }
                      `}
                    >
                      {pattern.dominance.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Intensity</div>
                      <Progress value={pattern.intensity} className="h-2" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Coherence</div>
                      <Progress value={pattern.coherence} className="h-2" />
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-400">
                    Associated with: <span className="text-white">{pattern.associated}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Neural Enhancement Suggestions */}
            <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg p-4 border border-green-500/20">
              <div className="flex items-center gap-2 mb-3">
                <CloudLightning className="w-4 h-4 text-green-400" />
                <span className="text-green-300 font-medium">AI Enhancement Suggestions</span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-yellow-400" />
                  <span className="text-gray-300">
                    Your Alpha waves show high creativity potential - perfect for artistic tokens
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-3 h-3 text-blue-400" />
                  <span className="text-gray-300">
                    Beta activity indicates strong focus - ideal for precision messaging
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-3 h-3 text-pink-400" />
                  <span className="text-gray-300">
                    Theta synchronization suggests deep emotional resonance
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}