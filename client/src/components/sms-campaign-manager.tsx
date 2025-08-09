import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Send, 
  Clock, 
  Target, 
  BarChart3, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  Calendar,
  Smartphone,
  Zap,
  TrendingUp,
  Heart,
  Globe
} from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  message: string;
  emotionType: string;
  targetAudience: string;
  scheduledDate?: string;
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused';
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  viralScore: number;
  estimatedReach: number;
  createdAt: string;
}

interface Contact {
  id: string;
  phoneNumber: string;
  name?: string;
  tags: string[];
  lastContact?: string;
  engagementScore: number;
}

export function SMSCampaignManager() {
  const [activeTab, setActiveTab] = useState("campaigns");
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    message: "",
    emotionType: "love",
    targetAudience: "all",
    scheduledDate: ""
  });
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newContact, setNewContact] = useState({ phoneNumber: "", name: "", tags: "" });
  const { toast } = useToast();

  // Fetch campaigns
  const { data: campaigns = [], refetch: refetchCampaigns } = useQuery({
    queryKey: ["/api/sms/campaigns"],
    refetchInterval: 30000
  });

  // Create campaign mutation
  const createCampaignMutation = useMutation({
    mutationFn: async (campaignData: any) => {
      const response = await fetch("/api/sms/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaignData),
      });
      if (!response.ok) throw new Error("Failed to create campaign");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Campaign Created!", description: "Your SMS campaign has been created successfully." });
      setIsCreating(false);
      setNewCampaign({ name: "", message: "", emotionType: "love", targetAudience: "all", scheduledDate: "" });
      refetchCampaigns();
    }
  });

  // Launch campaign mutation
  const launchCampaignMutation = useMutation({
    mutationFn: async (campaignId: string) => {
      const response = await fetch(`/api/sms/campaigns/${campaignId}/launch`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to launch campaign");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Campaign Launched!", description: "SMS messages are being sent to recipients." });
      refetchCampaigns();
    }
  });

  // Add contact mutation
  const addContactMutation = useMutation({
    mutationFn: async (contactData: any) => {
      const response = await fetch("/api/sms/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...contactData,
          tags: contactData.tags.split(",").map((tag: string) => tag.trim()).filter(Boolean)
        }),
      });
      if (!response.ok) throw new Error("Failed to add contact");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Contact Added!", description: "New contact has been added to your list." });
      setNewContact({ phoneNumber: "", name: "", tags: "" });
      // Refresh contacts list
    }
  });

  const emotionTypes = [
    { value: "love", label: "Love 💕", color: "text-pink-400" },
    { value: "joy", label: "Joy 🎉", color: "text-yellow-400" },
    { value: "gratitude", label: "Gratitude 🙏", color: "text-green-400" },
    { value: "support", label: "Support 💪", color: "text-blue-400" },
    { value: "motivation", label: "Motivation 🔥", color: "text-red-400" },
    { value: "celebration", label: "Celebration 🎊", color: "text-purple-400" }
  ];

  const targetAudiences = [
    { value: "all", label: "All Contacts" },
    { value: "high_engagement", label: "High Engagement" },
    { value: "recent_activity", label: "Recent Activity" },
    { value: "new_contacts", label: "New Contacts" },
    { value: "custom", label: "Custom Segment" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">SMS Campaign Manager</h2>
          <p className="text-gray-400">Create, manage, and track your emotional SMS campaigns</p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="campaigns" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Contacts
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          {/* Campaign Creation Modal */}
          {isCreating && (
            <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="h-5 w-5 text-purple-400" />
                  Create New SMS Campaign
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Design your emotional messaging campaign with AI optimization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-white">Campaign Name</Label>
                      <Input
                        value={newCampaign.name}
                        onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Valentine's Day Love Messages"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-white">Message</Label>
                      <Textarea
                        value={newCampaign.message}
                        onChange={(e) => setNewCampaign(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Your heartfelt message here..."
                        className="bg-white/10 border-white/20 text-white h-24"
                        maxLength={160}
                      />
                      <div className="text-xs text-gray-400 mt-1">
                        {newCampaign.message.length}/160 characters
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-white">Emotion Type</Label>
                      <Select value={newCampaign.emotionType} onValueChange={(value) => setNewCampaign(prev => ({ ...prev, emotionType: value }))}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {emotionTypes.map(emotion => (
                            <SelectItem key={emotion.value} value={emotion.value}>
                              <span className={emotion.color}>{emotion.label}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-white">Target Audience</Label>
                      <Select value={newCampaign.targetAudience} onValueChange={(value) => setNewCampaign(prev => ({ ...prev, targetAudience: value }))}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {targetAudiences.map(audience => (
                            <SelectItem key={audience.value} value={audience.value}>
                              {audience.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-white">Schedule (Optional)</Label>
                      <Input
                        type="datetime-local"
                        value={newCampaign.scheduledDate}
                        onChange={(e) => setNewCampaign(prev => ({ ...prev, scheduledDate: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <Button
                    onClick={() => createCampaignMutation.mutate(newCampaign)}
                    disabled={!newCampaign.name || !newCampaign.message || createCampaignMutation.isPending}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {createCampaignMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Create Campaign
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreating(false)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Campaigns List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign: Campaign) => (
              <Card key={campaign.id} className="bg-black/40 backdrop-blur-sm border-gray-500/30 hover:border-purple-500/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg">{campaign.name}</CardTitle>
                    <Badge className={
                      campaign.status === 'active' ? 'bg-green-600/20 text-green-200' :
                      campaign.status === 'scheduled' ? 'bg-blue-600/20 text-blue-200' :
                      campaign.status === 'completed' ? 'bg-purple-600/20 text-purple-200' :
                      'bg-gray-600/20 text-gray-200'
                    }>
                      {campaign.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-300 line-clamp-2">
                    {campaign.message}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Recipients</div>
                      <div className="text-white font-semibold">{campaign.totalRecipients}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Viral Score</div>
                      <div className="text-purple-400 font-semibold">{campaign.viralScore}%</div>
                    </div>
                  </div>

                  {campaign.status === 'active' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white">{campaign.sentCount}/{campaign.totalRecipients}</span>
                      </div>
                      <Progress value={(campaign.sentCount / campaign.totalRecipients) * 100} className="h-2" />
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    {campaign.status === 'draft' && (
                      <Button
                        size="sm"
                        onClick={() => launchCampaignMutation.mutate(campaign.id)}
                        disabled={launchCampaignMutation.isPending}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Launch
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-500/30 text-red-300 hover:bg-red-500/10">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          {/* Add Contact Form */}
          <Card className="bg-black/40 backdrop-blur-sm border-green-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-green-400" />
                Add New Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Phone Number"
                  value={newContact.phoneNumber}
                  onChange={(e) => setNewContact(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white"
                />
                <Input
                  placeholder="Name (Optional)"
                  value={newContact.name}
                  onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white"
                />
                <Input
                  placeholder="Tags (comma-separated)"
                  value={newContact.tags}
                  onChange={(e) => setNewContact(prev => ({ ...prev, tags: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white"
                />
                <Button
                  onClick={() => addContactMutation.mutate(newContact)}
                  disabled={!newContact.phoneNumber || addContactMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contacts List Placeholder */}
          <Card className="bg-black/40 backdrop-blur-sm border-gray-500/30">
            <CardHeader>
              <CardTitle className="text-white">Contact List</CardTitle>
              <CardDescription className="text-gray-300">
                Manage your SMS contact database with segmentation and engagement tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Smartphone className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Contacts Yet</h3>
                <p className="text-gray-400">Add contacts to start building your SMS campaigns</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card className="bg-black/40 backdrop-blur-sm border-yellow-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Heart className="h-5 w-5 text-yellow-400" />
                Message Templates Library
              </CardTitle>
              <CardDescription className="text-yellow-200">
                Pre-built emotional message templates with proven viral potential
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Heart className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Template Library Coming Soon</h3>
                <p className="text-gray-400">Curated emotional message templates will be available here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-400" />
                Campaign Analytics Dashboard
              </CardTitle>
              <CardDescription className="text-blue-200">
                Track performance, engagement, and viral spread of your SMS campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Analytics Dashboard Coming Soon</h3>
                <p className="text-gray-400">Detailed campaign analytics will be available here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}