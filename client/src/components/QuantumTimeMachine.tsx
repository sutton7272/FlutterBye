import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Rewind, 
  FastForward, 
  Calendar, 
  Globe, 
  Zap,
  Layers,
  Eye,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Play,
  Pause,
  TrendingUp,
  TrendingDown,
  Target
} from 'lucide-react';

interface QuantumTimeMachineProps {
  message: string;
  onTimeTravel: (prediction: any) => void;
}

export function QuantumTimeMachine({ message, onTimeTravel }: QuantumTimeMachineProps) {
  const [timePosition, setTimePosition] = useState([0]);
  const [isActive, setIsActive] = useState(false);
  const [currentDimension, setCurrentDimension] = useState('present');
  const [predictions, setPredictions] = useState<any[]>([]);
  const [autoPlay, setAutoPlay] = useState(false);

  // Time Travel Calculations
  const timePositions = [
    { value: -100, label: '1 Year Ago', dimension: 'past-year' },
    { value: -50, label: '1 Month Ago', dimension: 'past-month' },
    { value: -25, label: '1 Week Ago', dimension: 'past-week' },
    { value: -10, label: '1 Day Ago', dimension: 'past-day' },
    { value: 0, label: 'NOW', dimension: 'present' },
    { value: 10, label: '1 Day Future', dimension: 'future-day' },
    { value: 25, label: '1 Week Future', dimension: 'future-week' },
    { value: 50, label: '1 Month Future', dimension: 'future-month' },
    { value: 100, label: '1 Year Future', dimension: 'future-year' }
  ];

  // Quantum Emotion Prediction Algorithm
  const predictEmotionValue = (timeValue: number) => {
    const base = 0.1;
    const volatility = Math.abs(timeValue) / 100;
    const trendFactor = message.length > 50 ? 1.2 : 0.8;
    const emotionWords = (message.match(/love|amazing|incredible|excited|grateful|happy|wonderful/gi) || []).length;
    
    let multiplier = 1;
    if (timeValue < 0) {
      // Past: Lower values due to historical context
      multiplier = 0.6 + (emotionWords * 0.1);
    } else if (timeValue > 0) {
      // Future: Higher values due to appreciation over time
      multiplier = 1.4 + (emotionWords * 0.2) + (volatility * 0.5);
    } else {
      // Present: Current market value
      multiplier = 1 + (emotionWords * 0.15);
    }

    return base * multiplier * trendFactor;
  };

  // Generate Temporal Predictions
  const generatePredictions = () => {
    const newPredictions = timePositions.map(pos => {
      const value = predictEmotionValue(pos.value);
      const confidence = Math.max(0.3, 1 - Math.abs(pos.value) / 150);
      
      return {
        ...pos,
        predictedValue: value,
        confidence,
        marketTrend: pos.value > 0 ? 
          (value > 0.15 ? 'bullish' : 'neutral') : 
          (value < 0.08 ? 'bearish' : 'stable'),
        rarity: value > 0.2 ? 'legendary' : value > 0.15 ? 'epic' : value > 0.1 ? 'rare' : 'common',
        timeDistortion: Math.abs(pos.value) / 10
      };
    });

    setPredictions(newPredictions);
    return newPredictions;
  };

  // Auto-play time travel
  useEffect(() => {
    if (!autoPlay || !isActive) return;

    const interval = setInterval(() => {
      setTimePosition(prev => {
        const newValue = prev[0] + 10;
        if (newValue > 100) return [-100];
        return [newValue];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoPlay, isActive]);

  // Update current dimension based on time position
  useEffect(() => {
    const currentPos = timePositions.find(pos => 
      Math.abs(pos.value - timePosition[0]) < 5
    );
    if (currentPos) {
      setCurrentDimension(currentPos.dimension);
      const prediction = predictions.find(p => p.value === currentPos.value);
      if (prediction) {
        onTimeTravel(prediction);
      }
    }
  }, [timePosition, predictions, onTimeTravel]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-400 animate-pulse';
      case 'epic': return 'text-purple-400';
      case 'rare': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'bearish': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Target className="w-4 h-4 text-yellow-400" />;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900/90 via-indigo-900/30 to-cyan-900/30 border-2 border-cyan-500/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 flex items-center gap-2">
          <Clock className="w-6 h-6 text-cyan-400 animate-spin" />
          Quantum Time Machine™
          <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 animate-bounce">
            IMPOSSIBLE
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Time Machine Controls */}
        <div className="text-center space-y-4">
          <Button
            size="lg"
            onClick={() => {
              setIsActive(!isActive);
              if (!isActive) {
                generatePredictions();
              }
            }}
            className={`
              ${isActive 
                ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 shadow-lg shadow-cyan-500/50' 
                : 'bg-gradient-to-r from-gray-600 to-gray-700'
              } 
              text-white border-none text-lg px-8 py-4 transition-all duration-300 transform hover:scale-105
            `}
          >
            {isActive ? (
              <>
                <Zap className="w-5 h-5 mr-2 animate-pulse" />
                Time Machine Active
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Activate Time Machine
              </>
            )}
          </Button>

          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoPlay(!autoPlay)}
              className="border-cyan-500/30 text-cyan-300"
            >
              {autoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTimePosition([0])}
              className="border-cyan-500/30 text-cyan-300"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Time Travel Interface */}
        {isActive && (
          <div className="space-y-6">
            {/* Temporal Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Rewind className="w-5 h-5 text-cyan-400" />
                  <span className="text-cyan-300 font-medium">Past</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-300 font-medium">Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <FastForward className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-300 font-medium">Future</span>
                </div>
              </div>

              <div className="relative">
                <Slider
                  value={timePosition}
                  onValueChange={setTimePosition}
                  max={100}
                  min={-100}
                  step={5}
                  className="w-full"
                />
                
                {/* Time Position Markers */}
                <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-xs text-gray-400">
                  <span>1Y Ago</span>
                  <span>1M Ago</span>
                  <span>NOW</span>
                  <span>1M Future</span>
                  <span>1Y Future</span>
                </div>
              </div>
            </div>

            {/* Current Dimension Display */}
            <div className="bg-black/30 rounded-lg p-4 border border-cyan-500/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                  {timePositions.find(pos => Math.abs(pos.value - timePosition[0]) < 5)?.label || 'Temporal Flux'}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  Current Dimension: {currentDimension.replace('-', ' ').toUpperCase()}
                </div>
              </div>
            </div>

            {/* Temporal Predictions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {predictions.slice(0, 6).map((prediction, index) => (
                <div
                  key={index}
                  className={`
                    bg-black/30 rounded-lg p-3 border cursor-pointer transition-all duration-300 transform hover:scale-105
                    ${Math.abs(prediction.value - timePosition[0]) < 5 
                      ? 'border-cyan-400 bg-cyan-500/10' 
                      : 'border-gray-500/20'
                    }
                  `}
                  onClick={() => {
                    setTimePosition([prediction.value]);
                    onTimeTravel(prediction);
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-cyan-300 font-medium text-sm">
                      {prediction.label}
                    </span>
                    {getTrendIcon(prediction.marketTrend)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-xs">Value:</span>
                      <span className={`font-bold ${getRarityColor(prediction.rarity)}`}>
                        ${prediction.predictedValue.toFixed(3)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-xs">Confidence:</span>
                      <span className="text-blue-300 text-xs">
                        {Math.round(prediction.confidence * 100)}%
                      </span>
                    </div>

                    <div className="w-full bg-gray-700 rounded-full h-1">
                      <div
                        className={`h-1 rounded-full transition-all duration-500 ${
                          prediction.rarity === 'legendary' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                          prediction.rarity === 'epic' ? 'bg-gradient-to-r from-purple-400 to-pink-500' :
                          prediction.rarity === 'rare' ? 'bg-gradient-to-r from-blue-400 to-cyan-500' :
                          'bg-gray-400'
                        }`}
                        style={{ width: `${prediction.confidence * 100}%` }}
                      />
                    </div>

                    <Badge 
                      variant="secondary" 
                      className={`
                        text-xs w-full justify-center
                        ${prediction.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-300' :
                          prediction.rarity === 'epic' ? 'bg-purple-500/20 text-purple-300' :
                          prediction.rarity === 'rare' ? 'bg-blue-500/20 text-blue-300' :
                          'bg-gray-500/20 text-gray-300'
                        }
                      `}
                    >
                      {prediction.rarity.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Quantum Statistics */}
            <div className="bg-black/20 rounded-lg p-4 border border-cyan-500/20">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-cyan-400">
                    {predictions.length}
                  </div>
                  <div className="text-xs text-gray-400">Timelines</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-400">
                    {Math.round(timePosition[0])}
                  </div>
                  <div className="text-xs text-gray-400">Position</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-400">
                    {predictions.filter(p => p.rarity === 'legendary').length}
                  </div>
                  <div className="text-xs text-gray-400">Legendary</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-pink-400">
                    ∞
                  </div>
                  <div className="text-xs text-gray-400">Possibilities</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}