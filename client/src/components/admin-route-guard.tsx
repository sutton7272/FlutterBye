import { useEffect } from "react";
import { useLocation } from "wouter";

const ADMIN_WALLETS_KEY = "flutter_admin_wallets";

// Mock wallet for admin authentication - replace with real wallet integration
const MOCK_WALLET = "4xY2D8F3nQ9sM1pR6tZ5bV7wX0aH8cJ2kL4mN7oP9qS3uT";
const mockWalletConnected = true; // Simulated wallet connection

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const checkAccess = () => {
      // Check if user has wallet-based persistent access
      if (mockWalletConnected && MOCK_WALLET) {
        const authenticatedWallets = JSON.parse(localStorage.getItem(ADMIN_WALLETS_KEY) || "[]");
        
        if (authenticatedWallets.includes(MOCK_WALLET)) {
          // Wallet is authenticated, allow access
          return;
        }
      }
      
      // Check if user came from gateway with temporary session
      const hasGatewayAccess = sessionStorage.getItem("admin_gateway_access");
      if (hasGatewayAccess) {
        // Temporary access granted, allow access
        return;
      }
      
      // No valid access, redirect to gateway
      setLocation("/admin");
    };

    checkAccess();
  }, [setLocation]);

  return <>{children}</>;
}