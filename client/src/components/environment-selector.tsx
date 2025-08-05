import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, Globe, TestTube, DollarSign, Shield, Zap, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface EnvironmentStatus {
  network: 'devnet' | 'mainnet-beta';
  isProduction: boolean;
  rpcEndpoint: string;
  databaseSchema: string;
  featuresEnabled: number;
  isValid: boolean;
  errors: string[];
  timestamp: string;
}

interface EnvironmentConfig {
  network: 'devnet' | 'mainnet-beta';
  isProduction: boolean;
  allowedFeatures: string[];
}

export function EnvironmentSelector() {
  const [currentEnv, setCurrentEnv] = useState<EnvironmentStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoSwitch, setAutoSwitch] = useState(false);
  const { toast } = useToast();

  // Load current environment status
  useEffect(() => {
    loadEnvironmentStatus();
  }, []);

  const loadEnvironmentStatus = async () => {
    try {
      const response = await apiRequest('GET', '/api/environment/status');
      const data = await response.json();
      setCurrentEnv(data);
    } catch (error) {
      console.error('Failed to load environment status:', error);
      toast({
        title: "Environment Error",
        description: "Failed to load environment status",
        variant: "destructive",
      });
    }
  };

  const switchEnvironment = async (network: 'devnet' | 'mainnet-beta') => {
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/environment/switch', {
        network
      });
      
      if (response.ok) {
        await loadEnvironmentStatus();
        toast({
          title: "Environment Switched",
          description: `Successfully switched to ${network.toUpperCase()}`,
        });
      } else {
        throw new Error('Failed to switch environment');
      }
    } catch (error) {
      console.error('Failed to switch environment:', error);
      toast({
        title: "Switch Failed",
        description: "Failed to switch environment. Check configuration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateEnvironment = async () => {
    try {
      const response = await apiRequest('POST', '/api/environment/validate');
      const data = await response.json();
      
      if (data.isValid) {
        toast({
          title: "Environment Valid",
          description: "Current environment configuration is valid",
        });
      } else {
        toast({
          title: "Environment Issues",
          description: `Found ${data.errors.length} configuration issues`,
          variant: "destructive",
        });
      }
      
      await loadEnvironmentStatus();
    } catch (error) {
      console.error('Failed to validate environment:', error);
    }
  };

  if (!currentEnv) {
    return (
      <Card className="w-full max-w-2xl mx-auto electric-border">
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto electric-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-white">
              <Globe className="w-5 h-5" />
              Environment Configuration
            </CardTitle>
            <CardDescription>
              Dual DevNet/MainNet environment management
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={currentEnv.isProduction ? "destructive" : "secondary"}>
              {currentEnv.network.toUpperCase()}
            </Badge>
            {currentEnv.isValid ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Environment Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <TestTube className="w-4 h-4" />
                DevNet Environment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Status:</span>
                  <Badge variant={!currentEnv.isProduction ? "default" : "secondary"}>
                    {!currentEnv.isProduction ? "Active" : "Standby"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Purpose:</span>
                  <span className="text-sm text-white">Testing & Development</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Risk:</span>
                  <span className="text-sm text-green-400">Zero Financial Risk</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                MainNet Environment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Status:</span>
                  <Badge variant={currentEnv.isProduction ? "destructive" : "secondary"}>
                    {currentEnv.isProduction ? "Production" : "Standby"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Purpose:</span>
                  <span className="text-sm text-white">Enterprise Operations</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Revenue:</span>
                  <span className="text-sm text-blue-400">$200K-$2M Contracts</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Environment Controls */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Environment Controls
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-sm font-medium text-white">Switch Environment</label>
              <Select
                value={currentEnv.network}
                onValueChange={(value: 'devnet' | 'mainnet-beta') => switchEnvironment(value)}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="devnet">
                    <div className="flex items-center gap-2">
                      <TestTube className="w-4 h-4" />
                      DevNet - Testing
                    </div>
                  </SelectItem>
                  <SelectItem value="mainnet-beta">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      MainNet - Production
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-white">Auto-Switch Mode</label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={autoSwitch}
                  onCheckedChange={setAutoSwitch}
                />
                <span className="text-sm text-gray-400">
                  Automatically switch based on traffic
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={validateEnvironment}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Validate Environment
            </Button>
            <Button
              onClick={loadEnvironmentStatus}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Refresh Status
            </Button>
          </div>
        </div>

        {/* Configuration Issues */}
        {!currentEnv.isValid && (
          <Alert className="border-yellow-500 bg-yellow-500/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Configuration Issues Detected</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {currentEnv.errors.map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Environment Details */}
        <div className="bg-gray-800/30 rounded-lg p-4 space-y-3">
          <h4 className="text-sm font-medium text-white">Current Configuration</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Network:</span>
              <span className="ml-2 text-white">{currentEnv.network}</span>
            </div>
            <div>
              <span className="text-gray-400">Database Schema:</span>
              <span className="ml-2 text-white">{currentEnv.databaseSchema}</span>
            </div>
            <div>
              <span className="text-gray-400">Features Enabled:</span>
              <span className="ml-2 text-white">{currentEnv.featuresEnabled}</span>
            </div>
            <div>
              <span className="text-gray-400">Last Updated:</span>
              <span className="ml-2 text-white">
                {new Date(currentEnv.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        {/* Dual Environment Benefits */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-400 mb-2">Dual Environment Benefits</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Risk-free development and testing on DevNet</li>
            <li>• Enterprise revenue operations on MainNet</li>
            <li>• Gradual feature migration strategy</li>
            <li>• Zero downtime for production services</li>
            <li>• A/B testing and rollback capabilities</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}