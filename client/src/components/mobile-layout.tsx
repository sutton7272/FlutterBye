import { ReactNode } from "react";
import { MobileNavigation } from "@/components/mobile-navigation";

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
}

export function MobileLayout({ children, className = "" }: MobileLayoutProps) {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {/* Main content with mobile safe padding */}
      <main className="pb-20 md:pb-0">
        {children}
      </main>
      
      {/* Mobile Navigation */}
      <MobileNavigation />
    </div>
  );
}