import TokenHolderMap from "@/components/token-holder-map";

export default function TokenHolderMapPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gradient">Token Holder Map</h1>
        <p className="text-xl text-muted-foreground">
          Visualize token distribution across the globe with interactive mapping
        </p>
      </div>
      
      <TokenHolderMap />
    </div>
  );
}