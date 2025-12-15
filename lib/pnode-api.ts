// Xandeum pNode RPC API utilities
// Based on pRPC (pNode RPC) calls from xandeum.network

export interface PNode {
  id: string;
  pubkey: string;
  ip?: string;
  port?: number;
  version?: string;
  lastSeen?: number;
  storageCapacity?: number;
  storageUsed?: number;
  uptime?: number;
  status?: 'online' | 'offline' | 'syncing' | 'healthy' | 'warning' | 'critical';
  reputation?: number;
  region?: string;
  latency?: number;
  totalStake?: number; // in XAN
  recentRewards?: number; // in XAN
}

export interface PNodeStats {
  totalNodes: number;
  onlineNodes: number;
  offlineNodes: number;
  totalStorage: number;
  usedStorage: number;
  averageUptime: number;
}

export interface PNodeLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
}

export interface PNodeReward {
  epoch: number;
  amount: number;
  date: Date;
  status: 'claimed' | 'pending';
}

export function generateMockLogs(count: number = 10): PNodeLog[] {
  const levels: ('info' | 'warning' | 'error' | 'success')[] = ['info', 'info', 'success', 'warning'];
  const messages = [
    'Syncing block headers...',
    'Processed 1024 transactions',
    'Connection to peer established',
    'Garbage collection started',
    'Snapshot saved successfully',
    'High latency detected on neighbor',
    'Reward distribution received',
    'Updating ledger state'
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `log-${Date.now()}-${i}`,
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000)),
    level: levels[Math.floor(Math.random() * levels.length)],
    message: messages[Math.floor(Math.random() * messages.length)]
  })).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export function generateMockRewards(count: number = 5): PNodeReward[] {
  return Array.from({ length: count }, (_, i) => ({
    epoch: 248 - i,
    amount: parseFloat((12 + Math.random() * 5).toFixed(2)),
    date: new Date(Date.now() - i * 86400000 * 2),
    status: i === 0 ? 'pending' : 'claimed'
  }));
}

// Default pRPC endpoint - should be configured based on actual Xandeum network
const PRPC_ENDPOINT = process.env.NEXT_PUBLIC_PRPC_ENDPOINT || 'https://api.xandeum.network';

/**
 * Fetch all pNodes from gossip using pRPC
 */
export async function fetchPNodes(): Promise<PNode[]> {
  try {
    // This is a placeholder - actual implementation depends on Xandeum pRPC API structure
    // Common RPC patterns: POST with JSON-RPC or REST GET endpoint
    const response = await fetch(`${PRPC_ENDPOINT}/pnodes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // For Next.js, we might need to use server-side fetching
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch pNodes: ${response.statusText}`);
    }

    const data = await response.json();

    // Handle different response formats
    if (Array.isArray(data)) {
      return data;
    } else if (data.result && Array.isArray(data.result)) {
      return data.result;
    } else if (data.pnodes && Array.isArray(data.pnodes)) {
      return data.pnodes;
    }

    return [];
  } catch (error) {
    console.error('Error fetching pNodes:', error);
    // Return mock data for development/demo purposes
    return MOCK_PNODES;
  }
}

/**
 * Fetch pNode by pubkey
 */
