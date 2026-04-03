import React from 'react';
import { LogOut } from 'lucide-react';
import { MENU_GROUPS } from './navigation';

interface SidebarProps {
    activeMenu: string;
    setActiveMenu: (id: string) => void;
    setIsAuthorized: (auth: boolean) => void;
}

export default function Sidebar({ activeMenu, setActiveMenu, setIsAuthorized }: SidebarProps) {
    return (
        <aside
            className="text-slate-300 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.15)] z-50 border-r border-slate-800"
            style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: '220px', backgroundColor: '#0f172a' }}
        >
            <div className="px-6" style={{ paddingTop: '20px', paddingBottom: '16px' }}>
                <style>{`
                    @keyframes haemaColorShift {
                        0% { background-position: 0% 50%; }
                        100% { background-position: 200% 50%; }
                    }
                    @keyframes haemaGlow {
                        0%, 100% { box-shadow: 0 0 12px rgba(251,146,60,0.3); }
                        50% { box-shadow: 0 0 24px rgba(251,146,60,0.7), 0 0 48px rgba(251,146,60,0.3); }
                    }
                `}</style>
                <h1 className="text-lg font-bold tracking-widest flex items-center gap-2">
                    <span
                        className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-sm shadow-lg shrink-0"
                        style={{ animation: 'haemaGlow 2s ease-in-out infinite' }}
                    >H</span>
                    <span
                        className="bg-clip-text text-transparent whitespace-nowrap"
                        style={{
                            backgroundImage: 'linear-gradient(90deg, #facc15, #fb923c, #ea580c, #facc15, #fb923c, #ea580c)',
                            backgroundSize: '200% 100%',
                            animation: 'haemaColorShift 3s linear infinite',
                        }}
                    >HAEMA ARCHI</span>
                </h1>
                <p className="mt-1 mb-1 text-[9px] text-slate-500 tracking-wider">AI ARCHITECTURE PLATFORM</p>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-2" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                <style>{`
                    nav::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
                <ul className="space-y-3">
                    {MENU_GROUPS.map((group, gIdx) => (
                        <li key={gIdx} className="space-y-1">
                            <div className="px-5 text-[9px] font-bold tracking-wider text-slate-500 mb-1">
                                {group.title}
                            </div>
                            <ul className="space-y-0.5">
                                {group.items.map(item => {
                                    const isActive = item.id === activeMenu;
                                    return (
                                        <li key={item.id}>
                                            <button
                                                onClick={() => setActiveMenu(item.id)}
                                                className={`w-full text-left px-5 py-1.5 rounded-lg flex items-center transition-all duration-200 ${isActive
                                                    ? 'bg-blue-600 font-semibold text-white shadow-[0_4px_12px_rgba(37,99,235,0.25)]'
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
                        </li>
                    ))}
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
