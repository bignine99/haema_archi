import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Layers, Accessibility, Activity, Bus, Navigation, ShieldCheck, ZoomIn, Settings, Maximize2, Sun, Play, Trophy, BarChart3, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

/* ──────────────────────────────────────────────
   Floor-specific data model
   ────────────────────────────────────────────── */
type RoomDef = { name: string; area: string; ch: string; x: number; y: number; w: number; h: number; color: string; stroke: string; subs: string[] };

const FLOOR_DATA: Record<number, {
    label: string; street: string; streetColor: string; streetAccent: string; rooms: RoomDef[];
}> = {
    1: {
        label: '1F : 지역사회 개방 / 웰컴', street: 'Welcome Street', streetColor: '#dbeafe', streetAccent: '#3b82f6',
        rooms: [
            { name: '다목적 강당', area: '324㎡', ch: 'CH 6.0m', x: 60, y: 80, w: 160, h: 120, color: '#eff6ff', stroke: '#93c5fd', subs: ['무대', '관람석', '음향'] },
            { name: '도서관/미디어', area: '186㎡', ch: 'CH 3.6m', x: 60, y: 220, w: 160, h: 100, color: '#eff6ff', stroke: '#93c5fd', subs: ['열람실', '디지털존'] },
            { name: '보안관실', area: '24㎡', ch: 'CH 3.0m', x: 60, y: 340, w: 70, h: 50, color: '#fef3c7', stroke: '#fbbf24', subs: ['CCTV 통합'] },
            { name: '재활운동실', area: '210㎡', ch: 'CH 4.5m', x: 370, y: 80, w: 160, h: 120, color: '#f0fdf4', stroke: '#86efac', subs: ['물리치료', '보행훈련'] },
            { name: '감각통합실', area: '96㎡', ch: 'CH 3.6m', x: 370, y: 220, w: 160, h: 100, color: '#f0fdf4', stroke: '#86efac', subs: ['진동바닥', '볼풀'] },
        ],
    },
    2: {
        label: '2F : 초등 저학년 / 유치원', street: 'Play Street', streetColor: '#fef9c3', streetAccent: '#eab308',
        rooms: [
            { name: '유치원 교실 A', area: '72㎡', ch: 'CH 3.0m', x: 60, y: 80, w: 130, h: 90, color: '#fefce8', stroke: '#fde047', subs: ['놀이', '낮잠'] },
            { name: '유치원 교실 B', area: '72㎡', ch: 'CH 3.0m', x: 60, y: 190, w: 130, h: 90, color: '#fefce8', stroke: '#fde047', subs: ['감각', '소근육'] },
            { name: '유희실', area: '144㎡', ch: 'CH 4.5m', x: 60, y: 300, w: 130, h: 80, color: '#fff7ed', stroke: '#fdba74', subs: ['클라이밍', '트램폴린'] },
            { name: '초등 1-2 교실', area: '132㎡', ch: 'CH 3.0m', x: 370, y: 80, w: 160, h: 100, color: '#eff6ff', stroke: '#93c5fd', subs: ['1학년', '2학년'] },
            { name: '특별활동실', area: '96㎡', ch: 'CH 3.6m', x: 370, y: 200, w: 160, h: 100, color: '#f0fdf4', stroke: '#86efac', subs: ['미술', '음악'] },
        ],
    },
    3: {
        label: '3F : 중학 / 메디컬 클러스터', street: 'Care Street', streetColor: '#dcfce7', streetAccent: '#22c55e',
        rooms: [
            { name: '중학 교실 3학급', area: '198㎡', ch: 'CH 3.0m', x: 60, y: 80, w: 160, h: 120, color: '#eff6ff', stroke: '#93c5fd', subs: ['3-1', '3-2', '3-3'] },
            { name: '언어치료실', area: '48㎡', ch: 'CH 3.0m', x: 60, y: 220, w: 80, h: 70, color: '#fdf2f8', stroke: '#f9a8d4', subs: ['방음 Rw55'] },
            { name: '심리안정실', area: '36㎡', ch: 'CH 3.0m', x: 150, y: 220, w: 70, h: 70, color: '#fdf2f8', stroke: '#f9a8d4', subs: ['센서리룸'] },
            { name: '수치료실', area: '120㎡', ch: 'CH 4.2m', x: 370, y: 80, w: 160, h: 120, color: '#f0fdf4', stroke: '#86efac', subs: ['온수풀 32℃', 'HEPA'] },
            { name: '작업치료실', area: '72㎡', ch: 'CH 3.6m', x: 370, y: 220, w: 160, h: 80, color: '#f0fdf4', stroke: '#86efac', subs: ['일상동작', 'ADL'] },
        ],
    },
    4: {
        label: '4F : 고등 / 전공과 직업교육', street: 'Job Street', streetColor: '#e0e7ff', streetAccent: '#6366f1',
        rooms: [
            { name: '고등 교실 3학급', area: '198㎡', ch: 'CH 3.0m', x: 60, y: 80, w: 160, h: 120, color: '#eff6ff', stroke: '#93c5fd', subs: ['고1', '고2', '고3'] },
            { name: '전공과 실습', area: '180㎡', ch: 'CH 3.6m', x: 60, y: 220, w: 160, h: 100, color: '#e0e7ff', stroke: '#a5b4fc', subs: ['바리스타', '제과'] },
            { name: '직업교육실', area: '144㎡', ch: 'CH 3.6m', x: 370, y: 80, w: 160, h: 120, color: '#e0e7ff', stroke: '#a5b4fc', subs: ['세탁', '포장'] },
            { name: '전환교육실', area: '96㎡', ch: 'CH 3.0m', x: 370, y: 220, w: 160, h: 90, color: '#fef3c7', stroke: '#fbbf24', subs: ['면접연습', '시뮬레이션'] },
        ],
    },
};

