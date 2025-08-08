/**
 * Loading Spinner Component
 * Optimized loading state with electric theme
 */

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-ultra-dark">
      <div className="relative">
        {/* Electric Butterfly Loading */}
        <div className="w-16 h-16 border-4 border-electric-blue/30 rounded-full animate-spin">
          <div className="absolute inset-2 border-4 border-electric-green border-t-transparent rounded-full animate-spin duration-1000"></div>
        </div>
        
        {/* Pulsing glow effect */}
        <div className="absolute inset-0 w-16 h-16 border-4 border-electric-blue/20 rounded-full animate-ping"></div>
        
        {/* Loading text */}
        <div className="mt-4 text-center">
          <div className="text-electric-blue text-sm font-medium animate-pulse">
            Initializing Flutterbye...
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingSpinner;