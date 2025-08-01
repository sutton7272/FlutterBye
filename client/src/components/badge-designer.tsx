import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star, 
  Heart, 
  Award, 
  Crown, 
  Diamond, 
  Zap, 
  Flame, 
  Shield,
  Download,
  Share2,
  Coins,
  Copy,
  Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BadgeDesignProps {
  name: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  icon: string;
  pattern: string;
}

const ICONS = {
  star: Star,
  heart: Heart,
  award: Award,
  crown: Crown,
  diamond: Diamond,
  zap: Zap,
  flame: Flame,
  shield: Shield,
  coins: Coins,
};

const PATTERNS = {
  solid: 'solid',
  gradient: 'gradient',
  dots: 'dots',
  stripes: 'stripes',
  glow: 'glow',
};

const PRESET_TEMPLATES = [
  {
    name: "Golden Achievement",
    category: "achievement",
    backgroundColor: "#fbbf24",
    textColor: "#1f2937",
    borderColor: "#f59e0b",
    icon: "crown",
    pattern: "gradient"
  },
  {
    name: "Diamond Elite",
    category: "social",
    backgroundColor: "#3b82f6",
    textColor: "#ffffff",
    borderColor: "#60a5fa",
    icon: "diamond",
    pattern: "glow"
  },
  {
    name: "Fire Starter",
    category: "custom",
    backgroundColor: "#dc2626",
    textColor: "#ffffff",
    borderColor: "#ef4444",
    icon: "flame",
    pattern: "solid"
  },
  {
    name: "Shield Guardian",
    category: "achievement",
    backgroundColor: "#059669",
    textColor: "#ffffff",
    borderColor: "#10b981",
    icon: "shield",
    pattern: "stripes"
  }
];

