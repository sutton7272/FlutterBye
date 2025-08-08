import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Wallet, Shield, TrendingUp, Users } from "lucide-react";
import { Link } from "wouter";
import { CustodialWalletManagement } from "@/components/custodial-wallet-management";

/**
 * Admin page for Secure Custodial Wallet System
 * Production-ready interface for managing user value attachment infrastructure
 */
export default function AdminCustodialWalletPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-navy via-dark-navy/95 to-electric-blue/5">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="hover:opacity-80">
              <Button variant="outline" size="sm" className="border-electric-blue/20 text-gray-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <Wallet className="w-8 h-8 mr-3 text-electric-blue" />
                Secure Custodial Wallet System
              </h1>
              <p className="text-gray-400 mt-2">
                Enterprise-grade wallet infrastructure for user value attachment and redemption
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/20">
              Production Ready
            </Badge>
            <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/20">
              Bank-Grade Security
            </Badge>
          </div>
        </div>

        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-dark-navy/50 border-electric-blue/20 hover:border-electric-blue/40 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Security Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs text-gray-300">✓ Multi-signature security</div>
              <div className="text-xs text-gray-300">✓ Bank-grade encryption</div>
              <div className="text-xs text-gray-300">✓ Fraud detection</div>
              <div className="text-xs text-gray-300">✓ Compliance monitoring</div>
            </CardContent>
          </Card>

          <Card className="bg-dark-navy/50 border-electric-blue/20 hover:border-electric-blue/40 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <Wallet className="w-4 h-4 mr-2" />
                Supported Currencies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs text-gray-300">• SOL (Solana)</div>
              <div className="text-xs text-gray-300">• USDC (Stablecoin)</div>
              <div className="text-xs text-gray-300">• FLBY (Platform Token)</div>
              <div className="text-xs text-gray-300 text-electric-blue">+ More coming soon</div>
            </CardContent>
          </Card>

          <Card className="bg-dark-navy/50 border-electric-blue/20 hover:border-electric-blue/40 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Revenue Model
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs text-gray-300">• Transaction fees</div>
              <div className="text-xs text-gray-300">• Value attachment fees</div>
              <div className="text-xs text-gray-300">• Redemption processing</div>
              <div className="text-xs text-green-400">$2M-$10M ARR target</div>
            </CardContent>
          </Card>

          <Card className="bg-dark-navy/50 border-electric-blue/20 hover:border-electric-blue/40 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Use Cases
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs text-gray-300">• Gift card creation</div>
              <div className="text-xs text-gray-300">• Content monetization</div>
              <div className="text-xs text-gray-300">• Token value attachment</div>
              <div className="text-xs text-gray-300">• P2P value transfer</div>
            </CardContent>
          </Card>
        </div>

        {/* System Architecture Overview */}
        <Card className="bg-dark-navy/50 border-electric-blue/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white">System Architecture</CardTitle>
            <CardDescription className="text-gray-400">
              Secure custodial wallet infrastructure separate from enterprise escrow contracts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-white">1. User Deposit</h4>
                <div className="text-sm text-gray-300 space-y-1">
                  <div>• User deposits funds to custodial wallet</div>
                  <div>• Multi-currency support (SOL/USDC/FLBY)</div>
                  <div>• Real-time balance tracking</div>
                  <div>• Security logging and fraud detection</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-white">2. Value Attachment</h4>
                <div className="text-sm text-gray-300 space-y-1">
                  <div>• Attach value to products/messages</div>
                  <div>• Generate unique redemption codes</div>
                  <div>• Set expiration dates and recipient rules</div>
                  <div>• Reserve funds in secure custody</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-white">3. Recipient Redemption</h4>
                <div className="text-sm text-gray-300 space-y-1">
                  <div>• Recipient claims value with code</div>
                  <div>• Compliance and security checks</div>
                  <div>• Transfer funds to recipient wallet</div>
                  <div>• Complete transaction logging</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Management Interface */}
        <CustodialWalletManagement />

        {/* Footer Information */}
        <div className="mt-8 text-center">
          <div className="text-xs text-gray-500">
            Secure Custodial Wallet System • Production-Ready Infrastructure • Enterprise-Grade Security
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Revenue Target: $2M-$10M ARR from transaction fees and value attachment services
          </div>
        </div>
      </div>
    </div>
  );
}