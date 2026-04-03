import React, { useState } from 'react';
import { Target, Leaf, Map as MapIcon, Cpu, Users, Wind, ShieldCheck, Box, ChevronRight, CheckCircle2, Factory, ArrowUpSquare } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';

// MOCK DATA based on Sungjin School use-case
const LIFECYCLES = [
    { 
        id: 1, floor: '지상 1층', title: '지역사회 개방 및 웰컴 존', 
        desc: '보안관실과 인접한 주출입구 배치, 주민개방 시설(다목적실, 도서실)의 독립 동선 확보, 통학버스 캐노피(3.6m 이상) 하부 드롭오프 존 구성', 
    },
    { 
        id: 2, floor: '지상 2층', title: '유치원 및 초등 저자극 환경', 
        desc: '감각놀이와 신체 활동 중심의 유희실 연계, 저자극 환경 조성, 층별 발코니 피난 데크를 통한 안전성 강화', 
    },
    { 
        id: 3, floor: '지상 3층', title: '중학생 교과 이동 및 재활 집중', 
        desc: '과목에 따른 이동 수업을 고려한 동선 계획과 의료지원실, 재활운동실이 집약된 메디컬 존(Medical Zone) 배치', 
    },
    { 
        id: 4, floor: '지상 4층', title: '고등학생 자립 및 직업 교육', 
        desc: '실제 일터와 유사한 잡 스트리트(Job Street), 직업교육실, 전공과를 집약 배치하여 사회 자립 능력을 함양', 
    },
];

const ZONES = [
    { 
        id: 'care', title: 'Care Loop (케어 루프)', subtitle: '메디컬 전문화 4단계 (4-Step Rehab)', icon: <Wind size={24} />, 
        stages: [
            { step: '1단계: 재활운동', desc: '재활운동실+수중운동실(실온 32°C / 수온 32°C / 습도 55% 제어)' },
            { step: '2단계: 감각지각', desc: '감각운동지각 훈련실을 통해 인지 기능/운동 통합 발달' },
            { step: '3단계: 생활적응', desc: '가사교육실+일상생활 훈련실 실생활 환경 적응력 향상' },
            { step: '4단계: 정서케어', desc: '심리안정실(조도 0~500lx 디밍, 소음 35dB 이하 정밀 제어)' },
        ],
        factors: { height: '3.6m / 2.7m', lux: '300-500lx (디밍)', hvac: '항온항습 / 수처리 설비' },
        color: 'bg-teal-50 text-teal-600 border-teal-200' 
    },
    { 
        id: 'learning', title: 'Learning Loop', subtitle: '학년별/인솔거점 중심 유기적 연계', icon: <Users size={24} />, 
        rooms: ['일반교실 (66㎡ × 24실)', '특별교실 (90㎡ × 6실)', '생활교육실 (100㎡)', '세이프케어 라운지 거점'], 
        factors: { height: '3.0m', lux: '400lx (균제도 0.7)', hvac: '개별제어 / 자연환기' },
        color: 'bg-sky-50 text-sky-600 border-sky-200' 
    },
    { 
        id: 'edu', title: 'Edu Weaving', subtitle: '대공간 구조 최적화 특화', icon: <Box size={24} />, 
        rooms: ['장스팬 강당 (Post-Tension)', '에듀 큐브 (철골+PC 복합)', '작품 전시 코너', '메인 로비'], 
        factors: { height: '7.2m 이상', lux: '자연채광/눈부심 방지', hvac: '자연환기 연돌효과' },
        color: 'bg-indigo-50 text-indigo-600 border-indigo-200' 
    },
    { 
        id: 'safety', title: 'Safety 특화', subtitle: '지체장애 피난 동선 및 설비 지표', icon: <ShieldCheck size={24} />, 
        rooms: ['세이프케어 라운지 (각 층)', '하향식 피난구 및 승강식 피난기', '66인승(5,000kg) 대형 베드 EV 2대', '발코니 피난 데크'], 
        factors: { height: '3.3m (복도 폭)', lux: '시각경보기 연결', hvac: '통합 배연설비/기압차' },
        color: 'bg-rose-50 text-rose-600 border-rose-200' 
    },
    { 
        id: 'smart', title: '환경 & 에너지 (MEP)', subtitle: 'MEP & Environmental Verification', icon: <Cpu size={24} />, 
        rooms: ['헤파(HEPA) 외기처리기(OHU)', 'UVC 살균 개별 환기 유닛', '실시간 BEMS 에너지 제어', '지열 히트펌프 기계실'], 
        factors: { height: '흡음재(강당)', lux: '조명/차양 제어', hvac: '준공 전 베이크아웃' },
        color: 'bg-amber-50 text-amber-600 border-amber-200' 
    },
    { 
        id: 'bf', title: 'BF 최적화', subtitle: '무장애 치수/설계 지표 (Standards)', icon: <Leaf size={24} />, 
        rooms: ['복도 유효 너비 3.3m 이상', '1/18 이하 무장애 내부 램프', '1.4m x 1.4m 휠체어 회전 반경', '가구 R값 처리 & 휠체어 하단 인입'], 
        factors: { height: '-', lux: '눈부심 방지 설계', hvac: '복사난방 우선적용' },
        color: 'bg-emerald-50 text-emerald-600 border-emerald-200' 
    },
];

