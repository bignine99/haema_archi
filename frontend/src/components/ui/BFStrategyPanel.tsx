import React from 'react';
import { ShieldCheck, Users, Target, ArrowRightLeft, Move, BellRing, DoorOpen, ShieldAlert } from 'lucide-react';

const BFStrategyPanel = () => {
    return (
        <div className="h-full flex flex-col p-6 bg-slate-50 overflow-y-auto custom-scrollbar font-sans relative">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6 shrink-0 z-10">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <ShieldCheck className="text-indigo-600" size={24} />
                        유니버설 디자인 및 BF(장애물없는생활환경) 최우수 인증
                    </h2>
                    <p className="text-slate-500 text-sm mt-1 font-medium">
                        최우수 등급(90점 이상) 목표 의무화 및 특수학교 맞춤형 이동/인지/생활 무장애 생태계 구축
                    </p>
                </div>
            </div>

            {/* Grid Content */}
            <div className="flex-1 grid grid-cols-12 gap-5 pb-24 relative">
                
                {/* ════════ 1. 이동 동선 및 단차 제로화 (Col 1-12) ════════ */}
                <div className="col-span-12 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row overflow-hidden relative">
                    {/* Left: Ultra-Wide Corridor & 0mm Threshold */}
                    <div className="w-full md:w-7/12 p-6 border-r border-slate-100 flex flex-col justify-center">
                        <div className="text-[10px] font-bold tracking-widest text-slate-500 mb-2">MOBILITY & THRESHOLD-FREE CONTROL</div>
                        <h3 className="text-xl font-extrabold text-slate-800 mb-3">전동 휠체어 입체 교행 및 무단차(0mm) 환경</h3>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-medium mb-5 bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/30">
                            특수학교 학생 특성을 고려하여 법적 기준(복도폭 1.5m)을 대폭 상회하는 <span className="font-bold text-indigo-700">전 구간 폭 2.1m~3.0m 수퍼와이드 복도</span>를 확보합니다. 또한 공간 전이에 있어 <span className="font-bold text-rose-600">절대 단차 제로화(0mm)</span>를 선언하여 휠체어 전복 및 보행 걸림을 원천 봉쇄합니다.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <div className="border border-teal-100 bg-white shadow-sm p-3 rounded-xl flex flex-col">
                                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                                    <div className="bg-teal-50 p-1.5 rounded-lg text-teal-600"><ArrowRightLeft size={16} /></div>
                                    <span className="text-[11px] font-bold text-slate-700">휠체어 교행 유효 폭</span>
                                </div>
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-2xl font-black text-teal-600">2,100<span className="text-[10px] ml-0.5 text-slate-400 font-normal">mm</span></span>
                                    <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold">법정: 1,500</span>
                                </div>
                                <div className="text-[8px] text-slate-500 font-medium">전동휠체어 2대 교차 통과 및 도우미 동행 가능</div>
                            </div>
                            <div className="border border-rose-100 bg-white shadow-sm p-3 rounded-xl flex flex-col">
                                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                                    <div className="bg-rose-50 p-1.5 rounded-lg text-rose-600"><Move size={16} /></div>
                                    <span className="text-[11px] font-bold text-slate-700">공간 전이 하부 단차</span>
                                </div>
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-2xl font-black text-rose-600 tracking-tighter">ZERO<span className="text-[10px] ml-1 text-slate-400 font-normal">(0mm)</span></span>
                                    <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold">법정: 20mm 이하</span>
                                </div>
                                <div className="text-[8px] text-slate-500 font-medium">문틀/재료 분리대 등 걸림 유발 인자 삭제 구조</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: VT & Turning Radius */}
                    <div className="w-full md:w-5/12 p-6 flex flex-col relative overflow-hidden bg-slate-800 text-white">
                        <div className="absolute top-4 right-4 opacity-10 text-white"><Users fill="currentColor" size={120} /></div>
                        <div className="flex items-center gap-2 mb-3 relative z-10">
                            <Users size={18} className="text-teal-400" />
                            <h3 className="text-sm font-bold text-slate-100">특수 엘리베이터 및 BIM 회전 반경</h3>
                        </div>
                        <ul className="space-y-3 relative z-10 text-[10px] text-slate-300 mt-2 flex-1">
                            <li className="flex items-start gap-2 bg-slate-700/50 p-2.5 rounded border border-slate-600/50">
                                <div className="w-1.5 h-1.5 bg-teal-400 rounded-full mt-1 shrink-0"></div>
                                <div>
                                    <strong className="text-slate-100 block mb-0.5">24인승 침대/휄체어용 E/V 코어 배치</strong>
                                    스트레쳐카(환자용 침대) 및 전동 휠체어 복수 탑승이 가능한 1,600×2,300mm 메가 코어 기본 편제.
                                </div>
                            </li>
                            <li className="flex items-start gap-2 bg-slate-700/50 p-2.5 rounded border border-slate-600/50">
                                <div className="w-1.5 h-1.5 bg-teal-400 rounded-full mt-1 shrink-0"></div>
                                <div>
                                    <strong className="text-slate-100 block mb-0.5">수중운동실 탈의-입수 무장애 로직 (BIM 검증)</strong>
                                    샤워용 휠체어로 환승하는 데 필요한 지름 1.8m 이상의 회전 반경(Turning Circle) 전극 확보 여부 충돌 검사 완료.
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* ════════ 2. 정보 인지와 위생 설비 (Col 1-12) ════════ */}
                <div className="col-span-12 grid grid-cols-2 gap-5 mt-1">
                    {/* Alarms and Signage */}
                    <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-5 relative">
                        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2">
                                <BellRing size={16} className="text-blue-600" />
                                <h3 className="text-[12px] font-extrabold text-slate-800">다중 감각 정보 인지 네트워크</h3>
                            </div>
                            <span className="text-[9px] text-blue-600 font-black bg-blue-50 px-2 py-1 rounded">청각·시각장애 통합 연동</span>
                        </div>
                        <div className="space-y-3 text-[10px]">
                            <div className="flex items-center gap-3">
                                <span className="bg-blue-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-[9px] font-bold shrink-0">1</span>
                                <div className="font-medium text-slate-600"><span className="text-slate-800 font-bold border-b border-blue-200">다중 감각 비상 알람:</span> 일반 사이렌(음향) + 코너별 초대형 LED 시각 경보기(섬광등) 크로스 배치.</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="bg-blue-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-[9px] font-bold shrink-0">2</span>
                                <div className="font-medium text-slate-600"><span className="text-slate-800 font-bold border-b border-blue-200">스마트 음성 & 점자:</span> 건물 주출입구부터 교실 및 E/V까지 이어지는 절대 단절 없는 점자 블록 및 BLE 비콘 음성 안내망 연결.</div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Sanitary Facilities */}
                    <div className="bg-white rounded-xl border border-teal-100 shadow-sm p-5 border-t-4 border-t-teal-500 flex flex-col justify-between">
                        <div className="flex items-center gap-2 mb-3">
                            <DoorOpen size={16} className="text-teal-600" />
                            <h3 className="text-[12px] font-extrabold text-slate-800">자동화 슬라이딩 및 위생 스케일업</h3>
                        </div>
                        <div className="flex-1 flex gap-3 mt-1">
                            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 w-1/2 flex flex-col justify-between">
                                <div className="text-[10px] font-bold text-slate-700 text-center mb-1">전구역 자동문 도입</div>
                                <div className="text-[9px] text-slate-500 text-center leading-snug">악력 유지가 힘든 학생들을 위해 <b className="text-teal-700">근접 센서 방식 슬라이딩 자동문</b>을 전실 출입구에 편성 (여닫이문 배제).</div>
                            </div>
                            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 w-1/2 flex flex-col justify-between">
                                <div className="text-[10px] font-bold text-slate-700 text-center mb-1">장애인 화장실 스케일업</div>
                                <div className="text-[9px] text-slate-500 text-center leading-snug">법정 규격(1.4×1.8m)을 뛰어넘는 <b className="text-teal-700">1.8×2.0m 규격</b> 적용. 침대형 기저귀 교환대 및 승하강식 대변기 거치.</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ════════ 3. BF 본인증 리스크 관리 ════════ */}
                <div className="col-span-12 bg-white rounded-xl border border-slate-200 p-5 shadow-sm mt-1">
                    <div className="flex items-center gap-1.5 mb-4">
                        <ShieldAlert size={18} className="text-slate-700" />
                        <h3 className="text-sm font-extrabold text-slate-800">BF 최우수(90점↑) 본인증 실사 리스크 타격(Audit) 방지</h3>
                        <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded ml-2">시공단계 감리 집중감시점</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px] text-slate-600">
                            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
                                <tr>
                                    <th className="px-3 py-2 rounded-tl-lg w-[38%]">사용승인 직전 BF 실사 지적 위험요소 (Risks)</th>
                                    <th className="px-3 py-2 w-20 text-center">감점파급</th>
                                    <th className="px-3 py-2 rounded-tr-lg">설계단계/시공감리 원천 봉쇄 대책 (Mitigation)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-3 py-2.5 font-bold text-slate-700">각 실 출입구 도어실(문틀) 1cm 이상 마감 단차 발생</td>
                                    <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">탈락 위험</span></td>
                                    <td className="px-3 py-2.5">단차 무관용 원칙 적용. 설계도서에 "바닥 마감재-도어재료분리대 동일 수평 레벨(±0mm 지시)" 적색 강제 명기 및 먹매김 단계 전수검사.</td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-3 py-2.5 font-bold text-slate-700">건축/조경 마감재 충돌로 인한 점자 블록 연속성 훼손</td>
                                    <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">대폭 감점</span></td>
                                    <td className="px-3 py-2.5">외부 보도블록 경계석과 실내 로비로 이어지는 구간의 매립형 점자블록 재질 픽스. 끊김(Gap)이 150mm를 초과하지 않도록 샵드로잉 점검.</td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-3 py-2.5 font-bold text-slate-700">VE(가치공학) 명목 하에 전실 자동문을 여닫이문으로 하향</td>
                                    <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">대폭 감점</span></td>
                                    <td className="px-3 py-2.5">C-6 공사비산정 시, 자동문 공사비를 BF 전용 고정예산으로 락(Lock) 다운시켜 일반 건축 예산 삭감 표적에서 제외 조치.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ═══════════════ ENGINEERING METRICS SEAL ═══════════════ */}
            <div className="absolute bottom-6 left-6 right-6 bg-white rounded-lg p-3 shadow-lg border border-slate-200 flex items-center justify-between pointer-events-none z-50">
                <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
                    <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-sm">
                        <Target size={16} />
                    </div>
                    <div>
                        <div className="text-[11px] font-black text-slate-800 leading-none mb-1">BF STANDARD</div>
                        <div className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Universal Mobility</div>
                    </div>
                </div>
                <div className="flex-1 flex justify-evenly text-[10px] font-medium px-2 text-center">
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">본인증 획득 등급</span><span className="text-indigo-600 text-[9px] font-black">최우수 (90점↑)</span></div>
                    <div className="w-[1px] h-6 bg-slate-200"></div>
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">단절 없는 바닥 단차</span><span className="text-rose-500 text-[9px] font-black">ZERO (0mm) 제한</span></div>
                    <div className="w-[1px] h-6 bg-slate-200"></div>
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">복도 유효폭 (교행)</span><span className="text-teal-600 text-[9px] font-black">최소 2,100mm 확보</span></div>
                    <div className="w-[1px] h-6 bg-slate-200"></div>
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">문 개폐 솔루션</span><span className="text-blue-600 text-[9px] font-black">전 구간 자동 / 슬라이딩</span></div>
                </div>
            </div>
        </div>
    );
};

export default BFStrategyPanel;
