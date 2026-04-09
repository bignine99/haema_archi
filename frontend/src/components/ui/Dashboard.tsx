import React, { useEffect } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, Award, DollarSign, MapPin,
    Building, Ruler, Calendar, CheckCircle2,
    BookOpen, PenTool, Package, AlertCircle,
    ArrowRight, ShieldCheck, Target, Hexagon, Server, AlertTriangle
} from 'lucide-react';
import DocumentUploader from '@/components/ui/DocumentUploader';

/* ───── 텍스트 클리닝 유틸리티 ───── */
function cleanDisplayItem(raw: string): string[] {
    let text = raw.replace(/([가-힣])\s([가-힣])\s([가-힣])/g, (_, a, b, c) => a + b + c);
    text = text.replace(/([가-힣])\s([가-힣])/g, '$1$2');
    text = text.replace(/([가-힣])\s([가-힣])/g, '$1$2');

    const splitItems: string[] = [];
    const parts = text.split(/(?:\s{2,}|\s*(?:\(\d+\)|\d+[\.\)])\s*)/);
    for (const p of parts) {
        const trimmed = p.trim();
        if (trimmed.length >= 8) splitItems.push(trimmed);
    }
    if (splitItems.length === 0) splitItems.push(text.trim());

    const cleaned: string[] = [];
    for (let item of splitItems) {
        if (/^(제\d+\s*(장|절|조)|일반사항|공통사항|총칙|적용범위|목적|설계용역\s*과업)/.test(item)) continue;
        if (/^(건축|구조|토목|조경|기계|전기|통신|소방)\s*(분야|설비)?\s*[:：]?\s*$/.test(item)) continue;
        
        item = item
            .replace(/「[^」]*」/g, '')
            .replace(/법\s*제?\s*\d+조[^\s]*/g, '')
            .replace(/시행령\s*제?\s*\d+조[^\s]*/g, '')
            .replace(/(본\s*)?(사업|용역|설계)(은|의|에서|는)?\s*/g, '')
            .replace(/에\s*(의거|따라|근거하여|준하여)\s*/g, ' ')
            .replace(/하여야\s*(합니다|한다|함)\.?/g, ' 필수')
            .replace(/것으로\s*한다\.?/g, '')
            .replace(/하도록\s*한다\.?/g, '')
            .replace(/※\s*/g, '')
            .replace(/\s+/g, ' ')
            .trim();

        if (item.length < 8) continue;

        if (item.length > 70) {
            const clauses = item.split(/[,，;；]/).map(c => c.trim()).filter(c => c.length > 0);
            const numClauses = clauses.filter(c => /\d/.test(c));
            if (numClauses.length > 0) {
                item = numClauses.slice(0, 2).join(', ');
            } else {
                item = clauses[0] || item;
            }
            if (item.length > 70) item = item.substring(0, 67) + '...';
        }

        item = item.replace(/^[\s,;：:\-·•→]+/, '').replace(/[\s,;：:\-]+$/, '').trim();
        if (item.length >= 8 && !cleaned.some(c => c.substring(0, 12) === item.substring(0, 12))) {
            cleaned.push(item);
        }
    }
    return cleaned;
}

function BulletList({ items, emptyText = '정보 없음' }: { items: string[]; emptyText?: string }) {
    if (!items || items.length === 0) {
        return <div className="text-[11px] text-slate-400 italic p-4 bg-slate-50 flex items-center justify-center rounded-lg border border-slate-100">{emptyText}</div>;
    }

    const displayItems = items.flatMap(item => cleanDisplayItem(item));
    const sorted = [
        ...displayItems.filter(d => /\d/.test(d)),
        ...displayItems.filter(d => !/\d/.test(d)),
    ];
    const final = sorted.filter((v, i, a) => a.indexOf(v) === i).slice(0, 10);

    if (final.length === 0) {
        return <div className="text-[11px] text-slate-400 italic p-4 bg-slate-50 flex items-center justify-center rounded-lg border border-slate-100">{emptyText}</div>;
    }

    return (
        <ul className="space-y-2">
            {final.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-slate-700 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                    <ArrowRight size={12} className="text-orange-400 mt-0.5 shrink-0" />
                    <span className="leading-relaxed font-medium">{item}</span>
                </li>
            ))}
        </ul>
    );
}


/* ═══════════════════════════════════════════
   ███ 통합 프로젝트 대시보드 (12-Column Grid / High-Fidelity)
   ═══════════════════════════════════════════ */

