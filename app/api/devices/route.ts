import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { Device, SystemStats } from '@/lib/types';

export async function GET() {
    try {
        const rows = db.prepare('SELECT * FROM devices').all() as any[];

        const devices: Device[] = rows.map(row => {
            let stats: SystemStats | undefined;

            if (row.cpu_usage !== null) {
                stats = {
                    cpuUsage: row.cpu_usage,
                    memoryUsage: row.memory_usage,
                    memoryTotal: row.memory_total,
                    temperature: row.temperature,
                    uptime: row.uptime
                };
            }

            return {
                id: row.id,
                name: row.name,
                ip: row.ip,
                type: row.type,
                status: row.status,
                lastSeen: row.last_seen,
                stats
            };
        });

        return NextResponse.json(devices);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, ip, type } = body;

        const stmt = db.prepare(`
      INSERT INTO devices (id, name, ip, type, status, last_seen)
      VALUES (@id, @name, @ip, @type, 'offline', @lastSeen)
    `);

        const newDevice = {
            id: crypto.randomUUID(),
            name,
            ip,
            type,
            lastSeen: new Date().toISOString()
        };

        stmt.run(newDevice);

        return NextResponse.json(newDevice);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