export default function BadgeDesigner() {
  const [design, setDesign] = useState<BadgeDesignProps>({
    name: "My Custom Badge",
    description: "A unique badge I created",
    backgroundColor: "#8b5cf6",
    textColor: "#ffffff",
    borderColor: "#a78bfa",
    icon: "star",
    pattern: "solid"
  });

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Draw badge preview
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 300;
    canvas.height = 300;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background pattern
    drawBackground(ctx, design);
    
    // Draw border
    ctx.strokeStyle = design.borderColor;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(150, 150, 140, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw icon
    drawIcon(ctx, design);

    // Draw text
    drawText(ctx, design);
  }, [design]);

  const drawBackground = (ctx: CanvasRenderingContext2D, design: BadgeDesignProps) => {
    const centerX = 150;
    const centerY = 150;
    const radius = 140;

    switch (design.pattern) {
      case 'gradient':
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, design.backgroundColor);
        gradient.addColorStop(1, adjustBrightness(design.backgroundColor, -30));
        ctx.fillStyle = gradient;
        break;
      case 'dots':
        ctx.fillStyle = design.backgroundColor;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fill();
        // Add dots pattern
        ctx.fillStyle = adjustBrightness(design.backgroundColor, 20);
        for (let i = 0; i < 20; i++) {
          const x = centerX + Math.cos(i * 0.5) * (radius * 0.7);
          const y = centerY + Math.sin(i * 0.5) * (radius * 0.7);
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, 2 * Math.PI);
          ctx.fill();
        }
        return;
      case 'stripes':
        ctx.fillStyle = design.backgroundColor;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fill();
        // Add stripes
        ctx.strokeStyle = adjustBrightness(design.backgroundColor, 20);
        ctx.lineWidth = 4;
        for (let i = -radius; i < radius; i += 20) {
          ctx.beginPath();
          ctx.moveTo(centerX + i, centerY - radius);
          ctx.lineTo(centerX + i, centerY + radius);
          ctx.stroke();
        }
        return;
      case 'glow':
        const glowGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 1.2);
        glowGradient.addColorStop(0, design.backgroundColor);
        glowGradient.addColorStop(0.7, adjustBrightness(design.backgroundColor, -20));
        glowGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGradient;
        break;
      default:
        ctx.fillStyle = design.backgroundColor;
    }

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();
  };

  const drawIcon = (ctx: CanvasRenderingContext2D, design: BadgeDesignProps) => {
    // Simple icon representation - in a real app you'd use SVG paths
    ctx.fillStyle = design.textColor;
    ctx.font = 'bold 40px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const iconSymbols = {
      star: '★',
      heart: '♥',
      award: '🏆',
      crown: '♔',
      diamond: '♦',
      zap: '⚡',
      flame: '🔥',
      shield: '🛡',
      coins: '🏅'
    };

    ctx.fillText(iconSymbols[design.icon as keyof typeof iconSymbols] || '★', 150, 120);
  };

  const drawText = (ctx: CanvasRenderingContext2D, design: BadgeDesignProps) => {
    ctx.fillStyle = design.textColor;
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw name
    const words = design.name.split(' ');
    if (words.length <= 2) {
      ctx.fillText(design.name, 150, 200);
    } else {
      // Split into two lines if more than 2 words
      const midpoint = Math.ceil(words.length / 2);
      ctx.fillText(words.slice(0, midpoint).join(' '), 150, 190);
      ctx.fillText(words.slice(midpoint).join(' '), 150, 210);
    }
  };

  const adjustBrightness = (color: string, percent: number) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  };

  const handleSaveBadge = async () => {
    try {
      const response = await fetch('/api/badges/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(design)
      });

      if (!response.ok) throw new Error('Failed to save badge');

      const savedBadge = await response.json();
      
      toast({
        title: "Badge Saved!",
        description: "Your custom badge has been saved to your collection.",
      });

      return savedBadge;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save badge. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMintAsNFT = async () => {
    setIsMinting(true);
    try {
      const savedBadge = await handleSaveBadge();
      if (!savedBadge) return;

      const response = await fetch(`/api/badges/custom/${savedBadge.id}/mint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to mint NFT');

      const nftData = await response.json();
      
      toast({
        title: "NFT Minted!",
        description: `Your badge has been minted as an NFT: ${nftData.mintAddress}`,
      });
    } catch (error) {
      toast({
        title: "Minting Failed",
        description: "Failed to mint badge as NFT. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  };

  const handleShare = async () => {
    const savedBadge = await handleSaveBadge();
    if (!savedBadge) return;

    const url = `${window.location.origin}/badges/shared/${savedBadge.id}`;
    setShareUrl(url);
    setIsShareModalOpen(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Share URL copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy URL to clipboard.",
        variant: "destructive"
      });
    }
  };

  const downloadBadge = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `${design.name.replace(/\s+/g, '_')}_badge.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const applyTemplate = (template: typeof PRESET_TEMPLATES[0]) => {
    setDesign(prev => ({
      ...prev,
      ...template
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Design Controls */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Badge Designer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Badge Name</Label>
                  <Input
                    id="name"
                    value={design.name}
                    onChange={(e) => setDesign(prev => ({ ...prev, name: e.target.value }))}
                    maxLength={50}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={design.description}
                    onChange={(e) => setDesign(prev => ({ ...prev, description: e.target.value }))}
                    maxLength={200}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Select value={design.icon} onValueChange={(value) => setDesign(prev => ({ ...prev, icon: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ICONS).map(([key, Icon]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="style" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="backgroundColor">Background</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        id="backgroundColor"
                        value={design.backgroundColor}
                        onChange={(e) => setDesign(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        className="w-16"
                      />
                      <Input
                        value={design.backgroundColor}
                        onChange={(e) => setDesign(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        placeholder="#8b5cf6"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="textColor">Text Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        id="textColor"
                        value={design.textColor}
                        onChange={(e) => setDesign(prev => ({ ...prev, textColor: e.target.value }))}
                        className="w-16"
                      />
                      <Input
                        value={design.textColor}
                        onChange={(e) => setDesign(prev => ({ ...prev, textColor: e.target.value }))}
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="borderColor">Border Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        id="borderColor"
                        value={design.borderColor}
                        onChange={(e) => setDesign(prev => ({ ...prev, borderColor: e.target.value }))}
                        className="w-16"
                      />
                      <Input
                        value={design.borderColor}
                        onChange={(e) => setDesign(prev => ({ ...prev, borderColor: e.target.value }))}
                        placeholder="#a78bfa"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pattern">Pattern</Label>
                    <Select value={design.pattern} onValueChange={(value) => setDesign(prev => ({ ...prev, pattern: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PATTERNS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label.charAt(0).toUpperCase() + label.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="templates" className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {PRESET_TEMPLATES.map((template) => (
                    <Card key={template.name} className="cursor-pointer hover:ring-2 hover:ring-primary" onClick={() => applyTemplate(template)}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{template.name}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {template.category}
                            </Badge>
                          </div>
                          <div 
                            className="w-8 h-8 rounded-full border-2" 
                            style={{
                              backgroundColor: template.backgroundColor,
                              borderColor: template.borderColor
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Preview and Actions */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <canvas
              ref={canvasRef}
              className="border rounded-lg max-w-full"
              style={{ maxWidth: '300px', height: 'auto' }}
            />
            
            <div className="text-center space-y-2">
              <h3 className="font-bold text-lg">{design.name}</h3>
              <p className="text-muted-foreground text-sm">{design.description}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={handleSaveBadge} className="w-full">
              Save Badge
            </Button>
            
            <Button onClick={handleMintAsNFT} disabled={isMinting} className="w-full" variant="outline">
              {isMinting ? "Minting..." : "Mint as NFT"}
              <Coins className="ml-2 h-4 w-4" />
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={downloadBadge} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              
              <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleShare} variant="outline" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Share Your Badge</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input value={shareUrl} readOnly />
                      <Button onClick={copyToClipboard} variant="outline" size="sm">
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" size="sm" onClick={() => window.open(`https://twitter.com/intent/tweet?text=Check out my custom badge!&url=${encodeURIComponent(shareUrl)}`)}>
                        Twitter
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => window.open(`https://discord.com/channels/@me`)}>
                        Discord
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}`)}>
                        Telegram
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}