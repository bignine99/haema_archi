import React from 'react';
import { Waves, Hexagon, Layers, ScanFace, Building2, ShieldAlert, Cpu, Network, Radar } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { analyzeEngineeringDomain } from '@/services/geminiEngineeringService';
import { Loader2, Sparkles } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   C-5  특수·디지털 융합 엔지니어링 분석 모듈
   SKILL: I1 Acoustic · I2 SmartIBMS · I3 BIM-Clash · I4 Parametric · I5 TwinSync
   Layout: 12-Column Cyber-Dashboard · Teal/Violet/Slate CI
   ═══════════════════════════════════════════════════════════════ */

const SpecialEngineeringPanel = () => {
    const store = useProjectStore();
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);

    // ─── AI 분석 데이터 참조 ───
    const aiData = store.engineeringAnalysisData['special'];
    const sd = aiData?.sectionData || {} as any;
    const isSpecialUse = store.buildingUse === '의료시설' || store.buildingUse === '교육연구시설';
    
    return (
        <div className="h-full flex flex-col bg-slate-50 overflow-y-auto custom-scrollbar font-sans relative pb-28">
            
            {/* ════════════ STICKY HEADER ════════════ */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-4 shrink-0 shadow-sm">
                <div className="max-w-[1600px] mx-auto flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Layers className="text-teal-500" size={22} />
                            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
                                디지털/특수 엔지니어링 융합 모듈
                            </h2>
                            <span className="ml-2 text-[9px] font-black tracking-widest bg-teal-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                                <ScanFace size={10} /> V3.0 AI SIMULATED
                            </span>
                        </div>
                        <p className="text-slate-500 text-[12px] font-medium">
                            ARCHE ARCHI · Phase C · 건축/설비 3D BIM 간섭 매트릭스 및 실내 음향 시뮬레이터
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px]">
                        <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 font-bold border border-slate-200">
                            타겟 LOD: Level 300 (기본설계)
                        </span>
                        <span className="px-2 py-1 rounded-full bg-violet-50 text-violet-700 font-bold border border-violet-200">
                            특화 모드: {isSpecialUse ? 'BF 및 소음 민감 대응' : '일반 표준'}
                        </span>
                        <button
                            onClick={async () => {
                                setIsAnalyzing(true);
                                try {
                                    const result = await analyzeEngineeringDomain({
                                        domain: 'special',
                                        domainNameKor: '스마트/특수',
                                        projectName: store.projectName,
                                        buildingUse: store.buildingUse,
                                        grossFloorArea: store.grossFloorArea,
                                        rawText: store.documentInfo?.rawData?.rawText || '',
                                        siteAnalysis: store.siteAnalysisResult,
                                        regulationAnalysis: store.regulationAnalysisResult,
                                        characteristicsAnalysis: store.characteristicsAnalysisResult,
                                        spaceStrategy: store.spaceStrategyResult,
                                    });
                                    if (result) {
                                        store.setEngineeringData('special', result);
                                    } else {
                                        alert('특수 엔지니어링 분석 실패. 다시 시도해주세요.');
                                    }
                                } catch (e) {
                                    alert('오류가 발생했습니다.');
                                } finally {
                                    setIsAnalyzing(false);
                                }
                            }}
                            disabled={isAnalyzing}
                            className="ml-2 px-3 py-1 bg-teal-500 hover:bg-teal-600 text-white rounded-full font-bold shadow-sm flex items-center gap-1 transition-colors"
                        >
                            {isAnalyzing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                            {isAnalyzing ? '분석 중...' : 'AI 디지털 시뮬레이션'}
                        </button>
                    </div>
                </div>
            </div>

            {/* ════════════ MAIN GRID ════════════ */}
            <div className="flex-1 px-6 py-5">
                <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-5">

                    {/* ═══════ SKILL ROADMAP SIDEBAR (Col 1-3) ═══════ */}
                    <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-teal-50 rounded-bl-full -z-10"></div>
                            <div className="text-[10px] font-black tracking-widest text-teal-600 mb-3">I-SERIES DIGITAL SKILLS</div>
                            {[
                                { id: 'I1', name: 'AcousticOptima', desc: '실내 잔향(RT60) 및 차음(STC)', icon: <Waves size={14}/>, status: 'Active' },
                                { id: 'I2', name: 'SmartIBMS', desc: 'IoT 센싱 (출퇴근/재난 모드)', icon: <Cpu size={14}/>, status: 'Active' },
                                { id: 'I3', name: 'BIM-Clash', desc: '구조/설비 다분야 간섭 탐지', icon: <Radar size={14}/>, status: 'Active' },
                                { id: 'I4', name: 'Parametric', desc: '외피 루버 파라메트릭 추론', icon: <Hexagon size={14}/>, status: 'Active' },
                                { id: 'I5', name: 'TwinSync', desc: 'LCC 기반 디지털 트윈 예행연습', icon: <Building2 size={14}/>, status: 'Active' },
                            ].map((mod, i) => (
                                <div key={i} className="flex items-center gap-2.5 py-2.5 border-b border-slate-50 last:border-b-0">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-br from-teal-400 to-violet-500 text-white shadow-sm">
                                        {mod.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[11px] font-black text-slate-800">{mod.id}</span>
                                            <span className="text-[10px] text-slate-600 font-bold truncate">{mod.name}</span>
                                        </div>
                                        <div className="text-[9px] text-slate-400 truncate">{mod.desc}</div>
                                    </div>
                                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full shrink-0 bg-violet-50 text-violet-600 border border-violet-200">
                                        {mod.status}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* IBMS Smart Building Mode Widget */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm border-t-4 border-t-violet-500 flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5">
                                    <Network size={14} className="text-violet-500"/>
                                    <span className="text-[11px] font-extrabold text-slate-800">I2 IBMS 시나리오 제어</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[9px] font-bold">
                                <div className="bg-slate-50 border border-slate-100 rounded flex flex-col p-2 text-center opacity-70">
                                    <span className="text-slate-400">보안 관제 (Night)</span>
                                    <span className="text-slate-600">Standby</span>
                                </div>
                                <div className="bg-violet-50 border border-violet-200 rounded flex flex-col p-2 text-center shadow-inner relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-full h-0.5 bg-violet-500 animate-pulse"></div>
                                    <span className="text-violet-600 text-[8px] uppercase tracking-wider mb-0.5">Active Mode</span>
                                    <span className="text-violet-800">피크타임 (집중)</span>
                                </div>
                            </div>
                            <p className="text-[9px] text-slate-500 leading-tight">
                                건물 내 PM2.5, 조도, 온도 센서 연동. 재실 인원 밀도 임계치 도달로 공조(CO2 배기) 능동 가동 중.
                            </p>
                        </div>
                    </div>

                    {/* ═══════ MAIN CONTENT AREA (Col 4-12) ═══════ */}
                    <div className="col-span-12 lg:col-span-9 flex flex-col gap-5">

                        {/* ─── SECTION 1: I1 AcousticOptima ─── */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row overflow-hidden relative border-l-4 border-l-teal-500">
                            <div className="w-full lg:w-4/12 p-5 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col justify-center">
                                <div className="flex items-center gap-1.5 mb-2">
                                    <Waves size={16} className="text-teal-500" />
                                    <span className="text-[12px] font-extrabold text-slate-800">I1 · RT60 공간 음향 (Acoustics)</span>
                                </div>
                                <p className="text-[10px] text-slate-500 font-medium mb-4">
                                    다목적 및 특수 목적실의 체적(Volume) 대비 마감재 흠음계수(α)를 파동 연산합니다. Sabine 공식을 차용.
                                </p>
                                
                                <div className="bg-teal-50 p-3 rounded-lg border border-teal-100 mb-2">
                                    <div className="text-[10px] font-bold text-teal-700 mb-1">STC (소음차단등급) / 경량충격음</div>
                                    <div className="text-lg font-black text-teal-600">50 이상 <span className="text-[10px] text-teal-500 ml-1">/ 58dB 이하 합격</span></div>
                                </div>
                                
                                {isSpecialUse && (
                                    <div className="flex items-start gap-1.5 bg-violet-50 p-2 rounded border border-violet-100 text-[9px]">
                                        <div className="bg-violet-200 text-violet-700 p-1 rounded shrink-0"><ShieldAlert size={10}/></div>
                                        <div className="text-violet-800 font-medium">수중운동실 및 음악치료실 특수 용도 감지. <strong className="font-bold">다공질 흡음 씰링</strong> 마감 예산 편성 자동 추가됨.</div>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 p-4 bg-gradient-to-br from-slate-50 to-white flex items-center justify-center relative">
                                <AcousticChartSVG />
                            </div>
                        </div>

                        {/* ─── SECTION 2: I3 BIM Clash & I4 Parametric ─── */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            
                            {/* I3 BIM Clash Radar */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                                <div className="p-4 border-b border-slate-100 flex items-center gap-1.5">
                                    <Radar size={16} className="text-slate-800" />
                                    <span className="text-[12px] font-extrabold text-slate-800">I3 · 다분야 BIM 간섭 매트릭스</span>
                                    <span className="ml-auto text-[9px] text-teal-600 bg-teal-50 font-bold px-2 py-0.5 rounded border border-teal-100">CDE 동기화</span>
                                </div>
                                <div className="p-4 flex flex-col md:flex-row gap-4 items-center">
                                    <div className="w-1/2 flex justify-center">
                                        <BimRadarSVG />
                                    </div>
                                    <div className="w-1/2 flex flex-col gap-2 w-full">
                                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-[10px] flex justify-between items-center">
                                            <span className="text-slate-600 font-bold">건축 ↔ 설비 (배관)</span>
                                            <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-black">2 Soft</span>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-[10px] flex justify-between items-center border-l-2 border-l-red-500">
                                            <span className="text-slate-600 font-bold">구조(보) ↔ 기계(덕트)</span>
                                            <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-black">1 Hard</span>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-[10px] flex justify-between items-center">
                                            <span className="text-slate-600 font-bold">BF 램프 ↔ 소화수도</span>
                                            <span className="bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded font-black">Clear</span>
                                        </div>
                                        <p className="text-[9px] text-slate-400 font-medium mt-1 leading-tight">Hard Clash 검출 구역 발생. 설계자 Alert 발송 준비 상태.</p>
                                    </div>
                                </div>
                            </div>

                            {/* I4 Parametric Facade */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                                <div className="p-4 border-b border-slate-100 flex items-center gap-1.5 bg-white">
                                    <Hexagon size={16} className="text-violet-500" />
                                    <span className="text-[12px] font-extrabold text-slate-800">I4 · 파라메트릭 외피 (Parametric)</span>
                                </div>
                                <div className="p-5 flex flex-col justify-center h-full gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 bg-slate-100 rounded-lg shrink-0 flex items-center justify-center p-2">
                                            <div className="grid grid-cols-2 gap-0.5 w-full h-full opacity-50 transform -skew-x-12">
                                                <div className="bg-violet-500 h-full"></div>
                                                <div className="bg-slate-400 h-full mt-1"></div>
                                                <div className="bg-slate-400 h-full mt-1"></div>
                                                <div className="bg-violet-500 h-full mt-2"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-[11px] font-bold text-slate-800 mb-1">GH(Grasshopper) 기반 일사량 최적화</h4>
                                            <p className="text-[10px] text-slate-500 leading-snug">
                                                남향 및 서향 파사드의 일사 열취득(SHGC)을 방어하기 위해 수직/수평 루버의 회전 각도를 딥러닝 추론하여 에너지 부하 사전 절감.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                                        <div className="bg-violet-500 h-full" style={{width: '85%'}}></div>
                                    </div>
                                    <div className="text-right text-[9px] text-violet-600 font-bold">SHGC 방어율 85% 달성</div>
                                </div>
                            </div>
                        </div>

                        {/* ─── SECTION 3: 리스크 보드 (I-Series Risk) ─── */}
                        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                            <div className="flex items-center gap-1.5 mb-4">
                                <ShieldAlert size={16} className="text-slate-800" />
                                <h3 className="text-sm font-extrabold text-slate-800">디지털 융합 & 특수 성능 리스크 보드 (Risk Horizon)</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-[11px] text-slate-600">
                                    <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
                                        <tr>
                                            <th className="px-3 py-2 rounded-tl-lg w-1/3">탐지된 첨단/특수 리스크</th>
                                            <th className="px-3 py-2 w-20 text-center">심각도</th>
                                            <th className="px-3 py-2 rounded-tr-lg">설계 대책 / 자동 조정안</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {(Array.isArray(store.engineeringAnalysisData['special']?.riskBoard) ? store.engineeringAnalysisData['special'].riskBoard : [
                                            { risk: '특수치료실 정밀기기 층간 소음 전이', impact: '상', prob: '상', solution: '바닥 플로팅 슬래브(Floating Slab) 및 제진 패드 설계 데이터 삽입. 기계실 경로 회피 맵핑.' },
                                            { risk: '다분야 BIM 좌표 부정합 (Clash)', impact: '중', prob: '상', solution: '공용 배관 루트 CDE 절대 좌표 기준 통합 (LOD 300 체계 강제 정렬 동기화 수행).' },
                                            { risk: 'IBMS 시스템 초기 도입(CAPEX) 예산 초과', impact: '하', prob: '상', solution: '유선 인프라를 최소화하고 Lora망/Zigbee 기반 무선 IoT 센서로 스위칭하여 공사비 12% Down 처리.' }
                                        ]).map((row: any, i: number) => (
                                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-3 py-2.5 font-bold text-slate-700">{row.risk}</td>
                                                <td className="px-3 py-2.5 text-center">
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${row.impact === '상' ? 'bg-red-100 text-red-700' : row.impact === '중' ? 'bg-amber-100 text-amber-700' : 'bg-teal-100 text-teal-700'}`}>{row.impact === '상' ? 'Hard' : row.impact === '중' ? '경고' : 'Soft'}</span>
                                                </td>
                                                <td className="px-3 py-2.5">{row.solution}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* ════════════ ENGINEERING METRICS SEAL (Sticky Bottom) ════════════ */}
            <div className="sticky bottom-0 z-30 mx-6">
                <div className="max-w-[1600px] mx-auto bg-gradient-to-r from-slate-900 via-teal-950 to-violet-950 rounded-xl p-3.5 shadow-xl border border-teal-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 pr-4 border-r border-teal-800/50">
                        <div className="bg-teal-500 text-white p-1.5 rounded-lg shadow-sm">
                            <Layers size={16} />
                        </div>
                        <div>
                            <div className="text-[11px] font-black text-white leading-none mb-0.5">SPECIAL & CDE ENGINE</div>
                            <div className="text-[8px] text-teal-400 uppercase font-bold tracking-widest">Digital Twin · V3.0</div>
                        </div>
                    </div>
                    <div className="flex-1 flex justify-evenly text-[10px] font-medium px-3 text-center">
                        {(Array.isArray(store.engineeringAnalysisData['special']?.customMetrics) ? store.engineeringAnalysisData['special'].customMetrics : [
                            { label: 'BIM 레벨', value: 'LOD 300 확정' },
                            { label: '음향/진동', value: 'RT60 1.2s 타겟' },
                            { label: '간섭 회피', value: 'Clash Radar On' },
                            { label: 'IBMS 연동', value: 'IoT Sensor 140ea' }
                        ]).slice(0, 4).map((stat: any, i: number) => (
                            <div key={i} className="flex flex-col">
                                <span className="text-violet-300/80 text-[8px] uppercase tracking-wider mb-0.5 font-bold">{stat.label}</span>
                                <span className="text-white font-bold">{stat.value}</span>
                            </div>
                        ))}
                    </div>
                    <div className="pl-4 border-l border-teal-800/50 flex items-center gap-2">
                        <div className="text-right">
                            <div className="text-[9px] text-teal-500 font-bold uppercase mb-0.5">Virtual Integrity</div>
                            <div className="text-[11px] text-violet-300 font-black tracking-tight">SYNCHRONIZED</div>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse ring-4 ring-violet-400/20"></div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default SpecialEngineeringPanel;

// ======================= SVG Components =======================

const AcousticChartSVG = () => (
    <svg viewBox="0 0 300 120" className="w-full h-full min-h-[140px] max-w-[400px]">
        {/* Background Grid */}
        <g stroke="#f1f5f9" strokeWidth="1">
            {[20, 50, 80, 110].map(y => <line key={y} x1="30" y1={y} x2="280" y2={y} />)}
            {[30, 80, 130, 180, 230, 280].map(x => <line key={x} x1={x} y1="20" x2={x} y2="110" />)}
        </g>
        
        {/* Legend */}
        <text x="35" y="15" fontSize="8" fill="#14b8a6" fontWeight="bold">기본 RT60 곡선</text>
        <line x1="85" y1="12" x2="105" y2="12" stroke="#14b8a6" strokeWidth="2"/>
        
        <text x="125" y="15" fontSize="8" fill="#8b5cf6" fontWeight="bold">최적화 후 RT 곡선 (-0.3s)</text>
        <line x1="205" y1="12" x2="225" y2="12" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="3 2"/>

        {/* Axis Labels */}
        <text x="5" y="65" fontSize="8" fill="#64748b" transform="rotate(-90 10,65)">잔향시간 (RT60 sec)</text>
        <text x="140" y="125" fontSize="8" fill="#64748b">Frequency (Hz)</text>

        {/* X Axis texts */}
        <g fontSize="7" fill="#94a3b8" textAnchor="middle">
            <text x="30" y="118">125</text>
            <text x="80" y="118">250</text>
            <text x="130" y="118">500</text>
            <text x="180" y="118">1k</text>
            <text x="230" y="118">2k</text>
            <text x="280" y="118">4k</text>
        </g>
        
        {/* Y Axis texts */}
        <g fontSize="7" fill="#94a3b8" textAnchor="end">
            <text x="25" y="112">0.0</text>
            <text x="25" y="82">1.0</text>
            <text x="25" y="52">2.0</text>
            <text x="25" y="22">3.0</text>
        </g>

        {/* Base Curve (Teal) */}
        <path d="M 30 40 C 80 50, 130 65, 180 75 C 230 85, 280 80, 280 80" fill="none" stroke="#14b8a6" strokeWidth="2" />
        {/* Optimized Curve (Violet) */}
        <path d="M 30 60 C 80 65, 130 80, 180 95 C 230 100, 280 95, 280 95" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4 2" />

        {/* Data Point Focus */}
        <circle cx="130" cy="80" r="3" fill="#8b5cf6" />
        <text x="130" y="70" fontSize="8" fill="#8b5cf6" fontWeight="bold" textAnchor="middle">Speech Freq.</text>
    </svg>
);

const BimRadarSVG = () => (
    <svg viewBox="0 0 100 100" className="w-[100%] h-auto max-w-[120px] drop-shadow-sm">
        {/* Background Radar Rings */}
        <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="1" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="#e2e8f0" strokeWidth="1" />
        <circle cx="50" cy="50" r="15" fill="none" stroke="#cbd5e1" strokeWidth="1" />
        
        {/* Core & Scan Line */}
        <circle cx="50" cy="50" r="3" fill="#64748b" />
        <path d="M50 50 L 50 5 A 45 45 0 0 1 95 50 Z" fill="#8b5cf6" fillOpacity="0.1" className="transform origin-[50px_50px] animate-[spin_4s_linear_infinite]"/>
        <line x1="50" y1="50" x2="50" y2="5" stroke="#8b5cf6" strokeWidth="1.5" className="transform origin-[50px_50px] animate-[spin_4s_linear_infinite]" />

        {/* Crosshair Line */}
        <line x1="50" y1="5" x2="50" y2="95" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="2 2" />
        <line x1="5" y1="50" x2="95" y2="50" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="2 2" />

        {/* Clash Dots */}
        {/* Soft Clash */}
        <circle cx="70" cy="30" r="3" fill="#f59e0b" className="animate-ping" style={{animationDuration: '2s'}}/>
        <circle cx="70" cy="30" r="2" fill="#f59e0b" />
        <circle cx="20" cy="60" r="3" fill="#f59e0b" className="animate-ping" style={{animationDuration: '2s', animationDelay: '0.5s'}}/>
        <circle cx="20" cy="60" r="2" fill="#f59e0b" />
        
        {/* Hard Clash */}
        <circle cx="65" cy="70" r="3" fill="#ef4444" className="animate-pulse" />
        <circle cx="65" cy="70" r="4" fill="none" stroke="#ef4444" strokeWidth="1" />
        <line x1="60" y1="65" x2="70" y2="75" stroke="#fff" strokeWidth="0.5"/>
        <line x1="60" y1="75" x2="70" y2="65" stroke="#fff" strokeWidth="0.5"/>

        <text x="50" y="98" fontSize="5" fill="#64748b" textAnchor="middle" fontWeight="bold">Clash Detected</text>
    </svg>
);
