/**
 * 제원 분석 패널 (SpecsAnalysisPanel) v3
 * ══════════════════════════════════════════
 * 12-Column Cyber-Dashboard Grid 표준 준수
 * 과업지시서에서 AI 추출된 프로젝트 제원을 고품질 대시보드로 표시
 */

import { useProjectStore } from '@/store/projectStore';
import {
    Building, MapPin, Ruler, Layers, ShieldCheck, Award, DollarSign,
    Calendar, CheckCircle, AlertTriangle,
    Target, Compass, Zap, Leaf, BookOpen, PenTool,
    Package, AlertCircle, Info, ClipboardList, ChevronRight,
    TrendingUp, Users, BarChart3, Cpu, FileText, Activity
} from 'lucide-react';

/* ───── 상태 뱃지 ───── */
function StatusBadge({ status }: { status: 'ok' | 'warn' | 'none' }) {
    if (status === 'ok') return (
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-semibold flex items-center gap-0.5 shrink-0">
            <CheckCircle size={9} /> 추출완료
        </span>
    );
    if (status === 'warn') return (
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold flex items-center gap-0.5 shrink-0">
            <AlertTriangle size={9} /> 일부
        </span>
    );
    return (
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 font-semibold flex items-center gap-0.5 shrink-0">
            <Info size={9} /> 없음
        </span>
    );
}

/* ───── 섹션 헤더 ───── */
function SectionHeader({ num, icon: Icon, color, title, status }: {
    num: number; icon: React.ElementType; color: string; title: string; status: 'ok' | 'warn' | 'none';
}) {
    return (
        <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ background: color }}>
                {num}
            </div>
            <Icon size={15} style={{ color }} className="shrink-0" />
            <h3 className="text-[13px] font-bold text-slate-800 flex-1">{title}</h3>
            <StatusBadge status={status} />
        </div>
    );
}

/* ───── 수치 칸 ───── */
function Stat({ label, value, unit, accent = false }: {
    label: string; value: string | number; unit?: string; accent?: boolean;
}) {
    return (
        <div className={`rounded-lg px-3 py-3 text-center ${accent ? 'bg-orange-50 border border-orange-100' : 'bg-white border border-slate-200'}`}>
            <div className={`text-[9px] mb-1 ${accent ? 'text-orange-600' : 'text-slate-500'}`}>{label}</div>
            <div className={`font-black text-base ${accent ? 'text-black' : 'text-slate-900'}`}>
                {typeof value === 'number' ? value.toLocaleString() : value}
                {unit && <span className="text-[9px] text-slate-400 ml-0.5 font-normal">{unit}</span>}
            </div>
        </div>
    );
}

/* ───── 항목 리스트 ───── */
function BulletItems({ items, max = 8, color = '#f97316' }: { items: string[]; max?: number; color?: string }) {
    if (!items || items.length === 0) return <p className="text-[11px] text-slate-400 italic py-1">데이터 없음</p>;
    return (
        <div className="space-y-1">
            {items.slice(0, max).map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-slate-900 font-medium leading-relaxed">
                    <ChevronRight size={10} style={{ color }} className="mt-0.5 shrink-0" />
                    <span>{item}</span>
                </div>
            ))}
        </div>
    );
}

/* ───── 인증 뱃지 ───── */
function CertChip({ cert }: { cert: string }) {
    const cfg = /ZEB|제로/i.test(cert) ? { icon: Zap, c: '#059669', bg: '#d1fae5' }
        : /BF|배리어|Barrier/i.test(cert) ? { icon: Users, c: '#2563eb', bg: '#dbeafe' }
        : /녹색/i.test(cert) ? { icon: Leaf, c: '#16a34a', bg: '#dcfce7' }
        : /내진/i.test(cert) ? { icon: ShieldCheck, c: '#dc2626', bg: '#fee2e2' }
        : /CPTED|범죄/i.test(cert) ? { icon: Target, c: '#7c3aed', bg: '#ede9fe' }
        : /에너지/i.test(cert) ? { icon: TrendingUp, c: '#ea580c', bg: '#ffedd5' }
        : { icon: Award, c: '#64748b', bg: '#f1f5f9' };

    const CIcon = cfg.icon;
    return (
        <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 border text-[10px] font-medium"
            style={{ background: cfg.bg + '80', borderColor: cfg.bg, color: cfg.c }}>
            <CIcon size={12} /> {cert}
        </div>
    );
}


