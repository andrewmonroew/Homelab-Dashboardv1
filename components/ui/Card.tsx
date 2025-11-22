import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

export function Card({ children, className = '', title }: CardProps) {
    return (
        <div className={`bg-card border border-card-border rounded-xl p-6 ${className}`}>
            {title && (
                <h3 className="text-lg font-semibold mb-4 text-foreground">{title}</h3>
            )}
            {children}
        </div>
    );
}
