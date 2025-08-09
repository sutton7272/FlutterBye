import React from 'react';

const GeometricButterfly = ({ color, size }: { color: string; size: number }) => (
  <svg 
    width={size} 
    height={size * 0.8} 
    viewBox="0 0 100 80" 
    className="geometric-butterfly"
    style={{
      filter: `drop-shadow(0 0 ${size/8}px ${color}) drop-shadow(0 0 ${size/5}px ${color})`,
    }}
  >
    {/* Central body line */}
    <line x1="50" y1="15" x2="50" y2="65" stroke={color} strokeWidth="1.5" opacity="1" />
    <circle cx="50" cy="40" r="1.5" fill={color} opacity="1" />
    
    {/* Upper wings - symmetric triangular shapes */}
    <path 
      d="M50 40 L20 15 L10 25 L25 35 L50 40" 
      fill="none" 
      stroke={color} 
      strokeWidth="1" 
      opacity="0.9"
    />
    <path 
      d="M50 40 L80 15 L90 25 L75 35 L50 40" 
      fill="none" 
      stroke={color} 
      strokeWidth="1" 
      opacity="0.9"
    />
    
    {/* Lower wings - rounded triangular shapes */}
    <path 
      d="M50 40 L25 55 L15 70 L30 75 L50 40" 
      fill="none" 
      stroke={color} 
      strokeWidth="1" 
      opacity="0.9"
    />
    <path 
      d="M50 40 L75 55 L85 70 L70 75 L50 40" 
      fill="none" 
      stroke={color} 
      strokeWidth="1" 
      opacity="0.9"
    />
    
    {/* Internal wing network - triangular mesh */}
    <line x1="50" y1="40" x2="20" y2="15" stroke={color} strokeWidth="0.5" opacity="0.7" />
    <line x1="50" y1="40" x2="80" y2="15" stroke={color} strokeWidth="0.5" opacity="0.7" />
    <line x1="50" y1="40" x2="25" y2="55" stroke={color} strokeWidth="0.5" opacity="0.7" />
    <line x1="50" y1="40" x2="75" y2="55" stroke={color} strokeWidth="0.5" opacity="0.7" />
    
    {/* Wing triangulation mesh */}
    <line x1="20" y1="15" x2="25" y2="35" stroke={color} strokeWidth="0.3" opacity="0.5" />
    <line x1="80" y1="15" x2="75" y2="35" stroke={color} strokeWidth="0.3" opacity="0.5" />
    <line x1="25" y1="55" x2="30" y2="75" stroke={color} strokeWidth="0.3" opacity="0.5" />
    <line x1="75" y1="55" x2="70" y2="75" stroke={color} strokeWidth="0.3" opacity="0.5" />
    
    {/* Cross connections */}
    <line x1="25" y1="35" x2="35" y2="30" stroke={color} strokeWidth="0.3" opacity="0.4" />
    <line x1="75" y1="35" x2="65" y2="30" stroke={color} strokeWidth="0.3" opacity="0.4" />
    <line x1="30" y1="75" x2="40" y2="60" stroke={color} strokeWidth="0.3" opacity="0.4" />
    <line x1="70" y1="75" x2="60" y2="60" stroke={color} strokeWidth="0.3" opacity="0.4" />
    
    {/* Node points at key intersections */}
    <circle cx="20" cy="15" r="1" fill={color} opacity="0.9" />
    <circle cx="80" cy="15" r="1" fill={color} opacity="0.9" />
    <circle cx="25" cy="55" r="1" fill={color} opacity="0.9" />
    <circle cx="75" cy="55" r="1" fill={color} opacity="0.9" />
    
    {/* Wing tip nodes */}
    <circle cx="10" cy="25" r="0.8" fill={color} opacity="0.7" />
    <circle cx="90" cy="25" r="0.8" fill={color} opacity="0.7" />
    <circle cx="15" cy="70" r="0.8" fill={color} opacity="0.7" />
    <circle cx="85" cy="70" r="0.8" fill={color} opacity="0.7" />
    
    {/* Inner connection nodes */}
    <circle cx="25" cy="35" r="0.6" fill={color} opacity="0.6" />
    <circle cx="75" cy="35" r="0.6" fill={color} opacity="0.6" />
    <circle cx="30" cy="75" r="0.6" fill={color} opacity="0.6" />
    <circle cx="70" cy="75" r="0.6" fill={color} opacity="0.6" />
  </svg>
);

export function FlyingButterflies() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Electric Blue Butterflies - Primary Theme Color */}
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-1 35s infinite linear',
        }}
      >
        <GeometricButterfly color="#00bfff" size={30} />
      </div>
      
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-2 40s infinite linear',
          animationDelay: '-8s',
        }}
      >
        <GeometricButterfly color="#00bfff" size={35} />
      </div>
      
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-5 45s infinite linear',
          animationDelay: '-5s',
        }}
      >
        <GeometricButterfly color="#4da6ff" size={32} />
      </div>
      
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-6 38s infinite linear',
          animationDelay: '-20s',
        }}
      >
        <GeometricButterfly color="#4da6ff" size={28} />
      </div>
      
      {/* Electric Green Butterflies - Secondary Theme Color */}
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-3 42s infinite linear',
          animationDelay: '-15s',
        }}
      >
        <GeometricButterfly color="#00ff80" size={34} />
      </div>
      
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-4 37s infinite linear',
          animationDelay: '-25s',
        }}
      >
        <GeometricButterfly color="#00ff80" size={29} />
      </div>
      
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-7 43s infinite linear',
          animationDelay: '-12s',
        }}
      >
        <GeometricButterfly color="#39ff14" size={31} />
      </div>
      
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-8 46s infinite linear',
          animationDelay: '-30s',
        }}
      >
        <GeometricButterfly color="#39ff14" size={36} />
      </div>
      
      {/* Circuit Teal Butterflies - Accent Color */}
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-1 50s infinite linear',
          animationDelay: '-35s',
        }}
      >
        <GeometricButterfly color="#00ffcc" size={26} />
      </div>
      
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-2 48s infinite linear',
          animationDelay: '-28s',
        }}
      >
        <GeometricButterfly color="#00ffcc" size={33} />
      </div>
    </div>
  );
}