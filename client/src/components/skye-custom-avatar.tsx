interface SkyeCustomAvatarProps {
  className?: string;
  size?: number;
  imageUrl?: string;
}

export function SkyeCustomAvatar({ className = "", size = 40, imageUrl }: SkyeCustomAvatarProps) {
  // If no custom image is provided, show a simple placeholder
  if (!imageUrl) {
    return (
      <div 
        className={`rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center text-white font-bold ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        S
      </div>
    );
  }

  return (
    <div 
      className={`rounded-full overflow-hidden border-2 border-blue-400/50 ${className}`}
      style={{ width: size, height: size }}
    >
      <img 
        src={imageUrl} 
        alt="Skye Avatar" 
        className="w-full h-full object-cover"
        style={{
          filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.4))',
        }}
      />
    </div>
  );
}