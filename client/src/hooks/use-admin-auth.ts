import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AdminAuthData {
  isAdmin: boolean;
  role: string;
  permissions: string[];
}

export function useAdminAuth() {
  const { data, isLoading, error } = useQuery<AdminAuthData>({
    queryKey: ["/api/admin/check"],
    queryFn: async () => {
      const walletAddress = localStorage.getItem('walletAddress');
      if (!walletAddress) {
        throw new Error('No wallet connected');
      }

      return apiRequest("/api/admin/check", {
        method: "GET",
        headers: {
          'X-Wallet-Address': walletAddress
        }
      });
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