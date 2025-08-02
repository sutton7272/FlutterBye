import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Zap, 
  TrendingUp, 
  Globe, 
  Play, 
  Pause,
  RotateCcw,
  Settings2,
  Maximize2
} from 'lucide-react';

interface HeatmapNode {
  id: string;
  x: number;
  y: number;
  value: number;
  type: 'mint' | 'transfer' | 'redeem' | 'sms';
  message: string;
  timestamp: Date;
  walletAddress: string;
  intensity: number;
  connections: string[];
}

interface HeatmapConnection {
  from: string;
  to: string;
  value: number;
  type: 'token_flow' | 'value_flow';
  timestamp: Date;
}

export function TransactionHeatmap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  const [nodes, setNodes] = useState<HeatmapNode[]>([]);
  const [connections, setConnections] = useState<HeatmapConnection[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [intensity, setIntensity] = useState([75]);
  const [timeScale, setTimeScale] = useState([100]);
  const [selectedNode, setSelectedNode] = useState<HeatmapNode | null>(null);
  const [stats, setStats] = useState({
    activeNodes: 0,
    totalVolume: 0,
    peakActivity: 0,
    networkDensity: 0
  });

  // Initialize canvas and start animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize with some nodes
    generateInitialNodes();

    // Start animation loop
    if (isPlaying) {
      animate();
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  // WebSocket connection for real-time data
  useEffect(() => {
    if (!isPlaying) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      // WebSocket connected
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      if (message.type === 'transaction') {
        const newNode: HeatmapNode = {
          ...message.data,
          timestamp: new Date(message.data.timestamp),
          intensity: 100,
          connections: []
        };
        
        setNodes(prev => {
          // Connect to nearby nodes
          const nearby = prev.filter(node => {
            const distance = Math.sqrt(
              Math.pow(node.x - newNode.x, 2) + Math.pow(node.y - newNode.y, 2)
            );
            return distance < 150 && Math.random() > 0.7;
          });

          newNode.connections = nearby.map(n => n.id).slice(0, 3);

          // Create connections
          const newConnections: HeatmapConnection[] = nearby.slice(0, 2).map(targetNode => ({
            from: newNode.id,
            to: targetNode.id,
            value: Math.random() * 50,
            type: Math.random() > 0.5 ? 'token_flow' : 'value_flow',
            timestamp: new Date()
          }));

          setConnections(prevConn => [...prevConn, ...newConnections].slice(-50));

          const updated = [...prev, newNode].slice(-30);
          return updated;
        });
        
        // Update stats
        updateStats();
      } else if (message.type === 'init') {
        // Initialize with any existing data
        if (message.data.nodes) {
          setNodes(message.data.nodes);
        }
        if (message.data.connections) {
          setConnections(message.data.connections);
        }
      }
    };

    socket.onclose = () => {
      // WebSocket disconnected
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Cleanup old nodes
    const cleanupInterval = setInterval(() => {
      cleanupOldNodes();
    }, 2000);

    return () => {
      socket.close();
      clearInterval(cleanupInterval);
    };
  }, [isPlaying]);

  const generateInitialNodes = () => {
    const initialNodes: HeatmapNode[] = [];
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = canvas.getBoundingClientRect();

    // Create initial network of nodes
    for (let i = 0; i < 15; i++) {
      const node: HeatmapNode = {
        id: `node_${i}`,
        x: Math.random() * width,
        y: Math.random() * height,
        value: Math.random() * 100,
        type: ['mint', 'transfer', 'redeem', 'sms'][Math.floor(Math.random() * 4)] as any,
        message: generateRandomMessage(),
        timestamp: new Date(Date.now() - Math.random() * 60000),
        walletAddress: generateRandomWallet(),
        intensity: Math.random() * 100,
        connections: []
      };
      initialNodes.push(node);
    }

    setNodes(initialNodes);
  };

  const addNewTransaction = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = canvas.getBoundingClientRect();
    
    const newNode: HeatmapNode = {
      id: `node_${Date.now()}_${Math.random()}`,
      x: Math.random() * width,
      y: Math.random() * height,
      value: Math.random() * 200,
      type: ['mint', 'transfer', 'redeem', 'sms'][Math.floor(Math.random() * 4)] as any,
      message: generateRandomMessage(),
      timestamp: new Date(),
      walletAddress: generateRandomWallet(),
      intensity: 100, // Start at full intensity
      connections: []
    };

    // Connect to nearby nodes
    setNodes(prev => {
      const nearby = prev.filter(node => {
        const distance = Math.sqrt(
          Math.pow(node.x - newNode.x, 2) + Math.pow(node.y - newNode.y, 2)
        );
        return distance < 150 && Math.random() > 0.7;
      });

      newNode.connections = nearby.map(n => n.id).slice(0, 3);

      // Create connections
      const newConnections: HeatmapConnection[] = nearby.slice(0, 2).map(targetNode => ({
        from: newNode.id,
        to: targetNode.id,
        value: Math.random() * 50,
        type: Math.random() > 0.5 ? 'token_flow' : 'value_flow',
        timestamp: new Date()
      }));

      setConnections(prevConn => [...prevConn, ...newConnections].slice(-50));

      return [...prev, newNode].slice(-30); // Keep last 30 nodes
    });
  };

  const cleanupOldNodes = () => {
    const now = Date.now();
    setNodes(prev => prev.map(node => ({
      ...node,
      intensity: Math.max(0, node.intensity - 2) // Fade over time
    })).filter(node => node.intensity > 0));

    setConnections(prev => prev.filter(conn => 
      now - conn.timestamp.getTime() < 30000 // Remove connections older than 30s
    ));
  };

  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { width, height } = canvas.getBoundingClientRect();
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background grid
    drawGrid(ctx, width, height);

    // Draw connections first (behind nodes)
    connections.forEach(connection => {
      drawConnection(ctx, connection);
    });

    // Draw nodes
    nodes.forEach(node => {
      drawNode(ctx, node);
    });

    // Draw pulse effects
    drawPulseEffects(ctx);

    // Draw network statistics
    drawNetworkStats(ctx, width);

    // Continue animation
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = 'rgba(100, 100, 255, 0.1)';
    ctx.lineWidth = 0.5;
    
    const gridSize = 40;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawNode = (ctx: CanvasRenderingContext2D, node: HeatmapNode) => {
    const alpha = node.intensity / 100;
    const size = 4 + (node.value / 50);
    
    // Node color based on type
    const colors = {
      mint: `rgba(34, 197, 94, ${alpha})`,
      transfer: `rgba(59, 130, 246, ${alpha})`,
      redeem: `rgba(168, 85, 247, ${alpha})`,
      sms: `rgba(239, 68, 68, ${alpha})`
    };

    // Draw node
    ctx.fillStyle = colors[node.type];
    ctx.beginPath();
    ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
    ctx.fill();

    // Draw outer glow
    const gradient = ctx.createRadialGradient(node.x, node.y, size, node.x, node.y, size * 3);
    gradient.addColorStop(0, colors[node.type]);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(node.x, node.y, size * 3, 0, 2 * Math.PI);
    ctx.fill();

    // Draw value text for high-value nodes
    if (node.value > 80) {
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(Math.round(node.value).toString(), node.x, node.y - size - 5);
    }
  };

  const drawConnection = (ctx: CanvasRenderingContext2D, connection: HeatmapConnection) => {
    const fromNode = nodes.find(n => n.id === connection.from);
    const toNode = nodes.find(n => n.id === connection.to);
    
    if (!fromNode || !toNode) return;

    const age = Date.now() - connection.timestamp.getTime();
    const alpha = Math.max(0, 1 - age / 30000); // Fade over 30 seconds

    ctx.strokeStyle = connection.type === 'token_flow' 
      ? `rgba(59, 130, 246, ${alpha * 0.6})` 
      : `rgba(34, 197, 94, ${alpha * 0.6})`;
    ctx.lineWidth = 1 + (connection.value / 25);
    
    // Animated flow effect
    const animationOffset = (Date.now() / 1000) % 1;
    ctx.setLineDash([5, 5]);
    ctx.lineDashOffset = -animationOffset * 10;
    
    ctx.beginPath();
    ctx.moveTo(fromNode.x, fromNode.y);
    ctx.lineTo(toNode.x, toNode.y);
    ctx.stroke();
    
    ctx.setLineDash([]);
  };

  const drawPulseEffects = (ctx: CanvasRenderingContext2D) => {
    const time = Date.now() / 1000;
    
    nodes.forEach(node => {
      if (node.intensity > 80) {
        const pulseSize = 20 + Math.sin(time * 3 + node.x * 0.01) * 10;
        const pulseAlpha = (Math.sin(time * 2 + node.y * 0.01) + 1) * 0.1;
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${pulseAlpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize, 0, 2 * Math.PI);
        ctx.stroke();
      }
    });
  };

  const updateStats = () => {
    setStats({
      activeNodes: nodes.filter(n => n.intensity > 50).length,
      totalVolume: nodes.reduce((sum, n) => sum + n.value, 0),
      peakActivity: Math.max(...nodes.map(n => n.intensity), 0),
      networkDensity: (connections.length / Math.max(nodes.length, 1)) * 100
    });
  };

  const drawNetworkStats = (ctx: CanvasRenderingContext2D, width: number) => {
    const stats = {
      nodes: nodes.length,
      connections: connections.length,
      avgIntensity: nodes.length > 0 ? Math.round(nodes.reduce((sum, n) => sum + n.intensity, 0) / nodes.length) : 0
    };

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '12px monospace';
    ctx.textAlign = 'right';
    
    const x = width - 10;
    let y = 30;
    
    ctx.fillText(`Nodes: ${stats.nodes}`, x, y);
    y += 15;
    ctx.fillText(`Connections: ${stats.connections}`, x, y);
    y += 15;
    ctx.fillText(`Avg Intensity: ${stats.avgIntensity}%`, x, y);
  };

  const generateRandomMessage = () => {
    const messages = [
      'thinking of you always',
      'good morning sunshine',
      'StakeForRewards',
      'HodlTillMoon',
      'sorry about yesterday',
      'you got this champ',
      'BullMarketVibes',
      'happy birthday friend'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const generateRandomWallet = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789';
    const start = Array.from({length: 4}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const end = Array.from({length: 4}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `${start}...${end}`;
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find clicked node
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2));
      return distance < 15;
    });

    setSelectedNode(clickedNode || null);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Real-time Transaction Heat Map
              <Badge variant="secondary" className="animate-pulse">
                LIVE
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setNodes([]);
                  setConnections([]);
                  generateInitialNodes();
                }}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.activeNodes}
              </div>
              <div className="text-xs text-muted-foreground">Active Nodes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(stats.totalVolume)}
              </div>
              <div className="text-xs text-muted-foreground">Total Volume</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(stats.peakActivity)}%
              </div>
              <div className="text-xs text-muted-foreground">Peak Activity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(stats.networkDensity)}%
              </div>
              <div className="text-xs text-muted-foreground">Network Density</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Intensity: {intensity[0]}%</label>
              <Slider
                value={intensity}
                onValueChange={setIntensity}
                max={100}
                step={1}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Time Scale: {timeScale[0]}%</label>
              <Slider
                value={timeScale}
                onValueChange={setTimeScale}
                max={200}
                min={50}
                step={10}
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Heatmap Canvas */}
      <Card>
        <CardContent className="p-0">
          <div className="relative">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="w-full h-96 cursor-crosshair bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-lg"
              style={{ imageRendering: 'crisp-edges' }}
            />
            
            {/* Legend */}
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-white">Mint</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-white">Transfer</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-white">Redeem</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-white">SMS</span>
                </div>
              </div>
            </div>

            {/* Node Details Popup */}
            {selectedNode && (
              <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white text-sm max-w-xs">
                <div className="font-semibold mb-2">Transaction Details</div>
                <div className="space-y-1">
                  <div>Type: <span className="capitalize">{selectedNode.type}</span></div>
                  <div>Message: "{selectedNode.message}"</div>
                  <div>Wallet: {selectedNode.walletAddress}</div>
                  <div>Value: {Math.round(selectedNode.value)}</div>
                  <div>Intensity: {Math.round(selectedNode.intensity)}%</div>
                  <div>Time: {selectedNode.timestamp.toLocaleTimeString()}</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedNode(null)}
                  className="mt-2 w-full"
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Recent Network Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {nodes
              .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
              .slice(0, 10)
              .map(node => (
                <div
                  key={node.id}
                  className="flex items-center justify-between p-2 rounded bg-muted/30 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      node.type === 'mint' ? 'bg-green-500' :
                      node.type === 'transfer' ? 'bg-blue-500' :
                      node.type === 'redeem' ? 'bg-purple-500' : 'bg-red-500'
                    }`}></div>
                    <span>"{node.message}"</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {node.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}