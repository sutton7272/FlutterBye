import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Menu, 
  Search, 
  Bell, 
  User, 
  Settings, 
  Home, 
  BarChart3, 
  Wallet, 
  Activity,
  TrendingUp,
  Brain,
  Heart,
  MessageSquare,
  X,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Filter,
  SortDesc,
  Grid,
  List,
  Maximize2,
  Minimize2
} from "lucide-react";
import { useLocation } from "wouter";

interface MobileNavItem {
  id: string;
  label: string;
  icon: any;
  href: string;
  badge?: string;
}

const MOBILE_NAV_ITEMS: MobileNavItem[] = [
  { id: 'home', label: 'Home', icon: Home, href: '/' },
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, href: '/dashboard' },
  { id: 'create', label: 'Create', icon: Wallet, href: '/create' },
  { id: 'flutterai', label: 'FlutterAI', icon: Brain, href: '/flutterai', badge: 'AI' },
  { id: 'flutter-wave', label: 'FlutterWave', icon: Heart, href: '/flutter-wave', badge: 'NEW' },
  { id: 'chat', label: 'Chat', icon: MessageSquare, href: '/chat' },
  { id: 'trending', label: 'Trending', icon: TrendingUp, href: '/trending' },
  { id: 'activity', label: 'Activity', icon: Activity, href: '/activity' }
];

interface MobileResponsiveLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export function MobileResponsiveLayout({ 
  children, 
  title, 
  showBackButton = false, 
  onBack,
  rightAction 
}: MobileResponsiveLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [location] = useLocation();

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Touch gesture handling
  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = endX - startX;
      const diffY = endY - startY;

      // Swipe right to open sidebar (from left edge)
      if (diffX > 100 && Math.abs(diffY) < 100 && startX < 50) {
        setSidebarOpen(true);
      }
      
      // Swipe left to close sidebar
      if (diffX < -100 && Math.abs(diffY) < 100 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    if (isMobile) {
      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, sidebarOpen]);

  const currentNavItem = MOBILE_NAV_ITEMS.find(item => 
    location === item.href || (item.href !== '/' && location.startsWith(item.href))
  );

  if (!isMobile) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className={`min-h-screen bg-background ${isFullscreen ? 'overflow-hidden' : ''}`}>
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-xl">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            {showBackButton ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            ) : (
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <MobileSidebar onNavigate={() => setSidebarOpen(false)} />
                </SheetContent>
              </Sheet>
            )}
            
            <div>
              <h1 className="font-semibold text-lg truncate">
                {title || currentNavItem?.label || 'Flutterbye'}
              </h1>
              {currentNavItem?.badge && (
                <Badge variant="secondary" className="text-xs ml-2">
                  {currentNavItem.badge}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {rightAction}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="h-8 w-8 p-0"
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`pb-16 ${isFullscreen ? 'h-[calc(100vh-3.5rem)] overflow-auto' : ''}`}>
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      {!isFullscreen && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/95 backdrop-blur-xl">
          <div className="grid grid-cols-5 h-16">
            {MOBILE_NAV_ITEMS.slice(0, 5).map((item) => {
              const IconComponent = item.icon;
              const isActive = location === item.href || 
                              (item.href !== '/' && location.startsWith(item.href));
              
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                    isActive 
                      ? 'text-primary bg-primary/10' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="relative">
                    <IconComponent className="h-5 w-5" />
                    {item.badge && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                  <span className="text-xs font-medium truncate max-w-[60px]">
                    {item.label}
                  </span>
                </a>
              );
            })}
          </div>
        </nav>
      )}

      {/* Swipe Indicator */}
      {!sidebarOpen && (
        <div className="fixed left-0 top-1/2 -translate-y-1/2 w-1 h-16 bg-primary/30 rounded-r-full opacity-50 z-40" />
      )}
    </div>
  );
}

function MobileSidebar({ onNavigate }: { onNavigate: () => void }) {
  const [location, setLocation] = useLocation();

  const handleNavigation = (href: string) => {
    setLocation(href);
    onNavigate();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">FB</span>
          </div>
          <div>
            <h2 className="font-semibold text-lg">Flutterbye</h2>
            <p className="text-sm text-muted-foreground">Intelligence Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-4 space-y-2">
        {MOBILE_NAV_ITEMS.map((item) => {
          const IconComponent = item.icon;
          const isActive = location === item.href || 
                          (item.href !== '/' && location.startsWith(item.href));
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.href)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                isActive 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
              }`}
            >
              <IconComponent className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <Badge variant="secondary" className="text-xs ml-auto">
                  {item.badge}
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-border/50 space-y-2">
        <button
          onClick={() => handleNavigation('/settings')}
          className="w-full flex items-center gap-3 p-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <Settings className="h-5 w-5" />
          <span className="font-medium">Settings</span>
        </button>
        
        <button
          onClick={() => handleNavigation('/profile')}
          className="w-full flex items-center gap-3 p-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <User className="h-5 w-5" />
          <span className="font-medium">Profile</span>
        </button>
      </div>
    </div>
  );
}

// Mobile-optimized card component
export function MobileCard({ 
  children, 
  title, 
  description, 
  action,
  className = ""
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={`bg-background/50 border-border/50 ${className}`}>
      {(title || description || action) && (
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              {title && <CardTitle className="text-base">{title}</CardTitle>}
              {description && (
                <CardDescription className="text-sm">{description}</CardDescription>
              )}
            </div>
            {action && <div className="ml-3">{action}</div>}
          </div>
        </CardHeader>
      )}
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
}

// Mobile-optimized data list
export function MobileDataList({ 
  items, 
  renderItem 
}: {
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
}) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  return (
    <div className="space-y-4">
      {/* View Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <SortDesc className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Items */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-3'}>
        {items.map((item, index) => renderItem(item, index))}
      </div>
    </div>
  );
}

// Touch-optimized input component
export function MobileTouchInput({ 
  placeholder, 
  value, 
  onChange, 
  onSubmit,
  rightIcon
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  rightIcon?: React.ReactNode;
}) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit?.()}
        placeholder={placeholder}
        className="w-full h-12 px-4 pr-12 rounded-lg border border-border/50 bg-background/50 text-base focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
      />
      {rightIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {rightIcon}
        </div>
      )}
    </div>
  );
}