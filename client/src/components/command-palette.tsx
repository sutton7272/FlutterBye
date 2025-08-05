import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useLocation } from "wouter";
import { 
  Search, 
  Hash, 
  User, 
  Settings, 
  BarChart3, 
  Coins, 
  MessageSquare, 
  Brain,
  Heart,
  Sparkles,
  Trophy,
  Activity,
  Star,
  Gift,
  Zap,
  Eye,
  ArrowRight
} from "lucide-react";

interface CommandItem {
  id: string;
  title: string;
  description: string;
  icon: any;
  action: () => void;
  category: string;
  shortcut?: string;
  badge?: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation();

  // Command palette shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navigateTo = useCallback((path: string) => {
    setLocation(path);
    setOpen(false);
  }, [setLocation]);

  const commandItems: CommandItem[] = [
    // Navigation Commands
    {
      id: "nav-dashboard",
      title: "Dashboard",
      description: "Go to main dashboard",
      icon: BarChart3,
      action: () => navigateTo("/dashboard"),
      category: "Navigation",
      shortcut: "⌘D"
    },
    {
      id: "nav-create",
      title: "Create Token",
      description: "Create a new token",
      icon: Coins,
      action: () => navigateTo("/create"),
      category: "Navigation",
      shortcut: "⌘N"
    },
    {
      id: "nav-flutterai",
      title: "FlutterAI",
      description: "AI intelligence platform",
      icon: Brain,
      action: () => navigateTo("/flutterai"),
      category: "Navigation",
      badge: "AI"
    },
    {
      id: "nav-flutter-wave",
      title: "FlutterWave",
      description: "AI butterfly messaging",
      icon: Heart,
      action: () => navigateTo("/flutter-wave"),
      category: "Navigation",
      badge: "NEW"
    },
    {
      id: "nav-flutter-art",
      title: "FlutterArt",
      description: "Digital art NFTs",
      icon: Sparkles,
      action: () => navigateTo("/flutter-art"),
      category: "Navigation"
    },
    {
      id: "nav-chat",
      title: "Chat",
      description: "Real-time blockchain chat",
      icon: MessageSquare,
      action: () => navigateTo("/chat"),
      category: "Navigation"
    },
    {
      id: "nav-trending",
      title: "Trending",
      description: "Viral content discovery",
      icon: Trophy,
      action: () => navigateTo("/trending"),
      category: "Navigation"
    },
    {
      id: "nav-intelligence",
      title: "Intelligence",
      description: "Advanced analytics dashboard",
      icon: Brain,
      action: () => navigateTo("/intelligence"),
      category: "Navigation"
    },
    {
      id: "nav-admin",
      title: "Admin Panel",
      description: "Platform management",
      icon: Settings,
      action: () => navigateTo("/admin"),
      category: "Navigation",
      shortcut: "⌘A"
    },
    
    // Search Commands
    {
      id: "search-wallets",
      title: "Search Wallets",
      description: "Find wallets by address or activity",
      icon: Search,
      action: () => navigateTo("/search?type=wallets"),
      category: "Search",
      shortcut: "⌘W"
    },
    {
      id: "search-tokens",
      title: "Search Tokens",
      description: "Find tokens and smart contracts",
      icon: Hash,
      action: () => navigateTo("/search?type=tokens"),
      category: "Search",
      shortcut: "⌘T"
    },
    {
      id: "search-transactions",
      title: "Search Transactions",
      description: "Find specific transactions",
      icon: Activity,
      action: () => navigateTo("/search?type=transactions"),
      category: "Search"
    },
    
    // Actions
    {
      id: "action-create-token",
      title: "Create New Token",
      description: "Mint a new SPL token",
      icon: Coins,
      action: () => navigateTo("/create"),
      category: "Actions",
      shortcut: "⌘⇧N"
    },
    {
      id: "action-ai-chat",
      title: "AI Assistant",
      description: "Chat with ARIA AI",
      icon: Brain,
      action: () => navigateTo("/ai-hub"),
      category: "Actions",
      shortcut: "⌘⇧A"
    },
    {
      id: "action-analyze-wallet",
      title: "Analyze Wallet",
      description: "Get AI-powered wallet insights",
      icon: Eye,
      action: () => navigateTo("/flutterai/analyze"),
      category: "Actions"
    },
    
    // Quick Actions
    {
      id: "quick-performance",
      title: "Performance Stats",
      description: "View system performance metrics",
      icon: Zap,
      action: () => navigateTo("/admin/performance"),
      category: "Quick Actions"
    },
    {
      id: "quick-recent-activity",
      title: "Recent Activity",
      description: "View latest platform activity",
      icon: Activity,
      action: () => navigateTo("/activity"),
      category: "Quick Actions"
    },
    {
      id: "quick-trending-tokens",
      title: "Trending Tokens",
      description: "See what's trending now",
      icon: Trophy,
      action: () => navigateTo("/trending"),
      category: "Quick Actions"
    }
  ];

  const filteredItems = commandItems.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 max-w-2xl border-0 shadow-2xl bg-background/95 backdrop-blur-xl">
        <Command className="border-0 shadow-none bg-transparent">
          <CommandInput
            placeholder="Search for anything... (try typing 'dashboard', 'create token', or 'AI')"
            value={query}
            onValueChange={setQuery}
            className="border-0 border-b border-border/50 rounded-none px-6 py-4 text-base focus:ring-0 bg-transparent"
          />
          
          <CommandList className="max-h-96 px-2 pb-2">
            <CommandEmpty className="py-8 text-center text-muted-foreground">
              <div className="flex flex-col items-center gap-3">
                <Search className="w-8 h-8 opacity-50" />
                <div>
                  <p className="font-medium">No results found</p>
                  <p className="text-sm">Try searching for pages, features, or actions</p>
                </div>
              </div>
            </CommandEmpty>
            
            {Object.entries(groupedItems).map(([category, items]) => (
              <CommandGroup key={category} heading={category} className="px-2">
                {items.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() => item.action()}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                      <item.icon className="w-4 h-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground truncate">
                          {item.title}
                        </span>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs px-1.5 py-0.5 h-5">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {item.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      {item.shortcut && (
                        <kbd className="px-2 py-1 text-xs bg-muted rounded border text-muted-foreground">
                          {item.shortcut}
                        </kbd>
                      )}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
          
          <div className="border-t border-border/50 px-4 py-3 bg-muted/30">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-background rounded border">⌘K</kbd>
                  <span>to open</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-background rounded border">↵</kbd>
                  <span>to select</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-background rounded border">ESC</kbd>
                  <span>to close</span>
                </div>
              </div>
              <div className="text-primary font-medium">
                {filteredItems.length} results
              </div>
            </div>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}