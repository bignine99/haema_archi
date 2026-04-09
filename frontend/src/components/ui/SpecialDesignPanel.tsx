import React from 'react';
import { Sparkles, Network, Leaf, ShieldCheck, Activity, Users, BatteryCharging, ChevronRight, ArrowRight, Fan, Building2, Trees, Eye, AlertOctagon, Maximize2, MoveRight, Lock, CheckCircle2, TrendingDown, Server, Cpu, Navigation, Landmark, BadgeCheck } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { exportToJSON } from '@/utils/exportData';

const SpecialDesignPanel = () => {
    const store = useProjectStore();
    const buildingUse = store.buildingUse || '교육연구시설';
    const projectName = store.projectName || '미입력 프로젝트';
    const grossFloorArea = store.grossFloorArea || 5000;

    const isEdu = buildingUse === '교육연구시설';
    const isHospital = buildingUse === '의료시설';
    const isOffice = buildingUse === '업무시설(오피스)';
    const isSports = buildingUse.includes('체육') || buildingUse.includes('운동');

    // Dynamic strings
    const defaultBranding = projectName ? `${projectName} Innovation Hub` : 'Urban Innovation Campus';
    const branding = isHospital ? 'Healing Oasis Campus' : isOffice ? 'Smart Innovation Hub' : isSports ? 'Active Wellness Center' : defaultBranding;
    const slogan = isHospital ? '자연과 치유가 만나는 메디컬 거점' : isOffice ? '초연결 스마트 워크스페이스' : isSports ? '지역사회 밀착형 활력 충전 플랫폼' : '미래를 향한 융합과 상생의 공동체';
    const masterplanDesc = isHospital 
        ? '일반적인 치료 기능을 넘어 지역 사회와 상생하며, 도심 속 프리미엄 헬스케어 및 생태적 치유 환경을 제공하는 메디컬 혁신 거점으로 자리매김합니다.'
        : isOffice 
        ? '단조로운 업무 공간을 넘어 구성원의 웰니스와 지역사회 네트워킹을 증명하는 차세대 하이브리드 워크스페이스 벤치마크 모델로 자리매김합니다.'
        : isSports
        ? '지역 주민에게 고부가 스포츠 인프라를 제공하며 모든 연령층의 신체적, 정신적 웰니스를 증진하는 개방형 라이프스타일 랜드마크로 자리매김합니다.'
        : `단순한 기능을 넘어 지역과의 활발한 상호작용을 촉진하며, 도심 속 창의적 혁신 거점이자 사용자 중심의 미래형 융합 플랫폼으로 자리매김합니다.`;

    const scaleFactor = Math.max(1, grossFloorArea / 3000);
    const vsiScore = Math.min(85, Math.round(42 * scaleFactor));
    const ecoRate = Math.min(45, Number((16.7 * scaleFactor).toFixed(1)));
    const LCCCrossover = Math.max(4.0, (7.4 * (5000 / Math.max(1000, grossFloorArea)))).toFixed(1);
    const opexSavings = Math.min(60, Math.round(35 * scaleFactor));
    const bipvGen = Math.round(125 * scaleFactor);

    let policyTitle = '미래형 공공인프라 및 혁신 거점 표준 부합';
    let policyDesc = '국가 및 지자체 주관 스마트 인프라 확충 정책에 완벽히 부합하는 지속 가능 차세대 모델.';
    let policyTags = ['사용자 맞춤형 공간 고도화', '지역사회 상호작용 및 커뮤니티 거점', '스마트/친환경 기반 디지털 혁신(ZEB, BF 적용)'];

    if (isHospital) {
        policyTitle = '미래형 공공보건의료 마스터플랜 부합';
        policyDesc = '보건복지부 주관 스마트 의료 및 공공 헬스케어 인프라 확충 정책에 완벽히 부합하는 차세대 의료 모델.';
        policyTags = ['디지털 헬스케어 선도 및 스마트 환자안전망 확보', '지역 상생형 환자 중심 열린 치유 거점', '중증/감염 대응 100% 무균 공조 달성'];
    } else if (isOffice) {
        policyTitle = '차세대 하이브리드 워크스페이스 표준 부합';
        policyDesc = '기업의 ESG 경영 및 임직원의 웰니스(Wellness) 실현을 최우선으로 고려하는 미래형 오피스 벤치마크 모델.';
        policyTags = ['조직 창의성 극대화 소통/교류 노드 30% 확충', '지역사회 맞닿음 및 로컬 네트워크 커뮤니티 조성', '탄소 중립(ZEB) 친환경 스마트 빌딩 기준 달성'];
    } else if (isSports) {
        policyTitle = '생활형 SOC 및 지역 복합 스포츠 인프라 부합';
        policyDesc = '문체부 생활 밀착형 체육시설 확충 정책에 대응하며, 전 연령 생활 체육의 거점으로 활용 가능한 모델.';
        policyTags = ['다목적 복합경기장 및 고효율 체육공간 확보', '주야간 상시 개방성을 고려한 방범/안전 특화 설계', '무장애(BF) 유니버설 및 체육약자 편의성 제고'];
    }

    const clusterTitle = isHospital ? '4단계 환자 맞춤형 치유 클러스터' : isOffice ? '4단계 웰니스 코어 및 창의 존' : isSports ? '4단계 액티브 라이프스타일 콤플렉스' : '4단계 융합 및 소통 혁신 클러스터';

    const clusterSteps = isHospital ? [
        { step: 1, name: '응급/외상', color: 'emerald', sub: '응급의료센터, 감염분류소' },
        { step: 2, name: '집중치료', color: 'blue', sub: '중환자실(ICU), 하이브리드 수술실' },
        { step: 3, name: '일반/격리', color: 'emerald', sub: '스마트 일반병동, 음압격리병실' },
        { step: 4, name: '재활/치유', color: 'orange', sub: '물리치료, 옥상 힐링정원(빛치유)' }
    ] : isOffice ? [
        { step: 1, name: '집중업무', color: 'emerald', sub: '하이포커스 데스크, 1인 폰부스' },
        { step: 2, name: '창의협업', color: 'blue', sub: '아이디에이션 홀, 스크럼보드 라운지' },
        { step: 3, name: '소셜교류', color: 'emerald', sub: '사내 카페테리아, 오프닝 타운홀' },
        { step: 4, name: '웰니스케어', color: 'orange', sub: '수면/휴게실, 피트니스, 릴렉스룸' }
    ] : isSports ? [
        { step: 1, name: '퍼블릭존', color: 'emerald', sub: '웰컴 로비, 카페, 스포츠숍' },
        { step: 2, name: '멀티코트', color: 'blue', sub: '다목적 실내체육관, 조명/음향' },
        { step: 3, name: '피트니스', color: 'emerald', sub: 'G·X룸, 헬스장, 개인PT실' },
        { step: 4, name: '편의시설', color: 'orange', sub: '대형 락커, 무장애 샤워실, 회복실' }
    ] : [ 
        { step: 1, name: '소통라운지', color: 'emerald', sub: '환영 로비, 코워킹 라운지' },
        { step: 2, name: '창의실험', color: 'emerald', sub: '메이커스페이스, 집중 연구실' },
        { step: 3, name: '생활지원', color: 'blue', sub: '다목적 강당, 오픈 식당' },
        { step: 4, name: '힐링케어', color: 'orange', sub: '옥상 정원, 체육 밎 휴게 시설' }
    ];

    const clusterFloors = isHospital ? ['1F 응급/로비', '2F 수술실/ICU', '3F 무균병동', '4F 일반병동/가든'] : isOffice ? ['1F 코워킹/로비', '2F 오픈라운지', '3F 집중업무구역', '4F 임원/루프탑'] : isSports ? ['1F 진입마당/로비', '2F 다목적 체육관', '3F 헬스&피트니스', '4F 옥상 공원/트랙'] : ['1F 로비/오픈존', '2F 협업 라운지', '3F 집중 업무/연구', '4F 조용/독립존'];
    const loopTitle = isHospital ? '치유와 회복의 입체적 동선 교차망' : isOffice ? '업무와 휴식의 입체적 동선 교차망' : isSports ? '관람-경기-휴식의 3D 입체 트래픽 루프' : '유기적 연계 및 소통의 입체 동선망';

    const handleExport = () => {
        exportToJSON('SpecialDesign_Proposal', {
            project: projectName,
            use: buildingUse,
            grossFloorArea,
            metrics: { vsiScore, ecoRate, crossoverYears: LCCCrossover, opexSavingsPct: opexSavings, bipvCapacity: bipvGen }
        });
    };

    return (
        <div className="w-full flex flex-col bg-[#F8FAFC] relative font-sans min-h-[750px] pb-8 overflow-y-auto overflow-x-hidden custom-scrollbar">
            {/* Top Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-white z-10 shadow-sm sticky top-0 shrink-0">
                <div className="flex items-center space-x-3">
                    <div className="bg-orange-50 p-2 rounded-lg text-orange-600">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800 tracking-tight">
                            특화설계 제안서 (Specialized Design Proposal)
                        </h1>
                        <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-2xl line-clamp-1">
                            {projectName} 엔지니어링 실증 및 30년 생애주기 시스템 마스터플랜 (V3.0 - AI Simulated)
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md">
                        <Sparkles size={16} /> <span className="whitespace-nowrap">기술 제안서(PDF) 추출</span>
                    </button>
                </div>
            </div>

            {/* Main Content Grid (Extended vertically) */}
            <div className="flex-1 grid grid-cols-12 gap-5 px-4 md:px-6 py-6 pb-24 relative max-w-[1600px] mx-auto w-full">
                
                {/* ═══════════════ ZONE 1: Identity, Context & Policy (Col 1-12) ═══════════════ */}
                <div className="col-span-12 bg-white rounded-lg border border-slate-200 p-0 shadow-sm flex flex-col md:flex-row overflow-hidden h-auto min-h-[220px]">
                    {/* Left: Core Identity */}
                    <div className="w-full md:w-3/12 p-6 flex flex-col justify-center border-r border-slate-100 bg-gradient-to-br from-white to-slate-50 relative">
                        <div className="text-[10px] font-bold tracking-widest text-orange-500 mb-2 drop-shadow-sm">URBAN OASIS MASTERPLAN</div>
                        <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight leading-tight mb-2">{branding}</h3>
                        <p className="text-slate-400 font-bold mb-4 font-serif italic text-lg shadow-sm w-fit bg-white/50 px-1">{slogan}</p>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                            {masterplanDesc}
                        </p>
                    </div>

                    {/* Middle-Left: Weaving Strategies */}
                    <div className="w-full md:w-3/12 p-5 grid grid-rows-3 gap-3 border-r border-slate-100">
                        <div className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 shadow-sm border border-orange-100"><Users size={18} /></div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800 mb-0.5">We-LIVING</h4>
                                <p className="text-[10px] text-slate-500">님비 극복형 개방/공유 거버넌스</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 shadow-sm border border-orange-100"><Network size={18} /></div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800 mb-0.5">We-LINKING</h4>
                                <p className="text-[10px] text-slate-500">배리어프리 3차원 순환 네트워크</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 shadow-sm border border-orange-100"><Sparkles size={18} /></div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800 mb-0.5">We-LEARNING</h4>
                                <p className="text-[10px] text-slate-500">생애주기 다단계 맞춤 학습 공간</p>
                            </div>
                        </div>
                    </div>

                    {/* Middle-Right: Urban Transition Metric */}
                    <div className="w-full md:w-3/12 p-5 bg-white text-slate-800 relative overflow-hidden flex flex-col justify-center border-r border-slate-100">
                        <div className="absolute right-[-20%] bottom-[-20%] opacity-5 pointer-events-none stroke-slate-300"><GlobePattern /></div>
                        <div className="relative z-10">
                            <div className="text-[9px] font-bold text-slate-500 tracking-wider mb-2">ENVIRONMENT CONTEXT</div>
                            <div className="flex items-end justify-between mb-2">
                                <div className="flex text-slate-500 flex-col items-center gap-1"><Building2 size={20} /><span className="text-[9px] font-bold">Urban Gray</span></div>
                                <div className="flex-1 px-3 flex items-center justify-center relative">
                                    <div className="h-[1px] w-full bg-gradient-to-r from-slate-200 via-blue-500 to-orange-500 absolute top-1/2"></div>
                                    <ArrowRight size={12} className="text-orange-500 bg-white z-10 px-0.5 relative translate-y-[2px]" />
                                </div>
                                <div className="flex text-orange-600 flex-col items-center gap-1"><Trees size={20} /><span className="text-[9px] font-bold">Green Oasis</span></div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-3">
                                <div className="bg-slate-50 rounded p-2 border border-slate-100">
                                    <div className="text-[8px] text-slate-500 mb-0.5 leading-tight">시각적 개방감<br/>(VSI Score)</div>
                                    <div className="text-base font-extrabold text-orange-600">+{vsiScore}<span className="text-[9px] text-orange-600">%</span></div>
                                </div>
                                <div className="bg-slate-50 rounded p-2 border border-slate-100">
                                    <div className="text-[8px] text-slate-500 mb-0.5 leading-tight">대지 내<br/>생태유입률</div>
                                    <div className="text-base font-extrabold text-orange-600">{ecoRate}<span className="text-[9px] text-orange-600">%</span></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Policy Alignment (New) */}
                    <div className="w-full md:w-3/12 p-5 bg-orange-50/50 text-slate-800 relative flex flex-col justify-center">
                        <Landmark className="absolute top-3 right-3 text-orange-500/10" size={80} />
                        <div className="relative z-10">
                            <div className="flex items-center gap-1 mb-2">
                                <BadgeCheck size={14} className="text-orange-600" />
                                <div className="text-[10px] font-bold text-orange-700 tracking-wider">POLICY ALIGNMENT</div>
                            </div>
                            <h4 className="text-sm font-extrabold mb-1">{policyTitle}</h4>
                            <p className="text-[9px] text-slate-500 mb-3 leading-relaxed">
                                {policyDesc}
                            </p>
                            <div className="flex flex-col gap-1.5">
                                {policyTags.map((tag, idx) => (
                                    <span key={idx} className="bg-white border border-orange-100 text-orange-700 text-[9px] px-2 py-1 rounded shadow-sm">✔ {tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══════════════ ZONE 2: Double Loops Engine (Col 1-5, Middle) ═══════════════ */}
                <div className="col-span-12 lg:col-span-5 bg-white rounded-lg border border-slate-200 p-5 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mx-1 mb-4">
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                                <Network size={16} className="text-orange-600" /> Double Loops Architecture
                            </h3>
                            <p className="text-[10px] text-slate-500 mt-0.5 font-medium ml-5">{loopTitle}</p>
                        </div>
                        <span className="text-[9px] bg-slate-800 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wide flex items-center gap-1 shadow">
                            <Cpu size={10} className="text-orange-400" /> AI Flow Simulation
                        </span>
                    </div>

                    <div className="flex-1 bg-slate-50 rounded-lg border border-slate-100 relative p-3 flex flex-col gap-3">
                        {/* 1) Axonometric Loop Diagram & AI Simulation Badges */}
                        <div className="h-[150px] bg-white rounded border border-slate-100 shadow-inner flex flex-col items-center justify-center relative overflow-hidden">
                            <AxonometricDiagram />
                            {/* Overlay Badges */}
                            <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                                <div className="bg-slate-800/90 backdrop-blur border-l-2 border-l-orange-400 text-white px-2 py-1 flex items-center gap-1.5 rounded shadow-sm">
                                    <TrendingDown size={10} className="text-orange-400"/>
                                    <span className="text-[8px] font-bold">학생 피로도/관리 동선</span>
                                    <span className="text-[10px] font-black text-orange-400 ml-1">-15%</span>
                                </div>
                            </div>
                            <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur text-[9px] border border-orange-200 text-orange-700 px-2 flex items-center gap-1 py-1 rounded shadow-sm font-bold">
                                <Eye size={12} className="text-orange-600" /> HUB CPO 시야각 <span className="text-orange-500 font-black">160°</span> (무사각지대 0%)
                            </div>
                        </div>

                        {/* 2) 3.3m Wheelchair Bottleneck Simulation Detail */}
                        <div className="h-[130px] bg-white rounded border border-slate-200 p-3 relative flex items-center shadow-sm overflow-hidden">
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.03)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.03)_50%,rgba(0,0,0,0.03)_75%,transparent_75%,transparent_100%)] bg-[length:20px_20px]"></div>
                            <div className="w-[45%] relative h-full border-r border-slate-200 pr-4 flex items-center bg-slate-50 rounded">
                                {/* Wheelchair Top-down SVG */}
                                <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-sm">
                                    <line x1="0" y1="10" x2="100" y2="10" stroke="#cbd5e1" strokeWidth="2" />
                                    <line x1="0" y1="70" x2="100" y2="70" stroke="#cbd5e1" strokeWidth="2" />
                                    <line x1="10" y1="10" x2="10" y2="70" stroke="#f97316" strokeWidth="1" />
                                    <polygon points="10,10 7,15 13,15" fill="#f97316" />
                                    <polygon points="10,70 7,65 13,65" fill="#f97316" />
                                    <text x="14" y="43" fill="#ea580c" fontSize="9" fontWeight="bold">3.3m</text>
                                    
                                    {/* Simulation Heatmap Blob */}
                                    <circle cx="55" cy="40" r="25" fill="none" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="1 1" opacity="0.6"/>
                                    <rect x="30" y="20" width="30" height="18" rx="2" fill="#ffffff" stroke="#fb923c" />
                                    <circle cx="55" cy="29" r="6" fill="#fb923c" opacity="0.9" />
                                    <line x1="25" y1="20" x2="25" y2="38" stroke="#fb923c" strokeWidth="1.5" />
                                    
                                    <rect x="50" y="42" width="30" height="18" rx="2" fill="#ffffff" stroke="#f97316" />
                                    <circle cx="55" cy="51" r="6" fill="#f97316" opacity="0.9" />
                                    <line x1="85" y1="42" x2="85" y2="60" stroke="#f97316" strokeWidth="1.5" />
                                </svg>
                            </div>
                            <div className="w-[55%] pl-4 relative z-10">
                                <div className="text-[9px] text-orange-600 font-bold flex items-center justify-between mb-1 uppercase tracking-wider">
                                    <span className="flex items-center gap-1"><Cpu size={10} /> Bottleneck Analyzed</span>
                                    <span className="bg-orange-50 text-orange-600 px-1 py-0.5 rounded border border-orange-200 tracking-widest text-[7px] font-black">PASS</span>
                                </div>
                                <div className="text-xl font-black text-slate-800 tracking-tight mb-0.5">3.3<span className="text-[11px] font-normal text-slate-500 ml-1">m 초광폭 복도</span></div>
                                <p className="text-[9px] text-slate-500 leading-snug">AI 시뮬레이션 결과: 휠체어 10대 동시 교행 모의실험 시 병목 현상 0건 확보 (1.4m 회전 반경 동시 수용).</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══════════════ ZONE 3: Rehab & Community (Col 6-12, Middle) ═══════════════ */}
                <div className="col-span-12 lg:col-span-7 flex flex-col gap-5">
                    
                    {/* 3A: 4-Stage Rehab */}
                    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm flex-1">
                        <div className="flex items-center justify-between mx-1 mb-3">
                            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 flex-1">
                                <Activity size={16} className="text-orange-500" /> {clusterTitle}
                            </h3>
                            {/* Vertical Life-cycle Mapper embedded in 3A header for space efficiency */}
                            <div className="flex bg-slate-50 border border-slate-200 rounded p-1 gap-1 shadow-inner h-fit">
                                {clusterFloors.map((floor, i) => (
                                    <div key={i} className={`text-[8px] font-bold px-1 py-0.5 rounded shadow-sm ${i === 3 ? 'bg-amber-50 border border-amber-200 text-amber-700' : 'bg-white text-slate-600'}`}>{floor}</div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-3 relative before:absolute before:top-[50%] before:left-4 before:right-4 before:h-[2px] before:bg-slate-100 before:-z-10 h-[100px]">
                            {clusterSteps.map((item, i) => (
                                <div key={i} className={
                                    `bg-white border-2 border-slate-100 rounded-lg p-2.5 hover:-translate-y-1 transition-all group flex flex-col shadow-sm cursor-pointer relative bg-gradient-to-b from-white to-slate-50 ` +
                                    (item.color === 'emerald' ? 'hover:border-orange-400' : item.color === 'blue' ? 'hover:border-orange-400' : 'hover:border-orange-400')
                                } style={{ marginTop: `${i * 6}px`}}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className={
                                            `w-5 h-5 rounded bg-slate-100 text-slate-600 text-[10px] font-black flex items-center justify-center group-hover:text-white transition-colors ` +
                                            (item.color === 'emerald' ? 'group-hover:bg-orange-500' : item.color === 'blue' ? 'group-hover:bg-orange-500' : 'group-hover:bg-orange-500')
                                        }>{item.step}</div>
                                        <h4 className="text-[12px] font-bold text-slate-800">{item.name}</h4>
                                    </div>
                                    <div className="text-[9px] text-slate-500 leading-snug font-medium mt-1">{item.sub}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3B: Open Community & Security Zoning (NIMBY 대응) */}
                    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm flex relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Users size={90} className="text-slate-800" /></div>
                        
                        <div className="w-6/12 relative z-10 pr-5 border-r border-slate-100">
                            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                                <span className="w-1.5 h-4 bg-orange-500 rounded-sm inline-block"></span>
                                열린 커뮤니티 & 방범 조닝 (Resident Open)
                            </h3>
                            <p className="text-[10px] text-slate-500 mb-3">지역상생과 보안(NIMBY 극복)을 동시 충족하는 100% 분리 네트워크</p>
                            
                            <div className="flex flex-col gap-2">
                                <div className="bg-slate-50 p-2 rounded border border-slate-100 border-l-2 border-l-orange-500 flex items-start gap-2">
                                    <Lock size={12} className="text-orange-500 shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-[10px] text-slate-800 font-bold mb-0.5">시간제 셔터 Security 통제망</div>
                                        <div className="text-[9px] text-slate-500 leading-tight">다목적실/도서관 야간 개방 시 학생 구역과 물리적 100% 차단벽 형성</div>
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-2 rounded border border-slate-100 border-l-2 border-l-orange-500 flex items-start gap-2">
                                    <Maximize2 size={12} className="text-orange-500 shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-[10px] text-slate-800 font-bold mb-0.5">방문객 분리형 독립 코어 (Core Separation)</div>
                                        <div className="text-[9px] text-slate-500 leading-tight">학생 동선과 교차 없는 외부 웰컴 스트리트 전용 EV/계단 진입로 확보</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Security Zone Diagram overlay */}
                        <div className="w-6/12 relative z-10 flex items-center justify-center pl-5">
                            <div className="w-full flex items-center justify-between bg-slate-50 border border-slate-200 p-3 rounded-lg shadow-sm relative overflow-hidden group">
                                {/* Small Visual Diagram Inside Box */}
                                <svg viewBox="0 0 100 50" className="absolute inset-0 w-full h-full opacity-10 group-hover:opacity-20 transition-opacity">
                                    <rect x="0" y="0" width="50" height="50" fill="#f59e0b" />
                                    <line x1="50" y1="0" x2="50" y2="50" stroke="#f97316" strokeWidth="4" />
                                    <rect x="52" y="0" width="48" height="50" fill="#ea580c" />
                                </svg>
                                <div className="relative z-10 text-center flex-1">
                                    <div className="text-[9px] text-orange-600 font-bold mb-0.5">학생 전용 구역</div>
                                    <div className="text-lg font-black text-slate-800">Zone A</div>
                                </div>
                                <div className="relative z-10 mx-2 bg-white p-1 rounded-full border border-orange-500 shadow-sm">
                                    <Lock size={12} className="text-orange-500" />
                                </div>
                                <div className="relative z-10 text-center flex-1">
                                    <div className="text-[9px] text-orange-600 font-bold mb-0.5">주민 개방 구역</div>
                                    <div className="text-lg font-black text-slate-800">Zone B</div>
                                </div>
                                <div className="absolute top-1 right-2 text-[8px] font-bold text-slate-400">Security: <span className="text-orange-600">100%</span></div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* ═══════════════ ZONE 4: Safety & Digital Evacuation (Col 1-6, Bottom 1) ═══════════════ */}
                <div className="col-span-12 lg:col-span-6 bg-white rounded-lg border border-red-100 shadow-sm overflow-hidden flex flex-col relative">
                    <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-red-500 absolute top-0 left-0" />
                    <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                                    <ShieldCheck size={16} className="text-red-500" /> 지능형 재난 대비 시스템 (Digital Twin Evacuation)
                                </h3>
                                <p className="text-[10px] text-slate-500 mt-0.5 ml-5 font-medium">IoT 센서망 기반 동적 피난 유도 및 골든타임 사수 메커니즘</p>
                            </div>
                        </div>

                        <div className="flex gap-4 flex-1">
                            {/* Graphic Side */}
                            <div className="w-[45%] bg-slate-50 border border-slate-200 rounded-lg p-2 relative flex flex-col items-center justify-center isolation-auto overflow-hidden">
                                <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-50 px-1 py-0.5 rounded border border-red-100 z-20">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping absolute"></span>
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full relative"></span>
                                    <span className="text-[7px] text-red-600 font-bold ml-0.5">FIRE ALARM MOCKUP</span>
                                </div>
                                <IoT_EvacuationDiagram />
                                <div className="absolute bottom-2 inset-x-2 text-center bg-white/80 backdrop-blur-sm border border-slate-200 py-1.5 rounded shadow-sm z-20">
                                    <span className="text-[8px] text-slate-500">최단 피난 동선 유도 알고리즘 가동</span>
                                    <div className="text-[10px] font-black text-orange-600 tracking-wider">Dynamic Routing 활성화</div>
                                </div>
                            </div>
                            
                            {/* Fact Cards */}
                            <div className="w-[55%] flex flex-col justify-center gap-2.5">
                                <div className="border border-slate-100 rounded p-2 flex items-start gap-3 hover:bg-slate-50 transition-colors bg-white">
                                    <div className="p-1.5 bg-red-50 text-red-600 rounded mt-0.5"><AlertOctagon size={14} /></div>
                                    <div>
                                        <h4 className="text-[11px] font-black text-slate-800 tracking-tight">3면 직통계단 & 승강식 피난기</h4>
                                        <p className="text-[9px] text-slate-500 mt-0.5 leading-tight">건물 3면 분산형 최단거리 대피망 구축 및 휠체어 전용 승강식 대피 설비 배치. (병목 현상 제로)</p>
                                    </div>
                                </div>
                                <div className="border border-slate-100 rounded p-2 flex items-start gap-3 hover:bg-orange-50 transition-colors border-l-2 border-l-orange-500 bg-orange-50/20">
                                    <div className="p-1.5 bg-orange-100 text-orange-600 rounded mt-0.5"><TargetIcon /></div>
                                    <div>
                                        <h4 className="text-[11px] font-black text-slate-800 tracking-tight">수평 옥외 피난데크 (층별 Patio) 확보</h4>
                                        <p className="text-[9px] text-slate-500 mt-0.5 leading-tight">즉각 하향 대피가 불가능한 중증 장애인을 위해, 외기에 면한 발코니 대피 데크를 조성하여 소방 구출 골든타임 보장.</p>
                                    </div>
                                </div>
                                <div className="border border-slate-100 rounded p-2 flex items-start gap-3 hover:bg-orange-50 transition-colors bg-white">
                                    <div className="p-1.5 bg-orange-50 text-orange-600 rounded mt-0.5"><Navigation size={14} /></div>
                                    <div>
                                        <h4 className="text-[11px] font-black text-slate-800 tracking-tight">IoT 연동 스마트 유도 & 특대형 66인승 EV</h4>
                                        <p className="text-[9px] text-slate-500 mt-0.5 leading-tight">발화점을 회피하는 동적 유도등 패널 제어 및 구급대형 휠체어 회전이 가능한 BF 최우수 66인승 코어.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══════════════ ZONE 5: Smart Facility & Med-Air (Col 7-12, Bottom 1) ═══════════════ */}
                <div className="col-span-12 lg:col-span-6 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col relative text-slate-600">
                    <div className="absolute inset-0 z-0 pointer-events-none opacity-20"><HVACFlowDiagram /></div>
                    
                    <div className="p-5 flex-1 flex flex-col relative z-10 w-full h-full">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                                    <Server size={16} className="text-orange-500" /> Digital Twin Facility Management
                                </h3>
                                <p className="text-[10px] text-slate-500 mt-0.5 ml-5 font-medium">IoT 기반 통합 관제 및 의료급 실내 공조망(HVAC) 제어</p>
                            </div>
                            <span className="bg-orange-50 text-orange-600 border border-orange-200 text-[9px] px-2 py-0.5 rounded shadow-sm font-black">24H MONITORING</span>
                        </div>

                        <div className="flex-1 flex gap-4 mt-2">
                            {/* Dashboard Simulation */}
                            <div className="w-[50%] bg-slate-50/80 border border-slate-200 rounded-lg p-3 flex flex-col shadow-sm backdrop-blur-sm">
                                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2">IAQ Sensor Dashboard</div>
                                <div className="grid grid-cols-2 gap-2 flex-1">
                                    {/* PM2.5 */}
                                    <div className="bg-white rounded p-1.5 flex flex-col items-center justify-center border border-slate-200 shadow-sm">
                                        <span className="text-[8px] text-slate-500">초미세먼지 (PM2.5)</span>
                                        <div className="text-lg font-black text-orange-600">8<span className="text-[8px] text-slate-500 ml-0.5 font-normal">㎍/㎥</span></div>
                                        <span className="text-[7px] text-orange-700 bg-orange-50 border border-orange-100 px-1 mt-1 rounded">Excellent</span>
                                    </div>
                                    {/* CO2 */}
                                    <div className="bg-white rounded p-1.5 flex flex-col items-center justify-center border border-slate-200 shadow-sm">
                                        <span className="text-[8px] text-slate-500">이산화탄소 (CO2)</span>
                                        <div className="text-lg font-black text-orange-600">420<span className="text-[8px] text-slate-500 ml-0.5 font-normal">ppm</span></div>
                                        <span className="text-[7px] text-orange-700 bg-orange-50 border border-orange-100 px-1 mt-1 rounded">Normal</span>
                                    </div>
                                </div>
                                <div className="mt-2 w-full h-10 border border-slate-200 bg-white rounded overflow-hidden relative shadow-sm">
                                    <svg viewBox="0 0 100 40" className="w-full h-full opacity-50" preserveAspectRatio="none">
                                        <path d="M 0 30 Q 10 20 20 30 T 40 30 T 60 25 T 80 15 T 100 20 L 100 40 L 0 40 Z" fill="rgba(249,115,22,0.2)"/>
                                        <path d="M 0 30 Q 10 20 20 30 T 40 30 T 60 25 T 80 15 T 100 20" fill="none" stroke="#f97316" strokeWidth="1"/>
                                    </svg>
                                    <div className="absolute top-1 left-1 text-[7px] text-slate-500">Air Flow Volume (72hr)</div>
                                </div>
                            </div>
                            
                            {/* Medical Tech Info */}
                            <div className="w-[50%] flex flex-col justify-center gap-3">
                                <div className="flex items-start gap-2 bg-white p-2 rounded shadow-sm border border-slate-100">
                                    <Fan size={14} className="text-orange-500 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-[11px] font-bold text-slate-800 leading-tight mb-1">병실 수준(Clean Room) 외기 도입</h4>
                                        <p className="text-[9px] text-slate-500">면역이 취약한 학생을 타겟팅하여 프리필터 + 헤파필터 패키지 유닛을 거친 100% 무균 공기 반입.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2 bg-white p-2 rounded shadow-sm border border-slate-100">
                                    <Activity size={14} className="text-orange-500 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-[11px] font-bold text-slate-800 leading-tight mb-1">지능형 수송 및 센싱 컨트롤</h4>
                                        <p className="text-[9px] text-slate-500">실내 인원 밀집도를 센서가 감지하여 자동으로 환기/UVC 살균량을 조절하는 능동형 컨트롤.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══════════════ ZONE 6: ECO & 30Y LCC Economics (Col 1-12, Bottom 2) ═══════════════ */}
                <div className="col-span-12 bg-white rounded-lg border border-slate-200 p-5 shadow-sm flex flex-col relative overflow-hidden">
                    <div className="flex items-center justify-between mx-1 mb-4 z-10 relative">
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                                <Landmark size={16} className="text-orange-600" /> BEMS 통합 에너지 자립 및 30년 LCC 경제성 분석
                            </h3>
                            <p className="text-[10px] text-slate-500 mt-0.5 font-medium ml-5">투자 회수 기간(ROI) 및 장기 유지보수 운영비(OPEX) 극적 절감 효과 증명</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-5 z-10 relative">
                        {/* ZEB Gauge Facts */}
                        <div className="w-full md:w-3/12 flex flex-col gap-3 justify-center items-center px-4 border-r border-slate-100">
                            <GaugeChart value={4} />
                            <div className="w-full bg-slate-50 border border-slate-100 p-2 rounded text-center">
                                <div className="text-[9px] text-slate-400 font-bold mb-0.5">연간 BIPV 일체형 신재생 충당률</div>
                                <div className="text-lg font-black text-amber-500">40<span className="text-[10px] text-slate-400 ml-0.5">%</span> ({bipvGen}kW/y)</div>
                            </div>
                        </div>
                        
                        {/* LCC Graph Section */}
                        <div className="w-full md:w-9/12 flex gap-4 pr-2">
                            <div className="flex-1 bg-slate-50 rounded-lg border border-slate-200 p-3 relative flex items-end shadow-inner h-[180px]">
                                <LCCChartDiagram />
                            </div>
                            <div className="w-[30%] flex flex-col gap-2 justify-center">
                                <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg shadow-sm">
                                    <div className="text-[10px] font-bold text-orange-800 mb-1">30년 누적 운영비(OPEX) 절감</div>
                                    <div className="text-2xl font-black text-orange-600 tracking-tighter">-{opexSavings}<span className="text-sm font-bold text-orange-500">%</span> <span className="text-[10px] text-slate-500 ml-1 tracking-normal hover:text-slate-700">(약 42억)</span></div>
                                    <p className="text-[8px] text-slate-500 mt-1 leading-tight">일반 건립 대비, BIPV 및 심야 전력 지열 혼합형 BEMS 통제로 장기 수선/공조비 급감.</p>
                                </div>
                                <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm">
                                    <div className="text-[10px] font-bold text-slate-600 mb-1">Crossover Point (손익분기점)</div>
                                    <div className="text-lg font-black text-orange-600 tracking-tighter">{LCCCrossover}<span className="text-xs font-bold text-slate-500 ml-1 tracking-normal">Years (초기투자 회수)</span></div>
                                    <p className="text-[8px] text-slate-500 mt-1 leading-tight">특화설계에 따른 시공비 상승분은 준공 후 약 {LCCCrossover}년 내 운영비 절감으로 전액 회수완료 확보.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* ═══════════════ ZONE 7: Tech Spec Compliance Seal (Fixed at bottom) ═══════════════ */}
            <div className="absolute bottom-6 left-6 right-6 bg-slate-800 text-slate-300 rounded-lg p-3.5 shadow-2xl border border-slate-700 flex items-center justify-between pointer-events-none z-50">
                <div className="flex items-center gap-2 pr-4 border-r border-slate-600">
                    <div className="bg-green-500/20 p-1.5 rounded-full border border-green-500/30">
                        <CheckCircle2 size={16} className="text-orange-400" />
                    </div>
                    <div>
                        <div className="text-[11px] font-black tracking-widest text-white leading-none mb-1">ARCHE TECH CERTIFIED</div>
                        <div className="text-[8px] text-slate-400 uppercase tracking-widest">Masterplan Compliance Spec</div>
                    </div>
                </div>
                <div className="flex-1 flex justify-evenly text-[10px] font-medium px-2">
                    <div className="flex flex-col items-center gap-0.5"><span className="text-orange-400 font-bold">10-Sim Tested</span><span>복도폭 3.3m 확보</span></div>
                    <div className="w-[1px] h-6 bg-slate-700"></div>
                    <div className="flex flex-col items-center gap-0.5"><span className="text-orange-400 font-bold">Ramp Spec</span><span>경사로 구배 1/18</span></div>
                    <div className="w-[1px] h-6 bg-slate-700"></div>
                    <div className="flex flex-col items-center gap-0.5"><span className="text-orange-400 font-bold">30Y LCC Opt.</span><span>ZEB 4등급 (신재생 40%)</span></div>
                    <div className="w-[1px] h-6 bg-slate-700"></div>
                    <div className="flex flex-col items-center gap-0.5"><span className="text-amber-400 font-bold">Digital Evac</span><span>특대 피난코어 및 데크</span></div>
                    <div className="w-[1px] h-6 bg-slate-700"></div>
                    <div className="flex flex-col items-center gap-0.5"><span className="text-orange-400 font-bold">Barrier Free 100</span><span>BF 최우수 등급 만족</span></div>
                </div>
            </div>
        </div>
    );
};