/* ═══════════════════════════════════════════════════
   ███  제원 분석 패널 메인 (12-Column Cyber-Dashboard)
   ═══════════════════════════════════════════════════ */

export default function SpecsAnalysisPanel() {
    const store = useProjectStore();
    const hasDoc = !!store.documentInfo;
    const doc = store.documentInfo;

    const st = (has: boolean, partial = false): 'ok' | 'warn' | 'none' => has ? 'ok' : partial ? 'warn' : 'none';

    /* ── 미업로드 상태 ── */
    if (!hasDoc) {
        return (
            <div className="h-full w-full flex flex-col bg-slate-50/50">
                {/* 글로벌 헤더 */}
                <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200 px-8 py-5 flex items-center justify-between rounded-t-3xl z-20 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center border border-orange-200 shadow-inner">
                            <ClipboardList size={22} className="text-orange-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-black tracking-tight">AI 프로젝트 제원 분석</h3>
                            <p className="text-[11px] font-medium text-slate-500 mt-0.5">과업지시서 자동 추출 · 인증 · 지침 통합 대시보드</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                        <span className="text-xs font-black text-slate-400 tracking-widest">PARSER IDLE</span>
                    </div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8">
                    <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center border border-orange-200">
                        <ClipboardList size={36} className="text-orange-500" />
                    </div>
                    <h2 className="text-lg font-black text-black">과업지시서 업로드 대기 중</h2>
                    <p className="text-slate-600 text-sm font-medium text-center max-w-sm leading-relaxed">
                        과업지시서를 <strong>❶ 과업지시서</strong> 메뉴에서 업로드하면,<br />
                        AI가 프로젝트 제원을 자동 추출하여<br />
                        이 페이지에 구조화된 분석을 표시합니다.
                    </p>
                    <span className="text-[10px] px-3 py-1.5 rounded-full bg-black text-white font-bold tracking-wide">
                        ❶ 과업지시서 메뉴에서 PDF 업로드 필요
                    </span>
                </div>
            </div>
        );
    }

    /* ── 추출률 계산 ── */
    const checks = [
        store.projectName !== '미정 프로젝트', !!store.address, store.landArea > 0,
        store.grossFloorArea > 0, store.totalFloors > 0, !!store.zoneType,
        store.buildingCoverageLimit > 0, store.floorAreaRatioLimit > 0,
        !!store.constructionCost, store.certifications.length > 0,
        store.generalGuidelines.length > 0, store.designGuidelines.length > 0,
        store.designDirection.length > 0, store.keyNotes.length > 0,
        store.deliverables.length > 0,
    ];
    const extracted = checks.filter(Boolean).length;
    const total = checks.length;
    const rate = Math.round((extracted / total) * 100);
    const rateColor = rate >= 80 ? 'text-orange-600' : rate >= 50 ? 'text-orange-400' : 'text-red-500';
    const barColor = rate >= 80 ? 'bg-orange-500' : rate >= 50 ? 'bg-orange-400' : 'bg-red-400';

    return (
        <div className="h-full w-full flex flex-col bg-slate-50/50">

            {/* ══ 글로벌 헤더 ══ */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200 px-8 py-5 flex items-center justify-between rounded-t-3xl z-20 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center border border-orange-200 shadow-inner">
                        <ClipboardList size={22} className="text-orange-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-black tracking-tight">AI 프로젝트 제원 분석</h3>
                        <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                            {doc?.fileName || '과업지시서'} 기반 · {extracted}/{total}개 항목 추출
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-28 h-2 rounded-full bg-slate-200 overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
                                style={{ width: `${rate}%` }} />
                        </div>
                        <span className={`text-sm font-black ${rateColor}`}>{rate}%</span>
                    </div>
                    <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.6)]"></span>
                        <span className="text-xs font-black text-orange-600 tracking-widest">PARSER ACTIVE</span>
                    </div>
                </div>
            </div>

            {/* ══ 12-Column Grid Content ══ */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                <div className="grid grid-cols-12 gap-6">

                    {/* ──────── [좌측 메인] Col 1-8 ──────── */}
                    <div className="col-span-12 xl:col-span-8 flex flex-col gap-5">

                        {/* 1. 프로젝트 개요 */}
                        <div className="bg-white rounded-lg border-2 border-slate-900 shadow-[4px_4px_0px_#f97316] p-5 relative">
                            {/* 오른쪽 하단 포인트 마커 */}
                            <div className="absolute right-0 bottom-0 w-8 h-8 flex">
                                <div className="w-full h-full bg-orange-500 rounded-tl-xl rounded-br-[14px]"></div>
                            </div>
                            <SectionHeader num={1} icon={Building} color="#f97316" title="프로젝트 개요" status={st(store.projectName !== '미정 프로젝트')} />
                            <div className="bg-slate-50 rounded-lg px-4 py-3 mb-3 border border-slate-200">
                                <div className="text-slate-500 text-[9px] font-bold mb-0.5 uppercase tracking-wider">Project Name</div>
                                <div className="text-black font-black text-[15px]">{store.projectName}</div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 relative z-10">
                                <div className="bg-white border border-slate-200 rounded-lg px-3 py-2.5 col-span-1">
                                    <div className="flex items-center gap-1 mb-1">
                                        <MapPin size={10} className="text-orange-500" />
                                        <span className="text-slate-500 font-bold text-[9px]">대지 위치</span>
                                    </div>
                                    <div className="text-black font-black text-[12px]">{store.address || '-'}</div>
                                </div>
                                <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2.5">
                                    <div className="text-orange-600 text-[9px] font-bold mb-1">용도지역</div>
                                    <div className="text-orange-800 font-black text-[12px]">{store.zoneType || '-'}</div>
                                </div>
                                <div className="bg-white border border-slate-200 rounded-lg px-3 py-2.5">
                                    <div className="text-slate-500 text-[9px] font-bold mb-1">주용도</div>
                                    <div className="text-black font-black text-[12px]">{store.buildingUse || '-'}</div>
                                </div>
                            </div>
                        </div>

                        {/* 2. 면적 및 규모 */}
                        <div className="bg-white rounded-lg border border-dotted border-slate-300 p-5">
                            <SectionHeader num={2} icon={Ruler} color="#f97316" title="면적 및 규모" status={st(store.landArea > 0 && store.grossFloorArea > 0, store.landArea > 0)} />
                            <div className="grid grid-cols-4 gap-2 mb-3">
                                <Stat label="대지면적" value={store.landArea} unit="㎡" />
                                <Stat label="연면적" value={store.grossFloorArea} unit="㎡" accent />
                                <Stat label="규모" value={`${(doc?.rawData as any)?.undergroundFloors ? `B${(doc?.rawData as any).undergroundFloors}/` : ''}${store.totalFloors}`} unit="층" />
                                <Stat label="높이제한" value={store.maxHeight || '-'} unit="m" />
                            </div>
                            <div className="grid grid-cols-3 gap-2 mb-3">
                                <div className="bg-white border border-slate-200 rounded-lg px-3 py-3 text-center">
                                    <div className="text-slate-500 font-bold text-[9px] mb-1">건폐율</div>
                                    <div className="text-black font-black text-base">{store.buildingCoverageLimit}<span className="text-[9px] text-slate-400 ml-0.5 font-normal">%</span></div>
                                </div>
                                <div className="bg-white border border-slate-200 rounded-lg px-3 py-3 text-center">
                                    <div className="text-slate-500 font-bold text-[9px] mb-1">법정 용적률</div>
                                    <div className="text-black font-black text-base">{store.floorAreaRatioLimit}<span className="text-[9px] text-slate-400 ml-0.5 font-normal">%</span></div>
                                </div>
                                <div className="bg-slate-900 rounded-lg px-3 py-3 text-center shadow-inner">
                                    <div className="text-orange-400 font-bold text-[9px] mb-1">달성 용적률</div>
                                    <div className="text-white font-black text-base">{Math.round(store.achievedFAR)}<span className="text-[9px] text-orange-200 ml-0.5 font-normal">%</span></div>
                                </div>
                            </div>
                            {store.landArea > 0 && store.grossFloorArea > 0 && (
                                <div className="bg-slate-50 rounded-lg px-3 py-2.5">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-[9px] text-slate-500">대지 대비 연면적 비율</span>
                                        <span className="text-[10px] text-slate-700 font-bold">{(store.grossFloorArea / store.landArea).toFixed(1)}배</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                                            <div className="h-full rounded-full bg-orange-500 transition-all duration-1000"
                                                style={{ width: `${Math.min(100, (store.grossFloorArea / (store.landArea * (store.floorAreaRatioLimit / 100 || 2.5))) * 100)}%` }} />
                                        </div>
                                        <span className="text-[9px] text-slate-400 shrink-0">{store.floorAreaRatioLimit}% 한도</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 3+4 ROW: 법규·인증 | 사업비·일정 */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <div className="bg-white rounded-lg border-l-4 border-slate-900 border-y border-r border-y-slate-200 border-r-slate-200 p-5 shadow-sm">
                                <SectionHeader num={3} icon={ShieldCheck} color="#0f172a" title="법규 및 인증 요구사항" status={st(store.certifications.length > 0, !!store.zoneType)} />
                                {store.certifications.length > 0 ? (
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {store.certifications.map((c, i) => <CertChip key={i} cert={c} />)}
                                    </div>
                                ) : (
                                    <p className="text-[11px] text-slate-400 italic mb-3">인증 요구사항 없음</p>
                                )}
                                {store.keyNotes.length > 0 && (
                                    <div className="bg-orange-50 rounded-lg px-3 py-2.5 border border-orange-100">
                                        <div className="flex items-center gap-1 mb-2">
                                            <AlertCircle size={11} className="text-orange-500" />
                                            <span className="text-orange-600 text-[9px] font-black uppercase">주요 확인사항</span>
                                        </div>
                                        <BulletItems items={store.keyNotes} color="#ea580c" />
                                    </div>
                                )}
                            </div>

                            <div className="bg-white rounded-lg border-l-4 border-slate-900 border-y border-r border-y-slate-200 border-r-slate-200 p-5 shadow-sm">
                                <SectionHeader num={4} icon={DollarSign} color="#0f172a" title="사업비 및 일정" status={st(!!store.constructionCost, !!store.designScope)} />
                                <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 mb-3">
                                    <div className="flex items-center gap-1 mb-1">
                                        <DollarSign size={11} className="text-orange-600" />
                                        <span className="text-orange-600 text-[9px] font-black">총사업비</span>
                                    </div>
                                    <div className="text-black font-black text-xl">{store.constructionCost || '-'}</div>
                                </div>
                                <div className="bg-slate-50 rounded-lg px-4 py-3 mb-3">
                                    <div className="flex items-center gap-1 mb-1">
                                        <Calendar size={11} className="text-slate-500" />
                                        <span className="text-slate-500 text-[9px] font-semibold">설계기간</span>
                                    </div>
                                    <div className="text-slate-800 font-bold text-[13px]">{store.designScope || '-'}</div>
                                </div>
                                {store.designDirection.length > 0 && (
                                    <div className="bg-orange-50 rounded-lg px-3 py-2.5 border border-orange-100">
                                        <div className="flex items-center gap-1 mb-2">
                                            <Compass size={11} className="text-orange-500" />
                                            <span className="text-orange-600 text-[9px] font-bold">설계 방향 / 추진 배경</span>
                                        </div>
                                        <BulletItems items={store.designDirection} color="#ea580c" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 5+6 ROW: 일반지침 | 설계지침 */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
                                <SectionHeader num={5} icon={BookOpen} color="#f97316" title="일반지침" status={st(store.generalGuidelines.length > 0)} />
                                <BulletItems items={store.generalGuidelines} color="#f97316" />
                            </div>
                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
                                <SectionHeader num={6} icon={PenTool} color="#f97316" title="설계지침" status={st(store.designGuidelines.length > 0)} />
                                <BulletItems items={store.designGuidelines} color="#f97316" />
                            </div>
                        </div>

                        {/* 7 ROW: 성과품 | 시설 구성 */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <Package size={15} className="text-sky-600" />
                                    <h3 className="text-[13px] font-bold text-slate-800 flex-1">성과품 목록</h3>
                                    <StatusBadge status={st(store.deliverables.length > 0)} />
                                </div>
                                {store.deliverables.length > 0 ? (
                                    <div className="flex flex-wrap gap-1.5">
                                        {store.deliverables.map((d, i) => (
                                            <span key={i} className="text-[10px] px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 font-medium border border-sky-100">{d}</span>
                                        ))}
                                    </div>
                                ) : <p className="text-[11px] text-slate-400 italic">성과품 목록 없음</p>}
                            </div>
                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <Layers size={15} className="text-slate-600" />
                                    <h3 className="text-[13px] font-bold text-slate-800 flex-1">시설 구성</h3>
                                    <StatusBadge status={st(store.facilityList.length > 0)} />
                                </div>
                                {store.facilityList.length > 0 ? (
                                    <div className="flex flex-wrap gap-1.5">
                                        {store.facilityList.map((f, i) => (
                                            <span key={i} className="text-[10px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">{f}</span>
                                        ))}
                                    </div>
                                ) : <p className="text-[11px] text-slate-400 italic">시설 구성 데이터 없음</p>}
                            </div>
                        </div>
                    </div>

                    {/* ──────── [우측 사이드바] Col 9-12 ──────── */}
                    <div className="col-span-12 xl:col-span-4 flex flex-col gap-5">

                        {/* PARSER ENGINE 대시보드 */}
                        <div className="bg-slate-900 rounded-lg p-5 text-white shadow-xl relative overflow-hidden border border-slate-800">
                            <div className="absolute -right-4 -top-4 opacity-[0.03] text-white"><FileText size={160} /></div>
                            <div className="flex items-center gap-2 mb-1 relative z-10">
                                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span>
                                <span className="text-xs font-black text-orange-400 tracking-widest">DOCUMENT PARSER</span>
                            </div>
                            <h3 className="text-xl font-bold mb-4 relative z-10">제원 추출 엔진</h3>

                            <div className="flex-1 space-y-3 relative z-10">
                                {[
                                    { label: 'Project Overview', desc: '사업명, 위치, 용도 자동 추출', active: store.projectName !== '미정 프로젝트', color: 'orange' },
                                    { label: 'Area & Scale', desc: '면적·층고·건폐율·용적률 파싱', active: store.landArea > 0, color: 'orange' },
                                    { label: 'Cert. Analyzer', desc: '인증 요구사항 및 법규 항목 분석', active: store.certifications.length > 0, color: 'orange' },
                                    { label: 'Budget Parser', desc: '사업비 및 일정 데이터 추출', active: !!store.constructionCost, color: 'orange' },
                                ].map((item, i) => (
                                    <div key={i} className={`rounded-lg border p-3 transition-colors ${item.active
                                        ? `border-${item.color}-500/30 bg-slate-800/80 hover:bg-slate-800`
                                        : 'border-slate-700 bg-slate-800/50 opacity-50'
                                    }`}>
                                        <div className="flex justify-between items-start mb-1.5">
                                            <div className="flex items-center gap-1.5">
                                                <Activity size={12} className={item.active ? `text-${item.color}-400` : 'text-slate-500'} />
                                                <span className="text-xs font-bold text-slate-200">{item.label}</span>
                                            </div>
                                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${item.active
                                                ? `bg-${item.color}-500/20 text-${item.color}-400 border-${item.color}-500/20`
                                                : 'bg-slate-700 text-slate-400 border-transparent'
                                            }`}>
                                                {item.active ? 'Complete' : 'Pending'}
                                            </span>
                                        </div>
                                        <div className="text-[10px] text-slate-400">{item.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 추출률 요약 카드 */}
                        <div className="bg-white rounded-lg border-4 border-slate-900 shadow-sm p-5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-1 bg-orange-500"></div>
                            <div className="flex items-center gap-2 mb-4">
                                <BarChart3 size={16} className="text-black" />
                                <h3 className="text-[14px] font-black text-black tracking-tight">추출 요약</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                <div className="text-center py-3 border border-slate-200 bg-slate-50 rounded-lg">
                                    <div className="text-black font-black text-xl">{extracted}</div>
                                    <div className="text-slate-500 font-bold text-[9px] mt-0.5">추출 항목</div>
                                </div>
                                <div className="text-center py-3 border border-orange-200 bg-orange-50 rounded-lg">
                                    <div className="text-orange-600 font-black text-xl">{total - extracted}</div>
                                    <div className="text-orange-500 font-bold text-[9px] mt-0.5">미추출 항목</div>
                                </div>
                                <div className="text-center py-3 border border-slate-200 bg-white rounded-lg">
                                    <div className="text-black font-black text-xl">{store.certifications.length}</div>
                                    <div className="text-slate-500 font-bold text-[9px] mt-0.5">인증 요구</div>
                                </div>
                                <div className="text-center py-3 border border-slate-200 bg-white rounded-lg">
                                    <div className="text-black font-black text-xl">{store.generalGuidelines.length + store.designGuidelines.length}</div>
                                    <div className="text-slate-500 font-bold text-[9px] mt-0.5">지침 항목</div>
                                </div>
                            </div>
                            {/* 전체 달성률 게이지 */}
                            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                                <div className="flex justify-between mb-2">
                                    <span className="text-[10px] font-bold text-slate-600">AI 추출 완성도</span>
                                    <span className={`text-[11px] font-black ${rateColor}`}>{rate}%</span>
                                </div>
                                <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full transition-all duration-1000 ${barColor}`} style={{ width: `${rate}%` }} />
                                </div>
                                <p className="text-[9px] text-slate-400 mt-2 text-center">
                                    {rate >= 80 ? '✅ 분석 준비 완료' : rate >= 50 ? '⚠️ 일부 항목 미확인' : '❌ 데이터 보완 필요'}
                                </p>
                            </div>
                        </div>

                        {/* 확인사항 위젯 */}
                        {store.keyNotes.length > 0 && (
                            <div className="bg-white rounded-lg border border-orange-200 shadow-sm p-5 border-t-4 border-t-orange-500">
                                <div className="flex items-center gap-2 mb-3">
                                    <AlertCircle size={15} className="text-orange-500" />
                                    <h3 className="text-[13px] font-black text-black flex-1">핵심 확인사항</h3>
                                    <span className="text-[9px] px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full font-bold">{store.keyNotes.length}건</span>
                                </div>
                                <div className="space-y-2">
                                    {store.keyNotes.slice(0, 4).map((note, i) => (
                                        <div key={i} className="flex items-start gap-2 bg-slate-50 rounded-lg p-2 border border-slate-100">
                                            <span className="text-orange-500 font-black text-[10px] mt-0.5 shrink-0">{String(i + 1).padStart(2, '0')}.</span>
                                            <p className="text-[11px] text-slate-900 font-bold leading-snug">{note}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 출처 위젯 */}
                        <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <Cpu size={13} className="text-slate-400" />
                                <span className="text-[10px] font-bold text-slate-600">AI 추출 엔진 v1.0</span>
                            </div>
                            <p className="text-[9px] text-slate-400">출처: {doc?.fileName}</p>
                            <p className="text-[9px] text-slate-400">업로드: {doc?.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString('ko-KR') : '-'}</p>
                            <p className="text-[9px] text-slate-400">추출률: {rate}% ({extracted}/{total} 항목)</p>
                        </div>
                    </div>

                </div>
            </div>

            {/* ══ 엔지니어링 씰 (Engineering Seal) ══ */}
            <div className="shrink-0 border-t border-slate-200 bg-white px-6 py-3 flex items-center justify-between z-10">
                <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
                    <div className="bg-slate-900 text-orange-500 p-1.5 rounded-lg shadow-sm">
                        <ClipboardList size={16} />
                    </div>
                    <div>
                        <div className="text-[11px] font-black text-black leading-none mb-1">SPECS ANALYSIS</div>
                        <div className="text-[8px] text-orange-500 uppercase font-black tracking-widest">ARCHE Document Intelligence</div>
                    </div>
                </div>
                <div className="flex-1 flex justify-evenly text-[10px] font-medium px-2 text-center">
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-500 font-bold">사업명</span><span className="text-black text-[10px] font-black truncate max-w-[80px]">{store.projectName}</span></div>
                    <div className="w-[1px] h-6 bg-slate-200"></div>
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-500 font-bold">대지면적</span><span className="text-black font-black text-[10px]">{store.landArea ? store.landArea.toLocaleString() + ' ㎡' : '-'}</span></div>
                    <div className="w-[1px] h-6 bg-slate-200"></div>
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-500 font-bold">연면적</span><span className="text-black font-black text-[10px]">{store.grossFloorArea ? store.grossFloorArea.toLocaleString() + ' ㎡' : '-'}</span></div>
                    <div className="w-[1px] h-6 bg-slate-200"></div>
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">추출률</span><span className={`text-[9px] font-black ${rateColor}`}>{rate}% COMPLETE</span></div>
                </div>
            </div>
        </div>
    );
}
