import { useEffect, useState } from "react";
import { useLocation } from "wouter";

interface EarlyAccessGuardProps {
  children: React.ReactNode;
}

export function EarlyAccessGuard({ children }: EarlyAccessGuardProps) {
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if user has early access from localStorage
    const earlyAccessGranted = localStorage.getItem("flutterbye_early_access");
    
    if (earlyAccessGranted === "granted") {
      setHasAccess(true);
    } else {
      // Redirect to landing page if no access
      setLocation("/");
    }
    
    setIsLoading(false);
  }, [setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking access...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return null; // Will redirect to landing page
  }

  return <>{children}</>;
}