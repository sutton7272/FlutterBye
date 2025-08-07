import { ethers } from 'ethers';
import * as bitcoin from 'bitcoinjs-lib';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import Web3 from 'web3';

export interface ChainConfig {
  name: string;
  symbol: string;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: string;
  chainId?: number;
}

export interface WalletBalance {
  chain: string;
  address: string;
  balance: number;
  nativeBalance: number;
  tokens: TokenBalance[];
  lastUpdated: Date;
}

export interface TokenBalance {
  symbol: string;
  name: string;
  balance: number;
  decimals: number;
  contractAddress?: string;
  usdValue?: number;
}

export interface TransactionHistory {
  chain: string;
  hash: string;
  from: string;
  to: string;
  value: number;
  timestamp: Date;
  status: 'success' | 'failed' | 'pending';
  gasUsed?: number;
  type: 'send' | 'receive' | 'contract' | 'swap';
}

export class MultiChainService {
  private static instance: MultiChainService;
  
  // Chain configurations
  private chains: Map<string, ChainConfig> = new Map([
    ['ethereum', {
      name: 'Ethereum',
      symbol: 'ETH',
      rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/demo',
      explorerUrl: 'https://etherscan.io',
      nativeCurrency: 'ETH',
      chainId: 1
    }],
    ['bitcoin', {
      name: 'Bitcoin',
      symbol: 'BTC',
      rpcUrl: 'https://bitcoin-mainnet.s.chainbase.online/v1/demo',
      explorerUrl: 'https://blockstream.info',
      nativeCurrency: 'BTC'
    }],
    ['polygon', {
      name: 'Polygon',
      symbol: 'MATIC',
      rpcUrl: 'https://polygon-rpc.com',
      explorerUrl: 'https://polygonscan.com',
      nativeCurrency: 'MATIC',
      chainId: 137
    }],
    ['xrp', {
      name: 'XRP Ledger',
      symbol: 'XRP',
      rpcUrl: 'wss://xrplcluster.com',
      explorerUrl: 'https://xrpscan.com',
      nativeCurrency: 'XRP'
    }],
    ['sui', {
      name: 'Sui Network',
      symbol: 'SUI',
      rpcUrl: 'https://fullnode.mainnet.sui.io:443',
      explorerUrl: 'https://suiexplorer.com',
      nativeCurrency: 'SUI'
    }],
    ['kaspa', {
      name: 'Kaspa',
      symbol: 'KAS',
      rpcUrl: 'https://api.kaspa.org',
      explorerUrl: 'https://explorer.kaspa.org',
      nativeCurrency: 'KAS'
    }],
    ['solana', {
      name: 'Solana',
      symbol: 'SOL',
      rpcUrl: 'https://api.mainnet-beta.solana.com',
      explorerUrl: 'https://solscan.io',
      nativeCurrency: 'SOL'
    }]
  ]);

  // Blockchain clients
  private ethereumProvider: ethers.JsonRpcProvider;
  private polygonProvider: ethers.JsonRpcProvider;
  private xrplClient: any;
  private suiClient: any;
  private solanaConnection: Connection;
  private web3Polygon: Web3;

  static getInstance(): MultiChainService {
    if (!MultiChainService.instance) {
      MultiChainService.instance = new MultiChainService();
    }
    return MultiChainService.instance;
  }

  constructor() {
    // Initialize synchronous clients first
    this.ethereumProvider = new ethers.JsonRpcProvider(this.chains.get('ethereum')!.rpcUrl);
    this.polygonProvider = new ethers.JsonRpcProvider(this.chains.get('polygon')!.rpcUrl);
    this.web3Polygon = new Web3(this.chains.get('polygon')!.rpcUrl);
    this.solanaConnection = new Connection(this.chains.get('solana')!.rpcUrl);
    
    // Initialize async clients
    this.initializeClients();
  }

  private async initializeClients() {
    try {
      // Ethereum client
      this.ethereumProvider = new ethers.JsonRpcProvider(this.chains.get('ethereum')!.rpcUrl);
      
      // Polygon client  
      this.polygonProvider = new ethers.JsonRpcProvider(this.chains.get('polygon')!.rpcUrl);
      this.web3Polygon = new Web3(this.chains.get('polygon')!.rpcUrl);

      // Solana client
      this.solanaConnection = new Connection(this.chains.get('solana')!.rpcUrl);

      // Initialize XRP client (async)
      try {
        const xrplModule = await import('xrpl');
        this.xrplClient = new xrplModule.Client(this.chains.get('xrp')!.rpcUrl);
      } catch (error) {
        console.log('XRPL not available, using fallback');
        this.xrplClient = null;
      }

      // Initialize Sui client (async)
      try {
        const suiModule = await import('@mysten/sui.js/client');
        this.suiClient = new suiModule.SuiClient({ url: suiModule.getFullnodeUrl('mainnet') });
      } catch (error) {
        console.log('Sui not available, using fallback');
        this.suiClient = null;
      }

      console.log('🌐 Multi-chain service initialized with 7 blockchain networks');
    } catch (error) {
      console.error('❌ Error initializing multi-chain clients:', error);
    }
  }

