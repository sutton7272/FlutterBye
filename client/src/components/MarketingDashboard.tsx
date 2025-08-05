import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { BarChart, Users, Mail, Activity, TrendingUp, Phone, MessageSquare } from "lucide-react";

interface MarketingInsights {
  totalUsers: number;
  activeUsers: number;
  poolCustomers: number;
  customerSegments: Record<string, number>;
  communicationPreferences: Record<string, number>;
  timestamp: string;
}

interface UserActivity {
  id: number;
  userId: number;
  action: string;
  details: string;
  timestamp: string;
  sessionId: string;
  flutterboyeTracked: boolean;
}

interface CommunicationLog {
  id: number;
  userId: number;
  type: string;
  subject: string;
  content: string;
  campaignId: string;
  sentAt: string;
  opened: boolean;
  clicked: boolean;
  responded: boolean;
}

export function MarketingDashboard() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const { data: insights, isLoading: insightsLoading } = useQuery<MarketingInsights>({
    queryKey: ["/api/marketing/insights"],
  });

  const { data: userActivities } = useQuery<UserActivity[]>({
    queryKey: ["/api/marketing/user", selectedUserId, "activities"],
    enabled: !!selectedUserId,
  });

  const { data: communications } = useQuery<CommunicationLog[]>({
    queryKey: ["/api/marketing/user", selectedUserId, "communications"],
    enabled: !!selectedUserId,
  });

  if (insightsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading marketing insights...</p>
        </div>
      </div>
    );
  }

  const totalSegments = Object.values(insights?.customerSegments || {}).reduce((a, b) => a + b, 0);
  const totalContactMethods = Object.values(insights?.communicationPreferences || {}).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Marketing Dashboard</h2>
          <p className="text-gray-600">Comprehensive pool customer data and engagement insights</p>
        </div>
        <Badge variant="outline" className="text-sm">
          Last updated: {insights?.timestamp ? new Date(insights.timestamp).toLocaleString() : 'Never'}
        </Badge>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Registered pool customers and cleaners
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pool Customers</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights?.poolCustomers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Pool sharks ready for marketing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights?.activeUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Currently active accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marketing Reach</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(((insights?.poolCustomers || 0) / (insights?.totalUsers || 1)) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Pool customers vs total users
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="segments" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="segments">Customer Segments</TabsTrigger>
          <TabsTrigger value="communication">Communication Preferences</TabsTrigger>
          <TabsTrigger value="activities">Recent Activities</TabsTrigger>
          <TabsTrigger value="campaigns">Communication Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="segments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Customer Segments Distribution
              </CardTitle>
              <CardDescription>
                How pool customers are categorized for targeted marketing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(insights?.customerSegments || {}).map(([segment, count]) => (
                  <div key={segment} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="capitalize font-medium">{segment.replace('_', ' ')}</span>
                      <span className="text-sm text-muted-foreground">
                        {count} users ({Math.round((count / totalSegments) * 100)}%)
                      </span>
                    </div>
                    <Progress value={(count / totalSegments) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Communication Method Preferences
              </CardTitle>
              <CardDescription>
                How pool customers prefer to be contacted for marketing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(insights?.communicationPreferences || {}).map(([method, count]) => (
                  <div key={method} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {method === 'email' && <Mail className="h-4 w-4" />}
                        {method === 'phone' && <Phone className="h-4 w-4" />}
                        {method === 'sms' && <MessageSquare className="h-4 w-4" />}
                        <span className="capitalize font-medium">{method}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {count} users ({Math.round((count / totalContactMethods) * 100)}%)
                      </span>
                    </div>
                    <Progress value={(count / totalContactMethods) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Activity Tracking</CardTitle>
              <CardDescription>
                Select a user ID to view their detailed activity log
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <input
                  type="number"
                  placeholder="Enter User ID"
                  className="px-3 py-2 border rounded-md"
                  onChange={(e) => setSelectedUserId(e.target.value ? parseInt(e.target.value) : null)}
                />
                <Button variant="outline">Load Activities</Button>
              </div>

              {userActivities && (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Action</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Flutterbye Tracked</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userActivities.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell className="font-medium">
                            {activity.action.replace('_', ' ').toUpperCase()}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-muted-foreground max-w-xs truncate">
                              {activity.details}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(activity.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={activity.flutterboyeTracked ? "default" : "secondary"}>
                              {activity.flutterboyeTracked ? "Yes" : "No"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Communication History</CardTitle>
              <CardDescription>
                Marketing communications sent to customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {communications && (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Campaign</TableHead>
                        <TableHead>Sent</TableHead>
                        <TableHead>Engagement</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {communications.map((comm) => (
                        <TableRow key={comm.id}>
                          <TableCell>
                            <Badge variant="outline">{comm.type.toUpperCase()}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {comm.subject}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {comm.campaignId}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(comm.sentAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {comm.opened && <Badge variant="default" className="text-xs">Opened</Badge>}
                              {comm.clicked && <Badge variant="default" className="text-xs">Clicked</Badge>}
                              {comm.responded && <Badge variant="default" className="text-xs">Responded</Badge>}
                              {!comm.opened && !comm.clicked && !comm.responded && (
                                <Badge variant="secondary" className="text-xs">No engagement</Badge>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}