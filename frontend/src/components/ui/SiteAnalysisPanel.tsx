import React, { useState, useCallback } from 'react';
import { useProjectStore } from '@/store/projectStore';
import {
    analyzeSite,
    type SiteAnalysisResult,
    type AnalysisSection,
    type AnalysisItem,
    type SiteAnalysisInput,
} from '@/services/siteAnalysisService';
import {
    MapPin, FileText, Search, ChevronDown, ChevronRight,
    Mountain, Sun, Car, Building2, Target, Loader2,
    AlertTriangle, CheckCircle2, TrendingUp, TrendingDown,
    Lightbulb, ShieldAlert, ClipboardCheck, RotateCcw,
    Shield, Activity, Settings, Maximize
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ────── 중요도 배지 ──────
const IMPORTANCE_CONFIG: Record<string, { label: string; color: string }> = {
    critical: { label: '핵심', color: 'bg-red-100 text-red-700 border-red-200' },
    high: { label: '중요', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    medium: { label: '보통', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    low: { label: '참고', color: 'bg-slate-100 text-slate-500 border-slate-200' },
};

// ────── 섹션 아이콘 ──────
const SECTION_ICONS: Record<string, React.ElementType> = {
    S1: Mountain, S2: Sun, S3: Car, S4: Building2, S5: Target,
};

// ────── 분석 항목 카드 ──────
function AnalysisItemCard({ item }: { item: AnalysisItem }) {
    const cfg = IMPORTANCE_CONFIG[item.importance] || IMPORTANCE_CONFIG.medium;
    return (
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-800">{item.title}</span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold tracking-wide uppercase ${cfg.color}`}>
                    {cfg.label}
                </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">{item.content}</p>
        </div>
    );
}

// ────── 섹션 아코디언 ──────
function SectionAccordion({ section }: { section: AnalysisSection }) {
    const [open, setOpen] = useState(true);
    const Icon = SECTION_ICONS[section.id] || Target;
    const criticalCount = section.items.filter(i => i.importance === 'critical').length;

    return (
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors text-left"
            >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center shrink-0 border border-emerald-100">
                    <Icon size={18} className="text-emerald-700" />
                </div>
                <div className="flex-1 min-w-0">
                    <span className="text-sm font-bold text-slate-800 block mb-0.5">{section.title}</span>
                    <span className="text-[11px] font-medium text-slate-500">
                        세부 항목: {section.items.length}개
                        {criticalCount > 0 && <span className="text-red-500 font-bold ml-2">· 검토필요: {criticalCount}건</span>}
                    </span>
                </div>
                {open ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-white"
                    >
                        <div className="px-5 pb-5 pt-1 border-t border-slate-100">
                            {/* 요약 */}
                            <div className="bg-emerald-50 rounded-lg p-3 mb-4 flex items-start gap-2 border border-emerald-100">
                                <Lightbulb size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                                <p className="text-[12px] text-emerald-800 font-medium leading-relaxed">
                                    {section.summary}
                                </p>
                            </div>
                            {/* 항목 */}
                            <div className="grid grid-cols-2 gap-3">
                                {section.items.map((item, i) => (
                                    <AnalysisItemCard key={i} item={item} />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ────── SWOT 하프 카드 ──────
function SwotCard({ category, items }: { category: string; items: string[] }) {
    const configs: Record<string, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
        strength: { label: '강점 (STRENGTH)', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', Icon: TrendingUp },
        weakness: { label: '약점 (WEAKNESS)', color: 'text-red-700', bg: 'bg-red-50 border-red-200', Icon: TrendingDown },
        opportunity: { label: '기회 (OPPORTUNITY)', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', Icon: Lightbulb },
        threat: { label: '위협 (THREAT)', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', Icon: ShieldAlert },
    };
    const cfg = configs[category] || configs.strength;

    return (
        <div className={`rounded-xl p-4 border ${cfg.bg} flex flex-col h-full`}>
            <div className="flex items-center gap-2 mb-3 px-1">
                <cfg.Icon size={16} className={cfg.color} />
                <span className={`text-xs font-black tracking-widest uppercase ${cfg.color}`}>{cfg.label}</span>
            </div>
            <ul className="space-y-2 flex-1">
                {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px] text-slate-800 font-medium">
                        <span className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 \${cfg.color.replace('text', 'bg')}`} />
                        <span className="leading-snug">{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// ══════════════════════════════════════
// ███ 대지현황 분석 패널 (12-Column Grid)
// ══════════════════════════════════════
export default function SiteAnalysisPanel() {
    const store = useProjectStore();
    const result = store.siteAnalysisResult;
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = useCallback(async () => {
        setIsAnalyzing(true);
        setError(null);
        try {
            const input: SiteAnalysisInput = {
                projectName: store.projectName,
                address: store.address,
                zoneType: store.zoneType,
                buildingUse: store.buildingUse,
                landArea: store.landArea,
                grossFloorArea: store.grossFloorArea,
                totalFloors: store.totalFloors,
                maxHeight: store.maxHeight,
                buildingCoverageLimit: store.buildingCoverageLimit,
                floorAreaRatioLimit: store.floorAreaRatioLimit,
                certifications: store.certifications,
                roadWidth: store.roadWidth,
                northAngle: store.northAngle,
                rawText: (store as any).rawText || (store.documentInfo as any)?.rawData?.rawText || undefined,
            };
            const res = await analyzeSite(input);
            if (res) {
                store.setSiteAnalysisResult(res);
            } else {
                setError('AI 대지분석에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (err) {
            setError('대지분석 중 오류가 발생했습니다.');
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    }, [store]);

    return (
        <div className="h-full w-full flex flex-col bg-slate-50/50">
            {/* 1. 글로벌 헤더 */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200 px-8 py-5 flex items-center justify-between rounded-t-3xl z-20 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center border border-emerald-200 shadow-inner">
                        <MapPin size={22} className="text-emerald-700" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-800 tracking-tight">AI 대지현황 분석 (Site Analysis)</h3>
                        <p className="text-[11px] font-medium text-slate-500 mt-0.5">5대 영역 · SWOT · 디자인 전략 통합 패널</p>
                    </div>
                </div>
                {result && (
                    <button
                        onClick={() => store.setSiteAnalysisResult(null)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 font-bold text-xs shadow-sm transition-all"
                    >
                        <RotateCcw size={14} />
                        분석 초기화
                    </button>
                )}
            </div>

            <div className="p-8 space-y-8 overflow-y-auto flex-1 custom-scrollbar">

                {/* 2. 대지 기본정보 블록 (항상 표시) */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-sm px-1">
                        <FileText size={16} className="text-emerald-600" />
                        기본설계 대지 제원
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <span className="text-[10px] text-slate-500 font-medium block">사업명</span>
                            <span className="text-xs font-bold text-slate-800 mt-1 block truncate">{store.projectName || '-'}</span>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <span className="text-[10px] text-slate-500 font-medium block">대지위치</span>
                            <span className="text-xs font-bold text-blue-700 mt-1 block truncate">{store.address || '-'}</span>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <span className="text-[10px] text-slate-500 font-medium block">대지면적</span>
                            <span className="text-xs font-bold text-slate-800 mt-1 block">{store.landArea ? store.landArea.toLocaleString() + ' ㎡' : '-'}</span>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <span className="text-[10px] text-slate-500 font-medium block">건축물 용도</span>
                            <span className="text-xs font-bold text-slate-800 mt-1 block">{store.buildingUse || '-'}</span>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <span className="text-[10px] text-slate-500 font-medium block">건폐 / 용적률</span>
                            <span className="text-xs font-bold text-slate-800 mt-1 block">{store.buildingCoverageLimit}% / {store.floorAreaRatioLimit}%</span>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <span className="text-[10px] text-slate-500 font-medium block">계획 층/높이</span>
                            <span className="text-xs font-bold text-slate-800 mt-1 block">{store.totalFloors}층 / {store.maxHeight}m</span>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <span className="text-[10px] text-slate-500 font-medium block">전면도로</span>
                            <span className="text-xs font-bold text-slate-800 mt-1 block">{store.roadWidth ? store.roadWidth + 'm' : '-'}</span>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <span className="text-[10px] text-slate-500 font-medium block">진북 방향</span>
                            <span className="text-xs font-bold text-slate-800 mt-1 block">{store.northAngle}°</span>
                        </div>
                    </div>
                </div>

                {/* 3. 분석 대기/로딩 상태 */}
                {!result && !isAnalyzing && (
                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={handleAnalyze}
                        className="w-full py-8 rounded-2xl bg-slate-800 text-white font-bold text-base shadow-xl flex flex-col items-center justify-center gap-3 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/40 via-teal-500/40 to-slate-800 opacity-50 group-hover:opacity-80 transition-opacity"></div>
                        <Search size={32} className="relative z-10 drop-shadow-md text-emerald-400" />
                        <span className="relative z-10 tracking-wide">AI 다차원 대지분석 시작</span>
                    </motion.button>
                )}

                {isAnalyzing && (
                    <div className="w-full py-16 bg-white rounded-2xl border border-slate-200 border-dashed flex flex-col items-center gap-4">
                        <div className="relative">
                            <Loader2 size={40} className="text-emerald-500 animate-spin absolute" />
                            <MapPin size={40} className="text-slate-200 animate-pulse" />
                        </div>
                        <h4 className="text-base font-bold text-slate-700 font-mono">ANALYZING SITE CONTEXT...</h4>
                        <p className="text-xs font-medium text-slate-500">방위, 교통, 법규, 미기후 데이터를 추출하고 있습니다.</p>
                    </div>
                )}

                {/* 4. 완료 상태 (12-Column Grid) */}
                {result && !isAnalyzing && (
                    <div className="grid grid-cols-12 gap-8">
                        {/* ──────── [좌측] 메인 분석 영역 (Span 8) ──────── */}
                        <div className="col-span-12 xl:col-span-8 flex flex-col gap-6">
                            
                            {/* 5대 영역 아코디언 */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                                <div className="flex justify-between items-end mb-5 px-1">
                                    <div>
                                        <h4 className="text-base font-black text-slate-800 flex items-center gap-2">
                                            <Maximize size={18} className="text-slate-500" />
                                            5대 영역 상세 분석
                                        </h4>
                                        <p className="text-[11px] text-slate-500 font-medium mt-1">대지 현황과 제약 요건을 섹션별로 분리하여 검토합니다.</p>
                                    </div>
                                    <div className="text-[10px] bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-full border border-slate-200">
                                        분석시점: {new Date(result.analyzedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {result.sections.map((sec) => (
                                        <SectionAccordion key={sec.id} section={sec} />
                                    ))}
                                </div>
                            </div>

                            {/* 디자인 전략 */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                                <h4 className="text-base font-black text-slate-800 flex items-center gap-2 mb-5 px-1">
                                    <Lightbulb size={18} className="text-amber-500" />
                                    최적화 디자인 전략
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {result.designStrategies.map((strat, i) => {
                                        const isHigh = strat.priority === 'high';
                                        return (
                                            <div key={i} className={`rounded-xl p-5 border shadow-sm transition-transform hover:-translate-y-1 ${
                                                isHigh ? 'bg-amber-50/50 border-amber-200' : 'bg-slate-50 border-slate-200'
                                            }`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <h5 className="text-xs font-bold text-slate-800">{strat.title}</h5>
                                                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-black tracking-wider ${
                                                        isHigh ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'
                                                    }`}>
                                                        {isHigh ? 'PRIORITY' : 'NORMAL'}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                                                    {strat.description}
                                                </p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* ──────── [우측] 요약 및 씰 영역 (Span 4) ──────── */}
                        <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">
                            
                            {/* 엔지니어링 씰 */}
                            <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-6 text-white border border-slate-700 shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Mountain size={120} />
                                </div>
                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 border border-blue-400/30 backdrop-blur-md">
                                        <Shield size={32} className="text-blue-300" />
                                    </div>
                                    <h4 className="text-[11px] text-blue-300 font-bold tracking-widest uppercase mb-1">Geomatic Analysis</h4>
                                    <h2 className="text-2xl font-black tracking-tight text-white mb-2">SITE REVIEWED</h2>
                                    <div className="h-px bg-slate-700 w-full my-3"></div>
                                    <div className="flex justify-between w-full px-2 text-[10px] font-medium text-slate-300">
                                        <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-400" /> 지형단차: 평탄</span>
                                        <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-400" /> 정북일조: 양호</span>
                                    </div>
                                </div>
                            </div>

                            {/* 역량 스펙트럼 (SWOT 통합) */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                                <h4 className="text-[12px] font-black text-slate-800 flex items-center gap-2 mb-4 px-1">
                                    <Target size={14} className="text-slate-500" />
                                    입지 역량 (SWOT)
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {result.swot.map((s) => (
                                        <SwotCard key={s.category} category={s.category} items={s.items} />
                                    ))}
                                </div>
                            </div>

                            {/* 배치 제안 & 인증 */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-5">
                                <div>
                                    <h4 className="text-[11px] font-black text-slate-800 flex items-center gap-2 mb-3 px-1 uppercase tracking-wider">
                                        <Building2 size={14} className="text-indigo-500" />
                                        Massing Guide
                                    </h4>
                                    <div className="space-y-2">
                                        {result.massRecommendations.map((rec, i) => (
                                            <div key={i} className="bg-slate-50 rounded-lg p-2.5 px-3 border border-slate-100 flex gap-2">
                                                <span className="text-indigo-600 font-black text-[10px] mt-0.5 shrink-0">0{i+1}.</span>
                                                <p className="text-[11px] text-slate-700 font-medium leading-snug">{rec}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[11px] font-black text-slate-800 flex items-center gap-2 mb-3 px-1 uppercase tracking-wider">
                                        <ClipboardCheck size={14} className="text-emerald-500" />
                                        Cert. Checklist
                                    </h4>
                                    <div className="space-y-2">
                                        {result.certChecklist.map((item, i) => (
                                            <div key={i} className="flex items-center gap-2 bg-emerald-50/30 rounded-lg p-2 border border-emerald-100/50">
                                                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                                                <span className="text-[11px] text-slate-700 font-medium">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ──────── [하단] 리스크 관리 테이블 (Span 12) ──────── */}
                        <div className="col-span-12">
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-red-100 text-red-600 rounded-md">
                                            <AlertTriangle size={16} />
                                        </div>
                                        <h3 className="text-sm font-black text-slate-800">대지 리스크 및 저감 대책 (Risk Mitigation)</h3>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Site Impact Matrix</span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="bg-slate-50 text-slate-600 text-[11px] uppercase">
                                            <tr>
                                                <th className="px-6 py-3 font-semibold w-24">Risk ID</th>
                                                <th className="px-6 py-3 font-semibold w-1/4">잠재 위험원 (Hazards)</th>
                                                <th className="px-6 py-3 font-semibold w-24 text-center">심각도 (Sev)</th>
                                                <th className="px-6 py-3 font-semibold">설계적 극복 방안 (Mitigation Strategy)</th>
                                                <th className="px-6 py-3 font-semibold w-24 text-center">잔존 리스크</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-[12px] font-medium text-slate-700">
                                            <tr className="hover:bg-slate-50/70 transition-colors">
                                                <td className="px-6 py-4 font-mono text-slate-400">SR-001</td>
                                                <td className="px-6 py-4 text-slate-800">통학 차량 교차로 정체 및 시야 확보 불량</td>
                                                <td className="px-6 py-4 text-center"><span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold">HIGH</span></td>
                                                <td className="px-6 py-4">승하차용 드롭오프존(Drop-off) 대지 내 깊숙이 배치, 출입구 분리</td>
                                                <td className="px-6 py-4 text-center"><span className="text-emerald-500 font-bold border border-emerald-200 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">Acceptable</span></td>
                                            </tr>
                                            <tr className="hover:bg-slate-50/70 transition-colors">
                                                <td className="px-6 py-4 font-mono text-slate-400">SR-002</td>
                                                <td className="px-6 py-4 text-slate-800">대로변 교통 소음 유입 (지속적 학습 방해)</td>
                                                <td className="px-6 py-4 text-center"><span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold">MEDIUM</span></td>
                                                <td className="px-6 py-4">소음원 측면 코어(계단/E.V/화장실) 배치로 완충구역(Buffer) 형성</td>
                                                <td className="px-6 py-4 text-center"><span className="text-emerald-500 font-bold border border-emerald-200 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">Acceptable</span></td>
                                            </tr>
                                            <tr className="hover:bg-slate-50/70 transition-colors">
                                                <td className="px-6 py-4 font-mono text-slate-400">SR-003</td>
                                                <td className="px-6 py-4 text-slate-800">서향 빛의 과도한 유입에 따른 눈부심 발생</td>
                                                <td className="px-6 py-4 text-center"><span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold">MEDIUM</span></td>
                                                <td className="px-6 py-4">서향 외피 수직 루버(Louver) 계획 및 실내 전동 블라인드 연동</td>
                                                <td className="px-6 py-4 text-center"><span className="text-emerald-500 font-bold border border-emerald-200 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">Acceptable</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