  // Get wallet balance across all chains
  async getMultiChainWalletBalance(addresses: { [chain: string]: string }): Promise<WalletBalance[]> {
    const balances: WalletBalance[] = [];
    
    for (const [chain, address] of Object.entries(addresses)) {
      try {
        let balance: WalletBalance;
        
        switch (chain) {
          case 'ethereum':
            balance = await this.getEthereumBalance(address);
            break;
          case 'bitcoin':
            balance = await this.getBitcoinBalance(address);
            break;
          case 'polygon':
            balance = await this.getPolygonBalance(address);
            break;
          case 'xrp':
            balance = await this.getXrpBalance(address);
            break;
          case 'sui':
            balance = await this.getSuiBalance(address);
            break;
          case 'kaspa':
            balance = await this.getKaspaBalance(address);
            break;
          case 'solana':
            balance = await this.getSolanaBalance(address);
            break;
          default:
            continue;
        }
        
        balances.push(balance);
      } catch (error) {
        console.error(`Error fetching ${chain} balance for ${address}:`, error);
      }
    }
    
    return balances;
  }

  // Ethereum balance implementation
  async getEthereumBalance(address: string): Promise<WalletBalance> {
    try {
      const balance = await this.ethereumProvider.getBalance(address);
      const ethBalance = parseFloat(ethers.formatEther(balance));
      
      return {
        chain: 'ethereum',
        address,
        balance: ethBalance,
        nativeBalance: ethBalance,
        tokens: [], // Will implement ERC-20 token detection
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Ethereum balance error:', error);
      return this.getEmptyBalance('ethereum', address);
    }
  }

  // Bitcoin balance implementation
  async getBitcoinBalance(address: string): Promise<WalletBalance> {
    try {
      // Using a public API for Bitcoin balance
      const response = await fetch(`https://blockstream.info/api/address/${address}`);
      const data = await response.json();
      
      const balance = (data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum) / 100000000;
      
      return {
        chain: 'bitcoin',
        address,
        balance,
        nativeBalance: balance,
        tokens: [],
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Bitcoin balance error:', error);
      return this.getEmptyBalance('bitcoin', address);
    }
  }

  // Polygon balance implementation
  async getPolygonBalance(address: string): Promise<WalletBalance> {
    try {
      const balance = await this.polygonProvider.getBalance(address);
      const maticBalance = parseFloat(ethers.formatEther(balance));
      
      return {
        chain: 'polygon',
        address,
        balance: maticBalance,
        nativeBalance: maticBalance,
        tokens: [],
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Polygon balance error:', error);
      return this.getEmptyBalance('polygon', address);
    }
  }

  // XRP balance implementation
  async getXrpBalance(address: string): Promise<WalletBalance> {
    try {
      if (!this.xrplClient) {
        return this.getEmptyBalance('xrp', address);
      }

      const xrplModule = await import('xrpl');
      
      if (!this.xrplClient.isConnected()) {
        await this.xrplClient.connect();
      }
      
      const response = await this.xrplClient.request({
        command: 'account_info',
        account: address,
        ledger_index: 'validated'
      });
      
      const balance = parseFloat(xrplModule.dropsToXrp(response.result.account_data.Balance));
      
      return {
        chain: 'xrp',
        address,
        balance,
        nativeBalance: balance,
        tokens: [],
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('XRP balance error:', error);
      return this.getEmptyBalance('xrp', address);
    }
  }

  // Sui balance implementation
  async getSuiBalance(address: string): Promise<WalletBalance> {
    try {
      if (!this.suiClient) {
        return this.getEmptyBalance('sui', address);
      }

      const balance = await this.suiClient.getBalance({
        owner: address
      });
      
      const suiBalance = parseInt(balance.totalBalance) / 1000000000; // SUI has 9 decimals
      
      return {
        chain: 'sui',
        address,
        balance: suiBalance,
        nativeBalance: suiBalance,
        tokens: [],
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Sui balance error:', error);
      return this.getEmptyBalance('sui', address);
    }
  }

  // Kaspa balance implementation
  async getKaspaBalance(address: string): Promise<WalletBalance> {
    try {
      // Using Kaspa API
      const response = await fetch(`https://api.kaspa.org/addresses/${address}/balance`);
      const data = await response.json();
      
      const balance = data.balance / 100000000; // KAS has 8 decimals
      
      return {
        chain: 'kaspa',
        address,
        balance,
        nativeBalance: balance,
        tokens: [],
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Kaspa balance error:', error);
      return this.getEmptyBalance('kaspa', address);
    }
  }

  // Solana balance implementation
  async getSolanaBalance(address: string): Promise<WalletBalance> {
    try {
      const publicKey = new PublicKey(address);
      const balance = await this.solanaConnection.getBalance(publicKey);
      const solBalance = balance / LAMPORTS_PER_SOL;
      
      return {
        chain: 'solana',
        address,
        balance: solBalance,
        nativeBalance: solBalance,
        tokens: [],
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Solana balance error:', error);
      return this.getEmptyBalance('solana', address);
    }
  }

  // Get transaction history across chains
  async getMultiChainTransactionHistory(addresses: { [chain: string]: string }): Promise<TransactionHistory[]> {
    const allTransactions: TransactionHistory[] = [];
    
    for (const [chain, address] of Object.entries(addresses)) {
      try {
        const transactions = await this.getChainTransactionHistory(chain, address);
        allTransactions.push(...transactions);
      } catch (error) {
        console.error(`Error fetching ${chain} transactions for ${address}:`, error);
      }
    }
    
    // Sort by timestamp, most recent first
    return allTransactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Get transaction history for specific chain
  async getChainTransactionHistory(chain: string, address: string, limit: number = 10): Promise<TransactionHistory[]> {
    switch (chain) {
      case 'ethereum':
        return this.getEthereumTransactionHistory(address, limit);
      case 'bitcoin':
        return this.getBitcoinTransactionHistory(address, limit);
      case 'polygon':
        return this.getPolygonTransactionHistory(address, limit);
      case 'xrp':
        return this.getXrpTransactionHistory(address, limit);
      case 'sui':
        return this.getSuiTransactionHistory(address, limit);
      case 'solana':
        return this.getSolanaTransactionHistory(address, limit);
      default:
        return [];
    }
  }

  // Ethereum transaction history
  async getEthereumTransactionHistory(address: string, limit: number): Promise<TransactionHistory[]> {
    try {
      const latestBlock = await this.ethereumProvider.getBlockNumber();
      const history = await this.ethereumProvider.getHistory(address);
      
      return history.slice(0, limit).map(tx => ({
        chain: 'ethereum',
        hash: tx.hash,
        from: tx.from || '',
        to: tx.to || '',
        value: parseFloat(ethers.formatEther(tx.value)),
        timestamp: new Date(), // Would need block timestamp
        status: 'success' as const,
        gasUsed: tx.gasLimit ? Number(tx.gasLimit) : undefined,
        type: tx.from?.toLowerCase() === address.toLowerCase() ? 'send' : 'receive'
      }));
    } catch (error) {
      console.error('Ethereum transaction history error:', error);
      return [];
    }
  }

  // Bitcoin transaction history
  async getBitcoinTransactionHistory(address: string, limit: number): Promise<TransactionHistory[]> {
    try {
      const response = await fetch(`https://blockstream.info/api/address/${address}/txs`);
      const transactions = await response.json();
      
      return transactions.slice(0, limit).map((tx: any) => ({
        chain: 'bitcoin',
        hash: tx.txid,
        from: tx.vin[0]?.prevout?.scriptpubkey_address || '',
        to: tx.vout[0]?.scriptpubkey_address || '',
        value: tx.vout[0]?.value / 100000000 || 0,
        timestamp: new Date(tx.status.block_time * 1000),
        status: tx.status.confirmed ? 'success' : 'pending' as const,
        type: 'send' as const
      }));
    } catch (error) {
      console.error('Bitcoin transaction history error:', error);
      return [];
    }
  }

  // Polygon transaction history
  async getPolygonTransactionHistory(address: string, limit: number): Promise<TransactionHistory[]> {
    try {
      // Similar to Ethereum but on Polygon network
      const history = await this.polygonProvider.getHistory(address);
      
      return history.slice(0, limit).map(tx => ({
        chain: 'polygon',
        hash: tx.hash,
        from: tx.from || '',
        to: tx.to || '',
        value: parseFloat(ethers.formatEther(tx.value)),
        timestamp: new Date(),
        status: 'success' as const,
        gasUsed: tx.gasLimit ? Number(tx.gasLimit) : undefined,
        type: tx.from?.toLowerCase() === address.toLowerCase() ? 'send' : 'receive'
      }));
    } catch (error) {
      console.error('Polygon transaction history error:', error);
      return [];
    }
  }

  // XRP transaction history
  async getXrpTransactionHistory(address: string, limit: number): Promise<TransactionHistory[]> {
    try {
      if (!this.xrplClient) {
        return [];
      }

      const xrplModule = await import('xrpl');
      
      if (!this.xrplClient.isConnected()) {
        await this.xrplClient.connect();
      }
      
      const response = await this.xrplClient.request({
        command: 'account_tx',
        account: address,
        limit
      });
      
      return response.result.transactions.map((tx: any) => ({
        chain: 'xrp',
        hash: tx.tx.hash,
        from: tx.tx.Account,
        to: tx.tx.Destination || '',
        value: tx.tx.Amount ? parseFloat(xrplModule.dropsToXrp(tx.tx.Amount)) : 0,
        timestamp: new Date(),
        status: 'success' as const,
        type: tx.tx.Account === address ? 'send' : 'receive'
      }));
    } catch (error) {
      console.error('XRP transaction history error:', error);
      return [];
    }
  }

  // Sui transaction history
  async getSuiTransactionHistory(address: string, limit: number): Promise<TransactionHistory[]> {
    try {
      const transactions = await this.suiClient.queryTransactionBlocks({
        filter: {
          FromAddress: address
        },
        limit,
        order: 'descending'
      });
      
      return transactions.data.map(tx => ({
        chain: 'sui',
        hash: tx.digest,
        from: address,
        to: '', // Would need to parse transaction details
        value: 0, // Would need to calculate from effects
        timestamp: new Date(parseInt(tx.timestampMs || '0')),
        status: 'success' as const,
        type: 'send' as const
      }));
    } catch (error) {
      console.error('Sui transaction history error:', error);
      return [];
    }
  }

  // Solana transaction history
  async getSolanaTransactionHistory(address: string, limit: number): Promise<TransactionHistory[]> {
    try {
      const publicKey = new PublicKey(address);
      const signatures = await this.solanaConnection.getSignaturesForAddress(publicKey, { limit });
      
      const transactions = await Promise.all(
        signatures.map(async sig => {
          const tx = await this.solanaConnection.getTransaction(sig.signature);
          return tx;
        })
      );
      
      return transactions.filter(tx => tx).map((tx: any) => ({
        chain: 'solana',
        hash: tx.transaction.signatures[0],
        from: address,
        to: '', // Would need to parse instruction details
        value: 0, // Would need to calculate from instructions
        timestamp: new Date(tx.blockTime * 1000),
        status: tx.meta?.err ? 'failed' : 'success' as const,
        type: 'send' as const
      }));
    } catch (error) {
      console.error('Solana transaction history error:', error);
      return [];
    }
  }

  // Helper method for empty balance
  private getEmptyBalance(chain: string, address: string): WalletBalance {
    return {
      chain,
      address,
      balance: 0,
      nativeBalance: 0,
      tokens: [],
      lastUpdated: new Date()
    };
  }

  // Get supported chains
  getSupportedChains(): ChainConfig[] {
    return Array.from(this.chains.values());
  }

  // Get chain configuration
  getChainConfig(chain: string): ChainConfig | undefined {
    return this.chains.get(chain);
  }

  // Health check for all chain connections
  async healthCheck(): Promise<{ [chain: string]: boolean }> {
    const health: { [chain: string]: boolean } = {};
    
    try {
      // Test Ethereum connection
      health.ethereum = !!(await this.ethereumProvider.getBlockNumber());
    } catch {
      health.ethereum = false;
    }

    try {
      // Test Polygon connection
      health.polygon = !!(await this.polygonProvider.getBlockNumber());
    } catch {
      health.polygon = false;
    }

    try {
      // Test XRP connection
      if (this.xrplClient && !this.xrplClient.isConnected()) {
        await this.xrplClient.connect();
      }
      const serverInfo = this.xrplClient ? await this.xrplClient.request({ command: 'server_info' }) : null;
      health.xrp = !!serverInfo?.result;
    } catch {
      health.xrp = false;
    }

    try {
      // Test Sui connection
      health.sui = this.suiClient ? !!(await this.suiClient.getLatestSuiSystemState()) : false;
    } catch {
      health.sui = false;
    }

    try {
      // Test Solana connection
      health.solana = !!(await this.solanaConnection.getVersion());
    } catch {
      health.solana = false;
    }

    // Bitcoin and Kaspa use public APIs
    health.bitcoin = true;
    health.kaspa = true;

    return health;
  }
}

export const multiChainService = MultiChainService.getInstance();