import React from 'react';
import { Skeleton } from 'antd';

export default function SkeletonBlock({ active = true, rows = 3, style }) {
    return (
        <div style={style}>
            <Skeleton active={active} paragraph={{ rows }} />
        </div>
    );
}

