import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, CreditCard, Gift } from "lucide-react";
import { Link } from "wouter";

export default function PaymentSuccess() {
  const [confetti, setConfetti] = useState(true);

  useEffect(() => {
    // Hide confetti after 3 seconds
    const timer = setTimeout(() => setConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      {confetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {/* Simple CSS confetti animation */}
          <div className="confetti-container">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="confetti-piece"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  backgroundColor: [
                    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'
                  ][Math.floor(Math.random() * 5)]
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="max-w-2xl w-full">
        <Card className="bg-slate-900/50 border-green-500/30 shadow-2xl">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto mb-6 w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-white mb-4">
              Payment Successful!
            </CardTitle>
            <p className="text-xl text-slate-300">
              Thank you for your purchase. Your payment has been processed successfully.
            </p>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* What happens next */}
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Gift className="w-5 h-5 text-blue-400" />
                What happens next?
              </h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Your FLBY tokens will be added to your account within 5-10 minutes</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>You'll receive an email confirmation with transaction details</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>All premium features are now unlocked and ready to use</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Start creating AI-powered messages and tokens immediately</span>
                </li>
              </ul>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/home" className="flex-1">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3">
                  <Home className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </Button>
              </Link>
              
              <Link href="/mint" className="flex-1">
                <Button 
                  variant="outline" 
                  className="w-full border-blue-500/50 text-blue-400 hover:bg-blue-500/10 py-3"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Create Your First Token
                </Button>
              </Link>
            </div>

            {/* Support note */}
            <div className="text-center text-sm text-slate-400 bg-slate-800/30 rounded-lg p-4">
              <p>
                Need help? Contact our support team at{" "}
                <a 
                  href="mailto:support@flutterbye.com" 
                  className="text-blue-400 hover:text-blue-300"
                >
                  support@flutterbye.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        .confetti-container {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 10px;
          opacity: 0.9;
          animation: confetti-fall 3s linear forwards;
        }
        
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}