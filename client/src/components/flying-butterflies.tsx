import React from 'react';

export function FlyingButterflies() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Electric Blue Butterflies - Primary Theme Color */}
      <div 
        className="absolute butterfly butterfly-electric-blue"
        style={{
          animation: 'butterfly-flight-1 20s infinite linear',
          fontSize: '1.5rem',
        }}
      >
        🦋
      </div>
      
      <div 
        className="absolute butterfly butterfly-electric-blue"
        style={{
          animation: 'butterfly-flight-2 25s infinite linear',
          fontSize: '1.8rem',
          animationDelay: '-5s',
        }}
      >
        🦋
      </div>
      
      <div 
        className="absolute butterfly butterfly-bright-blue"
        style={{
          animation: 'butterfly-flight-5 28s infinite linear',
          fontSize: '1.6rem',
          animationDelay: '-3s',
        }}
      >
        🦋
      </div>
      
      <div 
        className="absolute butterfly butterfly-bright-blue"
        style={{
          animation: 'butterfly-flight-6 24s infinite linear',
          fontSize: '1.2rem',
          animationDelay: '-12s',
        }}
      >
        🦋
      </div>
      
      {/* Electric Green Butterflies - Secondary Theme Color */}
      <div 
        className="absolute butterfly butterfly-electric-green"
        style={{
          animation: 'butterfly-flight-3 18s infinite linear',
          fontSize: '1.7rem',
          animationDelay: '-10s',
        }}
      >
        🦋
      </div>
      
      <div 
        className="absolute butterfly butterfly-electric-green"
        style={{
          animation: 'butterfly-flight-4 22s infinite linear',
          fontSize: '1.4rem',
          animationDelay: '-15s',
        }}
      >
        🦋
      </div>
      
      <div 
        className="absolute butterfly butterfly-neon-green"
        style={{
          animation: 'butterfly-flight-7 19s infinite linear',
          fontSize: '1.3rem',
          animationDelay: '-8s',
        }}
      >
        🦋
      </div>
      
      <div 
        className="absolute butterfly butterfly-neon-green"
        style={{
          animation: 'butterfly-flight-8 26s infinite linear',
          fontSize: '1.9rem',
          animationDelay: '-20s',
        }}
      >
        🦋
      </div>
      
      {/* Circuit Teal Butterflies - Accent Color */}
      <div 
        className="absolute butterfly butterfly-circuit-teal"
        style={{
          animation: 'butterfly-flight-1 30s infinite linear',
          fontSize: '1.1rem',
          animationDelay: '-25s',
        }}
      >
        🦋
      </div>
      
      <div 
        className="absolute butterfly butterfly-circuit-teal"
        style={{
          animation: 'butterfly-flight-2 32s infinite linear',
          fontSize: '1.6rem',
          animationDelay: '-18s',
        }}
      >
        🦋
      </div>
      
      {/* Additional Electric Blues for More Density */}
      <div 
        className="absolute butterfly butterfly-electric-blue"
        style={{
          animation: 'butterfly-flight-3 23s infinite linear',
          fontSize: '1.0rem',
          animationDelay: '-30s',
        }}
      >
        🦋
      </div>
      
      <div 
        className="absolute butterfly butterfly-bright-blue"
        style={{
          animation: 'butterfly-flight-4 27s infinite linear',
          fontSize: '1.8rem',
          animationDelay: '-7s',
        }}
      >
        🦋
      </div>
      
      {/* Additional Electric Greens for Balance */}
      <div 
        className="absolute butterfly butterfly-electric-green"
        style={{
          animation: 'butterfly-flight-5 21s infinite linear',
          fontSize: '1.2rem',
          animationDelay: '-14s',
        }}
      >
        🦋
      </div>
      
      <div 
        className="absolute butterfly butterfly-neon-green"
        style={{
          animation: 'butterfly-flight-6 29s infinite linear',
          fontSize: '1.5rem',
          animationDelay: '-22s',
        }}
      >
        🦋
      </div>
      
      {/* More Circuit Teal for Depth */}
      <div 
        className="absolute butterfly butterfly-circuit-teal"
        style={{
          animation: 'butterfly-flight-7 24s infinite linear',
          fontSize: '1.3rem',
          animationDelay: '-16s',
        }}
      >
        🦋
      </div>
      
      <div 
        className="absolute butterfly butterfly-circuit-teal"
        style={{
          animation: 'butterfly-flight-8 33s infinite linear',
          fontSize: '1.7rem',
          animationDelay: '-11s',
        }}
      >
        🦋
      </div>
      
      {/* Extra Electric Blues with New Animations */}
      <div 
        className="absolute butterfly butterfly-electric-blue"
        style={{
          animation: 'butterfly-flight-9 35s infinite linear',
          fontSize: '1.4rem',
          animationDelay: '-28s',
        }}
      >
        🦋
      </div>
      
      <div 
        className="absolute butterfly butterfly-bright-blue"
        style={{
          animation: 'butterfly-flight-10 26s infinite linear',
          fontSize: '1.1rem',
          animationDelay: '-19s',
        }}
      >
        🦋
      </div>
      
      {/* Extra Electric Greens with New Animations */}
      <div 
        className="absolute butterfly butterfly-electric-green"
        style={{
          animation: 'butterfly-flight-11 31s infinite linear',
          fontSize: '1.6rem',
          animationDelay: '-24s',
        }}
      >
        🦋
      </div>
      
      <div 
        className="absolute butterfly butterfly-neon-green"
        style={{
          animation: 'butterfly-flight-12 28s infinite linear',
          fontSize: '1.2rem',
          animationDelay: '-17s',
        }}
      >
        🦋
      </div>
    </div>
  );
}