export function TestImage() {
  return (
    <div className="fixed top-4 right-4 z-50 p-4 bg-black/80 rounded-lg">
      <p className="text-white text-sm mb-2">Image Test:</p>
      <img 
        src="/images/cosmic-butterfly.png" 
        alt="Cosmic Butterfly Test" 
        className="w-32 h-24 object-cover rounded"
        onLoad={() => console.log("Test image loaded successfully!")}
        onError={() => console.error("Test image failed to load!")}
      />
    </div>
  );
}