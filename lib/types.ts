export interface SystemStats {
    cpuUsage: number;
    memoryUsage: number;
    memoryTotal: number;
    temperature: number;
    uptime: number;
}

export interface Device {
    id: string;
    name: string;
    ip: string;
    type: 'server' | 'switch' | 'iot';
    status: 'online' | 'offline' | 'warning';
    stats?: SystemStats;
    lastSeen: string;
}
