import React from 'react';
import { Zap, Activity, Radio, Shield, Cpu, Lightbulb, CheckCircle2, BatteryCharging, Network, Sparkles } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { analyzeEngineeringDomain } from '@/services/geminiEngineeringService';
import { Loader2 } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   C-4  전기·통신 엔지니어링 분석 모듈
   SKILL: H1 PowerGrid · H2 SmartLight · H3 NetworkHub · H4 SafetyAlarm · H5 BEMS-Core
   Layout: 12-Column Cyber-Dashboard · Amber/Indigo/Purple CI
   ═══════════════════════════════════════════════════════════════ */

const ElectricalEngineeringPanel = () => {
    const store = useProjectStore();
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);

    // ─── AI 분석 데이터 참조 ───
    const aiData = store.engineeringAnalysisData['electrical'];
    const sd = aiData?.sectionData || {} as any;
    const isSpecialUse = store.buildingUse === '의료시설' || store.buildingUse === '교육연구시설';
    
    return (
        <div className="h-full flex flex-col bg-slate-50 overflow-y-auto custom-scrollbar font-sans relative pb-28">
            
            {/* ════════════ STICKY HEADER ════════════ */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-4 shrink-0 shadow-sm">
                <div className="max-w-[1600px] mx-auto flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Zap className="text-amber-500" size={22} fill="currentColor"/>
                            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
                                인공지능 전기·통신 엔지니어링 모듈
                            </h2>
                            <span className="ml-2 text-[9px] font-black tracking-widest bg-amber-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                                <Activity size={10} /> V3.0 AI SIMULATED
                            </span>
                        </div>
                        <p className="text-slate-500 text-[12px] font-medium">
                            ARCHE ARCHI · Phase C · 수변전 설계, DALI 조명 제어 및 스마트 통신·보안망
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px]">
                        <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 font-bold border border-slate-200">
                            특수 전력망: {isSpecialUse ? '2회선 수전 (Dual Feed)' : '일반 수전'}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                            예측 전력피크: {store.grossFloorArea ? Math.round(store.grossFloorArea * 0.08) : 0} kW
                        </span>
                        <button
                            onClick={async () => {
                                setIsAnalyzing(true);
                                try {
                                    const result = await analyzeEngineeringDomain({
                                        domain: 'electrical',
                                        domainNameKor: '전기/통신',
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
                                        store.setEngineeringData('electrical', result);
                                    } else {
                                        alert('전기 엔지니어링 분석 실패. 다시 시도해주세요.');
                                    }
                                } catch (e) {
                                    alert('오류가 발생했습니다.');
                                } finally {
                                    setIsAnalyzing(false);
                                }
                            }}
                            disabled={isAnalyzing}
                            className="ml-2 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-bold shadow-sm flex items-center gap-1 transition-colors"
                        >
                            {isAnalyzing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                            {isAnalyzing ? '분석 중...' : 'AI 전기·통신 분석'}
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
                            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-50 rounded-bl-full -z-10"></div>
                            <div className="text-[10px] font-black tracking-widest text-amber-600 mb-3">H-SERIES SKILL MODULES</div>
                            {[
                                { id: 'H1', name: 'PowerGrid', desc: '고압 수변전 (22.9kV) 및 발전', icon: <Zap size={14}/>, status: 'Active' },
                                { id: 'H2', name: 'SmartLight', desc: 'DALI 생체리듬 디밍(Dimming)', icon: <Lightbulb size={14}/>, status: isSpecialUse ? 'Special Mode' : 'Active' },
                                { id: 'H3', name: 'NetworkHub', desc: '10Gbps 백본 및 UPS 최적화', icon: <Network size={14}/>, status: 'Active' },
                                { id: 'H4', name: 'SafetyAlarm', desc: '재난 통신 및 방수 비상콜망', icon: <Radio size={14}/>, status: 'Active' },
                                { id: 'H5', name: 'BEMS-Core', desc: 'BACnet 수요반응(DR) 전력제어', icon: <Cpu size={14}/>, status: 'Active' },
                            ].map((mod, i) => (
                                <div key={i} className="flex items-center gap-2.5 py-2.5 border-b border-slate-50 last:border-b-0">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm">
                                        {mod.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[11px] font-black text-slate-800">{mod.id}</span>
                                            <span className="text-[10px] text-slate-600 font-bold truncate">{mod.name}</span>
                                        </div>
                                        <div className="text-[9px] text-slate-400 truncate">{mod.desc}</div>
                                    </div>
                                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full shrink-0 border ${mod.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-indigo-50 text-indigo-600 border-indigo-200'}`}>
                                        {mod.status}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* UPS & Generator Widget */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm border-t-4 border-t-indigo-500">
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2">
                                    <BatteryCharging size={14} className="text-indigo-500"/>
                                    <span className="text-[11px] font-extrabold text-slate-800">무정전 (UPS) 백업</span>
                                </div>
                                <span className="text-[9px] font-bold text-white bg-indigo-500 px-1.5 py-0.5 rounded">100% Load 기준</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <div className="w-12 h-12 relative flex items-center justify-center">
                                    <svg viewBox="0 0 36 36" className="w-full h-full">
                                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#6366f1" strokeWidth="3" strokeDasharray="80, 100" className="animate-[spin_3s_ease-in-out]" />
                                    </svg>
                                    <span className="absolute text-[9px] font-black text-indigo-600">30m</span>
                                </div>
                                <p className="text-[9px] text-slate-500 flex-1">주요 EPS(데이터망/소방기기 등) 안정 작동 보장. <strong className="text-indigo-600">비상발전기(디젤 72시간)</strong> 예비 확보.</p>
                            </div>
                        </div>
                    </div>

                    {/* ═══════ MAIN CONTENT AREA (Col 4-12) ═══════ */}
                    <div className="col-span-12 lg:col-span-9 flex flex-col gap-5">

                        {/* ─── SECTION 1: H1 수변전 단선결선도 (Single Line Diagram) ─── */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden relative border-l-4 border-l-amber-500">
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between z-10 bg-white">
                                <div className="flex items-center gap-1.5">
                                    <Zap size={16} className="text-amber-500" />
                                    <span className="text-[12px] font-extrabold text-slate-800">H1 · 수변전 (PowerGrid) 22.9kV 수전망 SLD 미니맵</span>
                                </div>
                                {isSpecialUse && <span className="text-[9px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-100 animate-pulse">2회선 수전(Dual Feed) 필수 적용</span>}
                            </div>
                            <div className="flex flex-col lg:flex-row gap-5 p-5 bg-gradient-to-br from-slate-50 to-white">
                                <div className="flex-1 flex justify-center items-center bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                                    <SingleLineDiagramSVG isSpecialUse={isSpecialUse}/>
                                </div>
                                <div className="w-full lg:w-1/3 flex flex-col justify-center gap-3">
                                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                                        <div className="text-[10px] font-bold text-amber-700 mb-1">TR (유입/몰드 변압기) 사용률</div>
                                        <div className="text-2xl font-black text-amber-600 mb-1">68.5<span className="text-xs text-amber-400 ml-0.5">%</span></div>
                                        <div className="w-full h-1.5 bg-amber-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-500 rounded-full" style={{width: '68.5%'}}></div>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-slate-600 p-2 leading-relaxed">
                                        산출된 용량 합계에서 <strong className="text-slate-800">안전 여유율(Safety Factor) 20%</strong> 할당 반영.<br/>소방 팬 및 피난 유도등은 <strong className="text-indigo-600">FR-CV/HFIX(내화)</strong> 연동. UTP Cat.6A와 이격거리 확보 완료.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ─── SECTION 2: H2 SmartLight & H5 BEMS ─── */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            
                            {/* H5 BEMS Area Chart */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <Cpu size={16} className="text-indigo-500" />
                                        <span className="text-[12px] font-extrabold text-slate-800">H5 · BEMS 전력 수요 반응 (DR)</span>
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col items-center">
                                    <BemsDemandChartSVG />
                                    <div className="mt-3 text-[10px] text-slate-500 font-medium bg-slate-50 p-2 rounded-lg w-full text-center border border-slate-100">
                                        14:00~16:00 <strong className="text-red-500">Peak Demand Limit</strong> 도달 임박 시<br/>공조기 인버터 자동 하향 BACnet 프로토콜 송출 시연.
                                    </div>
                                </div>
                            </div>

                            {/* H2 SmartLight DALI Gradient */}
                            <div className={`bg-white rounded-xl border shadow-sm flex flex-col overflow-hidden ${isSpecialUse ? 'border-indigo-400 ring-2 ring-indigo-100 scale-[1.02] transform transition-transform' : 'border-slate-200'}`}>
                                <div className="p-4 border-b border-slate-100 flex items-center gap-1.5 bg-white">
                                    <Lightbulb size={16} className="text-indigo-500" />
                                    <span className="text-[12px] font-extrabold text-slate-800">H2 · SmartLight 생체리듬 & 눈부심 방지 (DALI)</span>
                                </div>
                                <div className="p-5 flex flex-col gap-4">
                                    {isSpecialUse ? (
                                        <div className="bg-indigo-50 border border-indigo-100 p-2 text-[10px] text-indigo-700 font-bold rounded flex items-center gap-1.5 mb-2">
                                            <CheckCircle2 size={12}/> Flicker-Free 조명 및 특수 디밍 필수 구간 감지.
                                        </div>
                                    ) : (
                                        <div className="bg-slate-50 border border-slate-100 p-2 text-[10px] text-slate-600 font-medium rounded mb-2">
                                            일반 오피스 환경 LPD(조명 밀도) 11W/㎡ 준수.
                                        </div>
                                    )}
                                    
                                    <div>
                                        <div className="flex justify-between text-[9px] font-bold text-slate-400 mb-1">
                                            <span>아침 (집중 6000K)</span>
                                            <span>점심 (휴식 3000K)</span>
                                            <span>저녁 (따뜻한 2700K)</span>
                                        </div>
                                        <div className="h-4 w-full rounded-full bg-gradient-to-r from-blue-300 via-amber-200 to-orange-400 mb-1 shadow-inner border border-slate-200/50"></div>
                                        <p className="text-[10px] text-slate-500 text-center font-bold">DALI(Digital Addressable Lighting) 자동 색온도 변환</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ─── SECTION 3: 리스크 보드 (H4 SafetyAlarm) ─── */}
                        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                            <div className="flex items-center gap-1.5 mb-4">
                                <Shield size={16} className="text-slate-800" />
                                <h3 className="text-sm font-extrabold text-slate-800">전기·통신 특화 리스크 식별 / 보안 연동 조치사항</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-[11px] text-slate-600">
                                    <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
                                        <tr>
                                            <th className="px-3 py-2 rounded-tl-lg w-1/3">리스크 경고 안내</th>
                                            <th className="px-3 py-2 w-20 text-center">조치</th>
                                            <th className="px-3 py-2 rounded-tr-lg">설계 스마트 솔루션 내역</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {(Array.isArray(store.engineeringAnalysisData['electrical']?.riskBoard) ? store.engineeringAnalysisData['electrical'].riskBoard : [
                                            { risk: '발전기실 배기 소음 민원 가능성', impact: '중', prob: '상', solution: '지하/옥상 방음 갤러리 도어 및 머플러(소음기) 추가 반영 요청 (Acoustic 모듈 송신)' },
                                            { risk: '수중운동실 100% 방수형 콘센트 누락 우려', impact: '상', prob: '중', solution: 'IP68 등급 방수 콘센트 일괄 지정 및 비상호출벨 무선 연동 라인 이중화(H4 SafetyAlarm)' },
                                            { risk: '심적 불안 유도형 조명 설계 (눈부심/플리커)', impact: '하', prob: '중', solution: '직접 조명 최소화 (루버 채용) 및 생체리듬 친화형 간접 조명(Flicker-Free 인증)으로 승급' }
                                        ]).map((row: any, i: number) => (
                                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-3 py-2.5 font-bold text-slate-700">{row.risk}</td>
                                                <td className="px-3 py-2.5 text-center">
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${row.impact === '상' ? 'bg-red-100 text-red-700' : row.impact === '중' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{row.impact === '상' ? '치명적' : row.impact === '중' ? '비용증가' : '정상치'}</span>
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
                <div className="max-w-[1600px] mx-auto bg-gradient-to-r from-amber-600/90 to-indigo-900/95 backdrop-blur-md rounded-xl p-3.5 shadow-xl border border-indigo-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 pr-4 border-r border-indigo-700/50">
                        <div className="bg-white/10 text-amber-300 p-1.5 rounded-lg shadow-sm">
                            <Zap size={16} fill="currentColor"/>
                        </div>
                        <div>
                            <div className="text-[11px] font-black text-white leading-none mb-0.5">ELEC & TEL ENGINE</div>
                            <div className="text-[8px] text-amber-300 uppercase font-bold tracking-widest">Power Control · V3.0</div>
                        </div>
                    </div>
                    <div className="flex-1 flex justify-evenly text-[10px] font-medium px-3 text-center">
                        {(Array.isArray(store.engineeringAnalysisData['electrical']?.customMetrics) ? store.engineeringAnalysisData['electrical'].customMetrics : [
                            { label: 'TR 변압기 적재율', value: '안전 보장 (68.5%)' },
                            { label: 'BEMS 피크 컷', value: 'Inverter-Down Ready' },
                            { label: '네트워크 백본', value: '10Gbps 광케이블' },
                            { label: '조명 인증 레벨', value: 'DALI Flicker-Free' }
                        ]).slice(0, 4).map((stat: any, i: number) => (
                            <div key={i} className="flex flex-col">
                                <span className="text-indigo-200/80 text-[8px] uppercase tracking-wider mb-0.5 font-bold">{stat.label}</span>
                                <span className="text-white font-bold tracking-wide">{stat.value}</span>
                            </div>
                        ))}
                    </div>
                    <div className="pl-4 border-l border-indigo-700/50 flex items-center gap-2">
                        <div className="text-right">
                            <div className="text-[9px] text-indigo-300 font-bold uppercase mb-0.5">Matrix Link</div>
                            <div className="text-[11px] text-amber-400 font-black tracking-tight">FULLY ENERGIZED</div>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ring-4 ring-amber-400/20"></div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ElectricalEngineeringPanel;

// ======================= SVG Components =======================

const SingleLineDiagramSVG = ({isSpecialUse}: {isSpecialUse?: boolean}) => (
    <svg viewBox="0 0 200 100" className="w-[100%] h-auto max-w-[250px] drop-shadow-sm">
        <text x="0" y="10" fontSize="7" fill="#64748b" fontWeight="bold">22.9kV 수전</text>
        {isSpecialUse && <text x="35" y="10" fontSize="7" fill="#ef4444" fontWeight="bold">(Dual Feed 2회선)</text>}
        
        {/* Main Feed Line */}
        <polyline points="20,15 20,40" fill="none" stroke="#f59e0b" strokeWidth="2"/>
        {isSpecialUse && <polyline points="30,15 30,40" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2"/>}
        
        {/* VCB & TR */}
        <rect x="15" y="40" width="20" height="15" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" rx="1"/>
        <text x="17" y="50" fontSize="6" fill="#d97706" fontWeight="bold">VCB</text>
        
        <polyline points="25,55 25,65" fill="none" stroke="#f59e0b" strokeWidth="1.5"/>
        <circle cx="25" cy="70" r="5" fill="none" stroke="#f59e0b" strokeWidth="1.5"/>
        <circle cx="25" cy="75" r="5" fill="none" stroke="#f59e0b" strokeWidth="1.5"/>
        <text x="33" y="75" fontSize="6" fill="#64748b" fontWeight="bold">TR 1</text>
        
        {/* Generator Branch */}
        <polyline points="25,25 90,25 90,40" fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3"/>
        <circle cx="90" cy="45" r="6" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5"/>
        <text x="87" y="47" fontSize="6" fill="#64748b" fontWeight="bold">G</text>
        <text x="100" y="47" fontSize="6" fill="#64748b" fontStyle="italic">비상 자가발전기(ATS)</text>

        {/* LV Distribution */}
        <polyline points="25,80 25,90 120,90" fill="none" stroke="#6366f1" strokeWidth="2"/>
        <polyline points="90,51 90,90" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3"/>
        
        <rect x="130" y="85" width="25" height="10" fill="#e0e7ff" stroke="#6366f1" rx="1"/>
        <text x="133" y="93" fontSize="6" fill="#4f46e5" fontWeight="bold">LV BUS</text>
    </svg>
);

const BemsDemandChartSVG = () => (
    <div className="w-full h-full min-h-[140px] flex items-end pt-5 relative">
        <svg viewBox="0 0 300 120" className="w-full h-full overflow-visible">
            {/* Grid */}
            <g stroke="#f1f5f9" strokeWidth="1">
                {[20, 50, 80, 110].map(y => <line key={y} x1="0" y1={y} x2="300" y2={y} />)}
            </g>
            {/* Demand Limit Line */}
            <line x1="0" y1="30" x2="300" y2="30" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" />
            <rect x="235" y="22" width="65" height="14" rx="2" fill="#ef4444" />
            <text x="240" y="32" fontSize="8" fill="#fff" fontWeight="bold">Demand Limit</text>
            
            {/* Limit Warning Area (Peak Cut) */}
            <rect x="150" y="30" width="30" height="25" fill="#ef4444" fillOpacity="0.1" />

            {/* Area Chart Gradient */}
            <defs>
                <linearGradient id="purpleArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4"/>
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0"/>
                </linearGradient>
            </defs>
            
            {/* Data Curve */}
            <path d="M 0 110 L 30 100 C 60 90, 80 50, 100 60 C 120 70, 140 20, 165 35 C 190 50, 210 60, 240 70 L 300 90" fill="none" stroke="#6366f1" strokeWidth="2.5" />
            <path d="M 0 110 L 30 100 C 60 90, 80 50, 100 60 C 120 70, 140 20, 165 35 C 190 50, 210 60, 240 70 L 300 90 L 300 120 L 0 120 Z" fill="url(#purpleArea)" />
            
            {/* Data Points */}
            <circle cx="155" cy="27" r="4" fill="#fff" stroke="#ef4444" strokeWidth="2" className="animate-pulse" />
            <text x="140" y="15" fontSize="8" fill="#ef4444" fontWeight="bold">Inverter-Down</text>

            <circle cx="80" cy="50" r="3" fill="#fff" stroke="#6366f1" strokeWidth="2" />

            {/* X-axis */}
            <text x="10" y="130" fontSize="8" fill="#64748b">00:00</text>
            <text x="75" y="130" fontSize="8" fill="#64748b">08:00 (Start)</text>
            <text x="145" y="130" fontSize="8" fill="#ef4444" fontWeight="bold">15:00 (Peak)</text>
            <text x="280" y="130" fontSize="8" fill="#64748b">24:00</text>
        </svg>
    </div>
);
