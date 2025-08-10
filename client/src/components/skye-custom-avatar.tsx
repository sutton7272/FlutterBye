import skyeAvatarImage from "@assets/image_1754786488692.png";

interface SkyeCustomAvatarProps {
  className?: string;
  size?: number;
}

export function SkyeCustomAvatar({ className = "", size = 40 }: SkyeCustomAvatarProps) {
  return (
    <div 
      className={`rounded-full overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <img 
        src={skyeAvatarImage} 
        alt="Skye Avatar" 
        className="w-full h-full object-cover"
        style={{
          filter: 'drop-shadow(0 0 8px rgba(236, 72, 153, 0.6)) brightness(1.1)',
          background: 'rgba(0, 0, 0, 0.9)',
        }}
      />
    </div>
  );
}