import React from 'react';
import { Zap, Sun, Navigation, Snowflake, ThermometerSun, ShieldAlert, Cpu, Award } from 'lucide-react';

const EnergyStrategyPanel = () => {
    return (
        <div className="h-full flex flex-col p-6 bg-slate-50 overflow-y-auto custom-scrollbar font-sans relative">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6 shrink-0 z-10">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <Zap className="text-amber-500" size={24} />
                        탄소중립 및 제로에너지(ZEB) 최적화 설계
                    </h2>
                    <p className="text-slate-500 text-sm mt-1 font-medium">
                        수중운동실 막대한 부하 상쇄 및 패시브 치유 열환경 구축 (ZEB 4등급 타겟)
                    </p>
                </div>
            </div>

            {/* Grid Content */}
            <div className="flex-1 grid grid-cols-12 gap-5 pb-24 relative">
                
                {/* ════════ 1. ZEB 및 신재생에너지 구축 (Col 1-12) ════════ */}
                <div className="col-span-12 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row overflow-hidden relative">
                    {/* Left: ZEB Target & PV */}
                    <div className="w-full md:w-7/12 p-6 border-r border-slate-100 flex flex-col justify-center">
                        <div className="text-[10px] font-bold tracking-widest text-slate-500 mb-2">ZERO ENERGY BUILDING (ZEB)</div>
                        <h3 className="text-xl font-extrabold text-slate-800 mb-3">연간 부하 검토 및 분산 발전 전략</h3>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-medium mb-5 bg-amber-50 p-3 rounded-lg border border-amber-100/50">
                            특수가온풀(수중운동실)의 상시 급탕 및 대공간 제습공조로 인해 공공청사 대비 <span className="font-bold text-amber-700">연간 냉난방 부하가 1.5배 이상 가중</span>됩니다. 이에 고효율 PV 옥상/루버설치 및 BEMS 고도화를 통해 에너지효율 1+++ 및 <span className="font-bold text-amber-700">ZEB 4등급(에너지 자립률 40% 이상)</span>을 방어합니다.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <div className="border border-indigo-100/50 bg-indigo-50/30 shadow-sm p-3 rounded-lg flex flex-col">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] text-indigo-800 font-bold flex items-center gap-1.5"><Award size={14} /> 목표 자립률</span>
                                    <span className="text-sm font-black text-indigo-700">42.5%</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1.5 overflow-hidden">
                                     <div className="bg-indigo-500 h-1.5 rounded-full" style={{width: '42.5%'}}></div>
                                </div>
                                <span className="text-[8px] text-slate-500 font-bold self-end">ZEB 4등급 Range (40~60%)</span>
                            </div>
                            <div className="border border-amber-100/50 bg-amber-50/30 shadow-sm p-3 rounded-lg flex flex-col justify-between">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] text-amber-800 font-bold flex items-center gap-1.5"><Sun size={14} /> PV + BIPV 발전</span>
                                </div>
                                <div className="flex items-baseline gap-1 mt-1">
                                     <span className="text-lg font-black text-amber-600">350</span><span className="text-[9px] font-bold text-slate-500">kWp</span>
                                </div>
                                <span className="text-[8px] text-slate-500 font-bold">효율 22% 양면발전 모듈 적용</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Geothermal HVAC for Pool */}
                    <div className="w-full md:w-5/12 p-6 flex flex-col relative overflow-hidden bg-emerald-50">
                        <div className="absolute top-4 right-4 opacity-10 text-emerald-600"><ThermometerSun fill="currentColor" size={100} /></div>
                        <div className="flex items-center gap-2 mb-3 relative z-10">
                            <ThermometerSun size={18} className="text-emerald-700" />
                            <h3 className="text-sm font-bold text-emerald-900">지열(GSHP) 기반 고효율 급탕·제습</h3>
                        </div>
                        <p className="text-[10px] text-emerald-800/80 mb-4 relative z-10 pr-4 leading-relaxed font-medium">
                            수중운동실 사계절 급탕온도 유지(수온 32~34도) 및 실내 항온항습 부하를 상쇄하기 위한 최고의 패키지. 지온 15도를 활용한 전전후 히트펌프 가동.
                        </p>
                        
                        <div className="space-y-2 mt-auto relative z-10">
                            <div className="bg-white/80 backdrop-blur border border-emerald-200/50 p-2 rounded flex justify-between items-center">
                                <span className="text-[10px] font-bold text-emerald-800">지열 시스템 성능비 (COP)</span>
                                <span className="text-[11px] font-black text-emerald-600">난방부하 COP 4.5+</span>
                            </div>
                            <div className="bg-white/80 backdrop-blur border border-emerald-200/50 p-2 rounded flex justify-between items-center">
                                <span className="text-[10px] font-bold text-emerald-800">지중 천공 (Borehole) 규모</span>
                                <span className="text-[11px] font-black text-emerald-600">150m 깊이 × 40공</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ════════ 2. 패시브(Passive) 및 기밀 최적화 (Col 1-12) ════════ */}
                <div className="col-span-12 bg-white rounded-xl border border-blue-100 shadow-sm p-6 overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Snowflake size={18} className="text-blue-500" />
                            <h3 className="text-sm font-extrabold text-slate-800">패시브 열환경 및 콜드드래프트(Cold Draft) 방어</h3>
                        </div>
                        <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-bold border border-indigo-100/50">바닥 친화형 온열 환경 목표</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 h-full">
                        <div className="flex flex-col h-full bg-slate-50 rounded border border-slate-100 p-3">
                            <div className="text-[10px] font-bold text-slate-700 mb-2 border-b border-slate-200 pb-1">기밀성능 목표 (Air Tightness)</div>
                            <div className="text-sm font-black text-blue-600 mb-1">ACH50 &lt; 1.5회</div>
                            <div className="text-[10px] text-slate-500 leading-snug">패시브하우스 수준의 기밀 적용. 틈새 바람 유입을 원천 차단하여 감기 등 호흡기 질환 리스크 배제.</div>
                        </div>
                        <div className="flex flex-col h-full bg-slate-50 rounded border border-slate-100 p-3">
                            <div className="text-[10px] font-bold text-slate-700 mb-2 border-b border-slate-200 pb-1">로이 삼중유리 전면 적용</div>
                            <div className="text-sm font-black text-blue-600 mb-1">U-Value &lt; 0.9 W/㎡K</div>
                            <div className="text-[10px] text-slate-500 leading-snug">가열된 복사열의 창호면 유실 차단. 결로 현상을 원천 방지하여 교실 창가 측 결로성 곰팡이 억제.</div>
                        </div>
                        <div className="flex flex-col h-full bg-slate-50 rounded border border-slate-100 p-3">
                            <div className="text-[10px] font-bold text-slate-700 mb-2 border-b border-slate-200 pb-1">바닥 복사냉난방 + 치환환기</div>
                            <div className="text-sm font-black text-blue-600 mb-1">PMV 쾌적도 (-0.5~+0.5)</div>
                            <div className="text-[10px] text-slate-500 leading-snug">직접 바람을 피하는 저풍속 바닥 공조를 병행, 바닥 활동이 많은 유치/초등부 학생들의 체온 유지 보장.</div>
                        </div>
                    </div>
                </div>

                {/* ════════ 3. 지열/태양광 시공 및 에너지 리스크 관리 ════════ */}
                <div className="col-span-12 bg-white rounded-xl border border-slate-200 p-5 shadow-sm mt-1">
                    <div className="flex items-center gap-1.5 mb-4">
                        <ShieldAlert size={18} className="text-slate-700" />
                        <h3 className="text-sm font-extrabold text-slate-800">인증 획득 및 신재생 설비 운용 리스크 식별</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px] text-slate-600">
                            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
                                <tr>
                                    <th className="px-3 py-2 rounded-tl-lg w-[38%]">에너지 시뮬레이션 및 현장 제약 (Risks)</th>
                                    <th className="px-3 py-2 w-20 text-center">심각도</th>
                                    <th className="px-3 py-2 rounded-tr-lg">엔지니어링 대응 방안 (Mitigation)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-3 py-2.5 font-bold text-slate-700">과다한 수중운동실 잠열 부하로 인한 ZEB 4등급 탈락</td>
                                    <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">크리티컬</span></td>
                                    <td className="px-3 py-2.5">고효율 열회수 환기장치(ERV 효율 80%↑)와 폐수열 회수기 설치 시뮬레이션 ECO2 필수 반영. 인버터 칠러 조기 반영.</td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-3 py-2.5 font-bold text-slate-700">지반조사 시 지하 심층부 단단한 암반층 조우에 의한 지열 편입 지연</td>
                                    <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">중</span></td>
                                    <td className="px-3 py-2.5">착공 직후 지열 천공 위치 탄성파 탐사 선진행. 암반 밀집구역 회피 및 천공 공법(T4, 에어해머) 장비 즉각 수배.</td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-3 py-2.5 font-bold text-slate-700">수직형 무광 태양광(BIPV) 대비 옥상 루버 PV 빛반사 민원</td>
                                    <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">하</span></td>
                                    <td className="px-3 py-2.5">인접 아파트 단지 측 고도각 시뮬레이션(Radiance) 후 Glare Zero 특수 코팅 반투명 모듈 적용 및 각도 수정.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ═══════════════ ENGINEERING METRICS SEAL ═══════════════ */}
            <div className="absolute bottom-6 left-6 right-6 bg-white rounded-lg p-3 shadow-lg border border-slate-200 flex items-center justify-between pointer-events-none z-50">
                <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
                    <div className="bg-slate-800 text-amber-400 p-1.5 rounded-lg shadow-sm">
                        <Cpu size={16} />
                    </div>
                    <div>
                        <div className="text-[11px] font-black text-slate-800 leading-none mb-1">ENERGY OPTIMIZATION</div>
                        <div className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Zero Energy Targets</div>
                    </div>
                </div>
                <div className="flex-1 flex justify-evenly text-[10px] font-medium px-2 text-center">
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">ZEB 달성률</span><span className="text-indigo-600 text-[9px] font-black">42.5% (4등급)</span></div>
                    <div className="w-[1px] h-6 bg-slate-200"></div>
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">기밀 (ACH50)</span><span className="text-blue-600 text-[9px] font-black">&lt; 1.5 (패시브급)</span></div>
                    <div className="w-[1px] h-6 bg-slate-200"></div>
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">PV 설치</span><span className="text-amber-600 text-[9px] font-black">350kWp</span></div>
                    <div className="w-[1px] h-6 bg-slate-200"></div>
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">지열 COP</span><span className="text-emerald-600 text-[9px] font-black">4.5 이상 유지</span></div>
                </div>
            </div>
        </div>
    );
};

export default EnergyStrategyPanel;
