import React, { Suspense, lazy, useState, useCallback, useRef, useEffect } from 'react';
import MapPanel from '@/components/ui/MapPanel';
import SiteAnalysisPanel from '@/components/ui/SiteAnalysisPanel';
import RegulationPanel from '@/components/ui/RegulationPanel';
import LandingPage from '@/components/ui/LandingPage';
import SunlightPanel from '@/components/ui/SunlightPanel';
import SunlightGuide from '@/components/ui/SunlightGuide';
import ShadowAnalysisPanel from '@/components/ui/ShadowAnalysisPanel';
import BarrierFreePanel from '@/components/ui/BarrierFreePanel';
import { type ShadowAnalysisResult } from '@/components/three/ShadowAnalysis';
import { useProjectStore, TYPOLOGY_LABELS, type TypologyType } from '@/store/projectStore';
import { type KakaoAddressResult } from '@/services/gisApi';
import { calculateSunPosition, type SunPosition } from '@/utils/sunCalculator';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Box, MapPin, ShieldCheck, BarChart3, FileText,
    ChevronLeft, ChevronRight, Search, Loader2, Globe, RotateCw, Eye, EyeOff, Boxes, Sun, LogOut,
    ClipboardList, Home, Wrench, Leaf, Coins,
    Scale, Compass, Network, Grid, Lightbulb, ImageIcon, Layers,
    Target, Zap, Settings, Milestone
} from 'lucide-react';

const SceneViewer = lazy(() => import('@/components/three/SceneViewer'));
const AIMassPanel = lazy(() => import('@/components/ui/AIMassPanel'));
const ControlPanel = lazy(() => import('@/components/ui/ControlPanel'));
const SpecsAnalysisPanel = lazy(() => import('@/components/ui/SpecsAnalysisPanel'));
const SpaceProgrammingPanel = lazy(() => import('@/components/ui/SpaceProgrammingPanel'));
const Dashboard = lazy(() => import('@/components/ui/Dashboard'));

type MenuId = 'task_analysis' | 'site' | 'regulation' | 'space_zoning' | 'bubble_b' | 'spatial_strategy' | 'circulation_layout' | 'special_design' | 'structural_engineering' | 'eco_strategy' | 'energy_strategy' | 'bf_strategy' | '3dmass' | 'siteplan' | 'bubble_d' | 'floorplan' | 'concept_diagram';

const MENU_GROUPS = [
    {
        title: 'Phase A. 기획 및 분석',
        items: [
            { id: 'task_analysis', label: '과업지시서 분석', icon: <FileText size={18} /> },
            { id: 'site', label: '대지현황 분석', icon: <MapPin size={18} /> },
            { id: 'regulation', label: '법규/조례 검토', icon: <Scale size={18} /> },
        ]
    },
    {
        title: 'Phase B. 공간 프로그래밍',
        items: [
            { id: 'space_zoning', label: '층별 조닝 & 스페이스', icon: <Layers size={18} /> },
            { id: 'bubble_b', label: '버블다이어그램', icon: <Network size={18} /> },
            { id: 'spatial_strategy', label: '맞춤형 공간 특화 전략', icon: <Target size={18} /> },
            { id: 'circulation_layout', label: '동선 및 프로그램 배치', icon: <Milestone size={18} /> },
        ]
    },
    {
        title: 'Phase C. 전문엔지니어링 분석',
        items: [
            { id: 'special_design', label: '특화설계 제안', icon: <Wrench size={18} /> },
            { id: 'structural_engineering', label: '구조 및 엔지니어링', icon: <Settings size={18} /> },
            { id: 'eco_strategy', label: '친환경 특화 전략', icon: <Leaf size={18} /> },
            { id: 'energy_strategy', label: '에너지 특화전략', icon: <Zap size={18} /> },
            { id: 'bf_strategy', label: 'BF 특화전략', icon: <ShieldCheck size={18} /> },
        ]
    },
    {
        title: 'Phase D. 시각화 및 제안',
        items: [
            { id: '3dmass', label: '3D 매스', icon: <Box size={18} /> },
            { id: 'siteplan', label: '배치도', icon: <Compass size={18} /> },
            { id: 'floorplan', label: '평면/입면/단면도', icon: <Grid size={18} /> },
            { id: 'concept_diagram', label: '개념도 및 시각화', icon: <Lightbulb size={18} /> },
        ]
    }
];

const allMenuItems = MENU_GROUPS.flatMap(g => g.items);

function LoadingSpinner() {
    return (
        <div className="flex-1 flex items-center justify-center h-full w-full">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-xs text-slate-500">3D 엔진 로딩 중...</p>
            </div>
        </div>
    );
}

