import React from 'react';

export default function SectionHeader({ title, subtitle, right, icon }) {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                marginBottom: 24,
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {icon ? <div style={{ display: 'flex', alignItems: 'center' }}>{icon}</div> : null}
                    <h3 style={{ margin: 0, color: '#0f172a', fontSize: 20, fontWeight: 850, letterSpacing: '-0.02em' }}>
                        {title}
                    </h3>
                </div>
                {subtitle ? (
                    <p style={{ margin: 0, color: '#64748b', fontSize: 14, fontWeight: 500, lineHeight: 1.5 }}>{subtitle}</p>
                ) : null}
            </div>
            {right ? <div>{right}</div> : null}
        </div>
    );
}

