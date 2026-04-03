/**
 * 제원 분석 패널 (SpecsAnalysisPanel) v2
 * ──────────────────────────────────────
 * 과업지시서 PDF에서 추출된 데이터를 한눈에 확인 가능한
 * 단일-스크롤 대시보드 형태로 표시
 */

import { useProjectStore } from '@/store/projectStore';
import {
    Building, MapPin, Ruler, Layers, ShieldCheck, Award, DollarSign,
    Calendar, CheckCircle, AlertTriangle,
    Target, Compass, Zap, Leaf, BookOpen, PenTool,
    Package, AlertCircle, Info, ClipboardList, ChevronRight,
    TrendingUp, Users, BarChart3
} from 'lucide-react';

/* ───── 상태 뱃지 ───── */
function StatusBadge({ status }: { status: 'ok' | 'warn' | 'none' }) {
    if (status === 'ok') return (
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold flex items-center gap-0.5 shrink-0">
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
        <div className={`rounded-lg px-3 py-3 text-center ${accent ? 'bg-blue-50' : 'bg-slate-50'}`}>
            <div className={`text-[9px] mb-1 ${accent ? 'text-blue-500' : 'text-slate-500'}`}>{label}</div>
            <div className={`font-bold text-base ${accent ? 'text-blue-800' : 'text-slate-800'}`}>
                {typeof value === 'number' ? value.toLocaleString() : value}
                {unit && <span className="text-[9px] text-slate-400 ml-0.5 font-normal">{unit}</span>}
            </div>
        </div>
    );
}

