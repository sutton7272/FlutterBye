import React from 'react';

export function FlyingButterflies() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Electric Blue Butterflies - Primary Theme Color */}
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-1 20s infinite linear',
          fontSize: '1.5rem',
          color: '#00bfff',
          textShadow: '0 0 20px #00bfff, 0 0 30px #00bfff, 0 0 40px #00bfff',
          filter: 'drop-shadow(0 0 15px #00bfff) saturate(2) brightness(1.5)',
        }}
      >
        &#x1f98b;
      </div>
      
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-2 25s infinite linear',
          fontSize: '1.8rem',
          animationDelay: '-5s',
          color: '#00bfff',
          textShadow: '0 0 20px #00bfff, 0 0 30px #00bfff',
          filter: 'drop-shadow(0 0 15px #00bfff) saturate(2) brightness(1.5)',
        }}
      >
        &#x1f98b;
      </div>
      
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-5 28s infinite linear',
          fontSize: '1.6rem',
          animationDelay: '-3s',
          color: '#4da6ff',
          textShadow: '0 0 18px #4da6ff, 0 0 28px #4da6ff',
          filter: 'drop-shadow(0 0 12px #4da6ff) saturate(2) brightness(1.3)',
        }}
      >
        &#x1f98b;
      </div>
      
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-6 24s infinite linear',
          fontSize: '1.2rem',
          animationDelay: '-12s',
          color: '#4da6ff',
          textShadow: '0 0 16px #4da6ff, 0 0 26px #4da6ff',
          filter: 'drop-shadow(0 0 10px #4da6ff) saturate(2) brightness(1.3)',
        }}
      >
        &#x1f98b;
      </div>
      
      {/* Electric Green Butterflies - Secondary Theme Color */}
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-3 18s infinite linear',
          fontSize: '1.7rem',
          animationDelay: '-10s',
          color: '#00ff80',
          textShadow: '0 0 22px #00ff80, 0 0 32px #00ff80',
          filter: 'drop-shadow(0 0 18px #00ff80) saturate(2) brightness(1.4)',
        }}
      >
        &#x1f98b;
      </div>
      
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-4 22s infinite linear',
          fontSize: '1.4rem',
          animationDelay: '-15s',
          color: '#00ff80',
          textShadow: '0 0 20px #00ff80, 0 0 30px #00ff80',
          filter: 'drop-shadow(0 0 16px #00ff80) saturate(2) brightness(1.4)',
        }}
      >
        &#x1f98b;
      </div>
      
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-7 19s infinite linear',
          fontSize: '1.3rem',
          animationDelay: '-8s',
          color: '#39ff14',
          textShadow: '0 0 20px #39ff14, 0 0 30px #39ff14',
          filter: 'drop-shadow(0 0 16px #39ff14) saturate(2) brightness(1.6)',
        }}
      >
        &#x1f98b;
      </div>
      
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-8 26s infinite linear',
          fontSize: '1.9rem',
          animationDelay: '-20s',
          color: '#39ff14',
          textShadow: '0 0 24px #39ff14, 0 0 34px #39ff14',
          filter: 'drop-shadow(0 0 18px #39ff14) saturate(2) brightness(1.6)',
        }}
      >
        &#x1f98b;
      </div>
      
      {/* Circuit Teal Butterflies - Accent Color */}
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-1 30s infinite linear',
          fontSize: '1.1rem',
          animationDelay: '-25s',
          color: '#00ffcc',
          textShadow: '0 0 18px #00ffcc, 0 0 28px #00ffcc',
          filter: 'drop-shadow(0 0 14px #00ffcc) saturate(2) brightness(1.2)',
        }}
      >
        &#x1f98b;
      </div>
      
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-2 32s infinite linear',
          fontSize: '1.6rem',
          animationDelay: '-18s',
          color: '#00ffcc',
          textShadow: '0 0 20px #00ffcc, 0 0 30px #00ffcc',
          filter: 'drop-shadow(0 0 16px #00ffcc) saturate(2) brightness(1.2)',
        }}
      >
        &#x1f98b;
      </div>
      
      {/* Additional Electric Blues for More Density */}
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-3 23s infinite linear',
          fontSize: '1.0rem',
          animationDelay: '-30s',
          color: '#00bfff',
          textShadow: '0 0 16px #00bfff, 0 0 26px #00bfff',
          filter: 'drop-shadow(0 0 12px #00bfff) saturate(2) brightness(1.5)',
        }}
      >
        &#x1f98b;
      </div>
      
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-4 27s infinite linear',
          fontSize: '1.8rem',
          animationDelay: '-7s',
          color: '#4da6ff',
          textShadow: '0 0 22px #4da6ff, 0 0 32px #4da6ff',
          filter: 'drop-shadow(0 0 18px #4da6ff) saturate(2) brightness(1.3)',
        }}
      >
        &#x1f98b;
      </div>
      
      {/* Additional Electric Greens for Balance */}
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-5 21s infinite linear',
          fontSize: '1.2rem',
          animationDelay: '-14s',
          color: '#00ff80',
          textShadow: '0 0 18px #00ff80, 0 0 28px #00ff80',
          filter: 'drop-shadow(0 0 14px #00ff80) saturate(2) brightness(1.4)',
        }}
      >
        &#x1f98b;
      </div>
      
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-6 29s infinite linear',
          fontSize: '1.5rem',
          animationDelay: '-22s',
          color: '#39ff14',
          textShadow: '0 0 20px #39ff14, 0 0 30px #39ff14',
          filter: 'drop-shadow(0 0 16px #39ff14) saturate(2) brightness(1.6)',
        }}
      >
        &#x1f98b;
      </div>
      
      {/* More Circuit Teal for Depth */}
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-7 24s infinite linear',
          fontSize: '1.3rem',
          animationDelay: '-16s',
          color: '#00ffcc',
          textShadow: '0 0 18px #00ffcc, 0 0 28px #00ffcc',
          filter: 'drop-shadow(0 0 14px #00ffcc) saturate(2) brightness(1.2)',
        }}
      >
        &#x1f98b;
      </div>
      
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-8 33s infinite linear',
          fontSize: '1.7rem',
          animationDelay: '-11s',
          color: '#00ffcc',
          textShadow: '0 0 22px #00ffcc, 0 0 32px #00ffcc',
          filter: 'drop-shadow(0 0 18px #00ffcc) saturate(2) brightness(1.2)',
        }}
      >
        &#x1f98b;
      </div>
      
      {/* Extra Electric Blues with New Animations */}
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-9 35s infinite linear',
          fontSize: '1.4rem',
          animationDelay: '-28s',
          color: '#00bfff',
          textShadow: '0 0 20px #00bfff, 0 0 30px #00bfff',
          filter: 'drop-shadow(0 0 15px #00bfff) saturate(2) brightness(1.5)',
        }}
      >
        &#x1f98b;
      </div>
      
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-10 26s infinite linear',
          fontSize: '1.1rem',
          animationDelay: '-19s',
          color: '#4da6ff',
          textShadow: '0 0 16px #4da6ff, 0 0 26px #4da6ff',
          filter: 'drop-shadow(0 0 12px #4da6ff) saturate(2) brightness(1.3)',
        }}
      >
        &#x1f98b;
      </div>
      
      {/* Extra Electric Greens with New Animations */}
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-11 31s infinite linear',
          fontSize: '1.6rem',
          animationDelay: '-24s',
          color: '#00ff80',
          textShadow: '0 0 22px #00ff80, 0 0 32px #00ff80',
          filter: 'drop-shadow(0 0 18px #00ff80) saturate(2) brightness(1.4)',
        }}
      >
        &#x1f98b;
      </div>
      
      <div 
        className="absolute"
        style={{
          animation: 'butterfly-flight-12 28s infinite linear',
          fontSize: '1.2rem',
          animationDelay: '-17s',
          color: '#39ff14',
          textShadow: '0 0 18px #39ff14, 0 0 28px #39ff14',
          filter: 'drop-shadow(0 0 14px #39ff14) saturate(2) brightness(1.6)',
        }}
      >
        &#x1f98b;
      </div>
    </div>
  );
}