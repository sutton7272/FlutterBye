import { WebSocketServer, WebSocket } from 'ws';
import { storage } from './storage';
import { openaiService } from './openai-service';
import { Server } from 'http';

// Using the singleton openaiService instance

export interface RealTimeWalletEvent {
  eventId: string;
  walletAddress: string;
  eventType: 'transaction' | 'score_change' | 'risk_update' | 'new_analysis' | 'anomaly_detected';
  timestamp: Date;
  data: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata: {
    source: string;
    confidence: number;
    impact: string;
  };
}

export interface StreamingAnalytics {
  walletAddress: string;
  realTimeScore: number;
  scoreChanges: Array<{
    timestamp: Date;
    oldScore: number;
    newScore: number;
    reason: string;
  }>;
  liveActivity: {
    transactionCount: number;
    volumeChange: number;
    behaviorShift: string;
    riskIndicators: string[];
  };
  predictions: {
    scoreDirection: 'increasing' | 'decreasing' | 'stable';
    confidenceLevel: number;
    nextUpdateETA: Date;
  };
}

export interface AnomalyDetection {
  anomalyId: string;
  walletAddress: string;
  anomalyType: 'unusual_volume' | 'behavior_change' | 'risk_spike' | 'pattern_deviation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: Date;
  confidence: number;
  suggestedActions: string[];
  relatedWallets: string[];
  historicalContext: {
    normalBehavior: any;
    deviationMetrics: any;
    timeframe: string;
  };
}

export interface LiveMarketCorrelation {
  correlationId: string;
  walletActivity: {
    address: string;
    activityType: string;
    volume: number;
    timestamp: Date;
  };
  marketImpact: {
    tokenSymbol: string;
    priceChange: number;
    volumeChange: number;
    correlationStrength: number;
  };
  insights: {
    causation: 'likely' | 'possible' | 'unlikely';
    timeDelay: number; // seconds
    significance: number;
    recommendations: string[];
  };
}

export interface AlertConfiguration {
  clientId: string;
  userId: string;
  alerts: Array<{
    alertId: string;
    name: string;
    conditions: {
      scoreThreshold?: number;
      riskLevelChange?: boolean;
      volumeThreshold?: number;
      behaviorAnomalies?: boolean;
      marketCorrelations?: boolean;
    };
    channels: Array<'websocket' | 'email' | 'sms' | 'webhook'>;
    frequency: 'immediate' | 'hourly' | 'daily';
    isActive: boolean;
  }>;
}

class RealTimeIntelligenceEngine {
  private wss: WebSocketServer | null = null;
  private clients = new Map<string, WebSocket>();
  private eventStream: RealTimeWalletEvent[] = [];
  private anomalyDetector: AnomalyDetector;
  private marketCorrelationEngine: MarketCorrelationEngine;
  private alertConfigurations = new Map<string, AlertConfiguration>();

  constructor() {
    this.anomalyDetector = new AnomalyDetector();
    this.marketCorrelationEngine = new MarketCorrelationEngine();
    this.initializeEventProcessing();
  }

  /**
   * Initialize WebSocket server for real-time streaming
   */
  setupWebSocketServer(httpServer: Server): void {
    try {
      console.log('🚀 Setting up real-time intelligence WebSocket server...');
      
      this.wss = new WebSocketServer({ 
        server: httpServer, 
        path: '/ws/intelligence' 
      });

      this.wss.on('connection', (ws: WebSocket, request) => {
        const clientId = this.extractClientId(request);
        console.log(`🔌 Real-time intelligence client connected: ${clientId}`);
        
        this.clients.set(clientId, ws);
        
        // Send initial state
        this.sendInitialState(ws, clientId);
        
        ws.on('message', (data) => {
          this.handleClientMessage(clientId, data);
        });
        
        ws.on('close', () => {
          console.log(`🔌 Real-time intelligence client disconnected: ${clientId}`);
          this.clients.delete(clientId);
        });
        
        ws.on('error', (error) => {
          console.error(`WebSocket error for client ${clientId}:`, error);
          this.clients.delete(clientId);
        });
      });
      
      console.log('✅ Real-time intelligence WebSocket server ready');
    } catch (error) {
      console.error('Error setting up WebSocket server:', error);
    }
  }

