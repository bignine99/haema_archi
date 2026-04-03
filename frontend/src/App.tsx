import { Suspense, lazy, useState, useEffect } from 'react';
import LandingPage from '@/components/ui/LandingPage';
import Dashboard from '@/components/ui/Dashboard';
import RegulationPanel from '@/components/ui/RegulationPanel';
import SiteAnalysisPanel from '@/components/ui/SiteAnalysisPanel';
import MapPanel from '@/components/ui/MapPanel';
import BarrierFreePanel from '@/components/ui/BarrierFreePanel';
import SpaceProgrammingPanel from '@/components/ui/SpaceProgrammingPanel';
import { BubbleDiagramPanel } from '@/components/ui/BubbleDiagramPanel';
import { SpatialStrategyPanel } from '@/components/ui/SpatialStrategyPanel';
import CirculationLayoutPanel from '@/components/ui/CirculationLayoutPanel';
import SpecialDesignPanel from '@/components/ui/SpecialDesignPanel';
import DesignConceptGeneratorPanel from '@/components/ui/DesignConceptGeneratorPanel';
import ProjectCharacteristicsPanel from '@/components/ui/ProjectCharacteristicsPanel';
import {
    Search, LayoutDashboard, Scale, MapPin, Compass,
    Network, Grid, Building, Ruler, Box, PieChart,
    Lightbulb, ImageIcon, LogOut, ShieldCheck, Layers,
    FileText, Target, Milestone, Wrench, Settings, Leaf, Zap
} from 'lucide-react';

import { useProjectStore } from '@/store/projectStore';
import { type KakaoAddressResult } from '@/services/gisApi';
import { type ShadowAnalysisResult } from '@/components/three/ShadowAnalysis';
import { type SunPosition } from '@/utils/sunCalculator';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { Globe, Loader2 } from 'lucide-react';

const SceneViewer = lazy(() => import('@/components/three/SceneViewer'));
const AIMassPanel = lazy(() => import('@/components/ui/AIMassPanel'));
const ShadowAnalysisPanel = lazy(() => import('@/components/ui/ShadowAnalysisPanel'));
const SunlightPanel = lazy(() => import('@/components/ui/SunlightPanel'));

import { parseDocument } from '@/services/documentParser';

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

import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { allMenuItems } from '@/components/layout/navigation';

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

function Floating3DMetrics() {
    const store = useProjectStore();
    if (!store.massingResult || store.massingResult.error) return null;
    return (
        <div className="absolute bottom-[72px] left-1/2 -translate-x-1/2 z-30 bg-white/85 backdrop-blur-xl rounded-full shadow-lg border border-white/60 px-4 py-2 text-[11px]">
            <div className="flex items-center gap-4">
                <div><span className="text-slate-400">건폐율</span> <span className="font-bold text-orange-700">{store.massingResult.calculated_coverage_pct?.toFixed(1) || 0}%</span></div>
                <div><span className="text-slate-400">용적률</span> <span className="font-bold text-amber-700">{store.massingResult.calculated_far_pct?.toFixed(1) || 0}%</span></div>
                <div><span className="text-slate-400">GFA</span> <span className="font-bold text-slate-700">{store.massingResult.total_gfa_sqm?.toLocaleString() || 0}㎡</span></div>
                <div><span className="text-slate-400">높이</span> <span className="font-bold text-slate-700">{store.massingResult.max_height_m || 0}m/{store.massingResult.total_floors || 0}F</span></div>
            </div>
        </div>
    );
}

