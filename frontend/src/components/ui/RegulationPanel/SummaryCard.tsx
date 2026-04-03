import React from 'react';

export function SummaryCard({ label, count, color }: { label: string; count: number; color: string }) {
    return (
        <div className={`rounded-xl px-4 py-3.5 text-center border ${color}`}>
            <p className="text-3xl font-bold">{count}</p>
            <span className="text-[13px] font-semibold">{label}</span>
        </div>
    );
}
