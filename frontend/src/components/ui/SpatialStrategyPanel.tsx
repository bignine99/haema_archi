import React, { useState } from 'react';
import { Target, Leaf, Map as MapIcon, Cpu, Users, Wind, ShieldCheck, Box, ChevronRight, CheckCircle2, Factory, ArrowUpSquare, Search, RefreshCw } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';

// Dynamic mock generators based on buildingUse
const getDynamicStrategy = (buildingUse: string, floors: number) => {
    let lifecycles = [];
    let zones = [];
    
    if (buildingUse.includes('상업') || buildingUse.includes('근린')) {
        lifecycles = [
            { id: 1, floor: '지하부 (B1~B+)', title: '코어 접근성 극대화', desc: '주차 최적화, 썬큰(Sunken)을 활용한 채광 확보, 설비 공간의 효율적 레이아웃 구성' },
            { id: 2, floor: '저층부 (1F~3F)', title: '가로 활성화 커머셜 존', desc: 'Street-level activation을 통한 개방형 동선, 랜드마크형 메인 로비와 F&B 연계 설계' },
            { id: 3, floor: '중층부 (MidF)', title: '오피스 및 메디컬 코어', desc: '가변형 모듈러 평면 적용, 공용 공간을 통한 소통 극대화, 자연 채광 설계 가이드 적용' },
            { id: 4, floor: '최상층 (Top)', title: '스카이 라운지 & 테라스', desc: '파노라마 조망을 제공하는 옥상 정원 및 하이엔드 어메니티 공간 확보' }
        ];
        zones = [
            { id: 'welcome', title: '접근/환송 존', subtitle: 'Welcome & Drop-off', iconType: 'Map', rooms: ['메인 로비 (600㎡)', '에스컬레이터 홀', '주차 웰컴 존'], factors: { height: '4.5m 이상', lux: '자연채광/갤러리 조도', hvac: '자연환기/공조 병행' }, color: 'bg-orange-100 text-orange-700 border-orange-300' },
            { id: 'com', title: '메인 커머셜 존', subtitle: 'Main Retail', iconType: 'Users', rooms: ['F&B 리테일 스토어', '앵커 테넌트 존', '공용 휴게 라운지'], factors: { height: '3.6m', lux: '400lx (디밍)', hvac: '개별/중앙 공조 혼합' }, color: 'bg-orange-50 text-orange-600 border-orange-200' },
            { id: 'amenity', title: '어메니티 존', subtitle: 'Amenity & Lounge', iconType: 'Wind', rooms: ['스카이 라운지', '공중 정원', '루프탑 테라스'], factors: { height: '3.0m', lux: '300lx (경관조명)', hvac: '하이브리드 공조' }, color: 'bg-amber-50 text-amber-600 border-amber-200' }
        ];
    } else if (buildingUse.includes('주거') || buildingUse.includes('아파트') || buildingUse.includes('주택')) {
        lifecycles = [
            { id: 1, floor: '지하부 (B1~B+)', title: '스마트 주차 및 세대창고', desc: '드롭오프 존(Drop-off), 웰컴 라운지 연계 및 전기차 전용 스마트 패드 구역 설정' },
            { id: 2, floor: '저층부 (1F~3F)', title: '커뮤니티 거점 부대복리시설', desc: '경로당, 어린이집, 피트니스 등 입주민 전용 보행자 진입로와 연계된 쾌적한 설계' },
            { id: 3, floor: '중층부 (MidF)', title: '거주성 극대화 주동', desc: '남향 위주 배치, 자연 환기 및 맞통풍 구조를 통한 쾌적하고 조용한 휴식 공간 제공' },
            { id: 4, floor: '상층부 (Top)', title: '펜트하우스 & 스카이 커뮤니티', desc: '스카이 브릿지 커뮤니티, 펜트하우스 세대 특화 및 프라이빗 루프탑 정원 구성' }
        ];
        zones = [
            { id: 'community', title: '부대/복리시설 존', subtitle: 'Community Center', iconType: 'Users', rooms: ['피트니스/골프 (200㎡)', '키즈룸 및 북카페', '경로당/보육시설'], factors: { height: '3.0m 이상', lux: '300~500lx', hvac: '전열교환 환기시스템' }, color: 'bg-orange-100 text-orange-700 border-orange-300' },
            { id: 'eco', title: '친환경 조경 존', subtitle: 'Eco & Green', iconType: 'Leaf', rooms: ['단지 중앙 광장', '유아 놀이터', '수공간 및 산책로'], factors: { height: '-', lux: '에너지 절감 야간 디밍', hvac: '자연 채광 극대화' }, color: 'bg-amber-50 text-amber-600 border-amber-200' },
            { id: 'smart', title: '스마트 모빌리티', subtitle: 'Smart Parking', iconType: 'Cpu', rooms: ['스마트 우편/택배함', 'EV 충전소 거점', '차량 관제 로비'], factors: { height: '2.7m 이상', lux: '센서 동작 조도 제어', hvac: '강제 환기 시스템 설비' }, color: 'bg-slate-50 text-slate-600 border-slate-200' }
        ];
    } else {
        // Default / Office / Etc
        lifecycles = [
            { id: 1, floor: '지하부 (B1~B+)', title: '코어 접근성 및 메가 썬큰', desc: '차량 접근과 물류 하역을 위한 최적화, 썬큰을 통한 빛 환경 개선 및 설비 배치' },
            { id: 2, floor: '저층부 (1F~3F)', title: '랜드마크 로비 및 공유 거점', desc: '높은 층고(최소 4.5m 이상)의 메인 로비, 입주사 공용 미팅룸 및 F&B 상권 연계' },
            { id: 3, floor: '중층부 (MidF)', title: '플랙서블 워크스테이션', desc: '코어 프리스페이스(Core-free) 구조, 기둥 간격을 극대화한 유연한 스마트 오피스 환경' },
            { id: 4, floor: '최상층 (Top)', title: '프리미엄 라운지 및 임원실', desc: '에너지 고효율(BEMS) 제어 옥상정원, 조망을 고려한 프라이빗 컨퍼런스룸 특화 설계' }
        ];
        zones = [
            { id: 'core', title: '메인 코어 존', subtitle: 'Main Functional', iconType: 'Box', rooms: ['모듈러 오피스 룸', '공용 회의실', '코어 프리 스페이스'], factors: { height: '2.7~3.0m', lux: '500lx (스마트 디밍)', hvac: 'VAV 공조 제어' }, color: 'bg-orange-50 text-orange-600 border-orange-200' },
            { id: 'amenity', title: '공유/휴게 존', subtitle: 'Amenity Lounge', iconType: 'Wind', rooms: ['오픈 라운지 카페', '야외 옥상 테라스', '수면/휴게 캡슐 빌리지'], factors: { height: '3.6m 이상', lux: '간접조명 중심 200lx', hvac: '녹색건축 자연환기' }, color: 'bg-orange-100 text-orange-700 border-orange-300' },
            { id: 'mep', title: '스마트 MEP 존', subtitle: 'Eco MEP', iconType: 'Cpu', rooms: ['BEMS 통제실', '친환경 기계실', 'EV & 스마트 시스템'], factors: { height: '3.6m', lux: '작업 조도 유지', hvac: '에너지 효율 1등급' }, color: 'bg-slate-50 text-slate-600 border-slate-200' }
        ];
    }

    return {
        lifecycles,
        zones,
        gseedScore: 88.5,
        zebScore: 24.2
    };
};

