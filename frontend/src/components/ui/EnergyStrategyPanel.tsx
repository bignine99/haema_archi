import React from 'react';
import { Zap, Sun, ThermometerSun, ShieldAlert, Cpu, Snowflake, Wind, Activity, Sparkles, Navigation } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';

/* ═══════════════════════════════════════════════════════════════
   C-8 에너지 및 ZEB 최적화 모듈 (Energy Engineering)
   SKILL: L1 ZEB-Autopilot · L2 PassiveShield · L3 ActiveOptimizer · L4 RenewableMatrix · L5 AI-BEMS Control
   Layout: 12-Column Cyber-Dashboard · Amber/Indigo Theme · V3.0 AI Simulated
   ═══════════════════════════════════════════════════════════════ */

const EnergyStrategyPanel = () => {
    const store = useProjectStore();
    const isEducation = store.buildingUse === '교육연구시설';
    const isPublic = isEducation || store.buildingUse === '업무시설(오피스)';
    const hasPool = isEducation || store.buildingUse?.includes('교육') || store.projectName?.includes('학교'); // 수중시설/다목적 특화 영역 가정
    
    return (
        <div className="h-full flex flex-col bg-slate-50 overflow-y-auto custom-scrollbar font-sans relative">
            
            {/* ════════════ STICKY HEADER ════════════ */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-4 shrink-0">
                <div className="max-w-[1600px] mx-auto flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Zap className="text-amber-500" size={22} />
                            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
                                인공지능 신재생 및 ZEB(제로에너지) 시뮬레이션
                            </h2>
                            <span className="ml-2 text-[9px] font-black tracking-widest bg-amber-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                                <Sparkles size={10} /> V3.0 AI SIMULATED
                            </span>
                        </div>
                        <p className="text-slate-500 text-[12px] font-medium">
                            ARCHE ARCHI · Phase C. 엔지니어링 · 패시브/액티브 최적화 / 지열·태양광 믹스
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px]">
                        <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 font-bold">
                            건물 용도: {store.buildingUse || '기본'}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
                            특화 조건: {isPublic ? '공공 ZEB 의무화 (4등급 이상) 강제 연산' : '표준 에너지 절감'}
                        </span>
                    </div>
                </div>
            </div>

            {/* ════════════ MAIN GRID: 12-Column Cyber-Dashboard ════════════ */}
            <div className="flex-1 px-6 py-5">
                <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-5 pb-28">

                    {/* ═══════ SKILL ROADMAP SIDEBAR (Col 1-3) ═══════ */}
                    <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">

                        {/* L-Series SKILL Modules Status */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                            <div className="text-[10px] font-bold tracking-widest text-amber-600 mb-3">L-SERIES SKILL MODULES</div>
                            {[
                                { id: 'L1', name: 'ZEB-Autopilot', desc: '제로에너지 자립률 역산', icon: <Activity size={14}/>, status: 'Running' },
                                { id: 'L2', name: 'PassiveShield', desc: '초고단열 열교/기밀 차단', icon: <Snowflake size={14}/>, status: 'Running' },
                                { id: 'L3', name: 'ActiveOptimizer', desc: '액티브 설비(ERV) 최고효율', icon: <Wind size={14}/>, status: 'Running' },
                                { id: 'L4', name: 'RenewableMatrix', desc: '지열/PV 최적 믹스균형', icon: <Sun size={14}/>, status: 'Running' },
                                { id: 'L5', name: 'AI-BEMS Control', desc: '피크 수요 인공지능 제어', icon: <Cpu size={14}/>, status: 'Standby' },
                            ].map((mod, i) => (
                                <div key={i} className="flex items-center gap-2.5 py-2 border-b border-slate-50 last:border-b-0">
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${mod.status === 'Running' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                                        {mod.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] font-black text-slate-700">{mod.id}</span>
                                            <span className="text-[9px] text-slate-500 font-medium truncate">{mod.name}</span>
                                        </div>
                                        <div className="text-[9px] text-slate-400 truncate">{mod.desc}</div>
                                    </div>
                                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${mod.status === 'Running' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>
                                        {mod.status}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* 부하경고 및 특화 파라미터 */}
                        {hasPool && (
                            <div className="bg-white rounded-xl border border-rose-200 p-4 shadow-sm relative overflow-hidden">
                                <div className="flex items-center gap-1.5 mb-2 relative z-10">
                                    <ShieldAlert size={14} className="text-rose-600"/>
                                    <span className="text-[10px] font-bold text-slate-800">에너지 초과 부하 경고</span>
                                </div>
                                <div className="text-[9px] text-slate-600 leading-relaxed relative z-10">
                                    과업구성에 따른 특정 권장용도(예: 수중풀 등)로 인한 <span className="font-bold text-rose-600">상시 급탕 및 잠열(제습) 부하 폭증</span>이 발생할 수 있습니다. 지열(GSHP)과 고효율 ERV(전열교환기) L3 삭감 로직이 연동 테스트 중입니다.
                                </div>
                            </div>
                        )}

                    </div>

                    {/* ═══════ MAIN CONTENT AREA (Col 4-12) ═══════ */}
                    <div className="col-span-12 lg:col-span-9 flex flex-col gap-5">

                        {/* ─── SECTION 1: L1 ZEB Target & L4 Renewable Matrix ─── */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row">
                            
                            {/* L1 ZEB Autopilot */}
                            <div className="w-full lg:w-7/12 p-6 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col bg-white">
                                <div className="flex items-center gap-2 mb-2">
                                    <Activity size={16} className="text-amber-500" />
                                    <h3 className="text-[12px] font-extrabold text-slate-800 tracking-tight">L1 · ZEB-Autopilot 자립률</h3>
                                </div>
                                <p className="text-[11px] text-slate-600 leading-relaxed font-medium mb-5 bg-amber-50/30 p-3 rounded-lg border border-amber-50">
                                    {(isPublic && hasPool) ? "공공 의무 ZEB 4등급(자립률 40% 이상) 방어를 위해 막대한 급탕 부하를 상쇄할 총력 분산발전이 가동됩니다." : "건축물 총 에너지 소비량 대비 신재생 생산량을 역산하여 에너지 자립률 타겟팅을 수행합니다."}
                                </p>
                                
                                <div className="flex gap-4">
                                    <div className="border-l-4 border-amber-500 bg-slate-50 p-3 rounded-r-lg border-y border-r border-slate-100 flex-1 flex flex-col justify-center text-center">
                                        <div className="text-[9px] text-slate-500 font-bold mb-1">예측 에너지 자립률</div>
                                        <div className="text-3xl font-black text-amber-600 leading-none">42.5<span className="text-sm font-normal ml-0.5 text-slate-500">%</span></div>
                                        <div className="text-[9px] bg-amber-100 text-amber-800 mt-2 px-2 py-0.5 rounded-full font-bold self-center">ZEB 4등급 (40~60%)</div>
                                    </div>
                                    <div className="flex flex-col gap-2 flex-1 justify-center">
                                        <div className="bg-white p-2 rounded border border-slate-100 flex justify-between items-center shadow-sm">
                                            <span className="text-[9px] font-bold text-slate-600">요구 단위면적당 부하</span>
                                            <span className="text-[10px] font-black text-rose-600">145 kWh/㎡a</span>
                                        </div>
                                        <div className="bg-white p-2 rounded border border-slate-100 flex justify-between items-center shadow-sm">
                                            <span className="text-[9px] font-bold text-slate-600">신재생 단위 생산량</span>
                                            <span className="text-[10px] font-black text-indigo-600">62 kWh/㎡a</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* L4 Renewable Matrix */}
                            <div className="w-full lg:w-5/12 p-6 flex flex-col justify-center bg-gradient-to-br from-indigo-50/30 to-white relative overflow-hidden">
                                <div className="absolute top-4 right-4 opacity-5 text-indigo-500"><Sun fill="currentColor" size={100} /></div>
                                <div className="flex items-center gap-2 mb-3 relative z-10">
                                    <Sun size={16} className="text-indigo-500" />
                                    <h3 className="text-[12px] font-extrabold text-slate-800 tracking-tight">L4 · Renewable Matrix</h3>
                                </div>
                                <div className="flex flex-col gap-3 relative z-10">
                                    <div className="bg-white p-3 rounded-lg border border-indigo-100/50 shadow-sm">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] font-bold text-indigo-800 flex items-center gap-1.5"><Sun size={12}/> 태양광 (PV / BIPV)</span>
                                            <span className="text-[11px] font-black text-indigo-600">350 kWp</span>
                                        </div>
                                        <div className="text-[9px] text-slate-500">효율 22% 양면/단면 혼합 모듈. 옥상 및 남측면 수직 설치망</div>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg border border-indigo-100/50 shadow-sm">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] font-bold text-indigo-800 flex items-center gap-1.5"><ThermometerSun size={12}/> 지열 히트펌프 (GSHP)</span>
                                            <span className="text-[11px] font-black text-indigo-600">550 RT</span>
                                        </div>
                                        <div className="text-[9px] text-slate-500">지중 150m 수직 밀폐형 40공. 가온풀 급탕 및 복사냉난방 (COP 4.5)</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ─── SECTION 2: L2 Passive Shield & L3 Active Optimizer ─── */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Snowflake size={16} className="text-sky-500" />
                                    <h3 className="text-[12px] font-extrabold text-slate-800">L2 & L3 · 패시브/액티브 최적화 삭감 (Load Reduction)</h3>
                                </div>
                                <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">건축 전력통제 레이어</span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                                <div className="flex flex-col bg-slate-50/50 rounded border border-slate-100 p-4">
                                    <div className="text-[10px] font-bold text-slate-600 mb-2 pb-1 border-b border-slate-200">초고기밀 (Air Tightness)</div>
                                    <div className="text-sm font-black text-slate-800 mb-1.5">ACH50 <span className="text-sky-600">&lt; 1.0회</span></div>
                                    <div className="text-[9px] text-slate-500 leading-relaxed">
                                        패시브하우스급 기밀 방습 시공. 재실자의 호흡기 건강을 위한 Cold Draft(틈새풍)유입 원천 봉쇄.
                                    </div>
                                </div>
                                <div className="flex flex-col bg-slate-50/50 rounded border border-slate-100 p-4">
                                    <div className="text-[10px] font-bold text-slate-600 mb-2 pb-1 border-b border-slate-200">단열 & 로이(Low-E) 삼중유리</div>
                                    <div className="text-sm font-black text-slate-800 mb-1.5">U-Value <span className="text-sky-600">&lt; 0.9 W/㎡K</span></div>
                                    <div className="text-[9px] text-slate-500 leading-relaxed">
                                        복사열 유출방지 및 창가 측 결로(이슬맺힘) 차단. PF보드 및 진공단열재(VIP) 혼합 외단열 시스템.
                                    </div>
                                </div>
                                <div className="flex flex-col bg-slate-50/50 rounded border border-slate-100 p-4">
                                    <div className="text-[10px] font-bold text-slate-600 mb-2 pb-1 border-b border-slate-200">고효율 전열교환기 (ERV)</div>
                                    <div className="text-sm font-black text-slate-800 mb-1.5">열회수 효율 <span className="text-amber-600">80% 이상</span></div>
                                    <div className="text-[9px] text-slate-500 leading-relaxed">
                                        실내 온습도를 보존하며 외부 신선공기 도입. 버려지는 환기/잠열 부하의 8할을 회수하여 공조기(AHU) 부하 경감.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ─── SECTION 3: Energy Risk Board ─── */}
                        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                            <div className="flex items-center gap-1.5 mb-4">
                                <ShieldAlert size={16} className="text-slate-700" />
                                <h3 className="text-sm font-extrabold text-slate-800">에너지 공법/설비 리스크 식별</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-[11px] text-slate-600">
                                    <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
                                        <tr>
                                            <th className="px-3 py-2 rounded-tl-lg w-[38%]">운용 제약 사항 (Risks)</th>
                                            <th className="px-3 py-2 w-16 text-center">심각도</th>
                                            <th className="px-3 py-2 rounded-tr-lg">엔지니어링 대응 방안 (Mitigation)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <tr className="hover:bg-slate-50 transition-colors">
                                            <td className="px-3 py-2.5 font-bold text-slate-700">지열 천공 시 심층 지하수/연약·암반층에 의한 공기 지연</td>
                                            <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">크리티컬</span></td>
                                            <td className="px-3 py-2.5">공정표상 굴토 전 탄성파 탐사 선행. T4(에어해머) 장력 추가 장비 C-6 예비비(RiskHedge) 선배포.</td>
                                        </tr>
                                        <tr className="hover:bg-slate-50 transition-colors">
                                            <td className="px-3 py-2.5 font-bold text-slate-700">수중풀의 고도의 잠열 부하로 인한 여름철 급격한 ZEB 등급 강등</td>
                                            <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">중</span></td>
                                            <td className="px-3 py-2.5">폐수열 회수장치 의무 장착. 인버터형 지열 칠러(COP 급증가) 연계로 피크전력을 깎는 BEMS 가동.</td>
                                        </tr>
                                        <tr className="hover:bg-slate-50 transition-colors">
                                            <td className="px-3 py-2.5 font-bold text-slate-700">남측 입면 태양광(BIPV) 주변 건물 강한 빛 반사(Glare) 민원</td>
                                            <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded font-bold">하</span></td>
                                            <td className="px-3 py-2.5">표면 무반사/헤어라인 코팅(AG/AR) 패널 단가 상향(C-1). Radiance 돌발 시뮬레이션으로 각도 조율.</td>
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
                <div className="max-w-[1600px] mx-auto bg-gradient-to-b from-slate-900 to-slate-800 rounded-xl p-3.5 shadow-xl border border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 pr-4 border-r border-slate-600">
                        <div className="bg-amber-500 text-white p-1.5 rounded-lg shadow-sm">
                            <Zap size={16} />
                        </div>
                        <div>
                            <div className="text-[11px] font-black text-white leading-none mb-0.5">ENERGY OPTIMIZATION ENGINE</div>
                            <div className="text-[8px] text-slate-400 uppercase font-bold tracking-widest">ZEB Compliance · V3.0</div>
                        </div>
                    </div>
                    <div className="flex-1 flex justify-evenly text-[10px] font-medium px-3 text-center">
                        {[
                            { label: 'ZEB 달성률', value: '42.5% (4등급)' },
                            { label: '건물 기밀 (ACH50)', value: '< 1.0 (패시브급)' },
                            { label: 'PV / GSHP 믹스', value: '350kWp / 550RT' },
                            { label: '열회수 효율', value: 'ERV 80% 이상' },
                        ].map((m, i) => (
                            <React.Fragment key={i}>
                                {i > 0 && <div className="w-[1px] h-6 bg-slate-600"></div>}
                                <div className="flex flex-col items-center gap-0.5">
                                    <span className="text-white font-bold">{m.label}</span>
                                    <span className="text-slate-400 text-[9px]">{m.value}</span>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default EnergyStrategyPanel;
