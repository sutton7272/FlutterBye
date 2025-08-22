import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare,
  Shield,
  Users,
  Globe
} from "lucide-react";
import Navbar from "@/components/navbar";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We'll respond within 24 hours.",
      });
    }, 1000);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "General inquiries and support",
      contact: "support@flutterbye.io",
      color: "electric-blue"
    },
    {
      icon: Shield,
      title: "Security & Privacy",
      description: "Security issues and privacy concerns",
      contact: "security@flutterbye.io",
      color: "electric-green"
    },
    {
      icon: Users,
      title: "Business & Partnerships",
      description: "Enterprise partnerships and collaboration",
      contact: "business@flutterbye.io",
      color: "purple-400"
    },
    {
      icon: MessageSquare,
      title: "Technical Support",
      description: "Platform issues and technical assistance",
      contact: "tech@flutterbye.io",
      color: "orange-400"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-electric-blue/20 rounded-lg border border-electric-blue/50">
                <MessageSquare className="w-8 h-8 text-electric-blue" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-blue to-electric-green bg-clip-text text-transparent">
                Contact Us
              </h1>
            </div>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Get in touch with the FlutterBye team. We're here to help with any questions, support needs, or partnership inquiries.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-electric-blue">
                  <Send className="w-5 h-5" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        First Name *
                      </label>
                      <Input
                        required
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Last Name *
                      </label>
                      <Input
                        required
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      required
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Subject *
                    </label>
                    <Input
                      required
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Message *
                    </label>
                    <Textarea
                      required
                      rows={6}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 resize-none"
                      placeholder="Please describe your inquiry or issue in detail..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-electric-blue to-electric-green hover:opacity-90 transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Contact Methods */}
              <div className="grid gap-4">
                {contactMethods.map((method, index) => {
                  const IconComponent = method.icon;
                  return (
                    <Card key={index} className="bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 bg-${method.color}/20 rounded-lg border border-${method.color}/50`}>
                            <IconComponent className={`w-5 h-5 text-${method.color}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{method.title}</h3>
                            <p className="text-sm text-slate-400 mb-1">{method.description}</p>
                            <a 
                              href={`mailto:${method.contact}`}
                              className={`text-sm text-${method.color} hover:underline`}
                            >
                              {method.contact}
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Company Information */}
              <Card className="bg-slate-800/60 backdrop-blur-sm border-electric-green/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-electric-green">
                    <Globe className="w-5 h-5" />
                    Company Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-electric-blue mt-0.5" />
                    <div>
                      <p className="font-medium text-white">Address</p>
                      <p className="text-slate-400">
                        Solvitur Inc.<br />
                        [Company Address]<br />
                        [City, State ZIP]
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-electric-green mt-0.5" />
                    <div>
                      <p className="font-medium text-white">Phone</p>
                      <p className="text-slate-400">[Contact Number]</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-purple-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-white">Business Hours</p>
                      <p className="text-slate-400">
                        Monday - Friday: 9:00 AM - 6:00 PM PST<br />
                        Weekend: Emergency support only
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Response Time */}
              <Card className="bg-slate-800/60 backdrop-blur-sm border-electric-blue/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="w-5 h-5 text-electric-blue" />
                    <h3 className="font-semibold text-white">Response Times</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">General Inquiries:</span>
                      <Badge variant="outline" className="border-electric-blue/50 text-electric-blue">
                        24 hours
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Technical Support:</span>
                      <Badge variant="outline" className="border-electric-green/50 text-electric-green">
                        4-8 hours
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Security Issues:</span>
                      <Badge variant="outline" className="border-red-500/50 text-red-400">
                        1 hour
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Enterprise Support:</span>
                      <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                        2 hours
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-12 text-center">
            <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700/50 max-w-3xl mx-auto">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Need Immediate Help?
                </h3>
                <p className="text-slate-300 mb-4">
                  For urgent technical issues or security concerns, please contact our emergency support line or mark your email as "URGENT" in the subject line.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    variant="outline" 
                    className="border-electric-blue/50 text-electric-blue hover:bg-electric-blue/10"
                  >
                    View Documentation
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-electric-green/50 text-electric-green hover:bg-electric-green/10"
                  >
                    Community Forum
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}