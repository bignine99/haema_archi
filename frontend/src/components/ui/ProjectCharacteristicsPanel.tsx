import React from 'react';
import { 
    MapPin, Users, Building, Activity, 
    ArrowRight, Heart, ShieldCheck, Accessibility,
    TrendingUp, Map, ShieldAlert, BadgeCheck
} from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';

export default function ProjectCharacteristicsPanel() {
    const store = useProjectStore();
    
    // 동적 데이터 매핑 (폴백 포함)
    const projectName = store.projectName || "김해제2특수학교";
    const address = store.address || "경상남도 김해시 삼계동";
    const projectType = projectName.includes("특수학교") ? "특수학교" : "해당 시설";

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] overflow-y-auto">
            {/* Header */}
            <div className="shrink-0 border-b border-slate-200 bg-white px-8 py-6 sticky top-0 z-20 shadow-sm">
                <div className="flex items-end justify-between">
                    <div>
                        <div className="text-blue-600 font-extrabold tracking-wider text-xs mb-1.5 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                            PHASE A : TASK ANALYSIS
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">프로젝트 특성 분석</h2>
                        <p className="text-sm text-slate-500 mt-2">
                            과업지시서, 대지 현황, 법규 검토를 종합한 <strong className="text-slate-700">{projectName}</strong> 건립의 정량적/정성적 타당성 분석
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
                            <ShieldCheck size={14} className="text-blue-500" />
                            NINETYNINE TECH CERTIFIED
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-8 space-y-6 flex-1">

                {/* ZONE 1: Context & Needs */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Left: Need & Awareness */}
                    <div className="col-span-12 xl:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                        <div className="mb-4">
                            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                <Users size={18} className="text-blue-600" />
                                {projectType} 인식 및 설립의 필요성
                            </h3>
                            <p className="text-[11px] text-slate-500 mt-1">지역사회 수용성 및 핵심 타겟층 수요 추이 분석</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 flex-1">
                            {/* Stats */}
                            <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 opacity-5"><TrendingUp size={60}/></div>
                                <div className="text-[10px] font-bold text-slate-500 mb-2">핵심 수요 대상자 추이</div>
                                <div className="flex items-end gap-1 mb-1">
                                    <span className="text-3xl font-black text-slate-800">1,398</span>
                                    <span className="text-xs text-slate-500 mb-1">명/년</span>
                                </div>
                                <div className="text-[8px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
                                    <TrendingUp size={10} /> 해당 권역 내 수요 지속 증가 예측
                                </div>
                            </div>
                            
                            {/* NIMBY overcoming */}
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex flex-col items-center justify-center text-center relative">
                                <div className="text-[10px] font-bold text-blue-700 mb-2">지역사회/주민 건립 동의율</div>
                                <div className="flex w-full items-center justify-center gap-2 mb-1">
                                    <div className="relative w-16 h-16 flex items-center justify-center">
                                        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#dbeafe" strokeWidth="4" />
                                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#2563eb" strokeWidth="4" strokeDasharray="98, 100" />
                                        </svg>
                                        <div className="absolute text-sm font-black text-blue-700">98%</div>
                                    </div>
                                </div>
                                <p className="text-[9px] text-blue-600 mt-2 leading-tight">
                                    부정적 인식을 극복하는 지역 커뮤니티 거점 역할
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Regional Map Analysis */}
                    <div className="col-span-12 xl:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex relative overflow-hidden">
                        <div className="w-1/2 pr-6 border-r border-slate-100 z-10">
                            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-1">
                                <Map size={18} className="text-emerald-600" />
                                대상지 광역분석
                            </h3>
                            <p className="text-[11px] text-slate-500 mb-4">{address} 인프라 연계성 시뮬레이션</p>

                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100">
                                        <BadgeCheck size={14} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-800">이용 접근성 및 대중교통 연계</h4>
                                        <p className="text-[10px] text-slate-500">대상지와 공공보행로 및 도로망 간의 물리적 장벽(단차 등) 완화를 통한 안전한 유입 동선 확보</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center shrink-0 mt-0.5 border border-blue-100">
                                        <Building size={14} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-800">주거/공공 인프라 중심부 입지</h4>
                                        <p className="text-[10px] text-slate-500">외곽(기피시설 입지)이 아닌 공동주택 및 공공지원시설 등 주변 인프라와 공생 가능한 융합적 환경</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-5 p-3 bg-slate-50 rounded border border-slate-100 text-[10px] text-slate-600 font-medium leading-relaxed">
                                "단절되고 요새화된 특수시설이 아닌, 지역사회와 물리적/시각적으로 공생 가능한 열린 외부공간 연계 계획이 필수적입니다."
                            </div>
                        </div>

                        {/* Schematic Map SVG */}
                        <div className="w-1/2 relative flex items-center justify-center pl-6">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.02)_0%,transparent_70%)]"></div>
                            <svg viewBox="0 0 200 160" className="w-full h-full max-h-[200px] drop-shadow-sm">
                                {/* Base Blocks */}
                                <path d="M 20 40 L 80 10 L 180 30 L 190 120 L 120 150 L 10 130 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" strokeLinejoin="round" />
                                {/* Roads */}
                                <path d="M 80 10 L 90 150" fill="none" stroke="#cbd5e1" strokeWidth="4" />
                                <path d="M 10 70 L 190 80" fill="none" stroke="#cbd5e1" strokeWidth="4" />
                                
                                {/* Residential/Public Zones */}
                                <rect x="30" y="20" width="40" height="30" rx="2" fill="#e2e8f0" opacity="0.6" />
                                <rect x="110" y="40" width="50" height="30" rx="2" fill="#e2e8f0" opacity="0.6" />
                                <rect x="110" y="90" width="60" height="40" rx="2" fill="#e2e8f0" opacity="0.6" />
                                
                                {/* Target Site */}
                                <circle cx="85" cy="75" r="24" fill="rgba(34, 197, 94, 0.1)" stroke="#22c55e" strokeWidth="2" strokeDasharray="4 4" />
                                <rect x="75" y="65" width="20" height="20" rx="4" fill="#10b981" />
                                <text x="85" y="78" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">SITE</text>
                                
                                {/* Arrows (Connectivity) */}
                                <path d="M 50 35 Q 70 50 75 60" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="2 2" markerEnd="url(#arrow)" />
                                <path d="M 130 55 Q 110 60 95 65" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="2 2" markerEnd="url(#arrow)" />
                                <path d="M 130 110 Q 110 90 95 85" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="2 2" markerEnd="url(#arrow)" />
                                
                                <defs>
                                    <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                                        <polygon points="0 0, 6 3, 0 6" fill="#3b82f6" />
                                    </marker>
                                </defs>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* ZONE 2 & 3 */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Zone 2: Lifecycle Spaces */}
                    <div className="col-span-12 lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="mb-6">
                            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                <Heart size={18} className="text-rose-500" />
                                생애주기/기능별 특화 조닝 체계
                            </h3>
                            <p className="text-[11px] text-slate-500 mt-1">사용자 특성 및 주요 행태에 따른 수직적 기능 최적화</p>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                            <div className="flex items-stretch gap-3">
                                <div className="w-12 bg-slate-100 text-slate-500 font-black flex items-center justify-center rounded-l-lg border-y border-l border-slate-200">4F</div>
                                <div className="flex-1 flex gap-2">
                                    <div className="flex-1 bg-rose-50 border border-rose-100 p-2 rounded-r-lg flex flex-col justify-center">
                                        <p className="text-xs font-bold text-rose-800">생활 자립 및 심화 역량 강화</p>
                                        <p className="text-[9px] text-rose-600 mt-0.5">고등부·전공과 및 사회진출 전환형 직업 실습 공간</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-stretch gap-3">
                                <div className="w-12 bg-slate-100 text-slate-500 font-black flex items-center justify-center rounded-l-lg border-y border-l border-slate-200">3F</div>
                                <div className="flex-1 flex gap-2">
                                    <div className="flex-1 bg-amber-50 border border-amber-100 p-2 rounded-r-lg flex flex-col justify-center">
                                        <p className="text-xs font-bold text-amber-800">융합 학습 및 커뮤니티 활동</p>
                                        <p className="text-[9px] text-amber-600 mt-0.5">중등부 및 그룹 활동을 지원하는 다목적 공용 존</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-stretch gap-3">
                                <div className="w-12 bg-slate-100 text-slate-500 font-black flex items-center justify-center rounded-l-lg border-y border-l border-slate-200">2F</div>
                                <div className="flex-1 flex gap-2">
                                    <div className="flex-1 bg-emerald-50 border border-emerald-100 p-2 rounded-r-lg flex flex-col justify-center">
                                        <p className="text-xs font-bold text-emerald-800">기초 발달 및 체육 활동</p>
                                        <p className="text-[9px] text-emerald-600 mt-0.5">초등부 및 신체 안정성을 확보한 활동형 특별실</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-stretch gap-3">
                                <div className="w-12 bg-slate-100 text-slate-500 font-black flex items-center justify-center rounded-l-lg border-y border-l border-slate-200">1F</div>
                                <div className="flex-1 flex gap-2">
                                    <div className="w-1/2 bg-blue-50 border border-blue-100 p-2 flex flex-col justify-center">
                                        <p className="text-xs font-bold text-blue-800">접근 편의 집중/안전 보호</p>
                                        <p className="text-[9px] text-blue-600 mt-0.5">유치부 및 치료실 (저층부 최단거리 동선 우선 배정)</p>
                                    </div>
                                    <div className="w-1/2 bg-slate-50 border border-slate-200 p-2 rounded-r-lg flex flex-col justify-center">
                                        <p className="text-xs font-bold text-slate-700">핵심 관리 및 지원 인프라</p>
                                        <p className="text-[9px] text-slate-500 mt-0.5">행정/관리 컨트롤 타워</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Zone 3: Hub & Care Spaces */}
                    <div className="col-span-12 lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col">
                        <div className="mb-4">
                            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                <Accessibility size={18} className="text-indigo-600" />
                                {projectType} 통제 거점 및 사용자 배려 시스템
                            </h3>
                            <p className="text-[11px] text-slate-500 mt-1">대규모 단체 이동의 안전성을 보장하고 집중 돌봄을 지원하는 무장애(Barrier-Free) 특성 반영</p>
                        </div>
                        
                        <div className="flex gap-6 h-full">
                            {/* Hub Comparison */}
                            <div className="w-1/2 flex flex-col gap-3">
                                <div className="flex-1 border border-slate-200 rounded-lg bg-slate-50 flex flex-col p-3 relative overflow-hidden">
                                    <div className="absolute top-2 right-2 bg-slate-200 text-slate-500 px-1.5 py-0.5 text-[8px] font-bold rounded">기존 방식(OLD)</div>
                                    <h4 className="text-[10px] font-bold text-slate-700 mb-2">분산된 실 배치 (단독 행동 및 통제 사각지대 발생)</h4>
                                    <div className="flex-1 flex items-center justify-center">
                                        <svg viewBox="0 0 100 40" className="w-full">
                                            <rect x="0" y="20" width="100" height="20" fill="#e2e8f0" />
                                            <circle cx="20" cy="15" r="3" fill="#94a3b8" />
                                            <circle cx="50" cy="15" r="3" fill="#f43f5e" /> {/* Alert */}
                                            <circle cx="80" cy="15" r="3" fill="#94a3b8" />
                                            <path d="M 45 5 L 55 5 L 50 15 Z" fill="#f43f5e" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex-1 border-2 border-indigo-100 rounded-lg bg-indigo-50/50 flex flex-col p-3 relative overflow-hidden">
                                    <div className="absolute top-2 right-2 bg-indigo-500 text-white px-1.5 py-0.5 text-[8px] font-bold rounded">특화 제안(NEW)</div>
                                    <h4 className="text-[10px] font-bold text-indigo-700 mb-2">구심점 기반 거점 광장형 (인지 용이/안전 통제망)</h4>
                                    <div className="flex-1 flex items-center justify-center">
                                        <svg viewBox="0 0 100 40" className="w-full">
                                            <rect x="0" y="20" width="100" height="20" fill="#c7d2fe" />
                                            {/* Teacher/Staff */}
                                            <circle cx="50" cy="15" r="4" fill="#4f46e5" />
                                            <path d="M 50 15 Q 30 5 10 15" fill="none" stroke="#4f46e5" strokeWidth="1" strokeDasharray="2 2" />
                                            <path d="M 50 15 Q 70 5 90 15" fill="none" stroke="#4f46e5" strokeWidth="1" strokeDasharray="2 2" />
                                            {/* Users */}
                                            <circle cx="35" cy="17" r="3" fill="#6366f1" />
                                            <circle cx="65" cy="17" r="3" fill="#6366f1" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Considerations List */}
                            <div className="w-1/2 flex flex-col gap-3 justify-center">
                                <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm flex items-start gap-3">
                                    <div className="p-2 bg-rose-50 rounded text-rose-500 shrink-0"><ShieldAlert size={16} /></div>
                                    <div>
                                        <h5 className="text-[11px] font-bold text-slate-800">심리 안정 및 다목적 휴게 공간 확보</h5>
                                        <p className="text-[9px] text-slate-500 mt-0.5 leading-tight">동선 교차로에 돌발적 밀집/부딪힘 사고를 예방하는 여유 공간(알코브 코너 등)을 조성하여 심리적 안정 부여.</p>
                                    </div>
                                </div>
                                <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm flex items-start gap-3">
                                    <div className="p-2 bg-emerald-50 rounded text-emerald-500 shrink-0"><Accessibility size={16} /></div>
                                    <div>
                                        <h5 className="text-[11px] font-bold text-slate-800">유니버설 디자인 및 수직 동선(BF) 품질 상향</h5>
                                        <p className="text-[9px] text-slate-500 mt-0.5 leading-tight">단차 극복을 위한 완만한 경사로(광폭 램프) 연결망 및 휠체어 전용 코어를 충분히 확보하여 이동 자율성 보장.</p>
                                    </div>
                                </div>
                                <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm flex items-start gap-3">
                                    <div className="p-2 bg-blue-50 rounded text-blue-500 shrink-0"><Activity size={16} /></div>
                                    <div>
                                        <h5 className="text-[11px] font-bold text-slate-800">지원/위생 시설군 생활 밀착형 배치</h5>
                                        <p className="text-[9px] text-slate-500 mt-0.5 leading-tight">신변 처리가 즉각적으로 필요한 특성을 고려해, 주 활동 공간 가까운 최단거리에 특수 맞춤형 화장실 배치.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
