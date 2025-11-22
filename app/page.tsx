'use client';

import React, { useEffect, useState } from 'react';
import DeviceCard from '@/components/Dashboard/DeviceCard';
import { Device } from '@/lib/types';

export default function Home() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch('/api/devices');
        if (response.ok) {
          const data = await response.json();
          setDevices(data);
        }
      } catch (error) {
        console.error('Failed to fetch devices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
    // Poll every 5 seconds
    const interval = setInterval(fetchDevices, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-gray-400 mt-1">Overview of your homelab status</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-card border border-card-border rounded-lg">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm font-medium">System Healthy</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading devices...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onUpdate={() => {
                // Trigger a re-fetch immediately
                const fetchDevices = async () => {
                  const response = await fetch('/api/devices');
                  if (response.ok) {
                    const data = await response.json();
                    setDevices(data);
                  }
                };
                fetchDevices();
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
