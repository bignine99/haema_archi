import React from 'react';
import { Wrench, Thermometer, Wind, ShieldAlert, Cpu, Droplets, ArrowUpDown, Lightbulb } from 'lucide-react';

const MechanicalEngineeringPanel = () => {
    return (
        <div className="h-full flex flex-col p-6 bg-slate-50 overflow-y-auto custom-scrollbar font-sans relative">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6 shrink-0 z-10">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <Wrench className="text-slate-600" size={24} />
                        건축 기계 및 수직이동설비 분석서
                    </h2>
                    <p className="text-slate-500 text-sm mt-1 font-medium">
                        열원/공조/소방 시뮬레이션 및 배리어프리 탑승 교통량(VT) 분석 결과 (김해 특수학교 맞춤형)
                    </p>
                </div>
            </div>

            {/* Grid Content */}
            <div className="flex-1 grid grid-cols-12 gap-5 pb-24 relative">
                
                {/* ════════ 1. 공조/열원 및 특수 환기 (Col 1-12) ════════ */}
                <div className="col-span-12 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row overflow-hidden relative">
                    {/* Left: HVAC & Heat Source configs */}
                    <div className="w-full md:w-7/12 p-6 border-r border-slate-100 flex flex-col justify-center">
                        <div className="text-[10px] font-bold tracking-widest text-slate-500 mb-2">HVAC & ENERGY SOURCE STRATEGY</div>
                        <h3 className="text-xl font-extrabold text-slate-800 mb-3">개별 제어 최적화 및 지열 히트펌프 연계</h3>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-medium mb-5 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            교육시설의 특성을 고려하여, 각 교실 및 치료실의 독립적인 온도 제어가 가능한 
                            <span className="font-bold text-blue-600"> EHP(멀티에어컨) + 전열교환기(ERV)</span> 방식을 기본으로 채택합니다.
                            신재생에너지 의무비율 충족을 위해 공용부 및 대강당에는 <span className="font-bold text-emerald-600">지열 히트펌프(GSHP) 시스템</span>을 연계합니다.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <div className="border-l-4 border-blue-500 bg-white shadow-sm p-3 rounded-r-lg border-y border-r border-slate-100">
                                <div className="flex items-center gap-1.5 mb-1.5"><Thermometer size={14} className="text-blue-500"/><span className="text-[10px] text-slate-500 font-bold">냉난방 부하 (예상)</span></div>
                                <div className="text-sm font-black text-slate-800">125<span className="text-[10px] font-normal ml-0.5 text-slate-500">W/m² (피크시)</span></div>
                                <div className="text-[8px] text-slate-400 mt-0.5">단열 시뮬레이션 적용 후 -15% 저감</div>
                            </div>
                            <div className="border-l-4 border-emerald-500 bg-white shadow-sm p-3 rounded-r-lg border-y border-r border-slate-100">
                                <div className="flex items-center gap-1.5 mb-1.5"><Wind size={14} className="text-emerald-500"/><span className="text-[10px] text-slate-500 font-bold">법정 환기량 확보</span></div>
                                <div className="text-sm font-black text-slate-800">0.5<span className="text-[10px] font-normal ml-0.5 text-slate-500">회/h 이상</span></div>
                                <div className="text-[8px] text-emerald-600 mt-0.5">고효율 ERV(열교환 75%↑) 적용 PASS</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Special Zone Ventilation (Hydrotherapy) */}
                    <div className="w-full md:w-5/12 p-5 flex flex-col relative overflow-hidden bg-gradient-to-b from-blue-50/50 to-white">
                        <div className="absolute top-[-10%] right-[-5%] opacity-5 text-blue-800"><Droplets size={150} /></div>
                        <div className="flex items-center gap-1.5 mb-4 relative z-10">
                            <Droplets size={16} className="text-blue-600" />
                            <span className="text-[12px] font-bold text-slate-800">특수구역: 수중운동실 항온항습 계획</span>
                        </div>
                        <div className="flex-1 flex flex-col justify-center gap-4 relative z-10">
                            <div className="bg-white p-3 rounded shadow-sm border border-blue-100 flex items-center justify-between">
                                <span className="text-[11px] font-bold text-slate-700">목표 실내 조건</span>
                                <span className="text-[11px] font-black text-blue-700">온도 28~30℃ / 습도 50~60%</span>
                            </div>
                            <div className="bg-white p-3 rounded shadow-sm border border-blue-100">
                                <div className="text-[10px] font-bold text-slate-500 mb-2">결로 방지(Dehumidification) 솔루션</div>
                                <ul className="text-[10px] text-slate-600 space-y-1.5 list-disc pl-3">
                                    <li>수영장 전용 <span className="font-bold text-blue-600">제습형 공조기(Pool Dehumidifier)</span> 도입</li>
                                    <li>외주부 유리면 하단부 <span className="font-bold">결로방지용 취출구(Slot Diffuser)</span> 설계</li>
                                    <li>염소(Cl) 가스로 인한 장비 부식 방지 내염해 코팅 적용</li>
                                    <li>음압 유지 설계(-5Pa)로 인접 실내 습기 유출 완벽 차단</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ════════ 2. 수직이동설비 & 3. 위생/소방 (Col 1-12 / 2단 분할) ════════ */}
                <div className="col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-5">
                    
                    {/* Vertical Transportation */}
                    <div className="bg-white rounded-xl border border-indigo-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-indigo-50 bg-gradient-to-r from-indigo-50 to-white flex items-center gap-1.5">
                            <ArrowUpDown size={16} className="text-indigo-600"/>
                            <span className="text-[12px] font-bold text-indigo-800">수직 이동 설비 (VT Traffic Analysis)</span>
                        </div>
                        <div className="p-5 flex-1 flex flex-col gap-4">
                            <div className="flex bg-slate-50 p-3 rounded-lg border border-slate-100 items-center justify-between">
                                <div>
                                    <div className="text-[9px] font-bold text-slate-500 mb-0.5">장애인 및 침대용 규격 최적화</div>
                                    <div className="text-[13px] font-black text-slate-800">대형(24인승) EV 분산 집중 배치</div>
                                </div>
                                <div className="text-[10px] text-right text-slate-500 max-w-[120px]">
                                    휠체어 단체 층간 이동 및 응급 병상 이송 대처
                                </div>
                            </div>

                            <div className="space-y-3 mt-1">
                                <div>
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-[10px] font-bold text-slate-700">AWT (평균 대기 시간)</span>
                                        <span className="text-[10px] text-indigo-600 font-bold">24.5초 (목표: 30초 이하)</span>
                                    </div>
                                    <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex relative">
                                        <div className="bg-indigo-400 h-full" style={{width: '60%'}}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-[10px] font-bold text-slate-700">HC5 (5분간 수송능력)</span>
                                        <span className="text-[10px] text-emerald-600 font-bold">14.2% (목표: 12% 이상)</span>
                                    </div>
                                    <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex relative">
                                        <div className="bg-emerald-400 h-full" style={{width: '75%'}}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Plumbing & Fire */}
                    <div className="bg-white rounded-xl border border-rose-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-rose-50 bg-gradient-to-r from-rose-50 to-white flex items-center gap-1.5">
                            <ShieldAlert size={16} className="text-rose-600"/>
                            <span className="text-[12px] font-bold text-rose-800">소방/제연 설비 및 무장애(BF) 급배수</span>
                        </div>
                        <div className="p-5 flex flex-col gap-3 flex-1 justify-center">
                            <div className="flex items-start gap-2 bg-rose-50/50 p-2 rounded border border-rose-100">
                                <div className="bg-rose-100 text-rose-600 p-1.5 rounded shrink-0"><Wind size={14}/></div>
                                <div>
                                    <div className="text-[11px] font-bold text-slate-700">피난 안전 제연(Smoke Control) 시스템</div>
                                    <div className="text-[10px] text-slate-500 mt-1 leading-snug">거동불편 학생의 원활한 피난을 위해 특별피난계단 부속실 급기가압 방식을 채택하고 차압(40~60 Pa)을 안정적으로 유지합니다.</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 bg-blue-50/50 p-2 rounded border border-blue-100">
                                <div className="bg-blue-100 text-blue-600 p-1.5 rounded shrink-0"><Droplets size={14}/></div>
                                <div>
                                    <div className="text-[11px] font-bold text-slate-700">위생·배수(Plumbing) 특화</div>
                                    <div className="text-[10px] text-slate-500 mt-1 leading-snug">대규모 장애인용 화장실 설치 구역에 맞춰 여유있는 배관 PS(Pipe Shaft) 확보. 휠체어 회전 반경 하부에 배관 간섭이 없도록 층하배관 특수 지그 적용.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ════════ 4. 리스크 및 이슈 관리 ════════ */}
                <div className="col-span-12 bg-white rounded-xl border border-slate-200 p-5 shadow-sm mt-1">
                    <div className="flex items-center gap-1.5 mb-4">
                        <Lightbulb size={18} className="text-slate-700" />
                        <h3 className="text-sm font-extrabold text-slate-800">MEP 및 수직이동 리스크 관리 (Risk & Mitigation)</h3>
                        <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded ml-2">설계 최우선 검토</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px] text-slate-600">
                            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
                                <tr>
                                    <th className="px-3 py-2 rounded-tl-lg w-1/3">기계/이동설비 리스크 항목</th>
                                    <th className="px-3 py-2 w-20 text-center">영향도</th>
                                    <th className="px-3 py-2 rounded-tr-lg">설계 대책 / 저감 방안</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-3 py-2.5 font-bold text-slate-700">수중운동실 결로 침투 및 염소(Cl) 가동부식</td>
                                    <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">상</span></td>
                                    <td className="px-3 py-2.5">내염해성 제습공조기 풀 옵션(Epoxy coated fins) 적용, 공간 음압 설계로 복도 침투 차단</td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-3 py-2.5 font-bold text-slate-700">집중 시간대(등하교) 엘리베이터 정체 우려</td>
                                    <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">상</span></td>
                                    <td className="px-3 py-2.5">AI 군관리 운전 도입 및 와이드 오프닝(1,100mm) 타입의 관통형 엘리베이터 동선 확보</td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-3 py-2.5 font-bold text-slate-700">무장애 설계(BF)에 따른 천장 안 덕트 간섭</td>
                                    <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">중</span></td>
                                    <td className="px-3 py-2.5">통행 유효 층고 2.4m 최우선 확보 후 BIM 3D 간섭 체크를 통한 천장 내 스페이스 최적화</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ═══════════════ ENGINEERING METRICS SEAL ═══════════════ */}
            <div className="absolute bottom-6 left-6 right-6 bg-white rounded-lg p-3 shadow-lg border border-slate-200 flex items-center justify-between pointer-events-none z-50">
                <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
                    <div className="bg-sky-600 text-white p-1.5 rounded-lg shadow-sm">
                        <Cpu size={16} />
                    </div>
                    <div>
                        <div className="text-[11px] font-black text-slate-800 leading-none mb-1">MEP & VT SYSTEM</div>
                        <div className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Simulation Verified</div>
                    </div>
                </div>
                <div className="flex-1 flex justify-evenly text-[10px] font-medium px-2 text-center">
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">냉난방 방식</span><span className="text-slate-500 text-[9px]">EHP + 지열 히트펌프</span></div>
                    <div className="w-[1px] h-6 bg-slate-200"></div>
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">특수 공조</span><span className="text-slate-500 text-[9px]">제습형 공조기 (수영장)</span></div>
                    <div className="w-[1px] h-6 bg-slate-200"></div>
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">AWT 트래픽</span><span className="text-slate-500 text-[9px]">24.5초 (군관리)</span></div>
                    <div className="w-[1px] h-6 bg-slate-200"></div>
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">제연/피난</span><span className="text-slate-500 text-[9px]">급기가압 차압유지 확보</span></div>
                </div>
            </div>
        </div>
    );
};

export default MechanicalEngineeringPanel;
