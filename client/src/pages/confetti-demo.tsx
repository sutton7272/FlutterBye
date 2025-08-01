import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TransactionSuccessOverlay, ConfettiCelebration } from "@/components/confetti-celebration";
import { Sparkles, Rocket, Trophy, Gift, Star, Zap } from "lucide-react";

export default function ConfettiDemo() {
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [showConfettiOnly, setShowConfettiOnly] = useState(false);
  const [demoType, setDemoType] = useState<{
    type: string;
    message: string;
    amount: string;
  }>({
    type: 'Token Mint',
    message: 'gm blockchain fam',
    amount: '1000 tokens • 2.5 SOL value'
  });

  const demos = [
    {
      type: 'Token Mint',
      message: 'wagmi together strong',
      amount: '500 tokens • 1.2 SOL value',
      icon: <Rocket className="w-5 h-5" />,
      color: 'bg-purple-600'
    },
    {
      type: 'Value Redemption',
      message: 'diamond hands forever',
      amount: '5.75 SOL redeemed',
      icon: <Trophy className="w-5 h-5" />,
      color: 'bg-green-600'
    },
    {
      type: 'Free Code Claim',
      message: 'hodl the line frens',
      amount: '250 free tokens claimed',
      icon: <Gift className="w-5 h-5" />,
      color: 'bg-blue-600'
    },
    {
      type: 'Limited Edition',
      message: 'moon mission activated',
      amount: '1/100 rare tokens',
      icon: <Star className="w-5 h-5" />,
      color: 'bg-yellow-600'
    },
    {
      type: 'Achievement',
      message: 'level up complete',
      amount: '10,000 points earned',
      icon: <Zap className="w-5 h-5" />,
      color: 'bg-cyan-600'
    }
  ];

  const triggerDemo = (demo: typeof demos[0]) => {
    setDemoType({
      type: demo.type,
      message: demo.message,
      amount: demo.amount
    });
    setShowSuccessOverlay(true);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Confetti Celebration Demo
          </h1>
          <p className="text-gray-400 text-lg">
            Experience the delightful transaction success animations
          </p>
        </div>

        {/* Demo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {demos.map((demo, index) => (
            <Card key={index} className="bg-gray-900 border-gray-800 hover:border-purple-500 transition-colors">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <div className={`p-2 rounded-full ${demo.color}`}>
                    {demo.icon}
                  </div>
                  <span>{demo.type}</span>
                </CardTitle>
                <CardDescription>
                  Simulate a successful {demo.type.toLowerCase()} transaction
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Message:</p>
                  <p className="text-white font-semibold">"{demo.message}"</p>
                  
                  <p className="text-sm text-gray-400 mb-1 mt-3">Amount:</p>
                  <p className="text-cyan-400 font-semibold">{demo.amount}</p>
                </div>
                
                <Button 
                  onClick={() => triggerDemo(demo)}
                  className={`w-full ${demo.color} hover:opacity-90`}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Trigger {demo.type} Success
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Special Controls */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>Confetti Controls</span>
            </CardTitle>
            <CardDescription>
              Test different celebration modes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={() => setShowConfettiOnly(true)}
                variant="outline"
                className="border-purple-400 text-purple-400 hover:bg-purple-400/10"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Confetti Only
              </Button>
              
              <Button 
                onClick={() => {
                  setDemoType({
                    type: 'Epic Win',
                    message: 'you are early to the future',
                    amount: '🚀 WAGMI 🚀'
                  });
                  setShowSuccessOverlay(true);
                }}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Epic Success
              </Button>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Feature Details:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Animated particle confetti with physics</li>
                <li>• Customizable colors and particle count</li>
                <li>• Success overlay with transaction details</li>
                <li>• Automatic cleanup and performance optimization</li>
                <li>• Mobile-responsive and accessibility-friendly</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Integration Notes */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Implementation Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-purple-400 font-semibold mb-2">Already Integrated In:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                <div>✓ Token Minting (mint.tsx)</div>
                <div>✓ Value Redemption (redeem.tsx)</div>
                <div>✓ Free Code Claims</div>
                <div>✓ Achievement Unlocks</div>
              </div>
            </div>
            
            <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
              <h4 className="text-blue-400 font-semibold mb-2">Ready for Production:</h4>
              <p className="text-sm text-gray-300">
                The confetti celebration system is fully integrated and ready for production use. 
                It enhances user experience by providing delightful visual feedback for successful transactions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Overlay */}
      <TransactionSuccessOverlay
        isVisible={showSuccessOverlay}
        onClose={() => {
          setShowSuccessOverlay(false);
        }}
        transactionType={demoType.type}
        amount={demoType.amount}
        message={demoType.message}
      />

      {/* Confetti Only */}
      <ConfettiCelebration
        isActive={showConfettiOnly}
        onComplete={() => setShowConfettiOnly(false)}
      />
    </div>
  );
}