import { useEffect, useState } from "react";

export function CosmicBackground() {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      // Cosmic butterfly image loaded successfully
      setImageLoaded(true);
    };
    img.onerror = () => {
      console.error("Failed to load cosmic butterfly image");
    };
    img.src = "/images/cosmic-butterfly.png";
  }, []);

  return (
    <div
      className="fixed inset-0 w-full h-full"
      style={{
        backgroundImage: imageLoaded ? 'url(/images/cosmic-butterfly.png)' : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        zIndex: -10,
      }}
    >
      <div 
        className="absolute inset-0 w-full h-full" 
        style={{ 
          background: 'rgba(0, 0, 0, 0.4)',
          zIndex: -9,
        }} 
      />
    </div>
  );
}