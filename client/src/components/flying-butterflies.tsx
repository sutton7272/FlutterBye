import React from 'react';

const GeometricButterfly = ({ color, size }: { color: string; size: number }) => (
  <svg 
    width={size} 
    height={size * 0.75} 
    viewBox="0 0 120 90" 
    className="geometric-butterfly"
    style={{
      filter: `drop-shadow(0 0 ${size/10}px ${color}) drop-shadow(0 0 ${size/6}px ${color})`,
    }}
  >
    {/* Butterfly body */}
    <line x1="60" y1="20" x2="60" y2="70" stroke={color} strokeWidth="2" opacity="0.9" />
    <circle cx="60" cy="45" r="1.5" fill={color} opacity="1" />
    
    {/* Upper left wing - wireframe outline */}
    <path 
      d="M60 45 L40 25 L25 30 L15 20 L20 10 L35 15 L45 20 L60 45" 
      fill="none" 
      stroke={color} 
      strokeWidth="1.2" 
      opacity="0.9"
    />
    
    {/* Upper right wing - wireframe outline */}
    <path 
      d="M60 45 L80 25 L95 30 L105 20 L100 10 L85 15 L75 20 L60 45" 
      fill="none" 
      stroke={color} 
      strokeWidth="1.2" 
      opacity="0.9"
    />
    
    {/* Lower left wing - wireframe outline */}
    <path 
      d="M60 45 L45 60 L35 75 L20 70 L15 80 L30 85 L50 75 L60 45" 
      fill="none" 
      stroke={color} 
      strokeWidth="1.2" 
      opacity="0.9"
    />
    
    {/* Lower right wing - wireframe outline */}
    <path 
      d="M60 45 L75 60 L85 75 L100 70 L105 80 L90 85 L70 75 L60 45" 
      fill="none" 
      stroke={color} 
      strokeWidth="1.2" 
      opacity="0.9"
    />
    
    {/* Internal wing structure - geometric mesh */}
    <line x1="60" y1="45" x2="30" y2="25" stroke={color} strokeWidth="0.6" opacity="0.6" />
    <line x1="60" y1="45" x2="90" y2="25" stroke={color} strokeWidth="0.6" opacity="0.6" />
    <line x1="60" y1="45" x2="40" y2="65" stroke={color} strokeWidth="0.6" opacity="0.6" />
    <line x1="60" y1="45" x2="80" y2="65" stroke={color} strokeWidth="0.6" opacity="0.6" />
    
    {/* Additional geometric mesh lines */}
    <line x1="30" y1="25" x2="45" y2="35" stroke={color} strokeWidth="0.4" opacity="0.5" />
    <line x1="90" y1="25" x2="75" y2="35" stroke={color} strokeWidth="0.4" opacity="0.5" />
    <line x1="40" y1="65" x2="50" y2="55" stroke={color} strokeWidth="0.4" opacity="0.5" />
    <line x1="80" y1="65" x2="70" y2="55" stroke={color} strokeWidth="0.4" opacity="0.5" />
    
    {/* Connection nodes/dots */}
    <circle cx="30" cy="25" r="1.2" fill={color} opacity="0.8" />
    <circle cx="90" cy="25" r="1.2" fill={color} opacity="0.8" />
    <circle cx="40" cy="65" r="1.2" fill={color} opacity="0.8" />
    <circle cx="80" cy="65" r="1.2" fill={color} opacity="0.8" />
    <circle cx="25" cy="30" r="0.8" fill={color} opacity="0.6" />
    <circle cx="95" cy="30" r="0.8" fill={color} opacity="0.6" />
    <circle cx="35" cy="75" r="0.8" fill={color} opacity="0.6" />
    <circle cx="85" cy="75" r="0.8" fill={color} opacity="0.6" />
    
    {/* Wing tip nodes */}
    <circle cx="20" cy="10" r="1" fill={color} opacity="0.7" />
    <circle cx="100" cy="10" r="1" fill={color} opacity="0.7" />
    <circle cx="15" cy="80" r="1" fill={color} opacity="0.7" />
    <circle cx="105" cy="80" r="1" fill={color} opacity="0.7" />
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