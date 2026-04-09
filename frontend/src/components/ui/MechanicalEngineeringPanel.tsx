import React from 'react';
import { Wind, Thermometer, ShieldAlert, Droplets, ArrowUpDown, Lightbulb, Sparkles, Navigation, CheckCircle2, Factory } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';

/* ═══════════════════════════════════════════════════════════════
   C-3  기계 설비·MEP 및 수직 이동 통제 시스템 분석 모듈
   SKILL: G1 HVAC-Optima · G2 ThermalCore · G3 AeroVent · G4 VT-Traffic
   Layout: 12-Column Cyber-Dashboard · Sky/Emerald/Blue CI
   ═══════════════════════════════════════════════════════════════ */

const MechanicalEngineeringPanel = () => {
    const store = useProjectStore();
    const isLargeBldg = (store.grossFloorArea && store.grossFloorArea > 30000) ? true : false;
    const isSpecialEdu = store.buildingUse === '교육연구시설' || store.buildingUse === '의료시설';
    
    return (
        <div className="h-full flex flex-col bg-slate-50 overflow-y-auto custom-scrollbar font-sans relative">
            
            {/* ════════════ STICKY HEADER ════════════ */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-4 shrink-0 shadow-sm">
                <div className="max-w-[1600px] mx-auto flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Wind className="text-sky-500" size={22} />
                            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
                                기계/수직이동 엔진 (AI MEP & VT)
                            </h2>
                            <span className="ml-2 text-[9px] font-black tracking-widest bg-sky-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                                <Sparkles size={10} /> V3.0 AI SIMULATED
                            </span>
                        </div>
                        <p className="text-slate-500 text-[12px] font-medium">
                            ARCHE ARCHI · Phase C · 공조, 열원, 소방, 엘리베이터 트래픽 통제망
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px]">
                        <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 font-bold">
                            건물 용도: {store.buildingUse || '기본'}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-sky-50 text-sky-700 font-bold border border-sky-200">
                            연면적: {store.grossFloorArea ? store.grossFloorArea.toLocaleString() : '미정'} ㎡
                        </span>
                    </div>
                </div>
            </div>

            {/* ════════════ MAIN GRID ════════════ */}
            <div className="flex-1 px-6 py-5">
                <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-5 pb-28">

                    {/* ═══════ SKILL ROADMAP SIDEBAR (Col 1-3) ═══════ */}
                    <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-sky-50 rounded-bl-full -z-10"></div>
                            <div className="text-[10px] font-black tracking-widest text-sky-600 mb-3">G-SERIES SKILL MODULES</div>
                            {[
                                { id: 'G1', name: 'HVAC-Optima', desc: '기류 및 공기조화 (125 W/m²)', icon: <Wind size={14}/>, status: 'Active' },
                                { id: 'G2', name: 'ThermalCore', desc: '열원/급탕 LCC 최적화 (60℃)', icon: <Thermometer size={14}/>, status: 'Active' },
                                { id: 'G3', name: 'AeroVent', desc: 'IAQ 및 제연 (40~60Pa)', icon: <ShieldAlert size={14}/>, status: 'Active' },
                                { id: 'G4', name: 'VT-Traffic', desc: '병목 트래픽 타임 (AWT)', icon: <ArrowUpDown size={14}/>, status: 'Active' },
                            ].map((mod, i) => (
                                <div key={i} className="flex items-center gap-2.5 py-2.5 border-b border-slate-50 last:border-b-0">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-br from-sky-400 to-blue-500 text-white shadow-sm">
                                        {mod.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[11px] font-black text-slate-800">{mod.id}</span>
                                            <span className="text-[10px] text-slate-600 font-bold truncate">{mod.name}</span>
                                        </div>
                                        <div className="text-[9px] text-slate-400 truncate">{mod.desc}</div>
                                    </div>
                                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full shrink-0 bg-emerald-50 text-emerald-600 border border-emerald-200">
                                        {mod.status}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* G2 ThermalCore Heat Source Mix */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm border-t-4 border-t-blue-500">
                            <div className="flex items-center gap-2 mb-3">
                                <Factory size={14} className="text-blue-500"/>
                                <span className="text-[11px] font-extrabold text-slate-800">G2 열원 파이프라인 (LCC)</span>
                            </div>
                            <div className="flex mb-2 h-4 rounded-full overflow-hidden bg-slate-100">
                                {isLargeBldg ? (
                                    <>
                                        <div className="bg-blue-500 h-full" style={{width: '70%'}} title="지열/흡수식 (70%)"></div>
                                        <div className="bg-sky-300 h-full" style={{width: '30%'}} title="터보냉동/보일러 (30%)"></div>
                                    </>
                                ) : (
                                    <>
                                        <div className="bg-emerald-400 h-full" style={{width: '60%'}} title="EHP 멀티에어컨 (60%)"></div>
                                        <div className="bg-blue-400 h-full" style={{width: '40%'}} title="지열 히트펌프 (40%)"></div>
                                    </>
                                )}
                            </div>
                            <div className="flex justify-between text-[9px] font-bold text-slate-500 px-1">
                                <span>{isLargeBldg ? '중앙집중식 최적화' : '개별/공용 하이브리드'}</span>
                                <span className="text-blue-600">{isLargeBldg ? '70% GSHP' : '60% EHP'}</span>
                            </div>
                        </div>
                    </div>

                    {/* ═══════ MAIN CONTENT AREA (Col 4-12) ═══════ */}
                    <div className="col-span-12 lg:col-span-9 flex flex-col gap-5">

                        {/* ─── SECTION 1: G1 HVAC & G3 AeroVent ─── */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            
                            {/* G1 HVAC SVG */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden relative">
                                <div className="p-4 border-b border-slate-100 flex items-center justify-between z-10 bg-white">
                                    <div className="flex items-center gap-1.5">
                                        <Wind size={16} className="text-sky-500" />
                                        <span className="text-[12px] font-extrabold text-slate-800">G1 · HVAC-Optima 공조 루트</span>
                                    </div>
                                    <span className="text-[9px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">ERV 75% 환기율</span>
                                </div>
                                <div className="flex-1 p-4 bg-gradient-to-br from-slate-50 to-white flex items-center justify-center relative">
                                    <HvacDiagramSVG />
                                </div>
                                <div className="grid grid-cols-2 text-center text-[10px] bg-slate-50 border-t border-slate-100">
                                    <div className="p-2 border-r border-slate-100">
                                        <span className="block text-slate-400 mb-0.5 font-bold">냉난방 부하 (HVAC Load)</span>
                                        <span className="font-black text-slate-700">125 W/m² (10% 예비율)</span>
                                    </div>
                                    <div className="p-2 flex flex-col justify-center">
                                        <span className="block text-slate-400 mb-0.5 font-bold">특수 마감</span>
                                        <span className="font-black text-sky-600">{isSpecialEdu ? '헤파필터(HEPA) 적용' : '표준 필터'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* G3 AeroVent 방재/소방 */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                                <div className="p-4 border-b border-slate-100 flex items-center gap-1.5 bg-white">
                                    <ShieldAlert size={16} className="text-red-500" />
                                    <span className="text-[12px] font-extrabold text-slate-800">G3 · AeroVent 제연 및 배수</span>
                                </div>
                                <div className="p-5 flex flex-col gap-4">
                                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-bold text-slate-700">특별피난계단 부속실 급기가압</span>
                                            <span className="text-[9px] text-white bg-blue-500 px-1.5 py-0.5 rounded font-bold tracking-wider">40~60 Pa</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                            <div className="w-[50%] h-full bg-blue-500 rounded-full animate-pulse"></div>
                                        </div>
                                        <p className="text-[9px] text-slate-500 mt-2 font-medium">화재 발생 시 연기 유입을 차단하는 댐핑 구동 제연(Smoke Control) 루프 정상 작동 검증.</p>
                                    </div>

                                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-bold text-slate-700">지하 전기차(EV) 주차장 화재 방어</span>
                                            <span className="text-[9px] text-white bg-red-500 px-1.5 py-0.5 rounded font-bold">가동률 대기</span>
                                        </div>
                                        <p className="text-[9px] text-slate-500 font-medium">상단 강력 배기팬 연동 및 <strong className="text-red-600">포소화설비(Foam Water)</strong> 배치 완료. 열폭주 대비 전용 소화 구획 형성.</p>
                                    </div>
                                    
                                    {isSpecialEdu && (
                                        <div className="flex items-center gap-2 p-2 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-100 mt-1">
                                            <CheckCircle2 size={12}/> 무장애(BF) 화장실 층하배관 지그(Jig) 레이어 자동 삽입.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ─── SECTION 2: G4 VT-Traffic ─── */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row">
                            <div className="w-full lg:w-1/3 p-5 border-b lg:border-b-0 lg:border-r border-slate-100 bg-sky-50 flex flex-col justify-center text-center">
                                <ArrowUpDown size={24} className="text-sky-600 mx-auto mb-2" />
                                <h3 className="text-sm font-black text-slate-800 mb-1">G4 · VT-Traffic 분석</h3>
                                <p className="text-[10px] text-slate-500 font-bold mb-4">아침 출근 (Up-peak) 시뮬레이션</p>
                                
                                <div className="bg-white rounded-xl p-3 shadow-sm border border-sky-100 mb-2">
                                    <div className="text-[10px] text-slate-400 font-bold mb-1">AWT (평균 대기 시간)</div>
                                    <div className="text-[28px] font-black leading-none text-sky-600">24.5<span className="text-xs text-slate-400 font-bold ml-1">초</span></div>
                                </div>
                                <div className="text-[10px] font-bold text-emerald-600">
                                    목표치(30초) 이내 합격 PASS (HC5 14.2%)
                                </div>
                            </div>
                            <div className="w-full lg:w-2/3 p-5 outline-none flex items-center relative">
                                <TrafficGraphSVG />
                            </div>
                        </div>

                        {/* ─── SECTION 3: 리스크 보드 ─── */}
                        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                            <div className="flex items-center gap-1.5 mb-4">
                                <Lightbulb size={16} className="text-sky-600" />
                                <h3 className="text-sm font-extrabold text-slate-800">기계/소방/배관 리스크 제어망 (Mitigation)</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-[11px] text-slate-600">
                                    <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
                                        <tr>
                                            <th className="px-3 py-2 rounded-tl-lg w-1/3">탐지된 공조/배관 리스크</th>
                                            <th className="px-3 py-2 w-20 text-center">심각도</th>
                                            <th className="px-3 py-2 rounded-tr-lg">설계 보호 (Mitigation) 전략</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <tr className="hover:bg-slate-50 transition-colors">
                                            <td className="px-3 py-2.5 font-bold text-slate-700">목욕장/수중재활실 결로 및 염소(Cl) 가스 부식</td>
                                            <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">치명적</span></td>
                                            <td className="px-3 py-2.5">특수 에폭시(Epoxy) 코팅 필터 내염해성 공조기 채용. 실내 전용 독립 음압(-5Pa) 제어로 이종 공간 전이 차단.</td>
                                        </tr>
                                        <tr className="hover:bg-slate-50 transition-colors">
                                            <td className="px-3 py-2.5 font-bold text-slate-700">급수/급탕망 레지오넬라균 오염 가능성</td>
                                            <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">비용증가</span></td>
                                            <td className="px-3 py-2.5">부스터 펌프 시스템 수압 통제 및 지속적인 60℃ 급탕 시스템 순환 네트워크 구축.</td>
                                        </tr>
                                        <tr className="hover:bg-slate-50 transition-colors">
                                            <td className="px-3 py-2.5 font-bold text-slate-700">초고층화로 인한 승강로 연돌효과(Stack Effect)</td>
                                            <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold">정상치</span></td>
                                            <td className="px-3 py-2.5">회전문 부속실 가압 및 엘리베이터 도어 압력 해제(Airlock) 전실 반영.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* ════════════ ENGINEERING METRICS SEAL (Sticky Bottom) ════════════ */}
            <div className="sticky bottom-0 z-30 mx-6 mb-4">
                <div className="max-w-[1600px] mx-auto bg-gradient-to-r from-sky-950 to-slate-900 rounded-xl p-3.5 shadow-xl border border-sky-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 pr-4 border-r border-sky-800">
                        <div className="bg-sky-500 text-white p-1.5 rounded-lg shadow-sm">
                            <Wind size={16} />
                        </div>
                        <div>
                            <div className="text-[11px] font-black text-white leading-none mb-0.5">MEP & VT ENGINE</div>
                            <div className="text-[8px] text-sky-400 uppercase font-bold tracking-widest">Fluid Dynamics · V3.0</div>
                        </div>
                    </div>
                    <div className="flex-1 flex justify-evenly text-[10px] font-medium px-3 text-center">
                        {[
                            { label: '열원 최적화', value: 'GSHP / EHP 조합' },
                            { label: '환기 지수', value: 'ERV 75%↑' },
                            { label: '승강기 AWT', value: '24.5 초 (패스)' },
                            { label: '소방 제연', value: '40~60Pa 급기가압' }
                        ].map((stat, i) => (
                            <div key={i} className="flex flex-col">
                                <span className="text-slate-400 text-[8px] uppercase tracking-wider mb-0.5 font-bold">{stat.label}</span>
                                <span className="text-white font-bold">{stat.value}</span>
                            </div>
                        ))}
                    </div>
                    <div className="pl-4 border-l border-sky-800 flex items-center gap-2">
                        <div className="text-right">
                            <div className="text-[9px] text-slate-400 font-bold uppercase mb-0.5">Integration Status</div>
                            <div className="text-[11px] text-sky-400 font-black tracking-tight">100% OPERATIONAL</div>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse ring-4 ring-sky-400/20"></div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default MechanicalEngineeringPanel;

// ======================= Sub Components & SVGs (Sky/Blue CI) =======================

const HvacDiagramSVG = () => (
    <svg viewBox="0 0 160 120" className="w-[100%] h-auto max-w-[200px] drop-shadow-sm">
        {/* Exterior & Interior Box */}
        <rect x="20" y="20" width="40" height="80" rx="3" fill="#f8fafc" stroke="#bae6fd" strokeDasharray="3 2" />
        <text x="32" y="15" fontSize="7" fill="#0ea5e9" fontWeight="bold">EXTERIOR</text>
        
        <rect x="70" y="20" width="70" height="80" rx="3" fill="#fff" stroke="#e0f2fe"/>
        <text x="90" y="15" fontSize="7" fill="#0ea5e9" fontWeight="bold">INTERIOR ZONE</text>

        {/* Outdoor Unit */}
        <rect x="25" y="40" width="30" height="35" rx="2" fill="#e0f2fe" stroke="#0ea5e9"/>
        <circle cx="40" cy="57" r="10" fill="none" stroke="#0ea5e9" strokeDasharray="2 2" className="animate-[spin_4s_linear_infinite]" style={{ transformOrigin: '40px 57px'}} />
        <path d="M40 47 V67 M30 57 H50" stroke="#0ea5e9" strokeWidth="1.5" />
        <text x="31" y="85" fontSize="6" fill="#0284c7" fontWeight="bold">열원 (GSHP/EHP)</text>

        {/* Indoor Units */}
        <rect x="80" y="30" width="40" height="15" rx="1" fill="#f0f9ff" stroke="#38bdf8"/>
        <text x="92" y="40" fontSize="5" fill="#0369a1" fontWeight="bold">ERV / FCU</text>
        
        <rect x="80" y="60" width="40" height="15" rx="1" fill="#f0f9ff" stroke="#38bdf8"/>
        <text x="92" y="70" fontSize="5" fill="#0369a1" fontWeight="bold">ERV / FCU</text>

        {/* Piping Network */}
        <path d="M55 57 H65 V37 H80" fill="none" stroke="#0ea5e9" strokeWidth="1.5" />
        <path d="M65 57 V67 H80" fill="none" stroke="#0ea5e9" strokeWidth="1.5" />
        <circle cx="65" cy="57" r="2" fill="#0284c7" />
        
        <text x="75" y="105" fontSize="6" fill="#64748b" fontStyle="italic">* G1 공조 배관 Network</text>
    </svg>
);

const TrafficGraphSVG = () => (
    <div className="w-full h-full min-h-[140px] flex items-end pt-5 relative">
        <svg viewBox="0 0 300 120" className="w-full h-full overflow-visible">
            {/* Grid */}
            <g stroke="#f1f5f9" strokeWidth="1">
                {[20, 50, 80, 110].map(y => <line key={y} x1="0" y1={y} x2="300" y2={y} />)}
            </g>
            {/* Limit Line */}
            <line x1="0" y1="50" x2="300" y2="50" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 2" />
            <text x="260" y="45" fontSize="8" fill="#ef4444" fontWeight="bold">AWT Limit (30s)</text>
            
            {/* Area Chart Gradient */}
            <defs>
                <linearGradient id="blueArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0"/>
                </linearGradient>
            </defs>
            
            {/* Data Curve */}
            <path d="M 0 110 L 30 110 C 50 110, 60 40, 80 40 C 90 40, 100 80, 120 90 C 150 100, 160 55, 180 50 C 200 45, 210 100, 240 110 L 300 110" fill="none" stroke="#0ea5e9" strokeWidth="2.5" />
            <path d="M 0 110 L 30 110 C 50 110, 60 40, 80 40 C 90 40, 100 80, 120 90 C 150 100, 160 55, 180 50 C 200 45, 210 100, 240 110 L 300 110 L 300 120 L 0 120 Z" fill="url(#blueArea)" />
            
            {/* Data Points */}
            <circle cx="80" cy="40" r="4" fill="#fff" stroke="#0ea5e9" strokeWidth="2" />
            <circle cx="180" cy="50" r="4" fill="#fff" stroke="#0ea5e9" strokeWidth="2" />

            <text x="70" y="32" fontSize="9" fill="#0284c7" fontWeight="bold">08:30 Peak</text>
            <text x="170" y="42" fontSize="9" fill="#0284c7" fontWeight="bold">12:00 Lunch</text>

            {/* X-axis */}
            <text x="10" y="130" fontSize="8" fill="#64748b">08:00</text>
            <text x="140" y="130" fontSize="8" fill="#64748b">12:00</text>
            <text x="270" y="130" fontSize="8" fill="#64748b">18:00</text>
        </svg>
    </div>
);
