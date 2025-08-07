import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import SimpleMultiChain from "@/pages/SimpleMultiChain";
import Navbar from "@/components/navbar";

export default function MultiChainApp() {
  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <div className="dark min-h-screen">
            <Navbar />
            <SimpleMultiChain />
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}