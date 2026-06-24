import React from 'react';
import { Button, Empty } from 'antd';

export default function EmptyState({
    title = 'No records',
    description = 'Try adjusting your filters or search.',
    action,
}) {
    return (
        <div style={{ padding: 24 }}>
            <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                    <span style={{ color: '#64748b', fontWeight: 500, fontSize: 14 }}>{title}</span>
                }
            />
            {description ? (
                <p style={{ margin: '-10px 0 16px', color: '#94a3b8', fontWeight: 500, fontSize: 13 }}>{description}</p>
            ) : null}
            {action ? <div style={{ marginTop: 8 }}>{action}</div> : null}
        </div>
    );
}

