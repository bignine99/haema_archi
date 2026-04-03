import React from 'react';
import { Zap, Plug, Lightbulb, Wifi, ShieldAlert, Cpu, BellRing, BatteryCharging } from 'lucide-react';

const ElectricalEngineeringPanel = () => {
    return (
        <div className="h-full flex flex-col p-6 bg-slate-50 overflow-y-auto custom-scrollbar font-sans relative">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6 shrink-0 z-10">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <Zap className="text-slate-600" fill="currentColor" size={24} />
                        건축 전기/통신 시스템 분석서
                    </h2>
                    <p className="text-slate-500 text-sm mt-1 font-medium">
                        안정성(UPS), 조명 피로도 저감 및 통합 보안 통신망 인프라 구축 명세서
                    </p>
                </div>
            </div>

            {/* Grid Content */}
            <div className="flex-1 grid grid-cols-12 gap-5 pb-24 relative">
                
                {/* ════════ 1. 수변전/비상전원 시스템 (Col 1-12) ════════ */}
                <div className="col-span-12 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row overflow-hidden relative">
                    {/* Left: Power Distribution */}
                    <div className="w-full md:w-7/12 p-6 border-r border-slate-100 flex flex-col justify-center">
                        <div className="text-[10px] font-bold tracking-widest text-slate-500 mb-2">POWER & DISTRIBUTION STRATEGY</div>
                        <h3 className="text-xl font-extrabold text-slate-800 mb-3">고효율 몰드 변압기 및 무정전/이중화 회선 구성</h3>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-medium mb-5 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            안정적 전력 공급을 위해 <span className="font-bold text-slate-800">22.9kV 고압 수전</span> 방식으로 인입하며, 의료·재활 장비 전원 품질 유지를 위해 
                            난연성이 우수한 <span className="font-bold text-amber-600">고효율 몰드 변압기 (알루미늄 3상)</span>를 적용합니다. 소방 및 특수재활 부하는 상시/비상 회선을 분리합니다.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <div className="border-l-4 border-amber-500 bg-white shadow-sm p-3 rounded-r-lg border-y border-r border-slate-100 flex flex-col justify-between">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-1.5"><Plug size={14} className="text-amber-500"/><span className="text-[10px] text-slate-500 font-bold">변압기 예상 용량</span></div>
                                    <span className="text-[8px] bg-slate-100 text-slate-500 px-1 py-0.5 rounded">여유율 20%</span>
                                </div>
                                <div>
                                    <div className="text-lg font-black text-slate-800">1,250<span className="text-[10px] font-normal ml-1 text-slate-500">kVA</span></div>
                                    <div className="text-[9px] text-amber-600 font-medium">조명/동력(800) + 비상/특수(450)</div>
                                </div>
                            </div>
                            <div className="border-l-4 border-orange-500 bg-white shadow-sm p-3 rounded-r-lg border-y border-r border-slate-100 flex flex-col justify-between">
                                <div className="flex items-center gap-1.5 mb-1.5"><BatteryCharging size={14} className="text-orange-500"/><span className="text-[10px] text-slate-500 font-bold">주요 전동기 기동 방식</span></div>
                                <div>
                                    <div className="text-sm font-black text-slate-800">인버터 (VVVF) 100%</div>
                                    <div className="text-[9px] text-slate-500 font-medium mt-1">EHP 공조 및 펌프류 부하 모터 연동</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: UPS & Generator Backup */}
                    <div className="w-full md:w-5/12 p-5 flex flex-col relative overflow-hidden bg-gradient-to-b from-amber-50/50 to-white">
                        <div className="absolute top-[-10%] right-[-5%] opacity-5 text-amber-600"><Zap fill="currentColor" size={150} /></div>
                        <div className="flex items-center gap-1.5 mb-4 relative z-10">
                            <BatteryCharging size={16} className="text-amber-500" />
                            <span className="text-[12px] font-bold text-slate-800">응급 의료·재활 장비 전용 무정전전원장치(UPS)</span>
                        </div>
                        <div className="flex-1 flex flex-col justify-center gap-4 relative z-10">
                            <div>
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-[10px] font-bold text-slate-700">UPS 백업 배터리 가용 시간</span>
                                    <span className="text-[10px] text-amber-600 font-bold">목표: 30분 초과 (발전기 가동 대기)</span>
                                </div>
                                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex relative shadow-inner border border-slate-200">
                                    <div className="bg-gradient-to-r from-amber-400 to-amber-500 h-full flex items-center justify-end pr-3" style={{width: '100%'}}>
                                        <span className="text-[9px] font-bold text-white shadow-sm">PASS</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-3 rounded shadow-sm border border-amber-100">
                                <div className="text-[10px] font-bold text-slate-500 mb-1.5 flex justify-between">
                                    <span>비상발전기(디젤) 부하 분배</span>
                                    <span className="text-orange-600">정전 후 40초 내 투입</span>
                                </div>
                                <div className="flex flex-col gap-1.5 text-[9px]">
                                    <div className="flex justify-between items-center bg-slate-50 p-1.5 rounded"><span className="text-slate-600 font-bold">소방(스프링클러/제연팬)</span> <span className="text-slate-800">1순위 투입</span></div>
                                    <div className="flex justify-between items-center bg-slate-50 p-1.5 rounded"><span className="text-slate-600 font-bold">재활 치료기기(생명유지)</span> <span className="text-slate-800">1순위 투입</span></div>
                                    <div className="flex justify-between items-center bg-slate-50 p-1.5 rounded"><span className="text-slate-600 font-bold">일반 비상조명 및 대피로</span> <span className="text-slate-800">2순위 투입</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ════════ 2. 시각 보호 조명 & 3. 통신/보안 (Col 1-12 / 2단 분할) ════════ */}
                <div className="col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-5">
                    
                    {/* Lighting & Dimming Control */}
                    <div className="bg-white rounded-xl border border-yellow-200/60 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-yellow-50 bg-gradient-to-r from-yellow-50 to-white flex items-center gap-1.5">
                            <Lightbulb size={16} className="text-yellow-500"/>
                            <span className="text-[12px] font-bold text-yellow-800">스마트 조명 퀄리티 및 디밍 제어</span>
                        </div>
                        <div className="p-5 flex-1 flex flex-col gap-4">
                            <div className="flex bg-slate-50 p-3 rounded-lg border border-slate-100 items-center justify-between">
                                <div>
                                    <div className="text-[9px] font-bold text-slate-500 mb-0.5">시각 장애 및 빛 민감성 학생 배려</div>
                                    <div className="text-[13px] font-black text-slate-800">Flicker-Free LED + 간접 조명화</div>
                                </div>
                                <div className="text-[10px] text-right text-slate-500 max-w-[130px]">
                                    경련/시각 스트레스 방지를 위한 직사 광원 노출 원천 차단
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-1">
                                <div className="border border-slate-100 rounded-lg p-3 text-center shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                                    <div className="text-[9px] font-bold text-slate-400 mb-2">교실/치료실 (조도)</div>
                                    <div className="text-xl font-bold text-slate-800 mb-0.5">500~750<span className="text-[11px] ml-1 text-slate-500 font-normal">lx</span></div>
                                    <div className="text-[8px] bg-yellow-100 text-yellow-700 px-1 py-0.5 rounded inline-block mt-1">DALI 네크워크 디밍 제어</div>
                                </div>
                                <div className="border border-slate-100 rounded-lg p-3 text-center shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                                    <div className="text-[9px] font-bold text-slate-400 mb-2">전력 밀도 (LPD 기준)</div>
                                    <div className="text-xl font-bold text-slate-800 mb-0.5">10.5<span className="text-[11px] ml-1 text-slate-500 font-normal">W/m²</span></div>
                                    <div className="text-[8px] bg-emerald-100 text-emerald-700 px-1 py-0.5 rounded inline-block mt-1">11.0 이하 에너지 고효율 기준 만족</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Telecom, Network & Security */}
                    <div className="bg-white rounded-xl border border-indigo-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-indigo-50 bg-gradient-to-r from-indigo-50 to-white flex items-center gap-1.5">
                            <Wifi size={16} className="text-indigo-600"/>
                            <span className="text-[12px] font-bold text-indigo-800">통합 통신/방범 및 생활 안전 통신망</span>
                        </div>
                        <div className="p-5 flex flex-col gap-3 flex-1 justify-center">
                            <div className="flex items-start gap-3 bg-indigo-50/40 p-2.5 rounded border border-indigo-100/50">
                                <div className="bg-indigo-100 text-indigo-600 p-1.5 rounded-full shrink-0 mt-0.5"><BellRing size={13}/></div>
                                <div>
                                    <div className="text-[11px] font-bold text-slate-700">배리어프리(BF) 비상 호출 핫라인</div>
                                    <div className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                                        장애인용 휠체어 화장실, 수중운동실 내부, 샤워실 곳곳에 방수형 비상 호출벨(양방향 음성) 설치 및 방재센터 다이렉트 푸시 연동.
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-slate-50 p-2.5 rounded border border-slate-100">
                                <div className="bg-slate-200 text-slate-600 p-1.5 rounded-full shrink-0 mt-0.5"><Wifi size={13}/></div>
                                <div>
                                    <div className="text-[11px] font-bold text-slate-700">사각지대 없는 무선망 및 스마트 CCTV</div>
                                    <div className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                                        교사 내 10Gbps 광케이블(백본) 인프라 위, 휠체어 전복 및 전도 사고 감지를 위한 지능형 2MP CCTV 사각지대 없이 배치.
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
                        <h3 className="text-sm font-extrabold text-slate-800">전기/통신 및 생활안전 보안 리스크 (Risk Mitigation)</h3>
                        <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded ml-2">치명적 요인 중점</span>
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
                                    <td className="px-3 py-2.5 font-bold text-slate-700">특수 재활기기 정전 시 인명 안전 위험</td>
                                    <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">상</span></td>
                                    <td className="px-3 py-2.5">치료실 중요 콘센트를 적색(비상)으로 분리 배선, UPS 및 비상발전기 최우선 1순위 계통 투입</td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-3 py-2.5 font-bold text-slate-700">강한 빛 깜빡임(Flicker)으로 인한 학생 발작 유발</td>
                                    <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">상</span></td>
                                    <td className="px-3 py-2.5">교실 및 공용구역 100% 플리커 프리 인증 LED 기구 사용 및 조도 균제도를 높이는 간접조명 루버 반영</td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-3 py-2.5 font-bold text-slate-700">전기 입상 샤프트(EPS) 면적 부족에 따른 유지보수 악화</td>
                                    <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">중</span></td>
                                    <td className="px-3 py-2.5">건축 동선 장애물 제거 과정에서 좁아진 EPS실의 대안으로 케이블 트레이 입면 입체설계 BIM 검토 수행</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ═══════════════ ENGINEERING METRICS SEAL ═══════════════ */}
            <div className="absolute bottom-6 left-6 right-6 bg-white rounded-lg p-3 shadow-lg border border-slate-200 flex items-center justify-between pointer-events-none z-50">
                <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
                    <div className="bg-yellow-500 text-white p-1.5 rounded-lg shadow-sm">
                        <Cpu size={16} />
                    </div>
                    <div>
                        <div className="text-[11px] font-black text-slate-800 leading-none mb-1">ELECTRICAL & DATA CORE</div>
                        <div className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Configuration Verified</div>
                    </div>
                </div>
                <div className="flex-1 flex justify-evenly text-[10px] font-medium px-2 text-center">
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">수전 전압</span><span className="text-slate-500 text-[9px]">22.9kV 특고압 인입</span></div>
                    <div className="w-[1px] h-6 bg-slate-200"></div>
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">비상 전원</span><span className="text-slate-500 text-[9px]">디젤 발전기 + UPS</span></div>
                    <div className="w-[1px] h-6 bg-slate-200"></div>
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">조도 제어</span><span className="text-slate-500 text-[9px]">디밍 제어(간접광)</span></div>
                    <div className="w-[1px] h-6 bg-slate-200"></div>
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">생활 안전망</span><span className="text-slate-500 text-[9px]">지능형 감지/호출벨</span></div>
                </div>
            </div>
        </div>
    );
};

export default ElectricalEngineeringPanel;
