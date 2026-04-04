import React, { useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { generateDesignConcepts, type GeneratedConcept, type DesignConceptSetResult } from '@/services/conceptGeneratorService';
import { Lightbulb, Settings2, RefreshCw, Cpu, Heart, Leaf, TrendingUp, Landmark, ArrowRight, ShieldCheck, Zap, Maximize, Activity, Palette, Trees, Shield, BookOpen, Globe2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VIBES = [
  { id: 'tech',    label: '[Vibe 01] 미래 기술형',   icon: <Cpu size={16} />,     desc: '스마트 빌딩, 자동화, 디지털 트윈',       color: 'blue'   },
  { id: 'human',   label: '[Vibe 02] 인간 중심형',   icon: <Heart size={16} />,   desc: '치유, 돌봄, 커뮤니티, 감성, 관계',       color: 'rose'   },
  { id: 'green',   label: '[Vibe 03] 지속 가능형',   icon: <Leaf size={16} />,    desc: '제로에너지, 자연연계, 생태, 순환',       color: 'emerald'},
  { id: 'value',   label: '[Vibe 04] 경제 효율형',   icon: <TrendingUp size={16}/>,desc: '수익성, 효율 극대화, LCC, 유지관리',     color: 'amber'  },
  { id: 'symbol',  label: '[Vibe 05] 도시 상징형',   icon: <Landmark size={16}/>, desc: '랜드마크, 공공성, 도시 정체성, 아이콘',   color: 'violet' },
  { id: 'culture', label: '[Vibe 06] 문화 예술형',   icon: <Palette size={16}/>,  desc: '창의성, 표현, 예술적 정체성, 문화 콘텐츠', color: 'pink'   },
  { id: 'bio',     label: '[Vibe 07] 자연 치유형',   icon: <Trees size={16}/>,    desc: '생체친화, 자연 소재, 감각 회복, 치유 환경', color: 'teal'   },
  { id: 'safe',    label: '[Vibe 08] 안전 보호형',   icon: <Shield size={16}/>,   desc: '물리적 안전, 보안, 재난 대응, 위기 관리', color: 'orange' },
  { id: 'edu',     label: '[Vibe 09] 교육 혁신형',   icon: <BookOpen size={16}/>, desc: '미래 교육, 학습 과학, 개별화, 체험 학습', color: 'indigo' },
  { id: 'community',label: '[Vibe 10] 지역 융합형',  icon: <Globe2 size={16}/>,   desc: '지역 커뮤니티, 복합 프로그램, 사회 통합', color: 'cyan'   },
];

export default function DesignConceptGeneratorPanel() {
  const store = useProjectStore();
  
  const [selectedVibes, setSelectedVibes] = useState<string[]>(['human']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [conceptSet, setConceptSet] = useState<DesignConceptSetResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleVibe = (vibeId: string) => {
    setSelectedVibes(prev => {
      if (prev.includes(vibeId)) {
        if (prev.length === 1) return prev; // 최소 1개는 유지
        return prev.filter(v => v !== vibeId);
      } else {
        if (prev.length >= 2) return [prev[1], vibeId]; // 최대 2개
        return [...prev, vibeId];
      }
    });
  };

  const handleGenerate = async () => {
    if (selectedVibes.length === 0) return;
    
    setIsGenerating(true);
    setError(null);
    try {
      const selectedLabels = selectedVibes.map(v => VIBES.find(vi => vi.id === v)?.label || v);
      const result = await generateDesignConcepts(selectedLabels);
      setConceptSet(result);
    } catch (err: any) {
      setError(err.message || '컨셉 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  // 랜덤 아이콘 맵핑 함수 (단순 시각용)
  const getPillarIcon = (index: number) => {
    switch (index % 4) {
      case 0: return <ShieldCheck size={20} className="text-blue-500" />;
      case 1: return <Activity size={20} className="text-emerald-500" />;
      case 2: return <Maximize size={20} className="text-amber-500" />;
      case 3: return <Zap size={20} className="text-purple-500" />;
      default: return <Settings2 size={20} className="text-slate-500" />;
    }
  };

  return (
    <div className="h-full flex flex-col p-6 bg-slate-50 overflow-y-auto custom-scrollbar font-sans relative">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 shrink-0 z-10">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Lightbulb className="text-amber-500" size={24} />
            디자인 컨셉 제너레이터
          </h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            범용 설계 개념 추출 시스템 (Universal Concept Matrix) — 프로젝트 특성에 맞춘 무한 컨셉 생성
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
            대상 프로젝트: {store.projectName || '기본 프로젝트'}
          </span>
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 grid grid-cols-12 gap-5 pb-24 relative">
        
        {/* ════════ LEFT PANEL: col-span-8 ════════ */}
        <div className="col-span-8 flex flex-col gap-5">
          {!conceptSet && !isGenerating ? (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-slate-400 bg-white rounded-xl border border-slate-200 shadow-sm p-10">
              <div className="w-20 h-20 bg-slate-50 rounded-full shadow-inner flex items-center justify-center mb-6 border border-slate-100">
                <Lightbulb size={32} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">설계 논리가 기다리고 있습니다</h3>
              <p className="text-sm">우측 패널에서 Vibe를 선택하고 엔진을 가동하여 프로젝트만의 전략을 도출해보세요.</p>
            </div>
          ) : isGenerating ? (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center space-y-8 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-amber-100 border-t-amber-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Cpu size={20} className="text-amber-500 animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-sm font-bold text-slate-700 animate-pulse">엔지니어링 & 디자인 로직 병합 중...</h3>
                <p className="text-xs text-slate-500">Universal Database에서 최적의 전략적 기둥을 매칭하고 있습니다.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {conceptSet?.concepts.map((concept, cIdx) => (
                  <motion.div
                    key={concept.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: cIdx * 0.15 }}
                    className="bg-white border text-left border-slate-200 rounded-2xl shadow-sm overflow-hidden"
                  >
                    {/* Level 1: Philosophy */}
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-200 p-8 relative overflow-hidden">
                      {/* Decoration */}
                      <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Lightbulb size={120} />
                      </div>
                      
                      <div className="relative z-10 flex gap-4">
                        <div className="shrink-0 pt-1">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-700 text-slate-300 font-bold text-xs ring-4 ring-slate-800 shadow-lg">
                           {cIdx + 1}
                          </span>
                        </div>
                        <div>
                          <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-700 text-slate-300 text-[10px] font-bold tracking-wider uppercase mb-3 shadow-inner">
                            [{concept.vibe}] Concept
                          </div>
                          <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight mb-2">
                            {concept.philosophy}
                          </h2>
                          <p className="text-slate-400 text-sm flex items-center gap-2">
                            Step 1. Main Theme (Philosophy)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Level 2 & 3: Strategic Pillars & Solutions */}
                    <div className="p-8">
                       <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-6 flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                         Step 2 & 3. Strategic Pillars & Detailed Solutions
                       </h3>
                       
                       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                         {concept.pillars.map((pillar, pIdx) => (
                           <div key={pIdx} className="bg-slate-50 rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
                             {/* Decoration strip */}
                             <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                             
                             <div className="flex flex-col items-start gap-4 mb-5">
                               <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
                                 {getPillarIcon(pIdx)}
                               </div>
                               <div>
                                 <h4 className="font-bold text-slate-800 text-sm leading-snug">{pillar.name}</h4>
                                 <p className="text-xs text-slate-500 mt-2 leading-relaxed">{pillar.description}</p>
                               </div>
                             </div>

                             <div className="space-y-3 border-t border-slate-200 pt-5 mt-auto">
                               {pillar.solutions.map((sol, sIdx) => (
                                 <div key={sIdx} className="flex gap-2.5 items-start bg-white p-2.5 rounded-lg border border-slate-100">
                                   <div className="mt-0.5"><ArrowRight size={12} className="text-slate-400" /></div>
                                   <div>
                                     <span className="block text-[9px] font-bold text-amber-600 mb-0.5">{sol.type}</span>
                                     <span className="block text-[11px] font-medium text-slate-700 leading-snug">{sol.spec}</span>
                                   </div>
                                 </div>
                               ))}
                             </div>
                           </div>
                         ))}
                       </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* ════════ RIGHT PANEL: col-span-4 ════════ */}
        <div className="col-span-4 flex flex-col gap-5">
          {/* CONCEPT ENGINE DASHBOARD */}
          <div className="bg-slate-900 rounded-xl p-5 text-white shadow-xl relative overflow-hidden flex flex-col border border-slate-800 shrink-0">
              <div className="absolute -right-4 -top-4 opacity-10"><Lightbulb size={120} /></div>
              
              <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-amber-400 tracking-widest">CONCEPT ENGINE</span>
              </div>
              <h3 className="text-xl font-bold mb-4">AI 디자인 프레임워크</h3>
              
              <div className="space-y-3 relative z-10">
                  <div className="group rounded-lg border border-amber-500/30 bg-slate-800/80 p-3 hover:bg-slate-800 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-1.5">
                              <Activity size={14} className="text-amber-400" />
                              <span className="text-xs font-bold text-slate-200">Vibe Matrix</span>
                          </div>
                          <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold border border-amber-500/20">Running</span>
                      </div>
                      <div className="text-[10px] text-slate-400">지정된 2-Tier Vibe 가중치 배합 및 은유 추출 프로세스 작동중</div>
                  </div>

                  <div className="group rounded-lg border border-indigo-500/30 bg-slate-800/80 p-3 hover:bg-slate-800 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-1.5">
                              <Cpu size={14} className="text-indigo-400" />
                              <span className="text-xs font-bold text-slate-200">Logic Matcher</span>
                          </div>
                          <span className="text-[9px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded font-bold border border-indigo-500/20">Running</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Pillar 1/2/3 연계 및 정량 솔루션 제안 필터링 (용도/면적 제한)</div>
                  </div>
              </div>
          </div>

          {/* Configurator */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col flex-1">
            <h2 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2">
              <Settings2 size={18} className="text-slate-500" />
              1. 전략 Vibe 설정 (최대 2개)
            </h2>
            
            <div className="grid grid-cols-2 gap-2 mb-6">
              {VIBES.map(vibe => {
                const isSelected = selectedVibes.includes(vibe.id);
                const selIdx = selectedVibes.indexOf(vibe.id);
                return (
                  <button
                    key={vibe.id}
                    onClick={() => toggleVibe(vibe.id)}
                    className={`relative text-left p-3 rounded-xl border transition-all duration-200 flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-amber-50 border-amber-300 shadow-sm ring-1 ring-amber-200'
                        : 'bg-slate-50 border-slate-200 hover:border-amber-200 hover:bg-amber-50/40'
                    }`}
                  >
                    {/* 선택 순서 뱃지 */}
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-500 text-white text-[8px] font-black flex items-center justify-center">
                        {selIdx + 1}
                      </span>
                    )}
                    {/* 아이콘 */}
                    <div className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-amber-100 text-amber-600' : 'bg-white text-slate-400 border border-slate-200'
                    }`}>
                      {vibe.icon}
                    </div>
                    {/* 텍스트 */}
                    <div className="min-w-0 pr-4">
                      <div className={`text-[11px] font-bold leading-snug ${isSelected ? 'text-amber-800' : 'text-slate-700'}`}>
                        {vibe.label}
                      </div>
                      <div className="text-[9px] text-slate-400 mt-0.5 leading-tight line-clamp-2">{vibe.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl">
                <p className="text-xs text-rose-600 font-medium">{error}</p>
              </div>
            )}
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 mt-auto">
              <h3 className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-wide">적용 컨텍스트 (A-1, A-3 Parameter)</h3>
              <ul className="text-xs space-y-2 text-slate-600">
                <li className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-700">용도 구분</span>
                  <span className="bg-white px-2 py-1 rounded border border-slate-200 text-slate-800 font-bold">{store.buildingUse || '미지정'}</span>
                </li>
                <li className="flex justify-between items-center pt-1">
                  <span className="font-bold text-slate-700">연면적 목표</span>
                  <span className="bg-white px-2 py-1 rounded border border-slate-200 text-emerald-600 font-bold">{Math.round(store.grossFloorArea || 0).toLocaleString()} ㎡</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || selectedVibes.length === 0}
              className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm shadow-md transition-all ${
                isGenerating || selectedVibes.length === 0
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-amber-500/25 hover:-translate-y-0.5'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  병합 분석 중...
                </>
              ) : (
                <>
                  <RefreshCw size={18} />
                  컨셉 솔루션 생성
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
