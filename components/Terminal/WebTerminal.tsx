'use client';

import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

interface WebTerminalProps {
    deviceName?: string;
    deviceId?: string;
}

export default function WebTerminal({ deviceName = 'Local Gateway', deviceId }: WebTerminalProps) {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<Terminal | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!terminalRef.current) return;

        // Initialize xterm.js
        const term = new Terminal({
            cursorBlink: true,
            theme: {
                background: '#1e1e1e',
                foreground: '#d4d4d4',
            },
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            fontSize: 14,
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(terminalRef.current);
        fitAddon.fit();

        xtermRef.current = term;
        fitAddonRef.current = fitAddon;

        term.writeln(`Connecting to ${deviceName}...`);

        // WebSocket Connection
        if (deviceId) {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = `${protocol}//${window.location.host}/api/socket?deviceId=${deviceId}`;
            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                term.writeln('Connection established.');
                term.writeln(''); // New line
            };

            ws.onmessage = (event) => {
                term.write(event.data);
            };

            ws.onclose = () => {
                term.writeln('\r\nConnection closed.');
            };

            ws.onerror = (error) => {
                term.writeln('\r\nConnection error.');
                console.error('WebSocket error:', error);
            };

            term.onData((data) => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(data);
                }
            });
        } else {
            term.writeln('No device selected.');
        }

        // Handle resize
        const handleResize = () => fitAddon.fit();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            term.dispose();
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [deviceName, deviceId]);

    return (
        <div
            ref={terminalRef}
            className="w-full h-[600px] bg-[#1e1e1e] rounded-xl overflow-hidden border border-card-border shadow-2xl"
        />
    );
}
