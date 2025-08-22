import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, Database, Globe, UserCheck } from "lucide-react";
import Navbar from "@/components/navbar";

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-electric-blue/20 rounded-lg border border-electric-blue/50">
                <Shield className="w-8 h-8 text-electric-blue" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-blue to-electric-green bg-clip-text text-transparent">
                Privacy Policy
              </h1>
            </div>
            <p className="text-slate-400 text-lg">
              How FlutterBye protects and manages your personal information
            </p>
            <Badge variant="outline" className="mt-4 border-electric-green/50 text-electric-green">
              Effective Date: August 22, 2025
            </Badge>
          </div>

          {/* Introduction */}
          <Card className="mb-8 bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-electric-blue">
                <Globe className="w-5 h-5" />
                Introduction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-300">
              <p>
                FlutterBye, operated by Solvitur Inc. ("we," "our," or "us"), is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our blockchain-based communication platform and related services.
              </p>
              <p>
                By accessing or using FlutterBye, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with our practices, please do not use our services.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card className="mb-8 bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-electric-green">
                <Database className="w-5 h-5" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-slate-300">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Personal Information</h3>
                <ul className="space-y-2 ml-4">
                  <li>• Email addresses (when provided for notifications or support)</li>
                  <li>• Wallet addresses and blockchain transaction data</li>
                  <li>• Profile information you choose to share</li>
                  <li>• Communication preferences and settings</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Blockchain Data</h3>
                <ul className="space-y-2 ml-4">
                  <li>• Public wallet addresses and transaction histories</li>
                  <li>• Token creation and distribution records</li>
                  <li>• Smart contract interactions and blockchain activities</li>
                  <li>• Message tokens and associated metadata</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Technical Information</h3>
                <ul className="space-y-2 ml-4">
                  <li>• IP addresses and device information</li>
                  <li>• Browser type, operating system, and usage patterns</li>
                  <li>• Performance metrics and error logs</li>
                  <li>• Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card className="mb-8 bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Eye className="w-5 h-5" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-300">
              <p>We use the collected information for the following purposes:</p>
              <ul className="space-y-2 ml-4">
                <li>• To provide, operate, and maintain our blockchain services</li>
                <li>• To process transactions and facilitate token transfers</li>
                <li>• To improve user experience and platform functionality</li>
                <li>• To communicate with you about service updates and support</li>
                <li>• To ensure platform security and prevent fraud</li>
                <li>• To comply with legal obligations and regulatory requirements</li>
                <li>• To analyze usage patterns and optimize performance</li>
                <li>• To provide customer support and technical assistance</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card className="mb-8 bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-400">
                <UserCheck className="w-5 h-5" />
                Information Sharing and Disclosure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-300">
              <p>We may share your information in the following circumstances:</p>
              <ul className="space-y-2 ml-4">
                <li>• <strong>Blockchain Networks:</strong> Transaction data is publicly recorded on blockchain networks</li>
                <li>• <strong>Service Providers:</strong> With trusted third-party providers who assist in platform operations</li>
                <li>• <strong>Legal Requirements:</strong> When required by law, court order, or regulatory authority</li>
                <li>• <strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                <li>• <strong>Consent:</strong> With your explicit consent for specific purposes</li>
                <li>• <strong>Safety and Security:</strong> To protect rights, property, or safety of users and the platform</li>
              </ul>
              <p className="mt-4 p-4 bg-slate-700/50 rounded-lg">
                <strong>Note:</strong> Blockchain transactions are inherently public and permanently recorded. We cannot control or modify information once it's recorded on the blockchain.
              </p>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card className="mb-8 bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-electric-blue">
                <Lock className="w-5 h-5" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-300">
              <p>We implement industry-standard security measures to protect your personal information:</p>
              <ul className="space-y-2 ml-4">
                <li>• End-to-end encryption for sensitive communications</li>
                <li>• Secure data storage with regular security audits</li>
                <li>• Multi-factor authentication and access controls</li>
                <li>• Regular security updates and vulnerability assessments</li>
                <li>• Compliance with blockchain security best practices</li>
              </ul>
              <p className="mt-4 p-4 bg-slate-700/50 rounded-lg">
                However, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security of your information.
              </p>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="mb-8 bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-electric-green">
                <Shield className="w-5 h-5" />
                Your Privacy Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-300">
              <p>Depending on your location, you may have the following rights:</p>
              <ul className="space-y-2 ml-4">
                <li>• <strong>Access:</strong> Request access to your personal information</li>
                <li>• <strong>Correction:</strong> Request correction of inaccurate information</li>
                <li>• <strong>Deletion:</strong> Request deletion of your personal information (subject to legal and technical limitations)</li>
                <li>• <strong>Portability:</strong> Request transfer of your data to another service</li>
                <li>• <strong>Objection:</strong> Object to certain processing of your information</li>
                <li>• <strong>Restriction:</strong> Request restriction of processing under certain circumstances</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact us at privacy@flutterbye.io. We will respond to your request within 30 days.
              </p>
            </CardContent>
          </Card>

          {/* Cookies and Tracking */}
          <Card className="mb-8 bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-purple-400">Cookies and Tracking Technologies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-300">
              <p>We use cookies and similar technologies to:</p>
              <ul className="space-y-2 ml-4">
                <li>• Remember your preferences and settings</li>
                <li>• Analyze platform usage and performance</li>
                <li>• Provide personalized user experiences</li>
                <li>• Ensure platform security and prevent fraud</li>
              </ul>
              <p>You can control cookies through your browser settings, though disabling certain cookies may affect platform functionality.</p>
            </CardContent>
          </Card>

          {/* International Transfers */}
          <Card className="mb-8 bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-orange-400">International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-300">
              <p>
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for international transfers, including:
              </p>
              <ul className="space-y-2 ml-4">
                <li>• Standard contractual clauses approved by relevant authorities</li>
                <li>• Adequacy decisions from relevant privacy regulators</li>
                <li>• Other legally approved transfer mechanisms</li>
              </ul>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card className="mb-8 bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-electric-blue">Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-300">
              <p>
                FlutterBye is not intended for use by children under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Policy */}
          <Card className="mb-8 bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-electric-green">Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-300">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Effective Date" above. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mb-8 bg-slate-800/60 backdrop-blur-sm border-electric-blue/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-electric-blue">
                <Globe className="w-5 h-5" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-300">
              <p>If you have any questions about this Privacy Policy, please contact us:</p>
              <div className="space-y-2">
                <p><strong>Solvitur Inc.</strong></p>
                <p>Email: privacy@flutterbye.io</p>
                <p>Address: [Company Address]</p>
                <p>Phone: [Contact Number]</p>
              </div>
              <p className="text-sm text-slate-400 mt-4">
                For urgent privacy concerns, please mark your communication as "URGENT - Privacy Matter" in the subject line.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}