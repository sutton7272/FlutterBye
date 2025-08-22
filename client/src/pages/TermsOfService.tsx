import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, FileText, AlertTriangle, Shield, Gavel, Users } from "lucide-react";
import Navbar from "@/components/navbar";

export default function TermsOfService() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-electric-green/20 rounded-lg border border-electric-green/50">
                <Scale className="w-8 h-8 text-electric-green" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-green to-electric-blue bg-clip-text text-transparent">
                Terms of Service
              </h1>
            </div>
            <p className="text-slate-400 text-lg">
              Legal terms and conditions for using the FlutterBye platform
            </p>
            <Badge variant="outline" className="mt-4 border-electric-blue/50 text-electric-blue">
              Effective Date: August 22, 2025
            </Badge>
          </div>

          {/* Agreement to Terms */}
          <Card className="mb-8 bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-electric-green">
                <FileText className="w-5 h-5" />
                Agreement to Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-300">
              <p>
                These Terms of Service ("Terms") constitute a legally binding agreement between you and Solvitur Inc. ("Company," "we," "our," or "us") regarding your use of the FlutterBye platform and related services ("Service").
              </p>
              <p>
                By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access the Service.
              </p>
              <div className="p-4 bg-electric-green/10 border border-electric-green/30 rounded-lg">
                <p className="text-electric-green font-medium">
                  Important: These terms include important disclaimers regarding blockchain technology, cryptocurrency risks, and limitations of liability.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card className="mb-8 bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-electric-blue">
                <Users className="w-5 h-5" />
                Service Description
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-300">
              <p>
                FlutterBye is a blockchain-based communication platform that enables users to:
              </p>
              <ul className="space-y-2 ml-4">
                <li>• Create and distribute tokenized messages on the Solana blockchain</li>
                <li>• Attach value to digital communications</li>
                <li>• Participate in decentralized communication networks</li>
                <li>• Engage with Web3 messaging and token distribution systems</li>
                <li>• Access AI-powered content generation and analytics tools</li>
              </ul>
              <p className="mt-4 p-4 bg-slate-700/50 rounded-lg">
                <strong>Platform Evolution:</strong> Our services may evolve and change over time. We reserve the right to modify, suspend, or discontinue features with reasonable notice.
              </p>
            </CardContent>
          </Card>

          {/* User Responsibilities */}
          <Card className="mb-8 bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Shield className="w-5 h-5" />
                User Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-slate-300">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Account Security</h3>
                <ul className="space-y-2 ml-4">
                  <li>• You are responsible for securing your wallet and private keys</li>
                  <li>• Never share your private keys or seed phrases with anyone</li>
                  <li>• Report any suspicious activity immediately</li>
                  <li>• Maintain the confidentiality of your account credentials</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Acceptable Use</h3>
                <ul className="space-y-2 ml-4">
                  <li>• Use the platform only for lawful purposes</li>
                  <li>• Respect intellectual property rights</li>
                  <li>• Do not engage in fraudulent or deceptive activities</li>
                  <li>• Do not attempt to manipulate token prices or markets</li>
                  <li>• Do not upload malicious content or viruses</li>
                  <li>• Do not harass, threaten, or abuse other users</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Prohibited Activities</h3>
                <ul className="space-y-2 ml-4">
                  <li>• Money laundering or terrorist financing</li>
                  <li>• Market manipulation or insider trading</li>
                  <li>• Creating or distributing illegal content</li>
                  <li>• Circumventing platform security measures</li>
                  <li>• Automated abuse or bot activities</li>
                  <li>• Impersonating other individuals or entities</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Blockchain and Cryptocurrency Risks */}
          <Card className="mb-8 bg-slate-800/60 backdrop-blur-sm border-red-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-5 h-5" />
                Blockchain and Cryptocurrency Risks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-300">
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-300 font-medium mb-2">
                  Important Risk Disclosure
                </p>
                <p className="text-sm">
                  Blockchain technology and cryptocurrencies involve significant risks. By using our platform, you acknowledge and accept these risks.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Key Risks Include:</h3>
                <ul className="space-y-2 ml-4">
                  <li>• <strong>Volatility:</strong> Cryptocurrency values can fluctuate dramatically</li>
                  <li>• <strong>Irreversibility:</strong> Blockchain transactions cannot be reversed</li>
                  <li>• <strong>Technical Risks:</strong> Smart contract bugs or network failures</li>
                  <li>• <strong>Regulatory Changes:</strong> Future legal or regulatory developments</li>
                  <li>• <strong>Loss of Access:</strong> Lost private keys result in permanent loss of funds</li>
                  <li>• <strong>Network Congestion:</strong> High fees and delayed transactions</li>
                  <li>• <strong>Third-Party Risks:</strong> Wallet providers, exchanges, and other services</li>
                </ul>
              </div>

              <p className="mt-4 font-medium text-yellow-400">
                You acknowledge that you understand these risks and that we are not responsible for any losses resulting from these inherent blockchain risks.
              </p>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card className="mb-8 bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-electric-green">
                <FileText className="w-5 h-5" />
                Intellectual Property
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-300">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Our Rights</h3>
                <p>
                  The FlutterBye platform, including its design, code, trademarks, and content, is owned by Solvitur Inc. and protected by intellectual property laws. You may not copy, modify, or distribute our proprietary content without permission.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Your Content</h3>
                <p>
                  You retain ownership of content you create using our platform. By using our services, you grant us a limited license to host, display, and distribute your content as necessary to provide our services.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">User-Generated Tokens</h3>
                <p>
                  Tokens created through our platform belong to their creators, subject to blockchain network rules. We do not claim ownership of user-generated tokens or their associated value.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy and Data */}
          <Card className="mb-8 bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-purple-400">Privacy and Data Protection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-300">
              <p>
                Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
              </p>
              <p>
                By using our services, you consent to the collection and use of information as described in our Privacy Policy.
              </p>
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <p className="text-sm">
                  <strong>Blockchain Transparency:</strong> Remember that blockchain transactions are public and permanent. Information recorded on the blockchain cannot be deleted or modified.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimers and Limitations */}
          <Card className="mb-8 bg-slate-800/60 backdrop-blur-sm border-orange-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-400">
                <AlertTriangle className="w-5 h-5" />
                Disclaimers and Limitations of Liability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-300">
              <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <p className="text-orange-300 font-medium mb-2">Important Legal Disclaimers</p>
                <p className="text-sm">The following limitations apply to the maximum extent permitted by law.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Service Disclaimers</h3>
                <ul className="space-y-2 ml-4">
                  <li>• Our services are provided "as is" without warranties of any kind</li>
                  <li>• We do not guarantee uninterrupted or error-free service</li>
                  <li>• We are not responsible for blockchain network performance</li>
                  <li>• Token values and market performance are not guaranteed</li>
                  <li>• Third-party integrations are beyond our control</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Limitation of Liability</h3>
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, SOLVITUR INC. SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR USE, ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICE.
                </p>
                <p className="mt-2">
                  Our total liability to you for all claims shall not exceed the amount you paid us in the 12 months preceding the claim, or $100, whichever is greater.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card className="mb-8 bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <Gavel className="w-5 h-5" />
                Termination
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-300">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Termination by You</h3>
                <p>You may stop using our services at any time. Some data may remain on the blockchain permanently.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Termination by Us</h3>
                <p>We may terminate or suspend your access to our services for:</p>
                <ul className="space-y-2 ml-4">
                  <li>• Violation of these Terms</li>
                  <li>• Illegal or fraudulent activity</li>
                  <li>• Prolonged inactivity</li>
                  <li>• Technical or security reasons</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Effect of Termination</h3>
                <p>
                  Upon termination, your right to use the service ceases immediately. However, blockchain data remains permanently recorded and accessible.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Dispute Resolution */}
          <Card className="mb-8 bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-electric-blue">
                <Scale className="w-5 h-5" />
                Dispute Resolution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-300">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Informal Resolution</h3>
                <p>
                  Before filing any formal dispute, please contact us at legal@flutterbye.io to seek an informal resolution. We are committed to working with users to resolve issues fairly.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Arbitration</h3>
                <p>
                  Any disputes that cannot be resolved informally shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Governing Law</h3>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law provisions.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card className="mb-8 bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-electric-green">Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-300">
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of significant changes by:
              </p>
              <ul className="space-y-2 ml-4">
                <li>• Posting the updated Terms on our platform</li>
                <li>• Sending email notifications (if you've provided an email)</li>
                <li>• Displaying prominent notices on our platform</li>
              </ul>
              <p>
                Your continued use of the service after changes become effective constitutes acceptance of the new Terms.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mb-8 bg-slate-800/60 backdrop-blur-sm border-electric-green/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-electric-green">
                <FileText className="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-300">
              <p>For questions about these Terms of Service, please contact us:</p>
              <div className="space-y-2">
                <p><strong>Solvitur Inc.</strong></p>
                <p>Email: legal@flutterbye.io</p>
                <p>Address: [Company Address]</p>
                <p>Phone: [Contact Number]</p>
              </div>
              <p className="text-sm text-slate-400 mt-4">
                For urgent legal matters, please mark your communication as "URGENT - Legal Matter" in the subject line.
              </p>
            </CardContent>
          </Card>

          {/* Acknowledgment */}
          <Card className="mb-8 bg-slate-800/60 backdrop-blur-sm border-electric-blue/30">
            <CardHeader>
              <CardTitle className="text-electric-blue">Acknowledgment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-300">
              <p>
                By using FlutterBye, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
              </p>
              <div className="p-4 bg-electric-blue/10 border border-electric-blue/30 rounded-lg">
                <p className="text-electric-blue font-medium">
                  These Terms constitute the entire agreement between you and Solvitur Inc. regarding the use of our services.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}