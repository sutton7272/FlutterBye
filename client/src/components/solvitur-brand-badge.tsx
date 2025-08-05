import solviturLogo from "@assets/65d9f126-64e6-4e25-9a10-d3d64807b991_1754352528946.png";

interface SolviturBrandBadgeProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function SolviturBrandBadge({ size = "md", showText = true, className = "" }: SolviturBrandBadgeProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <img 
          src={solviturLogo} 
          alt="Solvitur Inc." 
          className={`${sizeClasses[size]} rounded-full opacity-90 hover:opacity-100 transition-all duration-300`}
        />
        <div className="absolute inset-0 rounded-full bg-electric-blue/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      {showText && (
        <span className={`text-electric-blue font-medium ${textSizeClasses[size]} tracking-wide`}>
          Solvitur Inc.
        </span>
      )}
    </div>
  );
}

export function SolviturPoweredBy({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 text-text-secondary ${className}`}>
      <span className="text-sm">Powered by</span>
      <SolviturBrandBadge size="sm" showText={true} />
    </div>
  );
}