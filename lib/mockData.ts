import { Device } from './types';

export const MOCK_DEVICES: Device[] = [
    {
        id: '1',
        name: 'Beef (Proxmox Node)',
        ip: '192.168.1.10',
        type: 'server',
        status: 'online',
        stats: {
            cpuUsage: 45,
            memoryUsage: 12.5,
            memoryTotal: 32,
            temperature: 65,
            uptime: 1209600 // 14 days
        },
        lastSeen: new Date().toISOString()
    },
    {
        id: '2',
        name: 'HP Laptop (Proxmox Node)',
        ip: '192.168.1.11',
        type: 'server',
        status: 'online',
        stats: {
            cpuUsage: 20,
            memoryUsage: 4.2,
            memoryTotal: 16,
            temperature: 55,
            uptime: 604800 // 7 days
        },
        lastSeen: new Date().toISOString()
    },
    {
        id: '3',
        name: 'Cisco 3850',
        ip: '192.168.1.2',
        type: 'switch',
        status: 'online',
        lastSeen: new Date().toISOString()
    },
    {
        id: '4',
        name: 'Pi Watchdog',
        ip: '192.168.1.5',
        type: 'iot',
        status: 'warning',
        stats: {
            cpuUsage: 85,
            memoryUsage: 0.8,
            memoryTotal: 1,
            temperature: 75,
            uptime: 86400 // 1 day
        },
        lastSeen: new Date().toISOString()
    }
];
