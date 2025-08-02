import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Zap, 
  Heart, 
  Brain, 
  Wand2, 
  Globe, 
  Clock, 
  Users,
  TrendingUp,
  Camera,
  Mic,
  Video,
  Share2,
  Star,
  Crown,
  Flame,
  Snowflake,
  Volume2,
  VolumeX,
  Play,
  Pause
} from 'lucide-react';

interface EmotionPortalProps {
  message: string;
  onEmotionChange: (emotion: any) => void;
}

export function EmotionPortal({ message, onEmotionChange }: EmotionPortalProps) {
  const [isActive, setIsActive] = useState(false);
  const [emotionField, setEmotionField] = useState<any[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Emotion Particles System
  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 300;

    const particles: any[] = [];
    const emotions = ['❤️', '🌟', '⚡', '🔥', '💎', '🌈', '✨', '💫', '🎆', '🌙'];

    // Create emotion particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        emotion: emotions[Math.floor(Math.random() * emotions.length)],
        size: Math.random() * 20 + 10,
        alpha: Math.random(),
        pulse: Math.random() * Math.PI * 2
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
      );
      gradient.addColorStop(0, 'rgba(147, 51, 234, 0.1)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.pulse += 0.1;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Draw particle with pulsing effect
        ctx.save();
        ctx.globalAlpha = particle.alpha * (0.5 + 0.5 * Math.sin(particle.pulse));
        ctx.font = `${particle.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(particle.emotion, particle.x, particle.y);
        ctx.restore();
      });

      if (isActive) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [isActive]);

  // Spatial Audio for Emotions
  const playEmotionSound = (emotion: string) => {
    if (!soundEnabled) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Emotion-specific frequencies
    const emotionFrequencies: { [key: string]: number } = {
      'love': 528,      // Love frequency
      'joy': 741,       // Expression frequency
      'peace': 396,     // Liberation frequency
      'gratitude': 639, // Connection frequency
      'excitement': 852 // Intuition frequency
    };

    oscillator.frequency.setValueAtTime(
      emotionFrequencies[emotion] || 440, 
      audioContext.currentTime
    );
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  // Emotion Recognition Patterns
  const detectEmotionPattern = (text: string) => {
    const patterns = {
      'quantum_love': /love|heart|forever|soul|infinite/gi,
      'cosmic_joy': /amazing|incredible|fantastic|wonderful|brilliant/gi,
      'neural_gratitude': /thank|grateful|appreciate|blessing|gift/gi,
      'dimensional_excitement': /excited|thrilled|pumped|energized|fired/gi,
      'ethereal_peace': /calm|peace|serene|tranquil|zen/gi
    };

    const detected = [];
    for (const [emotion, pattern] of Object.entries(patterns)) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        detected.push({
          emotion,
          intensity: matches.length / text.split(' ').length,
          matches: matches.length
        });
      }
    }

    return detected.sort((a, b) => b.intensity - a.intensity);
  };

  // Emotion Field Generator
  const generateEmotionField = () => {
    const patterns = detectEmotionPattern(message);
    const field = patterns.map((pattern, index) => ({
      ...pattern,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: pattern.intensity * 100 + 20,
      color: [
        'hsl(315, 100%, 60%)', // quantum_love - magenta
        'hsl(60, 100%, 60%)',  // cosmic_joy - yellow  
        'hsl(120, 100%, 60%)', // neural_gratitude - green
        'hsl(30, 100%, 60%)',  // dimensional_excitement - orange
        'hsl(240, 100%, 60%)'  // ethereal_peace - blue
      ][index % 5]
    }));

    setEmotionField(field);
    return field;
  };

  // Holographic Emotion Visualization
  const EmotionHologram = ({ emotion }: { emotion: any }) => (
    <div 
      className="absolute rounded-full opacity-70 animate-pulse"
      style={{
        left: `${emotion.x}%`,
        top: `${emotion.y}%`,
        width: `${emotion.size}px`,
        height: `${emotion.size}px`,
        background: `radial-gradient(circle, ${emotion.color}, transparent)`,
        transform: 'translate(-50%, -50%)',
        filter: 'blur(2px)',
        animation: `float 3s ease-in-out infinite ${Math.random() * 2}s`
      }}
    />
  );

  return (
    <Card className="bg-gradient-to-br from-slate-900/90 via-purple-900/30 to-blue-900/30 border-2 border-purple-500/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 flex items-center gap-2">
          <Wand2 className="w-6 h-6 text-purple-400 animate-spin" />
          Emotion Portal™
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 animate-bounce">
            REVOLUTIONARY
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Portal Activation */}
        <div className="text-center space-y-4">
          <Button
            size="lg"
            onClick={() => {
              setIsPortalOpen(!isPortalOpen);
              setIsActive(!isActive);
              if (!isActive) {
                generateEmotionField();
                playEmotionSound('excitement');
              }
            }}
            className={`
              ${isPortalOpen 
                ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 shadow-lg shadow-purple-500/50' 
                : 'bg-gradient-to-r from-gray-600 to-gray-700'
              } 
              text-white border-none text-lg px-8 py-4 transition-all duration-300 transform hover:scale-105
            `}
          >
            {isPortalOpen ? (
              <>
                <Zap className="w-5 h-5 mr-2 animate-pulse" />
                Portal Active
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Open Emotion Portal
              </>
            )}
          </Button>

          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="border-purple-500/30 text-purple-300"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Emotion Field Visualization */}
        {isPortalOpen && (
          <div className="space-y-4">
            {/* Particle Canvas */}
            <div className="relative bg-black/20 rounded-lg border border-purple-500/20 overflow-hidden">
              <canvas
                ref={canvasRef}
                className="w-full h-48 rounded-lg"
              />
              
              {/* Emotion Field Overlay */}
              <div className="absolute inset-0">
                {emotionField.map((emotion, index) => (
                  <EmotionHologram key={index} emotion={emotion} />
                ))}
              </div>

              {/* Dimensional Grid */}
              <div className="absolute inset-0 opacity-20">
                <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div key={i} className="border border-purple-500/10" />
                  ))}
                </div>
              </div>
            </div>

            {/* Emotion Analysis Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {detectEmotionPattern(message).slice(0, 4).map((pattern, index) => (
                <div
                  key={index}
                  className="bg-black/30 rounded-lg p-3 border border-purple-500/20 cursor-pointer hover:bg-black/40 transition-all duration-200"
                  onClick={() => {
                    playEmotionSound(pattern.emotion);
                    onEmotionChange({
                      type: pattern.emotion,
                      intensity: pattern.intensity,
                      frequency: pattern.matches
                    });
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-yellow-400" />
                      <span className="text-purple-300 font-medium capitalize">
                        {pattern.emotion.replace('_', ' ')}
                      </span>
                    </div>
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                      {Math.round(pattern.intensity * 100)}%
                    </Badge>
                  </div>
                  
                  <div className="mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${pattern.intensity * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Portal Statistics */}
            <div className="bg-black/20 rounded-lg p-4 border border-purple-500/20">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-400">{emotionField.length}</div>
                  <div className="text-xs text-gray-400">Dimensions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-pink-400">
                    {Math.round(emotionField.reduce((sum, e) => sum + e.intensity, 0) * 100)}%
                  </div>
                  <div className="text-xs text-gray-400">Field Strength</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">
                    {Math.round(message.length / 10)}x
                  </div>
                  <div className="text-xs text-gray-400">Amplification</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Revolutionary Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button variant="ghost" size="sm" className="text-purple-300 hover:bg-purple-500/10">
            <Brain className="w-4 h-4 mr-1" />
            Neural
          </Button>
          <Button variant="ghost" size="sm" className="text-blue-300 hover:bg-blue-500/10">
            <Globe className="w-4 h-4 mr-1" />
            Quantum
          </Button>
          <Button variant="ghost" size="sm" className="text-pink-300 hover:bg-pink-500/10">
            <Heart className="w-4 h-4 mr-1" />
            Ethereal
          </Button>
          <Button variant="ghost" size="sm" className="text-yellow-300 hover:bg-yellow-500/10">
            <Star className="w-4 h-4 mr-1" />
            Cosmic
          </Button>
        </div>
      </CardContent>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-10px); }
        }
      `}</style>
    </Card>
  );
}