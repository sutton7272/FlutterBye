import { useState, useEffect, createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { ReactNode } from 'react';

interface User {
  id: string;
  walletAddress: string;
  role: string;
  isAdmin: boolean;
  adminPermissions: string[];
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (walletAddress: string, signature: string, message: string) => Promise<boolean>;
  logout: () => void;
  walletAddress: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook for wallet-based authentication
export function useWalletAuth() {
  const [walletAddress, setWalletAddress] = useState<string | null>(
    localStorage.getItem('walletAddress')
  );

  const { data: user, isLoading, refetch } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      if (!walletAddress) throw new Error('No wallet connected');
      
      const response = await fetch("/api/auth/user", {
        headers: {
          'X-Wallet-Address': walletAddress
        }
      });
      
      if (!response.ok) {
        throw new Error('Authentication failed');
      }
      
      return response.json();
    },
    enabled: !!walletAddress,
    retry: false,
  });

  const login = async (address: string, signature: string, message: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          walletAddress: address,
          signature,
          message,
          deviceInfo: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language
          }
        })
      });

      if (response.ok) {
        localStorage.setItem('walletAddress', address);
        setWalletAddress(address);
        await refetch();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('walletAddress');
    setWalletAddress(null);
  };

  return {
    user: user || null,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    walletAddress
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useWalletAuth();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}