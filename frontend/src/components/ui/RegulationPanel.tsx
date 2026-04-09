import React, { useState, useCallback, useEffect } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { ZONE_REGULATIONS } from '@/services/regulationEngine';
import {
    analyzeRegulations,
    analyzeSingleBatch,
    analyzeSingleLawDetail,
    REGULATION_BATCHES,
    type RegulationAnalysisResult,
    type RegulationCategory,
    type RegulationLaw,
    type ProjectInfoForRegulation,
} from '@/services/regulationAnalysisService';
import {
    extractSiteParameters,
    type SiteParameters,
} from '@/services/siteParameterService';
import {
    BookOpen, FileText, Award, AlertTriangle, Search,
    ChevronDown, ChevronRight, Building, Shield, Leaf,
    Car, Heart, Zap, ClipboardList, Loader2, CheckCircle2,
    Info, X, Database, MapPinned, Target, Compass, Mountain,
    BarChart3, GitBranch, RotateCcw, Hexagon, ShieldCheck, Server, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { CategoryAccordion } from './RegulationPanel/CategoryAccordion';
import { RegulationCatalogModal } from './RegulationPanel/RegulationCatalogModal';
import { SummaryCard } from './RegulationPanel/SummaryCard';
import { REGULATION_CATALOG } from './RegulationPanel/constants';


// ══════════════════════════════════════════════
// ███ 법규분석 패널 v2 (12-Column Grid High-Fidelity)
// ══════════════════════════════════════════════
export default function RegulationPanel() {
    const store = useProjectStore();
    const analysisResult = store.regulationAnalysisResult;
    const setAnalysisResult = store.setRegulationAnalysisResult;

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showCatalog, setShowCatalog] = useState(false);
    const [expandedRegIndex, setExpandedRegIndex] = useState<number | null>(null);
    const [batchProgress, setBatchProgress] = useState(0);

    const hasProjectInfo = !!(store.projectName && store.projectName !== '미정 프로젝트');
    const totalBatches = REGULATION_BATCHES.length;

    const handleAnalyze = useCallback(async () => {
        setIsAnalyzing(true);
        setError(null);
        setBatchProgress(0);
        setAnalysisResult(null);

        try {
            const projectInfo: ProjectInfoForRegulation = {
                projectName: store.projectName,
                address: store.address,
                zoneType: store.zoneType,
                buildingUse: store.buildingUse,
                landArea: store.landArea,
                grossFloorArea: store.grossFloorArea,
                totalFloors: store.totalFloors,
                buildingCoverageLimit: store.buildingCoverageLimit,
                floorAreaRatioLimit: store.floorAreaRatioLimit,
                maxHeight: store.maxHeight,
                certifications: store.certifications,
                rawText: (store as any).rawText || undefined,
            };

            const allCategories: RegulationCategory[] = [];
            let totalRequired = 0, totalReview = 0, totalInfo = 0;

            for (let i = 0; i < totalBatches; i++) {
                setBatchProgress(i + 1);
                const batchCategories = await analyzeSingleBatch(projectInfo, i);
                allCategories.push(...batchCategories);

                for (const cat of batchCategories) {
                    totalRequired += cat.laws.filter(l => l.risk === 'required').length;
                    totalReview += cat.laws.filter(l => l.risk === 'review').length;
                    totalInfo += cat.laws.filter(l => l.risk === 'info').length;
                }

                // 배치마다 중간 결과 즉시 업데이트 (실시간 렌더링)
                setAnalysisResult({
                    categories: [...allCategories],
                    overallSummary: { required: totalRequired, review: totalReview, info: totalInfo },
                    analyzedAt: new Date().toISOString(),
                });
            }

            setBatchProgress(0);

            // ███ 법규분석 완료 후 자동으로 SiteParameters 추출 ███
            const finalResult: RegulationAnalysisResult = {
                categories: allCategories,
                overallSummary: { required: totalRequired, review: totalReview, info: totalInfo },
                analyzedAt: new Date().toISOString(),
            };

            store.setSiteParamsLoading(true);
            store.setSiteParamsError(null);
            try {
                const siteParams = await extractSiteParameters(
                    projectInfo,
                    store.landUseRegulation,
                    finalResult,
                );
                store.setSiteParameters(siteParams);
                if (!siteParams) {
                    store.setSiteParamsError('SiteParameters 추출에 실패했습니다.');
                }
            } catch (paramErr) {
                store.setSiteParamsError('SiteParameters 추출 오류');
                console.error(paramErr);
            } finally {
                store.setSiteParamsLoading(false);
            }

        } catch (err) {
            setError('법규 분석 중 오류가 발생했습니다.');
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    }, [store, totalBatches]);

    return (
        <div className="h-full w-full flex flex-col bg-slate-50/50">
            {/* 1. 글로벌 헤더 (12-Column 시스템의 Sticky Header) */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200 px-8 py-5 flex items-center justify-between rounded-t-3xl z-20 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center shadow-inner">
                        <BookOpen size={22} className="text-white drop-shadow-sm" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                            AI 건축 법규 종합 분석 엔진 (Law Intelligence)
                            {analysisResult && <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full border border-orange-200">PARSER ACTIVE</span>}
                        </h3>
                        <p className="text-[11px] font-medium text-slate-500 mt-0.5">8대 카테고리 · 26+ 법규 · Gemini AI 분석 · 공공데이터 조례</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {!isAnalyzing && (
                        <button
                            onClick={handleAnalyze}
                            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-[13px] hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm active:scale-95 whitespace-nowrap"
                        >
                            <Search size={16} />
                            {analysisResult ? '법규 재분석' : 'AI 법규 분석 시작'}
                        </button>
                    )}
                    {analysisResult && (
                        <button
                            onClick={() => {
                                setAnalysisResult(null);
                                setError(null);
                                setBatchProgress(0);
                            }}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-orange-50 text-orange-700 border border-orange-200 text-[13px] font-bold transition-all shadow-sm active:scale-95 whitespace-nowrap"
                        >
                            <RotateCcw size={16} />
                            초기화
                        </button>
                    )}
                    <button
                        onClick={() => setShowCatalog(true)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-orange-200 bg-orange-50 text-orange-600 text-[13px] font-bold hover:bg-orange-100 transition-all shadow-sm active:scale-95 whitespace-nowrap"
                    >
                        <Info size={16} />
                        분석 법규 안내
                    </button>
                </div>
            </div>

            {/* 분석 법규 카탈로그 모달 */}
            {showCatalog && <RegulationCatalogModal onClose={() => setShowCatalog(false)} />}

            {/* 본문 컨텐츠 (12-Column Grid) */}
            <div className="p-8 pb-12 overflow-y-auto flex-1 custom-scrollbar">
                <div className="grid grid-cols-12 gap-8">
                    
                    {/* ──────── [좌측] 메인 분석 영역 (Span 8) ──────── */}
                    <div className="col-span-12 xl:col-span-8 flex flex-col gap-6">

                        {/* ─── AI 법규 빈 화면 ─── */}
                        {!analysisResult && !isAnalyzing && (
                            <div className="w-full py-12 bg-white rounded-lg border border-slate-200 border-dashed flex flex-col items-center gap-4 opacity-70">
                                <Shield size={40} className="text-slate-300" />
                                <h4 className="text-base font-bold text-slate-500">법규 분석 결과가 없습니다.</h4>
                                <p className="text-xs font-medium text-slate-400">우측 상단의 'AI 법규 분석 시작' 버튼을 클릭하여 검토를 진행하세요.</p>
                            </div>
                        )}

                        {/* ─── 분석 중 (배치 진행률) ─── */}
                        {isAnalyzing && (
                            <div className="w-full py-8 bg-white rounded-lg border border-orange-200 shadow-sm flex flex-col items-center gap-4">
                                <Loader2 size={32} className="text-orange-500 animate-spin" />
                                <div className="text-center">
                                    <p className="text-[17px] font-bold text-slate-900">Gemini AI 모델이 설계 법규를 교차 분석하고 있습니다...</p>
                                    <p className="text-[13px] text-slate-500 mt-1">
                                        배치 {batchProgress}/{totalBatches} 처리 중
                                        {batchProgress > 0 && <span className="font-semibold text-orange-600 ml-1">· {REGULATION_BATCHES[batchProgress - 1]?.label}</span>}
                                    </p>
                                </div>
                                <div className="w-full max-w-sm mt-2">
                                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(batchProgress / totalBatches) * 100}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-2 px-1">
                                        {REGULATION_BATCHES.map((b, i) => (
                                            <span key={b.batchId} className={`text-[10px] uppercase font-bold tracking-wider ${i < batchProgress ? 'text-orange-600' :
                                                i === batchProgress - 1 ? 'text-orange-500 animate-pulse' : 'text-slate-300'
                                                }`}>
                                                B{i+1}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ─── 오류 표출 ─── */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-5 flex items-center gap-3 shadow-sm">
                                <AlertTriangle size={20} className="text-red-500 shrink-0" />
                                <div>
                                    <p className="text-[14px] font-bold text-red-700">{error}</p>
                                    <button onClick={handleAnalyze} className="text-[12px] font-semibold text-red-600 underline mt-1">
                                        다시 시도
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ─── AI 법규 분석 결과 (아코디언 영역) ─── */}
                        {analysisResult && (
                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                                <div className="flex items-center justify-between mb-5 px-1">
                                    <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                                        <Shield size={18} className="text-orange-500" />
                                        카테고리별 법규 검토 상세
                                        <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full border border-slate-200">
                                            {analysisResult.categories.length} GROUPS
                                        </span>
                                    </h4>
                                    <span className="text-[11px] text-slate-400 font-medium">카드 클릭하여 AI 상세 해석 팝업 진입</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {analysisResult.categories.map((cat) => (
                                        <CategoryAccordion key={cat.id} category={cat} />
                                    ))}
                                </div>

                                {/* Removed Re-analysis trigger */}
                            </div>
                        )}

                        {/* ─── 공공데이터(VWorld) 기반 조례 분석 ─── */}
                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-5 px-1">
                                <Database size={18} className="text-orange-600" />
                                <h4 className="text-sm font-black text-slate-800">공공데이터 기반 자치조례 연동</h4>
                                {store.landUseRegulation && !store.landUseError && (
                                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 font-bold border border-orange-200 ml-auto">
                                        API 연결 완료 ({store.landUseRegulation.total_count}건)
                                    </span>
                                )}
                            </div>

                            {/* 조회 버튼 */}
                            {!store.landUseRegulation && !store.landUseLoading && (
                                <button
                                    onClick={() => store.fetchLandUseData(store.address)}
                                    disabled={!store.address || store.address === '미정'}
                                    className={`w-full py-4 rounded-lg text-[14px] font-bold flex items-center justify-center gap-2 transition-all ${
                                        store.address && store.address !== '미정'
                                            ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-md shadow-orange-200 active:scale-[0.99]'
                                            : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                    }`}
                                >
                                    <MapPinned size={18} />
                                    토지이용규제 조회 (VWorld API)
                                </button>
                            )}

                            {/* 로딩 */}
                            {store.landUseLoading && (
                                <div className="flex flex-col items-center justify-center gap-4 py-8">
                                    <div className="relative">
                                        <Loader2 size={32} className="text-orange-500 animate-spin" />
                                        <div className="absolute inset-0 w-8 h-8 rounded-full border-2 border-orange-200 animate-ping opacity-30" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[15px] text-slate-800 font-bold">건축행정시스템 조례 조회 중...</p>
                                        <p className="text-[12px] text-slate-500 mt-1">카카오 주소검색 → PNU 19자리 필터링 → VWorld WFS 요청</p>
                                    </div>
                                </div>
                            )}

                            {/* 에러 */}
                            {store.landUseError && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 mt-2">
                                    <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-[13px] text-red-700 font-bold">{store.landUseError}</p>
                                        <p className="text-[11px] text-red-500 mt-1">토지이용규제 브릿지 서버(포트 8010)가 실행 중인지 점검하세요.</p>
                                        <button onClick={() => store.fetchLandUseData(store.address)} className="text-[12px] font-bold text-red-600 underline mt-2 hover:text-red-800">API 다시 연결하기</button>
                                    </div>
                                </div>
                            )}

                            {/* 조회 결과 영역 */}
                            {store.landUseRegulation && !store.landUseError && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* PNU / 주소 정보 */}
                                        <div className="col-span-2 md:col-span-1 bg-slate-50 rounded-lg p-4 border border-slate-100 flex flex-col justify-center">
                                            <div className="flex items-center gap-2 text-[12px] mb-1.5">
                                                <span className="font-mono bg-orange-100 px-2 py-0.5 rounded text-orange-800 font-black tracking-widest border border-orange-200">
                                                    PNU {store.landUseRegulation.pnu_info.pnu}
                                                </span>
                                            </div>
                                            <p className="text-[13px] font-bold text-slate-700 flex items-center gap-1.5">
                                                <MapPinned size={14} className="text-orange-500" />
                                                {store.landUseRegulation.pnu_info.address_full}
                                            </p>
                                        </div>

                                        {/* 용도지역 정보 */}
                                        <div className="col-span-2 md:col-span-1 bg-slate-50 rounded-lg p-4 border border-slate-100 flex flex-col justify-center">
                                            <span className="text-[11px] font-bold text-slate-500 mb-1.5 flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                                공공 API 인가 용도지역
                                            </span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {store.landUseRegulation.zone_types.length > 0
                                                    ? store.landUseRegulation.zone_types.map((zone, i) => (
                                                        <span key={i} className="text-[12px] px-2.5 py-1 rounded bg-orange-600 text-white font-bold shadow-sm">
                                                            {zone}
                                                        </span>
                                                    ))
                                                    : <span className="text-[12px] text-slate-400 font-medium">단일 용도 미설정 (복합)</span>
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    {/* 조례상 건폐/용적률 게이지 */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[12px] text-slate-500 font-bold">건축조례상 최대 건폐율</span>
                                                <span className="text-[16px] font-black text-orange-700">
                                                    {store.landUseRegulation.max_building_coverage != null ? `${store.landUseRegulation.max_building_coverage}%` : '-'}
                                                </span>
                                            </div>
                                            {store.landUseRegulation.max_building_coverage != null && (
                                                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                                                    <div className="h-full rounded-full bg-orange-500 transition-all duration-700 ease-out"
                                                        style={{ width: `${Math.min(store.landUseRegulation.max_building_coverage, 100)}%` }} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[12px] text-slate-500 font-bold">건축조례상 최대 용적률</span>
                                                <span className="text-[16px] font-black text-orange-700">
                                                    {store.landUseRegulation.max_floor_area_ratio != null ? `${store.landUseRegulation.max_floor_area_ratio}%` : '-'}
                                                </span>
                                            </div>
                                            {store.landUseRegulation.max_floor_area_ratio != null && (
                                                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                                                    <div className="h-full rounded-full bg-orange-500 transition-all duration-700 ease-out"
                                                        style={{ width: `${Math.min(store.landUseRegulation.max_floor_area_ratio / 15, 100)}%` }} />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* 특수지구 감지 여부 */}
                                    {store.landUseRegulation.special_zones.length > 0 && (
                                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-sm">
                                            <div className="flex items-center gap-1.5 mb-2.5">
                                                <AlertTriangle size={15} className="text-amber-600" />
                                                <span className="text-[13px] font-black text-amber-800">주의: 특수 제한지구 / 규제구역 감지됨</span>
                                                <span className="text-[10px] bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-bold ml-auto border border-amber-300">
                                                    {store.landUseRegulation.special_zones.length} AREAS
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {store.landUseRegulation.special_zones.map((zone, i) => (
                                                    <span key={i} className="text-[11px] px-2.5 py-1 rounded bg-white text-amber-800 border border-amber-200 font-bold shadow-sm">
                                                        {zone}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 규제 항목 상세 블록들 */}
                                    {store.landUseRegulation.regulations.length > 0 && (
                                        <div className="mt-4">
                                            <div className="flex items-center justify-between mb-3 px-1">
                                                <span className="text-[13px] font-black text-slate-800 flex items-center gap-1.5">
                                                    <ClipboardList size={15} className="text-slate-500"/>
                                                    상세 조례 내역 ({store.landUseRegulation.regulations.length}건)
                                                </span>
                                                <span className="text-[11px] text-slate-400 font-medium">카드 클릭하여 조례 세부 내용 확인</span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {store.landUseRegulation.regulations.map((reg, i) => {
                                                    const typeColors: Record<string, string> = {
                                                        '용도지역': 'bg-orange-100 text-orange-800 border-orange-200',
                                                        '용도지역(상위)': 'bg-orange-50 text-orange-600 border-orange-100',
                                                        '용도지구': 'bg-orange-100 text-orange-800 border-orange-200',
                                                        '용도구역': 'bg-amber-100 text-amber-800 border-amber-200',
                                                        '도시계획시설': 'bg-amber-100 text-amber-800 border-amber-200',
                                                        '기타규제': 'bg-amber-100 text-amber-800 border-amber-200',
                                                    };
                                                    const badgeClass = typeColors[reg.regulation_type] || 'bg-slate-100 text-slate-600 border-slate-200';
                                                    const hasDetail = reg.detail != null;
                                                    const isOpen = expandedRegIndex === i;
                                                    return (
                                                        <div key={i}
                                                            className={`rounded-lg border transition-all flex flex-col ${reg.regulation_type === '도시계획시설' ? 'bg-amber-50/30 border-amber-100' :
                                                                reg.regulation_type.startsWith('용도지역') ? 'bg-orange-50/30 border-orange-100' :
                                                                    reg.regulation_type === '용도지구' ? 'bg-orange-50/30 border-orange-100' :
                                                                        'bg-slate-50/50 border-slate-100'
                                                                }`}
                                                        >
                                                            <div className="p-4 flex flex-col flex-1">
                                                                <div className="flex items-start justify-between mb-2 gap-2">
                                                                    <span className="text-[13px] font-bold text-slate-800 flex-1 leading-snug">{reg.regulation_name}</span>
                                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-bold whitespace-nowrap shrink-0 mt-0.5 ${badgeClass}`}>
                                                                        {reg.regulation_type}
                                                                    </span>
                                                                </div>
                                                                <span className="text-[10px] text-slate-400 font-mono mb-2">코드: {reg.regulation_code}</span>
                                                                
                                                                {hasDetail && (
                                                                    <div className="space-y-1.5 flex-1 mb-3">
                                                                        <p className="text-[11px] text-slate-600 flex items-start gap-1.5 leading-relaxed">
                                                                            <span className="text-slate-400 mt-0.5 shrink-0">•</span>
                                                                            <span className="line-clamp-2">{reg.detail!.restriction_summary}</span>
                                                                        </p>
                                                                        <p className="text-[11px] text-orange-700 font-medium flex items-start gap-1.5 leading-relaxed">
                                                                            <span className="text-orange-400 mt-0.5 shrink-0">•</span>
                                                                            <span className="line-clamp-2">{reg.detail!.design_impact}</span>
                                                                        </p>
                                                                    </div>
                                                                )}
                                                                
                                                                {/* 세부내용보기 버튼 */}
                                                                {hasDetail && (
                                                                    <button
                                                                        onClick={() => setExpandedRegIndex(isOpen ? null : i)}
                                                                        className="mt-auto w-full py-2 rounded-lg text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all
                                                                            bg-white text-slate-600 border border-slate-200 shadow-sm hover:border-orange-300 hover:text-orange-700 hover:bg-orange-50 active:scale-[0.98]"
                                                                    >
                                                                        <Search size={13} />
                                                                        조례 원문 해석
                                                                    </button>
                                                                )}
                                                            </div>

                                                            {/* 세부 상세 모달 보존 */}
                                                            <AnimatePresence>
                                                                {isOpen && hasDetail && (
                                                                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setExpandedRegIndex(null)}>
                                                                        <motion.div
                                                                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                                            transition={{ duration: 0.2 }}
                                                                            className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden"
                                                                            onClick={e => e.stopPropagation()}
                                                                        >
                                                                            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3 bg-gradient-to-r from-orange-50 to-orange-50 shrink-0">
                                                                                <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center shadow-inner">
                                                                                    <Database size={14} className="text-white" />
                                                                                </div>
                                                                                <div className="flex-1 min-w-0">
                                                                                    <h3 className="text-[14px] font-black text-slate-800 truncate">{reg.regulation_name}</h3>
                                                                                    <p className="text-[11px] font-bold text-slate-500 mt-0.5">{reg.regulation_type} · <span className="font-mono">{reg.regulation_code}</span></p>
                                                                                </div>
                                                                                <button onClick={() => setExpandedRegIndex(null)} className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors ml-1">
                                                                                    <X size={16} className="text-slate-500" />
                                                                                </button>
                                                                            </div>
                                                                            <div className="flex-1 overflow-y-auto px-5 py-5 custom-scrollbar bg-slate-50">
                                                                                <div className="space-y-4">
                                                                                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                                                                        <span className="text-[11px] font-bold text-slate-400 block mb-1">관련 법령 (Reference)</span>
                                                                                        <p className="text-[13px] font-semibold text-slate-800">{reg.detail!.related_law}</p>
                                                                                    </div>
                                                                                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                                                                        <span className="text-[11px] font-bold text-slate-400 block mb-1">행위 제한 요약 (Restriction)</span>
                                                                                        <p className="text-[13px] text-slate-700 leading-relaxed font-medium">{reg.detail!.restriction_summary}</p>
                                                                                    </div>
                                                                                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 shadow-sm">
                                                                                        <span className="text-[11px] font-bold text-orange-500 block mb-1">엔지니어 가이드 (Design Impact)</span>
                                                                                        <p className="text-[13px] font-bold text-orange-900 leading-relaxed">{reg.detail!.design_impact}</p>
                                                                                    </div>
                                                                                    {reg.detail!.management_agency && (
                                                                                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                                                                                            <span className="text-[11px] text-slate-500 font-bold block mb-0.5">관할 기관</span>
                                                                                            <span className="text-[12px] font-medium text-slate-700">{reg.detail!.management_agency}</span>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </motion.div>
                                                                    </div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                </div>
                            )}
                        </div>
                    </div>


                    {/* ──────── [우측] 요약 및 모니터링 영역 (Span 4) ──────── */}
                    <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">

                        {/* 엔지니어링 씰 (RFP Seal / Law Intelligence Complete) */}
                        <div className="bg-gradient-to-b from-orange-600 to-orange-500 rounded-lg p-6 text-white border border-orange-500 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-20">
                                <Hexagon size={120} className="text-white" />
                            </div>
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 border border-white/30 backdrop-blur-md shadow-inner">
                                    <ShieldCheck size={32} className="text-white drop-shadow-md" />
                                </div>
                                <h4 className="text-[10px] text-orange-100 font-bold tracking-widest uppercase mb-1 drop-shadow-sm">ARCHE LEGAL & REGULATION INTELLIGENCE</h4>
                                <h2 className="text-[18px] font-black tracking-tight text-white mb-2 drop-shadow-md">
                                    {analysisResult ? 'ANALYSIS COMPLETE' : isAnalyzing ? 'ANALYZING...' : 'STANDBY MODE'}
                                </h2>
                                <div className="h-px bg-orange-400/50 w-full my-3"></div>
                                <div className="flex flex-col gap-2 w-full text-[10px] font-bold text-orange-100 px-2">
                                    <div className="flex justify-between w-full">
                                        <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-white"/> 파싱 신뢰도</span>
                                        <span className={analysisResult ? "text-white font-black" : "text-orange-200"}>{analysisResult ? '96.2% (API Verified)' : '-'}</span>
                                    </div>
                                    <div className="flex justify-between w-full">
                                        <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-white"/> 법규 충돌 제어</span>
                                        <span className={analysisResult ? "text-white font-black" : "text-orange-200"}>{analysisResult ? 'Active' : '-'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 프로젝트 기본정보 요약 */}
                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-1 h-full bg-slate-800"></div>
                            <div className="flex items-center justify-between mb-4 px-1">
                                <h4 className="text-[13px] font-black text-slate-800 flex items-center gap-1.5">
                                    <Building size={16} className="text-slate-400" />
                                    대상지 제원 (Project Specs)
                                </h4>
                                {hasProjectInfo && (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-100 text-orange-600 font-bold uppercase tracking-wider border border-orange-200">
                                        A-1 Linked
                                    </span>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[12px] font-medium">
                                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 col-span-2">
                                    <span className="text-[10px] text-slate-400 font-bold block mb-0.5">프로젝트명</span>
                                    <p className="text-[13px] font-black text-slate-900 truncate">{store.projectName || '정보 없음'}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 col-span-2">
                                    <span className="text-[10px] text-slate-400 font-bold block mb-0.5">건축물 용도</span>
                                    <p className="text-[13px] font-black text-orange-600 truncate">{store.buildingUse || '정보 없음'}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                                    <span className="text-[10px] text-slate-400 font-bold block mb-0.5">대지면적</span>
                                    <p className="text-[12px] font-black text-slate-800">{store.landArea ? `${store.landArea.toLocaleString()}㎡` : '-'}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                                    <span className="text-[10px] text-slate-400 font-bold block mb-0.5">건폐율 / 용적률</span>
                                    <p className="text-[12px] font-black text-slate-800">
                                        {store.buildingCoverageLimit}% / {store.floorAreaRatioLimit}%
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 요약 대시보드 블록 (AI 결과 3색 카드) */}
                        {analysisResult && (
                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-1 h-full bg-slate-300"></div>
                                <h4 className="text-[13px] font-black text-slate-800 flex items-center gap-1.5 mb-4 px-1">
                                    <AlertCircle size={16} className="text-slate-400" />
                                    분석 리포트 요약
                                </h4>
                                <div className="flex flex-col gap-2">
                                    <SummaryCard label="필수 준수 법적 의무" count={analysisResult.overallSummary.required} color="bg-red-50 border-red-200 text-red-700" />
                                    <SummaryCard label="허가 및 조율 대상" count={analysisResult.overallSummary.review} color="bg-amber-50 border-amber-200 text-amber-700" />
                                    <SummaryCard label="기타 일반 조언" count={analysisResult.overallSummary.info} color="bg-slate-50 border-slate-200 text-slate-600" />
                                </div>
                            </div>
                        )}

                        {/* 사이트 파라미터 : Hard Constraints 카드뷰 압축본 */}
                        {store.siteParameters && (
                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 overflow-hidden relative flex-1 min-h-[300px]">
                                <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                                <h4 className="text-[13px] font-black text-slate-800 flex items-center gap-1.5 mb-4 px-1">
                                    <Target size={16} className="text-slate-400" />
                                    도출된 제약 조건 (Hard Constraints)
                                </h4>
                                <div className="grid grid-cols-2 gap-2 text-center">
                                    {[
                                        { label: '최대 허용 층수', value: `${store.siteParameters.hard_constraints.applied_max_floors}층`, color: 'text-slate-900' },
                                        { label: '고도/사선 높이', value: `${store.siteParameters.hard_constraints.applied_max_height_m}m`, color: 'text-slate-900' },
                                        { label: '적용 건폐율', value: `${store.siteParameters.hard_constraints.max_coverage_ratio_pct}%`, color: 'text-orange-600' },
                                        { label: '적용 용적률', value: `${store.siteParameters.hard_constraints.max_far_pct}%`, color: 'text-orange-600' },
                                    ].map((item, i) => (
                                        <div key={i} className="bg-slate-50 border border-slate-100 rounded-lg px-2 py-3">
                                            <span className="text-[10px] font-bold text-slate-400 block mb-0.5">{item.label}</span>
                                            <span className={`text-[15px] font-black ${item.color}`}>{item.value}</span>
                                        </div>
                                    ))}
                                    <div className="bg-slate-50 border border-slate-100 rounded-lg px-2 py-3 col-span-2">
                                        <span className="text-[10px] font-bold text-slate-400 block mb-0.5">건축 한계선 (Setback) 요약</span>
                                        <span className="text-[13px] font-black text-slate-900 truncate block">
                                            {store.siteParameters.setback_parameters?.road_setbacks?.[0]?.setback_m ? 
                                                `도로면 ${store.siteParameters.setback_parameters.road_setbacks[0].setback_m}m 이격 (최간)` 
                                                : '도출된 건축한계선 없음'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="glass-panel rounded-lg p-5 border border-slate-200 shadow-sm bg-white mt-auto">
                            <span className="text-[10px] text-slate-400 font-black block mb-3 flex items-center gap-1.5"><Server size={12}/> VWORLD / 3D GRAPHICS STATUS</span>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { name: 'VWorld WFS', active: !!store.landUseRegulation },
                                    { name: 'Regulation Engine', active: !!analysisResult },
                                    { name: 'Constraint Logic', active: !!store.siteParameters },
                                    { name: '3D Geometry', active: false },
                                ].map(s => (
                                    <div key={s.name} className="flex items-center gap-2 text-[10px] bg-slate-50 p-2 rounded-lg border border-slate-100">
                                        <div className={`w-1.5 h-1.5 rounded-full ${s.active ? 'bg-orange-500' : 'bg-slate-300'} ${s.active ? 'animate-pulse' : ''}`} />
                                        <span className="text-slate-500 font-bold">{s.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* ──────── [하단] 사이트 SWOT / 규제 충돌 매트릭스 (Span 12) ──────── */}
                    {store.siteParameters && (
                        <div className="col-span-12 mt-2">
                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-5 border-b border-orange-600 bg-gradient-to-r from-orange-600 to-orange-500 flex justify-between items-center text-white shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-white/20 text-white rounded-md shadow-inner">
                                            <AlertTriangle size={16} />
                                        </div>
                                        <h3 className="text-sm font-black text-white drop-shadow-sm">법적 규제 및 사업성 리스크 매트릭스 (Regulation Risk Matrix)</h3>
                                    </div>
                                    <span className="text-[10px] font-bold text-orange-100 uppercase tracking-widest drop-shadow-sm">Conflict & Mitigation Log</span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="bg-slate-50 text-slate-800 text-[11px] uppercase border-b border-slate-200">
                                            <tr>
                                                <th className="px-6 py-3 font-bold w-24">Type</th>
                                                <th className="px-6 py-3 font-bold w-1/3">리스크 및 기회 요인 (Hazard/Opportunity)</th>
                                                <th className="px-6 py-3 font-bold w-24 text-center">심각도</th>
                                                <th className="px-6 py-3 font-bold">보수적 설계 충돌 해결 방안 (Resolved by)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-[12px] font-medium text-slate-700">
                                            {/* Conflict Resolution Logs */}
                                            {store.siteParameters.hard_constraints.conflict_resolution_log?.map((log, i) => (
                                                <tr key={`conf-${i}`} className="hover:bg-orange-50/30 transition-colors">
                                                    <td className="px-6 py-4 font-mono text-[10px] text-amber-600 font-bold bg-amber-50">CONFLICT</td>
                                                    <td className="px-6 py-4 text-slate-900 font-bold whitespace-normal">
                                                        [{log.parameter}] 상충 발생: {String(log.value_a)} ({log.source_a}) ↔ {String(log.value_b)} ({log.source_b})
                                                    </td>
                                                    <td className="px-6 py-4 text-center"><span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-black">HIGH</span></td>
                                                    <td className="px-6 py-4 text-orange-600 font-bold">{String(log.resolved_value)} 채택 (사유: {log.rule})</td>
                                                </tr>
                                            ))}
                                            
                                            {/* SWOT - Threats */}
                                            {store.siteParameters.corrected_swot?.threats?.map((item, i) => (
                                                <tr key={`th-${i}`} className="hover:bg-slate-50/70 transition-colors">
                                                    <td className="px-6 py-4 font-mono text-[10px] text-red-600 font-bold bg-red-50">THREAT</td>
                                                    <td className="px-6 py-4 text-slate-700 whitespace-normal">{item}</td>
                                                    <td className="px-6 py-4 text-center"><span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-black">MED</span></td>
                                                    <td className="px-6 py-4 text-slate-500 italic">설계 지침 및 구조 계획 검토 시 유의</td>
                                                </tr>
                                            ))}

                                            {/* SWOT - Weakness */}
                                            {store.siteParameters.corrected_swot?.weaknesses?.map((item, i) => (
                                                <tr key={`wk-${i}`} className="hover:bg-slate-50/70 transition-colors">
                                                    <td className="px-6 py-4 font-mono text-[10px] text-orange-600 font-bold bg-orange-50">WEAKNESS</td>
                                                    <td className="px-6 py-4 text-slate-700 whitespace-normal">{item}</td>
                                                    <td className="px-6 py-4 text-center"><span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-black">MED</span></td>
                                                    <td className="px-6 py-4 text-slate-500 italic">내부 제약 보완 로직 적용 예정</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}