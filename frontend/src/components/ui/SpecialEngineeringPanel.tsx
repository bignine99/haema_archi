import React from 'react';
import { Lightbulb, VolumeX, Cpu, Box, Layers, ShieldAlert, Waves, HeartPulse } from 'lucide-react';

const SpecialEngineeringPanel = () => {
    return (
        <div className="h-full flex flex-col p-6 bg-slate-50 overflow-y-auto custom-scrollbar font-sans relative">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6 shrink-0 z-10">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <Lightbulb className="text-slate-600" size={24} />
                        특수 엔지니어링: 음향·스마트빌딩·BIM
                    </h2>
                    <p className="text-slate-500 text-sm mt-1 font-medium">
                        재활 치료 공간 환경 제어, 첨단 공기질 관리, 3D 간섭(Clash) 검토 시뮬레이션 명세
                    </p>
                </div>
            </div>

            {/* Grid Content */}
            <div className="flex-1 grid grid-cols-12 gap-5 pb-24 relative">
                
                {/* ════════ 1. 실내 음향 및 차음 계획 (Col 1-12) ════════ */}
                <div className="col-span-12 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row overflow-hidden relative">
                    {/* Left: Acoustics Strategy */}
                    <div className="w-full md:w-7/12 p-6 border-r border-slate-100 flex flex-col justify-center">
                        <div className="text-[10px] font-bold tracking-widest text-slate-500 mb-2">ACOUSTIC & NOISE CONTROL</div>
                        <h3 className="text-xl font-extrabold text-slate-800 mb-3">심리 안정형 소음 제어 및 특수 공간 공간 음향</h3>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-medium mb-5 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            소음에 민감한 장애 학생들의 발작 및 정서 불안을 예방하기 위해 <span className="font-bold text-teal-700">고차음 외벽 및 이중 바닥 패드(Floating Floor)</span> 설계를 채택합니다.
                            체육관과 인접한 교실 간의 차음을 강화하고, 음악 치료실의 최적 잔향시간을 정밀하게 제어하여 치료 효과를 극대화합니다.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <div className="border-l-4 border-teal-500 bg-white shadow-sm p-3 rounded-r-lg border-y border-r border-slate-100 flex flex-col justify-between">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-1.5"><VolumeX size={14} className="text-teal-500"/><span className="text-[10px] text-slate-500 font-bold">음악 치료실 (RT60)</span></div>
                                    <span className="text-[8px] bg-slate-100 text-slate-500 px-1 py-0.5 rounded">최적 잔향치 범위</span>
                                </div>
                                <div>
                                    <div className="text-lg font-black text-slate-800">0.5 ~ 0.8<span className="text-[10px] font-normal ml-1 text-slate-500">초 (sec)</span></div>
                                    <div className="text-[9px] text-teal-600 font-medium">유리면 다공질 흡음 패널 + 디퓨저</div>
                                </div>
                            </div>
                            <div className="border-l-4 border-violet-500 bg-white shadow-sm p-3 rounded-r-lg border-y border-r border-slate-100 flex flex-col justify-between">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-1.5"><Waves size={14} className="text-violet-500"/><span className="text-[10px] text-slate-500 font-bold">인접 교실 차음 (STC)</span></div>
                                    <span className="text-[8px] bg-violet-50 text-violet-600 px-1 py-0.5 rounded border border-violet-100">충격음 50dB 이하</span>
                                </div>
                                <div>
                                    <div className="text-lg font-black text-slate-800">&gt; 50<span className="text-[10px] font-normal ml-1 text-slate-500">STC Rate</span></div>
                                    <div className="text-[9px] text-slate-500 font-medium tracking-tight">수중운동실 기계 소음 차단(슬리브)</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Acoustic Detail Section */}
                    <div className="w-full md:w-5/12 p-5 flex flex-col relative overflow-hidden bg-gradient-to-b from-teal-50/50 to-white">
                        <div className="absolute top-[-10%] right-[-5%] opacity-5 text-teal-800"><VolumeX fill="currentColor" size={150} /></div>
                        <div className="flex items-center gap-1.5 mb-3 relative z-10">
                            <Layers size={16} className="text-teal-600" />
                            <span className="text-[12px] font-bold text-slate-800">생활 공간 층간소음 제어 전략 (Floating Edge)</span>
                        </div>
                        <div className="flex-1 flex flex-col justify-center gap-2 relative z-10 text-[10px] text-slate-600">
                            <div className="bg-white p-2.5 rounded shadow-sm border border-teal-100 flex items-start gap-2">
                                <div className="bg-teal-100 text-teal-700 p-1 rounded font-bold w-5 h-5 flex items-center justify-center shrink-0">1</div>
                                <div><span className="font-bold text-slate-700">다목적 체육관 격리:</span> 상부 및 측면 틈새를 통해 진동이 벽으로 전이되는 것을 막는 방진재 댐핑 적용</div>
                            </div>
                            <div className="bg-white p-2.5 rounded shadow-sm border border-teal-100 flex items-start gap-2">
                                <div className="bg-teal-100 text-teal-700 p-1 rounded font-bold w-5 h-5 flex items-center justify-center shrink-0">2</div>
                                <div><span className="font-bold text-slate-700">기계장비 진동 차단:</span> 수중운동실 배수 펌프 하부에 고강도 방진 마운트 및 플렉시블 조인트 의무 반영</div>
                            </div>
                            <div className="bg-white p-2.5 rounded shadow-sm border border-teal-100 flex items-start gap-2">
                                <div className="bg-teal-100 text-teal-700 p-1 rounded font-bold w-5 h-5 flex items-center justify-center shrink-0">3</div>
                                <div><span className="font-bold text-slate-700">환기구(Duct) 소음 저감:</span> 챔버 박스 내측에 친환경 항균 유리섬유 마감을 통한 소음(급속 배기) 소거</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ════════ 2. 스마트 빌딩 & 3. BIM (Col 1-12 / 2단 분할) ════════ */}
                <div className="col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-5">
                    
                    {/* IBMS & Smart System */}
                    <div className="bg-white rounded-xl border border-sky-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-sky-50 bg-gradient-to-r from-sky-50 to-white flex items-center gap-1.5">
                            <HeartPulse size={16} className="text-sky-600"/>
                            <span className="text-[12px] font-bold text-sky-800">건강 모니터링 기반 스마트 빌딩 (IBMS)</span>
                        </div>
                        <div className="p-5 flex-1 flex flex-col gap-4">
                            <div className="flex bg-slate-50 p-3 rounded-lg border border-slate-100 items-center justify-between">
                                <div>
                                    <div className="text-[9px] font-bold text-slate-500 mb-0.5">호흡기·면역 민감 학생 보호 센서 연동</div>
                                    <div className="text-[13px] font-black text-slate-800">실내 공기질 실시간 자동 제어체계</div>
                                </div>
                                <div className="text-[10px] text-right text-slate-500 max-w-[130px]">
                                    CO₂, 미세먼지(PM2.5) 수치 초과 시 외기 도입 자동화
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-1">
                                <div className="border border-sky-100 bg-sky-50/30 rounded-lg p-3 relative overflow-hidden flex flex-col justify-center">
                                    <div className="text-[10px] font-bold text-slate-600 flex items-center gap-1 mb-1"><Cpu size={12}/> IoT 센서 포인트</div>
                                    <div className="text-[9px] text-slate-500 leading-tight">교실마다 온/습도, CO2 센서를 장착하여 재실 인원에 따른 외조기(OAHU) 풍량 비례 제어</div>
                                </div>
                                <div className="border border-emerald-100 bg-emerald-50/30 rounded-lg p-3 relative overflow-hidden flex flex-col justify-center">
                                    <div className="text-[10px] font-bold text-slate-600 flex items-center gap-1 mb-1"><ShieldAlert size={12}/> 감염병 확산 방지</div>
                                    <div className="text-[9px] text-slate-500 leading-tight">양·음압 공조 모드 전환 시스템. 전염병 유행 시 음압 격리실 수준의 개별 배기 전환</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Digital Engineering & BIM */}
                    <div className="bg-white rounded-xl border border-indigo-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-indigo-50 bg-gradient-to-r from-indigo-50 to-white flex items-center gap-1.5">
                            <Box size={16} className="text-indigo-600"/>
                            <span className="text-[12px] font-bold text-indigo-800">디지털 엔지니어링 및 3D BIM 최적화</span>
                        </div>
                        <div className="p-5 flex flex-col gap-3 flex-1 justify-center">
                            <div className="flex items-start gap-3 bg-indigo-50/40 p-2.5 rounded border border-indigo-100/50">
                                <div className="bg-indigo-100 text-indigo-600 p-1.5 rounded-full shrink-0 mt-0.5"><Layers size={13}/></div>
                                <div>
                                    <div className="text-[11px] font-bold text-slate-700">무장애 동선(BF) 간섭 (Clash) 검사 전용화</div>
                                    <div className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                                        휠체어 경사로(Ramp), 엘리베이터 승강장 상부의 덕트 및 케이블 트레이 등 입체적 간섭 요소를 Navisworks로 LOD 350 수준으로 사전 검출합니다.
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-slate-50 p-2.5 rounded border border-slate-100">
                                <div className="bg-slate-200 text-slate-600 p-1.5 rounded-full shrink-0 mt-0.5"><Box size={13}/></div>
                                <div>
                                    <div className="text-[11px] font-bold text-slate-700">디지털 트윈 운영 기초 데이터 세팅</div>
                                    <div className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                                        준공 시점 유지관리(FM) 단계로 데이터를 넘기기 위한 공간별 자산 속성(바닥 마감재 유형, 특수 펌프 보증 기간 등)을 파라메트릭하게 부여합니다.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ════════ 4. 리스크 및 이슈 관리 ════════ */}
                <div className="col-span-12 bg-white rounded-xl border border-slate-200 p-5 shadow-sm mt-1">
                    <div className="flex items-center gap-1.5 mb-4">
                        <ShieldAlert size={18} className="text-slate-700" />
                        <h3 className="text-sm font-extrabold text-slate-800">특수 엔지니어링 연장선 리스크 관제</h3>
                        <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded ml-2">우선 조치 필요</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px] text-slate-600">
                            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
                                <tr>
                                    <th className="px-3 py-2 rounded-tl-lg w-1/3">리스크/이슈 항목</th>
                                    <th className="px-3 py-2 w-20 text-center">영향도</th>
                                    <th className="px-3 py-2 rounded-tr-lg">설계 대책 / 저감 방안</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-3 py-2.5 font-bold text-slate-700">수중운동실 소음 증폭 및 울림 현상</td>
                                    <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">상</span></td>
                                    <td className="px-3 py-2.5">타일 등 단단한 반사면으로 인한 울림 통제를 위해 방습형 다공질 흡음 천장재 및 슬록 댐퍼 설계</td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-3 py-2.5 font-bold text-slate-700">BIM 층고(Clearance) 확보 설계 중 시공 오차</td>
                                    <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">중</span></td>
                                    <td className="px-3 py-2.5">BIM 모델 상 여유 고도 200mm 추가 확보 원칙 적용. 휠체어 전복 우려가 있는 층간 바닥 단차(Threshold) 완전 배제</td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-3 py-2.5 font-bold text-slate-700">IoT 센서 노후화 및 운영 주체 혼란</td>
                                    <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">중</span></td>
                                    <td className="px-3 py-2.5">표준 개방형 프로토콜(BACnet) 적용으로 호환성 구비 및 관리자용 대시보드(DDC 제어) 직관적 매뉴얼 정리</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ═══════════════ ENGINEERING METRICS SEAL ═══════════════ */}
            <div className="absolute bottom-6 left-6 right-6 bg-white rounded-lg p-3 shadow-lg border border-slate-200 flex items-center justify-between pointer-events-none z-50">
                <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
                    <div className="bg-teal-600 text-white p-1.5 rounded-lg shadow-sm">
                        <Cpu size={16} />
                    </div>
                    <div>
                        <div className="text-[11px] font-black text-slate-800 leading-none mb-1">SPECIAL ENG. & BIM</div>
                        <div className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Innovation Framework</div>
                    </div>
                </div>
                <div className="flex-1 flex justify-evenly text-[10px] font-medium px-2 text-center">
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">음향 제어</span><span className="text-slate-500 text-[9px]">RT60 0.5초 / STC 50+</span></div>
                    <div className="w-[1px] h-6 bg-slate-200"></div>
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">빌딩 제어</span><span className="text-slate-500 text-[9px]">미세먼지 연동 IBMS</span></div>
                    <div className="w-[1px] h-6 bg-slate-200"></div>
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">Clash 대상</span><span className="text-slate-500 text-[9px]">무장애 램프 간섭 제외</span></div>
                    <div className="w-[1px] h-6 bg-slate-200"></div>
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">디지털 에셋</span><span className="text-slate-500 text-[9px]">LOD 350 Asset</span></div>
                </div>
            </div>
        </div>
    );
};

export default SpecialEngineeringPanel;