/* ──────────────────────────────────────────────
   Alt-specific KPI + layout offsets
   ────────────────────────────────────────────── */
interface AltProfile {
    cpo: number; eduRatio: number; commonRatio: number; pathReduction: number; zeb: number;
    naturalLight: number; acousticGap: string;
    streetX: number; streetW: number;             // Street corridor position shift
    hubDx: number;                                // Hub horizontal offset
    roomOffsets: Record<string, { dx: number; dy: number }>; // Per-room nudge
    loopStyle: 'balanced' | 'radial' | 'linear';
    evalSummary: string;
    evalGrade: string;
    evalScores: { operation: number; safety: number; energy: number; bf: number; cost: number };
}

const ALT_PROFILES: Record<string, AltProfile> = {
    alt1: {
        cpo: 88, eduRatio: 65, commonRatio: 35, pathReduction: 18, zeb: 41.2, naturalLight: 78, acousticGap: '30m+',
        streetX: 230, streetW: 40, hubDx: 0,
        roomOffsets: {},
        loopStyle: 'balanced',
        evalSummary: '학습↔치료 동선을 18% 단축하여 교사 관리 부하를 최소화하는 효율 중심 배치',
        evalGrade: 'A',
        evalScores: { operation: 95, safety: 85, energy: 72, bf: 90, cost: 88 },
    },
    alt2: {
        cpo: 96, eduRatio: 60, commonRatio: 40, pathReduction: 12, zeb: 38.5, naturalLight: 70, acousticGap: '25m',
        streetX: 210, streetW: 80, hubDx: 0,
        roomOffsets: {
            '다목적 강당': { dx: -20, dy: 10 }, '재활운동실': { dx: 20, dy: 10 },
            '도서관/미디어': { dx: -20, dy: 0 }, '감각통합실': { dx: 20, dy: 0 },
            '유치원 교실 A': { dx: -15, dy: 5 }, '초등 1-2 교실': { dx: 15, dy: 5 },
            '중학 교실 3학급': { dx: -15, dy: 5 }, '수치료실': { dx: 15, dy: 5 },
            '고등 교실 3학급': { dx: -15, dy: 5 }, '직업교육실': { dx: 15, dy: 5 },
        },
        loopStyle: 'radial',
        evalSummary: '중앙 HUB 폭을 2배로 확장, 사각지대 0% 달성. 공용면적 증가로 공사비 소폭 상승',
        evalGrade: 'A-',
        evalScores: { operation: 78, safety: 98, energy: 65, bf: 95, cost: 75 },
    },
    alt3: {
        cpo: 82, eduRatio: 68, commonRatio: 32, pathReduction: 10, zeb: 52.3, naturalLight: 92, acousticGap: '35m+',
        streetX: 230, streetW: 40, hubDx: 0,
        roomOffsets: {
            '다목적 강당': { dx: 0, dy: -15 }, '재활운동실': { dx: 0, dy: -15 },
            '도서관/미디어': { dx: 0, dy: -10 }, '감각통합실': { dx: 0, dy: -10 },
            '보안관실': { dx: 0, dy: -10 },
            '유치원 교실 A': { dx: 0, dy: -10 }, '초등 1-2 교실': { dx: 0, dy: -10 },
            '중학 교실 3학급': { dx: 0, dy: -10 }, '수치료실': { dx: 0, dy: -10 },
            '고등 교실 3학급': { dx: 0, dy: -10 }, '직업교육실': { dx: 0, dy: -10 },
        },
        loopStyle: 'linear',
        evalSummary: '남향 채광 극대화 배치, ZEB 자립률 52.3% 달성. 동선 길이 소폭 증가 감수',
        evalGrade: 'B+',
        evalScores: { operation: 72, safety: 80, energy: 97, bf: 88, cost: 82 },
    },
};

