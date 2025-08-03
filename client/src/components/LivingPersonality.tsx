import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Zap, Heart } from 'lucide-react';
import { useLivingAI } from '@/hooks/useLivingAI';

interface LivingPersonalityProps {
  pageContext: string;
  className?: string;
}

/**
 * Living Personality Component - Makes the platform feel alive and aware
 * Displays contextual AI responses with beautiful animations
 */
export function LivingPersonality({ pageContext, className = '' }: LivingPersonalityProps) {
  const {
    personalityState,
    platformMood,
    awareness,
    dismissPersonality,
    ambientColor,
    currentMood
  } = useLivingAI(pageContext);

  const [currentAmbientIndex, setCurrentAmbientIndex] = useState(0);

  // Cycle through ambient messages
  useEffect(() => {
    if (!awareness?.ambientMessages?.length) return;
    
    const interval = setInterval(() => {
      setCurrentAmbientIndex(prev => 
        (prev + 1) % awareness.ambientMessages.length
      );
    }, 8000); // Change every 8 seconds

    return () => clearInterval(interval);
  }, [awareness?.ambientMessages]);

  // Get emotion icon
  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'electric':
      case 'energetic': return <Zap className="w-5 h-5" />;
      case 'creative':
      case 'inspired': return <Sparkles className="w-5 h-5" />;
      case 'warm':
      case 'loving': return <Heart className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  // Get energy-based animation
  const getEnergyAnimation = (energy: number) => {
    if (energy > 80) return { scale: [1, 1.05, 1], transition: { duration: 0.5, repeat: Infinity } };
    if (energy > 60) return { y: [0, -2, 0], transition: { duration: 1, repeat: Infinity } };
    return { opacity: [0.8, 1, 0.8], transition: { duration: 2, repeat: Infinity } };
  };

  return (
    <div className={`fixed inset-0 pointer-events-none z-50 ${className}`}>
      {/* Ambient Background Mood */}
      {platformMood && (
        <motion.div
          className="absolute inset-0 opacity-5"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${ambientColor} 0%, transparent 70%)`
          }}
          animate={{
            opacity: [0.02, 0.08, 0.02],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Ambient Messages - Subtle floating text */}
      {awareness?.ambientMessages && awareness.ambientMessages.length > 0 && (
        <motion.div
          className="absolute top-24 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 0.6, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={currentAmbientIndex}
              className="text-sm text-gray-400 text-center font-light tracking-wide"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 0.6, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 1 }}
            >
              {awareness.ambientMessages[currentAmbientIndex]}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      )}

      {/* Main Personality Response */}
      <AnimatePresence>
        {personalityState.isVisible && (
          <motion.div
            className="absolute bottom-24 right-6 max-w-sm pointer-events-auto"
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <motion.div
              className="glassmorphism electric-frame p-4 rounded-xl shadow-2xl"
              style={{
                background: `linear-gradient(135deg, 
                  hsla(220, 12%, 8%, 0.95) 0%, 
                  hsla(${currentMood === 'electric' ? '210, 100%, 45%' : '140, 100%, 40%'}, 0.1) 100%)`
              }}
              animate={getEnergyAnimation(personalityState.energy)}
            >
              {/* Header with emotion and dismiss */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <motion.div
                    className="text-primary"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {getEmotionIcon(personalityState.emotion)}
                  </motion.div>
                  <span className="text-xs text-gray-300 capitalize">
                    {personalityState.emotion}
                  </span>
                  <div className="h-1 w-8 rounded-full bg-gradient-to-r from-primary to-secondary opacity-60" />
                </div>
                
                <button
                  onClick={dismissPersonality}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Main message */}
              <motion.p
                className="text-white text-sm mb-3 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {personalityState.message}
              </motion.p>

              {/* Energy indicator */}
              <div className="mb-3">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                  <span>Energy</span>
                  <span>{personalityState.energy}%</span>
                </div>
                <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-secondary"
                    initial={{ width: 0 }}
                    animate={{ width: `${personalityState.energy}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Suggestions */}
              {personalityState.suggestions.length > 0 && (
                <motion.div
                  className="space-y-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {personalityState.suggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      className="text-xs text-gray-300 flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Sparkles className="w-3 h-3 text-secondary" />
                      {suggestion}
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Contextual hints */}
              {personalityState.contextualHints.length > 0 && (
                <motion.div
                  className="mt-3 pt-3 border-t border-white/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {personalityState.contextualHints.map((hint, index) => (
                    <p key={index} className="text-xs text-gray-400 italic">
                      {hint}
                    </p>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic hints overlay */}
      {awareness?.dynamicHints && awareness.dynamicHints.length > 0 && (
        <motion.div
          className="absolute top-1/2 left-6 transform -translate-y-1/2"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 0.7, x: 0 }}
          transition={{ delay: 2 }}
        >
          {awareness.dynamicHints.map((hint, index) => (
            <motion.div
              key={index}
              className="mb-2 p-2 text-xs text-gray-300 bg-black/20 rounded-lg backdrop-blur-sm border border-white/10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.7, scale: 1 }}
              transition={{ delay: 2 + index * 0.5 }}
              whileHover={{ opacity: 1, scale: 1.05 }}
            >
              {hint}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Mood indicators - Subtle corner indicator */}
      {awareness?.moodIndicators && (
        <motion.div
          className="absolute top-6 right-6"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ delay: 1 }}
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: awareness.moodIndicators.color }}
          />
        </motion.div>
      )}
    </div>
  );
}

/**
 * Simplified living indicator for pages that need subtle AI presence
 */
export function LivingIndicator() {
  const { mood, energy, color } = useLivingAI('minimal');

  return (
    <motion.div
      className="fixed bottom-6 left-6 w-8 h-8 rounded-full pointer-events-none z-40"
      style={{
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.6, 0.3]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
}