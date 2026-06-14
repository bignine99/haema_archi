import React, { useState, useCallback } from 'react';
import { 
    MapPin, Users, Building, Activity, 
    ArrowRight, Heart, ShieldCheck, Accessibility,
    TrendingUp, Map, ShieldAlert, BadgeCheck,
    Cpu, ActivitySquare, LayoutDashboard, Component, Globe, CheckCircle2, AlertCircle,
    Search, RotateCcw, Loader2
} from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { analyzeProjectCharacteristics, type ProjectCharacteristicsInput } from '@/services/projectCharacteristicsService';

export default function ProjectCharacteristicsPanel() {
    const store = useProjectStore();
    const result = store.characteristicsAnalysisResult;
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = useCallback(async () => {
        setIsAnalyzing(true);
        setError(null);
        try {
            const input: ProjectCharacteristicsInput = {
                projectName: store.projectName,
                address: store.address,
                buildingUse: store.buildingUse,
                rawText: (store as any).documentInfo?.rawData?.rawText || undefined,
            };
            const res = await analyzeProjectCharacteristics(input);
            if (res) {
                store.setCharacteristicsAnalysisResult(res);
            } else {
                setError('특성 분석에 실패했습니다.');
            }
        } catch (err) {
            setError('분석 중 오류가 발생했습니다.');
        } finally {
            setIsAnalyzing(false);
        }
    }, [store]);
    
    // 동적 데이터 매핑 (폴백 포함)
    const projectName = store.projectName || "기본 프로젝트 (미정)";
    const address = store.address || "대지위치 미설정";
    const projectType = projectName.includes("학교") ? "학교/교육시설" : "해당 시설";

    const demandCount = result?.demandStats?.trendCount || 1398;
    const demandTrend = result?.demandStats?.trendText || "권역 내 지속 증가 예측";
    const nimbyRate = result?.demandStats?.agreementRate || 98;
    const nimbyText = result?.demandStats?.agreementText || "부정적 인식을 극복, 커뮤니티 거점화";

    const regionalPoints = result?.regionalAnalysis?.points || [
        { title: "이용 접근성 최적화", desc: "물리적 장벽 완화, 안전한 유입 동선 확보" },
        { title: "주거/공공 인프라 융합", desc: "외곽이 아닌 중심부 입지로 주변 환경과 공생" }
    ];
    const regionalQuote = result?.regionalAnalysis?.quote || "선형 공원 및 열린 외부공간 연계 계획 필수";

    const defaultLifecycleZones = [
        { floorIndex: "4F", floorTitle: "생활 자립 / 역량 강화", floorDesc: "고등부·전공과 직업 실습" },
        { floorIndex: "3F", floorTitle: "융합 학습 / 커뮤니티", floorDesc: "중등부 다목적 공용 존" },
        { floorIndex: "2F", floorTitle: "기초 발달 / 신체 기반", floorDesc: "초등부 활동형 특별실" },
        { floorIndex: "1F", floorTitle: "최단 동선 / 보호 관리", floorDesc: "유치부 및 행정지원 타워" },
    ];
    const lifecycleZones = result?.lifecycleZoning && result.lifecycleZoning.length > 0 ? result.lifecycleZoning : defaultLifecycleZones;

    const communityScore = result?.communityLink?.score || 92;
    const communityGrade = result?.communityLink?.grade || "우수";
    const communityCategories = result?.communityLink?.categories || [
        { title: "외부공간 개방성", desc: "공개공지 확보 비율 및 도로면 경계부 투명성 평가", scoreOutof25: 22.5 },
        { title: "보행 동선 연계", desc: "공공보행로 물리적 접점 연결 수 및 주/부출입구 분산", scoreOutof25: 25.0 },
        { title: "공용 프로그램", desc: "운동장, 다목적실 등 지역 주민 개방 공유 공간 면적 비율", scoreOutof25: 20.5 },
        { title: "시각적 공생성", desc: "주거지 인접 1층 전면부 투명도 및 무장애 녹지축의 연속성", scoreOutof25: 24.0 },
    ];

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] overflow-y-auto relative">
            {error && (
                <div className="absolute top-24 right-8 z-50 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg shadow-lg animate-fade-in flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span className="text-sm font-bold">{error}</span>
                </div>
            )}
            {/* Header */}
            <div className="shrink-0 border-b border-slate-200 bg-white px-8 py-6 sticky top-0 z-20 shadow-sm">
                <div className="flex items-end justify-between">
                    <div>
                        <div className="text-orange-600 font-extrabold tracking-wider text-xs mb-1.5 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-orange-600"></span>
                            PHASE A : TASK ANALYSIS
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">프로젝트 특성 분석</h2>
                        <p className="text-sm text-slate-500 mt-2">
                            과업지시서, 대지 현황, 법규 검토를 종합한 <strong className="text-slate-700">{projectName}</strong> 건립의 정량적/정성적 타당성 분석
                        </p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                        <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full mb-1">
                            <ShieldCheck size={14} className="text-orange-500" />
                            ARCHE TECH CERTIFIED
                        </div>
                        <div className="flex items-center gap-2 mt-auto">
                            {result && (
                                <button
                                    onClick={() => store.setCharacteristicsAnalysisResult(null)}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-orange-50 text-orange-700 border border-orange-200 font-bold text-xs shadow-sm transition-all whitespace-nowrap active:scale-95"
                                >
                                    <RotateCcw size={14} />
                                    초기화
                                </button>
                            )}
                            <button
                                onClick={handleAnalyze}
                                disabled={isAnalyzing}
                                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white font-bold text-[13px] shadow-sm transition-all whitespace-nowrap border-2 ${
                                    isAnalyzing 
                                        ? 'bg-slate-400 border-slate-400 cursor-not-allowed' 
                                        : 'bg-orange-600 border-orange-600 hover:bg-orange-700 active:scale-95'
                                }`}
                            >
                                {isAnalyzing ? (
                                    <><Loader2 size={16} className="animate-spin text-white" /> 분석 중...</>
                                ) : (
                                    <><Search size={16} className="text-white" /> {result ? '진단 재분석' : '특성 분석'}</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body Layout: 12-Column Grid */}
            <div className="p-8 pb-32">
                <div className="grid grid-cols-12 gap-8 items-start">
                    
                    {/* Left: Component Analysis Content (8 Cols) */}
                    <div className="col-span-12 xl:col-span-8 flex flex-col gap-6">
                        
                        {/* ZONE 1: Context & Needs */}
                        <div className="grid grid-cols-12 gap-6">
                            {/* Demand & Awareness */}
                            <div className="col-span-12 lg:col-span-5 bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                                <div className="mb-4">
                                    <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                        <Users size={18} className="text-orange-600" />
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
                                            <span className="text-3xl font-black text-slate-800">{demandCount.toLocaleString()}</span>
                                            <span className="text-xs text-slate-500 mb-1">명/년</span>
                                        </div>
                                        <div className="text-[8px] text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100 flex items-center gap-1 mt-1">
                                            <TrendingUp size={10} /> {demandTrend}
                                        </div>
                                    </div>
                                    
                                    {/* NIMBY overcoming */}
                                    <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 flex flex-col items-center justify-center text-center relative">
                                        <div className="text-[10px] font-bold text-orange-700 mb-2">지역사회 건립 동의율</div>
                                        <div className="flex w-full items-center justify-center gap-2 mb-1">
                                            <div className="relative w-14 h-14 flex items-center justify-center">
                                                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                                                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#dbeafe" strokeWidth="4" />
                                                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#2563eb" strokeWidth="4" strokeDasharray={`${nimbyRate}, 100`} />
                                                </svg>
                                                <div className="absolute text-[11px] font-black text-orange-700">{nimbyRate}%</div>
                                            </div>
                                        </div>
                                        <p className="text-[9px] text-orange-600 mt-2 leading-tight">
                                            {nimbyText}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Regional Map Analysis */}
                            <div className="col-span-12 lg:col-span-7 bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex relative overflow-hidden">
                                <div className="w-1/2 pr-6 border-r border-slate-100 z-10 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-1">
                                            <Map size={18} className="text-orange-600" />
                                            대상지 광역분석
                                        </h3>
                                        <p className="text-[11px] text-slate-500 mb-4">{address}</p>

                                        <div className="space-y-3">
                                            {regionalPoints.map((pt, i) => (
                                                <div key={i} className="flex items-start gap-3">
                                                    <div className="w-6 h-6 rounded bg-orange-50 flex items-center justify-center shrink-0 mt-0.5 border border-orange-100">
                                                        {i === 0 ? <BadgeCheck size={14} className="text-orange-600" /> : <Building size={14} className="text-orange-600" />}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs font-bold text-slate-800">{pt.title}</h4>
                                                        <p className="text-[10px] text-slate-500">{pt.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mt-4 p-2.5 bg-slate-50 rounded border border-slate-100 text-[10px] text-slate-600 font-medium leading-relaxed">
                                        "{regionalQuote}"
                                    </div>
                                </div>

                                {/* Schematic Map SVG */}
                                <div className="w-1/2 relative flex items-center justify-center pl-6">
                                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.02)_0%,transparent_70%)]"></div>
                                    <svg viewBox="0 0 200 160" className="w-full h-full max-h-[160px] drop-shadow-sm">
                                        {/* Base Blocks */}
                                        <path d="M 20 40 L 80 10 L 180 30 L 190 120 L 120 150 L 10 130 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" strokeLinejoin="round" />
                                        {/* Roads */}
                                        <path d="M 80 10 L 90 150" fill="none" stroke="#cbd5e1" strokeWidth="4" />
                                        <path d="M 10 70 L 190 80" fill="none" stroke="#cbd5e1" strokeWidth="4" />
                                        
                                        {/* Zoned Areas */}
                                        <rect x="30" y="20" width="40" height="30" rx="2" fill="#e2e8f0" opacity="0.6" />
                                        <rect x="110" y="40" width="50" height="30" rx="2" fill="#e2e8f0" opacity="0.6" />
                                        <rect x="110" y="90" width="60" height="40" rx="2" fill="#e2e8f0" opacity="0.6" />
                                        
                                        {/* Target Site */}
                                        <circle cx="85" cy="75" r="24" fill="rgba(34, 197, 94, 0.1)" stroke="#22c55e" strokeWidth="2" strokeDasharray="4 4" />
                                        <rect x="75" y="65" width="20" height="20" rx="4" fill="#10b981" />
                                        <text x="85" y="78" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">SITE</text>
                                        
                                        {/* Arrows */}
                                        <path d="M 50 35 Q 70 50 75 60" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="2 2" markerEnd="url(#arrow)" />
                                        <path d="M 130 55 Q 110 60 95 65" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="2 2" markerEnd="url(#arrow)" />
                                        
                                        <defs>
                                            <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                                                <polygon points="0 0, 6 3, 0 6" fill="#3b82f6" />
                                            </marker>
                                        </defs>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* ZONE 2 */}
                        <div className="grid grid-cols-12 gap-6">
                            {/* Zone 2: Lifecycle Spaces */}
                            <div className="col-span-12 bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                                <div className="mb-6">
                                    <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                        <Heart size={18} className="text-orange-500" />
                                        생애주기·수직 조닝
                                    </h3>
                                    <p className="text-[11px] text-slate-500 mt-1">사용자 행동 특성 최고도화 및 관리 접근성 최적화</p>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                                    {lifecycleZones.map((zone, idx) => (
                                        <div key={idx} className="flex items-stretch h-14">
                                            <div className="w-12 bg-slate-100 text-slate-500 font-black flex items-center justify-center rounded-l-lg border-y border-l border-slate-200 shrink-0">{zone.floorIndex}</div>
                                            <div className="flex-1 bg-orange-50 border border-orange-100 p-2.5 rounded-r-lg flex flex-col justify-center overflow-hidden">
                                                <p className="text-xs font-bold text-orange-800 truncate">{zone.floorTitle}</p>
                                                <p className="text-[10px] text-orange-600 mt-0.5 truncate">{zone.floorDesc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Zone 3: CommunityLink Integration */}
                            <div className="col-span-12 bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col">
                                <div className="mb-4 flex items-start justify-between">
                                    <div>
                                        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                            <Globe size={18} className="text-orange-600" />
                                            지역사회 통합 및 공생 설계 (CommunityLink)
                                        </h3>
                                        <p className="text-[11px] text-slate-500 mt-1">지역사회와의 물리적/시각적 공생 지수 정량화 평가 및 개선 방안 도출</p>
                                    </div>
                                    <div className="text-right flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">
                                        <span className="text-[11px] font-bold text-orange-800">통합 평가 등급:</span>
                                        <span className="text-sm font-black text-orange-600">{communityGrade} ({communityScore}점)</span>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                                    {communityCategories.map((cat, idx) => (
                                        <div key={idx} className={`bg-slate-50 border border-slate-100 p-3.5 rounded-lg relative overflow-hidden group transition-colors ${idx % 2 === 0 ? 'hover:border-orange-200' : 'hover:border-amber-200'}`}>
                                            <div className={`absolute top-0 right-0 px-2 py-1 rounded-bl-lg flex items-center justify-center text-[9px] font-bold ${idx % 2 === 0 ? 'bg-orange-100 text-orange-700' : 'bg-amber-100 text-amber-700'}`}>배점 25</div>
                                            <h4 className="text-xs font-bold text-slate-800 mb-1.5 w-4/5 truncate">{cat.title}</h4>
                                            <p className="text-[10px] text-slate-500 leading-tight h-[28px] overflow-hidden">{cat.desc}</p>
                                            <div className="mt-3 flex items-center gap-2">
                                                <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                                    <div className={`${idx % 2 === 0 ? 'bg-orange-500' : 'bg-amber-500'} h-1.5 rounded-full`} style={{width: `${(Number(cat.scoreOutof25) / 25) * 100}%`}}></div>
                                                </div>
                                                <span className="text-[9px] font-bold text-slate-600">{Number(cat.scoreOutof25).toFixed(1)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    
                    {/* Right: SKILL Integrated Dashboard (4 Cols) */}
                    <div className="col-span-12 xl:col-span-4 h-[calc(100vh-140px)] sticky top-[88px] flex flex-col gap-5">
                        
                        {/* SKILL Badge */}
                        <div className="bg-gradient-to-b from-orange-600 to-orange-500 rounded-lg p-5 shadow-2xl border border-orange-500 relative overflow-hidden shrink-0 text-white">
                            {/* Background Tech Elements */}
                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-[50px] -mr-16 -mt-16"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-200 rounded-full blur-[40px] -ml-12 -mb-12"></div>
                            </div>
                            
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-1.5 bg-white/20 rounded-md border border-white/30 shadow-inner">
                                        <Cpu size={16} className="text-white drop-shadow-md" />
                                    </div>
                                    <span className="text-[10px] font-mono font-bold text-orange-100 tracking-wider drop-shadow-sm">ARCHE PROJECT SKILL ENGINE</span>
                                </div>
                                <h3 className="text-lg font-black text-white leading-tight drop-shadow-md">AI 특화 설계 모듈<br/>모니터링 대시보드</h3>
                                
                                <div className="mt-4 flex gap-2">
                                    <div className="bg-orange-800/40 px-2 py-1.5 rounded flex items-center gap-1.5 border border-orange-500/50 flex-1 shadow-inner">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-200 animate-pulse"></div>
                                        <span className="text-[10px] text-white font-bold drop-shadow-sm">2 Active</span>
                                    </div>
                                    <div className="bg-orange-800/40 px-2 py-1.5 rounded flex items-center gap-1.5 border border-orange-500/50 flex-1 shadow-inner">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-300/50"></div>
                                        <span className="text-[10px] text-orange-200 font-medium">2 Standby</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SKILL Roadmap List */}
                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                                    <LayoutDashboard size={14} className="text-slate-500"/>
                                    SKILL 연동 로드맵
                                </h4>
                                <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded font-medium">A-4 Workflow</span>
                            </div>

                            <div className="p-2 space-y-1.5 overflow-y-auto flex-1">
                                {/* 1. ZoneMatrix (Active) */}
                                <div className="group rounded-lg p-3 bg-orange-50/50 border-l-2 border-l-orange-500 border border-orange-100 hover:bg-orange-50 transition-colors">
                                    <div className="flex items-start justify-between mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <Component size={14} className="text-orange-600" />
                                            <span className="text-xs font-bold text-orange-900">ZoneMatrix</span>
                                        </div>
                                        <span className="text-[9px] font-bold text-orange-600 bg-orange-100/50 px-1.5 py-0.5 rounded">1순위</span>
                                    </div>
                                    <p className="text-[11px] text-slate-600 font-medium mb-2">생애주기 기반 수직 조닝 최적화 엔진</p>
                                    <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-orange-100/50 pt-2">
                                        <span className="flex items-center fill-orange-500 text-orange-600 gap-1"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> Running</span>
                                        <span>조닝 타당성 검증</span>
                                    </div>
                                </div>

                                {/* 2. DemandTrace (Active) */}
                                <div className="group rounded-lg p-3 bg-orange-50/50 border-l-2 border-l-orange-500 border border-orange-100 hover:bg-orange-50 transition-colors">
                                    <div className="flex items-start justify-between mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp size={14} className="text-orange-600" />
                                            <span className="text-xs font-bold text-orange-900">DemandTrace</span>
                                        </div>
                                        <span className="text-[9px] font-bold text-orange-600 bg-orange-100/50 px-1.5 py-0.5 rounded">1순위</span>
                                    </div>
                                    <p className="text-[11px] text-slate-600 font-medium mb-2">수요 정량화 및 타당성 추적 엔진</p>
                                    <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-orange-100/50 pt-2">
                                        <span className="flex items-center fill-orange-500 text-orange-600 gap-1"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> Running</span>
                                        <span>시장성 지수</span>
                                    </div>
                                </div>

                                {/* 3. SiteIQ (Standby) */}
                                <div className="group rounded-lg p-3 bg-slate-50/50 border border-slate-200 opacity-75">
                                    <div className="flex items-start justify-between mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={14} className="text-slate-500" />
                                            <span className="text-xs font-bold text-slate-700">SiteIQ</span>
                                        </div>
                                        <span className="text-[9px] font-medium text-slate-500 bg-slate-200/50 px-1.5 py-0.5 rounded">2순위</span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 mb-2">대상지 광역 인프라 연계 분석</p>
                                    <div className="flex items-center justify-between text-[9px] text-slate-400 border-t border-slate-200/50 pt-2">
                                        <span className="flex items-center gap-1"><AlertCircle size={10}/> Standby</span>
                                        <span>GIS 연동 대기</span>
                                    </div>
                                </div>

                                {/* 4. CommunityLink (Standby) */}
                                <div className="group rounded-lg p-3 bg-slate-50/50 border border-slate-200 opacity-75">
                                    <div className="flex items-start justify-between mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <Globe size={14} className="text-slate-500" />
                                            <span className="text-xs font-bold text-slate-700">CommunityLink</span>
                                        </div>
                                        <span className="text-[9px] font-medium text-slate-500 bg-slate-200/50 px-1.5 py-0.5 rounded">2순위</span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 mb-2">지역사회 통합 설계 지수 산정</p>
                                    <div className="flex items-center justify-between text-[9px] text-slate-400 border-t border-slate-200/50 pt-2">
                                        <span className="flex items-center gap-1"><AlertCircle size={10}/> Standby</span>
                                        <span>BIM Link 연동 대기</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-3 bg-slate-50 border-t border-slate-200 shrink-0">
                                <button className="w-full py-2 bg-gradient-to-r from-orange-500 to-orange-600 border border-orange-600 text-white text-[11px] font-bold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95">
                                    <LayoutDashboard size={14} /> 종합 리포트 생성 (BIM 연계)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