export async function fetchPNodeByPubkey(pubkey: string): Promise<PNode | null> {
  try {
    const response = await fetch(`${PRPC_ENDPOINT}/pnode/${pubkey}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.result || data.pnode || data;
  } catch (error) {
    console.error('Error fetching pNode:', error);
    return null;
  }
}

/**
 * Calculate statistics from pNode list
 */
export function calculateStats(pNodes: PNode[]): PNodeStats {
  const onlineNodes = pNodes.filter(node => node.status === 'online' || !node.status).length;
  const totalStorage = pNodes.reduce((sum, node) => sum + (node.storageCapacity || 0), 0);
  const usedStorage = pNodes.reduce((sum, node) => sum + (node.storageUsed || 0), 0);
  const uptimes = pNodes.map(node => node.uptime || 0).filter(u => u > 0);
  const averageUptime = uptimes.length > 0
    ? uptimes.reduce((sum, u) => sum + u, 0) / uptimes.length
    : 0;

  return {
    totalNodes: pNodes.length,
    onlineNodes,
    offlineNodes: pNodes.length - onlineNodes,
    totalStorage,
    usedStorage,
    averageUptime,
  };
}

/**
 * Generate mock pNodes for development/demo
 * Remove this when real API is available
 */
// Stable mock data generated once
export const MOCK_PNODES: PNode[] = generateMockPNodes();

/**
 * Generate mock pNodes for development/demo
 * Remove this when real API is available
 */
function generateMockPNodes(): PNode[] {
  const regions = ['US-East', 'US-West', 'EU', 'Asia-Pacific', 'South America'];

  // Create some specific nodes that match what we might see in screenshots or for testing
  const fixedNodes: PNode[] = [
    {
      id: 'pNode-Alpha-001',
      pubkey: 'XandeumAlpha001' + '0'.repeat(30),
      ip: '192.168.1.101',
      port: 8899,
      version: 'v2.1.8-beta',
      lastSeen: Date.now(),
      storageCapacity: 1000,
      storageUsed: 800,
      uptime: 99.98,
      status: 'online',
      reputation: 98,
      region: 'New York, USA',
      latency: 45,
      totalStake: 50000,
      recentRewards: 125.50
    },
    {
      id: 'pNode-Beta-002',
      pubkey: 'XandeumBeta002' + '0'.repeat(30),
      ip: '192.168.1.102',
      port: 8900,
      version: 'v2.1.7',
      lastSeen: Date.now() - 3600000,
      storageCapacity: 2000,
      storageUsed: 1500,
      uptime: 92.5,
      status: 'warning',
      reputation: 85,
      region: 'London, UK',
      latency: 120,
      totalStake: 35000,
      recentRewards: 80.25
    },
    {
      id: 'pNode-Gamma-003',
      pubkey: 'XandeumGamma003' + '0'.repeat(30),
      ip: '192.168.1.103',
      port: 8901,
      version: 'v2.0.0',
      lastSeen: Date.now() - 86400000,
      storageCapacity: 500,
      storageUsed: 100,
      uptime: 0,
      status: 'offline',
      reputation: 40,
      region: 'Tokyo, JP',
      latency: 0,
      totalStake: 10000,
      recentRewards: 0
    },
    {
      id: 'pNode-Delta-004',
      pubkey: 'XandeumDelta004' + '0'.repeat(30),
      ip: '192.168.1.104',
      port: 8902,
      version: 'v2.1.8',
      lastSeen: Date.now(),
      storageCapacity: 1500,
      storageUsed: 750,
      uptime: 99.5,
      status: 'online',
      reputation: 95,
      region: 'Sydney, AU',
      latency: 180,
      totalStake: 45000,
      recentRewards: 110.00
    },
    {
      id: 'pNode-Epsilon-005',
      pubkey: 'XandeumEpsilon005' + '0'.repeat(30),
      ip: '192.168.1.105',
      port: 8903,
      version: 'v2.1.9-rc',
      lastSeen: Date.now(),
      storageCapacity: 1200,
      storageUsed: 1100,
      uptime: 98.2,
      status: 'online',
      reputation: 90,
      region: 'Berlin, DE',
      latency: 60,
      totalStake: 42000,
      recentRewards: 95.50
    }
  ];

  // Fill the rest with random nodes
  const randomNodes = Array.from({ length: 20 }, (_, i) => {
    const storageCapacity = Math.floor(Math.random() * 1000 + 100);
    const storageUsed = Math.floor(storageCapacity * (0.3 + Math.random() * 0.5));
    const uptime = parseFloat((85 + Math.random() * 15).toFixed(2));

    const nodeStatuses: ('online' | 'offline' | 'warning')[] = ['online', 'online', 'online', 'warning'];
    const status = nodeStatuses[Math.floor(Math.random() * nodeStatuses.length)];
    const totalStake = Math.floor(Math.random() * 50000) + 20000;
    const recentRewards = parseFloat((totalStake * (0.01 + Math.random() * 0.02)).toFixed(2));

    return {
      id: `pNode-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      pubkey: `Xandeum${i + 6}${'0'.repeat(30)}`,
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      port: 8899 + i + 5,
      version: `1.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}`,
      lastSeen: Date.now() - Math.random() * 3600000,
      storageCapacity,
      storageUsed,
      uptime: status === 'offline' ? 0 : uptime,
      status: status,
      reputation: Math.floor(70 + Math.random() * 30),
      region: regions[Math.floor(Math.random() * regions.length)],
      latency: Math.floor(Math.random() * 200 + 10),
      totalStake,
      recentRewards,
    };
  });

  return [...fixedNodes, ...randomNodes];
}