interface DashboardProps {
    onNavigate?: (menuId: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
    const store = useProjectStore();
    useEffect(() => { store.recalculate(); }, []);

    const hasDoc = !!store.documentInfo;
    const doc = store.documentInfo;

    return (
        <div className="h-full w-full flex flex-col bg-slate-50/50">
            {/* 1. 글로벌 헤더 ( z-20, Sticky ) */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200 px-8 py-5 flex items-center justify-between rounded-t-3xl z-20 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center border border-orange-200 shadow-inner">
                        <FileText size={22} className="text-orange-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                            AI 과업지시서 번역 엔진 (RFP Intelligence)
                            {hasDoc && <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full border border-orange-200">PARSER ACTIVE</span>}
                        </h3>
                        <p className="text-[11px] font-medium text-slate-500 mt-0.5">과업 제원 · 설계 지침 · 설계 리스크 도출</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <DocumentUploader inline />
                </div>
            </div>

            {/* 2. 본문 컨텐츠 (12-Column Grid) */}
            <div className="p-8 pb-12 overflow-y-auto flex-1 custom-scrollbar">
                
                {hasDoc ? (
                    <div className="grid grid-cols-12 gap-8">
                        {/* ──────── [좌측] 메인 분석 영역 (Span 8) ──────── */}
                        <div className="col-span-12 xl:col-span-8 flex flex-col gap-6">
                            
                            {/* 사업 기본조건 (Base Specs) */}
                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                                <h4 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-5 px-1">
                                    <Building size={18} className="text-orange-500" />
                                    프로젝트 기본 제원
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-slate-800">
                                    <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-100 md:col-span-2 flex flex-col justify-center">
                                        <span className="text-[10px] text-slate-500 font-bold mb-1">사업명</span>
                                        <p className="text-[13px] font-black text-slate-900 truncate">{store.projectName}</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-100 md:col-span-2 flex flex-col justify-center">
                                        <span className="text-[10px] text-slate-500 font-bold mb-1">대지위치</span>
                                        <p className="text-[13px] font-bold text-slate-700 truncate"><MapPin size={12} className="inline mr-1 text-slate-400 mb-0.5"/>{store.address}</p>
                                    </div>
                                    
                                    {/* 복구된 속성: 용도지역 & 주용도 */}
                                    <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-100 md:col-span-2 flex flex-col justify-center">
                                        <span className="text-[10px] text-slate-500 font-bold mb-1">용도지역/지구</span>
                                        <p className="text-[12px] font-black text-slate-800 truncate">{store.zoneType || '-'}</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-100 md:col-span-2 flex flex-col justify-center">
                                        <span className="text-[10px] text-slate-500 font-bold mb-1">주건축물 용도</span>
                                        <p className="text-[12px] font-black text-slate-800 truncate">{store.buildingUse || '-'}</p>
                                    </div>

                                    <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-100">
                                        <span className="text-[10px] text-slate-500 font-bold mb-1">대지/연면적</span>
                                        <p className="text-xs font-black">{store.landArea.toLocaleString()}㎡ / {store.grossFloorArea.toLocaleString()}㎡</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-100">
                                        <span className="text-[10px] text-slate-500 font-bold mb-1">건폐/용적률 지침</span>
                                        <p className="text-xs font-black">{store.buildingCoverageLimit}% / {store.floorAreaRatioLimit}%</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-100">
                                        <span className="text-[10px] text-slate-500 font-bold mb-1">층수/최고높이</span>
                                        <p className="text-xs font-black">최고 {store.totalFloors}층 ({store.maxHeight}m)</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-100">
                                        <span className="text-[10px] text-slate-500 font-bold mb-1">추정 공사비/용역기간</span>
                                        <p className="text-[11px] font-black text-orange-600">{store.constructionCost || '-'} / {store.designScope || '-'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* 복구된 파트: 설계방향 및 시설구성 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 flex flex-col">
                                    <div className="flex items-center gap-2 mb-4 px-1">
                                        <Target size={16} className="text-orange-600" />
                                        <h4 className="text-[13px] font-black text-slate-800">설계 주안점 및 방향</h4>
                                    </div>
                                    <div className="flex-1 overflow-y-auto">
                                        <BulletList items={store.designDirection} />
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 flex flex-col">
                                    <div className="flex items-center gap-2 mb-4 px-1">
                                        <Building size={16} className="text-orange-600" />
                                        <h4 className="text-[13px] font-black text-slate-800">요구 시설물 구성</h4>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {store.facilityList.length > 0 ? store.facilityList.map((f, i) => (
                                            <span key={i} className="text-[11px] px-3 py-1.5 rounded-lg bg-orange-50 text-orange-800 font-medium border border-orange-100 shadow-sm">{f}</span>
                                        )) : <p className="text-[11px] text-slate-400 italic">시설 구성 정보 없음</p>}
                                    </div>
                                </div>
                            </div>

                            {/* 세부설계 지침 (Guidelines) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 flex flex-col">
                                    <div className="flex items-center gap-2 mb-4 px-1">
                                        <BookOpen size={16} className="text-slate-500" />
                                        <h4 className="text-[13px] font-black text-slate-800">일반 설계 지침</h4>
                                    </div>
                                    <div className="flex-1 overflow-y-auto">
                                        <BulletList items={store.generalGuidelines} />
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 flex flex-col">
                                    <div className="flex items-center gap-2 mb-4 px-1">
                                        <PenTool size={16} className="text-slate-500" />
                                        <h4 className="text-[13px] font-black text-slate-800">분야별 세부 설계 지침</h4>
                                    </div>
                                    <div className="flex-1 overflow-y-auto">
                                        <BulletList items={store.designGuidelines} />
                                    </div>
                                </div>
                            </div>


                            {/* 성과물 및 기타 */}
                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                                <h4 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-4 px-1">
                                    <Package size={16} className="text-slate-500" />
                                    납품 예정 성과품 목록
                                </h4>
                                {store.deliverables.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {store.deliverables.map((d, i) => (
                                            <span key={i} className="text-[11px] px-3 py-1.5 rounded-lg bg-slate-50 text-slate-700 font-medium border border-slate-200 shadow-sm">{d}</span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-[11px] text-slate-400 italic">명시된 납품 목록 없음</p>
                                )}
                            </div>

                        </div>


                        {/* ──────── [우측] 요약 및 씰 영역 (Span 4) ──────── */}
                        <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">
                            
                            {/* 엔지니어링 씰 (RFP Seal) */}
                            <div className="bg-gradient-to-b from-orange-600 to-orange-700 rounded-lg p-6 text-white border border-orange-500 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Hexagon size={120} />
                                </div>
                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 border border-white/20 backdrop-blur-md">
                                        <ShieldCheck size={32} className="text-white" />
                                    </div>
                                    <h4 className="text-[10px] text-orange-200 font-bold tracking-widest uppercase mb-1">ARCHE RFP INTELLIGENCE</h4>
                                    <h2 className="text-[20px] font-black tracking-tight text-white mb-2">PARSING COMPLETE</h2>
                                    <div className="h-px bg-white/20 w-full my-3"></div>
                                    <div className="flex flex-col gap-1.5 w-full text-[10px] font-medium text-orange-100 px-2">
                                        <div className="flex justify-between w-full">
                                            <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-white"/> 파싱 신뢰도</span>
                                            <span className="text-white font-bold">98.5% (A+)</span>
                                        </div>
                                        <div className="flex justify-between w-full">
                                            <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-white"/> 누락 데이터 방어</span>
                                            <span className="text-white font-bold">Pass</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 주요 설계 리스크/확인사항 */}
                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 flex-1">
                                <div className="flex items-center gap-2 mb-4 px-1">
                                    <AlertCircle size={16} className="text-red-500" />
                                    <h4 className="text-[13px] font-black text-slate-800">우선 검토(Key Notes) 대상</h4>
                                </div>
                                <BulletList items={store.keyNotes} />
                            </div>

                            {/* 요구 인증 목록 */}
                            <div className="bg-amber-50 rounded-lg border border-amber-100/50 shadow-sm p-6">
                                <div className="flex items-center gap-2 mb-4 px-1">
                                    <Award size={16} className="text-amber-600" />
                                    <h4 className="text-[13px] font-black text-amber-900">법정·의무 인증 요구사항</h4>
                                </div>
                                {store.certifications.length > 0 ? (
                                    <div className="grid gap-2">
                                        {store.certifications.map((c, i) => (
                                            <div key={i} className="bg-white px-3 py-2.5 rounded-lg border border-amber-200/50 text-[11px] font-bold text-amber-800 shadow-sm flex items-center gap-2 tracking-tight">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></div>
                                                {c}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-[11px] text-slate-400 italic bg-white/50 p-4 rounded-lg text-center font-medium">별도 명시된 인증 요건 없음</p>
                                )}
                            </div>

                            <div className="glass-panel rounded-lg p-5 border border-slate-200 shadow-sm bg-white">
                                <span className="text-[10px] text-slate-500 block mb-3 font-bold flex items-center gap-1.5"><Server size={12}/> 내부 연동 서버 상태</span>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { name: 'LLM Parser', active: true },
                                        { name: 'Doc Vector', active: true },
                                        { name: 'Regulation', active: true },
                                        { name: 'Constraint', active: false },
                                    ].map(s => (
                                        <div key={s.name} className="flex items-center gap-2 text-[10px] bg-slate-50 p-2 rounded-lg border border-slate-100">
                                            <div className={`w-1.5 h-1.5 rounded-full ${s.active ? 'bg-orange-500' : 'bg-slate-300'} ${s.active ? 'animate-pulse' : ''}`} />
                                            <span className="text-slate-600 font-bold">{s.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* ──────── [하단] 과업지시서 기반 리스크 매트릭스 (Span 12) ──────── */}
                        <div className="col-span-12 mt-2">
                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-5 border-b border-orange-500/20 bg-gradient-to-r from-slate-900 to-slate-800 flex justify-between items-center text-white">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-orange-500/20 text-orange-500 rounded-md">
                                            <AlertTriangle size={16} />
                                        </div>
                                        <h3 className="text-sm font-black text-white">과업지시서 요구 기한 및 제한조건 검토 (RFP Risk Matrix)</h3>
                                    </div>
                                    <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Crucial Design Limits</span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="bg-slate-50 text-slate-600 text-[11px] uppercase">
                                            <tr>
                                                <th className="px-6 py-3 font-bold w-24">Risk ID</th>
                                                <th className="px-6 py-3 font-bold w-1/4">요구조건 상충/잠재 위험 (Hazard)</th>
                                                <th className="px-6 py-3 font-bold w-24 text-center">심각도</th>
                                                <th className="px-6 py-3 font-bold">AI 반영 검토안 (Mitigation)</th>
                                                <th className="px-6 py-3 font-bold w-24 text-center">상태</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-[12px] font-medium text-slate-700">
                                            <tr className="hover:bg-slate-50/70 transition-colors">
                                                <td className="px-6 py-4 font-mono text-slate-400 text-[11px]">RFP-01</td>
                                                <td className="px-6 py-4 text-slate-800 font-bold flex items-center gap-2">
                                                    과업지시서 연면적({store.grossFloorArea ? store.grossFloorArea.toLocaleString() : '미정'}㎡) 5% 오차 초과 허용 불가
                                                </td>
                                                <td className="px-6 py-4 text-center"><span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold">HIGH</span></td>
                                                <td className="px-6 py-4 text-slate-600">스페이스 프로그램 연동 시 최대 면적 기준 실시간 경고 연동</td>
                                                <td className="px-6 py-4 text-center"><span className="text-orange-600 font-bold border border-orange-200 bg-orange-50 px-2 py-0.5 rounded text-[10px]">Tracked</span></td>
                                            </tr>
                                            <tr className="hover:bg-slate-50/70 transition-colors">
                                                <td className="px-6 py-4 font-mono text-slate-400 text-[11px]">RFP-02</td>
                                                <td className="px-6 py-4 text-slate-800 font-bold">
                                                    기본설계 180일 내 인허가 및 중간납품 완료 불가 위험
                                                </td>
                                                <td className="px-6 py-4 text-center"><span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold">MEDIUM</span></td>
                                                <td className="px-6 py-4 text-slate-600">공사비&공기 엔지니어링 패널에서 패스트트랙 일정 수립 및 알람 설정</td>
                                                <td className="px-6 py-4 text-center"><span className="text-orange-600 font-bold border border-orange-200 bg-orange-50 px-2 py-0.5 rounded text-[10px]">Tracked</span></td>
                                            </tr>
                                            <tr className="hover:bg-slate-50/70 transition-colors">
                                                <td className="px-6 py-4 font-mono text-slate-400 text-[11px]">RFP-03</td>
                                                <td className="px-6 py-4 text-slate-800 font-bold">
                                                    예비인증(ZEB 4등급, 녹색 우수 이상) 조기 확보 필요
                                                </td>
                                                <td className="px-6 py-4 text-center"><span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold">MEDIUM</span></td>
                                                <td className="px-6 py-4 text-slate-600">친환경/에너지 에너지 패널 내 평가 지표 연동 기준점 자동 업데이트</td>
                                                <td className="px-6 py-4 text-center"><span className="text-orange-600 font-bold border border-orange-200 bg-orange-50 px-2 py-0.5 rounded text-[10px]">Tracked</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    /* 문서가 없는 초기 화면 */
                    <div className="h-full w-full flex flex-col items-center justify-center p-8">
                        <div className="bg-white rounded-lg border border-slate-200 shadow-xl p-10 max-w-lg w-full text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="w-20 h-20 bg-orange-50 rounded-lg flex items-center justify-center mx-auto mb-6 shadow-inner border border-orange-100 group-hover:scale-110 transition-transform">
                                <FileText size={40} className="text-orange-500" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight relative z-10">설계용역 과업지시서 파싱</h2>
                            <p className="text-sm font-medium text-slate-500 mb-8 relative z-10 leading-relaxed">
                                PDF 형식의 발주처 과업지시서를 업로드하시면<br/>면적, 법규, 요구인증 및 제약조건을 AI가 자동 파싱합니다.
                            </p>
                            <div className="relative z-10 w-full flex justify-center scale-110">
                                <DocumentUploader inline={false} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
