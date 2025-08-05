import React from 'react';
import CelestialWalletDashboard from '@/components/CelestialWalletDashboard';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

const CelestialDashboard: React.FC = () => {
  // For demo purposes, using a mock user ID
  // In production, this would come from authentication context
  const userId = 'demo-user-' + Math.random().toString(36).substr(2, 9);
  
  return (
    <CelestialWalletDashboard 
      userId={userId}
      walletAddress="demo-wallet-address"
    />
  );
};

export default CelestialDashboard;