export const SpatialStrategyPanel = () => {
    const store = useProjectStore();
    const [activeZone, setActiveZone] = useState('care');

    // MOCK Validation Scores
    const gseedScore = 88.5; // 최우수 등급
    const zebScore = 24.2; // 5등급 (20~40%)
    
    return (
        <div className="w-full flex flex-col bg-[#F8FAFC] relative font-sans min-h-[750px] pb-8 overflow-y-auto overflow-x-hidden">
            {/* Top Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-white z-10 shadow-sm sticky top-0">
                <div className="flex items-center space-x-3">
                    <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                        <Target size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800 tracking-tight">
                            맞춤형 공간 특화 전략 (Space Specialization)
                        </h1>
                        <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-2xl line-clamp-1">
                            대지 조건과 과업지시서를 AI가 분석하여, 해당 프로젝트에 최적화된 공간 특화 전략(Double Loop, Zoning)을 제안합니다.
                        </p>
                    </div>
                </div>
                <div className="flex space-x-3 shrink-0">
                    <button className="flex items-center space-x-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-[13px] font-semibold text-white shadow-md transition-all whitespace-nowrap">
                        보고서 레이아웃 추출
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col px-4 md:px-6 py-6 gap-6 max-w-[1600px] mx-auto w-full">
                
                {/* 1. Lifecycle Vertical Strategy module */}
                <section>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
                            <ArrowUpSquare className="text-blue-500" size={18} />
                            1. 생애주기별 수직 특화 전략 (Vertical Lifecycle Support)
                        </h2>
                        <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full px-2">층별 사용자 특성 매칭</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                        {LIFECYCLES.map(lifecycle => (
                            <div key={lifecycle.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Target size={64} />
                                </div>
                                <div className="text-[11px] uppercase font-bold tracking-widest text-[#0066FF] mb-1 bg-blue-50 px-2 py-0.5 inline-block rounded">{lifecycle.floor}</div>
                                <h3 className="text-sm font-bold text-slate-800 mb-3">{lifecycle.title}</h3>
                                <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg flex items-start gap-2 h-[88px] overflow-y-auto">
                                    <div className="mt-0.5 text-emerald-500"><CheckCircle2 size={16} /></div>
                                    <p className="text-[12px] text-slate-600 font-medium leading-relaxed">
                                        {lifecycle.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* 2. 6 Core Zones Library */}
                    <section className="flex-[3] flex flex-col min-w-0">
                        <h2 className="text-[15px] font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <Box className="text-indigo-500" size={18} />
                            6대 핵심 특화 존 (Zone Library)
                        </h2>
                        
                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
                            <div className="grid grid-cols-2 md:grid-cols-3 border-b border-slate-100">
                                {ZONES.map(z => {
                                    const isActive = activeZone === z.id;
                                    return (
                                        <button
                                            key={z.id}
                                            onClick={() => setActiveZone(z.id)}
                                            className={`p-4 flex flex-col items-center justify-center text-center transition-all border-b-2 border-r border-slate-100 last:border-r-0 md:[&:nth-child(3n)]:border-r-0 ${
                                                isActive 
                                                ? 'bg-slate-50 border-b-slate-800' 
                                                : 'hover:bg-slate-50 bg-white border-b-transparent hover:border-b-slate-300'
                                            }`}
                                        >
                                            <div className={`mb-2 p-2.5 rounded-full ${isActive ? z.color : 'bg-slate-100 text-slate-400'}`}>
                                                {z.icon}
                                            </div>
                                            <div className={`text-[13px] font-bold ${isActive ? 'text-slate-800' : 'text-slate-500'}`}>{z.title}</div>
                                            <div className={`text-[10px] mt-0.5 font-medium px-2 ${isActive ? 'text-slate-500' : 'text-slate-400'}`}>{z.subtitle}</div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Active Zone Detail */}
                            <div className="p-6 flex-1 bg-slate-50/50">
                                {ZONES.map(z => {
                                    if (z.id !== activeZone) return null;
                                    return (
                                        <div key={z.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                            <div className="flex items-center justify-between mb-6">
                                                <div>
                                                    <h3 className="text-lg font-extrabold text-slate-800">{z.title} 상세 계획</h3>
                                                    <p className="text-sm text-slate-500 font-medium mt-1">{z.subtitle}</p>
                                                </div>
                                                <div className="flex -space-x-2">
                                                    {['A', 'B', 'C'].map((bldg) => (
                                                        <div key={bldg} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 shadow-sm">{bldg}동</div>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                                                    <h4 className="text-[11px] uppercase font-bold text-slate-400 mb-3 tracking-widest">{z.stages ? '치료·재활 4단계 전개' : '안전 및 기술 적용 지표'}</h4>
                                                    <ul className="space-y-3">
                                                        {z.stages ? z.stages.map((st, i) => (
                                                            <li key={i} className="flex flex-col text-sm text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-100">
                                                                <span className="font-extrabold text-[#0066FF] mb-1 text-[12px]">{st.step}</span>
                                                                <span className="font-medium text-[12px] leading-relaxed">{st.desc}</span>
                                                            </li>
                                                        )) : z.rooms.map((r, i) => (
                                                            <li key={i} className="flex items-center text-sm font-semibold text-slate-700 p-1">
                                                                <ChevronRight size={14} className="text-blue-500 mr-1 shrink-0" />
                                                                {r}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                
                                                <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 shadow-inner flex flex-col justify-between">
                                                    <div>
                                                        <h4 className="text-[11px] uppercase font-bold text-slate-400 mb-4 tracking-widest border-b border-slate-200 pb-2">공간 환경 지표 (Environmental Config)</h4>
                                                        
                                                        <div className="space-y-4">
                                                            <div className="flex justify-between items-center bg-white p-2.5 rounded shadow-sm border border-slate-100">
                                                                <span className="text-[12px] font-bold text-slate-500">요구 천장고 (CH)</span>
                                                                <span className="text-[13px] font-extrabold text-blue-600">{z.factors.height}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center bg-white p-2.5 rounded shadow-sm border border-slate-100">
                                                                <span className="text-[12px] font-bold text-slate-500">조도 및 조명제어</span>
                                                                <span className="text-[13px] font-extrabold text-slate-700">{z.factors.lux}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center bg-white p-2.5 rounded shadow-sm border border-slate-100">
                                                                <span className="text-[12px] font-bold text-slate-500">설비/공조/환기</span>
                                                                <span className="text-[13px] font-extrabold text-slate-700">{z.factors.hvac}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="mt-6 pt-4 border-t border-slate-200">
                                                        <button className="flex items-center justify-between w-full text-[12px] font-bold text-slate-600 hover:text-blue-600 transition-colors group">
                                                            <span className="flex items-center gap-1.5">
                                                                <Box size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors"/>
                                                                실세부면적표(Space Program) 프로파일 오버라이드
                                                            </span>
                                                            <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-500 transition-transform group-hover:translate-x-1" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </section>

                    {/* 3. Double Loop & Verifications */}
                    <section className="flex-[2] flex flex-col min-w-0">
                        <h2 className="text-[15px] font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <Target className="text-rose-500" size={18} />
                            설계 지표 및 정합성 검증
                        </h2>
                        
                        <div className="space-y-4 h-full flex flex-col">
                            {/* SVG Simulation Placeholder */}
                            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col items-center justify-center flex-1 relative overflow-hidden">
                                {/* AI Simulation Visibility / Adjacency Diagram */}
                                <svg width="100%" height="240" viewBox="0 0 400 240" className="w-full h-[240px]">
                                    <defs>
                                        <pattern id="archGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5"/>
                                        </pattern>
                                        <radialGradient id="sightlineGrad" cx="50%" cy="50%" r="50%">
                                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                                            <stop offset="70%" stopColor="#10b981" stopOpacity="0.1" />
                                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                                        </radialGradient>
                                        <style>
                                            {`
                                                @keyframes flowDash {
                                                    to { stroke-dashoffset: -20; }
                                                }
                                                .flow-path {
                                                    animation: flowDash 1.5s linear infinite;
                                                }
                                            `}
                                        </style>
                                    </defs>
                                    
                                    <rect width="400" height="240" fill="url(#archGrid)" rx="8" />

                                    {/* Central Corridor boundaries (walls) */}
                                    <path d="M 120 50 L 170 50 L 170 80 L 230 80 L 230 50 L 280 50" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3"/>
                                    <path d="M 120 190 L 170 190 L 170 160 L 230 160 L 230 190 L 280 190" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3"/>

                                    {/* Sightline Coverage Polygon */}
                                    <path d="M 200 120 L 100 50 L 100 190 Z" fill="url(#sightlineGrad)" />
                                    <path d="M 200 120 L 300 50 L 300 190 Z" fill="url(#sightlineGrad)" />

                                    {/* Raycast checking lines */}
                                    {[
                                        [120, 70], [120, 170], [280, 70], [280, 170]
                                    ].map((pt, i) => (
                                        <g key={i}>
                                            <circle cx={pt[0]} cy={pt[1]} r="3" fill="#f43f5e" />
                                            <path d={`M 200 120 L ${pt[0]} ${pt[1]}`} stroke="#10b981" strokeWidth="1.5" opacity="0.6"/>
                                        </g>
                                    ))}

                                    {/* Rooms/Blocks - Left side (Learning Zone) */}
                                    <g transform="translate(40, 50)">
                                        <rect x="0" y="0" width="80" height="60" rx="4" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1.5" />
                                        <text x="40" y="30" fontSize="11" fill="#3b82f6" textAnchor="middle" fontWeight="bold">학습 구역</text>
                                        <rect x="0" y="80" width="80" height="60" rx="4" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1.5" />
                                        <text x="40" y="110" fontSize="11" fill="#3b82f6" textAnchor="middle" fontWeight="bold">유희 커뮤니티</text>
                                    </g>

                                    {/* Rooms/Blocks - Right side (Care Zone) */}
                                    <g transform="translate(280, 50)">
                                        <rect x="0" y="0" width="80" height="60" rx="4" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1.5" />
                                        <text x="40" y="30" fontSize="11" fill="#16a34a" textAnchor="middle" fontWeight="bold">재활운동실</text>
                                        <rect x="0" y="80" width="80" height="60" rx="4" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1.5" />
                                        <text x="40" y="110" fontSize="11" fill="#16a34a" textAnchor="middle" fontWeight="bold">심리안정실</text>
                                    </g>

                                    {/* Flow line animation */}
                                    <path d="M 80 80 C 160 80, 160 160, 200 160 C 240 160, 240 80, 280 80" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="6 4" className="flow-path opacity-80" />
                                    <circle cx="80" cy="80" r="4" fill="#f59e0b" />
                                    <circle cx="280" cy="80" r="4" fill="#f59e0b" />

                                    {/* Central Hub */}
                                    <g transform="translate(200, 120)">
                                        <circle cx="0" cy="0" r="32" fill="#ffffff" stroke="#3b82f6" strokeWidth="2" className="shadow-lg" />
                                        <circle cx="0" cy="0" r="36" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 4" className="flow-path" />
                                        <circle cx="0" cy="0" r="24" fill="#dbeafe" />
                                        <text x="0" y="4" fontSize="12" fontWeight="bold" fill="#1d4ed8" textAnchor="middle">HUB</text>
                                        <text x="0" y="18" fontSize="8" fill="#475569" textAnchor="middle">감시거점</text>
                                    </g>

                                    {/* Informational Tags */}
                                    <g transform="translate(200, 20)">
                                        <rect x="-80" y="0" width="160" height="24" rx="12" fill="#1e293b" />
                                        <text x="0" y="16" fontSize="11" fill="#4ade80" fontWeight="bold" textAnchor="middle">👁️ 사각지대 Zero (가시성 100%)</text>
                                    </g>

                                    <g transform="translate(200, 210)">
                                        <rect x="-70" y="0" width="140" height="22" rx="4" fill="#fef3c7" />
                                        <text x="0" y="15" fontSize="11" fill="#d97706" fontWeight="bold" textAnchor="middle">학생/교사 동선 15% 단축</text>
                                    </g>
                                </svg>
                                
                                {/* Explicit Hub Logic Description */}
                                <div className="absolute bottom-4 left-0 right-0 px-5 relative z-10 w-full mb-[-10px] mt-4">
                                    <div className="bg-white text-slate-800 p-3 rounded-lg shadow-sm text-[12px] border border-slate-200 overflow-hidden relative">
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500 rounded-full blur-2xl opacity-10 transform translate-x-4 -translate-y-4"></div>
                                        <div className="font-bold text-blue-600 mb-1 flex items-center gap-1.5"><ShieldCheck size={14}/> AI 인솔 거점 운영 시뮬레이션</div>
                                        <p className="text-slate-600 font-medium leading-tight">
                                            전이 공간 내 <span className="text-slate-800 font-bold bg-slate-100 px-1 rounded mx-0.5">세이프케어 라운지</span> 배치 평가. 
                                            <br/><strong className="text-emerald-500">자연 감시(Natural Surveillance)</strong> 시야각 100% 확보로 시각적 <b>사각지대 제로(Zero)화</b> 검증 완료. 
                                            학생 이동 시간 및 교사 관리 부하 <span className="text-rose-600 font-bold bg-rose-50 px-1">15% 단축 예측</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Verification Scores & Economic Impact */}
                            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-slate-800 flex flex-col gap-5">
                                {/* Environmental Verification */}
                                <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-5">
                                    <div>
                                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex justify-between">
                                            <span>G-SEED (녹색건축)</span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-extrabold text-emerald-500">{gseedScore}</span>
                                            <span className="text-xs text-slate-500 font-medium">점 (최우수/1등급)</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                                            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${(gseedScore/100)*100}%` }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex justify-between">
                                            <span>ZEB (제로에너지)</span>
                                            <span className="text-amber-600 text-[10px] bg-amber-50 px-1 rounded">4등급</span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-extrabold text-amber-500">41.2</span>
                                            <span className="text-xs text-slate-500 font-medium">% (자립률 타겟)</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                                            <div className="bg-amber-400 h-full rounded-full" style={{ width: `${41.2}%` }}></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Economic & Policy Impact */}
                                <div>
                                    <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">LCC 및 조달청 공사비 심의 연계 데이터</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                            <div className="text-[10px] text-slate-500 mb-1">신재생(지열/루버형 BIPV) LCC</div>
                                            <div className="text-sm font-bold text-slate-800 flex items-center">
                                                <span className="text-rose-500 mr-1">▼</span> 28.5% <span className="ml-2 text-[10px] text-slate-400 font-normal">생애 30년 기준 절감</span>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                            <div className="text-[10px] text-slate-500 mb-1">장스팬 구조(PT) 공사비</div>
                                            <div className="text-sm font-bold text-slate-800 flex items-center">
                                                <span className="text-emerald-500 mr-1">▲</span> 1.2% <span className="ml-2 text-[10px] text-slate-400 font-normal">대공간 확보 상쇄율</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
