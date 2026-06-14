import React from 'react';
import { ShieldCheck, Users, Target, ArrowRightLeft, Move, BellRing, DoorOpen, ShieldAlert, BadgeCheck, Navigation, Sparkles } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { analyzeEngineeringDomain } from '@/services/geminiEngineeringService';
import { Loader2 } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   C-9 무장애(Barrier Free) 및 유니버설 설계 모듈
   SKILL: M1 BarrierFree 3D · M2 Universal-Route · M3 BF-Score Matrix · M4 Auto-Doors/VT · M5 Sanitary-Care
   Layout: 12-Column Cyber-Dashboard · Indigo/Teal/Rose Theme · V3.0 AI Simulated
   ═══════════════════════════════════════════════════════════════ */

const BFStrategyPanel = () => {
    const store = useProjectStore();
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);

    // ─── AI 분석 데이터 참조 ───
    const aiData = store.engineeringAnalysisData['bf'];
    const sd = aiData?.sectionData || {} as any;
    const isEducation = store.buildingUse === '교육연구시설';
    const isPublic = isEducation || store.buildingUse === '업무시설(오피스)';
    
    return (
        <div className="h-full flex flex-col bg-slate-50 overflow-y-auto custom-scrollbar font-sans relative">
            
            {/* ════════════ STICKY HEADER ════════════ */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-4 shrink-0">
                <div className="max-w-[1600px] mx-auto flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <ShieldCheck className="text-indigo-600" size={22} />
                            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
                                인공지능 BF(무장애) 유니버설 디자인 검증서
                            </h2>
                            <span className="ml-2 text-[9px] font-black tracking-widest bg-indigo-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                                <Sparkles size={10} /> V3.0 AI SIMULATED
                            </span>
                        </div>
                        <p className="text-slate-500 text-[12px] font-medium">
                            ARCHE ARCHI · Phase C. 엔지니어링 · 동선 간섭 제로 / 다중감각 네트워크
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px]">
                        <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 font-bold">
                            건물 용도: {store.buildingUse || '기본'}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                            특화 조건: {isPublic ? 'BF 최우수(최상급) 인증 강제 달성 타겟' : '표준 이동성 적용'}
                        </span>
                        <button
                            onClick={async () => {
                                setIsAnalyzing(true);
                                try {
                                    const result = await analyzeEngineeringDomain({
                                        domain: 'bf',
                                        domainNameKor: '무장애(BF)/유니버설',
                                        projectName: store.projectName,
                                        buildingUse: store.buildingUse,
                                        grossFloorArea: store.grossFloorArea,
                                        rawText: store.documentInfo?.rawData?.rawText || '',
                                        siteAnalysis: store.siteAnalysisResult,
                                        regulationAnalysis: store.regulationAnalysisResult,
                                        characteristicsAnalysis: store.characteristicsAnalysisResult,
                                        spaceStrategy: store.spaceStrategyResult,
                                    });
                                    if (result) {
                                        store.setEngineeringData('bf', result);
                                    } else {
                                        alert('BF 엔지니어링 분석 실패. 다시 시도해주세요.');
                                    }
                                } catch (e) {
                                    alert('오류가 발생했습니다.');
                                } finally {
                                    setIsAnalyzing(false);
                                }
                            }}
                            disabled={isAnalyzing}
                            className="ml-2 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold shadow-sm flex items-center gap-1 transition-colors"
                        >
                            {isAnalyzing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                            {isAnalyzing ? '분석 중...' : 'AI BF/유니버설 분석'}
                        </button>
                    </div>
                </div>
            </div>

            {/* ════════════ MAIN GRID: 12-Column Cyber-Dashboard ════════════ */}
            <div className="flex-1 px-6 py-5">
                <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-5 pb-28">

                    {/* ═══════ SKILL ROADMAP SIDEBAR (Col 1-3) ═══════ */}
                    <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">

                        {/* M-Series SKILL Modules Status */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                            <div className="text-[10px] font-bold tracking-widest text-indigo-600 mb-3">M-SERIES SKILL MODULES</div>
                            {[
                                { id: 'M1', name: 'BarrierFree 3D', desc: '0mm 무단차/교행 스캔', icon: <Move size={14}/>, status: 'Running' },
                                { id: 'M2', name: 'Universal-Route', desc: '다면적 점자/음성 라우팅', icon: <Navigation size={14}/>, status: 'Running' },
                                { id: 'M3', name: 'BF-Score Matrix', desc: '등급 인증 자동 스코어링', icon: <BadgeCheck size={14}/>, status: 'Running' },
                                { id: 'M4', name: 'Auto-Doors/VT', desc: '수직수평 이동장벽 제거', icon: <DoorOpen size={14}/>, status: 'Running' },
                                { id: 'M5', name: 'Sanitary-Care', desc: '특수 화장실 면적 보정', icon: <Users size={14}/>, status: 'Standby' },
                            ].map((mod, i) => (
                                <div key={i} className="flex items-center gap-2.5 py-2 border-b border-slate-50 last:border-b-0">
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${mod.status === 'Running' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                        {mod.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] font-black text-slate-700">{mod.id}</span>
                                            <span className="text-[9px] text-slate-500 font-medium truncate">{mod.name}</span>
                                        </div>
                                        <div className="text-[9px] text-slate-400 truncate">{mod.desc}</div>
                                    </div>
                                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${mod.status === 'Running' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>
                                        {mod.status}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* 특화 환경 알림 */}
                        {isEducation && (
                            <div className="bg-white rounded-xl border border-rose-200 p-4 shadow-sm bg-gradient-to-b from-rose-50/30 to-white relative overflow-hidden">
                                <div className="absolute top-[-10%] right-[-10%] opacity-10 text-rose-600"><Users size={120} /></div>
                                <div className="flex items-center gap-1.5 mb-3 relative z-10">
                                    <ShieldAlert size={14} className="text-rose-700"/>
                                    <span className="text-[10px] font-bold text-slate-800">교육/맞춤형 기관 안전보정 장치 활성화</span>
                                </div>
                                <ul className="text-[9px] text-slate-600 space-y-2 list-disc pl-3 relative z-10 font-medium leading-relaxed">
                                    <li>이동약자의 상시 교행을 위한 <span className="text-rose-700 font-bold">수퍼와이드 복도(Min 2.1m)</span> 강제 배정</li>
                                    <li>악력이 불필요한 근접형 슬라이딩 자동문 100% 도입</li>
                                    <li>위급 상황시 청각장애 대응 시각 경보기(섬광등) 교차 렌더링</li>
                                </ul>
                            </div>
                        )}

                    </div>

                    {/* ═══════ MAIN CONTENT AREA (Col 4-12) ═══════ */}
                    <div className="col-span-12 lg:col-span-9 flex flex-col gap-5">

                        {/* ─── SECTION 1: M1 Threshold-Free & M4 VT ─── */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row">
                            
                            {/* M1 Mobility & Threshold-Free */}
                            <div className="w-full lg:w-7/12 p-6 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col justify-center bg-white relative">
                                <div className="flex items-center gap-2 mb-2">
                                    <ArrowRightLeft size={16} className="text-indigo-600" />
                                    <h3 className="text-[12px] font-extrabold text-slate-800 tracking-tight">M1 · 공간 교행 및 단차 제로(0mm) 스캔</h3>
                                </div>
                                <p className="text-[11px] text-slate-600 leading-relaxed font-medium mb-5 bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/50">
                                    도면 평면상의 동선 간섭을 회피합니다. 전동 휠체어의 여유로운 교차 통행과 1.5m×1.5m 턴(Turn) 반경을 전 구역에서 보장하며, 모든 실 구획 간 단차를 허용하지 않습니다.
                                </p>
                                
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="border border-slate-200 bg-slate-50 shadow-sm p-3 rounded-lg flex-1 text-center">
                                        <div className="text-[10px] text-slate-500 font-bold mb-1.5 flex items-center justify-center gap-1.5"><ArrowRightLeft size={12}/> 유효 복도폭</div>
                                        <div className="flex items-baseline justify-center gap-1">
                                            <span className="text-2xl font-black text-indigo-600">2,100</span><span className="text-[9px] font-bold text-slate-500">mm</span>
                                        </div>
                                        <div className="text-[8px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full mt-2 font-bold w-full mx-auto inline-block">법정(1,500) 대비 1.4배</div>
                                    </div>
                                    <div className="border border-teal-200 bg-teal-50 shadow-sm p-3 rounded-lg flex-1 text-center">
                                        <div className="text-[10px] text-teal-700 font-bold mb-1.5 flex items-center justify-center gap-1.5"><Move size={12}/> 공간 전이 단차</div>
                                        <div className="flex items-baseline justify-center gap-1">
                                            <span className="text-2xl font-black text-teal-600">0</span><span className="text-[9px] font-bold text-teal-600/70">mm</span>
                                        </div>
                                        <div className="text-[8px] bg-teal-200 text-teal-800 px-1.5 py-0.5 rounded-full mt-2 font-bold w-full mx-auto inline-block">완전 평면 (문틀/분리대 삭제)</div>
                                    </div>
                                </div>
                            </div>

                            {/* M4 Auto-Doors & VT Core */}
                            <div className="w-full lg:w-5/12 p-6 flex flex-col justify-center bg-gradient-to-br from-indigo-900 to-slate-900 text-white relative overflow-hidden">
                                <div className="absolute top-4 right-4 opacity-10 text-white"><Users fill="currentColor" size={100} /></div>
                                <div className="flex items-center gap-2 mb-3 relative z-10">
                                    <DoorOpen size={16} className="text-teal-400" />
                                    <h3 className="text-[12px] font-extrabold tracking-tight">M4 · 동력형 코어 제어</h3>
                                </div>
                                <div className="space-y-3 relative z-10 flex-1">
                                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-3 rounded-lg mt-2">
                                        <div className="text-[10px] font-bold text-teal-300 mb-1 flex justify-between items-center">
                                            <span>침상/휠체어 멀티 E/V</span>
                                            <span className="text-[8px] bg-teal-400/20 px-1 py-0.5 rounded">24인승 편제</span>
                                        </div>
                                        <div className="text-[9px] text-slate-300 leading-snug">스트레쳐카(환자용침대) 및 다수 휠체어 동시 탑승용 메가 코어 (1.6m × 2.3m 이상) 강제 배정.</div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-3 rounded-lg">
                                        <div className="text-[10px] font-bold text-teal-300 mb-1 flex justify-between items-center">
                                            <span>슬라이딩 오토 도어망</span>
                                            <span className="text-[8px] bg-teal-400/20 px-1 py-0.5 rounded">악력 0kg</span>
                                        </div>
                                        <div className="text-[9px] text-slate-300 leading-snug">로비, 화장실, 교실 등 통행이 빈번한 모든 전실에 비접촉 자동문 조기 예산 확보.</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ─── SECTION 2: M2 Universal Route & M3 BF Score ─── */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            
                            {/* M2 Universal-Route */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col relative overflow-hidden">
                                <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
                                    <div className="flex items-center gap-2">
                                        <BellRing size={16} className="text-rose-500" />
                                        <h3 className="text-[12px] font-extrabold text-slate-800">M2 · 다중 감각 방어망 연동</h3>
                                    </div>
                                    <span className="text-[9px] text-rose-600 font-black bg-rose-50 px-2 py-1 rounded">청각·시각 보조</span>
                                </div>
                                <div className="space-y-3 mt-1">
                                    <div className="flex items-start gap-3">
                                        <span className="bg-rose-500 text-white w-5 h-5 flex items-center justify-center rounded-md text-[10px] font-bold shrink-0 mt-0.5">1</span>
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-800 mb-0.5">비상 시각 점멸 알람 (섬광등)</div>
                                            <div className="text-[9px] text-slate-500 leading-relaxed font-medium">소음 식별이 불가능한 청각 보조 요구 사용자를 위해 화재/비상 시 복도 및 화장실 내 적색 LED 스트로보 연동 가동.</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="bg-rose-500 text-white w-5 h-5 flex items-center justify-center rounded-md text-[10px] font-bold shrink-0 mt-0.5">2</span>
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-800 mb-0.5">단절 없는 스마트 촉각·음성 라우팅</div>
                                            <div className="text-[9px] text-slate-500 leading-relaxed font-medium">대지 진입로 ~ 코어 ~ 목적실명찰까지 연속 파이프라인 형성. BLE 비콘 기반 층고 및 위치 안내 음성 모듈 탑재.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* M3 BF Score Matrix */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 border-t-4 border-t-indigo-500 flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <BadgeCheck size={16} className="text-indigo-600" />
                                        <h3 className="text-[12px] font-extrabold text-slate-800 tracking-tight">M3 · BF 최우수 인증 스코어링</h3>
                                    </div>
                                </div>
                                <div className="flex justify-between items-end mb-2">
                                    <div className="text-[28px] font-black text-indigo-600 leading-none">93.5<span className="text-sm text-slate-400 font-bold ml-1">점</span></div>
                                    <div className="text-[10px] text-indigo-700 bg-indigo-50 font-bold px-2 py-0.5 rounded-full border border-indigo-100">최우수 획득 (90점 컷)</div>
                                </div>
                                <div className="space-y-2.5 pt-2 border-t border-slate-100 mt-auto">
                                    <div>
                                        <div className="flex justify-between text-[9px] mb-1 font-bold text-slate-600">
                                            <span>매개시설 (경사로, 동선)</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-indigo-500 h-1.5 rounded-full" style={{width: '98%'}}></div></div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-[9px] mb-1 font-bold text-slate-600">
                                            <span>내부/위생 (단차 0, 화장실 크기)</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-indigo-500 h-1.5 rounded-full" style={{width: '95%'}}></div></div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-[9px] mb-1 font-bold text-slate-600">
                                            <span>안내설비 (점자/음성)</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-indigo-500 h-1.5 rounded-full" style={{width: '92%'}}></div></div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* ─── SECTION 3: Risk Management ─── */}
                        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                            <div className="flex items-center gap-1.5 mb-4">
                                <ShieldAlert size={16} className="text-slate-700" />
                                <h3 className="text-sm font-extrabold text-slate-800">시공 오차 및 감리 위험 관리 (Audit Risks)</h3>
                                <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded ml-2">시공 본인증 방어점</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-[11px] text-slate-600">
                                    <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
                                        <tr>
                                            <th className="px-3 py-2 rounded-tl-lg w-[38%]">BF 본인증 탈락 위험요소</th>
                                            <th className="px-3 py-2 w-20 text-center">파급력</th>
                                            <th className="px-3 py-2 rounded-tr-lg">설계/감리 단계 해결 방안</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {(Array.isArray(store.engineeringAnalysisData['bf']?.riskBoard) ? store.engineeringAnalysisData['bf'].riskBoard : [
                                            { risk: '현장 타설 시 바닥 단차(2cm 이상) 허용 오차 초과', impact: '상', prob: '중', solution: '도어 마감 간 0mm 지시 엄수 명기. 현장 먹매김 및 방통 타설 시 감리단 全 개소 레벨 역검측 의무화.' },
                                            { risk: '외부 조경 패턴과 점자 블록 연속성 충돌(Gap > 15cm)', impact: '중', prob: '상', solution: '주진입로에서 현관으로 인입 시 재질 불명확성 배제. 조경과 겹치는 구간은 외부 매립형 화강석 점자 강제 지정.' },
                                            { risk: 'VE 진행 중 수퍼와이드 복도 축소 및 자동문 삭감 압박', impact: '하', prob: '중', solution: 'J1(5D 공사비)에서 \'자동문\' 셋을 BF 특수 예산으로 성역화(Lock)하여 건축 일반예산 감액 표적에서 이탈구조 화.' },
                                        ]).map((row: any, i: number) => (
                                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-3 py-2.5 font-bold text-slate-700">{row.risk}</td>
                                                <td className="px-3 py-2.5 text-center">
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${row.impact === '상' ? 'bg-red-100 text-red-700' : row.impact === '중' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>{row.impact === '상' ? '인증 탈락' : row.impact === '중' ? '대폭 감점' : '효용 저하'}</span>
                                                </td>
                                                <td className="px-3 py-2.5">{row.solution}</td>
                                            </tr>
                                        ))}
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
                        <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-sm">
                            <ShieldCheck size={16} />
                        </div>
                        <div>
                            <div className="text-[11px] font-black text-white leading-none mb-0.5">BF VALIDATION ENGINE</div>
                            <div className="text-[8px] text-slate-400 uppercase font-bold tracking-widest">Universal Mobility · V3.0</div>
                        </div>
                    </div>
                    <div className="flex-1 flex justify-evenly text-[10px] font-medium px-3 text-center">
                        {(Array.isArray(store.engineeringAnalysisData['bf']?.customMetrics) ? store.engineeringAnalysisData['bf'].customMetrics : [
                            { label: '본인증 타겟', value: '최우수 (90점+)' },
                            { label: '유효 폭 (교행)', value: '최소 2.1m 보장' },
                            { label: '공간 단차', value: '0mm 완전 통제' },
                            { label: '인식 보호', value: '시청각 멀티 알람' },
                        ]).slice(0, 4).map((m: any, i: number) => (
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

export default BFStrategyPanel;
