import React, { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface User {
  id: string;
  username: string;
  walletAddress: string;
  email?: string;
  isAdmin?: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (address: string, signature: string, message: string) => Promise<boolean>;
  logout: () => void;
  walletAddress: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

function useWalletAuth(): AuthContextType {
  const [walletAddress, setWalletAddress] = useState<string | null>(
    () => localStorage.getItem('walletAddress')
  );

  const { 
    data: user, 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['/api/user', walletAddress],
    enabled: !!walletAddress,
    retry: false,
  });

  useEffect(() => {
    if (walletAddress && !isLoading && !user) {
      localStorage.removeItem('walletAddress');
      setWalletAddress(null);
    }
  }, [walletAddress, isLoading, user]);

  const login = async (address: string, signature: string, message: string): Promise<boolean> => {
    try {
      const response = await apiRequest('POST', '/api/auth/verify', {
        walletAddress: address,
        signature,
        message
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
  
  return React.createElement(AuthContext.Provider, { value: auth }, children);
}
