import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ContentContextType {
  getText: (key: string, fallback?: string) => string;
  getImage: (key: string, fallback?: string) => string;
  getTheme: () => any;
  isLoading: boolean;
}

const ContentContext = createContext<ContentContextType | null>(null);

export function DynamicContentProvider({ children }: { children: ReactNode }) {
  
  // Fetch dynamic text content
  const { data: textContent = [], isLoading: textLoading } = useQuery({
    queryKey: ["/api/admin/content/text"],
    retry: false,
    staleTime: 30000, // Cache for 30 seconds
  });

  // Fetch image assets
  const { data: imageAssets = [], isLoading: imagesLoading } = useQuery({
    queryKey: ["/api/admin/content/images"],
    retry: false,
    staleTime: 30000,
  });

  // Fetch theme settings
  const { data: themeSettings, isLoading: themeLoading } = useQuery({
    queryKey: ["/api/admin/content/theme"],
    retry: false,
    staleTime: 30000,
  });

  const isLoading = textLoading || imagesLoading || themeLoading;

  const getText = (key: string, fallback: string = "") => {
    const content = textContent.find((item: any) => item.key === key);
    return content ? content.value : fallback;
  };

  const getImage = (key: string, fallback: string = "") => {
    const image = imageAssets.find((item: any) => item.name === key);
    return image ? image.url : fallback;
  };

  const getTheme = () => {
    return themeSettings || {};
  };

  return (
    <ContentContext.Provider value={{
      getText,
      getImage, 
      getTheme,
      isLoading
    }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useDynamicContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useDynamicContent must be used within a DynamicContentProvider");
  }
  return context;
}

// Helper hook for easy text retrieval
export function useText(key: string, fallback: string = "") {
  const { getText } = useDynamicContent();
  return getText(key, fallback);
}

// Helper hook for easy image retrieval
export function useImage(key: string, fallback: string = "") {
  const { getImage } = useDynamicContent();
  return getImage(key, fallback);
}

// Helper hook for theme
export function useTheme() {
  const { getTheme } = useDynamicContent();
  return getTheme();
}