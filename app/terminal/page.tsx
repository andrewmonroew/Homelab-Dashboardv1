'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Device } from '@/lib/types';

const WebTerminal = dynamic(() => import('@/components/Terminal/WebTerminal'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[600px] bg-card border border-card-border rounded-xl flex items-center justify-center text-gray-500">
            Loading Terminal...
        </div>
    ),
});

export default function TerminalPage() {
    const [devices, setDevices] = useState<Device[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const response = await fetch('/api/devices');
                if (response.ok) {
                    const data = await response.json();
                    setDevices(data);
                    if (data.length > 0 && !selectedDeviceId) {
                        setSelectedDeviceId(data[0].id);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch devices:', error);
            }
        };

        fetchDevices();
    }, [selectedDeviceId]);

    const selectedDevice = devices.find(d => d.id === selectedDeviceId);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">SSH Terminal</h2>
                    <p className="text-gray-400 mt-1">Web-based access to your homelab gateway</p>
                </div>

                <div className="flex items-center gap-3">
                    <label htmlFor="device-select" className="text-sm font-medium text-gray-400">
                        Connect to:
                    </label>
                    <select
                        id="device-select"
                        value={selectedDeviceId}
                        onChange={(e) => setSelectedDeviceId(e.target.value)}
                        className="bg-card border border-card-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                        {devices.map((device) => (
                            <option key={device.id} value={device.id}>
                                {device.name} ({device.ip})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <WebTerminal deviceName={selectedDevice?.name} deviceId={selectedDeviceId} />
        </div>
    );
}
