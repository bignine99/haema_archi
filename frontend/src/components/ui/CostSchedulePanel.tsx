import React from 'react';
import { Calculator, Calendar, Clock, DollarSign, TrendingDown, Layers, FileText, Target, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { analyzeEngineeringDomain } from '@/services/geminiEngineeringService';
import { Loader2 } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   C-6  공사비 산출 및 공정 시뮬레이션 모듈
   SKILL: J1 CostOptima 5D · J2 TimeMatrix 4D · J3 ValueEco · J4 Buildability · J5 RiskHedge
   Layout: 12-Column Cyber-Dashboard · Emerald/Sky Theme · V3.0 AI Simulated
   ═══════════════════════════════════════════════════════════════ */

const CostSchedulePanel = () => {
    const store = useProjectStore();
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);

    // ─── AI 분석 데이터 참조 ───
    const aiData = store.engineeringAnalysisData['cost'];
    const sd = aiData?.sectionData || {} as any;
    const isEducation = store.buildingUse === '교육연구시설';
    const isSpecialParams = isEducation || store.buildingUse === '의료시설';
    const totalMonth = isEducation ? 24 : Math.max(12, Math.floor((store.totalFloors || 4) * 1.5) + (store.undergroundFloors || 1) * 3);
    const constructionCostStr = store.constructionCost ? store.constructionCost : `${Math.round((store.grossFloorArea || 13960) * 0.003)}억 원`;
    const targetPriceSubtitle = store.constructionCost ? '과업지시서 지정 예산' : '㎡당 300만원 통계 기준';
    
    return (
        <div className="h-full flex flex-col bg-slate-50 overflow-y-auto custom-scrollbar font-sans relative">
            
            {/* ════════════ STICKY HEADER ════════════ */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-4 shrink-0">
                <div className="max-w-[1600px] mx-auto flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <DollarSign className="text-emerald-600" size={22} />
                            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
                                인공지능 4D/5D 예산 및 공정 검토서
                            </h2>
                            <span className="ml-2 text-[9px] font-black tracking-widest bg-emerald-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                                <Sparkles size={10} /> V3.0 AI SIMULATED
                            </span>
                        </div>
                        <p className="text-slate-500 text-[12px] font-medium">
                            ARCHE ARCHI · Phase C. 엔지니어링 · 개략 공사비 산출 / CPM 스케줄 / 가치공학(VE)
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px]">
                        <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 font-bold">
                            건물 용도: {store.buildingUse || '기본'}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                            특화 조건: {isEducation ? '3월 개교 준공 타깃' : (isSpecialParams ? '설비/장비 가중 분석' : '표준 타임라인')}
                        </span>
                        <button
                            onClick={async () => {
                                setIsAnalyzing(true);
                                try {
                                    const result = await analyzeEngineeringDomain({
                                        domain: 'cost',
                                        domainNameKor: '공사비/공정',
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
                                        store.setEngineeringData('cost', result);
                                    } else {
                                        alert('공사비/공정 분석 실패. 다시 시도해주세요.');
                                    }
                                } catch (e) {
                                    alert('오류가 발생했습니다.');
                                } finally {
                                    setIsAnalyzing(false);
                                }
                            }}
                            disabled={isAnalyzing}
                            className="ml-2 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold shadow-sm flex items-center gap-1 transition-colors"
                        >
                            {isAnalyzing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                            {isAnalyzing ? '분석 중...' : 'AI 공사비/공정 분석'}
                        </button>
                    </div>
                </div>
            </div>

            {/* ════════════ MAIN GRID: 12-Column Cyber-Dashboard ════════════ */}
            <div className="flex-1 px-6 py-5">
                <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-5 pb-28">

                    {/* ═══════ SKILL ROADMAP SIDEBAR (Col 1-3) ═══════ */}
                    <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">

                        {/* J-Series SKILL Modules Status */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                            <div className="text-[10px] font-bold tracking-widest text-emerald-600 mb-3">J-SERIES SKILL MODULES</div>
                            {[
                                { id: 'J1', name: 'CostOptima 5D', desc: '물량 기반 5D 공사비', icon: <DollarSign size={14}/>, status: 'Running' },
                                { id: 'J2', name: 'TimeMatrix 4D', desc: 'CPM 타임라인 역산', icon: <Calendar size={14}/>, status: 'Running' },
                                { id: 'J3', name: 'ValueEco', desc: '설계 대안(VE) 시뮬레이션', icon: <TrendingDown size={14}/>, status: 'Running' },
                                { id: 'J4', name: 'Buildability', desc: '프리패브/조립 양중 검토', icon: <Layers size={14}/>, status: 'Standby' },
                                { id: 'J5', name: 'RiskHedge', desc: '기후/자재 예비비 방어', icon: <ShieldAlert size={14}/>, status: 'Standby' },
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

                        {/* 예비비 / 특별 플랜 알림 */}
                        {isEducation && (
                            <div className="bg-white rounded-xl border border-sky-200 p-4 shadow-sm bg-gradient-to-b from-sky-50/50 to-white relative overflow-hidden">
                                <div className="absolute top-[-10%] right-[-10%] opacity-10 text-sky-600"><AlertCircle size={120} /></div>
                                <div className="flex items-center gap-1.5 mb-3 position-relative z-10">
                                    <Clock size={14} className="text-sky-600"/>
                                    <span className="text-[10px] font-bold text-slate-800">절대 공기 역산 통제 활성</span>
                                </div>
                                <ul className="text-[9px] text-slate-600 space-y-1.5 list-disc pl-3 position-relative z-10">
                                    <li>"3월 개교" 핀셋 마일스톤 생성 완료</li>
                                    <li>착공 전 Fast-Track(설계/시공 병행) 검토</li>
                                    <li>동절기 콘크리트 타설 한계 (3주 보양) 패널티</li>
                                </ul>
                            </div>
                        )}
                        {!isEducation && isSpecialParams && (
                            <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-sm relative overflow-hidden">
                                <div className="flex items-center gap-1.5 mb-2">
                                    <Calculator size={14} className="text-emerald-600"/>
                                    <span className="text-[10px] font-bold text-slate-800">특수 설비 가중치 모델</span>
                                </div>
                                <div className="text-[9px] text-slate-600 leading-relaxed">
                                    초고가의 의료/재활 기계설비(MEP) 비중이 표준 설계안 대비 25% 이상 높게 책정되어 J1 연산망에 등록되었습니다.
                                </div>
                            </div>
                        )}

                    </div>

                    {/* ═══════ MAIN CONTENT AREA (Col 4-12) ═══════ */}
                    <div className="col-span-12 lg:col-span-9 flex flex-col gap-5">

                        {/* ─── SECTION 1: J1 5D 예산 (CostOptima) & J3 VE 로직 (ValueEco) ─── */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row">
                            
                            {/* J1 5D Cost Breakdown */}
                            <div className="w-full lg:w-7/12 p-6 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col justify-center bg-white relative">
                                <div className="flex items-center gap-2 mb-2">
                                    <DollarSign size={16} className="text-emerald-600" />
                                    <h3 className="text-[12px] font-extrabold text-slate-800 tracking-tight">J1 · CostOptima 5D — 개략 공사 예산</h3>
                                </div>
                                <p className="text-[11px] text-slate-600 leading-relaxed font-medium mb-5 bg-emerald-50/30 p-3 rounded-lg border border-emerald-50">
                                    기하학 볼륨에 기반한 ㎡당 단가 모델(Escalation 포함)을 적용합니다. 
                                    {isSpecialParams ? " 특수 환경성을 고려하여 기계/전기 MEP 배분율을 상향 (총 공사비의 28%~30%) 설정합니다." : " 표준 조달기준단가를 준용합니다."}
                                </p>
                                
                                <div className="flex gap-4">
                                    <div className="border-l-4 border-emerald-500 bg-slate-50 p-3 rounded-r-lg border-y border-r border-slate-100 flex-1">
                                        <div className="text-[9px] text-slate-500 font-bold mb-1">Target Cost (총 예산 한도)</div>
                                        <div>
                                            <div className="text-xl font-black text-slate-800">{constructionCostStr}</div>
                                            <div className="text-[8px] text-emerald-600 mt-0.5 font-bold">{targetPriceSubtitle}</div>
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        <div className="text-[9px] font-bold text-slate-500 mb-1.5 flex justify-between">
                                            <span>공종별 예산(BOM) 배분율</span>
                                        </div>
                                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex relative border border-slate-200">
                                            <div className="bg-slate-400 h-full flex items-center justify-center text-[7px] text-white font-bold" style={{width: '58%'}}>건축 58%</div>
                                            <div className="bg-emerald-500 h-full flex items-center justify-center text-[7px] text-white font-bold" style={{width: '30%'}}>MEP 30%</div>
                                            <div className="bg-emerald-700 h-full flex items-center justify-center text-[7px] text-white" style={{width: '12%'}}>기타</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* J3 ValueEco (VE Alternatives) */}
                            <div className="w-full lg:w-5/12 p-6 flex flex-col justify-center bg-gradient-to-br from-slate-50 to-white">
                                <div className="flex items-center gap-2 mb-3">
                                    <TrendingDown size={16} className="text-emerald-500" />
                                    <h3 className="text-[12px] font-extrabold text-slate-800 tracking-tight">J3 · ValueEco — VE 최적화</h3>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {(Array.isArray(store.engineeringAnalysisData['cost']?.systemProposals) ? store.engineeringAnalysisData['cost'].systemProposals : [
                                        { title: '규격화 기반 골조 VE', subtitle: '적용 제안', details: '교실 모듈 7.5×9.0m 일괄 통일. 거푸집 전용 횟수 증대로 노무비 5% 절감 및 동바리 자재 절약 예측.' },
                                        { title: '외단열 조립 패널 (Prefab)', subtitle: 'Fast-Track', details: '외장 벽돌 조적 배제, 알루미늄 건식 패널 빔 조합. 외부 비계 철거 공기 1개월 선결 확보 모델.' }
                                    ]).map((ve: any, i: number) => (
                                        <div key={i} className="bg-white p-3 rounded-lg border border-emerald-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                                            <div className="text-[10px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                                                <span>{ve.title}</span>
                                                <span className={`text-[8px] px-1 py-0.5 rounded ${i===0 ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700'}`}>{ve.subtitle || 'VE 제안'}</span>
                                            </div>
                                            <div className="text-[9px] text-slate-500">{ve.details}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ─── SECTION 2: J2 4D 스케줄링 및 CPM 역산 (TimeMatrix) ─── */}
                        <div className="bg-white rounded-xl border border-sky-100 shadow-sm flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-sky-50 bg-gradient-to-r from-sky-50 to-white flex items-center gap-1.5 justify-between">
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={16} className="text-sky-600"/>
                                    <span className="text-[12px] font-extrabold text-slate-800">J2 · TimeMatrix 4D — 임계경로(CPM) & 절대 공기</span>
                                </div>
                                {isEducation && <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold border border-red-200">역산 타겟: 3월 개교 시점</span>}
                            </div>
                            <div className="p-5 flex flex-col">
                                <div className="w-full bg-slate-50 p-4 border border-slate-100 rounded-lg">
                                    {/* SVG-based Gantt Chart */}
                                    <div className="flex text-[9px] text-slate-400 font-bold mb-3 pb-2 border-b border-slate-200">
                                        <div className="w-[15%]">공종 (Task)</div>
                                        <div className="w-[85%] flex">
                                            <div className="flex-1 text-center border-r border-slate-200 last:border-r-0">1~6 M (착공/토목)</div>
                                            <div className="flex-1 text-center border-r border-slate-200 last:border-r-0">7~12 M (골조 1)</div>
                                            <div className="flex-1 text-center border-r border-slate-200 last:border-r-0">13~18 M (마감/MEP)</div>
                                            <div className="flex-1 text-center border-r border-slate-200 last:border-r-0">19~24 M (인증/준공)</div>
                                        </div>
                                    </div>
                                    <div className="space-y-3 relative">
                                        <div className="absolute top-0 bottom-0 left-[15%] right-0 flex pointer-events-none">
                                            <div className="flex-1 border-r border-white/50 border-dashed"></div>
                                            <div className="flex-1 border-r border-white/50 border-dashed"></div>
                                            <div className="flex-1 border-r border-white/50 border-dashed"></div>
                                            <div className="flex-1"></div>
                                        </div>
                                        <div className="flex items-center text-[10px] relative z-10">
                                            <div className="w-[15%] font-bold text-slate-600">토목/흙막이</div>
                                            <div className="w-[85%] flex bg-slate-200 h-5 rounded overflow-hidden">
                                                <div className="bg-slate-400 border-r border-white/20 flex items-center justify-center text-[8px] text-white font-bold" style={{width: '20%'}}>1~5M</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center text-[10px] relative z-10">
                                            <div className="w-[15%] font-bold text-sky-700">골조 (CP)</div>
                                            <div className="w-[85%] flex bg-slate-200 h-5 rounded overflow-hidden">
                                                <div style={{width: '16%'}}></div>
                                                <div className="bg-sky-500 border-r border-white/20 shadow-[inset_0_-2px_0_rgba(0,0,0,0.1)] flex items-center justify-center text-[8px] text-white font-bold relative" style={{width: '50%'}}>
                                                    ★ 임계 경로 (5~16M)
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center text-[10px] relative z-10">
                                            <div className="w-[15%] font-bold text-slate-600">특수마감/MEP</div>
                                            <div className="w-[85%] flex bg-slate-200 h-5 rounded overflow-hidden">
                                                <div style={{width: '50%'}}></div>
                                                <div className="bg-emerald-500 border-r border-white/20 flex items-center justify-center text-[8px] text-white font-bold" style={{width: '35%'}}>13~21M</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center text-[10px] relative z-10">
                                            <div className="w-[15%] font-bold text-orange-700">시운전/BF인증</div>
                                            <div className="w-[85%] flex bg-slate-200 h-5 rounded overflow-hidden">
                                                <div style={{width: '85%'}}></div>
                                                <div className="bg-orange-500 flex items-center justify-center text-[8px] text-white font-bold" style={{width: '15%'}}>21~24M</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ─── SECTION 3: J5 리스크 방어 (RiskHedge) ─── */}
                        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                            <div className="flex items-center gap-1.5 mb-4">
                                <ShieldAlert size={18} className="text-slate-700" />
                                <h3 className="text-sm font-extrabold text-slate-800">예비비 및 공정 지연 리스크 (Risk & Contingency)</h3>
                                <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded ml-2 border border-red-200">자산 보호 스위치</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-[11px] text-slate-600">
                                    <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
                                        <tr>
                                            <th className="px-3 py-2 rounded-tl-lg w-1/3">가변 리스크 요인</th>
                                            <th className="px-3 py-2 w-20 text-center">심각도</th>
                                            <th className="px-3 py-2 rounded-tr-lg">예방 및 스케줄/예산 방어책</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {(Array.isArray(store.engineeringAnalysisData['cost']?.riskBoard) ? store.engineeringAnalysisData['cost'].riskBoard : [
                                            { risk: '무장애(BF) 본인증 취득 심의 지연에 따른 개교일 타격', impact: '상', prob: '상', solution: '내장 마감 완료 시점(공정 80%, 20개월 차)에 예비 실사 선행. 지적(단차 등) 시정 마일스톤 4주 사전 확보.' },
                                            { risk: '동절기(12~2월) 기상 제한 요소로 인한 골조 타설 중지', impact: '중', prob: '상', solution: '단열 갱폼 거푸집 사용 보수비 J5 할당. 혹한기 이전 지상층 코어 공사 마무리 목표(마일스톤 집중).' },
                                            { risk: '장비 납품 지연', impact: '하', prob: '중', solution: '설계 단계에서 장비 Specs 확정 시 조기 발주 협의.' }
                                        ]).map((row: any, i: number) => (
                                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-3 py-2.5 font-bold text-slate-700">{row.risk}</td>
                                                <td className="px-3 py-2.5 text-center">
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${row.impact === '상' ? 'bg-red-100 text-red-700' : row.impact === '중' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{row.impact === '상' ? '크리티컬' : row.impact === '중' ? '중' : '하'}</span>
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
                        <div className="bg-emerald-500 text-white p-1.5 rounded-lg shadow-sm">
                            <FileText size={16} />
                        </div>
                        <div>
                            <div className="text-[11px] font-black text-white leading-none mb-0.5">COST & SCHEDULE ENGINE</div>
                            <div className="text-[8px] text-slate-400 uppercase font-bold tracking-widest">Financial Framework · V3.0</div>
                        </div>
                    </div>
                    <div className="flex-1 flex justify-evenly text-[10px] font-medium px-3 text-center">
                        {(Array.isArray(store.engineeringAnalysisData['cost']?.customMetrics) ? store.engineeringAnalysisData['cost'].customMetrics : [
                            { label: '5D 타겟 예산', value: constructionCostStr },
                            { label: '4D 절대 공기', value: `총 ${totalMonth}개월 (CP 모델)` },
                            { label: 'VE 최적화', value: '거푸집/외장 패널 공기단축' },
                            { label: '리스크 방어', value: '동절기 예비비 J5 편입' },
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

export default CostSchedulePanel;
