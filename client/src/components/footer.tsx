import { Heart, ExternalLink } from "lucide-react";
import { SolviturBrandBadge } from "./solvitur-brand-badge";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glassmorphism border-t border-electric-blue/20 mt-auto electric-frame">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left side - Powered by FlutterAI */}
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span>Powered by</span>
            <a 
              href="/flutterai" 
              className="text-electric-blue hover:text-electric-green transition-all duration-300 flex items-center gap-1 font-medium glow-text"
            >
              FlutterAI
              <ExternalLink className="h-3 w-3" />
            </a>
            <span className="text-electric-blue/40">•</span>
            <span>Advanced Blockchain Intelligence</span>
          </div>

          {/* Center - Made with love */}
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-electric-green fill-current pulse-glow" />
            <span>for the Web3 community</span>
          </div>

          {/* Right side - Copyright with Logo */}
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span>© {currentYear} </span>
            <a 
              href="https://solvitur.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-electric-green hover:text-electric-blue transition-all duration-300 font-medium glow-text"
            >
              <SolviturBrandBadge size="sm" showText={true} />
            </a>
            <span> All rights reserved.</span>
          </div>
        </div>

        {/* Secondary row - Additional info */}
        <div className="mt-4 pt-4 border-t border-electric-blue/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-muted">
            <div className="flex items-center gap-4">
              <span className="text-electric-blue">Flutterbye</span>
              <span className="text-electric-blue/40">•</span>
              <span>Revolutionary Web3 Communication</span>
              <span className="hidden md:inline text-electric-blue/40">•</span>
              <span className="hidden md:inline">Tokenized Messaging Platform</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="/privacy-policy" className="hover:text-electric-blue transition-colors">Privacy Policy</a>
              <span className="text-electric-blue/40">•</span>
              <a href="/terms-of-service" className="hover:text-electric-blue transition-colors">Terms of Service</a>
              <span className="text-electric-blue/40">•</span>
              <a href="/contact" className="hover:text-electric-blue transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}