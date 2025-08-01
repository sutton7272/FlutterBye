import { useQuery } from "@tanstack/react-query";

interface AdminAuthData {
  isAdmin: boolean;
  role: string;
  permissions: string[];
}

export function useAdminAuth() {
  const { data, isLoading, error } = useQuery<AdminAuthData>({
    queryKey: ["/api/admin/check"],
    queryFn: async (): Promise<AdminAuthData> => {
      const walletAddress = localStorage.getItem('walletAddress');
      if (!walletAddress) {
        throw new Error('No wallet connected');
      }

      const response = await fetch("/api/admin/check", {
        method: "GET",
        headers: {
          'X-Wallet-Address': walletAddress
        }
      });

      if (!response.ok) {
        throw new Error('Failed to check admin status');
      }

      return response.json();
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    isAdmin: data?.isAdmin || false,
    role: data?.role || 'user',
    permissions: data?.permissions || [],
    isLoading,
    error,
    hasPermission: (permission: string) => {
      return data?.permissions?.includes(permission) || data?.role === 'super_admin';
    },
    isSuperAdmin: data?.role === 'super_admin'
  };
}