import React from 'react';

export function FlyingButterflies() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Electric Blue Butterflies - Primary Theme Color */}
      <div 
        className="absolute butterfly"
        style={{
          animation: 'butterfly-flight-1 20s infinite linear',
          color: 'hsl(200, 100%, 50%)', // Electric Blue
          fontSize: '1.5rem',
          filter: 'drop-shadow(0 0 12px hsl(200, 100%, 50%))',
        }}
      >
        🦋
      </div>
      
      <div 
        className="absolute butterfly"
        style={{
          animation: 'butterfly-flight-2 25s infinite linear',
          color: 'hsl(200, 100%, 50%)', // Electric Blue
          fontSize: '1.8rem',
          filter: 'drop-shadow(0 0 15px hsl(200, 100%, 50%))',
          animationDelay: '-5s',
        }}
      >
        🦋
      </div>
      
      <div 
        className="absolute butterfly"
        style={{
          animation: 'butterfly-flight-5 28s infinite linear',
          color: 'hsl(210, 100%, 60%)', // Bright Blue
          fontSize: '1.6rem',
          filter: 'drop-shadow(0 0 10px hsl(210, 100%, 60%))',
          animationDelay: '-3s',
        }}
      >
        🦋
      </div>
      
      <div 
        className="absolute butterfly"
        style={{
          animation: 'butterfly-flight-6 24s infinite linear',
          color: 'hsl(210, 100%, 60%)', // Bright Blue
          fontSize: '1.2rem',
          filter: 'drop-shadow(0 0 8px hsl(210, 100%, 60%))',
          animationDelay: '-12s',
        }}
      >
        🦋
      </div>
      
      {/* Electric Green Butterflies - Secondary Theme Color */}
      <div 
        className="absolute butterfly"
        style={{
          animation: 'butterfly-flight-3 18s infinite linear',
          color: 'hsl(140, 100%, 40%)', // Electric Green
          fontSize: '1.7rem',
          filter: 'drop-shadow(0 0 14px hsl(140, 100%, 40%))',
          animationDelay: '-10s',
        }}
      >
        🦋
      </div>
      
      <div 
        className="absolute butterfly"
        style={{
          animation: 'butterfly-flight-4 22s infinite linear',
          color: 'hsl(140, 100%, 40%)', // Electric Green
          fontSize: '1.4rem',
          filter: 'drop-shadow(0 0 9px hsl(140, 100%, 40%))',
          animationDelay: '-15s',
        }}
      >
        🦋
      </div>
      
      <div 
        className="absolute butterfly"
        style={{
          animation: 'butterfly-flight-7 19s infinite linear',
          color: 'hsl(155, 100%, 35%)', // Neon Green
          fontSize: '1.3rem',
          filter: 'drop-shadow(0 0 11px hsl(155, 100%, 35%))',
          animationDelay: '-8s',
        }}
      >
        🦋
      </div>
      
      <div 
        className="absolute butterfly"
        style={{
          animation: 'butterfly-flight-8 26s infinite linear',
          color: 'hsl(155, 100%, 35%)', // Neon Green
          fontSize: '1.9rem',
          filter: 'drop-shadow(0 0 16px hsl(155, 100%, 35%))',
          animationDelay: '-20s',
        }}
      >
        🦋
      </div>
      
      {/* Circuit Teal Butterflies - Accent Color */}
      <div 
        className="absolute butterfly"
        style={{
          animation: 'butterfly-flight-1 30s infinite linear',
          color: 'hsl(180, 100%, 45%)', // Circuit Teal
          fontSize: '1.1rem',
          filter: 'drop-shadow(0 0 7px hsl(180, 100%, 45%))',
          animationDelay: '-25s',
        }}
      >
        🦋
      </div>
      
      <div 
        className="absolute butterfly"
        style={{
          animation: 'butterfly-flight-2 32s infinite linear',
          color: 'hsl(180, 100%, 45%)', // Circuit Teal
          fontSize: '1.6rem',
          filter: 'drop-shadow(0 0 13px hsl(180, 100%, 45%))',
          animationDelay: '-18s',
        }}
      >
        🦋
      </div>
      
      {/* Additional Electric Blues for More Density */}
      <div 
        className="absolute butterfly"
        style={{
          animation: 'butterfly-flight-3 23s infinite linear',
          color: 'hsl(200, 100%, 50%)', // Electric Blue
          fontSize: '1.0rem',
          filter: 'drop-shadow(0 0 6px hsl(200, 100%, 50%))',
          animationDelay: '-30s',
        }}
      >
        🦋
      </div>
      
      <div 
        className="absolute butterfly"
        style={{
          animation: 'butterfly-flight-4 27s infinite linear',
          color: 'hsl(210, 100%, 60%)', // Bright Blue
          fontSize: '1.8rem',
          filter: 'drop-shadow(0 0 17px hsl(210, 100%, 60%))',
          animationDelay: '-7s',
        }}
      >
        🦋
      </div>
      
      {/* Additional Electric Greens for Balance */}
      <div 
        className="absolute butterfly"
        style={{
          animation: 'butterfly-flight-5 21s infinite linear',
          color: 'hsl(140, 100%, 40%)', // Electric Green
          fontSize: '1.2rem',
          filter: 'drop-shadow(0 0 8px hsl(140, 100%, 40%))',
          animationDelay: '-14s',
        }}
      >
        🦋
      </div>
      
      <div 
        className="absolute butterfly"
        style={{
          animation: 'butterfly-flight-6 29s infinite linear',
          color: 'hsl(155, 100%, 35%)', // Neon Green
          fontSize: '1.5rem',
          filter: 'drop-shadow(0 0 12px hsl(155, 100%, 35%))',
          animationDelay: '-22s',
        }}
      >
        🦋
      </div>
      
      {/* More Circuit Teal for Depth */}
      <div 
        className="absolute butterfly"
        style={{
          animation: 'butterfly-flight-7 24s infinite linear',
          color: 'hsl(180, 100%, 45%)', // Circuit Teal
          fontSize: '1.3rem',
          filter: 'drop-shadow(0 0 9px hsl(180, 100%, 45%))',
          animationDelay: '-16s',
        }}
      >
        🦋
      </div>
      
      <div 
        className="absolute butterfly"
        style={{
          animation: 'butterfly-flight-8 33s infinite linear',
          color: 'hsl(180, 100%, 45%)', // Circuit Teal
          fontSize: '1.7rem',
          filter: 'drop-shadow(0 0 14px hsl(180, 100%, 45%))',
          animationDelay: '-11s',
        }}
      >
        🦋
      </div>
      
      {/* Extra Electric Blues with New Animations */}
      <div 
        className="absolute butterfly"
        style={{
          animation: 'butterfly-flight-9 35s infinite linear',
          color: 'hsl(200, 100%, 50%)', // Electric Blue
          fontSize: '1.4rem',
          filter: 'drop-shadow(0 0 10px hsl(200, 100%, 50%))',
          animationDelay: '-28s',
        }}
      >
        🦋
      </div>
      
      <div 
        className="absolute butterfly"
        style={{
          animation: 'butterfly-flight-10 26s infinite linear',
          color: 'hsl(210, 100%, 60%)', // Bright Blue
          fontSize: '1.1rem',
          filter: 'drop-shadow(0 0 7px hsl(210, 100%, 60%))',
          animationDelay: '-19s',
        }}
      >
        🦋
      </div>
      
      {/* Extra Electric Greens with New Animations */}
      <div 
        className="absolute butterfly"
        style={{
          animation: 'butterfly-flight-11 31s infinite linear',
          color: 'hsl(140, 100%, 40%)', // Electric Green
          fontSize: '1.6rem',
          filter: 'drop-shadow(0 0 13px hsl(140, 100%, 40%))',
          animationDelay: '-24s',
        }}
      >
        🦋
      </div>
      
      <div 
        className="absolute butterfly"
        style={{
          animation: 'butterfly-flight-12 28s infinite linear',
          color: 'hsl(155, 100%, 35%)', // Neon Green
          fontSize: '1.2rem',
          filter: 'drop-shadow(0 0 8px hsl(155, 100%, 35%))',
          animationDelay: '-17s',
        }}
      >
        🦋
      </div>
    </div>
  );
}