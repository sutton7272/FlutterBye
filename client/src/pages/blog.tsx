import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { useLocation } from "wouter";

export default function BlogPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button
        variant="outline"
        onClick={() => setLocation('/')}
        className="mb-6 border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>

      <Card className="electric-frame">
        <CardHeader>
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>January 7, 2025</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>5 min read</span>
            </div>
            <div className="flex items-center gap-1">
              <Tag className="w-4 h-4" />
              <span>AI Marketing, Blockchain</span>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gradient mb-4">
            The Future of Crypto Marketing
          </CardTitle>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Discover how Flutterbye is revolutionizing crypto marketing with AI-powered precision targeting, 
            enabling businesses to communicate directly with specific crypto holder segments.
          </p>
        </CardHeader>
        <CardContent className="space-y-6 text-gray-300 leading-relaxed">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-semibold text-gradient mb-4">The Revolution Begins</h2>
            <p className="mb-6">
              The cryptocurrency landscape has evolved dramatically, but one critical gap remains: how do businesses 
              effectively communicate with specific crypto holder segments? Traditional marketing approaches fall short 
              when targeting the nuanced and diverse world of blockchain users. Flutterbye changes everything.
            </p>

            <h2 className="text-2xl font-semibold text-gradient mb-4">AI-Powered Precision Targeting</h2>
            <p className="mb-6">
              Our revolutionary FlutterAI system analyzes blockchain data to create detailed profiles of crypto holders, 
              enabling unprecedented targeting precision. By examining wallet behavior, transaction patterns, and token 
              holdings, we can identify exact audience segments that matter to your business.
            </p>

            <h2 className="text-2xl font-semibold text-gradient mb-4">27-Character Tokenized Messages</h2>
            <p className="mb-6">
              The magic happens through our unique 27-character message tokens. These aren't just messages – they're 
              valuable, redeemable tokens that capture attention and drive engagement. Each message can carry real value, 
              creating an incentive structure that transforms marketing from interruption to invitation.
            </p>

            <h2 className="text-2xl font-semibold text-gradient mb-4">Beyond Traditional Marketing</h2>
            <p className="mb-6">
              Imagine reaching Bitcoin maximalists with messages about your DeFi protocol, or targeting NFT collectors 
              with your latest art drop. Flutterbye makes this granular targeting possible, moving beyond broad demographic 
              targeting to precise crypto-behavioral targeting.
            </p>

            <h2 className="text-2xl font-semibold text-gradient mb-4">Real Value, Real Results</h2>
            <p className="mb-6">
              Each tokenized message carries redeemable value, ensuring recipients are genuinely interested in your 
              content. This creates a win-win scenario: businesses reach engaged audiences, while crypto holders 
              receive valuable communications relevant to their interests.
            </p>

            <h2 className="text-2xl font-semibold text-gradient mb-4">The Platform Advantage</h2>
            <p className="mb-6">
              Flutterbye isn't just a marketing tool – it's a comprehensive platform that includes:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>AI-powered wallet analysis and scoring</li>
              <li>Precision audience segmentation</li>
              <li>Tokenized message creation and distribution</li>
              <li>Real-time campaign analytics</li>
              <li>Enterprise-grade security and compliance</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gradient mb-4">Looking Forward</h2>
            <p className="mb-6">
              As the crypto ecosystem matures, the need for sophisticated marketing tools grows. Flutterbye represents 
              the next evolution in blockchain marketing, where precision meets incentive, and communication becomes 
              genuinely valuable for all parties involved.
            </p>

            <p className="mb-6">
              The future of crypto marketing is here, and it's powered by AI, built on blockchain, and designed for 
              results. Welcome to Flutterbye – where every message matters, every token has value, and every campaign 
              reaches exactly the right audience.
            </p>

            <div className="mt-8 p-6 bg-gradient-to-r from-electric-blue/10 to-circuit-teal/10 border border-electric-blue/30 rounded-lg">
              <h3 className="text-xl font-semibold text-gradient mb-3">Ready to Get Started?</h3>
              <p className="text-gray-300 mb-4">
                Join thousands of businesses already using Flutterbye to revolutionize their crypto marketing strategies.
              </p>
              <Button
                onClick={() => setLocation('/create')}
                className="bg-gradient-to-r from-electric-blue to-circuit-teal hover:from-electric-blue/80 hover:to-circuit-teal/80 text-white"
              >
                Start Your Campaign
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}