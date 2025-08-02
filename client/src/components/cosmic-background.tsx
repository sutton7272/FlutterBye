import { useEffect, useState } from "react";

export function CosmicBackground() {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      console.log("Cosmic butterfly image loaded successfully");
      setImageLoaded(true);
    };
    img.onerror = () => {
      console.error("Failed to load cosmic butterfly image");
    };
    img.src = "/images/cosmic-butterfly.png";
  }, []);

  return (
    <div
      className="fixed inset-0 w-full h-full z-[-2]"
      style={{
        backgroundImage: imageLoaded ? 'url(/images/cosmic-butterfly.png)' : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div 
        className="absolute inset-0 w-full h-full z-[-1]" 
        style={{ 
          background: 'rgba(0, 0, 0, 0.4)' 
        }} 
      />
    </div>
  );
}