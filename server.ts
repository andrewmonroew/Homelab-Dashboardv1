import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { WebSocketServer, WebSocket } from 'ws';
import { Client } from 'ssh2';
import db from './lib/db';

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3001', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer((req, res) => {
        const parsedUrl = parse(req.url!, true);
        handle(req, res, parsedUrl);
    });

    const wss = new WebSocketServer({ noServer: true });

    server.on('upgrade', (request, socket, head) => {
        const { pathname } = parse(request.url!, true);

        if (pathname === '/api/socket') {
            wss.handleUpgrade(request, socket, head, (ws) => {
                wss.emit('connection', ws, request);
            });
        } else {
            socket.destroy();
        }
    });

    wss.on('connection', (ws: WebSocket, req) => {
        const { query } = parse(req.url!, true);
        const deviceId = query.deviceId as string;

        if (!deviceId) {
            ws.close(1008, 'Device ID required');
            return;
        }

        console.log(`Connection request for device: ${deviceId}`);

        // Fetch device credentials from DB
        const device = db.prepare('SELECT * FROM devices WHERE id = ?').get(deviceId) as any;

        if (!device) {
            ws.send('Device not found\\r\\n');
            ws.close();
            return;
        }

        if (!device.username || !device.password) {
            ws.send('No credentials found for this device\\r\\n');
            ws.close();
            return;
        }

        const ssh = new Client();

        ssh.on('ready', () => {
            ws.send(`\\r\\nConnected to ${device.name} (${device.ip})\\r\\n`);

            ssh.shell((err, stream) => {
                if (err) {
                    ws.send(`Error starting shell: ${err.message}\\r\\n`);
                    ws.close();
                    return;
                }

                ws.on('message', (data) => {
                    stream.write(data as Buffer);
                });

                stream.on('data', (data: Buffer) => {
                    ws.send(data.toString());
                });

                stream.on('close', () => {
                    ws.close();
                });

                ws.on('close', () => {
                    stream.end();
                    ssh.end();
                });
            });
        }).on('error', (err) => {
            console.error('SSH Connection Error:', err);
            ws.send(`\\r\\nSSH Connection Error: ${err.message}\\r\\n`);
            ws.send(`(Simulating connection for demo...)\\r\\n`);

            // Fallback for demo/testing if real connection fails
            startSimulation(ws, device);
        }).connect({
            host: device.ip,
            port: 22,
            username: device.username,
            password: device.password,
        });
    });

    server.listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
    });
});

function startSimulation(ws: WebSocket, device: any) {
    ws.send(`\\r\\n[SIMULATION MODE] Connected to ${device.name}\\r\\n`);
    ws.send(`${device.username}@${device.name}:~$ `);

    ws.on('message', (data) => {
        const input = data.toString();

        if (input === '\\r') {
            ws.send('\\r\\n');
            ws.send(`${device.username}@${device.name}:~$ `);
        } else {
            ws.send(input);
        }
    });
}