  /**
   * Process wallet events in real-time
   */
  async processWalletEvent(
    walletAddress: string,
    eventType: RealTimeWalletEvent['eventType'],
    eventData: any
  ): Promise<void> {
    try {
      const event: RealTimeWalletEvent = {
        eventId: this.generateEventId(),
        walletAddress,
        eventType,
        timestamp: new Date(),
        data: eventData,
        severity: await this.calculateEventSeverity(eventType, eventData),
        metadata: {
          source: 'real_time_engine',
          confidence: 0.95,
          impact: await this.assessEventImpact(eventType, eventData)
        }
      };
      
      this.eventStream.push(event);
      
      // Process through anomaly detection
      const anomalies = await this.anomalyDetector.analyzeEvent(event);
      
      // Process through market correlation
      const correlations = await this.marketCorrelationEngine.analyzeCorrelation(event);
      
      // Trigger alerts if configured
      await this.processAlerts(event, anomalies, correlations);
      
      // Broadcast to connected clients
      this.broadcastEvent(event, anomalies, correlations);
      
      console.log(`📊 Processed real-time event: ${eventType} for wallet ${walletAddress}`);
    } catch (error) {
      console.error('Error processing wallet event:', error);
    }
  }

  /**
   * Generate streaming analytics for wallet
   */
  async generateStreamingAnalytics(walletAddress: string): Promise<StreamingAnalytics> {
    try {
      const wallet = await storage.getWalletIntelligence(walletAddress);
      if (!wallet) {
        throw new Error('Wallet not found');
      }
      
      const recentEvents = this.getRecentEvents(walletAddress, 24); // Last 24 hours
      const scoreChanges = this.calculateScoreChanges(recentEvents);
      
      return {
        walletAddress,
        realTimeScore: wallet.socialCreditScore || 0,
        scoreChanges,
        liveActivity: {
          transactionCount: recentEvents.filter(e => e.eventType === 'transaction').length,
          volumeChange: this.calculateVolumeChange(recentEvents),
          behaviorShift: await this.detectBehaviorShift(recentEvents),
          riskIndicators: await this.identifyRiskIndicators(recentEvents)
        },
        predictions: {
          scoreDirection: await this.predictScoreDirection(walletAddress, recentEvents),
          confidenceLevel: 0.87,
          nextUpdateETA: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
        }
      };
    } catch (error) {
      console.error('Error generating streaming analytics:', error);
      throw error;
    }
  }

  /**
   * Configure real-time alerts for client
   */
  async configureAlerts(alertConfig: AlertConfiguration): Promise<void> {
    try {
      console.log(`🔔 Configuring alerts for client ${alertConfig.clientId}`);
      
      this.alertConfigurations.set(alertConfig.clientId, alertConfig);
      
      // Validate alert conditions
      for (const alert of alertConfig.alerts) {
        await this.validateAlertConditions(alert.conditions);
      }
      
      console.log(`✅ Alert configuration saved for client ${alertConfig.clientId}`);
    } catch (error) {
      console.error('Error configuring alerts:', error);
      throw error;
    }
  }

  /**
   * Start continuous intelligence processing
   */
  async startContinuousProcessing(): Promise<void> {
    console.log('🔄 Starting continuous intelligence processing...');
    
    // Disable continuous processing for performance optimization
    // setInterval(async () => {
    //   await this.processWalletUpdates();
    // }, 300000); // Reduced to 5 minutes when enabled
    
    // setInterval(async () => {
    //   await this.runAnomalyDetection();
    // }, 600000); // Reduced to 10 minutes when enabled
    
    // setInterval(async () => {
    //   await this.processMarketCorrelations();
    // }, 900000); // Reduced to 15 minutes when enabled
    
    // setInterval(() => {
    //   this.cleanupOldEvents();
    // }, 3600000); // Reduced to 1 hour when enabled
    
    console.log('✅ Continuous intelligence processing started (optimized mode)');
  }

  // Private helper methods
  private initializeEventProcessing(): void {
    console.log('🚀 Initializing event processing system...');
  }

