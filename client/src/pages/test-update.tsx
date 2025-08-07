import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, Brain } from "lucide-react";

export default function TestUpdate() {
  console.log("🎯 TEST UPDATE PAGE LOADING SUCCESSFULLY");
  
  const creationTypes = [
    {
      id: "flutterbye-coins",
      title: "Flutterbye Coins",
      description: "Revolutionary tokenized messages with redeemable value - the future of Web3 communication",
      icon: Coins,
      color: "electric-blue",
      features: ["27-character messages", "SOL value attachment", "Burn-to-redeem", "Viral distribution"],
      useCase: "flagship"
    },
    {
      id: "flutter-art",
      title: "FlutterArt", 
      description: "AI-powered artistic blockchain creations with unique digital signatures",
      icon: Brain,
      color: "purple-pink",
      features: ["AI-generated art", "Unique signatures", "Collectible NFTs", "Creative expression"],
      useCase: "creative"
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-12" style={{backgroundColor: 'purple'}}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" style={{backgroundColor: 'yellow', padding: '20px'}}>
          <h1 className="text-5xl font-bold mb-6" style={{color: 'black'}}>
            🚀 UPDATED Flutterbye Creation Hub 🚀
          </h1>
          <p className="text-xl mb-8" style={{color: 'black'}}>
            Revolutionary blockchain creation platform featuring Flutterbye Coins and FlutterArt
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {creationTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <Card 
                key={type.id}
                className={`group cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
                  type.color === 'electric-blue' 
                    ? 'border-blue-500 bg-gradient-to-br from-blue-500/5 to-blue-500/20' 
                    : 'border-purple-500 bg-gradient-to-br from-purple-500/5 to-pink-500/20'
                } relative overflow-hidden`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-4 rounded-xl ${
                      type.color === 'electric-blue' 
                        ? 'bg-blue-500/20 text-blue-500' 
                        : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      <IconComponent size={32} />
                    </div>
                    <div>
                      <CardTitle className="text-2xl mb-2">{type.title}</CardTitle>
                      <Badge variant="outline" className={
                        type.color === 'electric-blue' 
                          ? 'border-blue-500 text-blue-500' 
                          : 'border-purple-400 text-purple-400'
                      }>
                        {type.useCase === 'flagship' ? 'Flagship Product' : 'Creative Platform'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="text-base mb-6 leading-relaxed">
                    {type.description}
                  </CardDescription>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm uppercase tracking-wide">Key Features:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {type.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            type.color === 'electric-blue' ? 'bg-blue-500' : 'bg-purple-400'
                          }`} />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    className={`w-full mt-6 ${
                      type.color === 'electric-blue'
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                    }`}
                  >
                    Create {type.title}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}