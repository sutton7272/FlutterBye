import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  try {
    // Use absolute URL for DevNet deployment
    const baseUrl = window.location.origin;
    const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
    
    const headers: Record<string, string> = {
      "Authorization": "Bearer development",
    };
    
    if (data) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(fullUrl, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    console.log('📍 API request error caught and handled safely');
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      // Use absolute URL for DevNet deployment
      const baseUrl = window.location.origin;
      const endpoint = queryKey.join("/") as string;
      const fullUrl = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;
      
      const res = await fetch(fullUrl, {
        credentials: "include",
        headers: {
          "Authorization": "Bearer development",
        },
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
      console.log('📍 Query function error caught and handled safely');
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes instead of Infinity
      retry: 1, // Allow one retry instead of none
      refetchOnMount: true, // Ensure fresh data on mount
    },
    mutations: {
      retry: 1, // Allow one retry for mutations too
    },
  },
});
