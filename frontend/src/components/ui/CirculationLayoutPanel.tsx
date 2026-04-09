import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Layers, Accessibility, Activity, Bus, Navigation, ShieldCheck, ZoomIn, Settings, Maximize2, Sun, Play, Trophy, BarChart3, CheckCircle2, Loader2, ArrowRight, Waypoints } from 'lucide-react';

import { useProjectStore } from '@/store/projectStore';
import { exportToJSON, exportToSVG, exportToDXF, exportToIFC } from '@/utils/exportData';

/* ──────────────────────────────────────────────
   Floor-specific data model (Dynamic by Building Use)
   ────────────────────────────────────────────── */
type RoomDef = { name: string; area: string; ch: string; x: number; y: number; w: number; h: number; color: string; stroke: string; subs: string[] };

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

const getDynamicSimulationData = (buildingUse: string) => {
    const isEdu = buildingUse.includes('학교') || buildingUse.includes('교육');
    const isHospital = buildingUse.includes('병원') || buildingUse.includes('의료');
    const isOffice = buildingUse.includes('업무') || buildingUse.includes('오피스');

    const themeA = isHospital ? { bg: '#fdf2f8', border: '#f9a8d4' } : isOffice ? { bg: '#eff6ff', border: '#93c5fd' } : { bg: '#eff6ff', border: '#93c5fd' };
    const themeB = isHospital ? { bg: '#f0fdf4', border: '#86efac' } : isOffice ? { bg: '#fefce8', border: '#fde047' } : { bg: '#f0fdf4', border: '#86efac' };
    const themeC = isHospital ? { bg: '#fff7ed', border: '#fdba74' } : isOffice ? { bg: '#f8fafc', border: '#cbd5e1' } : { bg: '#fefce8', border: '#fde047' };

    const floorData: Record<number, { label: string; street: string; streetColor: string; streetAccent: string; rooms: RoomDef[] }> = {
        1: {
            label: isEdu ? '1F : 개방 / 웰컴' : isHospital ? '1F : 외래 / 접수' : isOffice ? '1F : 로비 / 라운지' : '1F : 공용 / 로비',
            street: 'Welcome Street', streetColor: '#dbeafe', streetAccent: '#3b82f6',
            rooms: [
                { name: isEdu ? '다목적 강당' : isHospital ? '외래 로비' : isOffice ? '리셉션 홀' : '다목적홀', area: '324㎡', ch: 'CH 6.0m', x: 60, y: 80, w: 160, h: 120, color: themeA.bg, stroke: themeA.border, subs: ['오픈스페이스'] },
                { name: isEdu ? '도서관/미디어' : isHospital ? '접수처' : isOffice ? '초청 미팅존' : '라운지', area: '186㎡', ch: 'CH 3.6m', x: 60, y: 220, w: 160, h: 100, color: themeA.bg, stroke: themeA.border, subs: ['열람/대기'] },
                { name: '보안데스크', area: '24㎡', ch: 'CH 3.0m', x: 60, y: 340, w: 70, h: 50, color: '#fef3c7', stroke: '#fbbf24', subs: ['CCTV 통합'] },
                { name: isEdu ? '재활운동실' : isHospital ? '응급의료센터' : isOffice ? '직원 라운지' : '부대시설', area: '210㎡', ch: 'CH 4.5m', x: 370, y: 80, w: 160, h: 120, color: themeB.bg, stroke: themeB.border, subs: ['지원시설'] },
                { name: isEdu ? '감각통합실' : isHospital ? '원내약국' : isOffice ? '워크카페' : '편의시설', area: '96㎡', ch: 'CH 3.6m', x: 370, y: 220, w: 160, h: 100, color: themeB.bg, stroke: themeB.border, subs: ['서비스'] },
            ],
        },
        2: {
            label: isEdu ? '2F : 유치원 / 저학년' : isHospital ? '2F : 입원실 A' : isOffice ? '2F : 오픈 오피스' : '2F : 주요 공간',
            street: 'Play Street', streetColor: '#fef9c3', streetAccent: '#eab308',
            rooms: [
                { name: isEdu ? '유치원 교실 A' : isHospital ? '일반병동 A' : isOffice ? '팀 스페이스 A' : '공간 A', area: '72㎡', ch: 'CH 3.0m', x: 60, y: 80, w: 130, h: 90, color: themeC.bg, stroke: themeC.border, subs: ['기본업무'] },
                { name: isEdu ? '유치원 교실 B' : isHospital ? '일반병동 B' : isOffice ? '팀 스페이스 B' : '공간 B', area: '72㎡', ch: 'CH 3.0m', x: 60, y: 190, w: 130, h: 90, color: themeC.bg, stroke: themeC.border, subs: ['기본업무'] },
                { name: isEdu ? '유희실' : isHospital ? '간호스테이션' : isOffice ? '프로젝트실' : '지원실', area: '144㎡', ch: 'CH 4.5m', x: 60, y: 300, w: 130, h: 80, color: '#fff7ed', stroke: '#fdba74', subs: ['서포트'] },
                { name: isEdu ? '초등 1-2 교실' : isHospital ? '집중치료센터' : isOffice ? '개방형 워크존' : '메인공간', area: '132㎡', ch: 'CH 3.0m', x: 370, y: 80, w: 160, h: 100, color: themeA.bg, stroke: themeA.border, subs: ['집중구역'] },
                { name: isEdu ? '특별활동실' : isHospital ? '당직의국' : isOffice ? '화상회의룸' : '다목적룸', area: '96㎡', ch: 'CH 3.6m', x: 370, y: 200, w: 160, h: 100, color: themeB.bg, stroke: themeB.border, subs: ['협업'] },
            ],
        },
        3: {
            label: isEdu ? '3F : 중등 / 특화' : isHospital ? '3F : 수술 / 처치' : isOffice ? '3F : 임원 / 특화' : '3F : 특화 공간',
            street: 'Focus Street', streetColor: '#dcfce7', streetAccent: '#22c55e',
            rooms: [
                { name: isEdu ? '중학 교실' : isHospital ? '수술실 A' : isOffice ? '임원실' : '고급 기능구역', area: '198㎡', ch: 'CH 3.0m', x: 60, y: 80, w: 160, h: 120, color: themeA.bg, stroke: themeA.border, subs: ['특화'] },
                { name: isEdu ? '언어치료실' : isHospital ? '수술대기실' : isOffice ? '폰부스' : '방음공간', area: '48㎡', ch: 'CH 3.0m', x: 60, y: 220, w: 80, h: 70, color: '#fdf2f8', stroke: '#f9a8d4', subs: ['방음유리'] },
                { name: isEdu ? '심리안정실' : isHospital ? '멸균/세척실' : isOffice ? '프라이빗 라운지' : '안정실', area: '36㎡', ch: 'CH 3.0m', x: 150, y: 220, w: 70, h: 70, color: '#fdf2f8', stroke: '#f9a8d4', subs: ['보안'] },
                { name: isEdu ? '수치료실' : isHospital ? 'ICU 집중치료' : isOffice ? '대형 회의실' : '대회의실', area: '120㎡', ch: 'CH 4.2m', x: 370, y: 80, w: 160, h: 120, color: themeC.bg, stroke: themeC.border, subs: ['특수설비'] },
                { name: isEdu ? '작업치료실' : isHospital ? '장비/보관' : isOffice ? '오픈 테라스' : '오픈 데크', area: '72㎡', ch: 'CH 3.6m', x: 370, y: 220, w: 160, h: 80, color: themeC.bg, stroke: themeC.border, subs: ['휴게'] },
            ],
        },
        4: {
            label: isEdu ? '4F : 고등 / 직업' : isHospital ? '4F : 병실 / 옥상정원' : isOffice ? '4F : 스카이라운지' : '4F : 스카이존',
            street: 'Sky Street', streetColor: '#e0e7ff', streetAccent: '#6366f1',
            rooms: [
                { name: isEdu ? '고등 교실' : isHospital ? 'VIP 특실' : isOffice ? 'CEO 오피스' : '프리미엄 룸', area: '198㎡', ch: 'CH 3.0m', x: 60, y: 80, w: 160, h: 120, color: themeA.bg, stroke: themeA.border, subs: ['채광'] },
                { name: isEdu ? '전공과 실습' : isHospital ? '병동 라운지' : isOffice ? '임원식당' : '전망 라운지', area: '180㎡', ch: 'CH 3.6m', x: 60, y: 220, w: 160, h: 100, color: '#e0e7ff', stroke: '#a5b4fc', subs: ['파노라마 뷰'] },
                { name: isEdu ? '직업교육실' : isHospital ? '옥상 힐링정원' : isOffice ? '루프탑 정원' : '옥상 데크', area: '144㎡', ch: 'CH 3.6m', x: 370, y: 80, w: 160, h: 120, color: '#e0e7ff', stroke: '#a5b4fc', subs: ['바비큐/휴게'] },
                { name: isEdu ? '전환교육실' : isHospital ? '공조/유틸리티' : isOffice ? '기계/전산실' : '설비공간', area: '96㎡', ch: 'CH 3.0m', x: 370, y: 220, w: 160, h: 90, color: '#fef3c7', stroke: '#fbbf24', subs: ['유지관리'] },
            ],
        },
    };

    const altProfiles: Record<string, AltProfile> = {
        alt1: {
            cpo: 88, eduRatio: 65, commonRatio: 35, pathReduction: 18, zeb: 41.2, naturalLight: 78, acousticGap: '30m+',
            streetX: 230, streetW: 40, hubDx: 0,
            roomOffsets: {},
            loopStyle: 'balanced',
            evalSummary: '기능 간 동선을 18% 단축하여 관리 부하를 최소화하는 효율 중심 배치',
            evalGrade: 'A',
            evalScores: { operation: 95, safety: 85, energy: 72, bf: 90, cost: 88 },
        },
        alt2: {
            cpo: 96, eduRatio: 60, commonRatio: 40, pathReduction: 12, zeb: 38.5, naturalLight: 70, acousticGap: '25m',
            streetX: 210, streetW: 80, hubDx: 0,
            roomOffsets: { [floorData[1].rooms[0].name]: { dx: -20, dy: 10 }, [floorData[1].rooms[3].name]: { dx: 20, dy: 10 } },
            loopStyle: 'radial',
            evalSummary: '중앙 HUB 확대 및 주변 가시성 확보. 모니터링 시스템 효율 96% 최적화',
            evalGrade: 'A-',
            evalScores: { operation: 78, safety: 98, energy: 65, bf: 95, cost: 75 },
        },
        alt3: {
            cpo: 82, eduRatio: 68, commonRatio: 32, pathReduction: 10, zeb: 52.3, naturalLight: 92, acousticGap: '35m+',
            streetX: 230, streetW: 40, hubDx: 0,
            roomOffsets: { [floorData[1].rooms[0].name]: { dx: 0, dy: -10 }, [floorData[1].rooms[3].name]: { dx: 0, dy: -10 } },
            loopStyle: 'linear',
            evalSummary: '남향 채광 극대화 배치 (ZEB 특화). 코어 분산으로 동선 10% 증가',
            evalGrade: 'B+',
            evalScores: { operation: 72, safety: 80, energy: 97, bf: 88, cost: 82 },
        },
    };

    return { floorData, altProfiles };
};

