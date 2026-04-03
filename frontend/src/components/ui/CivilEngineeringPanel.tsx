import React from 'react';
import { MapPin, Mountain, TrendingDown, ShieldAlert, Cpu, Activity, Droplets, Anchor } from 'lucide-react';

const CivilEngineeringPanel = () => {
    return (
        <div className="h-full flex flex-col p-6 bg-slate-50 overflow-y-auto custom-scrollbar font-sans relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 shrink-0 z-10">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <MapPin className="text-slate-600" size={24} />
                        지반 및 토목 엔지니어링 분석서
                    </h2>
                    <p className="text-slate-500 text-sm mt-1 font-medium">
                        지반조사, 굴착 안정성, 기초 설계 및 부력 대응 통합 검토 결과
                    </p>
                </div>
            </div>

            {/* Grid Content */}
            <div className="flex-1 grid grid-cols-12 gap-5 pb-24 relative">
                
                {/* ════════ 1. 지반조사 및 기초 설계 ════════ */}
                <div className="col-span-12 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row overflow-hidden relative">
                    {/* Left: Boring Profile & N-Value */}
                    <div className="w-full md:w-5/12 p-5 border-r border-slate-100 flex flex-col relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
                        <div className="absolute top-[-10%] right-[-10%] opacity-5"><Mountain size={180} /></div>
                        <div className="flex items-center gap-1.5 mb-4 relative z-10">
                            <Activity size={16} className="text-amber-600" />
                            <span className="text-[12px] font-bold text-slate-700">지층 단면 및 시추 조사 결과</span>
                        </div>
                        <div className="flex-1 flex items-center justify-center p-2 mb-2 relative z-10">
                            <BoringLogDiagram />
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-center relative z-10">
                            <div className="bg-white border border-slate-200 p-2 rounded shadow-sm">
                                <div className="text-[9px] text-slate-500">풍화암 출현 심도</div>
                                <div className="text-[12px] font-black text-slate-700">GL -8.5m</div>
                            </div>
                            <div className="bg-white border text-center border-slate-200 p-2 rounded shadow-sm">
                                <div className="text-[9px] text-slate-500">지하수위 (GL)</div>
                                <div className="text-[12px] font-black text-blue-600">-3.2m</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Foundation System */}
                    <div className="w-full md:w-7/12 p-6 flex flex-col justify-center">
                        <div className="text-[10px] font-bold tracking-widest text-slate-500 mb-2">FOUNDATION STRATEGY</div>
                        <h3 className="text-xl font-extrabold text-slate-800 mb-3">하이브리드 기초 형식 (Mat + partial Pile)</h3>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-medium mb-5 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            Terzaghi 지지력 공식 및 SPT N값 분석 결과, 일반 건축물 구간은 허용지내력 250kN/m² 이상 확보되어 
                            경제적인 <span className="font-bold text-slate-800">얕은기초(Mat Foundation)</span>를 적용하며, 연약층 심도가 깊은 수중운동실 부분은 
                            <span className="font-bold text-blue-600"> PHC 말뚝기초</span>를 혼용합니다.
                        </p>
                        
                        <div className="grid grid-cols-3 gap-3">
                            <div className="border-l-4 border-emerald-500 bg-white shadow-sm p-3 rounded-r-lg border-y border-r border-slate-100">
                                <div className="text-[10px] text-slate-500 font-bold mb-1">허용지내력 (qa)</div>
                                <div className="text-sm font-black text-slate-800">300<span className="text-[10px] font-normal ml-0.5 text-slate-500">kN/m²</span></div>
                            </div>
                            <div className="border-l-4 border-blue-500 bg-white shadow-sm p-3 rounded-r-lg border-y border-r border-slate-100">
                                <div className="text-[10px] text-slate-500 font-bold mb-1">예상 압밀침하량</div>
                                <div className="text-sm font-black text-slate-800">18.5<span className="text-[10px] font-normal ml-0.5 text-slate-500">mm</span></div>
                                <div className="text-[8px] text-emerald-600 mt-0.5">허용치(50) 이내 PASS</div>
                            </div>
                            <div className="border-l-4 border-amber-500 bg-white shadow-sm p-3 rounded-r-lg border-y border-r border-slate-100">
                                <div className="text-[10px] text-slate-500 font-bold mb-1">액상화(Liquefaction)</div>
                                <div className="text-sm font-black text-slate-800">발생 가능성 없음</div>
                                <div className="text-[8px] text-emerald-600 mt-0.5">N치 및 세립토 기준 통과</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ════════ 2. 굴착/흙막이 & 배수/부력 (Cols 1-12) ════════ */}
                <div className="col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-5">
                    
                    {/* Earth Retaining & Excavation */}
                    <div className="bg-white rounded-xl border border-amber-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-amber-50 bg-gradient-to-r from-amber-50 to-white flex items-center gap-1.5">
                            <TrendingDown size={16} className="text-amber-600"/>
                            <span className="text-[12px] font-bold text-amber-800">지하 굴착 및 흙막이(Sheeting) 계획</span>
                        </div>
                        <div className="p-5 flex-1 flex flex-col gap-4">
                            <div className="flex bg-slate-50 p-3 rounded-lg border border-slate-100 items-center justify-between">
                                <div>
                                    <div className="text-[9px] font-bold text-slate-500 mb-0.5">적용 공법</div>
                                    <div className="text-[13px] font-black text-slate-800">CIP 공법 + 어스앵커(Earth Anchor)</div>
                                </div>
                                <div className="text-[10px] text-right text-slate-500">
                                    지하수 다량 산출 대비 <b>차수성 보통/강성 보통</b>의 우수한 밸런스
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div className="flex flex-col items-center bg-white border border-slate-100 rounded py-2 px-1 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                                    <div className="text-[9px] text-slate-500 font-bold mb-1">히빙 (Heaving)</div>
                                    <div className="text-[12px] font-black text-slate-700">FS 1.83</div>
                                    <div className="text-[8px] text-emerald-500 bg-emerald-50 px-1.5 rounded mt-1">기준 ≥ 1.5 만족</div>
                                </div>
                                <div className="flex flex-col items-center bg-white border border-slate-100 rounded py-2 px-1 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                                    <div className="text-[9px] text-slate-500 font-bold mb-1">파이핑 (Piping)</div>
                                    <div className="text-[12px] font-black text-slate-700">FS 2.45</div>
                                    <div className="text-[8px] text-emerald-500 bg-emerald-50 px-1.5 rounded mt-1">기준 ≥ 2.0 만족</div>
                                </div>
                                <div className="flex flex-col items-center bg-white border border-slate-100 rounded py-2 px-1 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                                    <div className="text-[9px] text-slate-500 font-bold mb-1">보일링 (Boiling)</div>
                                    <div className="text-[12px] font-black text-slate-700">FS 1.62</div>
                                    <div className="text-[8px] text-emerald-500 bg-emerald-50 px-1.5 rounded mt-1">기준 ≥ 1.5 만족</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Buoyancy & Dewatering */}
                    <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-blue-50 bg-gradient-to-r from-blue-50 to-white flex items-center gap-1.5">
                            <Droplets size={16} className="text-blue-600"/>
                            <span className="text-[12px] font-bold text-blue-800">배수/방수 계획 및 부력(Uplift) 검토</span>
                        </div>
                        <div className="p-5 flex flex-col gap-4">
                            {/* Buoyancy Check Gauge */}
                            <div>
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-[11px] font-bold text-slate-700">부력 안정성 (Safety Factor)</span>
                                    <span className="text-[10px] text-slate-500">기준: Fr / Fu ≥ 1.20</span>
                                </div>
                                <div className="h-6 w-full bg-slate-100 rounded-lg overflow-hidden flex shadow-inner relative border border-slate-200">
                                    <div className="bg-emerald-500 h-full flex items-center pl-3" style={{width: '65%'}}>
                                        <span className="text-[10px] text-white font-bold tracking-wider">안전율 1.35</span>
                                    </div>
                                    <div className="absolute right-3 top-0 h-full flex items-center text-[9px] text-slate-500 font-bold pr-2">+ 부력앵커 연동</div>
                                </div>
                            </div>
                            
                            <div className="space-y-2 mt-2">
                                <div className="flex items-center gap-2 text-[10px]">
                                    <Anchor size={12} className="text-blue-500 shrink-0"/> 
                                    <span className="w-16 font-bold text-slate-700 shrink-0">지하수 처리</span>
                                    <span className="text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-100 flex-1 leading-snug">유공관 및 집수정 펌핑을 통한 영구배수 공법 적용</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px]">
                                    <Droplets size={12} className="text-blue-500 shrink-0"/> 
                                    <span className="w-16 font-bold text-slate-700 shrink-0">방수 계획</span>
                                    <span className="text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-100 flex-1 leading-snug">지하 내벽 결정성 방수 / 최하층 바닥 도막+시트방수</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ════════ 3. 리스크 및 이슈 관리 ════════ */}
                <div className="col-span-12 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <div className="flex items-center gap-1.5 mb-4">
                        <ShieldAlert size={18} className="text-slate-700" />
                        <h3 className="text-sm font-extrabold text-slate-800">지반 리스크 관리 (Risk & Mitigation)</h3>
                        <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-1.5 py-0.5 rounded ml-2">인허가 핵심</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px] text-slate-600">
                            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
                                <tr>
                                    <th className="px-3 py-2 rounded-tl-lg w-1/3">지반/토목 리스크 항목</th>
                                    <th className="px-3 py-2 w-20 text-center">영향도</th>
                                    <th className="px-3 py-2 rounded-tr-lg">설계 대책 / 저감 방안</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-3 py-2.5 font-bold text-slate-700">수중운동실 부력으로 인한 구조물 부상 우려</td>
                                    <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">상</span></td>
                                    <td className="px-3 py-2.5">부력앵커(Rock Anchor) 추가 설계 및 영구배수 펌핑 시스템 병행 적용</td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-3 py-2.5 font-bold text-slate-700">지하 암반 출현에 따른 굴착 소음·진동 민원</td>
                                    <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">중</span></td>
                                    <td className="px-3 py-2.5">발파를 배제하고 무진동 암반절삭 도목공법, 필요 시 프리보링 병행계획 수립</td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-3 py-2.5 font-bold text-slate-700">굴착 중 인접 건물 및 도로 지표 침하</td>
                                    <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">상</span></td>
                                    <td className="px-3 py-2.5">CIP 벽체 강성 증대, 지중경사계/지표침하계 등 AI 연동 실시간 계측 모니터링망 구축</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ═══════════════ ENGINEERING METRICS SEAL ═══════════════ */}
            <div className="absolute bottom-6 left-6 right-6 bg-white rounded-lg p-3 shadow-lg border border-slate-200 flex items-center justify-between pointer-events-none z-50">
                <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
                    <div className="bg-amber-600 text-white p-1.5 rounded-lg shadow-sm">
                        <Cpu size={16} />
                    </div>
                    <div>
                        <div className="text-[11px] font-black text-slate-800 leading-none mb-1">GEOTECHNICAL CORE</div>
                        <div className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Calculated Metrics Verified</div>
                    </div>
                </div>
                <div className="flex-1 flex justify-evenly text-[10px] font-medium px-2">
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">기초 설계</span><span className="text-slate-500 text-[9px]">Mat + Pile 혼용</span></div>
                    <div className="w-[1px] h-6 bg-slate-200"></div>
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">흙막이 구조</span><span className="text-slate-500 text-[9px]">CIP + 어스앵커</span></div>
                    <div className="w-[1px] h-6 bg-slate-200"></div>
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">허용지내력</span><span className="text-slate-500 text-[9px]">300 kN/m² 이상</span></div>
                    <div className="w-[1px] h-6 bg-slate-200"></div>
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">부력 안전율</span><span className="text-slate-500 text-[9px]">1.35 (FS 강건)</span></div>
                </div>
            </div>
        </div>
    );
};

