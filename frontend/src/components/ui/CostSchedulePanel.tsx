import React from 'react';
import { Calculator, Calendar, Clock, DollarSign, TrendingDown, Layers, FileText, Target, ShieldAlert } from 'lucide-react';

const CostSchedulePanel = () => {
    return (
        <div className="h-full flex flex-col p-6 bg-slate-50 overflow-y-auto custom-scrollbar font-sans relative">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6 shrink-0 z-10">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <FileText className="text-slate-600" size={24} />
                        공사비 예산 및 4D/5D 공정 검토
                    </h2>
                    <p className="text-slate-500 text-sm mt-1 font-medium">
                        개교(신학기) 절대 공기 엄수 및 무장애/특수설비 반영 공사비(VE) 최적화 분석
                    </p>
                </div>
            </div>

            {/* Grid Content */}
            <div className="flex-1 grid grid-cols-12 gap-5 pb-24 relative">

                {/* ════════ LEFT MAIN PANEL (Col 1-8) ════════ */}
                <div className="col-span-12 xl:col-span-8 flex flex-col gap-5">
                    {/* ════════ 1. 공사비(5D) 및 VE 최적화 ════════ */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row overflow-hidden relative">
                    {/* Left: Cost Breakdown & Benchmarking */}
                    <div className="w-full md:w-7/12 p-6 border-r border-slate-100 flex flex-col justify-center">
                        <div className="text-[10px] font-bold tracking-widest text-slate-500 mb-2">5D COST ESTIMATION & TARGETING</div>
                        <h3 className="text-xl font-extrabold text-slate-800 mb-3">설비 고도화에 따른 예산 편성 현실화</h3>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-medium mb-5 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            김해 특수학교의 특성상 <span className="font-bold text-emerald-700">수중운동실(항온항습/수처리), 피난 제연설비, 24인승 특수 엘리베이터</span> 등 기계·전기 설비의 비율이 일반 학교 대비 약 12% 높습니다. 이를 반영하여 ㎡당 단가를 620만원(조달청 특수시설 기준 상단)으로 확보합니다.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <div className="border-l-4 border-slate-600 bg-white shadow-sm p-3 rounded-r-lg border border-slate-100 flex flex-col justify-between">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-1.5"><Calculator size={14} className="text-slate-500"/><span className="text-[10px] text-slate-500 font-bold">목표 공사비 한도</span></div>
                                </div>
                                <div>
                                    <div className="text-xl font-black text-slate-800">460<span className="text-[11px] font-normal ml-1 text-slate-500">억원</span></div>
                                    <div className="text-[9px] text-slate-500 font-medium">연면적 7,420㎡ / 약 620만원/㎡</div>
                                </div>
                            </div>
                            <div className="border-l-4 border-emerald-500 bg-white shadow-sm p-3 rounded-r-lg border border-slate-100 flex flex-col justify-between">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-1.5"><DollarSign size={14} className="text-emerald-500"/><span className="text-[10px] text-slate-500 font-bold">공종별 예산 배분율</span></div>
                                </div>
                                <div className="mt-1">
                                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex relative border border-slate-200">
                                        <div className="bg-slate-400 h-full flex items-center justify-center text-[7px] text-white font-bold" style={{width: '58%'}}>건축 58%</div>
                                        <div className="bg-emerald-400 h-full flex items-center justify-center text-[7px] text-white font-bold" style={{width: '28%'}}>MEP 28%</div>
                                        <div className="bg-emerald-600 h-full flex items-center justify-center text-[7px] text-white font-bold" style={{width: '14%'}}>토목/기타</div>
                                    </div>
                                    <div className="text-[8px] text-emerald-600 font-bold mt-1 text-right">설비/장비 비중 전년대비 +5.5%↑</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: VE Strategy */}
                    <div className="w-full md:w-5/12 p-5 flex flex-col relative overflow-hidden bg-gradient-to-b from-emerald-50/50 to-white">
                        <div className="absolute top-[-10%] right-[-5%] opacity-5 text-emerald-600"><TrendingDown fill="currentColor" size={150} /></div>
                        <div className="flex items-center gap-1.5 mb-4 relative z-10">
                            <Target size={16} className="text-emerald-600" />
                            <span className="text-[12px] font-bold text-slate-800">Value Engineering (VE) 예산 절감 테마</span>
                        </div>
                        <div className="flex-1 flex flex-col justify-center gap-3 relative z-10 text-[10px] text-slate-600">
                            <div className="bg-white p-2.5 rounded shadow-sm border border-emerald-100/50 flex flex-col justify-center">
                                <div className="font-bold text-slate-700 mb-1 flex items-center gap-1.5"><Layers size={12} className="text-emerald-600"/> <span>단순·규격화 기반 골조 공사비 절감</span></div>
                                <div className="leading-snug text-slate-500">지하 암반 굴착 최소화를 위해 건물 레벨을 1m 상향 조정하고, 교실 모듈 치수(7.5m×9.0m) 통일로 거푸집 전용 횟수를 극대화함.</div>
                            </div>
                            <div className="bg-white p-2.5 rounded shadow-sm border border-emerald-100/50 flex flex-col justify-center">
                                <div className="font-bold text-slate-700 mb-1 flex items-center gap-1.5"><Clock size={12} className="text-emerald-600"/> <span>공기 단축 구간(Fast-Track) 확보</span></div>
                                <div className="leading-snug text-slate-500">외장 벽돌 마감 대신 조립식 알루미늄 패널 및 단열 일체형 시스템 도입으로 동절기 습식공사 리스크 헷지 및 가설 공기 2개월 단축.</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ════════ 2. 4D 공정 및 임계경로 ════════ */}
                <div className="bg-white rounded-xl border border-sky-100 shadow-sm p-6 overflow-hidden flex flex-col">
                    <div className="flex items-center gap-2 mb-1.5">
                        <Calendar size={18} className="text-sky-600" />
                        <h3 className="text-sm font-extrabold text-slate-800">절대 공기 스케줄 (Project Critical Path)</h3>
                        <span className="ml-2 text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold border border-red-200">역산 타겟: 2028년 3월 개교 시점</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mb-4">장애물 없는 생활환경(BF), 녹색건축, 에너지 등 본인증 기간 2개월을 포함한 공정 관리 통제 (총 공기 24개월 목표)</p>
                    
                    <div className="w-full bg-slate-50 p-4 border border-slate-100 rounded-lg">
                        {/* Fake Gantt/Bar Chart Layout */}
                        <div className="flex text-[9px] text-slate-400 font-bold mb-2 pb-1 border-b border-slate-200">
                            <div className="w-1/4">공종 (Task)</div>
                            <div className="w-1/4">1~6 M (착공/토목)</div>
                            <div className="w-1/4">7~18 M (골조/외장)</div>
                            <div className="w-1/4">19~24 M (내장/인증)</div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center text-[10px]">
                                <div className="w-1/4 font-bold text-slate-600">토목/흙막이공사</div>
                                <div className="w-3/4 flex bg-slate-200 h-5 rounded overflow-hidden">
                                    <div className="w-1/3 bg-slate-400 border-r border-white/20 px-2 flex items-center text-[8px] text-white font-bold">1~5M</div>
                                </div>
                            </div>
                            <div className="flex items-center text-[10px]">
                                <div className="w-1/4 font-bold text-slate-600">골조/콘크리트공사</div>
                                <div className="w-3/4 flex bg-slate-200 h-5 rounded overflow-hidden">
                                    <div className="w-1/6"></div>
                                    <div className="w-1/2 bg-sky-500 border-r border-white/20 shadow-[inset_0_-2px_0_rgba(0,0,0,0.1)] px-2 flex items-center text-[8px] text-white font-bold relative">
                                        <span className="absolute -top-0.5 right-1 text-red-100 animate-pulse">★ CP</span>
                                        5~16M
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center text-[10px]">
                                <div className="w-1/4 font-bold text-slate-600">외/내장 특수마감</div>
                                <div className="w-3/4 flex bg-slate-200 h-5 rounded overflow-hidden">
                                    <div className="w-1/2"></div>
                                    <div className="w-5/12 bg-slate-400 border-r border-white/20 px-2 flex items-center text-[8px] text-white font-bold">13~21M</div>
                                </div>
                            </div>
                            <div className="flex items-center text-[10px]">
                                <div className="w-1/4 font-bold text-amber-700">시운전 및 각종 본인증</div>
                                <div className="w-3/4 flex bg-slate-200 h-5 rounded overflow-hidden">
                                    <div className="w-[75%]"></div>
                                    <div className="w-[25%] bg-amber-500 px-2 flex items-center text-[8px] text-white font-bold">22~24M (준공)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ════════ 3. 리스크 및 이슈 관리 ════════ */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <div className="flex items-center gap-1.5 mb-4">
                        <ShieldAlert size={18} className="text-slate-700" />
                        <h3 className="text-sm font-extrabold text-slate-800">공정 지연 및 사업비 리스크 파악 (Risk Audit)</h3>
                        <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded ml-2">재무/시간 요인</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px] text-slate-600">
                            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
                                <tr>
                                    <th className="px-3 py-2 rounded-tl-lg w-1/3">리스크/이슈 항목</th>
                                    <th className="px-3 py-2 w-20 text-center">심각도</th>
                                    <th className="px-3 py-2 rounded-tr-lg">대책 및 Schedule 저감 방안</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-3 py-2.5 font-bold text-slate-700">BF 인허가/본인증 심의 지연에 따른 개교 차질</td>
                                    <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">크리티컬</span></td>
                                    <td className="px-3 py-2.5">내장 마감 완료 시점(20개월 차)에 조기 현장실사 단행. 지적(단차, 난간길이 등) 시정 마일스톤 4주 사전 확보</td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-3 py-2.5 font-bold text-slate-700">기계 장비(제습공조기, 수중펌프) 관급 자재 납품 대기</td>
                                    <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">중</span></td>
                                    <td className="px-3 py-2.5">특수 장비류 설계 스펙 최종 픽스 즉시 사급 전환 또는 선발주 협의 진행 (골조 한창 진행 중 선발주)</td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-3 py-2.5 font-bold text-slate-700">동절기 기상 제한 요소로 골조 양생 지연</td>
                                    <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">중</span></td>
                                    <td className="px-3 py-2.5">단열 거푸집 사용 검토 및 혹한기 전 지상 3층 이상 코어 철근 배근 마무리 목표 세팅. 공사 휴지기 예비 주 반영.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                </div>

                {/* ════════ RIGHT SIDEBAR (Col 9-12) ════════ */}
                <div className="col-span-12 xl:col-span-4 flex flex-col gap-5">
                    {/* COST & TIME ENGINE DASHBOARD */}
                    <div className="bg-slate-900 rounded-xl p-5 text-white shadow-xl relative overflow-hidden flex flex-col border border-slate-800">
                        <div className="absolute -right-4 -top-4 opacity-10"><Calculator size={120} /></div>
                        
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                            <span className="text-xs font-bold text-cyan-400 tracking-widest">COST & TIME ENGINE</span>
                        </div>
                        <h3 className="text-xl font-bold mb-4">사업비/일정 통제 매트릭스</h3>
                        
                        <div className="flex-1 space-y-3 relative z-10">
                            {/* SKILL M-1 */}
                            <div className="group rounded-lg border border-cyan-500/30 bg-slate-800/80 p-3 hover:bg-slate-800 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-1.5">
                                        <DollarSign size={14} className="text-cyan-400" />
                                        <span className="text-xs font-bold text-slate-200">5D Cost Estimator</span>
                                    </div>
                                    <span className="text-[9px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded font-bold border border-cyan-500/20">Running</span>
                                </div>
                                <div className="text-[10px] text-slate-400">설계 변경 시 실시간 물량 연동 및 타겟 예산(Target Costing) 추적</div>
                            </div>
                            
                            {/* SKILL M-2 */}
                            <div className="group rounded-lg border border-indigo-500/30 bg-slate-800/80 p-3 hover:bg-slate-800 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={14} className="text-indigo-400" />
                                        <span className="text-xs font-bold text-slate-200">4D Scheduler</span>
                                    </div>
                                    <span className="text-[9px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded font-bold border border-indigo-500/20">Running</span>
                                </div>
                                <div className="text-[10px] text-slate-400">건축 시공 크리티컬 패스(CP) 파악 및 절대 공기 지연 리스크 경고</div>
                            </div>
                            
                            {/* SKILL M-3 */}
                            <div className="group rounded-lg border border-slate-700 bg-slate-800/50 p-3 opacity-60">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-1.5">
                                        <TrendingDown size={14} className="text-slate-400" />
                                        <span className="text-xs font-bold text-slate-300">VE Optimizer</span>
                                    </div>
                                    <span className="text-[9px] bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded font-bold">Standby</span>
                                </div>
                                <div className="text-[10px] text-slate-500">대안 설계(Value Engineering) 효과 시뮬레이터 (데이터 대기)</div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Schedule Risk Widget */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><Clock size={14} className="text-red-500" /> 준공 지연 리스크 경고</h3>
                            <span className="text-[10px] font-black text-red-600">High</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[9px] text-slate-600 mb-3">
                            <div className="bg-red-50 p-2 border border-red-100 rounded text-center">
                                <span className="font-bold block text-red-800 text-[10px] mb-1">인허가 장기화</span>
                                <span className="text-red-600">BF 인증 심의 +4주 예상</span>
                            </div>
                            <div className="bg-amber-50 p-2 border border-amber-100 rounded text-center">
                                <span className="font-bold block text-amber-800 text-[10px] mb-1">동절기 공사</span>
                                <span className="text-amber-600">습식타설 통제 +3주 반영</span>
                            </div>
                        </div>
                        <button className="w-full text-[10px] font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 hover:text-slate-700 transition-colors py-2 rounded border border-slate-200">
                            상세 리스크 완화 플랜 보기
                        </button>
                    </div>
                </div>
            </div>

            {/* ═══════════════ ENGINEERING METRICS SEAL ═══════════════ */}
            <div className="absolute bottom-6 left-6 right-6 bg-white rounded-lg p-3 shadow-lg border border-slate-200 flex items-center justify-between pointer-events-none z-50">
                <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
                    <div className="bg-slate-800 text-white p-1.5 rounded-lg shadow-sm">
                        <FileText size={16} />
                    </div>
                    <div>
                        <div className="text-[11px] font-black text-slate-800 leading-none mb-1">COST & SCHEDULE</div>
                        <div className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Financial Framework</div>
                    </div>
                </div>
                <div className="flex-1 flex justify-evenly text-[10px] font-medium px-2 text-center">
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">사업 타겟 예산</span><span className="text-slate-500 text-[9px]">460억 / 620만/㎡</span></div>
                    <div className="w-[1px] h-6 bg-slate-200"></div>
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">절대 공기</span><span className="text-slate-500 text-[9px]">24M (3월 개교 역산)</span></div>
                    <div className="w-[1px] h-6 bg-slate-200"></div>
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">크리티컬 패스</span><span className="text-slate-500 text-[9px]">현장 타설 골조 공기</span></div>
                    <div className="w-[1px] h-6 bg-slate-200"></div>
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">VE 절감</span><span className="text-slate-500 text-[9px]">조립식 외장 패널화</span></div>
                </div>
            </div>
        </div>
    );
};

export default CostSchedulePanel;