const ALT_META = [
    { id: 'alt1', name: 'Alt 1 : 운영 효율형', shortName: '운영 효율', desc: '이동 동선 최적화 · 경로 단축 극대화', badge: 'Recommend', color: '#ea580c' },
    { id: 'alt2', name: 'Alt 2 : 가시성 극대화형', shortName: '안전성/인지성', desc: '중앙 HUB 방사형 · C2 동선 충돌 회피', badge: '', color: '#f59e0b' },
    { id: 'alt3', name: 'Alt 3 : 생태 에너지형', shortName: 'C6 환경 성능', desc: '자연 채광/환기 중점 · ZEB 최적화', badge: '', color: '#10b981' },
];

/* ──────────────────────────────────────────────
   Component
   ────────────────────────────────────────────── */
const CirculationLayoutPanel = () => {
    const store = useProjectStore();
    const buildingUse = store.buildingUse;
    const grossFloorArea = store.grossFloorArea;

    // Dynamic Engine Calibration for C2 (Safety/Conflict) and C6 (Energy/Environmental)
    const { floorData: FLOOR_DATA, altProfiles: ALT_PROFILES } = React.useMemo(() => {
        const data = getDynamicSimulationData(buildingUse);
        // Base penalty or boost based on scale
        const scaleFactor = grossFloorArea > 10000 ? 0.9 : 1.05; // Larger building = more conflict C2, harder energy C6
        
        // Refine Alt 1 (Operation)
        data.altProfiles.alt1.evalScores.safety = Math.min(100, Math.round(85 * scaleFactor));
        data.altProfiles.alt1.evalScores.energy = Math.min(100, Math.round(72 * scaleFactor));
        
        // Refine Alt 2 (Safety/Conflict - C2 Focused)
        data.altProfiles.alt2.evalScores.safety = Math.min(100, Math.round(98 / scaleFactor)); // Highly sensitive to scale
        data.altProfiles.alt2.evalScores.energy = Math.min(100, Math.round(65 * scaleFactor));
        
        // Refine Alt 3 (Environmental - C6 Focused)
        data.altProfiles.alt3.evalScores.safety = Math.min(100, Math.round(80 * scaleFactor));
        data.altProfiles.alt3.evalScores.energy = Math.min(100, Math.round(97 / scaleFactor)); // Highly sensitive to scale

        return data;
    }, [buildingUse, grossFloorArea]);

    const [activeFloor, setActiveFloor] = useState(1);
    const [activeAlt, setActiveAlt] = useState('alt1');
    const [layers, setLayers] = useState({ bus: true, pedestrian: true, emergency: false });

    // Simulation state
    const [simRunning, setSimRunning] = useState(false);
    const [simProgress, setSimProgress] = useState(0);       // 0–100
    const [simCurrentAlt, setSimCurrentAlt] = useState('');   // which alt is being analysed
    const [simDone, setSimDone] = useState(false);
    const [showEval, setShowEval] = useState(false);
    const [hasSimulated, setHasSimulated] = useState(false);
    const simTimerRef = useRef<number | null>(null);

    const toggleLayer = (layer: keyof typeof layers) => {
        setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
    };

    const handleExport = (format: string) => {
        const timestamp = new Date().toISOString().slice(0, 10);
        const filename = `arche_circulation_alt_${activeAlt}_${timestamp}`;
        
        // Assemble current alternatives data for export
        const exportPayload = {
            project: buildingUse || "Demo Project",
            activeAlternative: activeAlt,
            floorData: FLOOR_DATA, // Use local FLOOR_DATA
            evaluationMeta: ALT_META.find(a => a.id === activeAlt),
            evaluationProfile: ALT_PROFILES[activeAlt as keyof typeof ALT_PROFILES],
        };

        switch (format) {
            case 'JSON':
                exportToJSON(filename, exportPayload);
                break;
            case 'SVG':
                exportToSVG(filename, `
                    <rect width="100%" height="100%" fill="#f8fafc"/>
                    <text x="400" y="300" font-family="sans-serif" font-size="24" text-anchor="middle" fill="#334155">
                        Circulation Layout: ${exportPayload.evaluationMeta?.name}
                    </text>
                    <path d="M 100 100 L 700 500" stroke="#3b82f6" stroke-width="4" stroke-dasharray="8 8"/>
                `);
                break;
            case 'DXF':
                exportToDXF(filename, exportPayload);
                break;
            case 'IFC':
                exportToIFC(filename, exportPayload);
                break;
        }
    };

    /* ─── Simulation runner ─── */
    const startSimulation = useCallback(() => {
        setHasSimulated(true);
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
        <div className="w-full flex flex-col bg-[#F8FAFC] relative font-sans h-full overflow-hidden custom-scrollbar">
            {/* Top Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-white z-10 shadow-sm sticky top-0 shrink-0">
                <div className="flex items-center space-x-3">
                    <div className="bg-orange-50 p-2 rounded-lg text-orange-600">
                        <Navigation size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800 tracking-tight">
                            동선 및 프로그램 배치 (Circulation & Program Layout)
                        </h1>
                        <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-2xl line-clamp-1">
                            보차분리 · Double Loop 내부 동선 · 층별 Street 배치 시뮬레이션
                        </p>
                    </div>
                </div>
                <div className="flex space-x-3 shrink-0">
                    <button
                        onClick={startSimulation}
                        disabled={simRunning}
                        className={`flex items-center space-x-2 px-4 py-2 text-sm font-bold rounded-lg transition-all border shadow-md whitespace-nowrap ${
                            simRunning
                                ? 'bg-amber-50 border-amber-300 text-amber-600 cursor-wait'
                                : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-transparent'
                        }`}
                    >
                        {simRunning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                        <span>{simRunning ? '시뮬레이션 중...' : '배치 시뮬레이션'}</span>
                    </button>
                    <div className="relative group">
                        <button className="flex items-center space-x-2 px-4 py-2 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 text-sm font-bold rounded-lg transition-colors shadow-sm whitespace-nowrap">
                            <Layers size={16} className="text-slate-500" />
                            <span>CAD/BIM 연동</span>
                        </button>
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                            <div className="p-2 space-y-1">
                                <button onClick={() => handleExport('DXF')} className="w-full text-left px-3 py-2 text-[12px] font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded">DXF/DWG (AutoCAD)</button>
                                <button onClick={() => handleExport('IFC')} className="w-full text-left px-3 py-2 text-[12px] font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded">IFC (BIM Data)</button>
                                <button onClick={() => handleExport('JSON')} className="w-full text-left px-3 py-2 text-[12px] font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded">JSON (Data Params)</button>
                                <button onClick={() => handleExport('SVG')} className="w-full text-left px-3 py-2 text-[12px] font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-600 rounded">SVG (Vector Export)</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col p-4 md:p-6 min-h-0 overflow-hidden max-w-[1600px] mx-auto w-full gap-5">

            {/* Simulation progress bar */}
            {simRunning && (
                <div className="mb-4 bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[12px] font-bold text-slate-600 flex items-center gap-2">
                            <Loader2 size={14} className="animate-spin text-orange-500" />
                            배치 시뮬레이션 진행 중 — <span className="text-orange-600">{simAltLabel}</span> 분석 중
                        </span>
                        <span className="text-[12px] font-bold text-orange-600">{simProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-orange-400 via-amber-500 to-orange-600 transition-all duration-100" style={{ width: `${simProgress}%` }} />
                    </div>
                    <div className="flex justify-between mt-1.5 text-[10px] text-slate-400 font-medium">
                        <span className={simProgress >= 0 ? 'text-orange-500 font-bold' : ''}>운영 효율형</span>
                        <span className={simProgress >= 33 ? 'text-amber-500 font-bold' : ''}>감시 극대화형</span>
                        <span className={simProgress >= 66 ? 'text-orange-500 font-bold' : ''}>생태 에너지형</span>
                    </div>
                </div>
            )}

            <div className="flex-1 flex flex-col gap-5 min-h-0 overflow-hidden">
              {!hasSimulated ? (
                  <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 border border-slate-200 border-dashed rounded-lg m-1 mt-0">
                      <div className="w-16 h-16 bg-orange-50 rounded-lg flex items-center justify-center mb-4 text-orange-500 shadow-sm border border-orange-100">
                          <Activity strokeWidth={1.5} size={32} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-700 mb-2">분석 결과가 없습니다</h3>
                      <p className="text-slate-500 text-[13px] max-w-md text-center leading-relaxed">
                          우측 상단의 <strong className="text-orange-600">배치 시뮬레이션</strong> 버튼을 클릭하여 <br/>
                          다층 동선 분석, 레이어 충돌 감지, 및 자연감시 최적화를 진행하세요.
                      </p>
                  </div>
              ) : (
                <>
                  <div className="flex-1 grid grid-cols-12 gap-5 min-h-0">
                {/* ═══════════════ LEFT: Main Canvas ═══════════════ */}
                <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col overflow-hidden relative">
                    {/* Floor selector */}
                    <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur rounded-lg p-1.5 shadow-sm border border-slate-200 flex gap-1">
                        {[1, 2, 3, 4].map(f => (
                            <button key={f} onClick={() => setActiveFloor(f)}
                                className={`w-8 h-8 rounded shrink-0 flex items-center justify-center text-xs font-bold transition-colors ${activeFloor === f ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}
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
                            
                            {/* Upper floor cross-connections */}
                            {activeFloor > 1 && (
                                <g>
                                    <path d="M 235 220 C 400 350, 400 450, 400 500" fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="5 5" className="flow-anim" />
                                    <circle cx="235" cy="220" r="15" fill="none" stroke="#4f46e5" strokeWidth="3" />
                                    <circle cx="235" cy="220" r="5" fill="#4f46e5" />
                                    <text x="260" y="222" fill="#4f46e5" fontSize="10" fontWeight="bold">수직 코어 샤프트 연동 (Elev)</text>

                                    <path d="M 450 180 C 550 300, 550 400, 480 380" fill="none" stroke="#14b8a6" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" className="flow-anim" />
                                    <rect x="440" y="170" width="20" height="20" fill="none" stroke="#0d9488" strokeWidth="2" />
                                    <text x="470" y="185" fill="#0d9488" fontSize="8" fontWeight="bold">피난 계단 및 소방진입로 연결</text>
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
                    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center justify-between">
                            <span>동선 시스템 레이어</span><Layers size={14} />
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-[12px] font-medium">
                            <label className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${layers.bus ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                                <input type="checkbox" className="hidden" checked={layers.bus} onChange={() => toggleLayer('bus')} />
                                <Bus size={15} /> 차량/드롭오프
                            </label>
                            <label className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${layers.pedestrian ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                                <input type="checkbox" className="hidden" checked={layers.pedestrian} onChange={() => toggleLayer('pedestrian')} />
                                <Accessibility size={15} /> BF 보행동선
                            </label>
                            <label className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${layers.emergency ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                                <input type="checkbox" className="hidden" checked={layers.emergency} onChange={() => toggleLayer('emergency')} />
                                <Activity size={15} /> 비상차량 회차
                            </label>
                            <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 cursor-pointer transition-colors bg-white">
                                <Maximize2 size={15} /> 66인승 EV 코어
                            </label>
                        </div>
                    </div>

                    {/* AI Alternatives */}
                    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center justify-between">
                            <span>AI 배치 대안 (Alternatives)</span>
                            <span className="text-orange-500 bg-orange-50 px-2 py-0.5 rounded text-[10px] font-bold">Auto Gen</span>
                        </h3>
                        <div className="space-y-2">
                            {ALT_META.map(alt => (
                                <button key={alt.id} onClick={() => setActiveAlt(alt.id)}
                                    className={`w-full text-left p-3 rounded-lg border transition-all ${activeAlt === alt.id ? 'bg-orange-50 border-orange-300 ring-1 ring-orange-300' : 'bg-white border-slate-200 hover:border-orange-200 hover:bg-slate-50'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className={`font-bold text-sm ${activeAlt === alt.id ? 'text-orange-700' : 'text-slate-700'}`}>{alt.name}</span>
                                        {alt.badge && <span className="text-[9px] bg-orange-50 text-orange-600 font-bold px-1.5 py-0.5 rounded">{alt.badge}</span>}
                                    </div>
                                    <div className="text-[11px] text-slate-500 mt-0.5">{alt.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Live KPIs */}
                    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex-1 flex flex-col min-h-0">
                        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center justify-between">
                            <span>실시간 배치 검증 KPI</span><Settings size={14} className="text-slate-400" />
                        </h3>
                        <div className="space-y-3 overflow-y-auto" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                            {/* BF */}
                            <div className="border border-slate-100 rounded-lg p-3 bg-slate-50/50">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600"><Accessibility size={14} className="text-orange-500" /> BF 적합성 정밀진단</div>
                                    <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">100% Pass</span>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10.5px]">
                                    <span className="text-slate-500 flex justify-between">주요폭 <span className="font-bold text-slate-800">3.3m (≥2.4m)</span></span>
                                    <span className="text-slate-500 flex justify-between">경사로 <span className="font-bold text-slate-800">1/18 이하</span></span>
                                    <span className="text-slate-500 flex justify-between">회전반경 <span className="font-bold text-slate-800">1.4m × 1.4m</span></span>
                                    <span className="text-slate-500 flex justify-between">66인승EV <span className="font-bold text-slate-800">코어 직결</span></span>
                                    <span className="text-slate-500 flex justify-between">단차제거 <span className="font-bold text-slate-800">1.5cm 미만</span></span>
                                    <span className="text-slate-500 flex justify-between">시각표지 <span className="font-bold text-slate-800">점자/음성연동</span></span>
                                    <span className="text-slate-500 flex justify-between">손잡이 <span className="font-bold text-slate-800">2중 0.85m</span></span>
                                    <span className="text-slate-500 flex justify-between">피난기구 <span className="font-bold text-slate-800">경사로 대피</span></span>
                                </div>
                            </div>
                            {/* Zoning */}
                            <div className="border border-slate-100 rounded-lg p-3 bg-slate-50/50">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600"><ShieldCheck size={14} className="text-orange-500" /> 조닝 및 가시성</div>
                                    <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">Optimal</span>
                                </div>
                                <div className="mb-2">
                                    <div className="flex justify-between text-[11px] mb-1"><span className="text-slate-500">자연감시 CPO 면적</span><span className="font-bold text-orange-600">{profile.cpo}%</span></div>
                                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden"><div className="bg-orange-500 h-full rounded-full transition-all duration-500" style={{ width: `${profile.cpo}%` }} /></div>
                                </div>
                                <div className="flex gap-2 text-[11px]">
                                    <div className="flex-1 bg-orange-50 rounded p-1.5 text-center"><div className="text-orange-600 font-bold text-sm">{profile.eduRatio}%</div><div className="text-slate-500 text-[9px]">순수교육</div></div>
                                    <div className="flex-1 bg-slate-100 rounded p-1.5 text-center"><div className="text-slate-700 font-bold text-sm">{profile.commonRatio}%</div><div className="text-slate-500 text-[9px]">공용(Street 등)</div></div>
                                </div>
                            </div>
                            {/* Circulation */}
                            <div className="border border-slate-100 rounded-lg p-3 bg-slate-50/50">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600"><Activity size={14} className="text-orange-400" /> SKILL C3: 동선 최적화</div>
                                    <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded">-{profile.pathReduction}% 단축</span>
                                </div>
                                <div className="flex justify-between text-[11px] mb-1"><span className="text-slate-500">기존 분산형</span><span className="font-bold text-slate-400">왕복 420m</span></div>
                                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-1.5"><div className="bg-slate-300 h-full rounded-full w-full" /></div>
                                <div className="flex justify-between text-[11px] mb-1"><span className="text-slate-500">{ALT_META.find(a => a.id === activeAlt)?.shortName} 최적화</span><span className="font-bold text-orange-500">왕복 {Math.round(420 * (100 - profile.pathReduction) / 100)}m 예측</span></div>
                                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2"><div className="bg-gradient-to-r from-orange-300 to-orange-400 h-full rounded-full transition-all duration-500" style={{ width: `${100 - profile.pathReduction}%` }} /></div>
                                <div className="bg-white rounded p-1.5 border border-slate-100 text-[10px] text-slate-500 flex gap-1.5 mb-1 mt-2">
                                    <Waypoints size={10} className="text-orange-400 mt-0.5 shrink-0" />
                                    <span>AI RouteOpt 분석: 코어 집중화 및 더블루프 구조 적용으로 주요 기능간 선형 이동경로 대폭 삭감</span>
                                </div>
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
                <div className="shrink-0 bg-white border border-slate-200 rounded-lg shadow-sm p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                            <Trophy size={13} className="text-amber-500" /> 배치 대안 종합평가
                        </h3>
                        <div className="flex items-center gap-1.5 text-[10px] text-orange-600 font-bold">
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
                                    className={`text-left p-3 rounded-lg border transition-all ${isActive ? 'border-orange-300 bg-orange-50 ring-1 ring-orange-200' : 'border-slate-100 bg-slate-50/50 hover:border-orange-200'}`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[12px] font-bold" style={{ color: alt.color }}>{alt.name}</span>
                                        <div className="flex items-center gap-1">
                                            <span className="text-[10px] font-bold text-slate-500">종합</span>
                                            <span className={`text-lg font-extrabold ${isActive ? 'text-orange-700' : 'text-slate-700'}`}>{totalScore}<span className="text-[11px] font-bold text-slate-400">점</span></span>
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ml-1 ${totalScore >= 85 ? 'bg-orange-50 text-orange-600' : totalScore >= 80 ? 'bg-orange-50 text-orange-600' : 'bg-amber-50 text-amber-600'}`}>{p.evalGrade}</span>
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
                </>
              )}
            </div>
            </div>
        </div>
    );
};

export default CirculationLayoutPanel;
