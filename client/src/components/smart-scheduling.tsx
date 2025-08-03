import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Target, TrendingUp, Globe, Users, Zap, Timer } from 'lucide-react';

interface SmartSchedulingProps {
  onScheduleMessage: (schedule: any) => void;
}

export function SmartScheduling({ onScheduleMessage }: SmartSchedulingProps) {
  const [scheduleType, setScheduleType] = useState('optimal');
  const [targetAudience, setTargetAudience] = useState('global');
  const [campaignType, setCampaignType] = useState('viral');

  const optimalTimes = [
    { time: '2:00 PM EST', engagement: 94, reasoning: 'Peak emotional receptivity window', audience: 'North America' },
    { time: '8:00 PM CET', engagement: 91, reasoning: 'Evening social media consumption peak', audience: 'Europe' },
    { time: '10:00 AM JST', engagement: 88, reasoning: 'Morning inspiration seeking behavior', audience: 'Asia-Pacific' },
    { time: '7:00 PM PST', engagement: 87, reasoning: 'After-work relaxation and sharing time', audience: 'West Coast US' }
  ];

  const viralWindows = [
    { window: 'Monday 9-11 AM', multiplier: '2.3x', type: 'Motivation Monday', description: 'Work motivation peaks' },
    { window: 'Wednesday 2-4 PM', multiplier: '2.7x', type: 'Midweek Boost', description: 'Energy restoration need' },
    { window: 'Friday 6-8 PM', multiplier: '3.1x', type: 'Weekend Anticipation', description: 'Celebration mood onset' },
    { window: 'Sunday 10 AM-12 PM', multiplier: '2.9x', type: 'Reflection Sunday', description: 'Gratitude and planning mindset' }
  ];

  const scheduleMessage = () => {
    const schedule = {
      type: scheduleType,
      audience: targetAudience,
      campaign: campaignType,
      timestamp: Date.now() + (24 * 60 * 60 * 1000), // 24 hours from now
      expectedMultiplier: scheduleType === 'viral' ? '2.8x' : '1.9x',
      estimatedReach: targetAudience === 'global' ? '15,000+' : '8,500+'
    };
    
    onScheduleMessage(schedule);
  };

  return (
    <div className="space-y-6">
      {/* Smart Scheduling Header */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Timer className="h-6 w-6 text-blue-400" />
            AI-Powered Smart Scheduling
          </CardTitle>
          <p className="text-blue-200 text-sm">
            Maximize your message impact with quantum-inspired timing optimization
          </p>
        </CardHeader>
      </Card>

      {/* Configuration Options */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
          <CardContent className="p-4 space-y-3">
            <Label className="text-white">Schedule Strategy</Label>
            <Select value={scheduleType} onValueChange={setScheduleType}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="optimal">Peak Engagement</SelectItem>
                <SelectItem value="viral">Viral Window</SelectItem>
                <SelectItem value="audience">Audience Specific</SelectItem>
                <SelectItem value="experimental">AI Experimental</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border-green-500/30">
          <CardContent className="p-4 space-y-3">
            <Label className="text-white">Target Audience</Label>
            <Select value={targetAudience} onValueChange={setTargetAudience}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="global">Global Reach</SelectItem>
                <SelectItem value="americas">Americas Focus</SelectItem>
                <SelectItem value="europe">European Prime</SelectItem>
                <SelectItem value="asia">Asia-Pacific</SelectItem>
                <SelectItem value="custom">Custom Timezone</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border-orange-500/30">
          <CardContent className="p-4 space-y-3">
            <Label className="text-white">Campaign Type</Label>
            <Select value={campaignType} onValueChange={setCampaignType}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viral">Maximum Viral</SelectItem>
                <SelectItem value="value">High Value</SelectItem>
                <SelectItem value="engagement">Deep Engagement</SelectItem>
                <SelectItem value="reach">Broad Reach</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Optimal Times Display */}
      <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-400" />
            Optimal Timing Windows (Next 24 Hours)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {optimalTimes.map((slot, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Globe className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-white font-medium">{slot.time}</div>
                  <div className="text-xs text-gray-400">{slot.reasoning}</div>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-green-600/20 text-green-200 mb-1">
                  {slot.engagement}% engagement
                </Badge>
                <div className="text-xs text-gray-400">{slot.audience}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Viral Windows */}
      <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-400" />
            Peak Viral Windows
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {viralWindows.map((window, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-white font-medium">{window.type}</div>
                  <div className="text-sm text-purple-200">{window.window}</div>
                  <div className="text-xs text-gray-400">{window.description}</div>
                </div>
              </div>
              <Badge className="bg-yellow-600/20 text-yellow-200">
                {window.multiplier} viral boost
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Schedule Action */}
      <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-400/30">
        <CardContent className="p-6 text-center space-y-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Ready to Schedule?</h3>
            <p className="text-green-200">
              AI predicts {scheduleType === 'viral' ? '2.8x' : '1.9x'} engagement boost with {targetAudience === 'global' ? 'global' : 'targeted'} reach
            </p>
          </div>
          
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={scheduleMessage}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-3"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Schedule for Peak Impact
            </Button>
            <Button 
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-3"
            >
              <Target className="h-5 w-5 mr-2" />
              Save as Template
            </Button>
          </div>

          {/* Predicted Results */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/10">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {targetAudience === 'global' ? '15,000+' : '8,500+'}
              </div>
              <div className="text-xs text-gray-400">Estimated Reach</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {scheduleType === 'viral' ? '2.8x' : '1.9x'}
              </div>
              <div className="text-xs text-gray-400">Engagement Multiplier</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {campaignType === 'value' ? '0.089' : '0.067'} SOL
              </div>
              <div className="text-xs text-gray-400">Predicted Value</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}