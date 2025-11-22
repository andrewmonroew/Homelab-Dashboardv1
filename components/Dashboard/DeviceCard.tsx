'use client';

import React, { useState } from 'react';
import { Device } from '@/lib/types';
import EditDeviceModal from './EditDeviceModal';

interface DeviceCardProps {
    device: Device;
    onUpdate?: () => void;
}

export default function DeviceCard({ device, onUpdate }: DeviceCardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online': return 'bg-green-500';
            case 'offline': return 'bg-red-500';
            case 'warning': return 'bg-yellow-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <>
            <div className="bg-card border border-card-border rounded-xl p-6 hover:border-primary/50 transition-colors relative group">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-semibold text-lg">{device.name}</h3>
                        <p className="text-sm text-gray-400">{device.ip}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(device.status)} shadow-[0_0_10px_rgba(0,0,0,0.3)]`} />
                </div>

                {/* Kebab Menu - always visible with scale animation */}
                <div className="absolute top-4 right-12 transition-transform hover:scale-110">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="12" cy="5" r="1"></circle>
                            <circle cx="12" cy="19" r="1"></circle>
                        </svg>
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-[#2a2a2a] border border-card-border rounded-lg shadow-xl z-10 overflow-hidden">
                            <button
                                onClick={() => { setIsEditModalOpen(true); setIsMenuOpen(false); }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                            >
                                Edit
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-3 bg-background rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">CPU</p>
                        <p className="font-mono font-medium text-primary">
                            {device.stats?.cpuUsage ? `${device.stats.cpuUsage}%` : '-'}
                        </p>
                    </div>
                    <div className="text-center p-3 bg-background rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Memory</p>
                        <p className="font-mono font-medium text-primary">
                            {device.stats?.memoryUsage ? `${device.stats.memoryUsage}%` : '-'}
                        </p>
                    </div>
                    <div className="text-center p-3 bg-background rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Temp</p>
                        <p className="font-mono font-medium text-primary">
                            {device.stats?.temperature ?
                                <span>{Math.round((device.stats.temperature * 9 / 5) + 32)}°F</span>
                                : '-'}
                        </p>
                    </div>
                </div>
            </div>

            <EditDeviceModal
                device={device}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={() => {
                    if (onUpdate) onUpdate();
                }}
            />
        </>
    );
}
