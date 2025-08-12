import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  gravity: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  life: number;
  maxLife: number;
}

interface ConfettiCelebrationProps {
  isActive: boolean;
  onComplete?: () => void;
  duration?: number;
  particleCount?: number;
  colors?: string[];
}

export function ConfettiCelebration({ 
  isActive, 
  onComplete, 
  duration = 3000,
  particleCount = 150,
  colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ]
}: ConfettiCelebrationProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Create particles
  const createParticles = (): Particle[] => {
    const newParticles: Particle[] = [];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
      const velocity = 3 + Math.random() * 8;
      const life = 2000 + Math.random() * 1000;

      newParticles.push({
        id: i,
        x: centerX + (Math.random() - 0.5) * 100,
        y: centerY + (Math.random() - 0.5) * 50,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - Math.random() * 3,
        gravity: 0.15 + Math.random() * 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 8,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
        life,
        maxLife: life
      });
    }

    return newParticles;
  };

  // Animation loop
  const animate = () => {
    setParticles(prevParticles => {
      const updatedParticles = prevParticles
        .map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + particle.gravity,
          rotation: particle.rotation + particle.rotationSpeed,
          life: particle.life - 16,
          opacity: Math.max(0, particle.life / particle.maxLife)
        }))
        .filter(particle => particle.life > 0 && particle.y < window.innerHeight + 50);

      if (updatedParticles.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        onComplete?.();
      }

      return updatedParticles;
    });
  };

  useEffect(() => {
    if (isActive) {
      setParticles(createParticles());
      animationRef.current = requestAnimationFrame(animate);

      // Auto-complete after duration
      const timeout = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, duration);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        clearTimeout(timeout);
      };
    } else {
      setParticles([]);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  }, [isActive]);

  if (!isActive || particles.length === 0) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      style={{ background: 'transparent' }}
    >
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            transform: `rotate(${particle.rotation}deg)`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            willChange: 'transform, opacity'
          }}
        />
      ))}
    </div>
  );
}

// Success celebration overlay component
export function TransactionSuccessOverlay({ 
  isVisible, 
  onClose,
  transactionType = 'Token',
  amount,
  message 
}: {
  isVisible: boolean;
  onClose: () => void;
  transactionType?: string;
  amount?: string;
  message?: string;
}) {
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Success Message */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="bg-gray-900 border border-green-500 rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center"
              >
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </motion.svg>
              </motion.div>

              {/* Success Text */}
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-white mb-2"
              >
                {transactionType} Success!
              </motion.h2>

              {message && (
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-300 mb-4"
                >
                  "{message}"
                </motion.p>
              )}

              {amount && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gray-800 rounded-lg p-4 mb-6"
                >
                  <p className="text-cyan-400 font-semibold text-lg">{amount}</p>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center">
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  onClick={onClose}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Continue
                </motion.button>
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  onClick={() => {
                    // Trigger share modal
                    onClose();
                    setTimeout(() => {
                      const shareEvent = new CustomEvent('openShareModal');
                      window.dispatchEvent(shareEvent);
                    }, 100);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Share
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Confetti */}
          <ConfettiCelebration isActive={true} />
        </>
      )}
    </AnimatePresence>
  );
}

// Hook for easy confetti triggering
export function useConfetti() {
  const [isActive, setIsActive] = useState(false);

  const trigger = () => {
    setIsActive(true);
  };

  const stop = () => {
    setIsActive(false);
  };

  return {
    isActive,
    trigger,
    stop,
    ConfettiComponent: () => (
      <ConfettiCelebration 
        isActive={isActive} 
        onComplete={() => setIsActive(false)} 
      />
    )
  };
}