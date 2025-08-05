import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Sun, Moon, Monitor, Palette } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const getThemeIcon = () => {
    switch (theme) {
      case "light": return <Sun className="h-4 w-4" />;
      case "dark": return <Moon className="h-4 w-4" />;
      case "system": return <Monitor className="h-4 w-4" />;
      default: return <Palette className="h-4 w-4" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-9 h-9 p-0 hover:bg-muted/50 transition-colors"
        >
          {getThemeIcon()}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Sun className="h-4 w-4" />
          <span>Light</span>
          {theme === "light" && (
            <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Moon className="h-4 w-4" />
          <span>Dark</span>
          {theme === "dark" && (
            <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Monitor className="h-4 w-4" />
          <span>System</span>
          {theme === "system" && (
            <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Simple theme toggle button for mobile
export function SimpleThemeToggle() {
  const { toggleTheme, resolvedTheme } = useTheme();

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleTheme}
      className="w-9 h-9 p-0 hover:bg-muted/50 transition-colors"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

// Theme selection card for settings page
export function ThemeSelectionCard() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const themes = [
    {
      id: "light" as const,
      name: "Light",
      description: "Clean and bright interface",
      icon: Sun,
      preview: "bg-white border-gray-200 text-gray-900"
    },
    {
      id: "dark" as const,
      name: "Dark",
      description: "Easy on the eyes in low light",
      icon: Moon,
      preview: "bg-gray-900 border-gray-700 text-white"
    },
    {
      id: "system" as const,
      name: "System",
      description: "Adapts to your device settings",
      icon: Monitor,
      preview: resolvedTheme === "dark" 
        ? "bg-gray-900 border-gray-700 text-white" 
        : "bg-white border-gray-200 text-gray-900"
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Theme Preference</h3>
        <p className="text-sm text-muted-foreground">
          Choose your preferred color scheme for the interface
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {themes.map((themeOption) => {
          const IconComponent = themeOption.icon;
          const isSelected = theme === themeOption.id;
          
          return (
            <button
              key={themeOption.id}
              onClick={() => setTheme(themeOption.id)}
              className={`relative p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                isSelected 
                  ? "border-primary bg-primary/10" 
                  : "border-border hover:border-primary/50"
              }`}
            >
              {/* Preview */}
              <div className={`w-full h-20 rounded-md mb-3 ${themeOption.preview} border flex items-center justify-center`}>
                <IconComponent className="h-6 w-6" />
              </div>
              
              {/* Info */}
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{themeOption.name}</span>
                  {isSelected && (
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {themeOption.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Automatic theme detection hook
export function useAutoTheme() {
  const { setTheme } = useTheme();
  
  useEffect(() => {
    // Auto-switch to dark theme during night hours (6 PM - 6 AM)
    const checkTimeBasedTheme = () => {
      const hour = new Date().getHours();
      const isNightTime = hour >= 18 || hour < 6;
      
      const savedPreference = localStorage.getItem("flutterbye-auto-theme");
      if (savedPreference === "enabled") {
        setTheme(isNightTime ? "dark" : "light");
      }
    };

    // Check on mount
    checkTimeBasedTheme();
    
    // Check every hour
    const interval = setInterval(checkTimeBasedTheme, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [setTheme]);
}

// Theme context values for styled components
export const themeConfig = {
  colors: {
    light: {
      primary: "hsl(221.2 83.2% 53.3%)",
      background: "hsl(0 0% 100%)",
      foreground: "hsl(222.2 84% 4.9%)",
      muted: "hsl(210 40% 96%)",
      border: "hsl(214.3 31.8% 91.4%)",
    },
    dark: {
      primary: "hsl(217.2 91.2% 59.8%)",
      background: "hsl(222.2 84% 4.9%)",
      foreground: "hsl(210 40% 98%)",
      muted: "hsl(217.2 32.6% 17.5%)",
      border: "hsl(217.2 32.6% 17.5%)",
    }
  },
  animations: {
    fadeIn: "fadeIn 0.2s ease-in-out",
    slideIn: "slideInFromRight 0.3s ease-out",
    scaleIn: "scaleIn 0.2s ease-out",
  }
};