export default SpecialDesignPanel;

// ======================= Sub Components & SVGs =======================

const GlobePattern = () => (
    <svg width="250" height="250" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="none" stroke="#fff" strokeWidth="1" />
        <ellipse cx="50" cy="50" rx="20" ry="48" fill="none" stroke="#fff" strokeWidth="1" />
        <ellipse cx="50" cy="50" rx="48" ry="20" fill="none" stroke="#fff" strokeWidth="1" />
        <path d="M 2 50 L 98 50 M 50 2 L 50 98" fill="none" stroke="#fff" strokeWidth="0.5" strokeDasharray="2 2" />
    </svg>
);

const AxonometricDiagram = () => (
    <svg viewBox="0 0 300 150" className="w-[130%] h-[130%] transform translate-y-3 opacity-95 drop-shadow-lg scale-110">
        {/* Iso Grid Background */}
        <g stroke="#f1f5f9" strokeWidth="1" opacity="0.6">
            {[...Array(12)].map((_, i) => (
                <line key={`h${i}`} x1="-20" y1={i*15} x2="320" y2={i*15 + 120} />
            ))}
            {[...Array(12)].map((_, i) => (
                <line key={`v${i}`} x1="320" y1={i*15} x2="-20" y2={i*15 + 120} />
            ))}
        </g>
        {/* Base shadow */}
        <ellipse cx="150" cy="115" rx="85" ry="25" fill="#e2e8f0" />
        {/* Learning Loop Isometric Track */}
        <path d="M 115 75 C 40 40, 40 130, 115 105 C 145 95, 140 65, 155 55" fill="none" stroke="#fb923c" strokeWidth="8" opacity="0.25" />
        <path d="M 115 73 C 40 38, 40 128, 115 103 C 145 93, 140 63, 155 53" fill="none" stroke="#ea580c" strokeWidth="3" />
        <text x="50" y="50" fill="#9a3412" fontSize="9" fontWeight="bold">Play Street (2F)</text>
        {/* Hub Architecture (Center Cylinder) */}
        <path d="M 130 65 L 130 40 Q 150 45 170 40 L 170 65 Q 150 70 130 65" fill="#f8fafc" stroke="#64748b" />
        <ellipse cx="150" cy="40" rx="20" ry="6" fill="#ffffff" stroke="#64748b" />
        <circle cx="150" cy="40" r="3" fill="#f97316" />
        {/* Care Loop Isometric Track */}
        <path d="M 185 85 C 260 55, 260 145, 185 115 C 155 105, 160 75, 145 65" fill="none" stroke="#fcd34d" strokeWidth="8" opacity="0.25" />
        <path d="M 185 83 C 260 53, 260 143, 185 113 C 155 103, 160 73, 145 63" fill="none" stroke="#d97706" strokeWidth="3" />
        <text x="210" y="115" fill="#78350f" fontSize="9" fontWeight="bold">Care Street (3F)</text>
        {/* Job Street Upper Node */}
        <ellipse cx="150" cy="15" rx="18" ry="6" fill="#fffbeb" stroke="#d97706" strokeDasharray="3 2" />
        <path d="M 150 40 L 150 15" stroke="#94a3b8" strokeDasharray="2 2" strokeWidth="1.5" />
        <text x="175" y="18" fill="#d97706" fontSize="9" fontWeight="bold">Job Street (4F)</text>
    </svg>
);

