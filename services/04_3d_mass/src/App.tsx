import { Suspense, lazy, useState, useCallback, useRef, useEffect } from 'react';
import MapPanel from '@/components/ui/MapPanel';
import Dashboard from '@/components/ui/Dashboard';
import SiteAnalysisPanel from '@/components/ui/SiteAnalysisPanel';
import RegulationPanel from '@/components/ui/RegulationPanel';
import LandingPage from '@/components/ui/LandingPage';
import SunlightPanel from '@/components/ui/SunlightPanel';
import SunlightGuide from '@/components/ui/SunlightGuide';
import ShadowAnalysisPanel from '@/components/ui/ShadowAnalysisPanel';
import { type ShadowAnalysisResult } from '@/components/three/ShadowAnalysis';
import { useProjectStore, TYPOLOGY_LABELS, type TypologyType } from '@/store/projectStore';
import { type KakaoAddressResult } from '@/services/gisApi';
import { calculateSunPosition, type SunPosition } from '@/utils/sunCalculator';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Box, MapPin, ShieldCheck, BarChart3, FileText,
    ChevronLeft, ChevronRight, Search, Loader2, Globe, RotateCw, Eye, EyeOff, Boxes, Sun, LogOut
} from 'lucide-react';

const SceneViewer = lazy(() => import('@/components/three/SceneViewer'));
const AIMassPanel = lazy(() => import('@/components/ui/AIMassPanel'));

type MenuId = '3dmass' | 'site' | 'regulation' | 'aimass' | 'profitability' | 'documents';

interface MenuItem {
    id: MenuId;
    label: string;
    icon: React.ElementType;
    available: boolean;
}

const MENU_ITEMS: MenuItem[] = [
    { id: 'documents', label: '과업지시서', icon: FileText, available: true },
    { id: 'site', label: '대지 분석', icon: MapPin, available: true },
    { id: 'regulation', label: '법규 검토', icon: ShieldCheck, available: true },
    { id: '3dmass', label: '3D 사이트', icon: Globe, available: true },
    { id: 'aimass', label: 'AI 매스 설계', icon: Boxes, available: true },
    { id: 'profitability', label: '사업성 분석', icon: BarChart3, available: false },
];

function LoadingSpinner() {
    return (
        <div className="flex-1 flex items-center justify-center">
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
    const [showTypology, setShowTypology] = useState(false);
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
                        placeholder="주소 검색..."
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

            {/* ── 매스 타입 도구바 (제거됨 - AIMassPanel로 이동) ── */}

            {/* ── 매스 메트릭 (좌하단 플로팅) ── */}
            {store.massingResult && !store.massingResult.error && (
                <div className="absolute bottom-16 left-3 z-20 bg-white/85 backdrop-blur-xl rounded-xl shadow-lg border border-white/60 px-3 py-2 text-[10px]">
                    <div className="flex items-center gap-3">
                        <div><span className="text-slate-400">건폐율</span> <span className="font-bold text-orange-700">{store.massingResult.calculated_coverage_pct}%</span></div>
                        <div><span className="text-slate-400">용적률</span> <span className="font-bold text-amber-700">{store.massingResult.calculated_far_pct}%</span></div>
                        <div><span className="text-slate-400">GFA</span> <span className="font-bold text-slate-700">{store.massingResult.total_gfa_sqm.toLocaleString()}㎡</span></div>
                        <div><span className="text-slate-400">높이</span> <span className="font-bold text-slate-700">{store.massingResult.max_height_m}m/{store.massingResult.total_floors}F</span></div>
                    </div>
                </div>
            )}
        </>
    );
}

