import React from 'react';

export function FlyingButterflies() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Butterfly 1 */}
      <div 
        className="absolute butterfly"
        style={{
          animation: 'butterfly-flight-1 20s infinite linear',
          color: 'hsl(200, 100%, 50%)',
          fontSize: '1.5rem',
          filter: 'drop-shadow(0 0 8px hsl(200, 100%, 50%))',
        }}
      >
        🦋
      </div>
      
      {/* Butterfly 2 */}
      <div 
        className="absolute butterfly"
        style={{
          animation: 'butterfly-flight-2 25s infinite linear',
          color: 'hsl(140, 100%, 40%)',
          fontSize: '1.2rem',
          filter: 'drop-shadow(0 0 6px hsl(140, 100%, 40%))',
          animationDelay: '-5s',
        }}
      >
        🦋
      </div>
      
      {/* Butterfly 3 */}
      <div 
        className="absolute butterfly"
        style={{
          animation: 'butterfly-flight-3 18s infinite linear',
          color: 'hsl(180, 100%, 45%)',
          fontSize: '1.8rem',
          filter: 'drop-shadow(0 0 10px hsl(180, 100%, 45%))',
          animationDelay: '-10s',
        }}
      >
        🦋
      </div>
      
      {/* Butterfly 4 */}
      <div 
        className="absolute butterfly"
        style={{
          animation: 'butterfly-flight-4 22s infinite linear',
          color: 'hsl(155, 100%, 35%)',
          fontSize: '1.3rem',
          filter: 'drop-shadow(0 0 7px hsl(155, 100%, 35%))',
          animationDelay: '-15s',
        }}
      >
        🦋
      </div>
      
      {/* Butterfly 5 */}
      <div 
        className="absolute butterfly"
        style={{
          animation: 'butterfly-flight-5 28s infinite linear',
          color: 'hsl(210, 100%, 60%)',
          fontSize: '1.6rem',
          filter: 'drop-shadow(0 0 9px hsl(210, 100%, 60%))',
          animationDelay: '-3s',
        }}
      >
        🦋
      </div>
      
      {/* Butterfly 6 */}
      <div 
        className="absolute butterfly"
        style={{
          animation: 'butterfly-flight-6 24s infinite linear',
          color: 'hsl(200, 80%, 70%)',
          fontSize: '1.1rem',
          filter: 'drop-shadow(0 0 5px hsl(200, 80%, 70%))',
          animationDelay: '-12s',
        }}
      >
        🦋
      </div>
      
      {/* Butterfly 7 */}
      <div 
        className="absolute butterfly"
        style={{
          animation: 'butterfly-flight-7 19s infinite linear',
          color: 'hsl(170, 100%, 50%)',
          fontSize: '1.4rem',
          filter: 'drop-shadow(0 0 8px hsl(170, 100%, 50%))',
          animationDelay: '-8s',
        }}
      >
        🦋
      </div>
      
      {/* Butterfly 8 */}
      <div 
        className="absolute butterfly"
        style={{
          animation: 'butterfly-flight-8 26s infinite linear',
          color: 'hsl(190, 100%, 55%)',
          fontSize: '1.7rem',
          filter: 'drop-shadow(0 0 11px hsl(190, 100%, 55%))',
          animationDelay: '-20s',
        }}
      >
        🦋
      </div>
    </div>
  );
}