const IoT_EvacuationDiagram = () => (
    <svg viewBox="0 0 100 100" className="w-[120%] h-[120%] drop-shadow-lg opacity-90 transform translate-y-1">
        {/* Background Grid */}
        <g stroke="#334155" strokeWidth="0.5" opacity="0.5">
            {[...Array(10)].map((_, i) => <line key={`ev-h${i}`} x1="0" y1={i*10} x2="100" y2={i*10} />)}
            {[...Array(10)].map((_, i) => <line key={`ev-v${i}`} x1={i*10} y1="0" x2={i*10} y2="100" />)}
        </g>
        
        {/* Core Block */}
        <path d="M 30 85 L 30 25 L 65 25 L 65 85 Z" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
        
        {/* Outer Decks */}
        <path d="M 65 35 L 85 35 L 85 45 L 65 45 Z" fill="#431407" stroke="#ea580c" strokeWidth="0.5" />
        <path d="M 65 65 L 85 65 L 85 75 L 65 75 Z" fill="#431407" stroke="#ea580c" strokeWidth="0.5" />
        
        {/* Fire source */}
        <circle cx="45" cy="55" r="4" fill="#ef4444" opacity="0.5">
            <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="45" cy="55" r="2" fill="#f87171" />
        
        {/* Dynamic Routing Lines */}
        {/* Path 1 avoiding fire */}
        <path d="M 40 40 L 40 30 L 60 30 L 60 40 L 75 40" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3 2" />
        <circle cx="75" cy="40" r="1.5" fill="#4ade80" />
        <path d="M 72 38 L 75 40 L 72 42" fill="none" stroke="#22c55e" strokeWidth="1.5"/>

        {/* Path 2 avoiding fire */}
        <path d="M 40 70 L 60 70 L 75 70" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3 2" />
        <circle cx="75" cy="70" r="1.5" fill="#4ade80" />
        <path d="M 72 68 L 75 70 L 72 72" fill="none" stroke="#22c55e" strokeWidth="1.5"/>

        {/* EV Core indicator */}
        <rect x="35" y="32" width="8" height="8" fill="#1e40af" stroke="#60a5fa" strokeWidth="0.5" />
        <text x="39" y="37" fill="#93c5fd" fontSize="3" fontWeight="bold" textAnchor="middle">66 EV</text>

        {/* Distance Line */}
        <line x1="39" y1="42" x2="65" y2="42" stroke="#38bdf8" strokeWidth="0.5" />
        <text x="52" y="45" fill="#38bdf8" fontSize="3" fontWeight="bold" textAnchor="middle">Shortest Path</text>

        <text x="75" y="48" fill="#fdba74" fontSize="4" fontWeight="bold" textAnchor="middle">Patio 1</text>
        <text x="75" y="78" fill="#fdba74" fontSize="4" fontWeight="bold" textAnchor="middle">Patio 2</text>
    </svg>
);

