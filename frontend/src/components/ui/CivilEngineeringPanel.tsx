import React from 'react';
import { MapPin, Mountain, TrendingDown, ShieldAlert, Cpu, Activity, Droplets, Anchor, Sparkles, Navigation, Waves, Eye } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';

/* ═══════════════════════════════════════════════════════════════
   C-2  토목 및 지반 엔지니어링 분석 모듈
   SKILL: F1 GeoScanner · F2 FoundationOpt · F3 ExcaGuard · F4 WaterFlow · F5 NeighborShield
   Layout: 12-Column Cyber-Dashboard · ARCHE Orange CI · V3.0 AI Simulated
   ═══════════════════════════════════════════════════════════════ */

const CivilEngineeringPanel = () => {
    const store = useProjectStore();

    // ─── Dynamic: 지하 층수에 따른 흙막이 계산 로직 ───
    const basementFloors = (store as any).undergroundFloors ?? 3;
    const depth = basementFloors * 3.5; // 평균 지하 1개층 3.5m 가정
    
    // F3 팝업 경고 (지하 2층 이상)
    const showDeepExcavationAlert = basementFloors >= 2;

    const excavationData = basementFloors <= 1
        ? { method: 'H-Pile + 흙막이판', heaving: '2.15', piping: '2.85', boiling: '2.10', depth }
        : basementFloors <= 3
        ? { method: 'CIP + 어스앵커(Earth Anchor)', heaving: '1.83', piping: '2.45', boiling: '1.62', depth }
        : { method: '지하연속벽(Slurry Wall) + Top-Down', heaving: '1.58', piping: '2.05', boiling: '1.51', depth };

    return (
        <div className="h-full flex flex-col bg-slate-50 overflow-y-auto custom-scrollbar font-sans relative">

            {/* ════════════ STICKY HEADER ════════════ */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-4 shrink-0">
                <div className="max-w-[1600px] mx-auto flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <MapPin className="text-orange-500" size={22} />
                            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
                                인공지능 토목·지반 엔지니어링 분석서
                            </h2>
                            <span className="ml-2 text-[9px] font-black tracking-widest bg-orange-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                                <Sparkles size={10} /> V3.0 AI SIMULATED
                            </span>
                        </div>
                        <p className="text-slate-500 text-[12px] font-medium">
                            ARCHE ARCHI · Phase C. 엔지니어링 · 지층 프로파일링 / 기초 최적화 / 흙막이 / 방수 / 인접지 간섭
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px]">
                        <span className="px-2 py-1 rounded-full bg-orange-50 text-orange-700 font-bold border border-orange-200">
                            {store.projectName || '프로젝트'}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 font-bold">
                            지하 {basementFloors}층 규모
                        </span>
                    </div>
                </div>
            </div>

            {/* ════════════ MAIN GRID: 12-Column Cyber-Dashboard ════════════ */}
            <div className="flex-1 px-6 py-5">
                <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-5 pb-28">

                    {/* ═══════ SKILL ROADMAP SIDEBAR (Col 1-3) ═══════ */}
                    <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">

                        {/* F-Series SKILL Modules Status */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                            <div className="text-[10px] font-bold tracking-widest text-orange-600 mb-3">F-SERIES SKILL MODULES</div>
                            {[
                                { id: 'F1', name: 'GeoScanner', desc: '지층 프로파일 및 연약지반', icon: <Mountain size={14}/>, status: 'Running' },
                                { id: 'F2', name: 'FoundationOpt', desc: '기초 지지력/침하 시뮬레이션', icon: <Anchor size={14}/>, status: 'Running' },
                                { id: 'F3', name: 'ExcaGuard', desc: '흙막이 가시설 안정성', icon: <TrendingDown size={14}/>, status: 'Running' },
                                { id: 'F4', name: 'WaterFlow', desc: '부력 제어 및 영구 배수/방수', icon: <Droplets size={14}/>, status: 'Running' },
                                { id: 'F5', name: 'NeighborShield', desc: '인접 구조물 센싱 및 회피', icon: <Eye size={14}/>, status: 'Standby' },
                            ].map((mod, i) => (
                                <div key={i} className="flex items-center gap-2.5 py-2 border-b border-slate-50 last:border-b-0">
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${mod.status === 'Running' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400'}`}>
                                        {mod.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] font-black text-slate-700">{mod.id}</span>
                                            <span className="text-[9px] text-slate-500 font-medium truncate">{mod.name}</span>
                                        </div>
                                        <div className="text-[9px] text-slate-400 truncate">{mod.desc}</div>
                                    </div>
                                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${mod.status === 'Running' ? 'bg-orange-50 text-orange-600 border border-orange-200' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>
                                        {mod.status}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* 부력 안전율 (Gauge Placeholder) */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                            <div className="flex items-center gap-1.5 mb-3">
                                <Waves size={14} className="text-orange-500"/>
                                <span className="text-[10px] font-bold text-slate-800">지하수 부력 대응 (Fu)</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="bg-slate-50 rounded-lg p-2.5 text-center border border-slate-100">
                                    <div className="text-[8px] text-slate-500">영구 안전율 (Fs)</div>
                                    <div className="text-lg font-black text-orange-600">1.35<span className="text-[9px] font-normal text-slate-400 ml-1">≥ 1.20</span></div>
                                </div>
                                <div className="text-[9px] text-center text-orange-700 font-bold bg-orange-50 border border-orange-100 py-1.5 rounded">
                                    Rock Anchor 145본 배치 완료
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ═══════ MAIN CONTENT AREA (Col 4-12) ═══════ */}
                    <div className="col-span-12 lg:col-span-9 flex flex-col gap-5">

                        {/* ─── SECTION 1: F1 지층 프로파일링 & F2 기초 구조 ─── */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row">
                            
                            {/* F1: GeoScanner */}
                            <div className="w-full lg:w-5/12 p-5 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col relative overflow-hidden bg-gradient-to-br from-slate-50 to-white">
                                <div className="flex items-center gap-1.5 mb-4 relative z-10">
                                    <Activity size={16} className="text-orange-500" />
                                    <span className="text-[12px] font-extrabold text-slate-800">F1 · GeoScanner — 3D 지층 단면 스캔</span>
                                </div>
                                <div className="flex-1 flex items-center justify-center p-2 mb-2 relative z-10">
                                    <BoringLogDiagram />
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-center relative z-10">
                                    <div className="bg-white border border-slate-200 p-2 rounded-lg shadow-sm">
                                        <div className="text-[9px] text-slate-500">풍화암 출현 심도</div>
                                        <div className="text-[12px] font-black text-slate-700">GL -8.5m</div>
                                    </div>
                                    <div className="bg-white border text-center border-slate-200 p-2 rounded-lg shadow-sm">
                                        <div className="text-[9px] text-slate-500">지하수위 (GL)</div>
                                        <div className="text-[12px] font-black text-orange-600">-3.2m</div>
                                    </div>
                                </div>
                            </div>

                            {/* F2: FoundationOpt */}
                            <div className="w-full lg:w-7/12 p-6 flex flex-col justify-center bg-white">
                                <div className="flex items-center gap-2 mb-2">
                                    <Anchor size={16} className="text-orange-500" />
                                    <h3 className="text-[12px] font-extrabold text-slate-800 tracking-tight">F2 · FoundationOpt — 기초 최적화</h3>
                                </div>
                                <p className="text-[11px] text-slate-600 leading-relaxed font-medium mb-5 bg-orange-50/50 p-3 rounded-lg border border-orange-100">
                                    Terzaghi 지지력 공식 연산 결과, 일반 구간은 허용지내력이 확보되어 
                                    <span className="font-bold text-slate-800"> 얕은기초(Mat Foundation)</span>를 적용하며, 연약층(N&lt;10) 심도가 깊은 후면부는 
                                    <span className="font-bold text-orange-600"> PHC 말뚝기초</span>를 국부 혼용 설계합니다.
                                </p>
                                
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="border-l-4 border-orange-500 bg-white shadow-sm p-3 rounded-r-lg border-y border-r border-slate-100 hover:bg-slate-50 transition-colors">
                                        <div className="text-[10px] text-slate-500 font-bold mb-1">허용지내력 (qa)</div>
                                        <div className="text-sm font-black text-slate-800">300<span className="text-[10px] font-normal ml-0.5 text-slate-500">kN/m²</span></div>
                                        <div className="text-[8px] text-orange-600 mt-0.5">안전율(FS) 3.0 만족</div>
                                    </div>
                                    <div className="border-l-4 border-orange-500 bg-white shadow-sm p-3 rounded-r-lg border-y border-r border-slate-100 hover:bg-slate-50 transition-colors">
                                        <div className="text-[10px] text-slate-500 font-bold mb-1">예상 부등 침하</div>
                                        <div className="text-sm font-black text-slate-800">18.5<span className="text-[10px] font-normal ml-0.5 text-slate-500">mm</span></div>
                                        <div className="text-[8px] text-orange-600 mt-0.5">각변위 1/300 이하 PASS</div>
                                    </div>
                                    <div className="border-l-4 border-slate-400 bg-white shadow-sm p-3 rounded-r-lg border-y border-r border-slate-100 hover:bg-slate-50 transition-colors">
                                        <div className="text-[10px] text-slate-500 font-bold mb-1">액상화(Liquefaction)</div>
                                        <div className="text-sm font-black text-slate-800">발생 확률 낮음</div>
                                        <div className="text-[8px] text-slate-500 mt-0.5">세립토 기준 통과</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ─── SECTION 2: F3 흙막이(ExcaGuard) & F4 부력/방수 (WaterFlow) (2-Column) ─── */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            
                            {/* F3: ExcaGuard */}
                            <div className="bg-white rounded-xl border border-orange-100 shadow-sm overflow-hidden flex flex-col relative">
                                {showDeepExcavationAlert && (
                                    <div className="absolute top-3 right-3 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500" title="심도 굴착 경고 활성화"></span>
                                    </div>
                                )}
                                <div className="p-4 border-b border-orange-50 flex items-center gap-1.5">
                                    <TrendingDown size={16} className="text-orange-600"/>
                                    <span className="text-[12px] font-extrabold text-slate-800">F3 · ExcaGuard — 3D 굴착/흙막이 안정성</span>
                                </div>
                                <div className="p-5 flex flex-col gap-4">
                                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="text-[9px] font-bold text-slate-500">적용 공법 (지하 {basementFloors}층, 약 H={excavationData.depth}m)</div>
                                            {showDeepExcavationAlert && <span className="text-[8px] bg-red-100 text-red-600 px-1 py-0.5 rounded font-bold">심층 굴착 모드</span>}
                                        </div>
                                        <div className="text-[13px] font-black text-slate-800">{excavationData.method}</div>
                                        <div className="text-[9px] text-orange-700 mt-1">도심 공간 및 굴착 심도 증가에 따른 최적 안정성 / 시공성 밸런스</div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="flex flex-col items-center bg-white border border-slate-100 rounded-lg py-2 shadow-sm">
                                            <div className="text-[9px] text-slate-500 font-bold mb-1">히빙 (Heaving)</div>
                                            <div className="text-[14px] font-black text-slate-700">{excavationData.heaving}</div>
                                            <div className="text-[8px] text-orange-600 bg-orange-50 px-1.5 rounded mt-1 font-bold">FS ≥ 1.5</div>
                                        </div>
                                        <div className="flex flex-col items-center bg-white border border-slate-100 rounded-lg py-2 shadow-sm">
                                            <div className="text-[9px] text-slate-500 font-bold mb-1">파이핑 (Piping)</div>
                                            <div className="text-[14px] font-black text-slate-700">{excavationData.piping}</div>
                                            <div className="text-[8px] text-orange-600 bg-orange-50 px-1.5 rounded mt-1 font-bold">FS ≥ 2.0</div>
                                        </div>
                                        <div className="flex flex-col items-center bg-white border border-slate-100 rounded-lg py-2 shadow-sm">
                                            <div className="text-[9px] text-slate-500 font-bold mb-1">보일링 (Boiling)</div>
                                            <div className="text-[14px] font-black text-slate-700">{excavationData.boiling}</div>
                                            <div className="text-[8px] text-orange-600 bg-orange-50 px-1.5 rounded mt-1 font-bold">FS ≥ 1.5</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* F4: WaterFlow & F5: NeighborShield */}
                            <div className="flex flex-col gap-5">
                                {/* F4 WaterFlow */}
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1">
                                    <div className="p-3 border-b border-slate-100 flex items-center gap-1.5">
                                        <Droplets size={14} className="text-orange-500"/>
                                        <span className="text-[11px] font-extrabold text-slate-800">F4 · WaterFlow — 부력/영구배수</span>
                                    </div>
                                    <div className="p-4 flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-[10px]">
                                            <Anchor size={12} className="text-orange-500 shrink-0"/> 
                                            <span className="w-16 font-bold text-slate-700 shrink-0">지하수 처리</span>
                                            <span className="text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-100 flex-1 leading-snug">펌핑 영구배수 + Rock Anchor 혼합</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px]">
                                            <ShieldAlert size={12} className="text-orange-500 shrink-0"/> 
                                            <span className="w-16 font-bold text-slate-700 shrink-0">방수 계획</span>
                                            <span className="text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-100 flex-1 leading-snug">지하외벽 결정성 방수 / 바닥 도막 복합</span>
                                        </div>
                                    </div>
                                </div>
                                {/* F5 NeighborShield */}
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1">
                                    <div className="p-3 border-b border-slate-100 flex items-center gap-1.5">
                                        <Eye size={14} className="text-slate-400"/>
                                        <span className="text-[11px] font-extrabold text-slate-800">F5 · NeighborShield — 인접 간섭</span>
                                    </div>
                                    <div className="p-4 flex flex-col justify-center">
                                         <div className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                                            <span className="font-bold text-orange-600 block mb-1">영향권 반경 H×2.0 이내 스캔:</span>
                                            지중경사계, 수위계 계측망 구축 및 Peck 경험식에 따른 인접 구조물 침하 방어 알고리즘 가동 예정.
                                         </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* ─── SECTION 3: 리스크 및 이슈 관리 (Bottom Width) ─── */}
                        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                            <div className="flex items-center gap-1.5 mb-4">
                                <ShieldAlert size={18} className="text-slate-700" />
                                <h3 className="text-sm font-extrabold text-slate-800">지반 및 토목 리스크 관리 (Risk & Mitigation)</h3>
                                <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-1.5 py-0.5 rounded ml-2 border border-orange-200">인허가 핵심</span>
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
                                        <tr className="hover:bg-orange-50/30 transition-colors">
                                            <td className="px-3 py-2.5 font-bold text-slate-700">우수기 지하수위 상승으로 인한 구조물 부력 부상</td>
                                            <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-bold">상</span></td>
                                            <td className="px-3 py-2.5">부력앵커(Rock Anchor) 추가 설계 및 영구배수 펌핑 시스템 이중화</td>
                                        </tr>
                                        <tr className="hover:bg-orange-50/30 transition-colors">
                                            <td className="px-3 py-2.5 font-bold text-slate-700">연암/경암 구간 굴착 시 발생되는 도심지 소음·진동 민원</td>
                                            <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">중</span></td>
                                            <td className="px-3 py-2.5">전면 발파를 배제하고 무진동 미진동 암반 파쇄 공법 적용 검토</td>
                                        </tr>
                                        <tr className="hover:bg-orange-50/30 transition-colors">
                                            <td className="px-3 py-2.5 font-bold text-slate-700">굴착 중 배면 토압에 의한 인접 건물 및 도로 지표 침하</td>
                                            <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-bold">상</span></td>
                                            <td className="px-3 py-2.5">CIP 벽체 강성 증대, F5 모듈 기반 IoT 실시간 침하 계측망(SHM) 운영</td>
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
                        <div className="bg-amber-600 text-white p-1.5 rounded-lg shadow-sm">
                            <Cpu size={16} />
                        </div>
                        <div>
                            <div className="text-[11px] font-black text-white leading-none mb-0.5">GEOTECHNICAL CORE ENGINE</div>
                            <div className="text-[8px] text-slate-400 uppercase font-bold tracking-widest">Calculated Metrics Verified · V3.0</div>
                        </div>
                    </div>
                    <div className="flex-1 flex justify-evenly text-[10px] font-medium px-3">
                        {[
                            { label: '기초 설계', value: 'Mat + PHC Pile 혼용' },
                            { label: '흙막이 가시설', value: excavationData.method },
                            { label: '허용지내력', value: '300 kN/m² 이상 (평균)' },
                            { label: '부력 안전율', value: '1.35 (FS 강건)' },
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

export default CivilEngineeringPanel;

// ======================= Sub Components & SVGs (ARCHE Orange CI) =======================

const BoringLogDiagram = () => (
    <svg viewBox="0 0 150 150" className="w-[80%] h-auto max-w-[150px] mx-auto drop-shadow-sm">
        {/* Ground */}
        <path d="M 10 10 L 140 10" stroke="#f97316" strokeWidth="3" />
        <path d="M 10 10 L 30 5 L 40 10 L 60 5" fill="none" stroke="#f97316" strokeWidth="1" opacity="0.5"/>
        <text x="10" y="22" fontSize="8" fill="#64748b" fontWeight="bold">매립층(Fill)</text>
        
        {/* Soil layers */}
        <rect x="10" y="25" width="130" height="25" fill="#fef08a" opacity="0.7"/>
        <text x="15" y="40" fontSize="8" fill="#a16207" fontStyle="italic">사질토 N=12</text>
        
        <rect x="10" y="50" width="130" height="35" fill="#fed7aa" opacity="0.6"/>
        <text x="15" y="70" fontSize="8" fill="#c2410c" fontStyle="italic">점성토 N &lt; 10</text>
        
        {/* Weathered Rock */}
        <path d="M 10 85 L 140 85" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3"/>
        <rect x="10" y="85" width="130" height="35" fill="#cbd5e1" opacity="0.5"/>
        <text x="15" y="105" fontSize="8" fill="#475569" fontWeight="bold">풍화암 N &gt; 50</text>
        
        {/* Hard Rock */}
        <rect x="10" y="120" width="130" height="20" fill="#94a3b8"/>
        <text x="15" y="132" fontSize="8" fill="#334155" fontWeight="bold">연암</text>

        {/* Borehole cylinder & Water table */}
        <rect x="100" y="5" width="10" height="130" fill="#e2e8f0" stroke="#cbd5e1"/>
        <path d="M 90 35 L 120 35" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="2 1"/>
        <polygon points="105,35 100,40 110,40" fill="#0ea5e9"/>
        <text x="122" y="38" fontSize="7" fill="#0284c7" fontWeight="bold">GWL (-3.2m)</text>
    </svg>
);