export default function App() {
    const [entered, setEntered] = useState(false);
    const [activeMenu, setActiveMenu] = useState<MenuId>('documents');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // 일조 시뮬레이션 상태
    const [sunlightEnabled, setSunlightEnabled] = useState(false);
    const [sunPosition, setSunPosition] = useState<SunPosition | null>(null);
    const [sunlightDate, setSunlightDate] = useState({ year: new Date().getFullYear(), month: 12, day: 22 });

    // 그림자 분석 상태
    const [shadowAnalysisRequest, setShadowAnalysisRequest] = useState(0);
    const [showShadowHeatmap, setShowShadowHeatmap] = useState(true);
    const [shadowResult, setShadowResult] = useState<ShadowAnalysisResult | null>(null);
    const [showShadowPanel, setShowShadowPanel] = useState(false);

    const store = useProjectStore();

    // API 키 입력 전 랜딩 페이지
    if (!entered) {
        return <LandingPage onEnter={() => setEntered(true)} />;
    }

    const handleNavigate = (menuId: string) => {
        const item = MENU_ITEMS.find(m => m.id === menuId);
        if (item?.available) setActiveMenu(menuId as MenuId);
    };

    // 3D 뷰어가 필요한 메뉴 ('3dmass'와 'aimass' 모두 3D 캔버스를 공유)
    const needs3D = activeMenu === '3dmass' || activeMenu === 'aimass';

    return (
        <div className="h-screen w-screen flex overflow-hidden bg-slate-100">
            {/* ════ 좌측 네비게이션 바 ════ */}
            <motion.div
                animate={{ width: sidebarCollapsed ? 56 : 220 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="h-full bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-sm z-30"
            >
                {/* 로고 */}
                <div className="flex items-center gap-2.5 px-3 py-4 border-b border-slate-100">
                    <div
                        className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center font-bold text-white text-sm shrink-0"
                        style={{ animation: 'haemaGlow 2s ease-in-out infinite' }}
                    >H</div>
                    {!sidebarCollapsed && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="min-w-0"
                        >
                            <h1
                                className="text-sm font-bold bg-clip-text text-transparent whitespace-nowrap"
                                style={{
                                    backgroundImage: 'linear-gradient(90deg, #facc15, #fb923c, #ea580c, #facc15)',
                                    backgroundSize: '200% 100%',
                                    animation: 'haemaColorShift 3s linear infinite',
                                }}
                            >HAEMA ARCHI</h1>
                            <p className="text-[9px] text-slate-400 -mt-0.5">AI 건축기획설계</p>
                        </motion.div>
                    )}
                </div>

                {/* 메뉴 */}
                <nav className="flex-1 py-2 px-2 space-y-0.5 overflow-y-auto">
                    {MENU_ITEMS.map(item => {
                        const isActive = activeMenu === item.id;
                        const show3DTools = item.id === '3dmass' && (activeMenu === '3dmass' || activeMenu === 'aimass') && !sidebarCollapsed;
                        return (
                            <div key={item.id}>
                                <button
                                    onClick={() => item.available && setActiveMenu(item.id)}
                                    disabled={!item.available}
                                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12px] font-medium transition-all ${isActive
                                        ? 'bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 shadow-sm border border-orange-100'
                                        : item.available
                                            ? 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                                            : 'text-slate-300 cursor-not-allowed'
                                        }`}
                                    title={item.label}
                                >
                                    <item.icon size={16} className={isActive ? 'text-orange-500' : ''} />
                                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                                    {!item.available && !sidebarCollapsed && (
                                        <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-400 ml-auto">준비중</span>
                                    )}
                                </button>

                                {/* ── 3D 사이트 서브메뉴: 분석 도구 ── */}
                                <AnimatePresence>
                                    {show3DTools && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="ml-4 mt-1 mb-1 pl-3 border-l-2 border-orange-200 space-y-0.5">
                                                <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-widest px-2 pt-1 pb-1.5">Analysis Tools</p>
                                                
                                                {/* 일조 시뮬레이션 */}
                                                <button
                                                    onClick={() => setSunlightEnabled(!sunlightEnabled)}
                                                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                                                        sunlightEnabled
                                                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                                    }`}
                                                >
                                                    <Sun size={13} className={sunlightEnabled ? 'text-amber-500' : 'text-slate-400'} />
                                                    <span>일조 시뮬레이션</span>
                                                    <span className={`ml-auto w-6 h-3.5 rounded-full relative transition-colors ${sunlightEnabled ? 'bg-amber-400' : 'bg-slate-200'}`}>
                                                        <span className={`absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white shadow-sm transition-all ${sunlightEnabled ? 'left-3' : 'left-0.5'}`} />
                                                    </span>
                                                </button>

                                                {/* 그림자 분석 */}
                                                <button
                                                    onClick={() => {
                                                        if (!sunlightEnabled) setSunlightEnabled(true);
                                                        if (shadowResult?.status === 'done') {
                                                            setShowShadowPanel(!showShadowPanel);
                                                        } else {
                                                            setShadowAnalysisRequest(Date.now());
                                                            setShowShadowPanel(true);
                                                        }
                                                    }}
                                                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                                                        shadowResult?.status === 'done'
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                            : shadowResult?.status === 'running'
                                                                ? 'bg-blue-50 text-blue-600 border border-blue-200 animate-pulse'
                                                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                                    }`}
                                                >
                                                    <BarChart3 size={13} className={shadowResult?.status === 'done' ? 'text-emerald-500' : 'text-slate-400'} />
                                                    <span>{shadowResult?.status === 'running' ? '분석 중...' : shadowResult?.status === 'done' ? '그림자 분석 ✓' : '그림자 분석'}</span>
                                                </button>

                                                {/* 히트맵 표시 */}
                                                {shadowResult?.status === 'done' && (
                                                    <button
                                                        onClick={() => setShowShadowHeatmap(!showShadowHeatmap)}
                                                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                                                            showShadowHeatmap
                                                                ? 'bg-orange-50 text-orange-700 border border-orange-200'
                                                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                                        }`}
                                                    >
                                                        {showShadowHeatmap ? <Eye size={13} className="text-orange-500" /> : <EyeOff size={13} className="text-slate-400" />}
                                                        <span>히트맵 표시</span>
                                                        <span className={`ml-auto w-6 h-3.5 rounded-full relative transition-colors ${showShadowHeatmap ? 'bg-orange-400' : 'bg-slate-200'}`}>
                                                            <span className={`absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white shadow-sm transition-all ${showShadowHeatmap ? 'left-3' : 'left-0.5'}`} />
                                                        </span>
                                                    </button>
                                                )}

                                                {/* 매스 가시성 */}
                                                {store.massingResult && (
                                                    <button
                                                        onClick={() => store.setShowMassing(!store.showMassing)}
                                                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                                                            store.showMassing
                                                                ? 'bg-orange-50 text-orange-700 border border-orange-200'
                                                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                                        }`}
                                                    >
                                                        {store.showMassing ? <Eye size={13} className="text-orange-500" /> : <EyeOff size={13} className="text-slate-400" />}
                                                        <span>매스 표시</span>
                                                        <span className={`ml-auto w-6 h-3.5 rounded-full relative transition-colors ${store.showMassing ? 'bg-orange-400' : 'bg-slate-200'}`}>
                                                            <span className={`absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white shadow-sm transition-all ${store.showMassing ? 'left-3' : 'left-0.5'}`} />
                                                        </span>
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </nav>

                {/* 하단 유틸 (로그아웃 버튼 등) */}
                <div className="p-2 border-t border-slate-100 flex flex-col gap-2">
                    <button
                        onClick={() => setEntered(false)}
                        className="w-full py-1.5 rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition-all flex items-center justify-center gap-2"
                        title="랜딩 페이지로 가기"
                    >
                        <LogOut size={16} />
                        {!sidebarCollapsed && <span className="text-xs font-medium">로그아웃</span>}
                    </button>
                    {/* 접기 버튼 */}
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="w-full py-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center"
                    >
                        {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>
                </div>
            </motion.div>

            {/* ════ 메인 콘텐츠 영역 ════ */}
            <div className="flex-1 flex overflow-hidden relative">
                <AnimatePresence mode="wait">
                    {needs3D ? (
                        /* ── 3D 매스 뷰: 전체 화면 + 플로팅 도구바 ── */
                        <motion.div
                            key="3dmass"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex-1 relative overflow-hidden"
                        >
                            <Suspense fallback={<LoadingSpinner />}>
                                <SceneViewer
                                    sunlightEnabled={sunlightEnabled}
                                    sunPosition={sunPosition}
                                    sunlightDate={sunlightDate}
                                    lat={store.centerLat || 37.5}
                                    lng={store.centerLng || 127.0}
                                    shadowAnalysisRequest={shadowAnalysisRequest}
                                    showShadowHeatmap={showShadowHeatmap}
                                    onShadowAnalysisResult={(r) => {
                                        setShadowResult(r);
                                    }}
                                />
                            </Suspense>

                            {/* 플로팅 검색바 */}
                            <Floating3DToolbar />

                            {/* ── AI 매스 설계 제어 패널 ── */}
                            <AnimatePresence>
                                {activeMenu === 'aimass' && (
                                    <Suspense fallback={<div className="absolute left-4 top-20 text-xs text-slate-400">Loading AI Mass Generator...</div>}>
                                        <AIMassPanel onClose={() => setActiveMenu('3dmass')} />
                                    </Suspense>
                                )}
                            </AnimatePresence>

                            {/* ═══ 우측 상단: 기능 토글바 ═══ */}
                            <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5">
                                {/* 매스 가시성 토글 (매스 생성된 경우에만 표시) */}
                                {store.massingResult && (
                                    <button
                                        onClick={() => store.setShowMassing(!store.showMassing)}
                                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-medium shadow-lg border transition-all ${store.showMassing
                                            ? 'bg-orange-500 text-white border-orange-400'
                                            : 'bg-white/90 text-slate-500 border-white/60 backdrop-blur-xl'
                                            }`}
                                    >
                                        {store.showMassing ? <Eye size={12} /> : <EyeOff size={12} />}
                                        매스
                                    </button>
                                )}

                                {/* ☀️ 일조 */}
                                <button
                                    onClick={() => setSunlightEnabled(!sunlightEnabled)}
                                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-medium shadow-lg border transition-all ${
                                        sunlightEnabled
                                            ? 'bg-amber-500 text-white border-amber-400'
                                            : 'bg-white/90 text-slate-500 border-white/60 backdrop-blur-xl hover:bg-amber-50'
                                    }`}
                                    title="일조 시뮬레이션 ON/OFF"
                                >
                                    <Sun size={12} />
                                    일조
                                </button>

                                {/* 📊 그림자 분석 */}
                                {sunlightEnabled && (
                                    <button
                                        onClick={() => {
                                            if (shadowResult?.status === 'done') {
                                                // 완료 상태: 패널 토글
                                                setShowShadowPanel(!showShadowPanel);
                                            } else {
                                                // 분석 실행
                                                setShadowAnalysisRequest(Date.now());
                                                setShowShadowPanel(true);
                                            }
                                        }}
                                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-medium shadow-lg border transition-all ${
                                            shadowResult?.status === 'done'
                                                ? 'bg-emerald-500 text-white border-emerald-400'
                                                : shadowResult?.status === 'running'
                                                    ? 'bg-blue-500 text-white border-blue-400 animate-pulse'
                                                    : 'bg-white/90 text-slate-500 border-white/60 backdrop-blur-xl hover:bg-emerald-50'
                                        }`}
                                        title="그림자 히트맵 분석"
                                        disabled={shadowResult?.status === 'running'}
                                    >
                                        <BarChart3 size={12} />
                                        {shadowResult?.status === 'running' ? '분석중...' : shadowResult?.status === 'done' ? '분석완료' : '그림자'}
                                    </button>
                                )}

                                {/* 🗺️ 히트맵 토글 */}
                                {sunlightEnabled && shadowResult?.status === 'done' && (
                                    <button
                                        onClick={() => setShowShadowHeatmap(!showShadowHeatmap)}
                                        className={`flex items-center gap-1 px-2 py-1.5 rounded-xl text-[10px] font-medium shadow-lg border transition-all ${
                                            showShadowHeatmap
                                                ? 'bg-orange-500 text-white border-orange-400'
                                                : 'bg-white/90 text-slate-500 border-white/60 backdrop-blur-xl'
                                        }`}
                                        title="히트맵 표시/숨기기"
                                    >
                                        {showShadowHeatmap ? <Eye size={12} /> : <EyeOff size={12} />}
                                    </button>
                                )}

                                {/* ❓ 가이드 */}
                                {sunlightEnabled && (
                                    <SunlightGuide visible={true} />
                                )}
                            </div>

                            {/* ═══ 그림자 분석 결과 패널 (분석 완료 + 패널 열림 시) ═══ */}
                            {sunlightEnabled && shadowResult?.status === 'done' && showShadowPanel && (
                                <ShadowAnalysisPanel
                                    enabled={true}
                                    analysisResult={shadowResult}
                                    onRunAnalysis={() => { setShadowAnalysisRequest(Date.now()); setShowShadowPanel(true); }}
                                    onClear={() => setShowShadowPanel(false)}
                                    onToggleHeatmap={() => setShowShadowHeatmap(!showShadowHeatmap)}
                                    showHeatmap={showShadowHeatmap}
                                />
                            )}

                            {/* 일조 시뮬레이션 UI 패널 */}
                            <SunlightPanel
                                enabled={sunlightEnabled}
                                onToggle={() => setSunlightEnabled(!sunlightEnabled)}
                                lat={store.centerLat || 37.5}
                                lng={store.centerLng || 127.0}
                                onSunPositionChange={(pos) => {
                                    setSunPosition(pos);
                                }}
                            />

                            <MapPanel isRightAligned={activeMenu === 'aimass'} />
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-panel px-6 py-2 flex items-center gap-4 z-10 shadow-sm border border-white/40">
                                <div className="flex items-center gap-2">
                                    <div className="w-16 h-[2px] bg-slate-400" />
                                    <span className="text-[10px] text-slate-600 font-medium">10m</span>
                                </div>
                                <span className="text-[11px] text-slate-600 font-medium">[MSA] 3D Mass Engine</span>
                            </div>
                        </motion.div>
                    ) : (
                        /* ── 대시보드/분석 패널 ── */
                        <motion.div
                            key={activeMenu}
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex-1 overflow-hidden"
                        >
                            {activeMenu === 'documents' && <Dashboard onNavigate={handleNavigate} />}
                            {activeMenu === 'site' && <SiteAnalysisPanel />}
                            {activeMenu === 'regulation' && <RegulationPanel />}
                            {activeMenu === 'profitability' && (
                                <div className="flex-1 flex items-center justify-center h-full">
                                    <p className="text-slate-400 text-sm">사업성 분석 모듈 — 준비중</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
