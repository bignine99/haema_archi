import React from 'react';
import { Settings, ShieldAlert, Cpu, SearchCheck, Activity, Wind, Layers } from 'lucide-react';

const StructuralEngineeringPanel = () => {
    return (
        <div className="h-full flex flex-col p-6 bg-slate-50 overflow-y-auto custom-scrollbar font-sans relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 shrink-0 z-10">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <Settings className="text-slate-600" size={24} />
                        구조 엔지니어링 분석서
                    </h2>
                    <p className="text-slate-500 text-sm mt-1 font-medium">
                        구조 시스템 계획 및 구조 해석 / 내진 설계 통합 시뮬레이션 결과
                    </p>
                </div>
            </div>

            {/* Grid Content */}
            <div className="flex-1 grid grid-cols-12 gap-5 pb-24 relative">
                
                {/* ═══════════════ 1. 구조 시스템 최적화 모듈 (Col 1-12) ═══════════════ */}
                <div className="col-span-12 bg-white rounded-xl border border-slate-200 p-0 shadow-sm flex flex-col md:flex-row overflow-hidden relative">
                    {/* Left: Overall Structural Strategy Info */}
                    <div className="w-full md:w-3/12 p-6 flex flex-col justify-between border-r border-slate-100 bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden">
                        <div className="absolute top-[-20%] right-[-20%] opacity-5"><Settings size={180} /></div>
                        <div className="relative z-10">
                            <div className="text-[10px] font-bold tracking-widest text-slate-500 mb-2">STRUCTURAL STRATEGY</div>
                            <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight leading-tight mb-2">하이브리드<br />구조 시스템</h3>
                            <p className="text-[11px] text-slate-600 leading-relaxed font-medium mb-4">
                                용도와 하중 특성에 맞춘 이종(RC+철골+PC) 하이브리드 구조 설계를 통해 시공성과 경제성을 극대화합니다.
                            </p>
                        </div>
                        <div className="relative z-10 bg-white p-3 rounded-lg border border-slate-200 shadow-sm mt-4">
                            <div className="flex items-center gap-1.5 mb-2">
                                <SearchCheck size={14} className="text-slate-600"/>
                                <span className="text-[10px] font-bold text-slate-800">BIM 3D 간섭 체크</span>
                            </div>
                            <div className="flex bg-slate-50 rounded border border-slate-100 p-1">
                                <div className="flex-1 text-center border-r border-slate-200 px-1">
                                    <div className="text-[8px] text-slate-500">배관/구조 크래시</div>
                                    <div className="text-[12px] font-black text-emerald-600">0<span className="text-[8px] font-normal">건</span></div>
                                </div>
                                <div className="flex-1 text-center px-1">
                                    <div className="text-[8px] text-slate-500">통합 최적화율</div>
                                    <div className="text-[12px] font-black text-blue-600">98<span className="text-[8px] font-normal">%</span></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle: RC vs PC vs Steel Matrix */}
                    <div className="w-full md:w-5/12 p-5 border-r border-slate-100 flex flex-col justify-center gap-3">
                        <div className="text-[11px] font-bold text-slate-800 mb-1">부위별 최적 구조 시스템 제안</div>
                        {[
                            { title: 'RC (철근콘크리트)', usage: '일반교실 및 관리동', pros: '진동 저감 능력이 우수하며 심리적 안정감을 제공', color: 'blue' },
                            { title: 'Steel (철골)', usage: '대강당 및 체육관', pros: '장스팬 무주공간 확보에 최적화, 경량화 달성', color: 'orange' },
                            { title: 'PC (프리캐스트)', usage: '지하주차장 및 코어', pros: '공기 단축 획기적 절감 및 모듈화 품질 균일성 보장', color: 'emerald' },
                        ].map((sys, i) => (
                            <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border bg-white shadow-sm transition-all hover:bg-slate-50
                                ${sys.color === 'blue' ? 'border-l-4 border-l-blue-500 border-t-slate-100 border-r-slate-100 border-b-slate-100' : 
                                  sys.color === 'orange' ? 'border-l-4 border-l-orange-500 border-t-slate-100 border-r-slate-100 border-b-slate-100' : 
                                  'border-l-4 border-l-emerald-500 border-t-slate-100 border-r-slate-100 border-b-slate-100'}
                            `}>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <h4 className="text-[12px] font-bold text-slate-800">{sys.title}</h4>
                                        <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">{sys.usage}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 leading-tight">{sys.pros}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right: Post-Tension Optimization Diagram */}
                    <div className="w-full md:w-4/12 p-5 flex flex-col bg-slate-50">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-[11px] font-bold text-slate-800">포스트텐션(PT) 장스팬 최적화</h4>
                            <span className="text-[9px] bg-orange-100 text-orange-700 px-1.5 py-0.5 border border-orange-200 rounded font-black">높이 30cm 확보</span>
                        </div>
                        <div className="flex-1 bg-white border border-slate-200 rounded p-3 flex flex-col shadow-inner">
                            <div className="flex-1 relative flex items-center justify-center">
                                <PostTensionDiagram />
                            </div>
                            <div className="mt-3 text-[9px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                                <span className="font-bold text-slate-700 mr-1">시뮬레이션 결과:</span>
                                일반 RC보 대비 Beam 깊이를 축소시켜 층고 제한 내에서도 <span className="text-orange-600 font-bold">내부 체감 층고 300mm 추가 확보</span> 및 배관 스페이스 최적화.
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══════════════ 2. 내진 설계 및 동적 해석 (Col 1-12) ═══════════════ */}
                <div className="col-span-12 bg-white rounded-xl border border-red-100 shadow-sm flex overflow-hidden lg:h-[220px]">
                    <div className="w-full md:w-4/12 p-5 bg-gradient-to-br from-red-50 to-white border-r border-red-50 flex flex-col justify-center">
                        <div className="flex items-center gap-1.5 mb-2">
                            <ShieldAlert size={16} className="text-red-500" />
                            <span className="text-[11px] font-bold text-red-700">재난 및 내진 구조 검토</span>
                        </div>
                        <h4 className="text-xl font-extrabold text-slate-800 mb-2">KDS 41 17 내진 특등급</h4>
                        <p className="text-[11px] text-slate-600 mb-4">비선형 동적해석 및 성능기반 설계를 통한 최고 수준의 재난 안전성 확보 결과입니다.</p>
                        <div className="flex flex-col gap-2">
                            <div className="bg-white px-3 py-2 rounded border border-red-100 text-[11px] flex items-center justify-between">
                                <span className="text-slate-600 font-medium">건축물 중요도 계수 (I)</span>
                                <span className="font-black text-red-600">1.5 적용</span>
                            </div>
                            <div className="bg-white px-3 py-2 rounded border border-red-100 text-[11px] flex items-center justify-between">
                                <span className="text-slate-600 font-medium">허용 층간변위 (Drift)</span>
                                <span className="font-extrabold text-slate-800">H/250 이내</span>
                            </div>
                            <div className="bg-white px-3 py-2 rounded border border-red-100 text-[11px] flex items-center justify-between">
                                <span className="text-slate-600 font-medium">동적 해석 (탄성거동 확보)</span>
                                <span className="font-extrabold text-emerald-600">PASS</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-8/12 p-3 bg-slate-50 flex items-center justify-center relative">
                        <SeismicDiagram />
                        <div className="absolute top-3 right-3 text-[10px] bg-white border border-slate-200 px-2 py-1 flex items-center gap-1 shadow-sm rounded font-medium">
                            <Activity size={12} className="text-red-500"/> 동적 지진하중 변위 시뮬레이션
                        </div>
                    </div>
                </div>

                {/* ═══════════════ 3. 하중 시뮬레이션 및 배근율 최적화 (Col 1-12) ═══════════════ */}
                <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-5 mt-1">
                    {/* Load Simulation */}
                    <div className="bg-white rounded-xl border border-blue-100 shadow-sm flex flex-col p-5">
                        <div className="flex items-center gap-1.5 mb-3">
                            <Wind size={16} className="text-blue-500" />
                            <span className="text-[11px] font-bold text-slate-700">풍하중 및 적설하중 검토</span>
                        </div>
                        <div className="flex items-center gap-5 flex-1 p-2">
                             <div className="flex-1 max-w-[120px] bg-slate-50 flex items-center justify-center rounded-lg border border-slate-100 shadow-inner p-3 relative h-[100px]">
                                 <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-sm">
                                    <path d="M 20 70 L 20 20 L 50 10 L 80 20 L 80 70 Z" fill="#e2e8f0" stroke="#94a3b8" />
                                    {/* Wind Arrows horizontally */}
                                    <path d="M 0 35 L 20 35" stroke="#3b82f6" strokeWidth="2" />
                                    <polygon points="20,35 15,32 15,38" fill="#3b82f6" />
                                    <path d="M 0 55 L 20 55" stroke="#3b82f6" strokeWidth="2" />
                                    <polygon points="20,55 15,52 15,58" fill="#3b82f6" />
                                    {/* Snow Arrows vertically */}
                                    <path d="M 40 0 L 40 12" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="2 1" />
                                    <polygon points="40,12 37,8 43,8" fill="#0ea5e9" />
                                    <path d="M 60 0 L 60 12" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="2 1" />
                                    <polygon points="60,12 57,8 63,8" fill="#0ea5e9" />
                                 </svg>
                             </div>
                             <div className="flex-1 flex flex-col justify-center gap-2">
                                <div className="text-[11px] text-slate-500"><span className="font-bold text-slate-700">기본 풍속 (V0):</span> 26 m/s</div>
                                <div className="text-[11px] text-slate-500"><span className="font-bold text-slate-700">노풍도 구분:</span> C (자유풍)</div>
                                <div className="text-[11px] text-slate-500"><span className="font-bold text-slate-700">기본 적설하중:</span> 0.5 kN/m²</div>
                                <div className="text-[10px] text-blue-800 bg-blue-50 p-2 rounded border border-blue-100 font-medium leading-tight mt-1">
                                    외벽체 내풍압 및 대강당 무주공간 지붕 적설하중 안전성 3D 시뮬레이션 완료
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* Rebar Ratio */}
                    <div className="bg-white rounded-xl border border-orange-100 shadow-sm flex flex-col p-5">
                        <div className="flex items-center gap-1.5 mb-3">
                            <Layers size={16} className="text-orange-500" />
                            <span className="text-[11px] font-bold text-slate-700">AI 철근 배근율 (Rebar Ratio) 최적화</span>
                        </div>
                        <div className="flex flex-col gap-4 flex-1 justify-center px-1">
                            <div className="flex flex-col gap-1.5">
                                <div className="flex justify-between text-[11px] font-bold"><span className="text-slate-600">기둥/벽체 수직부재</span><span className="text-orange-600">85~110 kg/m³</span></div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner"><div className="h-full bg-gradient-to-r from-orange-300 to-orange-500" style={{width: '55%'}}></div></div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="flex justify-between text-[11px] font-bold"><span className="text-slate-600">보/슬래브 수평부재</span><span className="text-amber-600">110~135 kg/m³</span></div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner"><div className="h-full bg-gradient-to-r from-amber-300 to-amber-500" style={{width: '70%'}}></div></div>
                            </div>
                            <div className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 leading-snug mt-1">
                                단면 최적화 알고리즘을 통한 배근 배치 개선. 기준 대비 <span className="font-bold text-emerald-600">약 5~8% 철근 물량 절약</span> 및 단부 간섭 해소.
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══════════════ 4. 리스크 및 이슈 관리 (Col 1-12) ═══════════════ */}
                <div className="col-span-12 bg-white rounded-xl border border-slate-200 p-5 shadow-sm mt-1">
                    <div className="flex items-center gap-1.5 mb-4">
                        <ShieldAlert size={18} className="text-slate-700" />
                        <h3 className="text-sm font-extrabold text-slate-800">리스크 및 이슈 관리 (Risk & Issue Management)</h3>
                        <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded ml-2">필수 검토사항</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px] text-slate-600">
                            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
                                <tr>
                                    <th className="px-3 py-2 rounded-tl-lg">리스크 항목</th>
                                    <th className="px-3 py-2 w-20 text-center">영향도</th>
                                    <th className="px-3 py-2 w-24 text-center">발생 가능성</th>
                                    <th className="px-3 py-2 rounded-tr-lg">대응 방안</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-3 py-2.5 font-bold text-slate-700">장스팬 구조로 인한 처짐·진동 문제</td>
                                    <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">중</span></td>
                                    <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">중</span></td>
                                    <td className="px-3 py-2.5">단면 확대 최소화를 위한 포스트텐션(PT) 적용 및 바닥진동(1.0% g 이내) 정밀 검토</td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-3 py-2.5 font-bold text-slate-700">건축 비정형 형태(복합 용도)로 인한 구조 복잡도 증가</td>
                                    <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">상</span></td>
                                    <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">중</span></td>
                                    <td className="px-3 py-2.5">설계 초기 단계부터 건축·구조 BIM 3D 간섭 체크 및 최적 접합부(Hybrid) 사전 조율</td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-3 py-2.5 font-bold text-slate-700">풍하중에 의한 고층부 층간변위 및 비틀림 현상 우려</td>
                                    <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">중</span></td>
                                    <td className="px-3 py-2.5 text-center"><span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">하</span></td>
                                    <td className="px-3 py-2.5">코어월 중앙 배치로 강성 중심(CR)과 질량 중심(CM) 편심 최소화 및 비틀림 불규칙성 선제 해결</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

             {/* ═══════════════ ENGINEERING METRICS SEAL ═══════════════ */}
             <div className="absolute bottom-6 left-6 right-6 bg-white rounded-lg p-3 shadow-lg border border-slate-200 flex items-center justify-between pointer-events-none z-50">
                <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
                    <div className="bg-blue-500 text-white p-1.5 rounded-lg shadow-sm">
                        <Cpu size={16} />
                    </div>
                    <div>
                        <div className="text-[11px] font-black text-slate-800 leading-none mb-1">STRUCTURAL CORE</div>
                        <div className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Calculated Metrics Verified</div>
                    </div>
                </div>
                <div className="flex-1 flex justify-evenly text-[10px] font-medium px-2">
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">주요 구조</span><span className="text-slate-500 text-[9px]">하이브리드 (RC+S+PC)</span></div>
                    <div className="w-[1px] h-6 bg-slate-200"></div>
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">내진 등급</span><span className="text-slate-500 text-[9px]">특등급 (I=1.5)</span></div>
                    <div className="w-[1px] h-6 bg-slate-200"></div>
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">슬래브</span><span className="text-slate-500 text-[9px]">PT 무량판 결합</span></div>
                    <div className="w-[1px] h-6 bg-slate-200"></div>
                    <div className="flex flex-col items-center gap-0.5"><span className="text-slate-800 font-bold">바닥 진동</span><span className="text-slate-500 text-[9px]">1.0% g 이내 (PASS)</span></div>
                </div>
            </div>
        </div>
    );
};

export default StructuralEngineeringPanel;

// ======================= Sub Components & SVGs =======================

const PostTensionDiagram = () => (
    <svg viewBox="0 0 200 100" className="w-[90%] h-auto opacity-90 drop-shadow-sm">
        {/* Normal RC Beam */}
        <g opacity="0.4">
            <rect x="10" y="20" width="180" height="20" fill="#cbd5e1" />
            <rect x="90" y="40" width="20" height="40" fill="#94a3b8" />
            <text x="120" y="65" fontSize="8" fill="#64748b" fontWeight="bold">일반 RC (보 깊이 800mm)</text>
            <path d="M 115 50 L 115 80 M 110 50 L 120 50 M 110 80 L 120 80" stroke="#64748b" strokeWidth="1" />
        </g>
        
        {/* Post Tension Flat Plate/Beam */}
        <g transform="translate(0, 0)">
            <rect x="10" y="15" width="180" height="30" fill="#3b82f6" opacity="0.8" rx="2"/>
            <path d="M 10 30 Q 50 15, 100 40 T 190 30" fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="3 2" />
            <circle cx="10" cy="30" r="2" fill="#f97316" />
            <circle cx="190" cy="30" r="2" fill="#f97316" />
            <text x="70" y="10" fontSize="8" fill="#1d4ed8" fontWeight="bold">Post-Tension Slab (무량판/보 500mm)</text>
        </g>

        {/* Saved Space Indicator */}
        <rect x="90" y="45" width="20" height="35" fill="#fef08a" opacity="0.6" stroke="#ca8a04" strokeWidth="1" strokeDasharray="2 1"/>
        <text x="20" y="65" fontSize="8" fill="#b45309" fontWeight="bold">여유 공간 +300mm 확보</text>
        <path d="M 75 62 L 85 62" stroke="#b45309" strokeWidth="1.5" />
        <polygon points="85,60 90,62 85,64" fill="#b45309" />
    </svg>
);

const SeismicDiagram = () => (
    <svg viewBox="0 0 200 120" className="w-[100%] max-w-[400px] h-auto drop-shadow-md">
        {/* Grid */}
        <g stroke="#cbd5e1" strokeWidth="0.5" opacity="0.5">
            {[...Array(6)].map((_, i) => <line key={`h${i}`} x1="0" y1={i*20} x2="200" y2={i*20} />)}
            {[...Array(10)].map((_, i) => <line key={`v${i}`} x1={i*20} y1="0" x2={i*20} y2="120" />)}
        </g>

        {/* Building Rest state outline */}
        <path d="M 80 110 L 80 20 L 120 20 L 120 110" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 2" />
        <polyline points="75,110 125,110" stroke="#64748b" strokeWidth="3" />

        {/* Displaced Building (Seismic shift to right) */}
        <polygon points="80,110 95,20 135,20 120,110" fill="rgba(239, 68, 68, 0.1)" stroke="#ef4444" strokeWidth="2" />
        <line x1="83" y1="80" x2="123" y2="80" stroke="#ef4444" strokeWidth="1" />
        <line x1="88" y1="50" x2="128" y2="50" stroke="#ef4444" strokeWidth="1" />

        {/* Dynamic Forces */}
        <path d="M 40 40 C 60 30, 70 50, 90 25" fill="none" stroke="#f97316" strokeWidth="1.5" />
        <polygon points="88,27 92,23 85,22" fill="#f97316" />
        
        {/* Ground Shake */}
        <path d="M 20 115 L 40 105 L 60 118 L 80 105 L 100 115 L 120 105 L 140 118 L 160 105 L 180 115" fill="none" stroke="#64748b" strokeWidth="1.5" />

        {/* Spec Label */}
        <text x="145" y="40" fontSize="7" fill="#ef4444" fontWeight="bold">Max Drift: &lt; 1%</text>
        <text x="145" y="50" fontSize="6" fill="#64748b">탄성거동 확보 (PASS)</text>
    </svg>
);