// ─── 플로팅 검색바 + 매스 도구바 (3D 뷰 위 오버레이) ───
function Floating3DToolbar() {
    const store = useProjectStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [kakaoResults, setKakaoResults] = useState<KakaoAddressResult[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const executeSearch = useCallback(async () => {
        if (!searchQuery.trim() || searchQuery.trim().length < 2) return;
        setIsSearching(true);
        setShowResults(true);
        try {
            const results = await store.searchRealAddress(searchQuery);
            setKakaoResults(results);
        } catch { setKakaoResults([]); }
        setIsSearching(false);
    }, [searchQuery, store]);

    const handleSelect = async (result: KakaoAddressResult) => {
        setSearchQuery(result.address_name);
        setShowResults(false);
        await store.loadRealParcel(result);
    };

    return (
        <>
            {/* ── 검색바 (좌상단 플로팅) ── */}
            <div className="absolute top-3 left-3 z-30" ref={dropdownRef}>
                <div className="flex items-center gap-1 bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-white/60 px-2 py-1">
                    <Search size={13} className="text-slate-400 shrink-0" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && executeSearch()}
                        className="bg-transparent border-none outline-none text-[11px] text-slate-800 placeholder:text-slate-400 w-[180px]"
                        placeholder={store.address || "주소 검색..."}
                    />
                    <button
                        onClick={executeSearch}
                        disabled={isSearching || !searchQuery.trim()}
                        className="px-2 py-1 rounded-lg text-[10px] font-semibold text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-40 transition-all flex items-center gap-1"
                    >
                        {isSearching ? <Loader2 size={10} className="animate-spin" /> : <Globe size={10} />}
                    </button>
                </div>

                {/* 검색 결과 드롭다운 */}
                <AnimatePresence>
                    {showResults && kakaoResults.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                            className="mt-1 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-xl overflow-hidden shadow-2xl max-h-[200px] overflow-y-auto"
                        >
                            {kakaoResults.map((r, i) => (
                                <button key={i} onClick={() => handleSelect(r)}
                                    className="w-full text-left px-3 py-2 text-[11px] hover:bg-blue-50 transition-colors border-b border-slate-100 last:border-0">
                                    <span className="text-slate-800 font-medium">{r.address_name}</span>
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── 매스 메트릭 (좌하단 플로팅) ── */}
            {store.massingResult && !store.massingResult.error && (
                <div className="absolute bottom-6 left-3 z-30 bg-white/85 backdrop-blur-xl rounded-xl shadow-lg border border-white/60 px-3 py-2 text-[10px]">
                    <div className="flex items-center gap-3">
                        <div><span className="text-slate-400">건폐율</span> <span className="font-bold text-orange-700">{store.massingResult.calculated_coverage_pct?.toFixed(1) || 0}%</span></div>
                        <div><span className="text-slate-400">용적률</span> <span className="font-bold text-amber-700">{store.massingResult.calculated_far_pct?.toFixed(1) || 0}%</span></div>
                        <div><span className="text-slate-400">GFA</span> <span className="font-bold text-slate-700">{store.massingResult.total_gfa_sqm?.toLocaleString() || 0}㎡</span></div>
                        <div><span className="text-slate-400">높이</span> <span className="font-bold text-slate-700">{store.massingResult.max_height_m || 0}m/{store.massingResult.total_floors || 0}F</span></div>
                    </div>
                </div>
            )}
        </>
    );
}

export default function App() {
    const [entered, setEntered] = useState(false);
    const [isEmbedded, setIsEmbedded] = useState(false);
    const [activeMenu, setActiveMenu] = useState<MenuId>('task_analysis');
    const store = useProjectStore();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const apiKey = params.get('apiKey');
        const embed = params.get('embed');
        const menu = params.get('menu');
        
        if (apiKey) {
            store.setGeminiApiKey(apiKey);
            setEntered(true);
        }
        if (embed === 'true') {
            setIsEmbedded(true);
            setEntered(true); // iframe 내부는 로그인 바이패스
        }
        if (menu) {
            setActiveMenu(menu as MenuId);
        }
    }, [store]);

    // 일조 및 그림자 시뮬레이션 상태 (Zustand 스토어 연동)
    const sunlightEnabled = store.showSunlight;
    const showShadowHeatmap = store.showShadowAnalysis;
    const shadowAnalysisRequest = store.showShadowAnalysis ? 1 : 0;
    
    // store.simulationMonth, store.simulationDay를 이용해 날짜 객체 생성
    const sunlightDate = { 
        year: new Date().getFullYear(), 
        month: store.simulationMonth, 
        day: store.simulationDay 
    };

    const [sunPosition, setSunPosition] = useState<SunPosition | null>(null);
    const [shadowResult, setShadowResult] = useState<ShadowAnalysisResult | null>(null);
    const [showShadowPanel, setShowShadowPanel] = useState(false);
    
    // 그림자 분석 결과 패널 표시 로직
    useEffect(() => {
        if (store.showShadowAnalysis) {
            setShowShadowPanel(true);
        } else {
            setShowShadowPanel(false);
        }
    }, [store.showShadowAnalysis]);

    // const store variables merged above
    if (!entered) {
        return <LandingPage onEnter={() => setEntered(true)} />;
    }

class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <div className="text-rose-500 mb-2"><Globe size={32} /></div>
                    <h3 className="text-sm font-bold text-slate-700">3D 엔진 로딩 오류</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm">
                        {this.state.error?.message?.includes?.('Context Lost') 
                            ? 'WebGL 렌더러가 메모리 초과로 해제되었습니다. 새 탭에서 열어주시거나 새로고침 해주세요.' 
                            : '3D 렌더링 중 오류가 발생했습니다.'}
                    </p>
                    <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded shadow text-xs hover:bg-blue-600">
                        페이지 새로고침
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

    // 3D 매스 전용 뷰 
    const render3DMassView = () => (
        <div className="h-full w-full relative overflow-hidden bg-slate-50 flex-1 flex flex-col min-h-0">
            {/* 3D Viewer Full Area */}
            <AppErrorBoundary>
                <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-200">
                    <Suspense fallback={<LoadingSpinner />}>
                        <SceneViewer
                            sunPosition={sunPosition}
                            sunlightEnabled={sunlightEnabled}
                            sunlightDate={sunlightDate}
                            shadowAnalysisRequest={shadowAnalysisRequest}
                            showShadowHeatmap={showShadowHeatmap}
                            onShadowAnalysisResult={setShadowResult}
                        />
                    </Suspense>

                    {/* 플로팅 검색바 및 메트릭 오버레이 */}
                    <Floating3DToolbar />
                    
                    {/* 3D UI Panels */}
                <AIMassPanel />

                <AnimatePresence>
                    {showShadowPanel && shadowResult && (
                        <ShadowAnalysisPanel
                            enabled={store.showShadowAnalysis}
                            analysisResult={shadowResult}
                            onRunAnalysis={() => {}}
                            onClear={() => setShadowResult(null)}
                            onToggleHeatmap={() => store.setShowShadowAnalysis(!store.showShadowAnalysis)}
                            showHeatmap={store.showShadowAnalysis}
                        />
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {sunlightEnabled && (
                        <>
                            <SunlightPanel
                                enabled={sunlightEnabled}
                                onToggle={() => store.setShowSunlight(!store.showSunlight)}
                                lat={store.centerLat}
                                lng={store.centerLng}
                                onSunPositionChange={setSunPosition}
                            />
                        </>
                    )}
                </AnimatePresence>
                </div>
            </AppErrorBoundary>
        </div>
    );

    // 단일 패널 뷰 (주소검색, 대지분석, 프로젝트 대시보드, 법규분석)
    const renderSingleView = (Component: React.ComponentType<any>, componentProps?: Record<string, any>) => (
        <div className="flex-1 flex overflow-hidden bg-slate-100 relative p-4 lg:p-8">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
            <div className="flex-1 h-full w-full max-w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col transition-all hover:shadow-2xl relative z-10">
                <Suspense fallback={<LoadingSpinner />}>
                    <Component {...(componentProps || {})} />
                </Suspense>
            </div>
        </div>
    );

    // 준비 중인 메뉴 뷰
    const renderPlaceholder = () => (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 h-full w-full">
            <div className="w-24 h-24 mb-6 rounded-2xl bg-white shadow-lg border border-slate-100 flex items-center justify-center text-4xl transform hover:scale-105 transition-transform">
                {allMenuItems.find(m => m.id === activeMenu)?.icon}
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">
                {allMenuItems.find(m => m.id === activeMenu)?.label}
            </h2>
            <p className="text-slate-500 text-sm">해당 모듈은 구성 중이거나 다음 프로세스에서 제공될 예정입니다.</p>
        </div>
    );

    const renderContent = () => {
        switch (activeMenu) {
            case 'task_analysis':
                return renderSingleView(Dashboard);
            case '3dmass':
            case 'siteplan':
                return render3DMassView();
            case 'regulation':
                return renderSingleView(RegulationPanel);
            case 'site':
                return renderSingleView(SiteAnalysisPanel);
            case 'bf_strategy':
                return renderSingleView(BarrierFreePanel);
            case 'space_zoning':
                return renderSingleView(SpaceProgrammingPanel);
            default:
                return renderPlaceholder();
        }
    }

    if (isEmbedded) {
        return (
            <div className="h-screen w-screen flex overflow-hidden font-sans text-slate-800 bg-white">
                <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                    <AppErrorBoundary>
                        <Suspense fallback={<LoadingSpinner />}>{renderContent()}</Suspense>
                    </AppErrorBoundary>
                </main>
                {/* ════ 우측 통합 컨트롤 패널 ════ */}
                <aside
                    className="w-[300px] flex-shrink-0 z-40 bg-[#0f172a] overflow-y-auto custom-scrollbar"
                    style={{ borderLeft: '1px solid #1e293b', boxShadow: '-4px 0 24px rgba(0,0,0,0.2)' }}
                >
                    <AppErrorBoundary>
                        <Suspense fallback={<LoadingSpinner />}>
                            <ControlPanel onNavigate={(id) => setActiveMenu(id as MenuId)} />
                        </Suspense>
                    </AppErrorBoundary>
                </aside>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen flex overflow-hidden font-sans text-slate-800" style={{ background: 'var(--bg-primary)' }}>

            {/* ════ 좌측 네비게이션 바 (Dark Theme) ════ */}
            <aside
                className="text-slate-300 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.15)] z-50 border-r border-slate-800 shrink-0"
                style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: '220px', backgroundColor: '#0f172a' }}
            >
                <div className="px-6" style={{ paddingTop: '28px', paddingBottom: '28px' }}>
                    <style>{`
                        @keyframes archeColorShift {
                            0% { background-position: 0% 50%; }
                            100% { background-position: 200% 50%; }
                        }
                        @keyframes archeGlow {
                            0%, 100% { box-shadow: 0 0 12px rgba(251,146,60,0.3); }
                            50% { box-shadow: 0 0 24px rgba(251,146,60,0.7), 0 0 48px rgba(251,146,60,0.3); }
                        }
                    `}</style>
                    <h1 className="text-lg font-bold tracking-widest flex items-center gap-2">
                        <span
                            className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-sm shadow-lg shrink-0"
                            style={{ animation: 'archeGlow 2s ease-in-out infinite' }}
                        >H</span>
                        <span
                            className="bg-clip-text text-transparent whitespace-nowrap"
                            style={{
                                backgroundImage: 'linear-gradient(90deg, #facc15, #fb923c, #ea580c, #facc15, #fb923c, #ea580c)',
                                backgroundSize: '200% 100%',
                                animation: 'archeColorShift 3s linear infinite',
                            }}
                        >ARCHE ARCHI</span>
                    </h1>
                    <p className="mt-2 mb-2 text-[10px] text-slate-500 tracking-wider">AI ARCHITECTURE PLATFORM</p>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 py-2" style={{ scrollbarWidth: 'none' }}>
                    <style>{`
                        nav::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>
                    <ul className="space-y-6">
                        {MENU_GROUPS.map((group, gIdx) => (
                            <li key={gIdx} className="space-y-2">
                                <div className="px-5 text-[10px] font-bold tracking-wider text-slate-500 mb-2">
                                    {group.title}
                                </div>
                                <ul className="space-y-1">
                                    {group.items.map(item => {
                                        const isActive = item.id === activeMenu;
                                        return (
                                            <li key={item.id}>
                                                <button
                                                    onClick={() => setActiveMenu(item.id as MenuId)}
                                                    className={`w-full text-left px-5 py-2.5 rounded-xl flex items-center transition-all duration-200 ${isActive
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
                </div>
            </aside>

            {/* ════ 메인 프레젠테이션 캔버스 ════ */}
            <main
                className="h-full bg-white relative flex flex-col min-h-0"
                style={{ flex: 1, minWidth: 0, marginLeft: '220px' }}
            >
                {/* 상단 공통 헤더 */}
                <header className="border-b border-slate-200 shrink-0 flex items-center justify-between px-6 bg-white z-20" style={{ height: '60px' }}>
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                            {allMenuItems.find(m => m.id === activeMenu)?.icon}
                        </div>
                        <h2 className="font-bold text-slate-800" style={{ fontSize: '18px' }}>
                            {allMenuItems.find(m => m.id === activeMenu)?.label} 모듈
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        {store.geminiApiKey ? (
                            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 font-medium border border-emerald-100 flex items-center gap-1.5 shadow-sm" title="Gemini API 연동 됨">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                API 연동 완료
                            </span>
                        ) : (
                            <span className="text-xs px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 font-medium border border-rose-100 flex items-center gap-1.5 shadow-sm" title="Gemini API 미연동">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                API 미연동 (재로그인 필요)
                            </span>
                        )}
                        <button 
                            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 border border-slate-200 px-3 py-1.5 rounded-md hover:bg-slate-50 transition-colors shadow-sm"
                            onClick={() => setEntered(false)}
                        >
                            <LogOut size={14} />
                            <span>랜딩 페이지로 이동</span>
                        </button>
                    </div>
                </header>

                {/* 컨텐츠 렌더링 영역 */}
                <div
                    className="flex-1 overflow-hidden bg-slate-50/30 flex flex-col min-h-0"
                >
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}