/* ───── 항목 리스트 (체크리스트 스타일) ───── */
function BulletItems({ items, max = 8, color = '#3b82f6' }: { items: string[]; max?: number; color?: string }) {
    if (!items || items.length === 0) return <p className="text-[11px] text-slate-400 italic py-1">데이터 없음</p>;
    return (
        <div className="space-y-1">
            {items.slice(0, max).map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-slate-700 leading-relaxed">
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
   ███  제원 분석 패널 메인
   ═══════════════════════════════════════════════════ */

export default function SpecsAnalysisPanel() {
    const store = useProjectStore();
    const hasDoc = !!store.documentInfo;
    const doc = store.documentInfo;

    const st = (has: boolean, partial = false): 'ok' | 'warn' | 'none' => has ? 'ok' : partial ? 'warn' : 'none';

    /* ── 미업로드 상태 ── */
    if (!hasDoc) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center h-full gap-4 p-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                    <ClipboardList size={36} className="text-amber-500" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">제원 분석</h2>
                <p className="text-slate-500 text-sm text-center max-w-sm leading-relaxed">
                    과업지시서를 <strong>❶ 과업지시서</strong> 메뉴에서 업로드하면,<br />
                    AI가 프로젝트 제원을 자동 추출하여<br />
                    이 페이지에 구조화된 분석을 표시합니다.
                </p>
                <span className="text-[10px] px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200 font-medium">
                    ❶ 과업지시서 메뉴에서 PDF 업로드 필요
                </span>
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

    return (
        <div className="w-full h-full overflow-y-auto overflow-x-hidden p-6 pb-10 flex flex-col gap-5 custom-scrollbar">

            {/* ═══════ 헤더 ═══════ */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg">
                        <ClipboardList size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">제원 분석</h2>
                        <p className="text-[11px] text-slate-500">
                            {doc?.fileName || '과업지시서'} 기반 · {extracted}/{total}개 항목 추출
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-24 h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-1000 ${rate >= 80 ? 'bg-emerald-500' : rate >= 50 ? 'bg-amber-500' : 'bg-red-400'}`}
                            style={{ width: `${rate}%` }} />
                    </div>
                    <span className={`text-[11px] font-bold ${rate >= 80 ? 'text-emerald-600' : rate >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                        {rate}%
                    </span>
                </div>
            </div>


            {/* ═══════ 1. 프로젝트 개요 ═══════ */}
            <div className="glass-panel p-5">
                <SectionHeader num={1} icon={Building} color="#3b82f6" title="프로젝트 개요" status={st(store.projectName !== '미정 프로젝트')} />

                {/* 사업명 */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg px-4 py-3 mb-3">
                    <div className="text-blue-500 text-[9px] font-medium mb-0.5">사업명</div>
                    <div className="text-blue-900 font-bold text-[15px]">{store.projectName}</div>
                </div>

                {/* 위치, 용도지역, 주용도 */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 rounded-lg px-3 py-2.5 col-span-1">
                        <div className="flex items-center gap-1 mb-1">
                            <MapPin size={10} className="text-slate-400" />
                            <span className="text-slate-500 text-[9px]">대지 위치</span>
                        </div>
                        <div className="text-slate-800 font-semibold text-[12px]">{store.address || '-'}</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg px-3 py-2.5">
                        <div className="text-blue-500 text-[9px] mb-1">용도지역</div>
                        <div className="text-blue-800 font-bold text-[12px]">{store.zoneType || '-'}</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg px-3 py-2.5">
                        <div className="text-slate-500 text-[9px] mb-1">주용도</div>
                        <div className="text-slate-800 font-bold text-[12px]">{store.buildingUse || '-'}</div>
                    </div>
                </div>
            </div>


            {/* ═══════ 2. 면적 및 규모 ═══════ */}
            <div className="glass-panel p-5">
                <SectionHeader num={2} icon={Ruler} color="#0891b2" title="면적 및 규모" status={st(store.landArea > 0 && store.grossFloorArea > 0, store.landArea > 0)} />

                <div className="grid grid-cols-4 gap-2 mb-3">
                    <Stat label="대지면적" value={store.landArea} unit="㎡" />
                    <Stat label="연면적" value={store.grossFloorArea} unit="㎡" accent />
                    <Stat label="규모" value={`${doc?.rawData.undergroundFloors ? `B${doc.rawData.undergroundFloors}/` : ''}${store.totalFloors}`} unit="층" />
                    <Stat label="높이제한" value={store.maxHeight || '-'} unit="m" />
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-emerald-50 rounded-lg px-3 py-3 text-center">
                        <div className="text-emerald-500 text-[9px] mb-1">건폐율</div>
                        <div className="text-emerald-800 font-bold text-base">{store.buildingCoverageLimit}<span className="text-[9px] text-emerald-400 ml-0.5 font-normal">%</span></div>
                    </div>
                    <div className="bg-cyan-50 rounded-lg px-3 py-3 text-center">
                        <div className="text-cyan-500 text-[9px] mb-1">용적률</div>
                        <div className="text-cyan-800 font-bold text-base">{store.floorAreaRatioLimit}<span className="text-[9px] text-cyan-400 ml-0.5 font-normal">%</span></div>
                    </div>
                    <div className="bg-amber-50 rounded-lg px-3 py-3 text-center">
                        <div className="text-amber-500 text-[9px] mb-1">달성 용적률</div>
                        <div className="text-amber-800 font-bold text-base">{Math.round(store.achievedFAR)}<span className="text-[9px] text-amber-400 ml-0.5 font-normal">%</span></div>
                    </div>
                </div>

                {/* 용적률 달성 바 */}
                {store.landArea > 0 && store.grossFloorArea > 0 && (
                    <div className="bg-slate-50 rounded-lg px-3 py-2.5">
                        <div className="flex justify-between mb-1">
                            <span className="text-[9px] text-slate-500">대지 대비 연면적 비율</span>
                            <span className="text-[10px] text-slate-700 font-bold">{(store.grossFloorArea / store.landArea).toFixed(1)}배</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                                <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-1000"
                                    style={{ width: `${Math.min(100, (store.grossFloorArea / (store.landArea * (store.floorAreaRatioLimit / 100 || 2.5))) * 100)}%` }} />
                            </div>
                            <span className="text-[9px] text-slate-400 shrink-0">{store.floorAreaRatioLimit}% 한도</span>
                        </div>
                    </div>
                )}
            </div>


            {/* ═══════ 3+4 ROW: 법규·인증 | 사업비·일정 ═══════ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* 3. 법규 및 인증 */}
                <div className="glass-panel p-5">
                    <SectionHeader num={3} icon={ShieldCheck} color="#7c3aed" title="법규 및 인증 요구사항" status={st(store.certifications.length > 0, !!store.zoneType)} />

                    {store.certifications.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {store.certifications.map((c, i) => <CertChip key={i} cert={c} />)}
                        </div>
                    ) : (
                        <p className="text-[11px] text-slate-400 italic mb-3">인증 요구사항 없음</p>
                    )}

                    {store.keyNotes.length > 0 && (
                        <div className="bg-rose-50 rounded-lg px-3 py-2.5 border border-rose-100">
                            <div className="flex items-center gap-1 mb-2">
                                <AlertCircle size={11} className="text-rose-500" />
                                <span className="text-rose-600 text-[9px] font-bold">주요 확인사항</span>
                            </div>
                            <BulletItems items={store.keyNotes} color="#f43f5e" />
                        </div>
                    )}
                </div>

                {/* 4. 사업비 및 일정 */}
                <div className="glass-panel p-5">
                    <SectionHeader num={4} icon={DollarSign} color="#059669" title="사업비 및 일정" status={st(!!store.constructionCost, !!store.designScope)} />

                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg px-4 py-3 mb-3">
                        <div className="flex items-center gap-1 mb-1">
                            <DollarSign size={11} className="text-emerald-600" />
                            <span className="text-emerald-600 text-[9px] font-semibold">총사업비</span>
                        </div>
                        <div className="text-emerald-900 font-bold text-xl">{store.constructionCost || '-'}</div>
                    </div>

                    <div className="bg-slate-50 rounded-lg px-4 py-3 mb-3">
                        <div className="flex items-center gap-1 mb-1">
                            <Calendar size={11} className="text-slate-500" />
                            <span className="text-slate-500 text-[9px] font-semibold">설계기간</span>
                        </div>
                        <div className="text-slate-800 font-bold text-[13px]">{store.designScope || '-'}</div>
                    </div>

                    {/* 설계 방향 (5번 내용을 여기에 통합) */}
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


            {/* ═══════ 5+6 ROW: 일반지침 | 설계지침 ═══════ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="glass-panel p-5">
                    <SectionHeader num={5} icon={BookOpen} color="#2563eb" title="일반지침" status={st(store.generalGuidelines.length > 0)} />
                    <BulletItems items={store.generalGuidelines} color="#3b82f6" />
                </div>

                <div className="glass-panel p-5">
                    <SectionHeader num={6} icon={PenTool} color="#16a34a" title="설계지침" status={st(store.designGuidelines.length > 0)} />
                    <BulletItems items={store.designGuidelines} color="#16a34a" />
                </div>
            </div>


            {/* ═══════ 7 ROW: 성과품 | 시설 구성 ═══════ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="glass-panel p-5">
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

                <div className="glass-panel p-5">
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


            {/* ═══════ 추출 요약 ═══════ */}
            <div className="glass-panel p-5">
                <div className="flex items-center gap-2 mb-3">
                    <BarChart3 size={15} className="text-indigo-600" />
                    <h3 className="text-[13px] font-bold text-slate-800">추출 요약</h3>
                </div>
                <div className="grid grid-cols-5 gap-3">
                    <div className="text-center py-3 bg-emerald-50 rounded-lg">
                        <div className="text-emerald-700 font-bold text-xl">{extracted}</div>
                        <div className="text-emerald-500 text-[9px] mt-0.5">추출 항목</div>
                    </div>
                    <div className="text-center py-3 bg-red-50 rounded-lg">
                        <div className="text-red-700 font-bold text-xl">{total - extracted}</div>
                        <div className="text-red-500 text-[9px] mt-0.5">미추출 항목</div>
                    </div>
                    <div className="text-center py-3 bg-amber-50 rounded-lg">
                        <div className="text-amber-700 font-bold text-xl">{store.certifications.length}</div>
                        <div className="text-amber-500 text-[9px] mt-0.5">인증 요구</div>
                    </div>
                    <div className="text-center py-3 bg-blue-50 rounded-lg">
                        <div className="text-blue-700 font-bold text-xl">{store.generalGuidelines.length + store.designGuidelines.length}</div>
                        <div className="text-blue-500 text-[9px] mt-0.5">지침 항목</div>
                    </div>
                    <div className="text-center py-3 bg-violet-50 rounded-lg">
                        <div className="text-violet-700 font-bold text-xl">{store.keyNotes.length}</div>
                        <div className="text-violet-500 text-[9px] mt-0.5">확인사항</div>
                    </div>
                </div>
            </div>

            {/* ═══════ 출처 ═══════ */}
            <div className="flex items-center justify-between px-1 text-[9px] text-slate-400">
                <span>출처: {doc?.fileName} · 업로드: {doc?.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString('ko-KR') : '-'}</span>
                <span>AI 추출 엔진 v1.0 · 추출률 {rate}%</span>
            </div>
        </div>
    );
}
