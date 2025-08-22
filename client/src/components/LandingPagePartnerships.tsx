import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface Partnership {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  logoUrl: string;
  isActive: boolean;
  displayOrder: number;
  partnershipType: string;
  clickCount: number;
}

export function LandingPagePartnerships() {
  const { data: partnershipsData, isLoading, error } = useQuery({
    queryKey: ["/api/partnerships"],
  });

  const partnerships = ((partnershipsData as any)?.partnerships || []).filter((p: Partnership) => p.isActive);

  const handlePartnerClick = async (partnership: Partnership) => {
    // Track click analytics
    try {
      await fetch(`/api/partnerships/${partnership.id}/click`, {
        method: "POST"
      });
    } catch (error) {
      console.error("Failed to track partnership click:", error);
    }
    
    // Open partner website in new tab
    window.open(partnership.websiteUrl, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-slate-900/40 backdrop-blur-sm border-t border-electric-blue/20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-electric-blue">Loading partnerships...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-slate-900/40 backdrop-blur-sm border-t border-electric-blue/20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-red-400">Error loading partnerships</div>
        </div>
      </section>
    );
  }

  if (partnerships.length === 0) {
    return (
      <section className="py-16 bg-slate-900/40 backdrop-blur-sm border-t border-electric-blue/20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-slate-400">No partnerships available</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <Card className="electric-frame p-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-electric-blue to-electric-green bg-clip-text text-transparent mb-4">
            Trusted Partners
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            FlutterBye collaborates with leading organizations to bring you the best Web3 marketing intelligence
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
          {partnerships.slice(0, 6).map((partnership: Partnership) => (
            <Card 
              key={partnership.id}
              className="bg-slate-800/60 backdrop-blur-sm border-slate-700/50 hover:border-electric-blue/50 transition-all duration-300 cursor-pointer group"
              onClick={() => handlePartnerClick(partnership)}
              data-testid={`partner-card-${partnership.id}`}
            >
              <CardContent className="p-4 text-center">
                <div className="relative mb-3">
                  <img 
                    src={partnership.logoUrl}
                    alt={partnership.name}
                    className="w-16 h-16 mx-auto object-cover rounded-lg border border-slate-600/50 group-hover:border-electric-blue/50 transition-colors"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-electric-blue/20 backdrop-blur-sm rounded-full p-2">
                      <ExternalLink className="w-4 h-4 text-electric-blue" />
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-sm text-white group-hover:text-electric-blue transition-colors mb-2">
                  {partnership.name}
                </h3>
                <p className="text-xs text-slate-400 mb-2 overflow-hidden"
                   style={{ 
                     display: '-webkit-box',
                     WebkitLineClamp: 2,
                     WebkitBoxOrient: 'vertical' as const
                   }}>
                  {partnership.description}
                </p>
                <div className="mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    partnership.partnershipType === 'strategic' ? 'bg-purple-600/20 text-purple-300' :
                    partnership.partnershipType === 'technology' ? 'bg-blue-600/20 text-blue-300' :
                    partnership.partnershipType === 'marketing' ? 'bg-green-600/20 text-green-300' :
                    'bg-orange-600/20 text-orange-300'
                  }`}>
                    {partnership.partnershipType}
                  </span>
                </div>
                <div className="text-xs text-electric-green">
                  {partnership.clickCount.toLocaleString()} clicks
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {partnerships.length > 6 && (
          <div className="text-center mt-8">
            <p className="text-sm text-slate-400">
              And {partnerships.length - 6} more strategic partnerships
            </p>
          </div>
        )}

        </Card>
      </div>
    </section>
  );
}