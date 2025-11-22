import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'homelab.db');
const db = new Database(dbPath);

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS devices (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    ip TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    last_seen TEXT,
    cpu_usage REAL,
    memory_usage REAL,
    memory_total REAL,
    temperature REAL,
    uptime INTEGER,
    username TEXT,
    password TEXT
  )
`);

// Export a function to seed the database
export function seedDatabase() {
    const count = db.prepare('SELECT COUNT(*) as count FROM devices').get() as { count: number };

    if (count.count === 0) {
        console.log('Seeding database with initial data...');

        const insert = db.prepare(`
      INSERT INTO devices (id, name, ip, type, status, last_seen, cpu_usage, memory_usage, memory_total, temperature, uptime, username, password)
      VALUES (@id, @name, @ip, @type, @status, @last_seen, @cpu_usage, @memory_usage, @memory_total, @temperature, @uptime, @username, @password)
    `);

        const mockDevices = [
            {
                id: '1',
                name: 'Beef (Proxmox Node)',
                ip: '192.168.1.10',
                type: 'server',
                status: 'online',
                last_seen: new Date().toISOString(),
                cpu_usage: 45,
                memory_usage: 60,
                memory_total: 100,
                temperature: 55,
                uptime: 86400,
                username: 'root',
                password: 'password'
            },
            {
                id: '2',
                name: 'HP Laptop (Proxmox Node)',
                ip: '192.168.1.11',
                type: 'server',
                status: 'online',
                last_seen: new Date().toISOString(),
                cpu_usage: 32,
                memory_usage: 48,
                memory_total: 100,
                temperature: 48,
                uptime: 172800,
                username: 'root',
                password: 'password'
            },
            {
                id: '3',
                name: 'Cisco 3850',
                ip: '192.168.1.1',
                type: 'switch',
                status: 'online',
                last_seen: new Date().toISOString(),
                cpu_usage: 15,
                memory_usage: 35,
                memory_total: 100,
                temperature: 42,
                uptime: 2592000,
                username: null,
                password: null
            },
            {
                id: '4',
                name: 'Pi Watchdog',
                ip: '192.168.1.100',
                type: 'iot',
                status: 'online',
                last_seen: new Date().toISOString(),
                cpu_usage: 8,
                memory_usage: 25,
                memory_total: 100,
                temperature: 38,
                uptime: 604800,
                username: 'pi',
                password: 'raspberry'
            }
        ];

        const insertMany = db.transaction((devices) => {
            for (const device of devices) {
                insert.run(device);
            }
        });

        insertMany(mockDevices);
        console.log('Database seeded successfully!');
    }
}

export default db;
