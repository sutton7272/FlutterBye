import skyeAvatarImage from "@assets/image_1754786644103.png";

interface SkyeCustomAvatarProps {
  className?: string;
  size?: number;
  showName?: boolean;
}

export function SkyeCustomAvatar({ className = "", size = 40, showName = false }: SkyeCustomAvatarProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <div 
        className="rounded-full overflow-hidden"
        style={{ width: size, height: size }}
      >
        <img 
          src={skyeAvatarImage} 
          alt="Skye Avatar" 
          className="w-full h-full object-cover"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(236, 72, 153, 0.8)) brightness(1.2)',
            background: 'rgba(0, 0, 0, 0.9)',
          }}
        />
      </div>
      {showName && (
        <span 
          className="ml-2 font-bold text-pink-400 animate-pulse"
          style={{
            fontSize: size * 0.3,
            textShadow: '0 0 10px rgba(236, 72, 153, 0.8), 0 0 20px rgba(236, 72, 153, 0.6), 0 0 30px rgba(236, 72, 153, 0.4)',
            fontFamily: 'fantasy, cursive',
          }}
        >
          Skye
        </span>
      )}
    </div>
  );
}