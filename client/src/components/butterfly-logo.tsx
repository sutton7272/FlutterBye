interface ButterflyLogoProps {
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

export default function ButterflyLogo({ size = "md", animate = false }: ButterflyLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10", 
    lg: "w-16 h-16"
  };

  return (
    <div className={`${sizeClasses[size]} ${animate ? "flutter-animate" : ""}`}>
      <svg viewBox="0 0 40 40" className="w-full h-full">
        {/* Left wing */}
        <path 
          d="M20 20 L10 10 L5 15 L10 25 L15 30 Z" 
          fill="url(#gradient1)" 
          opacity="0.9"
        />
        {/* Right wing */}
        <path 
          d="M20 20 L30 10 L35 15 L30 25 L25 30 Z" 
          fill="url(#gradient2)" 
          opacity="0.9"
        />
        {/* Body */}
        <line 
          x1="20" y1="5" x2="20" y2="35" 
          stroke="white" 
          strokeWidth="2"
        />
        {/* Geometric particles */}
        <circle cx="15" cy="15" r="1.5" fill="var(--flutter-cyan)" opacity="0.6"/>
        <circle cx="25" cy="15" r="1.5" fill="var(--flutter-cyan)" opacity="0.6"/>
        <polygon points="17,18 20,15 23,18 20,21" fill="var(--flutter-blue)" opacity="0.4"/>
        
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--flutter-cyan)"/>
            <stop offset="100%" stopColor="var(--flutter-blue)"/>
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--flutter-blue)"/>
            <stop offset="100%" stopColor="hsl(220, 70%, 50%)"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