const GaugeChart = ({ value }: { value: number }) => (
    <div className="relative w-28 h-28 shrink-0">
        <svg className="w-full h-full transform -rotate-180" viewBox="0 0 100 100">
            <path d="M 15 50 A 35 35 0 0 1 85 50 A 35 35 0 0 1 15 50" fill="none" stroke="#e2e8f0" strokeWidth="12" strokeLinecap="round" />
            <path d="M 15 50 A 35 35 0 0 1 85 50" fill="none" stroke="#10b981" strokeWidth="12" strokeLinecap="round" strokeDasharray="110" strokeDashoffset="35" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
            <span className="text-[10px] font-bold text-orange-600 uppercase mb-0.5">ZEB Grade</span>
            <div className="text-3xl font-black text-slate-800 tracking-tighter">{value}<span className="text-sm font-bold text-slate-500 ml-0.5 tracking-normal">등급</span></div>
        </div>
    </div>
);

const LCCChartDiagram = () => (
    <svg viewBox="0 0 400 150" className="w-full h-full">
        {/* Grid */}
        <g stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3">
            <line x1="40" y1="20" x2="380" y2="20" />
            <line x1="40" y1="50" x2="380" y2="50" />
            <line x1="40" y1="80" x2="380" y2="80" />
            <line x1="40" y1="110" x2="380" y2="110" />
        </g>
        
        {/* Axes */}
        <line x1="40" y1="10" x2="40" y2="130" stroke="#94a3b8" strokeWidth="2" />
        <line x1="30" y1="110" x2="380" y2="110" stroke="#94a3b8" strokeWidth="2" />
        
        {/* Y-axis labels */}
        <text x="35" y="25" fill="#64748b" fontSize="10" textAnchor="end">Cost</text>
        <text x="35" y="85" fill="#64748b" fontSize="10" textAnchor="end">0</text>
        
        {/* X-axis labels */}
        <text x="40" y="125" fill="#64748b" fontSize="10" textAnchor="middle">0 YR</text>
        <text x="140" y="125" fill="#1d4ed8" fontSize="10" fontWeight="bold" textAnchor="middle">7.4 YR</text>
        <text x="360" y="125" fill="#64748b" fontSize="10" textAnchor="middle">30 YR</text>
        
        {/* Standard Design Curve (Red, high OPEX, lower CAPEX originally but goes up fast) */}
        <path d="M 40 95 Q 200 60 360 20" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" />
        <text x="365" y="25" fill="#ef4444" fontSize="10" fontWeight="bold">일반 설계</text>
        
        {/* Specialized Design Curve (high CAPEX initially, flat OPEX) */}
        <path d="M 40 60 Q 150 70 360 85" fill="none" stroke="#ea580c" strokeWidth="3" />
        <text x="365" y="88" fill="#ea580c" fontSize="10" fontWeight="bold">특화 설계 (ZEB)</text>

        {/* Intersection Point */}
        <circle cx="140" cy="70" r="4" fill="#f59e0b" />
        <line x1="140" y1="70" x2="140" y2="110" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
        <text x="140" y="60" fill="#d97706" fontSize="9" fontWeight="bold" textAnchor="middle">Crossover (초기투자비 회수)</text>

        {/* ROI Shaded Area (Profit) */}
        <path d="M 140 70 Q 250 80 360 85 L 360 20 Q 250 45 140 70 Z" fill="rgba(245,158,11,0.15)" />
        <text x="250" y="60" fill="#b45309" fontSize="12" fontWeight="black" textAnchor="middle">-35% OPEX 흑자 구간</text>
    </svg>
);

