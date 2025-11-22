import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'homelab.db');
const db = new Database(dbPath);

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS devices (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    ip TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    username TEXT,
    password TEXT,
    last_seen TEXT,
    cpu_usage REAL,
    memory_usage REAL,
    memory_total REAL,
    temperature REAL,
    uptime INTEGER
  )
`);

// Seed mock data if empty
const count = db.prepare('SELECT count(*) as count FROM devices').get() as { count: number };
if (count.count === 0) {
    const insert = db.prepare(`
    INSERT INTO devices (id, name, ip, type, status, username, password, last_seen, cpu_usage, memory_usage, memory_total, temperature, uptime)
    VALUES (@id, @name, @ip, @type, @status, @username, @password, @lastSeen, @cpuUsage, @memoryUsage, @memoryTotal, @temperature, @uptime)
  `);

    const MOCK_DEVICES = [
        {
            id: '1',
            name: 'Beef (Proxmox Node)',
            ip: '192.168.1.10',
            type: 'server',
            status: 'online',
            username: 'root',
            password: 'password',
            lastSeen: new Date().toISOString(),
            cpuUsage: 45,
            memoryUsage: 12.5,
            memoryTotal: 32,
            temperature: 65,
            uptime: 1209600
        },
        {
            id: '2',
            name: 'HP Laptop (Proxmox Node)',
            ip: '192.168.1.11',
            type: 'server',
            status: 'online',
            username: 'root',
            password: 'password',
            lastSeen: new Date().toISOString(),
            cpuUsage: 20,
            memoryUsage: 4.2,
            memoryTotal: 16,
            temperature: 55,
            uptime: 604800
        },
        {
            id: '3',
            name: 'Cisco 3850',
            ip: '192.168.1.2',
            type: 'switch',
            status: 'online',
            username: 'admin',
            password: 'password',
            lastSeen: new Date().toISOString(),
            cpuUsage: null,
            memoryUsage: null,
            memoryTotal: null,
            temperature: null,
            uptime: null
        },
        {
            id: '4',
            name: 'Pi Watchdog',
            ip: '192.168.1.5',
            type: 'iot',
            status: 'warning',
            username: 'pi',
            password: 'raspberry',
            lastSeen: new Date().toISOString(),
            cpuUsage: 85,
            memoryUsage: 0.8,
            memoryTotal: 1,
            temperature: 75,
            uptime: 86400
        }
    ];

    const insertTransaction = db.transaction((devices) => {
        for (const device of devices) insert.run(device);
    });

    insertTransaction(MOCK_DEVICES);
}

export default db;