const ALT_META = [
    { id: 'alt1', name: 'Alt 1 : 운영 효율형', shortName: '운영 효율', desc: '이동 동선 최적화 · -18% 경로 단축', badge: 'Recommend', color: '#3b82f6' },
    { id: 'alt2', name: 'Alt 2 : 감시 극대화형', shortName: '감시 극대화', desc: '중앙 HUB 방사형 · CPO 96%', badge: '', color: '#8b5cf6' },
    { id: 'alt3', name: 'Alt 3 : 생태 에너지형', shortName: '생태 에너지', desc: '자연 채광/환기 중점 · ZEB 52.3%', badge: '', color: '#10b981' },
];

/* ──────────────────────────────────────────────
   Component
   ────────────────────────────────────────────── */
const CirculationLayoutPanel = () => {
    const [activeFloor, setActiveFloor] = useState(1);
    const [activeAlt, setActiveAlt] = useState('alt1');
    const [layers, setLayers] = useState({ bus: true, pedestrian: true, emergency: false });

    // Simulation state
    const [simRunning, setSimRunning] = useState(false);
    const [simProgress, setSimProgress] = useState(0);       // 0–100
    const [simCurrentAlt, setSimCurrentAlt] = useState('');   // which alt is being analysed
    const [simDone, setSimDone] = useState(false);
    const [showEval, setShowEval] = useState(false);
    const simTimerRef = useRef<number | null>(null);

    const toggleLayer = (layer: keyof typeof layers) => {
        setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
    };

    /* ─── Simulation runner ─── */
    const startSimulation = useCallback(() => {
        setSimRunning(true);
        setSimProgress(0);
        setSimDone(false);
        setShowEval(false);
        setSimCurrentAlt('alt1');
        setActiveAlt('alt1');

        let tick = 0;
        const total = 60; // ~3 seconds total
        if (simTimerRef.current) clearInterval(simTimerRef.current);

        simTimerRef.current = window.setInterval(() => {
            tick++;
            const pct = Math.min(Math.round((tick / total) * 100), 100);
            setSimProgress(pct);

            // Phase transitions (switch active alt during simulation)
            if (tick === 1) { setSimCurrentAlt('alt1'); setActiveAlt('alt1'); }
            else if (tick === Math.round(total * 0.33)) { setSimCurrentAlt('alt2'); setActiveAlt('alt2'); }
            else if (tick === Math.round(total * 0.66)) { setSimCurrentAlt('alt3'); setActiveAlt('alt3'); }

            if (tick >= total) {
                clearInterval(simTimerRef.current!);
                setSimRunning(false);
                setSimDone(true);
                setShowEval(true);
                setActiveAlt('alt1'); // reset to recommended
            }
        }, 50);
    }, []);

    useEffect(() => { return () => { if (simTimerRef.current) clearInterval(simTimerRef.current); }; }, []);

    const floor = FLOOR_DATA[activeFloor];
    const profile = ALT_PROFILES[activeAlt];

    // Apply room offsets from Alt profile
    const getAdjustedRoom = (room: RoomDef): RoomDef => {
        const offset = profile.roomOffsets[room.name];
        if (!offset) return room;
        return { ...room, x: room.x + offset.dx, y: room.y + offset.dy };
    };

    const simAltLabel = ALT_META.find(a => a.id === simCurrentAlt)?.shortName || '';

    return (
        <div className="h-full flex flex-col p-6 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <Navigation className="text-blue-600" size={22} />
                        동선 및 프로그램 배치
                    </h2>
                    <p className="text-slate-500 text-[13px] mt-1 font-medium">
                        보차분리 · Double Loop 내부 동선 · 층별 Street 배치 시뮬레이션
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={startSimulation}
                        disabled={simRunning}
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-all border flex items-center gap-2 ${
                            simRunning
                                ? 'bg-amber-50 border-amber-300 text-amber-600 cursor-wait'
                                : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:border-blue-300'
                        }`}
                    >
                        {simRunning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                        {simRunning ? '시뮬레이션 중...' : '배치 시뮬레이션'}
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                        CAD/BIM 연동
                    </button>
                </div>
            </div>

            {/* Simulation progress bar */}
            {simRunning && (
                <div className="mb-4 bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[12px] font-bold text-slate-600 flex items-center gap-2">
                            <Loader2 size={14} className="animate-spin text-blue-500" />
                            배치 시뮬레이션 진행 중 — <span className="text-blue-600">{simAltLabel}</span> 분석 중
                        </span>
                        <span className="text-[12px] font-bold text-blue-600">{simProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500 transition-all duration-100" style={{ width: `${simProgress}%` }} />
                    </div>
                    <div className="flex justify-between mt-1.5 text-[10px] text-slate-400 font-medium">
                        <span className={simProgress >= 0 ? 'text-blue-500 font-bold' : ''}>운영 효율형</span>
                        <span className={simProgress >= 33 ? 'text-violet-500 font-bold' : ''}>감시 극대화형</span>
                        <span className={simProgress >= 66 ? 'text-emerald-500 font-bold' : ''}>생태 에너지형</span>
                    </div>
                </div>
            )}

            <div className="flex-1 flex flex-col gap-5 min-h-0 overflow-hidden">
              <div className="flex-1 grid grid-cols-12 gap-5 min-h-0">
                {/* ═══════════════ LEFT: Main Canvas ═══════════════ */}
                <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden relative">
                    {/* Floor selector */}
                    <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur rounded-lg p-1.5 shadow-sm border border-slate-200 flex gap-1">
                        {[1, 2, 3, 4].map(f => (
                            <button key={f} onClick={() => setActiveFloor(f)}
                                className={`w-8 h-8 rounded shrink-0 flex items-center justify-center text-xs font-bold transition-colors ${activeFloor === f ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}
                            >{f}F</button>
                        ))}
                        <div className="w-px bg-slate-200 mx-1" />
                        <button className="w-8 h-8 rounded flex items-center justify-center text-slate-500 hover:bg-slate-100"><ZoomIn size={16} /></button>
                    </div>

                    {/* Floor label + current Alt badge */}
                    <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur rounded-lg px-3 py-1.5 shadow-sm border border-slate-200 flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-700">{floor.label}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: floor.streetColor, color: floor.streetAccent }}>{floor.street}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">{ALT_META.find(a => a.id === activeAlt)?.shortName}</span>
                    </div>

                    {/* ─── SVG Canvas ─── */}
                    <div className="flex-1 bg-slate-50 relative overflow-hidden">
                        <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMin meet">
                            <defs>
                                <pattern id="archGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
                                </pattern>
                                <pattern id="microG" width="10" height="10" patternUnits="userSpaceOnUse">
                                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f1f5f9" strokeWidth="0.3" />
                                </pattern>
                                <pattern id="grassPat" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                                    <line x1="0" y1="0" x2="0" y2="8" stroke="#86efac" strokeWidth="1.5" />
                                </pattern>
                                <pattern id="treePat" width="16" height="16" patternUnits="userSpaceOnUse">
                                    <circle cx="8" cy="8" r="5" fill="#bbf7d0" /><circle cx="8" cy="8" r="3" fill="#86efac" />
                                </pattern>
                                <style>{`
                                    @keyframes flowAnim { to { stroke-dashoffset: -30; } }
                                    .flow-anim { animation: flowAnim 2s linear infinite; }
                                `}</style>
                            </defs>

                            <rect width="800" height="600" fill="url(#archGrid)" />
                            <rect width="800" height="600" fill="url(#microG)" />

                            {/* Roads */}
                            <g>
                                <rect x="40" y="530" width="720" height="45" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
                                <line x1="400" y1="530" x2="400" y2="575" stroke="#fbbf24" strokeWidth="2" strokeDasharray="12 8" />
                                <line x1="40" y1="552" x2="760" y2="552" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="20 10" />
                                <text x="750" y="568" textAnchor="end" fill="#94a3b8" fontSize="9" fontWeight="bold">도시계획도로 (4차선)</text>
                                <rect x="0" y="60" width="38" height="470" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
                                <line x1="19" y1="60" x2="19" y2="530" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="14 8" />
                                <text x="20" y="80" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold" transform="rotate(-90 20 80)" style={{ transformOrigin: '20px 80px' }}>이면도로 (8m)</text>
                            </g>

                            {/* Surrounding buildings */}
                            <g opacity="0.45">
                                <rect x="50" y="10" width="120" height="40" rx="2" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
                                <text x="110" y="35" textAnchor="middle" fill="#64748b" fontSize="8">인근 주택가</text>
                                <rect x="620" y="15" width="100" height="35" rx="2" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
                                <text x="670" y="37" textAnchor="middle" fill="#64748b" fontSize="8">근린공원</text>
                                <rect x="720" y="150" width="35" height="120" rx="2" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
                            </g>

                            {/* Site boundary */}
                            <path d="M 55 60 L 710 55 L 715 520 L 50 525 Z" fill="none" stroke="#475569" strokeWidth="2.5" />
                            <path d="M 55 60 L 710 55 L 715 520 L 50 525 Z" fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="6 3" />
                            <text x="65" y="54" fill="#475569" fontSize="10" fontWeight="bold">대지 경계선 (PL)</text>

                            {/* Landscape */}
                            <rect x="580" y="380" width="120" height="130" rx="8" fill="url(#treePat)" stroke="#4ade80" strokeWidth="1.5" opacity="0.7" />
                            <text x="640" y="460" textAnchor="middle" fill="#15803d" fontSize="10" fontWeight="bold">학교 숲</text>
                            <text x="640" y="475" textAnchor="middle" fill="#22c55e" fontSize="8">生態 체험학습장</text>
                            <rect x="400" y="420" width="160" height="90" rx="6" fill="url(#grassPat)" stroke="#86efac" strokeWidth="1.5" opacity="0.6" />
                            <text x="480" y="470" textAnchor="middle" fill="#15803d" fontSize="10" fontWeight="bold">외부 놀이마당</text>

                            {/* Setback */}
                            <path d="M 80 80 L 690 76 L 694 505 L 74 509 Z" fill="none" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="4 4" />
                            <text x="85" y="95" fill="#94a3b8" fontSize="8">건축한계선</text>

                            {/* ═══ PROGRAM BLOCKS (Alt-responsive) ═══ */}
                            <g transform="translate(85, 90)">
                                {/* Street corridor – width changes per alt */}
                                <rect x={profile.streetX} y="60" width={profile.streetW} height="300" rx="2" fill={floor.streetColor} stroke={floor.streetAccent} strokeWidth="1.5" opacity="0.6" />
                                <text x={profile.streetX + profile.streetW / 2} y="220" textAnchor="middle" fill={floor.streetAccent} fontSize="9" fontWeight="bold"
                                    transform={`rotate(-90 ${profile.streetX + profile.streetW / 2} 220)`}
                                    style={{ transformOrigin: `${profile.streetX + profile.streetW / 2}px 220px` }}
                                >{floor.street}</text>
                                <text x={profile.streetX + profile.streetW / 2} y="50" textAnchor="middle" fill={floor.streetAccent} fontSize="8" fontWeight="bold">
                                    W {profile.loopStyle === 'radial' ? '6.6m' : '3.3m'}
                                </text>

                                {/* Hub – shifts per alt */}
                                <g>
                                    <rect x={232 + profile.hubDx} y="150" width={profile.loopStyle === 'radial' ? 56 : 36} height="60" rx="3" fill="#ffffff" stroke="#1d4ed8" strokeWidth="3" />
                                    <rect x={234 + profile.hubDx} y="152" width={profile.loopStyle === 'radial' ? 52 : 32} height="56" rx="2" fill="none" stroke="#93c5fd" strokeWidth="1" />
                                    <rect x={237 + profile.hubDx} y="170" width="12" height="16" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1" />
                                    <text x={243 + profile.hubDx} y="181" textAnchor="middle" fill="#1d4ed8" fontSize="6" fontWeight="bold">EV</text>
                                    <text x={250 + profile.hubDx} y="165" textAnchor="middle" fill="#1d4ed8" fontSize="7" fontWeight="bold">HUB</text>
                                    <text x={250 + profile.hubDx} y="218" textAnchor="middle" fill="#64748b" fontSize="7">인솔 거점</text>
                                    <text x={250 + profile.hubDx} y="228" textAnchor="middle" fill="#94a3b8" fontSize="6">교사연구실·66인승EV</text>
                                </g>

                                {/* Room blocks – positions adjust by alt */}
                                {floor.rooms.map((baseRoom, i) => {
                                    const room = getAdjustedRoom(baseRoom);
                                    return (
                                        <g key={i} className="transition-all duration-500">
                                            <rect x={room.x} y={room.y} width={room.w} height={room.h} rx="3" fill={room.color} stroke={room.stroke} strokeWidth="2.5" />
                                            <rect x={room.x + 3} y={room.y + 3} width={room.w - 6} height={room.h - 6} rx="1" fill="none" stroke={room.stroke} strokeWidth="0.6" opacity="0.5" />
                                            <rect x={room.x + room.w - 18} y={room.y + room.h - 4} width="16" height="6" fill="#ffffff" stroke={room.stroke} strokeWidth="1" />
                                            <text x={room.x + room.w / 2} y={room.y + room.h / 2 - 8} textAnchor="middle" fill="#334155" fontSize="11" fontWeight="bold">{room.name}</text>
                                            <text x={room.x + room.w / 2} y={room.y + room.h / 2 + 6} textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="bold">{room.area} · {room.ch}</text>
                                            <text x={room.x + room.w / 2} y={room.y + room.h / 2 + 18} textAnchor="middle" fill="#94a3b8" fontSize="7">{room.subs.join(' | ')}</text>
                                        </g>
                                    );
                                })}

                                {/* Double Loop – style changes per Alt */}
                                {profile.loopStyle === 'balanced' && (
                                    <g>
                                        <path d="M 245 150 C 100 120, 80 280, 245 300" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6 4" opacity="0.5" />
                                        <text x="120" y="230" fill="#3b82f6" fontSize="8" fontWeight="bold" opacity="0.7">Learning Loop</text>
                                        <path d="M 255 150 C 430 120, 450 280, 255 300" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="6 4" opacity="0.5" />
                                        <text x="380" y="230" fill="#22c55e" fontSize="8" fontWeight="bold" opacity="0.7">Care Loop</text>
                                    </g>
                                )}
                                {profile.loopStyle === 'radial' && (
                                    <g>
                                        {/* Radial rays from hub */}
                                        {[50, 100, 150, 250, 300, 350].map((angle, i) => (
                                            <line key={i} x1="260" y1="180" x2={260 + Math.cos(angle * Math.PI / 180) * 180} y2={180 + Math.sin(angle * Math.PI / 180) * 140}
                                                stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
                                        ))}
                                        <circle cx="260" cy="180" r="60" fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.35" />
                                        <circle cx="260" cy="180" r="120" fill="none" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
                                        <text x="260" y="260" textAnchor="middle" fill="#7c3aed" fontSize="8" fontWeight="bold" opacity="0.7">360° 감시 방사형</text>
                                    </g>
                                )}
                                {profile.loopStyle === 'linear' && (
                                    <g>
                                        {/* South-facing alignment arrows */}
                                        <path d="M 100 60 L 100 360" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="8 4" opacity="0.4" />
                                        <path d="M 430 60 L 430 360" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="8 4" opacity="0.4" />
                                        {/* Sun arrows from south */}
                                        {[150, 250, 350, 450].map((sx, i) => (
                                            <g key={i} opacity="0.35">
                                                <line x1={sx} y1="380" x2={sx} y2="340" stroke="#f59e0b" strokeWidth="1.5" />
                                                <polygon points={`${sx - 4},345 ${sx + 4},345 ${sx},335`} fill="#f59e0b" />
                                            </g>
                                        ))}
                                        <text x="300" y="375" textAnchor="middle" fill="#d97706" fontSize="8" fontWeight="bold" opacity="0.6">☀ 남향 채광 극대화</text>
                                    </g>
                                )}
                            </g>

                            {/* Circulation flows */}
                            {layers.bus && activeFloor === 1 && (
                                <g>
                                    <path d="M 38 480 Q 120 440 200 420 Q 280 400 340 380" fill="none" stroke="#f59e0b" strokeWidth="14" opacity="0.15" />
                                    <path d="M 38 480 Q 120 440 200 420 Q 280 400 340 380" fill="none" stroke="#d97706" strokeWidth="2.5" className="flow-anim" strokeDasharray="10 6" />
                                    <text x="130" y="460" fill="#92400e" fontSize="9" fontWeight="bold">통학버스 진입</text>
                                    <path d="M 200 420 Q 230 390 270 400 Q 310 410 340 380" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
                                    <path d="M 195 430 Q 240 405 280 415 Q 320 425 350 395" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
                                    <text x="270" y="435" fill="#b45309" fontSize="7" fontStyle="italic">Swept Path R=12m</text>
                                    <rect x="310" y="355" width="80" height="50" rx="4" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.8" />
                                    <text x="350" y="377" textAnchor="middle" fill="#92400e" fontSize="9" fontWeight="bold">Drop-off</text>
                                    <text x="350" y="393" textAnchor="middle" fill="#b45309" fontSize="7">캐노피 H≥3.6m</text>
                                    <path d="M 38 510 Q 250 490 390 475" fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="8 5" opacity="0.5" />
                                    <text x="220" y="505" fill="#64748b" fontSize="7">승용차 진입 (분리)</text>
                                </g>
                            )}
                            {layers.emergency && activeFloor === 1 && (
                                <g>
                                    <path d="M 50 518 L 710 514" fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="12 6" opacity="0.5" />
                                    <path d="M 50 518 L 710 514" fill="none" stroke="#ef4444" strokeWidth="1.5" className="flow-anim" strokeDasharray="6 4" />
                                    <text x="400" y="512" textAnchor="middle" fill="#dc2626" fontSize="9" fontWeight="bold">비상차량 진입가로 (W≥6.0m)</text>
                                    <circle cx="700" cy="514" r="18" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 3" />
                                    <text x="700" y="518" textAnchor="middle" fill="#dc2626" fontSize="7">회차</text>
                                </g>
                            )}
                            {layers.pedestrian && (
                                <g>
                                    <g transform="translate(300, 490)">
                                        <path d="M 0 0 L 40 -30" stroke="#3b82f6" strokeWidth="2" />
                                        <circle cx="0" cy="0" r="3" fill="#3b82f6" /><circle cx="40" cy="-30" r="3" fill="#3b82f6" />
                                        <text x="25" y="-8" fill="#1d4ed8" fontSize="7" fontWeight="bold">1/18</text>
                                        <rect x="38" y="-36" width="8" height="4" fill="#3b82f6" opacity="0.4" />
                                        <text x="52" y="-30" fill="#64748b" fontSize="6">Landing</text>
                                    </g>
                                    <path d="M 200 525 L 200 500 Q 200 480 220 460 L 310 400" fill="none" stroke="#3b82f6" strokeWidth="2" className="flow-anim" strokeDasharray="6 4" />
                                    <text x="230" y="480" fill="#1d4ed8" fontSize="8" fontWeight="bold">주출입구 보행 동선</text>
                                    <text x="230" y="492" fill="#3b82f6" fontSize="7">유효폭 3.3m · 무단차</text>
                                </g>
                            )}

                            {/* Scale + North */}
                            <g transform="translate(620, 15)">
                                <line x1="0" y1="20" x2="80" y2="20" stroke="#475569" strokeWidth="1.5" />
                                <line x1="0" y1="16" x2="0" y2="24" stroke="#475569" strokeWidth="1.5" />
                                <line x1="80" y1="16" x2="80" y2="24" stroke="#475569" strokeWidth="1.5" />
                                <text x="40" y="14" textAnchor="middle" fill="#475569" fontSize="8" fontWeight="bold">20m</text>
                            </g>
                            <g transform="translate(580, 20)">
                                <polygon points="0,20 5,0 10,20 5,15" fill="#475569" />
                                <text x="5" y="30" textAnchor="middle" fill="#475569" fontSize="8" fontWeight="bold">N</text>
                            </g>
                        </svg>
                    </div>
                </div>

                {/* ═══════════════ RIGHT: Controls + KPIs ═══════════════ */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 min-h-0 overflow-y-auto pr-1" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                    <style>{`div::-webkit-scrollbar{display:none}`}</style>

                    {/* Layer Toggles */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center justify-between">
                            <span>동선 시스템 레이어</span><Layers size={14} />
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-[12px] font-medium">
                            <label className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${layers.bus ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                                <input type="checkbox" className="hidden" checked={layers.bus} onChange={() => toggleLayer('bus')} />
                                <Bus size={15} /> 차량/드롭오프
                            </label>
                            <label className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${layers.pedestrian ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                                <input type="checkbox" className="hidden" checked={layers.pedestrian} onChange={() => toggleLayer('pedestrian')} />
                                <Accessibility size={15} /> BF 보행동선
                            </label>
                            <label className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${layers.emergency ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                                <input type="checkbox" className="hidden" checked={layers.emergency} onChange={() => toggleLayer('emergency')} />
                                <Activity size={15} /> 비상차량 회차
                            </label>
                            <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 cursor-pointer transition-colors bg-white">
                                <Maximize2 size={15} /> 66인승 EV 코어
                            </label>
                        </div>
                    </div>

                    {/* AI Alternatives */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center justify-between">
                            <span>AI 배치 대안 (Alternatives)</span>
                            <span className="text-blue-500 bg-blue-50 px-2 py-0.5 rounded text-[10px] font-bold">Auto Gen</span>
                        </h3>
                        <div className="space-y-2">
                            {ALT_META.map(alt => (
                                <button key={alt.id} onClick={() => setActiveAlt(alt.id)}
                                    className={`w-full text-left p-3 rounded-lg border transition-all ${activeAlt === alt.id ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-300' : 'bg-white border-slate-200 hover:border-blue-200 hover:bg-slate-50'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className={`font-bold text-sm ${activeAlt === alt.id ? 'text-blue-700' : 'text-slate-700'}`}>{alt.name}</span>
                                        {alt.badge && <span className="text-[9px] bg-emerald-50 text-emerald-600 font-bold px-1.5 py-0.5 rounded">{alt.badge}</span>}
                                    </div>
                                    <div className="text-[11px] text-slate-500 mt-0.5">{alt.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Live KPIs */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex-1 flex flex-col min-h-0">
                        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center justify-between">
                            <span>실시간 배치 검증 KPI</span><Settings size={14} className="text-slate-400" />
                        </h3>
                        <div className="space-y-3 overflow-y-auto" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                            {/* BF */}
                            <div className="border border-slate-100 rounded-lg p-3 bg-slate-50/50">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600"><Accessibility size={14} className="text-emerald-500" /> BF 적합성</div>
                                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Pass</span>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
                                    <span className="text-slate-500">주요 통로 유효폭</span><span className="font-bold text-slate-800 text-right">3.3m (법정 2.4m↑)</span>
                                    <span className="text-slate-500">경사로 구배</span><span className="font-bold text-slate-800 text-right">1/18 이하</span>
                                    <span className="text-slate-500">휠체어 회전반경</span><span className="font-bold text-slate-800 text-right">1.4m × 1.4m ✓</span>
                                    <span className="text-slate-500">66인승 EV 배치</span><span className="font-bold text-slate-800 text-right">코어 직결 ✓</span>
                                </div>
                            </div>
                            {/* Zoning */}
                            <div className="border border-slate-100 rounded-lg p-3 bg-slate-50/50">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600"><ShieldCheck size={14} className="text-blue-500" /> 조닝 및 가시성</div>
                                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Optimal</span>
                                </div>
                                <div className="mb-2">
                                    <div className="flex justify-between text-[11px] mb-1"><span className="text-slate-500">자연감시 CPO 면적</span><span className="font-bold text-blue-600">{profile.cpo}%</span></div>
                                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden"><div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${profile.cpo}%` }} /></div>
                                </div>
                                <div className="flex gap-2 text-[11px]">
                                    <div className="flex-1 bg-blue-50 rounded p-1.5 text-center"><div className="text-blue-600 font-bold text-sm">{profile.eduRatio}%</div><div className="text-slate-500 text-[9px]">순수교육</div></div>
                                    <div className="flex-1 bg-slate-100 rounded p-1.5 text-center"><div className="text-slate-700 font-bold text-sm">{profile.commonRatio}%</div><div className="text-slate-500 text-[9px]">공용(Street 등)</div></div>
                                </div>
                            </div>
                            {/* Circulation */}
                            <div className="border border-slate-100 rounded-lg p-3 bg-slate-50/50">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600"><Activity size={14} className="text-rose-400" /> 동선 효율</div>
                                    <span className="text-[10px] text-slate-400">기존 대비</span>
                                </div>
                                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-1"><div className="bg-rose-400 h-full rounded-full transition-all duration-500" style={{ width: `${100 - profile.pathReduction}%` }} /></div>
                                <div className="text-right text-[11px] font-bold text-rose-500">-{profile.pathReduction}% 경로 단축</div>
                            </div>
                            {/* ZEB */}
                            <div className="border border-slate-100 rounded-lg p-3 bg-slate-50/50">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600"><Sun size={14} className="text-amber-500" /> 에너지/채광</div>
                                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">ZEB 4등급</span>
                                </div>
                                <div className="flex justify-between text-[11px] mb-1"><span className="text-slate-500">에너지자립률 타겟</span><span className="font-bold text-amber-600">{profile.zeb}%</span></div>
                                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden"><div className="bg-amber-400 h-full rounded-full transition-all duration-500" style={{ width: `${profile.zeb}%` }} /></div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] mt-2">
                                    <span className="text-slate-500">자연채광 유입률</span><span className="font-bold text-slate-800 text-right">{profile.naturalLight}%</span>
                                    <span className="text-slate-500">소음 이격 (Acoustic)</span><span className="font-bold text-slate-800 text-right">{profile.acousticGap} ✓</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
              </div>

              {/* ═══════════════ BOTTOM: Evaluation Panel ═══════════════ */}
              {showEval && (
                <div className="shrink-0 bg-white border border-slate-200 rounded-xl shadow-sm p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                            <Trophy size={13} className="text-amber-500" /> 배치 대안 종합평가
                        </h3>
                        <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold">
                            <CheckCircle2 size={12} /> AI 추천: Alt 1 (운영 효율형) — 종합 점수 및 과업 적합도 기반
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {ALT_META.map(alt => {
                            const p = ALT_PROFILES[alt.id];
                            const isActive = activeAlt === alt.id;
                            const totalScore = Math.round((p.evalScores.operation + p.evalScores.safety + p.evalScores.energy + p.evalScores.bf + p.evalScores.cost) / 5);
                            return (
                                <button key={alt.id} onClick={() => setActiveAlt(alt.id)}
                                    className={`text-left p-3 rounded-lg border transition-all ${isActive ? 'border-blue-300 bg-blue-50 ring-1 ring-blue-200' : 'border-slate-100 bg-slate-50/50 hover:border-blue-200'}`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[12px] font-bold" style={{ color: alt.color }}>{alt.name}</span>
                                        <div className="flex items-center gap-1">
                                            <span className="text-[10px] font-bold text-slate-500">종합</span>
                                            <span className={`text-lg font-extrabold ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>{totalScore}<span className="text-[11px] font-bold text-slate-400">점</span></span>
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ml-1 ${totalScore >= 85 ? 'bg-emerald-50 text-emerald-600' : totalScore >= 80 ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>{p.evalGrade}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-5 gap-1.5 mb-2">
                                        {(['operation', 'safety', 'energy', 'bf', 'cost'] as const).map(key => {
                                            const labels: Record<string, string> = { operation: '운영', safety: '안전', energy: '에너지', bf: 'BF', cost: '경제성' };
                                            const val = p.evalScores[key];
                                            return (
                                                <div key={key} className="text-center">
                                                    <div className="text-[9px] text-slate-400 mb-0.5">{labels[key]}</div>
                                                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${val}%`, background: alt.color }} />
                                                    </div>
                                                    <div className="text-[10px] font-bold text-slate-600 mt-0.5">{val}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="text-[10px] text-slate-500 leading-snug">{p.evalSummary}</div>
                                </button>
                            );
                        })}
                    </div>
                </div>
              )}
            </div>
        </div>
    );
};

export default CirculationLayoutPanel;
