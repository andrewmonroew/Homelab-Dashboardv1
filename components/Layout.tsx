import React from 'react';
import Link from 'next/link';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-card-border bg-card p-6 flex flex-col">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-primary">Homelab</h1>
                </div>

                <nav className="flex-1 space-y-2">
                    <NavLink href="/" label="Dashboard" />
                    <NavLink href="/devices/new" label="Add Device" />
                    <NavLink href="/terminal" label="Terminal" />
                </nav>

                <div className="mt-auto pt-6 border-t border-card-border">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                            AD
                        </div>
                        <div className="text-sm">
                            <p className="font-medium">Admin</p>
                            <p className="text-xs text-gray-400">Online</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-auto">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}

function NavLink({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-foreground hover:bg-white/5 transition-colors"
        >
            {label}
        </Link>
    );
}
