import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Plus, 
  Coins, 
  TrendingUp, 
  MessageSquare, 
  X, 
  Zap,
  Heart,
  Building2,
  HelpCircle,
  Settings
} from "lucide-react";

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  isPopular?: boolean;
}

const quickActions: QuickAction[] = [
  {
    id: 'mint',
    label: 'Create Token',
    description: 'Turn your message into a valuable token',
    icon: <Coins className="h-5 w-5" />,
    href: '/mint',
    color: 'from-electric-blue to-blue-600',
    isPopular: true
  },
  {
    id: 'marketplace',
    label: 'Browse Market',
    description: 'Discover and trade tokenized messages',
    icon: <TrendingUp className="h-5 w-5" />,
    href: '/marketplace',
    color: 'from-electric-green to-green-600'
  },
  {
    id: 'chat',
    label: 'Join Chat',
    description: 'Connect with the community',
    icon: <MessageSquare className="h-5 w-5" />,
    href: '/chat',
    color: 'from-purple-500 to-purple-700'
  },
  {
    id: 'cards',
    label: 'Send Card',
    description: 'Create beautiful greeting cards',
    icon: <Heart className="h-5 w-5" />,
    href: '/greeting-cards',
    color: 'from-pink-500 to-pink-700'
  },
  {
    id: 'enterprise',
    label: 'Marketing',
    description: 'Launch viral campaigns',
    icon: <Building2 className="h-5 w-5" />,
    href: '/enterprise',
    color: 'from-orange-500 to-orange-700'
  },
  {
    id: 'help',
    label: 'Get Help',
    description: 'Learn how Flutterbye works',
    icon: <HelpCircle className="h-5 w-5" />,
    href: '/info',
    color: 'from-gray-500 to-gray-700'
  }
];

interface QuickActionsFABProps {
  className?: string;
}

export function QuickActionsFAB({ className = "" }: QuickActionsFABProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className={`fixed bottom-6 right-6 z-40 ${className}`}>
      {/* Quick Actions Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-4">
          <Card className="bg-gray-900/95 border-gray-700 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-4 space-y-2 w-72">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white">Quick Actions</h3>
                <Badge variant="outline" className="text-xs text-electric-blue border-electric-blue/30">
                  Choose what to do next
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {quickActions.map((action) => (
                  <Link key={action.id} href={action.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-auto p-3 text-left hover:bg-gray-800/50 relative"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color}`}>
                          {action.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{action.label}</span>
                            {action.isPopular && (
                              <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-400/30">
                                Popular
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mt-1">{action.description}</p>
                        </div>
                      </div>
                    </Button>
                  </Link>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="border-t border-gray-700 pt-3 mt-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-electric-blue">2.4k</div>
                    <div className="text-xs text-gray-400">Active Users</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-electric-green">847</div>
                    <div className="text-xs text-gray-400">Tokens Today</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* FAB Button */}
      <Button
        onClick={toggleOpen}
        size="lg"
        className={`h-14 w-14 rounded-full shadow-2xl transition-all duration-300 ${
          isOpen 
            ? 'bg-gray-700 hover:bg-gray-600 rotate-45' 
            : 'bg-gradient-to-r from-electric-blue to-electric-green hover:opacity-90 hover:scale-110'
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Plus className="h-6 w-6" />
        )}
      </Button>

      {/* Pulse animation when closed */}
      {!isOpen && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-electric-blue to-electric-green opacity-20 animate-ping" />
      )}
    </div>
  );
}

// Mini FAB for specific contexts
interface MiniQuickActionProps {
  action: 'mint' | 'marketplace' | 'chat';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
}

export function MiniQuickAction({ action, position = 'bottom-right', className = "" }: MiniQuickActionProps) {
  const getActionData = () => {
    const actionData = quickActions.find(a => a.id === action);
    return actionData || quickActions[0];
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left': return 'bottom-4 left-4';
      case 'top-right': return 'top-4 right-4';
      case 'top-left': return 'top-4 left-4';
      default: return 'bottom-4 right-4';
    }
  };

  const actionData = getActionData();

  return (
    <div className={`fixed ${getPositionClasses()} z-30 ${className}`}>
      <Link href={actionData.href}>
        <Button
          size="lg"
          className={`h-12 w-12 rounded-full shadow-lg bg-gradient-to-r ${actionData.color} hover:opacity-90 hover:scale-110 transition-all duration-300`}
          title={actionData.label}
        >
          {actionData.icon}
        </Button>
      </Link>
    </div>
  );
}

// Context-aware FAB that shows different actions based on current page
interface SmartFABProps {
  currentPage?: string;
  className?: string;
}

export function SmartFAB({ currentPage, className = "" }: SmartFABProps) {
  const getContextualActions = () => {
    switch (currentPage) {
      case '/mint':
        return quickActions.filter(a => ['marketplace', 'chat', 'help'].includes(a.id));
      case '/marketplace':
        return quickActions.filter(a => ['mint', 'chat', 'cards'].includes(a.id));
      case '/chat':
        return quickActions.filter(a => ['mint', 'marketplace', 'cards'].includes(a.id));
      default:
        return quickActions.slice(0, 4); // Show top 4 actions
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const contextualActions = getContextualActions();

  return (
    <div className={`fixed bottom-6 right-6 z-40 ${className}`}>
      {/* Contextual Actions */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-4">
          <div className="flex flex-col gap-2">
            {contextualActions.map((action, index) => (
              <Link key={action.id} href={action.href}>
                <Button
                  size="lg"
                  className={`h-12 w-12 rounded-full shadow-lg bg-gradient-to-r ${action.color} hover:opacity-90 transition-all duration-300`}
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.3s ease-out forwards'
                  }}
                  title={action.label}
                  onClick={() => setIsOpen(false)}
                >
                  {action.icon}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Main FAB */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="lg"
        className={`h-14 w-14 rounded-full shadow-2xl transition-all duration-300 ${
          isOpen 
            ? 'bg-gray-700 hover:bg-gray-600 rotate-45' 
            : 'bg-gradient-to-r from-electric-blue to-electric-green hover:opacity-90 hover:scale-110'
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Zap className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
}