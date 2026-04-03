import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
    analyzeLandUse,
    type LandUseRegulationResult,
} from '@/services/landUseService';
import {
    BookOpen, FileText, Award, AlertTriangle, Search,
    ChevronDown, ChevronRight, Building, Shield, Leaf,
    Car, Heart, Zap, ClipboardList, Loader2, CheckCircle2,
    Info, X, MapPin, Globe, Landmark,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ────── 조례 규제 항목 확장형 행 ──────
import type { LandUseRegulationItem, OrdinanceDetails } from '@/services/landUseService';

function OrdinanceDetailGrid({ ord }: { ord: OrdinanceDetails }) {
    const fields = [
        { label: '건폐율', value: ord.building_coverage, icon: '📐', color: 'bg-blue-50 border-blue-200 text-blue-800' },
        { label: '용적률', value: ord.floor_area_ratio, icon: '📊', color: 'bg-indigo-50 border-indigo-200 text-indigo-800' },
        { label: '높이제한', value: ord.height_limit, icon: '🏗️', color: 'bg-amber-50 border-amber-200 text-amber-800' },
        { label: '대지 안의 공지', value: ord.setback, icon: '↔️', color: 'bg-teal-50 border-teal-200 text-teal-800' },
        { label: '주차기준', value: ord.parking, icon: '🅿️', color: 'bg-slate-50 border-slate-200 text-slate-800' },
        { label: '조경기준', value: ord.landscape, icon: '🌳', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
        { label: '일조권 사선제한', value: ord.sunlight_regulation, icon: '☀️', color: 'bg-orange-50 border-orange-200 text-orange-800' },
    ];
    return (
        <div className="space-y-2">
            <div className="grid grid-cols-2 gap-1.5">
                {fields.filter(f => f.value).map((f, i) => (
                    <div key={i} className={`rounded-lg p-2 border ${f.color}`}>
                        <p className="text-[8px] font-semibold opacity-70 flex items-center gap-1">
                            <span>{f.icon}</span> {f.label}
                        </p>
                        <p className="text-[10px] font-bold leading-snug mt-0.5">{f.value}</p>
                    </div>
                ))}
            </div>
            {ord.permitted_uses.length > 0 && (
                <div className="rounded-lg p-2 border bg-green-50 border-green-200">
                    <p className="text-[8px] font-semibold text-green-700 mb-1">✅ 허용 용도</p>
                    <div className="flex flex-wrap gap-1">
                        {ord.permitted_uses.map((u, i) => (
                            <span key={i} className="text-[8px] px-1.5 py-0.5 rounded bg-green-100 text-green-800 border border-green-200">{u}</span>
                        ))}
                    </div>
                </div>
            )}
            {ord.prohibited_uses.length > 0 && (
                <div className="rounded-lg p-2 border bg-red-50 border-red-200">
                    <p className="text-[8px] font-semibold text-red-700 mb-1">🚫 금지/제한 용도</p>
                    <div className="flex flex-wrap gap-1">
                        {ord.prohibited_uses.map((u, i) => (
                            <span key={i} className="text-[8px] px-1.5 py-0.5 rounded bg-red-100 text-red-800 border border-red-200">{u}</span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function OrdinanceRegulationRow({ reg }: { reg: LandUseRegulationItem }) {
    const [expanded, setExpanded] = useState(false);
    const detail = reg.detail;
    const hasDetail = !!(detail && (detail.key_restrictions?.length || detail.ordinance_details));

    const typeBadge = reg.regulation_type === '용도지역' ? 'bg-blue-100 text-blue-700' :
        reg.regulation_type === '용도지구' ? 'bg-amber-100 text-amber-700' :
        reg.regulation_type === '용도구역' ? 'bg-purple-100 text-purple-700' :
        reg.regulation_type === '도시계획시설' ? 'bg-teal-100 text-teal-700' :
        'bg-slate-100 text-slate-600';

    const rowBg = reg.regulation_type === '용도지역' ? 'hover:bg-blue-50/50' :
        reg.regulation_type === '용도지구' ? 'hover:bg-amber-50/50' :
        reg.regulation_type === '용도구역' ? 'hover:bg-purple-50/50' : 'hover:bg-slate-50/50';

    return (
        <div className={`${rowBg} transition-colors`}>
            <button
                onClick={() => hasDetail && setExpanded(!expanded)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left ${hasDetail ? 'cursor-pointer' : 'cursor-default'}`}
            >
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-semibold shrink-0 ${typeBadge}`}>{reg.regulation_type}</span>
                <span className="text-[10px] font-medium text-slate-800 flex-1 min-w-0 truncate">{reg.regulation_name}</span>
                <span className="text-[9px] text-slate-400 shrink-0 max-w-[120px] truncate">{reg.law_name || ''}</span>
                {hasDetail && (
                    expanded ? <ChevronDown size={12} className="text-slate-400 shrink-0" /> : <ChevronRight size={12} className="text-slate-400 shrink-0" />
                )}
            </button>
            <AnimatePresence>
                {expanded && detail && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-3 pb-3 space-y-2">
                            {/* 핵심 제한사항 배지 */}
                            {detail.key_restrictions && detail.key_restrictions.length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-1">
                                    {detail.key_restrictions.map((kr, i) => (
                                        <span key={i} className="text-[8px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-semibold">⚡ {kr}</span>
                                    ))}
                                </div>
                            )}
                            {/* 설계 영향 */}
                            {detail.design_impact && (
                                <div className="bg-slate-50 rounded-lg p-2 border border-slate-200">
                                    <p className="text-[9px] text-slate-500 font-semibold mb-0.5">💡 설계 영향</p>
                                    <p className="text-[10px] text-slate-700 leading-relaxed">{detail.design_impact}</p>
                                </div>
                            )}
                            {/* 조례 상세 그리드 */}
                            {detail.ordinance_details && (
                                <OrdinanceDetailGrid ord={detail.ordinance_details} />
                            )}
                            {/* 관련 법령 · 관리기관 */}
                            <div className="flex items-center gap-3 text-[8px] text-slate-400 pt-1">
                                {detail.related_law && <span>📖 {detail.related_law}</span>}
                                {detail.management_agency && <span>🏛️ {detail.management_agency}</span>}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ────── 리스크 등급 배지 ──────
const RISK_CONFIG = {
    required: { label: '필수', color: 'bg-red-100 text-red-700 border-red-200', dot: '🔴' },
    review: { label: '검토', color: 'bg-amber-100 text-amber-700 border-amber-200', dot: '🟡' },
    info: { label: '참고', color: 'bg-blue-100 text-blue-700 border-blue-200', dot: '🔵' },
    na: { label: '해당없음', color: 'bg-slate-100 text-slate-500 border-slate-200', dot: '⚪' },
};

function RiskBadge({ risk }: { risk: string }) {
    const cfg = RISK_CONFIG[risk as keyof typeof RISK_CONFIG] || RISK_CONFIG.info;
    return (
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${cfg.color}`}>
            {cfg.dot} {cfg.label}
        </span>
    );
}

// ────── 카테고리 아이콘 ──────
const CATEGORY_ICONS: Record<string, React.ElementType> = {
    B1: Building, B2: Car, B3: Shield, B4: Heart,
    B5: Leaf, B6: Zap, B7: ClipboardList,
};

// ────── 법규 상세 분석 모달 (드릴다운) ──────
function LawDetailModal({ law, items, onClose }: { law: RegulationLaw; items: string[]; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-lg max-h-[75vh] flex flex-col overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-blue-50 shrink-0">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center">
                        <BookOpen size={12} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-bold text-slate-800 truncate">{law.name}</h3>
                        <p className="text-[10px] text-slate-500">AI 상세 분석 · {items.length}개 조항</p>
                    </div>
                    <RiskBadge risk={law.risk} />
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 transition-colors ml-1">
                        <X size={14} className="text-slate-400" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-5 py-4 custom-scrollbar">
                    <ol className="space-y-2.5">
                        {items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-[11px] text-slate-700 leading-relaxed">
                                <span className="text-indigo-400 font-mono shrink-0 mt-px text-[10px] w-4 text-right font-bold">
                                    {i + 1}.
                                </span>
                                <span>{item.replace(/^\d+\.\s*/, '')}</span>
                            </li>
                        ))}
                    </ol>
                </div>
                <div className="px-5 py-2 border-t border-slate-100 flex items-center gap-2 bg-slate-50 shrink-0">
                    <Info size={10} className="text-slate-400" />
                    <span className="text-[9px] text-slate-400 italic">AI 분석 결과 · temperature=0 · 설계 참고용</span>
                </div>
            </motion.div>
        </div>
    );
}

// ────── 법규 카드 (개별 법률 + 드릴다운 모달) ──────
function LawCard({ law }: { law: RegulationLaw }) {
    const store = useProjectStore();
    const [showDetail, setShowDetail] = useState(false);
    const [detailItems, setDetailItems] = useState<string[] | null>(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);

    const handleDetailClick = async () => {
        if (detailItems) { setShowDetail(!showDetail); return; }
        setIsLoadingDetail(true);
        try {
            const projectInfo: ProjectInfoForRegulation = {
                projectName: store.projectName, address: store.address,
                zoneType: store.zoneType, buildingUse: store.buildingUse,
                landArea: store.landArea, grossFloorArea: store.grossFloorArea,
                totalFloors: store.totalFloors,
                buildingCoverageLimit: store.buildingCoverageLimit,
                floorAreaRatioLimit: store.floorAreaRatioLimit,
                maxHeight: store.maxHeight, certifications: store.certifications,
            };
            const items = await analyzeSingleLawDetail(projectInfo, law.name);
            setDetailItems(items);
            setShowDetail(true);
        } catch (err) { console.error('세부 분석 오류:', err); }
        finally { setIsLoadingDetail(false); }
    };

    return (
        <div className={`rounded-xl border transition-all flex flex-col h-full ${law.risk === 'required' ? 'bg-red-50/50 border-red-200' :
            law.risk === 'review' ? 'bg-amber-50/50 border-amber-200' :
                law.risk === 'na' ? 'bg-slate-50/50 border-slate-200 opacity-50' :
                    'bg-blue-50/30 border-blue-200'
            }`}>
            <div className="p-3 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-800">{law.name}</span>
                    <RiskBadge risk={law.risk} />
                </div>
                <ul className="space-y-1 flex-1">
                    {law.items.slice(0, 3).map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                            <span className="text-slate-400 mt-0.5 shrink-0">•</span>
                            <span className="leading-relaxed line-clamp-2">{item}</span>
                        </li>
                    ))}
                    {law.items.length > 3 && (
                        <li className="text-[10px] text-slate-400 italic pl-3">
                            외 {law.items.length - 3}건...
                        </li>
                    )}
                </ul>
                {law.risk !== 'na' && (
                    <button
                        onClick={handleDetailClick}
                        disabled={isLoadingDetail}
                        className="mt-2 w-full py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all
                            bg-white/80 text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 hover:shadow-sm"
                    >
                        {isLoadingDetail ? (
                            <><Loader2 size={11} className="animate-spin" /> AI 상세 분석 중...</>
                        ) : (
                            <><Search size={11} /> 세부내용보기</>
                        )}
                    </button>
                )}
            </div>
            <AnimatePresence>
                {showDetail && detailItems && detailItems.length > 0 && (
                    <LawDetailModal law={law} items={detailItems} onClose={() => setShowDetail(false)} />
                )}
            </AnimatePresence>
        </div>
    );
}

// ────── 카테고리 아코디언 ──────
function CategoryAccordion({ category }: { category: RegulationCategory }) {
    const [open, setOpen] = useState(category.requiredCount > 0);
    const Icon = CATEGORY_ICONS[category.id] || ClipboardList;
    const applicableLaws = category.laws.filter(l => l.risk !== 'na');
    const naLaws = category.laws.filter(l => l.risk === 'na');

    return (
        <div className="rounded-xl border border-slate-200 overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center gap-2 px-3 py-2.5 bg-white hover:bg-slate-50 transition-colors text-left"
            >
                <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <Icon size={13} className="text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-slate-800 block">{category.title}</span>
                    <span className="text-[10px] text-slate-500">
                        {category.totalCount}개 법규 적용
                        {category.requiredCount > 0 && (
                            <span className="text-red-600 font-semibold ml-1.5">
                                {category.requiredCount}건 필수
                            </span>
                        )}
                    </span>
                </div>
                {open ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-3 pb-3 bg-slate-50/50 border-t border-slate-100">
                            <div className="pt-2 grid grid-cols-2 gap-2">
                                {applicableLaws.map((law, i) => (
                                    <LawCard key={i} law={law} />
                                ))}
                            </div>
                            {naLaws.length > 0 && (
                                <div className="text-[10px] text-slate-400 italic pt-2 mt-2 border-t border-slate-100">
                                    해당없음: {naLaws.map(l => l.name).join(', ')}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ────── 요약 대시보드 카드 ──────
function SummaryCard({ label, count, color }: { label: string; count: number; color: string }) {
    return (
        <div className={`rounded-xl px-4 py-3 text-center border ${color}`}>
            <p className="text-2xl font-bold">{count}</p>
            <span className="text-[10px] font-semibold">{label}</span>
        </div>
    );
}

// ────── 분석 법규 카탈로그 데이터 ──────
const REGULATION_CATALOG = [
    {
        id: 'B1', title: '입지 및 도시계획 관련 법규', icon: '🏙️',
        laws: [
            { name: '국토의 계획 및 이용에 관한 법률', desc: '용도지역별 건축제한(건폐율/용적률/높이), 지구단위계획, 개발행위허가 기준' },
            { name: '도시공원 및 녹지 등에 관한 법률', desc: '대지 내 녹지 확보 의무, 공원·녹지 조성 기준, 생태면적률' },
            { name: '도로법 및 사도법', desc: '접도 의무(대지와 도로 접합 기준), 도로 점용, 시거 확보, 진입도로 폭원' },
            { name: '문화재보호법', desc: '문화재 현상변경 허가 대상 여부, 매장문화재 지표조사 실시 의무' },
            { name: '항공안전법', desc: '비행안전구역 내 건축물 높이 제한, 장애물 표지 설치 기준' },
        ],
    },
    {
        id: 'B2', title: '기능 및 교통 관련 법규', icon: '🚗',
        laws: [
            { name: '주차장법', desc: '부설주차장 설치 대수·규격·차로 폭, 장애인 주차면, 전기차 충전시설, 경사로 기준' },
            { name: '도시교통정비 촉진법', desc: '교통영향평가 대상 여부, 진출입구 설계, 가감속차로, 대중교통 연계' },
        ],
    },
    {
        id: 'B3', title: '안전 및 방재 관련 법규', icon: '🔥',
        laws: [
            { name: '소방시설법', desc: '스프링클러, 옥내소화전, 비상방송, 소방차 진입로, 피난기구, 배연설비 설치 기준' },
            { name: '화재예방법', desc: '방화구획(면적/내화시간), 방화문, 내화구조, 내장재 불연 기준, 피난계단 설치' },
            { name: '다중이용업소 안전관리법', desc: '비상구, 완강기, 피난유도등 — 다중이용업소 해당 시 적용' },
            { name: '지진·화산재해대책법', desc: '내진등급, 중요도계수(학교 1.5), 내진설계 기준, 구조안전확인서' },
        ],
    },
    {
        id: 'B4', title: '복지 및 보건 관련 법규', icon: '♿',
        laws: [
            { name: '장애인등편의법', desc: '출입구 유효폭, 경사로 기울기, 점자블록, 장애인 화장실·승강기, BF인증' },
            { name: '노인복지법 / 영유아보육법', desc: '노유자시설 층수 제한, 피난구, 조리실 규격 — 해당 용도일 때 적용' },
        ],
    },
    {
        id: 'B5', title: '환경 및 에너지 관련 법규', icon: '🌿',
        laws: [
            { name: '녹색건축물 조성 지원법', desc: '에너지절약계획서, EPI, 녹색건축 인증, ZEB(제로에너지) 인증, BEMS 설치' },
            { name: '대기/물환경보전법', desc: '비산먼지 억제, 수질오염 방지, 폐수 배출 관리' },
            { name: '소음·진동관리법', desc: '공사중 소음 규제, 층간소음, 실내소음, 교통소음 기준' },
            { name: '환경영향평가법', desc: '소규모 환경영향평가 대상 여부(연면적 10,000㎡ 이상 시)' },
        ],
    },
    {
        id: 'B6', title: '기반시설 및 기술 관련 법규', icon: '⚡',
        laws: [
            { name: '하수도법', desc: '정화조 용량 산정, 공공하수도 연결 의무, 빗물 이용시설' },
            { name: '수도법', desc: '저수조 설치 기준, 절수설비 설치 의무, 음용수 수질 관리' },
            { name: '신재생에너지법', desc: '공공건축물 신재생에너지 의무설치 비율(총 에너지의 15% 이상)' },
            { name: '정보통신 / 전기공사업법', desc: '구내통신선로, 초고속통신 인증, 전기설비 안전 기준, 비상발전설비' },
        ],
    },
    {
        id: 'B7', title: '기타 특수 관련 법규', icon: '📋',
        laws: [
            { name: '주택법', desc: '공동주택 건설 기준 — 주택 용도일 때 적용' },
            { name: '교육환경 보호법', desc: '학교 경계 200m 상대정화구역, 교육환경평가서 제출 — 교육시설 시 적용' },
            { name: '건축물관리법', desc: '해체계획서, 유지관리 설계, 정기 안전점검' },
            { name: '학교시설사업 촉진법', desc: '교실 면적·채광·환기 기준, 운동장 확보, 특수교실 — 교육시설 시 적용' },
            { name: '학교보건법', desc: '환기량(21.6㎥/인·h), 조도(교실 300lux), 음용수, 냉난방 — 교육시설 시 적용' },
        ],
    },
];

// ────── 분석 법규 설명 모달 ──────
function RegulationCatalogModal({ onClose }: { onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center" onClick={onClose}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full mx-4 max-h-[85vh] flex flex-col"
                onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <BookOpen size={14} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">분석 법규 목록 (7대 카테고리)</h3>
                            <p className="text-[9px] text-slate-500">총 26+개 법규를 프로젝트 정보 기반으로 AI가 종합 분석합니다</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                        <X size={16} className="text-slate-500" />
                    </button>
                </div>
                <div className="overflow-y-auto flex-1 px-5 py-3 space-y-3 custom-scrollbar">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-2.5 flex items-start gap-2">
                        <Info size={12} className="text-blue-600 shrink-0 mt-0.5" />
                        <div className="text-[10px] text-blue-800 leading-relaxed">
                            <strong>분석 방식:</strong> 프로젝트 정보를 4배치로 나눠 Gemini AI에 전달하여 각 법규별 적용 여부와
                            구체적 수치 기준을 생성합니다. <code className="bg-blue-100 px-1 rounded">temperature=0</code>으로 일관된 결과를 보장합니다.
                        </div>
                    </div>
                    {REGULATION_CATALOG.map(cat => (
                        <div key={cat.id} className="rounded-xl border border-slate-200 overflow-hidden">
                            <div className="bg-slate-50 px-3 py-2 flex items-center gap-2 border-b border-slate-200">
                                <span className="text-sm">{cat.icon}</span>
                                <span className="text-[9px] text-slate-400 font-mono">{cat.id}</span>
                                <span className="text-[11px] font-bold text-slate-800">{cat.title}</span>
                                <span className="ml-auto text-[9px] text-slate-500">{cat.laws.length}개 법규</span>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {cat.laws.map((law, i) => (
                                    <div key={i} className="px-3 py-2 flex items-start gap-2 hover:bg-slate-50/50 transition-colors">
                                        <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 text-[8px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                            {i + 1}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold text-slate-800">{law.name}</p>
                                            <p className="text-[9px] text-slate-500 leading-relaxed">{law.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 flex items-start gap-2">
                        <AlertTriangle size={12} className="text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-[9px] text-amber-800 leading-relaxed">
                            <strong>참고:</strong> 교육연구시설 용도 시 B7에 학교시설사업촉진법·학교보건법이 자동 추가됩니다.
                            AI 분석 결과는 설계 참고용이며, 최종 법규 적합 여부는 관할 구청 및 건축사의 확인이 필요합니다.
                        </div>
                    </div>
                </div>
                <div className="px-5 py-2 border-t border-slate-200 flex justify-end shrink-0">
                    <button onClick={onClose} className="px-4 py-1.5 rounded-lg bg-slate-800 text-white text-[10px] font-semibold hover:bg-slate-700 transition-colors">
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}

// ══════════════════════════════════════════════
// ███ 법규분석 패널 v3 (배치 분석 + 드릴다운 + 조례분석 통합)
// ══════════════════════════════════════════════
export default function RegulationPanel() {
    const store = useProjectStore();
    const analysisResult = store.regulationAnalysisResult;
    const setAnalysisResult = store.setRegulationAnalysisResult;
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showCatalog, setShowCatalog] = useState(false);
    const [batchProgress, setBatchProgress] = useState(0);

    // ── 조례분석 상태 ──
    const [ordinanceAddress, setOrdinanceAddress] = useState(store.address || '');
    const ordinanceResult = store.ordinanceResult;
    const setOrdinanceResult = store.setOrdinanceResult;
    const [isOrdinanceLoading, setIsOrdinanceLoading] = useState(false);
    const [ordinanceError, setOrdinanceError] = useState<string | null>(null);

    const groupedRegulations = useMemo(() => {
        if (!ordinanceResult) return {};
        const groups: Record<string, typeof ordinanceResult.regulations> = {
            '용도지역': [],
            '용도지구': [],
            '용도구역': [],
            '도시계획시설': [],
            '기타': []
        };
        ordinanceResult.regulations.forEach(reg => {
            if (groups[reg.regulation_type]) {
                groups[reg.regulation_type].push(reg);
            } else {
                groups['기타'].push(reg);
            }
        });
        return groups;
    }, [ordinanceResult]);

    // 프로젝트 데이터(이름, 주소, 면적, 용도)가 변경되면 이전 분석 결과 초기화
    useEffect(() => {
        setAnalysisResult(null);
        setError(null);
        setOrdinanceResult(null);
        setOrdinanceError(null);
    }, [
        store.projectName, store.address, store.landArea, store.grossFloorArea,
        store.buildingUse, store.zoneType, setAnalysisResult, setOrdinanceResult
    ]);

    const hasProjectInfo = !!(store.projectName && store.projectName !== '미정 프로젝트');
    const totalBatches = REGULATION_BATCHES.length;

    // ── 배치 분석 핸들러 ──
    const handleAnalyze = useCallback(async () => {
        if (!store.geminiApiKey) {
            setError('API 키가 입력되지 않았습니다. 사이드 메뉴 좌하단의 설정에서 API 키를 입력해주세요.');
            return;
        }

        setIsAnalyzing(true);
        setError(null);
        setBatchProgress(0);
        setAnalysisResult(null);

        try {
            const projectInfo: ProjectInfoForRegulation = {
                projectName: store.projectName, address: store.address,
                zoneType: store.zoneType, buildingUse: store.buildingUse,
                landArea: store.landArea, grossFloorArea: store.grossFloorArea,
                totalFloors: store.totalFloors,
                buildingCoverageLimit: store.buildingCoverageLimit,
                floorAreaRatioLimit: store.floorAreaRatioLimit,
                maxHeight: store.maxHeight, certifications: store.certifications,
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

                // 배치마다 중간 결과 즉시 업데이트
                setAnalysisResult({
                    categories: [...allCategories],
                    overallSummary: { required: totalRequired, review: totalReview, info: totalInfo },
                    analyzedAt: new Date().toISOString(),
                });
            }

            setBatchProgress(0);
        } catch (err: any) {
            setError(err?.message || '법규 분석 중 오류가 발생했습니다.');
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    }, [store, totalBatches]);

    // ── 조례분석 핸들러 ──
    const handleOrdinanceAnalyze = useCallback(async () => {
        if (!ordinanceAddress.trim()) { setOrdinanceError('주소를 입력해주세요.'); return; }
        setIsOrdinanceLoading(true);
        setOrdinanceError(null);
        try {
            const result = await analyzeLandUse(ordinanceAddress.trim());
            setOrdinanceResult(result);
        } catch (err: any) {
            setOrdinanceError(err?.message || '조례분석 중 오류가 발생했습니다.');
            console.error(err);
        } finally {
            setIsOrdinanceLoading(false);
        }
    }, [ordinanceAddress]);

    return (
        <div className="h-full w-full flex flex-col bg-white">
            {/* 헤더 */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-6 py-3 flex items-center gap-3 rounded-t-3xl z-10 shrink-0">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <BookOpen size={16} className="text-blue-600" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-800">AI 종합 법규분석</h3>
                    <p className="text-[10px] text-slate-500">
                        8대 카테고리 · 26+ 법규 · 4배치 순차 분석 · 개별 드릴다운
                    </p>
                </div>
                <button
                    onClick={() => setShowCatalog(true)}
                    className="ml-auto flex items-center gap-1 px-2.5 py-1 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 text-[10px] font-semibold hover:bg-blue-100 transition-colors shrink-0"
                >
                    <Info size={12} />
                    분석 법규 설명
                </button>
            </div>

            {showCatalog && <RegulationCatalogModal onClose={() => setShowCatalog(false)} />}

            {/* 본문 */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar">

                {/* ─── 프로젝트 기본정보 요약 ─── */}
                <section className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-4 border border-slate-200">
                    <div className="flex items-center gap-2 mb-2">
                        <FileText size={14} className="text-blue-600" />
                        <h4 className="text-xs font-bold text-slate-800">프로젝트 기본정보</h4>
                        {hasProjectInfo && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold ml-auto">
                                ✓ 과업지시서 연동
                            </span>
                        )}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[11px]">
                        <div className="bg-white rounded-lg px-3 py-2">
                            <span className="text-slate-500 block text-[10px]">사업명</span>
                            <p className="font-bold text-slate-800 truncate">{store.projectName}</p>
                        </div>
                        <div className="bg-white rounded-lg px-3 py-2">
                            <span className="text-slate-500 block text-[10px]">건축물 용도</span>
                            <p className="font-bold text-slate-800">{store.buildingUse}</p>
                        </div>
                        <div className="bg-white rounded-lg px-3 py-2">
                            <span className="text-slate-500 block text-[10px]">용도지역</span>
                            <p className="font-bold text-blue-700">{store.zoneType}</p>
                        </div>
                        <div className="bg-white rounded-lg px-3 py-2">
                            <span className="text-slate-500 block text-[10px]">대지면적</span>
                            <p className="font-bold text-slate-800">{store.landArea.toLocaleString()}㎡</p>
                        </div>
                        <div className="bg-white rounded-lg px-3 py-2">
                            <span className="text-slate-500 block text-[10px]">건폐율 / 용적률</span>
                            <p className="font-bold text-slate-800">{store.buildingCoverageLimit}% / {store.floorAreaRatioLimit}%</p>
                        </div>
                        <div className="bg-white rounded-lg px-3 py-2">
                            <span className="text-slate-500 block text-[10px]">층수 / 높이</span>
                            <p className="font-bold text-slate-800">{store.totalFloors}층 / {store.maxHeight}m</p>
                        </div>
                    </div>
                    {store.certifications.length > 0 && (
                        <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                            <Award size={12} className="text-amber-600" />
                            <span className="text-[10px] text-amber-700 font-semibold">인증:</span>
                            {store.certifications.map((cert, i) => (
                                <span key={i} className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">{cert}</span>
                            ))}
                        </div>
                    )}
                </section>

                {/* ─── ① AI 법규 분석 시작 버튼 ─── */}
                {!analysisResult && !isAnalyzing && (
                    <button
                        onClick={handleAnalyze}
                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm
                                   hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-200
                                   flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                        <Search size={16} />
                        AI 법규 종합 분석 시작 (4배치 순차)
                    </button>
                )}

                {/* ─── 분석 중 (배치 진행률) ─── */}
                {isAnalyzing && (
                    <div className="w-full py-5 flex flex-col items-center gap-3">
                        <Loader2 size={24} className="text-blue-500 animate-spin" />
                        <div className="text-center">
                            <p className="text-sm font-semibold text-slate-700">Gemini AI가 법규를 분석하고 있습니다...</p>
                            <p className="text-[11px] text-slate-500 mt-1">
                                배치 {batchProgress}/{totalBatches} 진행 중
                                {batchProgress > 0 && ` · ${REGULATION_BATCHES[batchProgress - 1]?.label}`}
                            </p>
                        </div>
                        <div className="w-full max-w-xs">
                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(batchProgress / totalBatches) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                            <div className="flex justify-between mt-1">
                                {REGULATION_BATCHES.map((b, i) => (
                                    <span key={b.batchId} className={`text-[9px] font-medium ${i < batchProgress ? 'text-blue-600' :
                                        i === batchProgress - 1 ? 'text-blue-500 animate-pulse' : 'text-slate-400'
                                        }`}>
                                        {b.label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── 오류 ─── */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                        <AlertTriangle size={14} className="text-red-500 shrink-0" />
                        <div>
                            <p className="text-xs font-semibold text-red-700">{error}</p>
                            <button onClick={handleAnalyze} className="text-[10px] text-red-600 underline mt-0.5">다시 시도</button>
                        </div>
                    </div>
                )}

                {/* ─── ② AI 분석 결과 ─── */}
                {analysisResult && (
                    <>
                        {/* 요약 대시보드 */}
                        <section className="bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-2xl p-4 border border-emerald-200">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 size={16} className="text-emerald-600" />
                                <h4 className="text-sm font-bold text-slate-800">
                                    {isAnalyzing ? `분석 진행 중 (${batchProgress}/${totalBatches})` : '분석 완료'}
                                </h4>
                                <span className="text-[10px] text-slate-500 ml-auto">
                                    {new Date(analysisResult.analyzedAt).toLocaleString('ko-KR')}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <SummaryCard label="🔴 필수 준수" count={analysisResult.overallSummary.required} color="bg-red-50 border-red-200 text-red-700" />
                                <SummaryCard label="🟡 검토 필요" count={analysisResult.overallSummary.review} color="bg-amber-50 border-amber-200 text-amber-700" />
                                <SummaryCard label="🔵 참고" count={analysisResult.overallSummary.info} color="bg-blue-50 border-blue-200 text-blue-700" />
                            </div>
                        </section>

                        {/* 카테고리별 상세 분석 — 2단 그리드 */}
                        <section>
                            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-2">
                                <span className="w-6 h-6 rounded-full bg-slate-700 text-white text-[10px] flex items-center justify-center">
                                    {analysisResult.categories.length}
                                </span>
                                카테고리별 상세 분석
                                <span className="text-[10px] text-slate-400 font-normal ml-1">
                                    각 법률 카드의 "세부내용보기"로 AI 상세 드릴다운
                                </span>
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                                {analysisResult.categories.map((cat) => (
                                    <CategoryAccordion key={cat.id} category={cat} />
                                ))}
                            </div>
                        </section>

                        {/* 재분석 버튼 */}
                        {!isAnalyzing && (
                            <button
                                onClick={handleAnalyze}
                                className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 font-semibold text-xs
                                           hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <Search size={14} />
                                법규 재분석 (4배치)
                            </button>
                        )}
                    </>
                )}

                {/* ══════════════════════════════════════════════ */}
                {/* ███ 조례분석 (토지이용규제정보) 섹션 ███ */}
                {/* ══════════════════════════════════════════════ */}
                <section className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-200">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <Landmark size={14} className="text-emerald-700" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-800">조례분석 (토지이용규제)</h4>
                            <p className="text-[9px] text-slate-500">주소 → PNU 변환 → VWorld 토지이용계획 조회</p>
                        </div>
                    </div>

                    <div className="flex gap-2 mb-3">
                        <div className="relative flex-1">
                            <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={ordinanceAddress}
                                onChange={(e) => setOrdinanceAddress(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleOrdinanceAnalyze()}
                                placeholder="분석할 주소 입력 (예: 서울시 강남구 역삼동 123-45)"
                                className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs
                                           focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                            />
                        </div>
                        <button
                            onClick={handleOrdinanceAnalyze}
                            disabled={isOrdinanceLoading}
                            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold
                                       flex items-center gap-1.5 transition-colors disabled:opacity-60 shrink-0"
                        >
                            {isOrdinanceLoading ? <Loader2 size={14} className="animate-spin" /> : <Globe size={14} />}
                            조례 조회
                        </button>
                    </div>

                    {isOrdinanceLoading && (
                        <div className="py-5 flex flex-col items-center gap-2">
                            <Loader2 size={24} className="text-emerald-500 animate-spin" />
                            <p className="text-xs text-slate-600 font-semibold">토지이용규제 조회 중...</p>
                            <p className="text-[10px] text-slate-400">PNU 변환 → VWorld API 호출 (약 3초)</p>
                        </div>
                    )}

                    {ordinanceError && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 mb-3">
                            <AlertTriangle size={14} className="text-red-500 shrink-0" />
                            <div>
                                <p className="text-xs font-semibold text-red-700">{ordinanceError}</p>
                            </div>
                        </div>
                    )}

                    {ordinanceResult && !isOrdinanceLoading && (
                        <div className="space-y-3">
                            <div className="bg-white rounded-xl p-3 border border-slate-200">
                                <div className="grid grid-cols-3 gap-2 text-[10px]">
                                    <div>
                                        <span className="text-slate-400 block">주소</span>
                                        <p className="font-bold text-slate-800">{ordinanceResult.pnu_info.address_full}</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block">PNU (19자리)</span>
                                        <p className="font-mono font-bold text-blue-700">{ordinanceResult.pnu_info.pnu}</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block">규제 항목 수</span>
                                        <p className="font-bold text-emerald-700">{ordinanceResult.total_count}건</p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="bg-blue-50 rounded-xl p-3 border border-blue-200 text-center">
                                    <p className="text-[9px] text-blue-600 font-semibold">용도지역</p>
                                    <p className="text-xs font-bold text-blue-800 mt-1">
                                        {ordinanceResult.zone_types.length > 0 ? ordinanceResult.zone_types.join(', ') : '-'}
                                    </p>
                                </div>
                                <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 text-center">
                                    <p className="text-[9px] text-amber-600 font-semibold">건폐율 (법정)</p>
                                    <p className="text-lg font-bold text-amber-800">
                                        {ordinanceResult.max_building_coverage ? `${ordinanceResult.max_building_coverage}%` : '-'}
                                    </p>
                                </div>
                                <div className="bg-purple-50 rounded-xl p-3 border border-purple-200 text-center">
                                    <p className="text-[9px] text-purple-600 font-semibold">용적률 (법정)</p>
                                    <p className="text-lg font-bold text-purple-800">
                                        {ordinanceResult.max_floor_area_ratio ? `${ordinanceResult.max_floor_area_ratio}%` : '-'}
                                    </p>
                                </div>
                            </div>
                            {ordinanceResult.special_zones.length > 0 && (
                                <div className="bg-orange-50 rounded-xl p-3 border border-orange-200">
                                    <p className="text-[9px] font-semibold text-orange-700 mb-1.5">⚠️ 적용 특별 지구/구역</p>
                                    <div className="flex flex-wrap gap-1">
                                        {ordinanceResult.special_zones.map((zone, i) => (
                                            <span key={i} className="text-[9px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200 font-medium">{zone}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center justify-between">
                                    <p className="text-[10px] font-bold text-slate-700">📋 전체 규제 항목 ({ordinanceResult.regulations.length}건)</p>
                                    <span className="text-[9px] text-slate-400">항목 클릭 시 조례 상세 정보 확인</span>
                                </div>
                                <div className="max-h-[600px] overflow-y-auto custom-scrollbar bg-slate-50/30 pb-2">
                                    {['용도지역', '용도지구', '용도구역', '도시계획시설', '기타'].map((groupType) => {
                                        const groupRegs = groupedRegulations[groupType];
                                        if (!groupRegs || groupRegs.length === 0) return null;
                                        
                                        const badgeColor = 
                                            groupType === '용도지역' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                            groupType === '용도지구' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                            groupType === '용도구역' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                                            groupType === '도시계획시설' ? 'bg-teal-100 text-teal-700 border-teal-200' :
                                            'bg-slate-100 text-slate-700 border-slate-200';
                                            
                                        return (
                                            <div key={groupType} className="mb-3 last:mb-0">
                                                <div className="sticky top-0 bg-white/95 backdrop-blur-sm px-3 py-1.5 border-y border-slate-200 shadow-sm z-10 flex items-center gap-2">
                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${badgeColor}`}>
                                                        {groupType}
                                                    </span>
                                                    <span className="text-[10px] text-slate-500 font-medium">{groupRegs.length}건</span>
                                                </div>
                                                <div className="divide-y divide-slate-100 bg-white">
                                                    {groupRegs.map((reg, i) => (
                                                        <OrdinanceRegulationRow key={`${groupType}-${i}`} reg={reg} />
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* ─── 기존 정적 법규 테이블 (참고용) ─── */}
                {!analysisResult && !isAnalyzing && (
                    <>
                        <section>
                            <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">참</span>
                                용도지역별 건폐율 · 용적률 (참고 테이블)
                            </h4>
                            <div className="overflow-x-auto rounded-xl border border-slate-200">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold text-slate-600">용도지역</th>
                                            <th className="px-4 py-3 font-semibold text-slate-600 text-center">건폐율</th>
                                            <th className="px-4 py-3 font-semibold text-slate-600 text-center">용적률</th>
                                            <th className="px-4 py-3 font-semibold text-slate-600 text-center">높이</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {Object.values(ZONE_REGULATIONS).slice(0, 8).map(z => (
                                            <tr key={z.code} className={`transition-colors ${z.name === store.zoneType ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}>
                                                <td className="px-4 py-2.5 text-slate-700 font-medium">
                                                    {z.name === store.zoneType && <span className="text-blue-500 mr-2">▶</span>}
                                                    {z.name}
                                                </td>
                                                <td className="px-4 py-2.5 text-slate-600 text-center">{z.maxBuildingCoverage}%</td>
                                                <td className="px-4 py-2.5 text-slate-600 text-center">{z.maxFloorAreaRatio}%</td>
                                                <td className="px-4 py-2.5 text-slate-600 text-center">{z.maxHeight ? `${z.maxHeight}m` : '무제한'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </>
                )}
            </div>
        </div>
    );
}
