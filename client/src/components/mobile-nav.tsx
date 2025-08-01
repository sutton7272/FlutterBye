import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
// import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  Home, 
  Coins, 
  ShoppingBag, 
  Wallet, 
  Activity, 
  Gift,
  Route,
  Trophy,
  Settings,
  MessageSquare
} from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Mint', href: '/mint', icon: Coins },
  { name: 'Portfolio', href: '/portfolio', icon: Wallet },
  { name: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
  { name: 'Activity', href: '/activity', icon: Activity },
  { name: 'Heat Map', href: '/heatmap', icon: Activity },
  { name: 'Rewards', href: '/rewards', icon: Trophy },
  { name: 'Journey', href: '/journey', icon: Route },
  { name: 'Free Codes', href: '/free-codes', icon: Gift },
  { name: 'SMS Integration', href: '/sms-integration', icon: MessageSquare },
  { name: 'How It Works', href: '/how-it-works', icon: Settings },
];

export function MobileNav() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const isMobile = useMobile();

  if (!isMobile) return null;

  // Simplified mobile nav without Sheet component for now
  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        onClick={() => setOpen(!open)}
        className="mr-2 px-0 text-base"
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      
      {open && (
        <div className="absolute top-16 left-0 right-0 bg-background border-b shadow-lg z-50 p-4">
        <MobileLink
          href="/"
          className="flex items-center"
          onOpenChange={setOpen}
        >
          <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Flutterbye
          </span>
        </MobileLink>
        <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-2">
            {navigation.map((item) => {
              const isActive = location === item.href;
              return (
                <MobileLink
                  key={item.href}
                  href={item.href}
                  onOpenChange={setOpen}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </MobileLink>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

interface MobileLinkProps {
  href: string;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  return (
    <Link
      href={href}
      onClick={() => {
        onOpenChange?.(false);
      }}
      className={className}
      {...props}
    >
      {children}
    </Link>
  );
}