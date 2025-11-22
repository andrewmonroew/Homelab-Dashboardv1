'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function NewDevicePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // In a real app, we would POST to an API here
        console.log('Device registered');

        setIsLoading(false);
        router.push('/');
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Add New Device</h2>
                <p className="text-gray-400 mt-1">Register a new device to monitor</p>
            </div>

            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">Device Name</label>
                            <input
                                id="name"
                                required
                                className="w-full px-3 py-2 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="e.g., Proxmox Node 1"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="ip" className="text-sm font-medium">IP Address</label>
                            <input
                                id="ip"
                                required
                                pattern="^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$"
                                className="w-full px-3 py-2 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="e.g., 192.168.1.10"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="type" className="text-sm font-medium">Device Type</label>
                            <select
                                id="type"
                                className="w-full px-3 py-2 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                <option value="server">Server</option>
                                <option value="switch">Switch</option>
                                <option value="iot">IoT Device</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="port" className="text-sm font-medium">SSH Port</label>
                            <input
                                id="port"
                                type="number"
                                defaultValue={22}
                                className="w-full px-3 py-2 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Credentials</label>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <input
                                type="text"
                                placeholder="Username"
                                className="w-full px-3 py-2 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                            <input
                                type="password"
                                placeholder="Password / Key Path"
                                className="w-full px-3 py-2 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                        <p className="text-xs text-gray-500">Credentials are stored securely and encrypted.</p>
                    </div>

                    <div className="pt-4 flex justify-end gap-4">
                        <Button type="button" variant="secondary" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Registering...' : 'Register Device'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