// Helper for rendering icons dynamically safely
const renderZoneIcon = (iconType: string, size = 24) => {
    switch (iconType) {
        case 'Map': return <MapIcon size={size} />;
        case 'Users': return <Users size={size} />;
        case 'Wind': return <Wind size={size} />;
        case 'Leaf': return <Leaf size={size} />;
        case 'Cpu': return <Cpu size={size} />;
        case 'Box': return <Box size={size} />;
        default: return <Target size={size} />;
    }
};

export const SpatialStrategyPanel = () => {
    const store = useProjectStore();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [activeZone, setActiveZone] = useState('');

    const handleAnalyze = () => {
        setIsAnalyzing(true);
        // Simulate API call
        setTimeout(() => {
            const result = getDynamicStrategy(store.buildingUse, store.totalFloors);
            store.setSpaceStrategyResult(result);
            setActiveZone(result.zones[0].id);
            setIsAnalyzing(false);
        }, 1500);
    };

    const hasData = !!store.spaceStrategyResult;
    const { lifecycles, zones, gseedScore, zebScore } = store.spaceStrategyResult || { lifecycles: [], zones: [] };

    return (
        <div className="w-full flex flex-col bg-[#F8FAFC] relative font-sans min-h-[750px] pb-8 overflow-y-auto overflow-x-hidden custom-scrollbar">
            {/* Top Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-white z-10 shadow-sm sticky top-0">
                <div className="flex items-center space-x-3">
                    <div className="bg-orange-50 p-2 rounded-lg text-orange-600">
                        <Target size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800 tracking-tight">
                            맞춤형 공간 특화 전략 (Space Specialization)
                        </h1>
                        <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-2xl line-clamp-1">
                            대지 조건({store.landArea}㎡)과 건물 용도({store.buildingUse}, {store.totalFloors}F)에 특화된 수직 조닝 및 존 라이브러리 연계.
                        </p>
                    </div>
                </div>
                <div className="flex space-x-3 shrink-0">
                    <button 
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 rounded-lg text-sm font-bold text-white shadow-md transition-all whitespace-nowrap"
                    >
                        {isAnalyzing ? (
                            <>
                                <RefreshCw size={16} className="animate-spin" />
                                <span>분석 중...</span>
                            </>
                        ) : hasData ? (
                            <>
                                <RefreshCw size={16} />
                                <span>특화 전략 재분석</span>
                            </>
                        ) : (
                            <>
                                <Target size={16} />
                                <span>AI 특화 전략 분석 시작</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col px-4 md:px-6 py-6 gap-6 max-w-[1600px] mx-auto w-full">
                
                {!hasData ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-white border border-slate-200 rounded-lg shadow-sm border-dashed">
                        <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
                            <Target size={40} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-2">공간 특화 전략이 생성되지 않았습니다</h2>
                        <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
                            우측 상단의 <strong>AI 특화 전략 분석 시작</strong> 버튼을 클릭하여, 현재 프로젝트({store.buildingUse})에 가장 최적화된 생애주기별 수직 전략과 6대 핵심 존 구성 데이터를 도출하세요.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* 1. Lifecycle Vertical Strategy module : Real Vertical Section Diagram */}
                        <section>
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
                                    <ArrowUpSquare className="text-orange-500" size={18} />
                                    1. 층별 수직 계층화 모델 (Vertical Section Diagram)
                                </h2>
                                <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">{store.buildingUse} 맞춤형</span>
                            </div>
                            
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 shadow-inner relative overflow-hidden">
                                {/* Decorative background grid */}
                                <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                                
                                <div className="flex flex-col-reverse gap-3 relative z-10 max-w-4xl mx-auto">
                                    {/* Vertical structural core line */}
                                    <div className="absolute left-[88px] top-4 bottom-4 w-1.5 bg-gradient-to-b from-orange-300 via-slate-400 to-slate-500 rounded-full shadow-sm opacity-50 hidden sm:block"></div>
                                    
                                    {lifecycles.map((lifecycle: any, index: number) => {
                                        // Dynamic styles based on vertical position
                                        const isBasement = index === 0;
                                        const isTop = index === lifecycles.length - 1;
                                        const blockColor = isBasement ? 'bg-slate-700 text-white' : isTop ? 'bg-orange-600 text-white' : 'bg-white text-slate-800';
                                        const labelColor = isBasement ? 'bg-slate-600 text-slate-100' : isTop ? 'bg-orange-500 text-orange-50' : 'bg-orange-50 text-orange-700';
                                        
                                        return (
                                            <div key={lifecycle.id} className="flex flex-col sm:flex-row items-stretch gap-4 sm:gap-6 group">
                                                {/* Floor Label */}
                                                <div className={`w-full sm:w-[150px] shrink-0 self-center text-center sm:text-right py-2 px-3 rounded-lg border font-extrabold text-[12px] uppercase shadow-sm transition-transform group-hover:-translate-x-1 relative z-10
                                                    ${isBasement ? 'border-slate-600 bg-slate-800 text-slate-200' : isTop ? 'border-orange-400 bg-orange-50 text-orange-700' : 'border-orange-200 bg-white text-orange-900'}
                                                `}>
                                                    {lifecycle.floor}
                                                    {/* Joiner arm */}
                                                    <div className="absolute right-[-24px] top-1/2 w-6 h-0.5 bg-slate-300 hidden sm:block"></div>
                                                </div>
                                                
                                                {/* Content Block */}
                                                <div className={`flex-1 rounded-lg p-4 sm:p-5 border shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:scale-[1.01] relative z-10
                                                    ${isBasement ? 'border-slate-800 bg-slate-800/95 backdrop-blur' : 'border-slate-200 bg-white'}
                                                `}>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className={`p-1.5 rounded-full ${isBasement ? 'bg-slate-700' : 'bg-orange-50'}`}>
                                                            <Target size={16} className={isBasement ? 'text-slate-300' : 'text-orange-500'} />
                                                        </div>
                                                        <h3 className={`text-[14px] font-bold ${isBasement ? 'text-white' : 'text-slate-800'}`}>{lifecycle.title}</h3>
                                                    </div>
                                                    <div className={`text-[13px] font-medium leading-relaxed mt-2 pl-9 ${isBasement ? 'text-slate-300' : 'text-slate-600'}`}>
                                                        {lifecycle.desc}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            {/* 2. Core Zones Library */}
                            <section className="md:col-span-12 lg:col-span-8 flex flex-col min-w-0">
                                <h2 className="text-[15px] font-bold text-slate-800 flex items-center gap-2 mb-4">
                                    <Box className="text-orange-500" size={18} />
                                    핵심 특화 존 라이브러리 (Zone Library)
                                </h2>
                                
                                <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col h-full">
                                    <div className="grid grid-cols-3 border-b border-slate-100">
                                        {zones.map((z: any) => {
                                            const isActive = activeZone === z.id;
                                            return (
                                                <button
                                                    key={z.id}
                                                    onClick={() => setActiveZone(z.id)}
                                                    className={`p-4 flex flex-col items-center justify-center text-center transition-all border-b-2 border-r border-slate-100 last:border-r-0 ${
                                                        isActive 
                                                        ? 'bg-orange-50 border-b-orange-600' 
                                                        : 'hover:bg-slate-50 bg-white border-b-transparent hover:border-b-slate-300'
                                                    }`}
                                                >
                                                    <div className={`mb-2 p-2.5 rounded-full ${isActive ? z.color : 'bg-slate-100 text-slate-400'}`}>
                                                        {renderZoneIcon(z.iconType, 24)}
                                                    </div>
                                                    <div className={`text-[13px] font-bold ${isActive ? 'text-slate-800' : 'text-slate-500'}`}>{z.title}</div>
                                                    <div className={`text-[10px] mt-0.5 font-medium px-2 ${isActive ? 'text-slate-500' : 'text-slate-400'} line-clamp-1`}>{z.subtitle}</div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Active Zone Detail */}
                                    <div className="p-6 flex-1 bg-slate-50/50">
                                        {zones.map((z: any) => {
                                            if (z.id !== activeZone) return null;
                                            return (
                                                <div key={z.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                    <div className="flex items-center justify-between mb-6">
                                                        <div>
                                                            <h3 className="text-lg font-extrabold text-slate-800">{z.title} 상세 계획</h3>
                                                            <p className="text-sm text-slate-500 font-medium mt-1">{z.subtitle}</p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                                                            <h4 className="text-[11px] uppercase font-bold text-slate-400 mb-3 tracking-widest">권장 프로그램 배치</h4>
                                                            <ul className="space-y-3">
                                                                {z.rooms.map((r: string, i: number) => (
                                                                    <li key={i} className="flex items-center text-sm font-semibold text-slate-700 p-1 bg-slate-50 border border-slate-100 rounded">
                                                                        <ChevronRight size={14} className="text-orange-500 mr-2 ml-1 shrink-0" />
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
                                                                        <span className="text-[13px] font-extrabold text-orange-600">{z.factors.height}</span>
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
                                                                <button className="flex items-center justify-between w-full text-[12px] font-bold text-slate-600 hover:text-orange-600 transition-colors group">
                                                                    <span className="flex items-center gap-1.5">
                                                                        <Box size={14} className="text-slate-400 group-hover:text-orange-500 transition-colors"/>
                                                                        실세부면적표(Space Program) 반영
                                                                    </span>
                                                                    <ChevronRight size={14} className="text-slate-400 group-hover:text-orange-500 transition-transform group-hover:translate-x-1" />
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
                            <section className="md:col-span-12 lg:col-span-4 flex flex-col min-w-0">
                                <h2 className="text-[15px] font-bold text-slate-800 flex items-center gap-2 mb-4">
                                    <Target className="text-orange-500" size={18} />
                                    설계 지표 및 정합성 검증
                                </h2>
                                
                                <div className="space-y-4 h-full flex flex-col">
                                    {/* SVG Simulation Placeholder */}
                                    <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex flex-col items-center justify-center flex-1 relative overflow-hidden">
                                        {/* AI Simulation Visibility / Adjacency Diagram */}
                                        <svg width="100%" height="240" viewBox="0 0 400 240" className="w-full h-[240px]">
                                            <defs>
                                                <pattern id="archGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                                                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5"/>
                                                </pattern>
                                                <radialGradient id="sightlineGrad" cx="50%" cy="50%" r="50%">
                                                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
                                                    <stop offset="70%" stopColor="#f97316" stopOpacity="0.1" />
                                                    <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
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
                                                    <circle cx={pt[0]} cy={pt[1]} r="3" fill="#ea580c" />
                                                    <path d={`M 200 120 L ${pt[0]} ${pt[1]}`} stroke="#f97316" strokeWidth="1.5" opacity="0.6"/>
                                                </g>
                                            ))}

                                            {/* Flow line animation */}
                                            <path d="M 80 80 C 160 80, 160 160, 200 160 C 240 160, 240 80, 280 80" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="6 4" className="flow-path opacity-80" />
                                            <circle cx="80" cy="80" r="4" fill="#f59e0b" />
                                            <circle cx="280" cy="80" r="4" fill="#f59e0b" />

                                            {/* Central Hub */}
                                            <g transform="translate(200, 120)">
                                                <circle cx="0" cy="0" r="32" fill="#ffffff" stroke="#f97316" strokeWidth="2" className="shadow-lg" />
                                                <circle cx="0" cy="0" r="36" fill="none" stroke="#f97316" strokeWidth="1.5" strokeDasharray="4 4" className="flow-path" />
                                                <circle cx="0" cy="0" r="24" fill="#ffedd5" />
                                                <text x="0" y="4" fontSize="12" fontWeight="bold" fill="#c2410c" textAnchor="middle">HUB</text>
                                            </g>
                                        </svg>
                                        
                                        {/* Explicit Hub Logic Description */}
                                        <div className="absolute bottom-4 left-0 right-0 px-5 relative z-10 w-full mb-[-10px] mt-4">
                                            <div className="bg-white text-slate-800 p-3 rounded-lg shadow-sm text-[12px] border border-slate-200 overflow-hidden relative">
                                                <div className="font-bold text-orange-600 mb-1 flex items-center gap-1.5"><ShieldCheck size={14}/> 코어 동선 효율성 검증</div>
                                                <p className="text-slate-600 font-medium leading-tight">
                                                    전이 공간 내 코어 배치 및 수직-수평 동선 결절점 분석 결과. 사용자의 보행 편의성 및 동선 겹침 방지를 최적화하였으며, 보행 낭비 면적 대비 <b>15% 동선 단축 효과</b>를 검증했습니다.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Verification Scores & Economic Impact */}
                                    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm text-slate-800 flex flex-col gap-5">
                                        {/* Environmental Verification */}
                                        <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-5">
                                            <div>
                                                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex justify-between">
                                                    <span>G-SEED (녹색건축)</span>
                                                </div>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-3xl font-extrabold text-orange-500">{gseedScore}</span>
                                                    <span className="text-xs text-slate-500 font-medium">점 (최우수/1등급)</span>
                                                </div>
                                                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                                                    <div className="bg-orange-400 h-full rounded-full" style={{ width: `${(gseedScore/100)*100}%` }}></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex justify-between">
                                                    <span>ZEB (제로에너지)</span>
                                                    <span className="text-amber-600 text-[10px] bg-amber-50 px-1 rounded">4등급</span>
                                                </div>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-3xl font-extrabold text-amber-500">{zebScore}</span>
                                                    <span className="text-xs text-slate-500 font-medium">% (자립률 타겟)</span>
                                                </div>
                                                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                                                    <div className="bg-amber-400 h-full rounded-full" style={{ width: `${Math.min(100, zebScore * 2)}%` }}></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Economic & Policy Impact */}
                                        <div>
                                            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">LCC 및 공사비 심의 연계 데이터</h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                                    <div className="text-[10px] text-slate-500 mb-1">고효율 설비 LCC 절감</div>
                                                    <div className="text-sm font-bold text-slate-800 flex items-center">
                                                        <span className="text-orange-500 mr-1">▼</span> 28.5% <span className="ml-2 text-[10px] text-slate-400 font-normal">생애 30년 기준 절감</span>
                                                    </div>
                                                </div>
                                                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                                    <div className="text-[10px] text-slate-500 mb-1">조닝 특화 공사비 증감</div>
                                                    <div className="text-sm font-bold text-slate-800 flex items-center">
                                                        <span className="text-orange-500 mr-1">▲</span> 1.2% <span className="ml-2 text-[10px] text-slate-400 font-normal">공간 확보 상쇄율</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
