import React from 'react';
import { RISK_CONFIG } from './constants';

export function RiskBadge({ risk }: { risk: string }) {
    const cfg = RISK_CONFIG[risk as keyof typeof RISK_CONFIG] || RISK_CONFIG.info;
    return (
        <span className={`text-[12px] px-2.5 py-1 rounded-full border font-semibold ${cfg.color}`}>
            {cfg.dot} {cfg.label}
        </span>
    );
}