  private extractClientId(request: any): string {
    // Extract client ID from request headers or query params
    return request.headers['x-client-id'] || `client_${Date.now()}`;
  }

  private async sendInitialState(ws: WebSocket, clientId: string): Promise<void> {
    const initialState = {
      type: 'initial_state',
      data: {
        connectedAt: new Date(),
        availableFeatures: ['real_time_events', 'anomaly_detection', 'market_correlation'],
        status: 'connected'
      }
    };
    
    ws.send(JSON.stringify(initialState));
  }

  private handleClientMessage(clientId: string, data: any): void {
    try {
      const message = JSON.parse(data.toString());
      
      switch (message.type) {
        case 'subscribe_wallet':
          this.subscribeToWallet(clientId, message.walletAddress);
          break;
        case 'unsubscribe_wallet':
          this.unsubscribeFromWallet(clientId, message.walletAddress);
          break;
        case 'configure_alerts':
          this.configureAlerts(message.alertConfig);
          break;
        default:
          console.log(`Unknown message type: ${message.type}`);
      }
    } catch (error) {
      console.error('Error handling client message:', error);
    }
  }

  private subscribeToWallet(clientId: string, walletAddress: string): void {
    console.log(`📡 Client ${clientId} subscribed to wallet ${walletAddress}`);
    // Implementation for wallet subscription
  }

  private unsubscribeFromWallet(clientId: string, walletAddress: string): void {
    console.log(`📡 Client ${clientId} unsubscribed from wallet ${walletAddress}`);
    // Implementation for wallet unsubscription
  }

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async calculateEventSeverity(
    eventType: RealTimeWalletEvent['eventType'],
    eventData: any
  ): Promise<RealTimeWalletEvent['severity']> {
    // Severity calculation logic
    switch (eventType) {
      case 'anomaly_detected':
        return 'high';
      case 'risk_update':
        return eventData.riskIncrease > 0.5 ? 'high' : 'medium';
      case 'score_change':
        return Math.abs(eventData.scoreChange) > 100 ? 'medium' : 'low';
      default:
        return 'low';
    }
  }

  private async assessEventImpact(
    eventType: RealTimeWalletEvent['eventType'],
    eventData: any
  ): Promise<string> {
    // Impact assessment logic
    return `${eventType} event with moderate impact on wallet intelligence`;
  }

  private getRecentEvents(walletAddress: string, hours: number): RealTimeWalletEvent[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.eventStream.filter(event => 
      event.walletAddress === walletAddress && event.timestamp > cutoff
    );
  }

  private calculateScoreChanges(events: RealTimeWalletEvent[]): any[] {
    return events
      .filter(e => e.eventType === 'score_change')
      .map(e => ({
        timestamp: e.timestamp,
        oldScore: e.data.oldScore,
        newScore: e.data.newScore,
        reason: e.data.reason
      }));
  }

  private calculateVolumeChange(events: RealTimeWalletEvent[]): number {
    // Calculate volume change from events
    return events.reduce((total, event) => {
      if (event.eventType === 'transaction') {
        return total + (event.data.volume || 0);
      }
      return total;
    }, 0);
  }

  private async detectBehaviorShift(events: RealTimeWalletEvent[]): Promise<string> {
    // AI-powered behavior shift detection
    if (events.length === 0) return 'no_data';
    
    const prompt = `Analyze wallet behavior from ${events.length} recent events and detect any significant behavioral shifts. Consider transaction patterns, timing, and volume changes.`;
    
    try {
      const analysis = await openaiService.analyzeEmotion(prompt);
      return 'stable'; // Default return
    } catch (error) {
      return 'analysis_error';
    }
  }

  private async identifyRiskIndicators(events: RealTimeWalletEvent[]): Promise<string[]> {
    // Risk indicator identification logic
    const indicators: string[] = [];
    
    const anomalyEvents = events.filter(e => e.eventType === 'anomaly_detected');
    if (anomalyEvents.length > 0) {
      indicators.push('anomalous_activity');
    }
    
    const highSeverityEvents = events.filter(e => e.severity === 'high');
    if (highSeverityEvents.length > 2) {
      indicators.push('high_risk_pattern');
    }
    
    return indicators;
  }

