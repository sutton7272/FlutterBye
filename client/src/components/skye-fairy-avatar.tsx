interface SkyeFairyAvatarProps {
  className?: string;
  size?: number;
}

export function SkyeFairyAvatar({ className = "", size = 40 }: SkyeFairyAvatarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      className={`animate-pulse ${className}`}
      style={{
        filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.4))',
      }}
    >
      {/* Magical glow background */}
      <circle
        cx="30"
        cy="30"
        r="28"
        fill="url(#skyeGlow)"
        opacity="0.3"
      />
      
      {/* Fairy wings - left */}
      <ellipse
        cx="20"
        cy="25"
        rx="8"
        ry="12"
        fill="url(#wingGradient)"
        opacity="0.8"
        transform="rotate(-20 20 25)"
      />
      
      {/* Fairy wings - right */}
      <ellipse
        cx="40"
        cy="25"
        rx="8"
        ry="12"
        fill="url(#wingGradient)"
        opacity="0.8"
        transform="rotate(20 40 25)"
      />
      
      {/* Fairy body */}
      <ellipse
        cx="30"
        cy="35"
        rx="6"
        ry="10"
        fill="url(#bodyGradient)"
      />
      
      {/* Fairy head */}
      <circle
        cx="30"
        cy="22"
        r="8"
        fill="url(#headGradient)"
      />
      
      {/* Fairy hair */}
      <path
        d="M 22 18 Q 30 12 38 18 Q 35 15 30 15 Q 25 15 22 18"
        fill="url(#hairGradient)"
      />
      
      {/* Eyes */}
      <circle cx="27" cy="20" r="1.5" fill="#00ff88" />
      <circle cx="33" cy="20" r="1.5" fill="#00ff88" />
      
      {/* Magical sparkles */}
      <circle cx="15" cy="15" r="1" fill="#00ff88" opacity="0.8">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="45" cy="20" r="1" fill="#3b82f6" opacity="0.8">
        <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="18" cy="40" r="1" fill="#00ff88" opacity="0.8">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="42" cy="45" r="1" fill="#3b82f6" opacity="0.8">
        <animate attributeName="opacity" values="1;0.4;1" dur="2.2s" repeatCount="indefinite" />
      </circle>
      
      {/* Wing shimmer animation */}
      <ellipse
        cx="20"
        cy="25"
        rx="8"
        ry="12"
        fill="none"
        stroke="url(#shimmerGradient)"
        strokeWidth="0.5"
        opacity="0.6"
        transform="rotate(-20 20 25)"
      >
        <animate attributeName="opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite" />
      </ellipse>
      <ellipse
        cx="40"
        cy="25"
        rx="8"
        ry="12"
        fill="none"
        stroke="url(#shimmerGradient)"
        strokeWidth="0.5"
        opacity="0.6"
        transform="rotate(20 40 25)"
      >
        <animate attributeName="opacity" values="0.8;0.2;0.8" dur="3s" repeatCount="indefinite" />
      </ellipse>
      
      {/* Gradient definitions */}
      <defs>
        <radialGradient id="skyeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00ff88" stopOpacity="0.3" />
          <stop offset="70%" stopColor="#3b82f6" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#1e40af" stopOpacity="0.1" />
        </radialGradient>
        
        <linearGradient id="wingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ff88" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#1e40af" stopOpacity="0.2" />
        </linearGradient>
        
        <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
        
        <radialGradient id="headGradient" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
        
        <linearGradient id="hairGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
        
        <linearGradient id="shimmerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ff88" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
    </svg>
  );
}