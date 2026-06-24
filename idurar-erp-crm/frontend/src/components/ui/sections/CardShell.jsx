import React from 'react';

export default function CardShell({ children, style, className }) {
    return (
        <div
            className={className}
            style={{
                background: '#fff',
                padding: 32,
                borderRadius: 32,
                border: '1px solid #f1f5f9',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                height: '100%',
                ...style,
            }}
        >
            {children}
        </div>
    );
}

