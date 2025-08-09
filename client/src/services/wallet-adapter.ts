// Comprehensive Multi-Wallet Adapter Service
// Supports all major Solana wallets with unified interface
import { useState } from "react";

interface WalletAdapter {
  connect(): Promise<string>;
  disconnect(): Promise<void>;
  signTransaction(transaction: any): Promise<any>;
  signMessage(message: Uint8Array): Promise<Uint8Array>;
  publicKey: string | null;
  connected: boolean;
}

class PhantomAdapter implements WalletAdapter {
  public publicKey: string | null = null;
  public connected: boolean = false;

  async connect(): Promise<string> {
    if (!(window as any).phantom?.solana) {
      throw new Error('Phantom wallet not found');
    }
    
    const response = await (window as any).phantom.solana.connect();
    this.publicKey = response.publicKey.toString();
    this.connected = true;
    return this.publicKey;
  }

  async disconnect(): Promise<void> {
    await (window as any).phantom.solana.disconnect();
    this.publicKey = null;
    this.connected = false;
  }

  async signTransaction(transaction: any): Promise<any> {
    return await (window as any).phantom.solana.signTransaction(transaction);
  }

  async signMessage(message: Uint8Array): Promise<Uint8Array> {
    return await (window as any).phantom.solana.signMessage(message, 'utf8');
  }
}

class SolflareAdapter implements WalletAdapter {
  public publicKey: string | null = null;
  public connected: boolean = false;

  async connect(): Promise<string> {
    if (!(window as any).solflare) {
      throw new Error('Solflare wallet not found');
    }
    
    const response = await (window as any).solflare.connect();
    this.publicKey = response.publicKey.toString();
    this.connected = true;
    return this.publicKey;
  }

  async disconnect(): Promise<void> {
    await (window as any).solflare.disconnect();
    this.publicKey = null;
    this.connected = false;
  }

  async signTransaction(transaction: any): Promise<any> {
    return await (window as any).solflare.signTransaction(transaction);
  }

  async signMessage(message: Uint8Array): Promise<Uint8Array> {
    return await (window as any).solflare.signMessage(message, 'utf8');
  }
}

class BackpackAdapter implements WalletAdapter {
  public publicKey: string | null = null;
  public connected: boolean = false;

  async connect(): Promise<string> {
    if (!(window as any).backpack) {
      throw new Error('Backpack wallet not found');
    }
    
    const response = await (window as any).backpack.connect();
    this.publicKey = response.publicKey.toString();
    this.connected = true;
    return this.publicKey;
  }

  async disconnect(): Promise<void> {
    await (window as any).backpack.disconnect();
    this.publicKey = null;
    this.connected = false;
  }

  async signTransaction(transaction: any): Promise<any> {
    return await (window as any).backpack.signTransaction(transaction);
  }

  async signMessage(message: Uint8Array): Promise<Uint8Array> {
    return await (window as any).backpack.signMessage(message, 'utf8');
  }
}

class GlowAdapter implements WalletAdapter {
  public publicKey: string | null = null;
  public connected: boolean = false;

  async connect(): Promise<string> {
    if (!(window as any).glow) {
      throw new Error('Glow wallet not found');
    }
    
    const response = await (window as any).glow.connect();
    this.publicKey = response.publicKey.toString();
    this.connected = true;
    return this.publicKey;
  }

  async disconnect(): Promise<void> {
    await (window as any).glow.disconnect();
    this.publicKey = null;
    this.connected = false;
  }

  async signTransaction(transaction: any): Promise<any> {
    return await (window as any).glow.signTransaction(transaction);
  }

  async signMessage(message: Uint8Array): Promise<Uint8Array> {
    return await (window as any).glow.signMessage(message, 'utf8');
  }
}

class CoinbaseAdapter implements WalletAdapter {
  public publicKey: string | null = null;
  public connected: boolean = false;

  async connect(): Promise<string> {
    if (!(window as any).coinbaseSolana) {
      throw new Error('Coinbase wallet not found');
    }
    
    const response = await (window as any).coinbaseSolana.connect();
    this.publicKey = response.publicKey.toString();
    this.connected = true;
    return this.publicKey;
  }

  async disconnect(): Promise<void> {
    await (window as any).coinbaseSolana.disconnect();
    this.publicKey = null;
    this.connected = false;
  }

  async signTransaction(transaction: any): Promise<any> {
    return await (window as any).coinbaseSolana.signTransaction(transaction);
  }

  async signMessage(message: Uint8Array): Promise<Uint8Array> {
    return await (window as any).coinbaseSolana.signMessage(message, 'utf8');
  }
}

export class UniversalWalletService {
  private currentAdapter: WalletAdapter | null = null;
  private currentWalletType: string | null = null;

  // Get list of available wallets
  getAvailableWallets(): string[] {
    const available: string[] = [];
    
    if ((window as any).phantom?.solana) available.push('phantom');
    if ((window as any).solflare) available.push('solflare');
    if ((window as any).backpack) available.push('backpack');
    if ((window as any).glow) available.push('glow');
    if ((window as any).coinbaseSolana) available.push('coinbase');
    
    return available;
  }

