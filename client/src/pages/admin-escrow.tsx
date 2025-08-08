import { EscrowWalletManagement } from "@/components/escrow-wallet-management";
import Navbar from "@/components/navbar";

export default function AdminEscrow() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <EscrowWalletManagement />
      </div>
    </div>
  );
}