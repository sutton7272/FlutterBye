import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
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
  MessageSquare,
  Award,
  Compass,
  Wrench
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Consolidated navigation for better UX
const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Create', href: '/mint', icon: Coins },
  { name: 'Explore', href: '/explore', icon: Compass, submenu: [
    { name: 'Marketplace', href: '/marketplace' },
    { name: 'Activity', href: '/activity' },
    { name: 'Heat Map', href: '/heatmap' }
  ]},
  { name: 'Portfolio', href: '/portfolio', icon: Wallet, submenu: [
    { name: 'Holdings', href: '/portfolio' },
    { name: 'Rewards', href: '/rewards' },
    { name: 'Journey', href: '/journey' }
  ]},
  { name: 'Tools', href: '/badges', icon: Wrench, submenu: [
    { name: 'Badge Studio', href: '/badges' },
    { name: 'SMS Integration', href: '/sms' },
    { name: 'Wallet Management', href: '/wallets' }
  ]},
  { name: 'Learn', href: '/how-it-works', icon: Settings, submenu: [
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Free Codes', href: '/free-codes' }
  ]}
];

export function MobileNav() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  const toggleSubmenu = (menuName: string) => {
    setExpandedMenu(expandedMenu === menuName ? null : menuName);
  };

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
        <div className="absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-lg border-b shadow-lg z-50 p-4 max-h-[80vh] overflow-y-auto">
          <Link href="/" onClick={() => setOpen(false)}>
            <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Flutterbye
            </span>
          </Link>
          <div className="my-4 pb-6">
            <div className="flex flex-col space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                
                if (item.submenu) {
                  return (
                    <div key={item.name}>
                      <button
                        onClick={() => toggleSubmenu(item.name)}
                        className="w-full flex items-center justify-between space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent text-left"
                      >
                        <div className="flex items-center space-x-2">
                          <Icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </div>
                        <span className="text-xs">
                          {expandedMenu === item.name ? '−' : '+'}
                        </span>
                      </button>
                      
                      {expandedMenu === item.name && (
                        <div className="ml-6 mt-1 space-y-1">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              onClick={() => setOpen(false)}
                              className={`block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent ${
                                location === subItem.href ? 'bg-primary/10 text-primary' : ''
                              }`}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent ${
                      isActive ? 'bg-primary/10 text-primary' : ''
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
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