const HVACFlowDiagram = () => (
    <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
        <g stroke="#f97316" strokeWidth="1.5" fill="none">
            {/* Flow line starting from right (Outside Air) going left */}
            <path d="M 380 100 L 250 100" />
            <polygon points="260,95 250,100 260,105" fill="#fb923c" />
            <text x="320" y="90" fill="#fb923c" fontSize="10" strokeWidth="0">O.A (외기 도입)</text>

            {/* PRE-FILTER Block */}
            <rect x="200" y="75" width="50" height="50" stroke="#f59e0b" fill="rgba(245, 158, 11, 0.15)" strokeWidth="2" />
            <path d="M 210 75 L 210 125 M 225 75 L 225 125 M 240 75 L 240 125" stroke="#f59e0b" strokeDasharray="2" />
            <text x="205" y="140" fill="#f59e0b" fontSize="9" strokeWidth="0" fontWeight="bold">HEPA PRE-FILTER</text>

            <path d="M 200 100 L 150 100" />
            <polygon points="160,95 150,100 160,105" fill="#38bdf8" />

            {/* OHU & UVC Block */}
            <rect x="70" y="60" width="80" height="80" stroke="#a855f7" fill="rgba(168, 85, 247, 0.15)" strokeWidth="2" />
            <circle cx="110" cy="100" r="15" stroke="#c084fc" />
            <path d="M 110 85 L 110 115 M 95 100 L 125 100" />
            
            {/* UVC Lights inside AHU */}
            <line x1="80" y1="70" x2="80" y2="130" stroke="#f472b6" strokeWidth="4" opacity="0.7" />
            <line x1="90" y1="70" x2="90" y2="130" stroke="#f472b6" strokeWidth="4" opacity="0.7" />
            <text x="85" y="155" fill="#c084fc" fontSize="10" strokeWidth="0" fontWeight="bold">OHU + UVC SYSTEM</text>

            {/* Supply Air to Room */}
            <path d="M 70 100 L -10 100" />
            <polygon points="10,95 0,100 10,105" fill="#fb923c" />
            <text x="15" y="90" fill="#fb923c" fontSize="10" strokeWidth="0" fontWeight="bold">S.A (클린 의료급기)</text>
        </g>
    </svg>
);

const TargetIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="6"/>
        <circle cx="12" cy="12" r="2"/>
    </svg>
);
