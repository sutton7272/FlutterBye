import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Building2, CheckCircle, Clock, Users, Target, BarChart3, Zap, Rocket } from "lucide-react";

export default function EnterpriseQuickSetup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [setupData, setSetupData] = useState({
    companyName: "",
    industry: "",
    targetAudience: "",
    campaignGoal: "",
    budget: ""
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const industries = [
    "Technology", "Finance", "Healthcare", "Retail", "Education", 
    "Entertainment", "Travel", "Food & Beverage", "Real Estate", "Other"
  ];

  const campaignGoals = [
    "Brand Awareness", "Lead Generation", "Customer Engagement", 
    "Product Launch", "Event Promotion", "Community Building"
  ];

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleLaunchCampaign = () => {
    console.log("Launching enterprise campaign with:", setupData);
    // This would create the actual campaign in production
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-electric-blue to-electric-green bg-clip-text text-transparent">
            Enterprise Quick Setup
          </h1>
          <p className="text-gray-300">Launch your tokenized messaging campaign in just 5 minutes</p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8 bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-electric-blue">Setup Progress</h3>
              <span className="text-sm text-gray-400">Step {currentStep} of {totalSteps}</span>
            </div>
            <Progress value={progress} className="h-3 mb-4" />
            <div className="flex justify-between text-sm text-gray-400">
              <span className={currentStep >= 1 ? "text-electric-blue" : ""}>Company Info</span>
              <span className={currentStep >= 2 ? "text-electric-blue" : ""}>Target Audience</span>
              <span className={currentStep >= 3 ? "text-electric-blue" : ""}>Campaign Goals</span>
              <span className={currentStep >= 4 ? "text-electric-blue" : ""}>Budget & Pricing</span>
              <span className={currentStep >= 5 ? "text-electric-blue" : ""}>Launch Ready</span>
            </div>
          </CardContent>
        </Card>

        {/* Setup Steps */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Building2 className="h-12 w-12 text-electric-blue mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Company Information</h2>
                  <p className="text-gray-300">Tell us about your business</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Company Name</label>
                    <Input
                      placeholder="Enter your company name"
                      className="bg-gray-700/50 border-gray-600 text-white"
                      value={setupData.companyName}
                      onChange={(e) => setSetupData({...setupData, companyName: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Industry</label>
                    <select 
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                      value={setupData.industry}
                      onChange={(e) => setSetupData({...setupData, industry: e.target.value})}
                    >
                      <option value="">Select your industry</option>
                      {industries.map((industry) => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Users className="h-12 w-12 text-electric-green mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Target Audience</h2>
                  <p className="text-gray-300">Define who you want to reach</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Describe Your Target Audience</label>
                  <textarea
                    placeholder="e.g., Tech-savvy millennials interested in cryptocurrency and digital innovation..."
                    className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white resize-none h-32"
                    value={setupData.targetAudience}
                    onChange={(e) => setSetupData({...setupData, targetAudience: e.target.value})}
                  />
                </div>
                
                <div className="bg-electric-blue/10 p-4 rounded-lg border border-electric-blue/20">
                  <h4 className="font-semibold text-electric-blue mb-2">Pro Tip</h4>
                  <p className="text-sm text-gray-300">
                    The more specific your audience description, the better we can optimize your campaign targeting and message recommendations.
                  </p>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Target className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Campaign Goals</h2>
                  <p className="text-gray-300">What do you want to achieve?</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-3">Primary Campaign Goal</label>
                  <div className="grid grid-cols-2 gap-3">
                    {campaignGoals.map((goal) => (
                      <button
                        key={goal}
                        onClick={() => setSetupData({...setupData, campaignGoal: goal})}
                        className={`p-3 rounded-lg border text-left transition-colors ${
                          setupData.campaignGoal === goal
                            ? "border-electric-blue bg-electric-blue/20 text-electric-blue"
                            : "border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500"
                        }`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <BarChart3 className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Budget & Pricing</h2>
                  <p className="text-gray-300">Set your campaign budget</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Monthly Campaign Budget (SOL)</label>
                    <Input
                      type="number"
                      placeholder="100"
                      className="bg-gray-700/50 border-gray-600 text-white"
                      value={setupData.budget}
                      onChange={(e) => setSetupData({...setupData, budget: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="bg-gray-700/50 border-gray-600 p-4 text-center">
                      <h4 className="font-semibold text-electric-blue mb-2">Starter</h4>
                      <p className="text-2xl font-bold mb-2">10-50 SOL</p>
                      <p className="text-sm text-gray-400">Perfect for testing</p>
                    </Card>
                    <Card className="bg-gray-700/50 border-gray-600 p-4 text-center">
                      <h4 className="font-semibold text-electric-green mb-2">Growth</h4>
                      <p className="text-2xl font-bold mb-2">51-200 SOL</p>
                      <p className="text-sm text-gray-400">Scale your reach</p>
                    </Card>
                    <Card className="bg-gray-700/50 border-gray-600 p-4 text-center">
                      <h4 className="font-semibold text-yellow-400 mb-2">Enterprise</h4>
                      <p className="text-2xl font-bold mb-2">201+ SOL</p>
                      <p className="text-sm text-gray-400">Maximum impact</p>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <CheckCircle className="h-12 w-12 text-electric-green mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Ready to Launch!</h2>
                  <p className="text-gray-300">Review your campaign setup</p>
                </div>
                
                <div className="space-y-4">
                  <Card className="bg-gray-700/50 border-gray-600 p-4">
                    <h4 className="font-semibold mb-3 text-electric-blue">Campaign Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Company:</span>
                        <span>{setupData.companyName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Industry:</span>
                        <span>{setupData.industry}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Goal:</span>
                        <span>{setupData.campaignGoal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Budget:</span>
                        <span>{setupData.budget} SOL/month</span>
                      </div>
                    </div>
                  </Card>
                  
                  <div className="bg-gradient-to-r from-electric-blue/20 to-electric-green/20 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-electric-blue">What happens next?</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Instant access to enterprise dashboard</li>
                      <li>• Pre-built campaign templates</li>
                      <li>• Real-time analytics and ROI tracking</li>
                      <li>• Dedicated account manager (Enterprise tier)</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Previous
              </Button>
              
              {currentStep < totalSteps ? (
                <Button
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && (!setupData.companyName || !setupData.industry)) ||
                    (currentStep === 2 && !setupData.targetAudience) ||
                    (currentStep === 3 && !setupData.campaignGoal) ||
                    (currentStep === 4 && !setupData.budget)
                  }
                  className="bg-gradient-to-r from-electric-blue to-electric-green hover:opacity-90"
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  onClick={handleLaunchCampaign}
                  className="bg-gradient-to-r from-electric-green to-yellow-400 hover:opacity-90 flex items-center gap-2"
                >
                  <Rocket className="h-4 w-4" />
                  Launch Campaign
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4 text-center">
              <Zap className="h-8 w-8 text-electric-blue mx-auto mb-2" />
              <h4 className="font-semibold mb-2">Instant Setup</h4>
              <p className="text-sm text-gray-400">Campaign live in under 5 minutes</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4 text-center">
              <BarChart3 className="h-8 w-8 text-electric-green mx-auto mb-2" />
              <h4 className="font-semibold mb-2">Real-time Analytics</h4>
              <p className="text-sm text-gray-400">Track ROI and engagement instantly</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <h4 className="font-semibold mb-2">Expert Support</h4>
              <p className="text-sm text-gray-400">Dedicated account management</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}