  // Connect to specific wallet
  async connectWallet(walletType: string): Promise<string> {
    let adapter: WalletAdapter;

    switch (walletType) {
      case 'phantom':
        adapter = new PhantomAdapter();
        break;
      case 'solflare':
        adapter = new SolflareAdapter();
        break;
      case 'backpack':
        adapter = new BackpackAdapter();
        break;
      case 'glow':
        adapter = new GlowAdapter();
        break;
      case 'coinbase':
        adapter = new CoinbaseAdapter();
        break;
      default:
        throw new Error(`Unsupported wallet type: ${walletType}`);
    }

    try {
      const publicKey = await adapter.connect();
      this.currentAdapter = adapter;
      this.currentWalletType = walletType;
      
      // Store connection info
      localStorage.setItem('flutter_connected_wallet', walletType);
      localStorage.setItem('flutter_wallet_address', publicKey);
      
      return publicKey;
    } catch (error: any) {
      throw new Error(`Failed to connect to ${walletType}: ${error?.message || 'Unknown error'}`);
    }
  }

  // Disconnect current wallet
  async disconnectWallet(): Promise<void> {
    if (this.currentAdapter) {
      await this.currentAdapter.disconnect();
      this.currentAdapter = null;
      this.currentWalletType = null;
      
      // Clear stored connection info
      localStorage.removeItem('flutter_connected_wallet');
      localStorage.removeItem('flutter_wallet_address');
    }
  }

  // Get current wallet info
  getCurrentWallet(): { type: string | null; address: string | null; connected: boolean } {
    return {
      type: this.currentWalletType,
      address: this.currentAdapter?.publicKey || null,
      connected: this.currentAdapter?.connected || false
    };
  }

  // Auto-reconnect on page load
  async autoReconnect(): Promise<boolean> {
    const savedWalletType = localStorage.getItem('flutter_connected_wallet');
    if (!savedWalletType) return false;

    try {
      await this.connectWallet(savedWalletType);
      return true;
    } catch (error: any) {
      console.warn('Auto-reconnect failed:', error);
      // Clear invalid saved wallet
      localStorage.removeItem('flutter_connected_wallet');
      localStorage.removeItem('flutter_wallet_address');
      return false;
    }
  }

  // Sign transaction with current wallet
  async signTransaction(transaction: any): Promise<any> {
    if (!this.currentAdapter || !this.currentAdapter.connected) {
      throw new Error('No wallet connected');
    }
    return await this.currentAdapter.signTransaction(transaction);
  }

  // Sign message with current wallet
  async signMessage(message: string): Promise<Uint8Array> {
    if (!this.currentAdapter || !this.currentAdapter.connected) {
      throw new Error('No wallet connected');
    }
    const messageBytes = new TextEncoder().encode(message);
    return await this.currentAdapter.signMessage(messageBytes);
  }

  // Check if specific wallet is installed
  isWalletInstalled(walletType: string): boolean {
    switch (walletType) {
      case 'phantom':
        return !!(window as any).phantom?.solana;
      case 'solflare':
        return !!(window as any).solflare;
      case 'backpack':
        return !!(window as any).backpack;
      case 'glow':
        return !!(window as any).glow;
      case 'coinbase':
        return !!(window as any).coinbaseSolana;
      default:
        return false;
    }
  }

  // Get wallet download URLs
  getWalletDownloadUrl(walletType: string): string {
    const urls: Record<string, string> = {
      phantom: 'https://phantom.app/',
      solflare: 'https://solflare.com/',
      backpack: 'https://backpack.app/',
      glow: 'https://glow.app/',
      coinbase: 'https://wallet.coinbase.com/'
    };
    return urls[walletType] || '#';
  }
}

// Export singleton instance
export const walletService = new UniversalWalletService();

// React hook for wallet management
export function useWallet() {
  const [walletInfo, setWalletInfo] = useState(walletService.getCurrentWallet());

  const connectWallet = async (walletType: string) => {
    try {
      await walletService.connectWallet(walletType);
      setWalletInfo(walletService.getCurrentWallet());
    } catch (error: any) {
      throw error;
    }
  };

  const disconnectWallet = async () => {
    await walletService.disconnectWallet();
    setWalletInfo(walletService.getCurrentWallet());
  };

  const autoReconnect = async () => {
    const reconnected = await walletService.autoReconnect();
    if (reconnected) {
      setWalletInfo(walletService.getCurrentWallet());
    }
    return reconnected;
  };

  return {
    ...walletInfo,
    connectWallet,
    disconnectWallet,
    autoReconnect,
    availableWallets: walletService.getAvailableWallets(),
    isWalletInstalled: walletService.isWalletInstalled.bind(walletService),
    getDownloadUrl: walletService.getWalletDownloadUrl.bind(walletService)
  };
}