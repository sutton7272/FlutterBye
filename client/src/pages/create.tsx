import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  Coins, 
  Sparkles, 
  Star, 
  Gift,
  Brain,
  Zap,
  Palette,
  Image,
  Mic,
  Users
} from "lucide-react";

export default function Create() {
  console.log("🚀 NEW FLUTTERBYE CREATION HUB LOADING 🚀");
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 text-gradient">🚀 NEW Flutterbye Creation Hub 🚀</h1>
          <p className="text-xl text-muted-foreground mb-8">Revolutionary blockchain creation platform featuring Flutterbye Coins and FlutterArt</p>
        </div>

        {/* Main Creation Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Flutterbye Coins */}
          <Card className="electric-frame bg-gradient-to-br from-electric-blue/20 to-circuit-teal/20 border-2 border-electric-blue/50 hover:border-electric-blue/80 transition-all duration-500 hover:shadow-2xl hover:shadow-electric-blue/25">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-electric-blue to-circuit-teal rounded-full flex items-center justify-center">
                <Coins className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-electric-blue mb-2">Flutterbye Coins</CardTitle>
              <CardDescription className="text-lg text-gray-300">
                Create personalized message tokens with attached value
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 p-4 rounded-lg border border-electric-blue/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-electric-blue" />
                    <span className="font-semibold text-electric-blue">27-Character Messages</span>
                  </div>
                  <p className="text-sm text-gray-400">Precision messaging on blockchain</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg border border-electric-green/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="w-5 h-5 text-electric-green" />
                    <span className="font-semibold text-electric-green">Value Attachment</span>
                  </div>
                  <p className="text-sm text-gray-400">SOL, USDC, FLBY rewards</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg border border-purple-400/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    <span className="font-semibold text-purple-400">AI Targeting</span>
                  </div>
                  <p className="text-sm text-gray-400">Precision holder analysis</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg border border-orange-400/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-orange-400" />
                    <span className="font-semibold text-orange-400">Viral Mechanics</span>
                  </div>
                  <p className="text-sm text-gray-400">Growth amplification</p>
                </div>
              </div>
              <Link href="/mint">
                <Button className="w-full bg-gradient-to-r from-electric-blue to-circuit-teal hover:from-electric-blue/80 hover:to-circuit-teal/80 text-white py-6 text-lg font-semibold">
                  <Coins className="w-5 h-5 mr-2" />
                  Create Flutterbye Coin
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* FlutterArt */}
          <Card className="electric-frame bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-500/50 hover:border-purple-500/80 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/25">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <Palette className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-purple-400 mb-2">FlutterArt</CardTitle>
              <CardDescription className="text-lg text-gray-300">
                Limited edition NFT collections with multimedia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 p-4 rounded-lg border border-purple-400/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-purple-400" />
                    <span className="font-semibold text-purple-400">Limited Editions</span>
                  </div>
                  <p className="text-sm text-gray-400">Exclusive NFT collections</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg border border-pink-400/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Image className="w-5 h-5 text-pink-400" />
                    <span className="font-semibold text-pink-400">Rich Media</span>
                  </div>
                  <p className="text-sm text-gray-400">Images, GIFs, QR codes</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg border border-indigo-400/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Mic className="w-5 h-5 text-indigo-400" />
                    <span className="font-semibold text-indigo-400">Voice & Music</span>
                  </div>
                  <p className="text-sm text-gray-400">Audio NFT integration</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg border border-cyan-400/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-cyan-400" />
                    <span className="font-semibold text-cyan-400">Collaborative</span>
                  </div>
                  <p className="text-sm text-gray-400">Multi-creator works</p>
                </div>
              </div>
              <Link href="/flutter-art">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-600/80 hover:to-pink-600/80 text-white py-6 text-lg font-semibold">
                  <Star className="w-5 h-5 mr-2" />
                  Create FlutterArt NFT
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Start Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Quick Start Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/greeting-cards">
              <Card className="electric-frame hover:border-electric-green/60 transition-all cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Gift className="w-12 h-12 mx-auto mb-3 text-electric-green" />
                  <h3 className="font-semibold text-white mb-2">Digital Greeting Cards</h3>
                  <p className="text-sm text-gray-400">Perfect for gifts and personal messages</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/enterprise">
              <Card className="electric-frame hover:border-purple-500/60 transition-all cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Brain className="w-12 h-12 mx-auto mb-3 text-purple-400" />
                  <h3 className="font-semibold text-white mb-2">Targeted Marketing</h3>
                  <p className="text-sm text-gray-400">AI-powered crypto marketing campaigns</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/flutter-art">
              <Card className="electric-frame hover:border-pink-500/60 transition-all cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Palette className="w-12 h-12 mx-auto mb-3 text-pink-400" />
                  <h3 className="font-semibold text-white mb-2">AI Art Generation</h3>
                  <p className="text-sm text-gray-400">Create unique NFT artwork with AI</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}