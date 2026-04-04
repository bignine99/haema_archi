import React from 'react';
import { Leaf, Wind, Sun, Droplets, Target, ShieldAlert, Award, Activity } from 'lucide-react';

const GreenBuildingPanel = () => {
    return (
        <div className="h-full flex flex-col p-6 bg-slate-50 overflow-y-auto custom-scrollbar font-sans relative">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6 shrink-0 z-10">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <Leaf className="text-green-600" size={24} />
                        친환경 건축 및 치유 생태계 계획
                    </h2>
                    <p className="text-slate-500 text-sm mt-1 font-medium">
                        녹색건축인증(G-SEED 최우수) 달성 및 면역 취약 학생들을 위한 무독성 청정 치유공간 조성
                    </p>
                </div>
            </div>

            {/* Grid Content */}
            <div className="flex-1 grid grid-cols-12 gap-5 pb-24 relative">
                
                {/* ════════ LEFT MAIN PANEL (Col 1-8) ════════ */}
                <div className="col-span-12 xl:col-span-8 flex flex-col gap-5">
                    {/* ════════ 1. 실내 공기질 및 정서환경 치유 ════════ */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row overflow-hidden relative">
                    {/* Left: IAQ Quality Management */}
                    <div className="w-full md:w-7/12 p-6 border-r border-slate-100 flex flex-col">
                        <div className="text-[10px] font-bold tracking-widest text-slate-500 mb-2">INDOOR AIR QUALITY (IAQ) STRATEGY</div>
                        <h3 className="text-xl font-extrabold text-slate-800 mb-3">면역·호흡기 보호를 위한 무독성 환기 시스템</h3>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-medium mb-5 bg-green-50 p-3 rounded-lg border border-green-100/50">
                            김해 특수학교 학생들의 취약한 호흡기와 알러지를 완벽 보호하기 위해 <span className="font-bold text-green-700">전실 친환경 건축자재 최우수(HB마크 클로버 5개, E0등급)</span> 적용은 물론 입주 전 14일 의무 <span className="font-bold text-green-700">Flush-out (베이크아웃)</span>을 진행하여 유해물질(VOC, 라돈 등) 잔류량을 제로화 합니다.
                        </p>
                        
                        <div className="grid grid-cols-3 gap-3">
                            <div className="border border-slate-200 bg-white shadow-sm p-3 rounded-lg flex flex-col items-center text-center">
                                <Activity size={20} className="text-teal-600 mb-2" />
                                <div className="text-[9px] text-slate-500 font-bold mb-1">초미세먼지 (PM2.5)</div>
                                <div className="text-sm font-black text-slate-800">&lt; 30<span className="text-[9px] font-normal ml-0.5 text-slate-500">μg/m³</span></div>
                                <div className="text-[8px] bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded-full mt-2 font-bold w-full">헤파필터 연동 방어</div>
                            </div>
                            <div className="border border-slate-200 bg-white shadow-sm p-3 rounded-lg flex flex-col items-center text-center">
                                <Wind size={20} className="text-sky-500 mb-2" />
                                <div className="text-[9px] text-slate-500 font-bold mb-1">상시 이산화탄소 (CO₂)</div>
                                <div className="text-sm font-black text-slate-800">&lt; 800<span className="text-[9px] font-normal ml-0.5 text-slate-500">ppm</span></div>
                                <div className="text-[8px] bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded-full mt-2 font-bold w-full">VAV 외기 비례 제어</div>
                            </div>
                            <div className="border border-green-200 bg-green-50 shadow-sm p-3 rounded-lg flex flex-col items-center text-center">
                                <ShieldAlert size={20} className="text-green-600 mb-2" />
                                <div className="text-[9px] text-slate-500 font-bold mb-1">포름알데히드/VOC</div>
                                <div className="text-sm font-black text-slate-800">E0<span className="text-[9px] font-normal ml-0.5 text-slate-500">등급(최상)</span></div>
                                <div className="text-[8px] bg-green-200 text-green-800 px-1.5 py-0.5 rounded-full mt-2 font-bold w-full">고강도 Flush-out</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Sunlight Autonomy / Daylight */}
                    <div className="w-full md:w-5/12 p-6 flex flex-col justify-center relative bg-gradient-to-br from-white to-amber-50/30">
                        <div className="absolute top-4 right-4 opacity-10 text-amber-500"><Sun fill="currentColor" size={100} /></div>
                        <div className="flex items-center gap-2 mb-3 relative z-10">
                            <Sun size={18} className="text-amber-500" />
                            <h3 className="text-sm font-bold text-slate-800">빛환경 치유 (Daylight Autonomy)</h3>
                        </div>
                        <p className="text-[10px] text-slate-500 mb-4 pr-12 relative z-10 leading-relaxed">
                            빛과 채광은 자폐 및 정서·행동 장애 학생들의 심리적 안정에 직결됩니다. 자극적인 직사광선(Glare)을 완전히 배제한 간접/천창 채광 시스템 도입.
                        </p>
                        <div className="space-y-3 relative z-10">
                            <div>
                                <div className="flex justify-between text-[9px] font-bold text-slate-600 mb-1">
                                    <span>자연채광 확보율 (목표: 60%)</span><span>실 달성: 72%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-400 rounded-full" style={{ width: '72%' }}></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div className="bg-white border border-amber-100 p-2 rounded flex flex-col">
                                    <span className="text-[9px] font-bold text-amber-700">심리안정/음악치료실</span>
                                    <span className="text-[8px] text-slate-500">루버(Louver)를 통한 빛산란 간접채광</span>
                                </div>
                                <div className="bg-white border border-amber-100 p-2 rounded flex flex-col">
                                    <span className="text-[9px] font-bold text-amber-700">수중운동실/체육관</span>
                                    <span className="text-[8px] text-slate-500">단열 폴리카보네이트 천창 적용</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ════════ 2. 수자원 밸런스 및 생태(G-SEED) 인증 ════════ */}
                <div className="grid grid-cols-2 gap-5">
                    {/* Water Matrix */}
                    <div className="bg-white rounded-xl border border-cyan-100 shadow-sm p-6 relative overflow-hidden">
                         <div className="absolute top-[-5%] right-[-5%] opacity-5 text-cyan-500"><Droplets fill="currentColor" size={120} /></div>
                         <div className="flex items-center gap-2 mb-3">
                            <Droplets size={16} className="text-cyan-500" />
                            <h3 className="text-sm font-extrabold text-slate-800">초대형 욕장 대응 수자원 통합 밸런스</h3>
                         </div>
                         <p className="text-[10px] text-slate-500 mb-4 h-8">특수학교 내 거대한 수중재활운동실 운영으로 인해 막대한 수자원 요구. 침투형 우수저류조 및 절수설비 연계 통합 워터루프.</p>
                         
                         <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 flex flex-col divide-y divide-slate-100">
                             <div className="flex justify-between items-center py-1.5">
                                 <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>우수 집수 및 중수도 순환</span>
                                 <span className="text-[10px] font-black text-cyan-700">사용량 35% 절감</span>
                             </div>
                             <div className="flex justify-between items-center py-1.5">
                                 <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>최상급 절수형 위생기자재</span>
                                 <span className="text-[10px] font-black text-cyan-700">6.0L/회 → 4.5L/회</span>
                             </div>
                             <div className="flex justify-between items-center py-1.5">
                                 <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>자연침투/투수성 생태포장</span>
                                 <span className="text-[10px] font-black text-cyan-700">생태면적률 40%+</span>
                             </div>
                         </div>
                    </div>
                    
                    {/* G-SEED Certification */}
                    <div className="bg-white rounded-xl border border-green-200 shadow-sm p-6 border-t-4 border-t-green-500">
                         <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Award size={18} className="text-green-600" />
                                <h3 className="text-sm font-extrabold text-slate-800">녹색건축인증 (G-SEED) 타겟</h3>
                            </div>
                            <span className="text-[10px] bg-green-100 text-green-800 font-black px-2 py-1 rounded">최우수 (그린 1등급 / 74점 이상)</span>
                         </div>
                         
                         <div className="space-y-3 pt-1">
                             <div>
                                 <div className="flex justify-between text-[9px] mb-1 font-bold"><span className="text-slate-600">에너지 및 환경오염</span> <span className="text-green-700">18.5 / 20점</span></div>
                                 <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full" style={{width: '92%'}}></div></div>
                             </div>
                             <div>
                                 <div className="flex justify-between text-[9px] mb-1 font-bold"><span className="text-slate-600">실내환경 (친환경자재/환기)</span> <span className="text-green-700">16.0 / 18점</span></div>
                                 <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full" style={{width: '88%'}}></div></div>
                             </div>
                             <div>
                                 <div className="flex justify-between text-[9px] mb-1 font-bold"><span className="text-slate-600">생태환경 (비오톱, 투수포장 등)</span> <span className="text-green-700">11.0 / 12점</span></div>
                                 <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full" style={{width: '91%'}}></div></div>
                             </div>
                         </div>
                    </div>
                </div>

                {/* ════════ 3. 생태환경 공간/친환경 리스크 관리 ════════ */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <div className="flex items-center gap-1.5 mb-4">
                        <Target size={18} className="text-slate-700" />
                        <h3 className="text-sm font-extrabold text-slate-800">친환경 공간 특화 리스크 식별</h3>
                        <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-1.5 py-0.5 rounded ml-2">구조안전 및 비용 검토 요망</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px] text-slate-600">
                            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
                                <tr>
                                    <th className="px-3 py-2 rounded-tl-lg w-1/3">특수학교 치유 명세 (Risks)</th>
                                    <th className="px-3 py-2 w-20 text-center">심각도</th>
                                    <th className="px-3 py-2 rounded-tr-lg">엔지니어링 대응 방안 (Mitigation)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-3 py-2.5 font-bold text-slate-700">옥상 휠체어 텃밭 조성으로 인한 초과 활하중 작용</td>
                                    <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">크리티컬</span></td>
                                    <td className="px-3 py-2.5">집약형 토심(30cm↑) 확보 요. 구조팀(C-1)과 협의하여 RC옥상 슬래브 허용 설계하중 5.0kN/㎡ 이상 필수 상향</td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-3 py-2.5 font-bold text-slate-700">무독성·친환경 특수 자재(수입산) 공수 지연 리스크</td>
                                    <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">중</span></td>
                                    <td className="px-3 py-2.5">E0 등급 내오염성 고무바닥재, 벽면 쿠션재 수입/조달 기간 산정 후 공정표(C-6) 3개월 리드타임 선반영</td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-3 py-2.5 font-bold text-slate-700">신규 입주 전, 14일 의무 Flush-out 중 동절기 가스비 파동</td>
                                    <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">중</span></td>
                                    <td className="px-3 py-2.5">3월 개교 역산 시 1~2월 베이크아웃 실시됨. 임시 전력 및 가스요금 실비 예산 공사비에 사전 편제 요.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                </div>

                {/* ════════ RIGHT SIDEBAR (Col 9-12) ════════ */}
                <div className="col-span-12 xl:col-span-4 flex flex-col gap-5">
                    {/* SUSTAINABILITY ENGINE DASHBOARD */}
                    <div className="bg-slate-900 rounded-xl p-5 text-white shadow-xl relative overflow-hidden flex flex-col border border-slate-800">
                        <div className="absolute -right-4 -top-4 opacity-10"><Leaf size={120} /></div>
                        
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-xs font-bold text-emerald-400 tracking-widest">SUSTAINABILITY ENGINE</span>
                        </div>
                        <h3 className="text-xl font-bold mb-4">친환경 생태 환경 매트릭스</h3>
                        
                        <div className="flex-1 space-y-3 relative z-10">
                            {/* SKILL E-1 */}
                            <div className="group rounded-lg border border-emerald-500/30 bg-slate-800/80 p-3 hover:bg-slate-800 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-1.5">
                                        <Wind size={14} className="text-emerald-400" />
                                        <span className="text-xs font-bold text-slate-200">IAQ Monitor</span>
                                    </div>
                                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold border border-emerald-500/20">Running</span>
                                </div>
                                <div className="text-[10px] text-slate-400">실내공기질 시뮬레이션 및 유해물질 저감 검증</div>
                            </div>
                            
                            {/* SKILL E-2 */}
                            <div className="group rounded-lg border border-amber-500/30 bg-slate-800/80 p-3 hover:bg-slate-800 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-1.5">
                                        <Sun size={14} className="text-amber-400" />
                                        <span className="text-xs font-bold text-slate-200">Daylight Auto</span>
                                    </div>
                                    <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold border border-amber-500/20">Running</span>
                                </div>
                                <div className="text-[10px] text-slate-400">자연채광 확보율 분석 및 눈부심(Glare) 시뮬레이션</div>
                            </div>
                            
                            {/* SKILL E-3 */}
                            <div className="group rounded-lg border border-slate-700 bg-slate-800/50 p-3 opacity-60">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-1.5">
                                        <Droplets size={14} className="text-slate-400" />
                                        <span className="text-xs font-bold text-slate-300">Water Cycle</span>
                                    </div>
                                    <span className="text-[9px] bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded font-bold">Standby</span>
                                </div>
                                <div className="text-[10px] text-slate-500">수자원 순환망 및 생태면적률 정량 계산 (데이터 대기)</div>
                            </div>

                            {/* SKILL E-4 */}
                            <div className="group rounded-lg border border-slate-700 bg-slate-800/50 p-3 opacity-60 mt-auto">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-1.5">
                                        <Award size={14} className="text-slate-400" />
                                        <span className="text-xs font-bold text-slate-300">G-SEED Cert.</span>
                                    </div>
                                    <span className="text-[9px] bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded font-bold">Standby</span>
                                </div>
                                <div className="text-[10px] text-slate-500">녹색건축인증 항목별 평가점수 자동 매핑 (규제 연동 대기)</div>
                            </div>
                        </div>
                    </div>
                    
                    {/* ZEB Readiness Widget */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><Leaf size={14} className="text-emerald-500" /> ZEB 4등급 달성률</h3>
                            <span className="text-[10px] font-black text-emerald-600">82%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-3">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '82%' }}></div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[9px] text-slate-600">
                            <div className="bg-slate-50 p-2 border border-slate-100 rounded">
                                <span className="font-bold block text-slate-700">단열/기밀 (패시브)</span>
                                <span>성능지표 1++ 기준 충족</span>
                            </div>
                            <div className="bg-slate-50 p-2 border border-slate-100 rounded">
                                <span className="font-bold block text-slate-700">신재생에너지 (액티브)</span>
                                <span>태양광/지열 비중 35% 요망</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════ ENGINEERING METRICS SEAL ═══════════════ */}
            <div className="absolute bottom-6 left-6 right-6 bg-white rounded-lg p-3 shadow-lg border border-slate-200 flex items-center justify-between pointer-events-none z-50">
                <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
                    <div className="bg-slate-800 text-white p-1.5 rounded-lg shadow-sm">
                        <Leaf size={16} />
                    </div>
                    <div>
                        <div className="text-[11px] font-black text-slate-800 leading-none mb-1">GREEN STRATEGY</div>
                        <div className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Eco Healing Engine</div>
                    </div>
                </div>
                <div className="flex-1 flex justify-evenly text-[10px] font-medium px-2 text-center">
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">실내공기질</span><span className="text-green-600 text-[9px] font-black">PM2.5 &lt; 30μg/m³</span></div>
                    <div className="w-[1px] h-6 bg-slate-200"></div>
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">인증 (G-SEED)</span><span className="text-green-600 text-[9px] font-black">최우수 (74점↑)</span></div>
                    <div className="w-[1px] h-6 bg-slate-200"></div>
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">채광 효율 (DA)</span><span className="text-amber-500 text-[9px] font-black">72% (직사 차단)</span></div>
                    <div className="w-[1px] h-6 bg-slate-200"></div>
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">친환경 자재율</span><span className="text-green-600 text-[9px] font-black">E0 / 무독성 100%</span></div>
                </div>
            </div>
        </div>
    );
};

export default GreenBuildingPanel;
