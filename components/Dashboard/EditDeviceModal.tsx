'use client';

import React, { useState, useEffect } from 'react';
import { Device } from '@/lib/types';

interface EditDeviceModalProps {
    device: Device;
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

export default function EditDeviceModal({ device, isOpen, onClose, onSave }: EditDeviceModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        ip: '',
        type: 'server',
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (device) {
            setFormData({
                name: device.name,
                ip: device.ip,
                type: device.type,
                username: '', // Don't pre-fill sensitive data for security, or fetch if needed
                password: ''
            });
        }
    }, [device]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`/api/devices/${device.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                onSave();
                onClose();
            }
        } catch (error) {
            console.error('Failed to update device:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this device? This action cannot be undone.')) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/devices/${device.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                onSave();
                onClose();
            }
        } catch (error) {
            console.error('Failed to delete device:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card border border-card-border rounded-xl p-6 w-full max-w-md shadow-2xl">
                <h2 className="text-xl font-bold mb-4">Edit Device</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Device Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-background border border-card-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">IP Address</label>
                        <input
                            type="text"
                            required
                            value={formData.ip}
                            onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
                            className="w-full bg-background border border-card-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                            className="w-full bg-background border border-card-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            <option value="server">Server</option>
                            <option value="switch">Switch</option>
                            <option value="iot">IoT Device</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">SSH Username</label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                placeholder="(Unchanged)"
                                className="w-full bg-background border border-card-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">SSH Password</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="(Unchanged)"
                                className="w-full bg-background border border-card-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                    </div>

                    <div className="flex justify-between pt-4 border-t border-card-border mt-6">
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={loading}
                            className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors text-sm font-medium"
                        >
                            {loading ? 'Processing...' : 'Delete Device'}
                        </button>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
                            >
                                Discard
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors text-sm font-medium"
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
