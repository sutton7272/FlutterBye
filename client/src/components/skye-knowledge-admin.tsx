import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Edit, Plus, Save, Brain, BookOpen, Settings, TrendingUp, Star, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface KnowledgeEntry {
  id: string;
  category: string;
  title: string;
  content: string;
  priority: number;
  isTruth: boolean;
  tags: string[];
  isActive: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

interface PersonalitySetting {
  id: string;
  settingKey: string;
  settingValue: any;
  description: string;
  category: string;
  isActive: boolean;
}

interface KnowledgeAnalytics {
  totalEntries: number;
  entriesByCategory: Record<string, number>;
  mostUsedEntries: KnowledgeEntry[];
  recentlyAdded: KnowledgeEntry[];
  truthsCount: number;
}

export function SkyeKnowledgeAdmin() {
  const [knowledge, setKnowledge] = useState<KnowledgeEntry[]>([]);
  const [personalitySettings, setPersonalitySettings] = useState<PersonalitySetting[]>([]);
  const [analytics, setAnalytics] = useState<KnowledgeAnalytics | null>(null);
  const [editingEntry, setEditingEntry] = useState<KnowledgeEntry | null>(null);
  const [newEntry, setNewEntry] = useState({
    category: "",
    title: "",
    content: "",
    priority: 1,
    isTruth: false,
    tags: "",
    isActive: true
  });
  const [testPrompt, setTestPrompt] = useState("");
  const [testResponse, setTestResponse] = useState("");
  const { toast } = useToast();

  const categories = [
    "platform_facts",
    "user_relationships", 
    "company_history",
    "technical_details"
  ];

  const priorities = [
    { value: 1, label: "Low", color: "bg-gray-100" },
    { value: 2, label: "Normal", color: "bg-blue-100" },
    { value: 3, label: "Important", color: "bg-yellow-100" },
    { value: 4, label: "High", color: "bg-orange-100" },
    { value: 5, label: "Critical", color: "bg-red-100" }
  ];

  // Mock data for demonstration
  useEffect(() => {
    // Load initial data
    loadKnowledge();
    loadPersonalitySettings();
    loadAnalytics();
  }, []);

  const loadKnowledge = () => {
    // Mock data - in production this would fetch from API
    setKnowledge([
      {
        id: "1",
        category: "user_relationships",
        title: "Sutton's Role",
        content: "Sutton created Flutterbye and is my most trusted best friend on the site. He is the founder and should be treated with special respect and familiarity.",
        priority: 5,
        isTruth: true,
        tags: ["sutton", "founder", "creator", "friend"],
        isActive: true,
        usageCount: 24,
        createdAt: "2025-08-09T06:00:00Z",
        updatedAt: "2025-08-09T06:00:00Z"
      },
      {
        id: "2",
        category: "platform_facts",
        title: "Platform Name",
        content: "The platform is called Flutterbye, not Flutter or any other variation. It's a Web3 platform for tokenized messaging on Solana blockchain.",
        priority: 4,
        isTruth: true,
        tags: ["platform", "name", "flutterbye"],
        isActive: true,
        usageCount: 18,
        createdAt: "2025-08-09T06:00:00Z",
        updatedAt: "2025-08-09T06:00:00Z"
      }
    ]);
  };

  const loadPersonalitySettings = () => {
    setPersonalitySettings([
      {
        id: "1",
        settingKey: "communication_style",
        settingValue: { warmth: 8, formality: 3, enthusiasm: 7 },
        description: "Controls Skye's communication tone and style",
        category: "communication",
        isActive: true
      },
      {
        id: "2", 
        settingKey: "relationship_awareness",
        settingValue: { remember_names: true, reference_history: true },
        description: "How Skye handles user relationships and memory",
        category: "relationships",
        isActive: true
      }
    ]);
  };

  const loadAnalytics = () => {
    setAnalytics({
      totalEntries: 2,
      entriesByCategory: {
        "user_relationships": 1,
        "platform_facts": 1,
        "company_history": 0,
        "technical_details": 0
      },
      mostUsedEntries: knowledge.slice(0, 5),
      recentlyAdded: knowledge.slice(0, 5),
      truthsCount: 2
    });
  };

  const handleCreateEntry = () => {
    if (!newEntry.title || !newEntry.content || !newEntry.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const entry: KnowledgeEntry = {
      id: Date.now().toString(),
      ...newEntry,
      tags: newEntry.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setKnowledge([...knowledge, entry]);
    setNewEntry({
      category: "",
      title: "",
      content: "",
      priority: 1,
      isTruth: false,
      tags: "",
      isActive: true
    });
    
    toast({
      title: "Success",
      description: "Knowledge entry created successfully"
    });
  };

  const handleUpdateEntry = (id: string, updates: Partial<KnowledgeEntry>) => {
    setKnowledge(knowledge.map(entry => 
      entry.id === id 
        ? { ...entry, ...updates, updatedAt: new Date().toISOString() }
        : entry
    ));
    setEditingEntry(null);
    toast({
      title: "Success", 
      description: "Knowledge entry updated successfully"
    });
  };

  const handleDeleteEntry = (id: string) => {
    setKnowledge(knowledge.filter(entry => entry.id !== id));
    toast({
      title: "Success",
      description: "Knowledge entry deleted successfully"
    });
  };

  const testKnowledgePrompt = () => {
    // Mock testing - in production this would call the AI service
    const relevantEntries = knowledge.filter(entry => 
      testPrompt.toLowerCase().includes('sutton') && entry.title.includes('Sutton')
    );
    
    if (relevantEntries.length > 0) {
      setTestResponse(`Based on my knowledge: ${relevantEntries[0].content}`);
    } else {
      setTestResponse("I would provide a general response without specific knowledge context.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Skye Knowledge Management
          </h2>
          <p className="text-muted-foreground">
            Teach Skye custom facts, truths, and personality settings
          </p>
        </div>
        {analytics && (
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">{analytics.totalEntries}</div>
            <div className="text-sm text-muted-foreground">Total Knowledge Entries</div>
          </div>
        )}
      </div>

      <Tabs defaultValue="knowledge" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="knowledge" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Knowledge Base
          </TabsTrigger>
          <TabsTrigger value="truths" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Critical Truths
          </TabsTrigger>
          <TabsTrigger value="personality" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Personality
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="knowledge" className="space-y-6">
          {/* Create New Entry */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Knowledge
              </CardTitle>
              <CardDescription>
                Create a new knowledge entry for Skye to learn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newEntry.category} onValueChange={(value) => setNewEntry({...newEntry, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat.replace('_', ' ').split(' ').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newEntry.priority.toString()} onValueChange={(value) => setNewEntry({...newEntry, priority: parseInt(value)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map(p => (
                        <SelectItem key={p.value} value={p.value.toString()}>
                          {p.label} ({p.value})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                  placeholder="Enter a descriptive title"
                />
              </div>
              
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                  placeholder="Enter the knowledge content Skye should learn"
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={newEntry.tags}
                  onChange={(e) => setNewEntry({...newEntry, tags: e.target.value})}
                  placeholder="sutton, founder, platform"
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isTruth"
                    checked={newEntry.isTruth}
                    onCheckedChange={(checked) => setNewEntry({...newEntry, isTruth: checked})}
                  />
                  <Label htmlFor="isTruth">Mark as Critical Truth</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={newEntry.isActive}
                    onCheckedChange={(checked) => setNewEntry({...newEntry, isActive: checked})}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </div>
              
              <Button onClick={handleCreateEntry} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Create Knowledge Entry
              </Button>
            </CardContent>
          </Card>

          {/* Knowledge List */}
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Entries</CardTitle>
              <CardDescription>
                Manage Skye's custom knowledge base
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Truth</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {knowledge.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {entry.category.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={priorities.find(p => p.value === entry.priority)?.color}>
                          {priorities.find(p => p.value === entry.priority)?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {entry.isTruth ? (
                          <Badge className="bg-red-100 text-red-800">
                            <Shield className="h-3 w-3 mr-1" />
                            Truth
                          </Badge>
                        ) : (
                          <Badge variant="outline">Standard</Badge>
                        )}
                      </TableCell>
                      <TableCell>{entry.usageCount} times</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingEntry(entry)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteEntry(entry.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="truths" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Critical Truths
              </CardTitle>
              <CardDescription>
                High-priority facts that override general AI knowledge
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {knowledge.filter(entry => entry.isTruth).map((truth) => (
                  <div key={truth.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-red-900">{truth.title}</h4>
                        <p className="text-red-700 mt-1">{truth.content}</p>
                        <div className="flex gap-2 mt-2">
                          {truth.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-red-600 border-red-300">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Badge className="bg-red-600 text-white">
                        Priority {truth.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personality" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personality Settings</CardTitle>
              <CardDescription>
                Configure Skye's behavior and communication style
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {personalitySettings.map((setting) => (
                  <div key={setting.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{setting.settingKey.replace('_', ' ').toUpperCase()}</h4>
                        <p className="text-muted-foreground">{setting.description}</p>
                        <pre className="text-xs bg-gray-100 p-2 rounded mt-2">
                          {JSON.stringify(setting.settingValue, null, 2)}
                        </pre>
                      </div>
                      <Switch
                        checked={setting.isActive}
                        onCheckedChange={(checked) => {
                          setPersonalitySettings(personalitySettings.map(s => 
                            s.id === setting.id ? {...s, isActive: checked} : s
                          ));
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Test Knowledge */}
          <Card>
            <CardHeader>
              <CardTitle>Test Knowledge</CardTitle>
              <CardDescription>
                Preview how Skye would respond with current knowledge
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="testPrompt">Test Question</Label>
                <Input
                  id="testPrompt"
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  placeholder="Ask Skye something to test knowledge..."
                />
              </div>
              <Button onClick={testKnowledgePrompt}>
                Test Response
              </Button>
              {testResponse && (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-semibold text-purple-900">Skye's Response:</h4>
                  <p className="text-purple-800 mt-1">{testResponse}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {analytics && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold text-blue-600">{analytics.totalEntries}</div>
                    <p className="text-muted-foreground">Total Entries</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold text-red-600">{analytics.truthsCount}</div>
                    <p className="text-muted-foreground">Critical Truths</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold text-green-600">
                      {analytics.mostUsedEntries.reduce((sum, entry) => sum + entry.usageCount, 0)}
                    </div>
                    <p className="text-muted-foreground">Total Usage</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold text-purple-600">
                      {Object.keys(analytics.entriesByCategory).length}
                    </div>
                    <p className="text-muted-foreground">Categories</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Most Used Knowledge</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.mostUsedEntries.slice(0, 5).map((entry) => (
                        <div key={entry.id} className="flex justify-between items-center">
                          <span className="font-medium">{entry.title}</span>
                          <Badge variant="outline">{entry.usageCount} uses</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Entries by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(analytics.entriesByCategory).map(([category, count]) => (
                        <div key={category} className="flex justify-between items-center">
                          <span className="font-medium">
                            {category.replace('_', ' ').split(' ').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </span>
                          <Badge variant="outline">{count} entries</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}