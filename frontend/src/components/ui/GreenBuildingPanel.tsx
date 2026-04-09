import React from 'react';
import { Leaf, Wind, Sun, Droplets, Target, ShieldAlert, Award, Activity, Sparkles, AlertCircle } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';

/* ═══════════════════════════════════════════════════════════════
   C-7 친환경 건축 및 치유 생태계 모듈 (Green Building)
   SKILL: K1 Eco-SEED 360 · K2 Breathe-IAQ · K3 Aqua-Balance · K4 LCA-CarbonZero · K5 Bio-Therapeutics
   Layout: 12-Column Cyber-Dashboard · Emerald/Cyan Theme · V3.0 AI Simulated
   ═══════════════════════════════════════════════════════════════ */

const GreenBuildingPanel = () => {
    const store = useProjectStore();
    const isEducation = store.buildingUse === '교육연구시설';
    const isHospital = store.buildingUse === '의료시설';
    const isSpecialParams = isEducation || isHospital;
    
    return (
        <div className="h-full flex flex-col bg-slate-50 overflow-y-auto custom-scrollbar font-sans relative">
            
            {/* ════════════ STICKY HEADER ════════════ */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-4 shrink-0">
                <div className="max-w-[1600px] mx-auto flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Leaf className="text-emerald-600" size={22} />
                            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
                                인공지능 친환경 생태/탄소저감 검토서
                            </h2>
                            <span className="ml-2 text-[9px] font-black tracking-widest bg-emerald-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                                <Sparkles size={10} /> V3.0 AI SIMULATED
                            </span>
                        </div>
                        <p className="text-slate-500 text-[12px] font-medium">
                            ARCHE ARCHI · Phase C. 엔지니어링 · G-SEED / 실내공기질(IAQ) / 물순환
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px]">
                        <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 font-bold">
                            건물 용도: {store.buildingUse || '기본'}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                            특화 조건: {isSpecialParams ? '호흡기/면역 보호 IAQ 극대화' : '표준 인증 대응'}
                        </span>
                    </div>
                </div>
            </div>

            {/* ════════════ MAIN GRID: 12-Column Cyber-Dashboard ════════════ */}
            <div className="flex-1 px-6 py-5">
                <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-5 pb-28">

                    {/* ═══════ SKILL ROADMAP SIDEBAR (Col 1-3) ═══════ */}
                    <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">

                        {/* K-Series SKILL Modules Status */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                            <div className="text-[10px] font-bold tracking-widest text-emerald-600 mb-3">K-SERIES SKILL MODULES</div>
                            {[
                                { id: 'K1', name: 'Eco-SEED 360', desc: 'G-SEED/ZEB 타겟팅', icon: <Award size={14}/>, status: 'Running' },
                                { id: 'K2', name: 'Breathe-IAQ', desc: '무독성/Flush-out 보장', icon: <Wind size={14}/>, status: 'Running' },
                                { id: 'K3', name: 'Aqua-Balance', desc: '빗물/중수 수처리 사이클', icon: <Droplets size={14}/>, status: 'Running' },
                                { id: 'K4', name: 'LCA-CarbonZero', desc: '전생애 탄소평가(LCA)', icon: <Target size={14}/>, status: 'Standby' },
                                { id: 'K5', name: 'Bio-Therapeutics', desc: 'PMV/DA 채광·열 쾌적성', icon: <Sun size={14}/>, status: 'Running' },
                            ].map((mod, i) => (
                                <div key={i} className="flex items-center gap-2.5 py-2 border-b border-slate-50 last:border-b-0">
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${mod.status === 'Running' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                        {mod.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] font-black text-slate-700">{mod.id}</span>
                                            <span className="text-[9px] text-slate-500 font-medium truncate">{mod.name}</span>
                                        </div>
                                        <div className="text-[9px] text-slate-400 truncate">{mod.desc}</div>
                                    </div>
                                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${mod.status === 'Running' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>
                                        {mod.status}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* 특화 환경 알림 */}
                        {isSpecialParams && (
                            <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-sm bg-gradient-to-b from-emerald-50/50 to-white relative overflow-hidden">
                                <div className="absolute top-[-10%] right-[-10%] opacity-10 text-emerald-600"><Wind size={120} /></div>
                                <div className="flex items-center gap-1.5 mb-3 position-relative z-10">
                                    <ShieldAlert size={14} className="text-emerald-700"/>
                                    <span className="text-[10px] font-bold text-slate-800">치유 방어 (Healthcare) 강제 할당</span>
                                </div>
                                <ul className="text-[9px] text-slate-600 space-y-1.5 list-disc pl-3 position-relative z-10">
                                    <li>준공 직전 14일 100% Flush-out(공기 정화) 배정</li>
                                    <li>전 구역 마감재 HB마크 E0 등급 강제 매핑</li>
                                    <li>초미세먼지 방어용 헤파필터/VAV 예산 상향</li>
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* ═══════ MAIN CONTENT AREA (Col 4-12) ═══════ */}
                    <div className="col-span-12 lg:col-span-9 flex flex-col gap-5">

                        {/* ─── SECTION 1: IAQ & Daylight (K2, K5) ─── */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row">
                            
                            {/* K2 IAQ Management */}
                            <div className="w-full lg:w-7/12 p-6 border-b lg:border-b-0 lg:border-r border-slate-100 bg-white">
                                <div className="flex items-center gap-2 mb-2">
                                    <Wind size={16} className="text-emerald-600" />
                                    <h3 className="text-[12px] font-extrabold text-slate-800 tracking-tight">K2 · Breathe-IAQ — 유해물질/공기질 통제</h3>
                                </div>
                                <p className="text-[11px] text-slate-600 leading-relaxed font-medium mb-5 bg-emerald-50/30 p-3 rounded-lg border border-emerald-50">
                                    정서/면역 취약 재실자의 호흡기 보호를 위한 무독성 시스템. <span className="font-bold text-emerald-700">전실 친환경 건축자재 최우수(HB마크 5개)</span> 적용 및 입주 전 의무 <span className="font-bold text-emerald-700">Flush-out</span>으로 VOC 잔류량을 제로화합니다.
                                </p>
                                
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="border border-slate-200 bg-slate-50 p-3 rounded-lg flex flex-col items-center justify-center text-center">
                                        <Activity size={18} className="text-emerald-500 mb-1.5" />
                                        <div className="text-[9px] text-slate-500 font-bold mb-0.5">PM2.5 통제</div>
                                        <div className="text-sm font-black text-slate-800">&lt; 30<span className="text-[9px] font-normal ml-0.5 text-slate-500">μg</span></div>
                                        <div className="text-[8px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full mt-1.5 font-bold w-full">헤파 방어망</div>
                                    </div>
                                    <div className="border border-slate-200 bg-slate-50 p-3 rounded-lg flex flex-col items-center justify-center text-center">
                                        <Wind size={18} className="text-cyan-500 mb-1.5" />
                                        <div className="text-[9px] text-slate-500 font-bold mb-0.5">CO₂ 희석</div>
                                        <div className="text-sm font-black text-slate-800">&lt; 800<span className="text-[9px] font-normal ml-0.5 text-slate-500">ppm</span></div>
                                        <div className="text-[8px] bg-cyan-100 text-cyan-700 px-1.5 py-0.5 rounded-full mt-1.5 font-bold w-full">VAV 연동</div>
                                    </div>
                                    <div className="border border-emerald-200 bg-emerald-50 p-3 rounded-lg flex flex-col items-center justify-center text-center">
                                        <ShieldAlert size={18} className="text-emerald-600 mb-1.5" />
                                        <div className="text-[9px] text-slate-500 font-bold mb-0.5">VOC/포름알데히드</div>
                                        <div className="text-sm font-black text-slate-800">E0<span className="text-[9px] font-normal ml-0.5 text-slate-500">등급</span></div>
                                        <div className="text-[8px] bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded-full mt-1.5 font-bold w-full">Flush-out</div>
                                    </div>
                                </div>
                            </div>

                            {/* K5 Daylight Autonomy */}
                            <div className="w-full lg:w-5/12 p-6 flex flex-col justify-center bg-gradient-to-br from-amber-50/50 to-white relative overflow-hidden">
                                <div className="absolute top-4 right-4 opacity-10 text-amber-500"><Sun fill="currentColor" size={100} /></div>
                                <div className="flex items-center gap-2 mb-3 relative z-10">
                                    <Sun size={16} className="text-amber-500" />
                                    <h3 className="text-[12px] font-extrabold text-slate-800 tracking-tight">K5 · Bio-Therapeutics</h3>
                                </div>
                                <p className="text-[10px] text-slate-500 mb-4 relative z-10 leading-relaxed font-medium pr-8">
                                    직사광선(Glare)을 배제하고 간접/천창을 활용하여 심미적 안정감을 주는 DA(Daylight Autonomy) 확보 모델.
                                </p>
                                <div className="space-y-3 relative z-10">
                                    <div>
                                        <div className="flex justify-between text-[9px] font-bold text-slate-600 mb-1">
                                            <span>자연채광 확보율 (목표 60%)</span><span className="text-amber-600">72% 달성</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-400 rounded-full" style={{ width: '72%' }}></div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-1">
                                        <div className="bg-white border border-amber-100 p-2 rounded flex flex-col text-center shadow-sm">
                                            <span className="text-[9px] font-bold text-amber-700">명상·심리치료실</span>
                                            <span className="text-[8px] text-slate-500 mt-0.5">광선반 간접채광</span>
                                        </div>
                                        <div className="bg-white border border-amber-100 p-2 rounded flex flex-col text-center shadow-sm">
                                            <span className="text-[9px] font-bold text-amber-700">체육관·로비</span>
                                            <span className="text-[8px] text-slate-500 mt-0.5">폴리카보 천창</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ─── SECTION 2: Water Balance & G-SEED (K3, K1) ─── */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            
                            {/* K3 Water Matrix */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col relative overflow-hidden">
                                <div className="absolute top-[-5%] right-[-5%] opacity-5 text-cyan-600"><Droplets fill="currentColor" size={100} /></div>
                                <div className="flex items-center gap-2 mb-3 relative z-10">
                                    <Droplets size={16} className="text-cyan-600" />
                                    <h3 className="text-[12px] font-extrabold text-slate-800 tracking-tight">K3 · Aqua-Balance — 워터 밸런스</h3>
                                </div>
                                <p className="text-[10px] text-slate-500 mb-4 h-8 relative z-10">
                                    {isSpecialParams ? "수중재활운동실 운영에 따른 대규모 수자원 요구. " : ""}
                                    기하학 볼륨 대비 내리는 빗물 유입량 계산 및 절수 루프 연동.
                                </p>
                                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 flex flex-col divide-y divide-slate-100/50 mt-auto relative z-10">
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>우수 집수 및 중수도 순환</span>
                                        <span className="text-[10px] font-black text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded">상수도 35% 절감</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>최상급 절수형 위생기자재</span>
                                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">6.0L → 4.5L/회</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* K1 G-SEED Certification */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 border-t-4 border-t-emerald-500 flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Award size={16} className="text-emerald-600" />
                                        <h3 className="text-[12px] font-extrabold text-slate-800 tracking-tight">K1 · Eco-SEED 360 타겟</h3>
                                    </div>
                                    {(isEducation || store.buildingUse === '업무시설(오피스)') && (
                                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-full">최우수 (1등급) 강제</span>
                                    )}
                                </div>
                                <div className="flex justify-between items-end mb-2">
                                    <div className="text-[28px] font-black text-slate-800 leading-none">78<span className="text-sm text-slate-400 font-bold">/100 점</span></div>
                                    <div className="text-[10px] text-slate-500 font-bold mb-1">Pass (74점 컷)</div>
                                </div>
                                <div className="space-y-2.5 pt-2 border-t border-slate-100 mt-auto">
                                    <div>
                                        <div className="flex justify-between text-[9px] mb-1 font-bold text-slate-600">
                                            <span>실내환경 (친환경자재/환기)</span><span className="text-emerald-700">16.0 / 18</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-emerald-500 h-1.5 rounded-full" style={{width: '88%'}}></div></div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-[9px] mb-1 font-bold text-slate-600">
                                            <span>에너지 및 환경오염</span><span className="text-emerald-700">18.5 / 20</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-emerald-500 h-1.5 rounded-full" style={{width: '92%'}}></div></div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* ─── SECTION 3: Risk Management ─── */}
                        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                            <div className="flex items-center gap-1.5 mb-4">
                                <Target size={16} className="text-slate-700" />
                                <h3 className="text-sm font-extrabold text-slate-800">친환경/생태 특화 리스크 식별</h3>
                                <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded ml-2">교차 검토 사항</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-[11px] text-slate-600">
                                    <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
                                        <tr>
                                            <th className="px-3 py-2 rounded-tl-lg w-1/3">리스크 현상</th>
                                            <th className="px-3 py-2 w-20 text-center">심각도</th>
                                            <th className="px-3 py-2 rounded-tr-lg">엔지니어링 Mitigation</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <tr className="hover:bg-slate-50 transition-colors">
                                            <td className="px-3 py-2.5 font-bold text-slate-700">옥상 생태/치유 공간 조성을 위한 토심 증가</td>
                                            <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">구조 하중</span></td>
                                            <td className="px-3 py-2.5">C-1(구조)팀 연계. 활하중 및 습윤하중 기준 상향 (설계하중 5.0kN/㎡ 이상 확보 배정)</td>
                                        </tr>
                                        <tr className="hover:bg-slate-50 transition-colors">
                                            <td className="px-3 py-2.5 font-bold text-slate-700">14일 간의 강력한 Flush-out 시행 중 에너지비 발생</td>
                                            <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">비용/일정</span></td>
                                            <td className="px-3 py-2.5">C-6(공정) 연계. 준공전 보일러/공조기 가동을 위한 임시동력 및 가스요금 실비 5D예산 편제</td>
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
                        <div className="bg-emerald-500 text-white p-1.5 rounded-lg shadow-sm">
                            <Leaf size={16} />
                        </div>
                        <div>
                            <div className="text-[11px] font-black text-white leading-none mb-0.5">GREEN BUILDING ENGINE</div>
                            <div className="text-[8px] text-slate-400 uppercase font-bold tracking-widest">Eco Healing · V3.0</div>
                        </div>
                    </div>
                    <div className="flex-1 flex justify-evenly text-[10px] font-medium px-3 text-center">
                        {[
                            { label: '실내공기질', value: 'E0자재 & Flush-out' },
                            { label: '인증 목표', value: 'G-SEED 최우수 (1D)' },
                            { label: '채광/자연빛', value: 'DA 72% + Glare Free' },
                            { label: '워터 밸런스', value: '중수/우수 35% 재활용' },
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

export default GreenBuildingPanel;
