import React from 'react';

const GeometricButterfly = ({ color, size }: { color: string; size: number }) => (
  <svg 
    width={size} 
    height={size * 0.8} 
    viewBox="0 0 100 80" 
    className="geometric-butterfly"
    style={{
      filter: `drop-shadow(0 0 ${size/8}px ${color}) drop-shadow(0 0 ${size/4}px ${color})`,
    }}
  >
    {/* Upper wings */}
    <path 
      d="M50 40 L30 20 L15 25 L20 10 L35 5 L45 15 L50 40 L55 15 L65 5 L80 10 L85 25 L70 20 Z" 
      fill="none" 
      stroke={color} 
      strokeWidth="1" 
      opacity="0.8"
    />
    
    {/* Lower wings */}
    <path 
      d="M50 40 L35 55 L25 70 L15 60 L20 75 L40 75 L50 40 L60 75 L80 75 L85 60 L75 70 L65 55 Z" 
      fill="none" 
      stroke={color} 
      strokeWidth="1" 
      opacity="0.8"
    />
    
    {/* Wing connection lines */}
    <line x1="50" y1="40" x2="30" y2="20" stroke={color} strokeWidth="0.5" opacity="0.6" />
    <line x1="50" y1="40" x2="70" y2="20" stroke={color} strokeWidth="0.5" opacity="0.6" />
    <line x1="50" y1="40" x2="35" y2="55" stroke={color} strokeWidth="0.5" opacity="0.6" />
    <line x1="50" y1="40" x2="65" y2="55" stroke={color} strokeWidth="0.5" opacity="0.6" />
    
    {/* Wing detail dots */}
    <circle cx="35" cy="25" r="1" fill={color} opacity="0.9" />
    <circle cx="65" cy="25" r="1" fill={color} opacity="0.9" />
    <circle cx="40" cy="60" r="1" fill={color} opacity="0.9" />
    <circle cx="60" cy="60" r="1" fill={color} opacity="0.9" />
    <circle cx="25" cy="35" r="0.8" fill={color} opacity="0.7" />
    <circle cx="75" cy="35" r="0.8" fill={color} opacity="0.7" />
    
    {/* Central body */}
    <line x1="50" y1="15" x2="50" y2="65" stroke={color} strokeWidth="1.5" opacity="0.9" />
    <circle cx="50" cy="40" r="2" fill={color} opacity="1" />
    
    {/* Wing mesh pattern */}
    <line x1="25" y1="30" x2="45" y2="25" stroke={color} strokeWidth="0.3" opacity="0.4" />
    <line x1="55" y1="25" x2="75" y2="30" stroke={color} strokeWidth="0.3" opacity="0.4" />
    <line x1="30" y1="50" x2="45" y2="45" stroke={color} strokeWidth="0.3" opacity="0.4" />
    <line x1="55" y1="45" x2="70" y2="50" stroke={color} strokeWidth="0.3" opacity="0.4" />
  </svg>
);

export function FlyingButterflies() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Electric Blue Butterflies - Primary Theme Color */}
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-1 20s infinite linear',
        }}
      >
        <GeometricButterfly color="#00bfff" size={60} />
      </div>
      
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-2 25s infinite linear',
          animationDelay: '-5s',
        }}
      >
        <GeometricButterfly color="#00bfff" size={72} />
      </div>
      
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-5 28s infinite linear',
          animationDelay: '-3s',
        }}
      >
        <GeometricButterfly color="#4da6ff" size={64} />
      </div>
      
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-6 24s infinite linear',
          animationDelay: '-12s',
        }}
      >
        <GeometricButterfly color="#4da6ff" size={48} />
      </div>
      
      {/* Electric Green Butterflies - Secondary Theme Color */}
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-3 18s infinite linear',
          animationDelay: '-10s',
        }}
      >
        <GeometricButterfly color="#00ff80" size={68} />
      </div>
      
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-4 22s infinite linear',
          animationDelay: '-15s',
        }}
      >
        <GeometricButterfly color="#00ff80" size={56} />
      </div>
      
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-7 19s infinite linear',
          animationDelay: '-8s',
        }}
      >
        <GeometricButterfly color="#39ff14" size={52} />
      </div>
      
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-8 26s infinite linear',
          animationDelay: '-20s',
        }}
      >
        <GeometricButterfly color="#39ff14" size={76} />
      </div>
      
      {/* Circuit Teal Butterflies - Accent Color */}
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-1 30s infinite linear',
          animationDelay: '-25s',
        }}
      >
        <GeometricButterfly color="#00ffcc" size={44} />
      </div>
      
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-2 32s infinite linear',
          animationDelay: '-18s',
        }}
      >
        <GeometricButterfly color="#00ffcc" size={64} />
      </div>
      
      {/* Additional Electric Blues for More Density */}
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-3 23s infinite linear',
          animationDelay: '-30s',
        }}
      >
        <GeometricButterfly color="#00bfff" size={40} />
      </div>
      
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-4 27s infinite linear',
          animationDelay: '-7s',
        }}
      >
        <GeometricButterfly color="#4da6ff" size={72} />
      </div>
      
      {/* Additional Electric Greens for Balance */}
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-5 21s infinite linear',
          animationDelay: '-14s',
        }}
      >
        <GeometricButterfly color="#00ff80" size={48} />
      </div>
      
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-6 29s infinite linear',
          animationDelay: '-22s',
        }}
      >
        <GeometricButterfly color="#39ff14" size={60} />
      </div>
      
      {/* More Circuit Teal for Depth */}
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-7 24s infinite linear',
          animationDelay: '-16s',
        }}
      >
        <GeometricButterfly color="#00ffcc" size={52} />
      </div>
      
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-8 33s infinite linear',
          animationDelay: '-11s',
        }}
      >
        <GeometricButterfly color="#00ffcc" size={68} />
      </div>
      
      {/* Extra Electric Blues with New Animations */}
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-9 35s infinite linear',
          animationDelay: '-28s',
        }}
      >
        <GeometricButterfly color="#00bfff" size={56} />
      </div>
      
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-10 26s infinite linear',
          animationDelay: '-19s',
        }}
      >
        <GeometricButterfly color="#4da6ff" size={44} />
      </div>
      
      {/* Extra Electric Greens with New Animations */}
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-11 31s infinite linear',
          animationDelay: '-24s',
        }}
      >
        <GeometricButterfly color="#00ff80" size={64} />
      </div>
      
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-12 28s infinite linear',
          animationDelay: '-17s',
        }}
      >
        <GeometricButterfly color="#39ff14" size={48} />
      </div>
    </div>
  );
}