export default function App() {
    // 개발 환경에서는 바로 메인페이지 진입, 운영 환경에서는 랜딩페이지부터 시작
    const [isAuthorized, setIsAuthorized] = useState(process.env.NODE_ENV === 'development');
    const [activeMenu, setActiveMenu] = useState('task_analysis');
    const store = useProjectStore();
    
    // 자동 초기 데이터 세팅 (항상 과업지시서 기본값 활용)
    useEffect(() => {
        if (!store.documentInfo) {
            console.log("Loading default test RFP data...");
            fetch('/test_data/default_rfp.pdf')
                .then(res => res.blob())
                .then(blob => {
                    const file = new File(
                        [blob], 
                        '김해제2특수학교 교사 신축사업_설계용역과업지시서.pdf', 
                        { type: 'application/pdf' }
                    );
                    parseDocument(file).then(parsedData => {
                        store.updateFromDocument(file.name, parsedData);
                        console.log("Default RFP loaded and basic data populated!");
                    }).catch(console.error);
                })
                .catch(console.error);
        }
    }, []);

    // ─── 3D 시뮬레이션 상태 ───
    const sunlightEnabled = store.showSunlight;
    const showShadowHeatmap = store.showShadowAnalysis;
    const shadowAnalysisRequest = store.showShadowAnalysis ? 1 : 0;
    
    const sunlightDate = { 
        year: new Date().getFullYear(), 
        month: store.simulationMonth, 
        day: store.simulationDay 
    };

    const [sunPosition, setSunPosition] = useState<SunPosition | null>(null);
    const [shadowResult, setShadowResult] = useState<ShadowAnalysisResult | null>(null);
    const [showShadowPanel, setShowShadowPanel] = useState(false);
    
    useEffect(() => {
        if (store.showShadowAnalysis) setShowShadowPanel(true);
        else setShowShadowPanel(false);
    }, [store.showShadowAnalysis]);

    // 3D 매스 전용 뷰 (네이티브 렌더링)
    const render3DMassView = () => (
        <div className="h-full w-full relative overflow-hidden flex-1 flex flex-col">
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

                    <Floating3DMetrics />
                    
                    <Suspense fallback={null}>
                        <AIMassPanel />
                    </Suspense>

                    <AnimatePresence>
                        {showShadowPanel && shadowResult && (
                            <Suspense fallback={null}>
                                <ShadowAnalysisPanel
                                    enabled={store.showShadowAnalysis}
                                    analysisResult={shadowResult}
                                    onRunAnalysis={() => {}}
                                    onClear={() => setShadowResult(null)}
                                    onToggleHeatmap={() => store.setShowShadowAnalysis(!store.showShadowAnalysis)}
                                    showHeatmap={store.showShadowAnalysis}
                                />
                            </Suspense>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {sunlightEnabled && (
                            <Suspense fallback={null}>
                                <SunlightPanel
                                    enabled={sunlightEnabled}
                                    onToggle={() => store.setShowSunlight(!store.showSunlight)}
                                    lat={store.centerLat}
                                    lng={store.centerLng}
                                    onSunPositionChange={setSunPosition}
                                />
                            </Suspense>
                        )}
                    </AnimatePresence>
                </div>
            </AppErrorBoundary>
        </div>
    );

    // 단일 패널 뷰 (주소검색, 대지분석, 프로젝트 대시보드, 법규분석)
    const renderSingleView = (Component: React.ComponentType<any>, componentProps?: Record<string, any>) => (
        <div className="flex-1 flex overflow-hidden bg-slate-100 relative p-4 lg:p-8">
            {/* 데코레이션 배경 */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

            <div className="flex-1 h-full w-full max-w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col transition-all hover:shadow-2xl relative z-10">
                <Component {...(componentProps || {})} />
            </div>
        </div>
    );

    // 준비 중인 메뉴 뷰
    const renderPlaceholder = () => (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50">
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
            case '3dmass':
                return render3DMassView();
            case 'task_analysis':
                return renderSingleView(Dashboard, { onNavigate: setActiveMenu });
            case 'project_characteristics':
                return renderSingleView(ProjectCharacteristicsPanel);
            case 'concept_generator':
                return renderSingleView(DesignConceptGeneratorPanel);
            case 'regulation':
                return renderSingleView(RegulationPanel);
            case 'site':
                return renderSingleView(SiteAnalysisPanel);
            case 'bf_strategy':
                return renderSingleView(BarrierFreePanel);
            case 'space_zoning':
                return renderSingleView(SpaceProgrammingPanel);
            case 'bubble_b':
                return renderSingleView(BubbleDiagramPanel);
            case 'spatial_strategy':
                return renderSingleView(SpatialStrategyPanel);
            case 'circulation_layout':
                return renderSingleView(CirculationLayoutPanel);
            case 'special_design':
                return renderSingleView(SpecialDesignPanel);
            default:
                return renderPlaceholder();
        }
    }

    if (!isAuthorized) {
        return <LandingPage onEnter={() => setIsAuthorized(true)} />;
    }

    return (
        <div className="h-screen w-screen flex overflow-hidden font-sans text-slate-800" style={{ background: 'var(--bg-primary)' }}>

            {/* 최좌측 공통 네비게이션 메뉴 */}
            <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} setIsAuthorized={setIsAuthorized} />

            {/* 우측 메인 프레젠테이션 캔버스 */}
            <main
                className="h-full bg-white relative flex flex-col min-h-0"
                style={{ flex: 1, minWidth: 0, marginLeft: '220px' }}
            >
                {/* 상단 공통 헤더 */}
                <Header activeMenu={activeMenu} />

                {/* 컨텐츠 렌더링 영역 */}
                <div
                    className="overflow-y-auto custom-scrollbar bg-slate-50/30"
                    style={{ height: 'calc(100vh - 60px)' }}
                >
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}