const BoringLogDiagram = () => (
    <svg viewBox="0 0 150 150" className="w-[80%] h-auto max-w-[150px] mx-auto drop-shadow-sm">
        {/* Ground */}
        <path d="M 10 10 L 140 10" stroke="#16a34a" strokeWidth="3" />
        <path d="M 10 10 L 30 5 L 40 10 L 60 5" fill="none" stroke="#16a34a" strokeWidth="1" opacity="0.5"/>
        <text x="10" y="22" fontSize="8" fill="#64748b" fontWeight="bold">매립층(Fill)</text>
        
        {/* Soil layers */}
        <rect x="10" y="25" width="130" height="25" fill="#fef08a" opacity="0.7"/>
        <text x="15" y="40" fontSize="8" fill="#a16207" fontStyle="italic">사질토 N=12</text>
        
        <rect x="10" y="50" width="130" height="35" fill="#fed7aa" opacity="0.6"/>
        <text x="15" y="70" fontSize="8" fill="#c2410c" fontStyle="italic">점토층 Cu=45</text>
        
        {/* Weathered Rock */}
        <path d="M 10 85 L 140 85" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3"/>
        <rect x="10" y="85" width="130" height="35" fill="#cbd5e1" opacity="0.5"/>
        <text x="15" y="105" fontSize="8" fill="#475569" fontWeight="bold">풍화암 N &gt; 50</text>
        
        {/* Hard Rock */}
        <rect x="10" y="120" width="130" height="20" fill="#94a3b8"/>
        <text x="15" y="132" fontSize="8" fill="#334155" fontWeight="bold">연암</text>

        {/* Borehole cylinder & Water table */}
        <rect x="100" y="5" width="10" height="130" fill="#e2e8f0" stroke="#cbd5e1"/>
        <path d="M 90 35 L 120 35" stroke="#0ea5e9" strokeWidth="1"/>
        <polygon points="105,35 100,40 110,40" fill="#0ea5e9"/>
    </svg>
)

export default CivilEngineeringPanel;
