import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useImmersiveAI } from '@/hooks/useImmersiveAI';

interface ImmersiveBackgroundProps {
  mood?: string;
  intensity?: number;
  context?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
}

/**
 * Immersive Background Component - Creates living, breathing environments
 * Responds to user mood and context with dynamic visual effects
 */
export function ImmersiveBackground({ 
  mood = 'electric', 
  intensity = 70, 
  context = 'general' 
}: ImmersiveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const {
    currentEnvironment,
    updateEnvironment,
    trackMicroInteraction
  } = useImmersiveAI('user', context);

  // Update environment when mood changes
  useEffect(() => {
    updateEnvironment(mood, 'viewing');
    trackMicroInteraction('mood_change', { mood, intensity });
  }, [mood, updateEnvironment, trackMicroInteraction, intensity]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize particles based on environment
  useEffect(() => {
    if (!currentEnvironment) return;

    const particleCount = Math.floor(intensity * 2); // More particles for higher intensity
    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        color: currentEnvironment.dynamicBackground.color,
        life: 1
      });
    }

    setParticles(newParticles);
  }, [currentEnvironment, intensity, dimensions]);

  // Animation loop
  useEffect(() => {
    if (!canvasRef.current || particles.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and render particles
      setParticles(prevParticles => {
        return prevParticles.map(particle => {
          // Update position
          const newX = particle.x + particle.vx;
          const newY = particle.y + particle.vy;

          // Bounce off edges
          let newVx = particle.vx;
          let newVy = particle.vy;

          if (newX <= 0 || newX >= canvas.width) newVx *= -1;
          if (newY <= 0 || newY >= canvas.height) newVy *= -1;

          // Render particle
          ctx.save();
          ctx.globalAlpha = particle.life * (intensity / 100);
          ctx.fillStyle = particle.color;
          ctx.shadowBlur = particle.size * 2;
          ctx.shadowColor = particle.color;
          ctx.beginPath();
          ctx.arc(newX, newY, particle.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          return {
            ...particle,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            life: Math.max(0, particle.life - 0.001) // Gradual fade
          };
        }).filter(particle => particle.life > 0);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particles.length, intensity]);

  // Get background gradient based on environment
  const getBackgroundGradient = () => {
    if (!currentEnvironment) {
      return 'radial-gradient(circle at 50% 50%, #001122 0%, #000011 100%)';
    }

    const { color, animation } = currentEnvironment.dynamicBackground;
    const opacity = intensity / 100;

    switch (animation) {
      case 'pulse':
        return `radial-gradient(circle at 50% 50%, ${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`;
      case 'flow':
        return `linear-gradient(45deg, ${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')} 0%, transparent 50%, ${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')} 100%)`;
      case 'wave':
        return `conic-gradient(from 0deg at 50% 50%, ${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')} 0deg, transparent 120deg, ${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')} 240deg)`;
      default:
        return `radial-gradient(circle at 50% 50%, ${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`;
    }
  };

  // Get animation class based on environment
  const getAnimationClass = () => {
    if (!currentEnvironment) return '';

    switch (currentEnvironment.dynamicBackground.animation) {
      case 'pulse':
        return 'animate-pulse';
      case 'flow':
        return 'animate-gradient-flow';
      case 'wave':
        return 'animate-wave';
      default:
        return 'animate-pulse';
    }
  };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Animated Background Gradient */}
      <motion.div
        className={`absolute inset-0 ${getAnimationClass()}`}
        style={{
          background: getBackgroundGradient()
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: intensity / 100 }}
      />

      {/* Dynamic Overlay Effects */}
      <AnimatePresence>
        {currentEnvironment?.visualEffects && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {currentEnvironment.visualEffects.type === 'glow' && (
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${currentEnvironment.visualEffects.color}40 0%, transparent 50%)`,
                  animation: 'pulse 2s ease-in-out infinite'
                }}
              />
            )}
            
            {currentEnvironment.visualEffects.type === 'sparkle' && (
              <div className="absolute inset-0">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      background: currentEnvironment.visualEffects.color,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: Math.random() * 2
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration Effects Listener */}
      <CelebrationEffects />
    </div>
  );
}

/**
 * Celebration Effects Component - Handles special celebration animations
 */
function CelebrationEffects() {
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    const handleCelebration = (event: CustomEvent) => {
      setCelebrating(true);
      setTimeout(() => setCelebrating(false), 3000);
    };

    window.addEventListener('immersive-celebration', handleCelebration as EventListener);
    return () => window.removeEventListener('immersive-celebration', handleCelebration as EventListener);
  }, []);

  return (
    <AnimatePresence>
      {celebrating && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Fireworks-like effects */}
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-pink-500"
              style={{
                left: '50%',
                top: '50%'
              }}
              animate={{
                x: (Math.random() - 0.5) * 800,
                y: (Math.random() - 0.5) * 600,
                scale: [1, 0],
                opacity: [1, 0]
              }}
              transition={{
                duration: 2,
                ease: "easeOut",
                delay: Math.random() * 0.5
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}