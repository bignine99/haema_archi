import React, { useState, useEffect } from 'react';
import { LogOut, ChevronDown, ChevronRight } from 'lucide-react';
import { MENU_GROUPS } from './navigation';

interface SidebarProps {
    activeMenu: string;
    setActiveMenu: (id: string) => void;
    setIsAuthorized: (auth: boolean) => void;
}

export default function Sidebar({ activeMenu, setActiveMenu, setIsAuthorized }: SidebarProps) {
    const [expandedGroup, setExpandedGroup] = useState<number | null>(() => {
        const activeIdx = MENU_GROUPS.findIndex(g => g.items.some(item => item.id === activeMenu));
        return activeIdx !== -1 ? activeIdx : 0;
    });

    useEffect(() => {
        const activeIdx = MENU_GROUPS.findIndex(g => g.items.some(item => item.id === activeMenu));
        if (activeIdx !== -1 && expandedGroup !== activeIdx) {
            setExpandedGroup(activeIdx);
        }
    }, [activeMenu]);

    const toggleGroup = (idx: number) => {
        setExpandedGroup(prev => prev === idx ? null : idx);
    };

    return (
        <aside
            className="text-slate-300 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.15)] z-50 border-r border-slate-800"
            style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: '220px', backgroundColor: '#0f172a' }}
        >
            <div className="px-6 flex flex-col items-center" style={{ paddingTop: '20px', paddingBottom: '16px' }}>
                <style>{`
                    @keyframes archeGlow {
                        0%, 100% { filter: drop-shadow(0 0 6px rgba(232,119,34,0.25)); }
                        50% { filter: drop-shadow(0 0 14px rgba(232,119,34,0.55)); }
                    }
                `}</style>
                {/* ARCHE 로고 — 텍스트 기반 */}
                <div className="w-full flex items-center justify-center mb-1 pt-1" style={{ animation: 'archeGlow 3s ease-in-out infinite' }}>
                    <span className="font-serif-elegant text-4xl font-bold text-[#E87722] tracking-wider italic pr-2">
                        ARCHE
                    </span>
                    <div className="relative flex items-center justify-center">
                        <circle cx="176" cy="13" r="4.5" fill="#F5A623"/>
                        <span className="w-2.5 h-2.5 rounded-full bg-[#E87722]"></span>
                        <span className="absolute w-1.5 h-1.5 rounded-full bg-[#F5A623]"></span>
                    </div>
                </div>
                <p className="mt-1 text-[9px] text-orange-400/60 tracking-widest font-bold uppercase text-center">AI ARCHITECTURE PLATFORM</p>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-2" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                <style>{`
                    nav::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
                <ul className="space-y-3">
                    {MENU_GROUPS.map((group, gIdx) => {
                        const isExpanded = expandedGroup === gIdx;
                        return (
                        <li key={gIdx} className="space-y-1">
                            <button
                                onClick={() => toggleGroup(gIdx)}
                                className="w-full flex items-center justify-between px-5 py-2 font-bold tracking-wider transition-colors hover:text-white"
                                style={{ fontSize: '10px' }}
                            >
                                <span className={isExpanded ? 'text-orange-400' : 'text-slate-500 hover:text-slate-300'}>
                                    {group.title}
                                </span>
                                <span className="opacity-70">
                                    {isExpanded ? <ChevronDown size={14} className="text-orange-400" /> : <ChevronRight size={14} className="text-slate-500" />}
                                </span>
                            </button>
                            
                            {isExpanded && (
                            <ul className="space-y-0.5 mt-1">
                                {group.items.map(item => {
                                    const isActive = item.id === activeMenu;
                                    return (
                                        <li key={item.id}>
                                            <button
                                                onClick={() => setActiveMenu(item.id)}
                                                className={`w-full text-left px-5 py-1.5 rounded-lg flex items-center transition-all duration-200 ${isActive
                                                    ? 'bg-orange-600 font-semibold text-white shadow-[0_4px_12px_rgba(234,88,12,0.25)]'
                                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                                    }`}
                                            >
                                                <span className={`w-5 flex flex-shrink-0 items-center justify-center ${isActive ? 'text-white' : 'text-slate-400'}`} style={{ marginRight: '14px' }}>
                                                    {item.icon}
                                                </span>
                                                <span className={`text-[12px] tracking-wide whitespace-nowrap ${isActive ? 'opacity-100' : 'opacity-90'}`}>{item.label}</span>
                                            </button>
                                        </li>
                                    )
                                })}
                            </ul>
                            )}
                        </li>
                    )})}
                </ul>
            </nav>

            <div className="p-6 border-t border-slate-800/60 bg-slate-900/50">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center text-slate-300 font-bold text-sm shadow-inner">
                        AD
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white text-xs font-semibold">Admin User</span>
                        <span className="text-[10px] text-emerald-400">Enterprise Plan</span>
                    </div>
                </div>
                <button
                    onClick={() => setIsAuthorized(false)}
                    className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg flex items-center justify-center gap-2 transition-colors text-xs font-medium border border-slate-700"
                >
                    <LogOut size={14} />
                    <span>랜딩 페이지로 이동</span>
                </button>
            </div>
        </aside>
    );
}
