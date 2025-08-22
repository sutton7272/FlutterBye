import Navbar from "@/components/navbar";
import { PartnershipManagement } from "@/components/PartnershipManagement";
import cosmicBackgroundPath from "@assets/image_1754257352191.png";

export default function PartnershipManagementPage() {
  return (
    <>
      <Navbar />
      <div 
        className="min-h-screen relative overflow-hidden bg-cover bg-center bg-no-repeat" 
        style={{
          backgroundImage: `url(${cosmicBackgroundPath})`,
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
        
        {/* Main Content */}
        <div className="relative z-10 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-electric-blue to-electric-green bg-clip-text text-transparent">
                Partnership Management
              </h1>
              <p className="text-text-secondary mt-2">
                Manage strategic partnerships displayed on the FlutterBye landing page
              </p>
            </div>
            
            <PartnershipManagement />
          </div>
        </div>
      </div>
    </>
  );
}