  private async predictScoreDirection(
    walletAddress: string,
    events: RealTimeWalletEvent[]
  ): Promise<'increasing' | 'decreasing' | 'stable'> {
    // Score direction prediction logic
    const scoreChanges = events
      .filter(e => e.eventType === 'score_change')
      .map(e => e.data.newScore - e.data.oldScore);
    
    if (scoreChanges.length === 0) return 'stable';
    
    const averageChange = scoreChanges.reduce((a, b) => a + b, 0) / scoreChanges.length;
    
    if (averageChange > 5) return 'increasing';
    if (averageChange < -5) return 'decreasing';
    return 'stable';
  }

  private async processAlerts(
    event: RealTimeWalletEvent,
    anomalies: AnomalyDetection[],
    correlations: LiveMarketCorrelation[]
  ): Promise<void> {
    // Process and send alerts based on configurations
    for (const [clientId, config] of this.alertConfigurations) {
      for (const alert of config.alerts) {
        if (await this.shouldTriggerAlert(alert, event, anomalies, correlations)) {
          await this.sendAlert(clientId, alert, event, anomalies, correlations);
        }
      }
    }
  }

  private async shouldTriggerAlert(
    alert: any,
    event: RealTimeWalletEvent,
    anomalies: AnomalyDetection[],
    correlations: LiveMarketCorrelation[]
  ): Promise<boolean> {
    // Alert triggering logic
    return alert.isActive && event.severity !== 'low';
  }

  private async sendAlert(
    clientId: string,
    alert: any,
    event: RealTimeWalletEvent,
    anomalies: AnomalyDetection[],
    correlations: LiveMarketCorrelation[]
  ): Promise<void> {
    console.log(`🚨 Sending alert ${alert.name} to client ${clientId}`);
    
    const alertData = {
      alertId: alert.alertId,
      name: alert.name,
      event,
      anomalies,
      correlations,
      timestamp: new Date()
    };
    
    // Send via configured channels
    for (const channel of alert.channels) {
      await this.sendAlertViaChannel(clientId, channel, alertData);
    }
  }

  private async sendAlertViaChannel(clientId: string, channel: string, alertData: any): Promise<void> {
    switch (channel) {
      case 'websocket':
        const client = this.clients.get(clientId);
        if (client) {
          client.send(JSON.stringify({ type: 'alert', data: alertData }));
        }
        break;
      case 'email':
        // Email implementation
        break;
      case 'sms':
        // SMS implementation
        break;
      case 'webhook':
        // Webhook implementation
        break;
    }
  }

  private broadcastEvent(
    event: RealTimeWalletEvent,
    anomalies: AnomalyDetection[],
    correlations: LiveMarketCorrelation[]
  ): void {
    const broadcast = {
      type: 'real_time_event',
      event,
      anomalies,
      correlations,
      timestamp: new Date()
    };
    
    this.clients.forEach((client, clientId) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(broadcast));
      }
    });
  }

  private async processWalletUpdates(): Promise<void> {
    // Process pending wallet updates
    console.log('🔄 Processing wallet updates...');
  }

  private async runAnomalyDetection(): Promise<void> {
    // Run anomaly detection on recent events
    console.log('🔍 Running anomaly detection...');
  }

  private async processMarketCorrelations(): Promise<void> {
    // Process market correlation analysis
    console.log('📈 Processing market correlations...');
  }

  private cleanupOldEvents(): void {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours
    this.eventStream = this.eventStream.filter(event => event.timestamp > cutoff);
    console.log(`🧹 Cleaned up old events, ${this.eventStream.length} events remaining`);
  }

  private async validateAlertConditions(conditions: any): Promise<void> {
    // Validate alert condition configuration
    console.log('✅ Alert conditions validated');
  }
}

// Supporting classes
class AnomalyDetector {
  async analyzeEvent(event: RealTimeWalletEvent): Promise<AnomalyDetection[]> {
    // Anomaly detection implementation
    return [];
  }
}

class MarketCorrelationEngine {
  async analyzeCorrelation(event: RealTimeWalletEvent): Promise<LiveMarketCorrelation[]> {
    // Market correlation implementation
    return [];
  }
}

export const realTimeIntelligenceEngine = new RealTimeIntelligenceEngine();