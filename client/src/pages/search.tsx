import { AdvancedSearch } from "@/components/advanced-search";
import { PerformanceDashboard } from "@/components/performance-dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Activity, 
  Brain,
  Zap
} from "lucide-react";

export default function SearchPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-electric-blue flex items-center justify-center">
          <Search className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Advanced Search & Analytics</h1>
          <p className="text-muted-foreground">
            AI-powered search with performance monitoring and optimization tools
          </p>
        </div>
      </div>

      <Tabs defaultValue="search" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Search
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          <AdvancedSearch />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <PerformanceDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}