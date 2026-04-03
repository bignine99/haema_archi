import React, { useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { generateDesignConcepts, type GeneratedConcept, type DesignConceptSetResult } from '@/services/conceptGeneratorService';
import { Lightbulb, Settings2, RefreshCw, Cpu, Heart, Leaf, TrendingUp, Landmark, ArrowRight, ShieldCheck, Zap, Maximize, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VIBES = [
  { id: 'tech', label: '미래 기술형', icon: <Cpu size={16} />, desc: '스마트 빌딩, 자동화' },
  { id: 'human', label: '인간 중심형', icon: <Heart size={16} />, desc: '치유, 돌봄, 커뮤니티' },
  { id: 'green', label: '지속 가능형', icon: <Leaf size={16} />, desc: '제로에너지, 자연연계' },
  { id: 'value', label: '경제 효율형', icon: <TrendingUp size={16} />, desc: '수익성 및 효율 극대화' },
  { id: 'symbol', label: '도시 상징형', icon: <Landmark size={16} />, desc: '랜드마크, 공공성' }
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
    <div className="flex-1 flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <Lightbulb className="text-amber-500" size={24} />
              디자인 컨셉 제네레이터
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              범용 설계 개념 추출 시스템 (Universal Concept Matrix) — 프로젝트 특성에 맞춘 무한 컨셉 생성
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              대상 프로젝트: {store.projectName || '기본 프로젝트'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left: Configurator Sidebar */}
        <div className="w-full lg:w-80 border-r border-slate-200 bg-white flex flex-col shrink-0">
          <div className="p-6 flex-1 overflow-y-auto">
            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Settings2 size={16} className="text-slate-500" />
              1. Vibe 설정 (최대 2개)
            </h2>
            
            <div className="space-y-3 mb-8">
              {VIBES.map(vibe => {
                const isSelected = selectedVibes.includes(vibe.id);
                return (
                  <button
                    key={vibe.id}
                    onClick={() => toggleVibe(vibe.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all duration-200 flex items-start gap-3 ${isSelected ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-slate-50 border-slate-200 hover:border-blue-300'}`}
                  >
                    <div className={`mt-0.5 p-1.5 rounded-md ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-white text-slate-400 border border-slate-200'}`}>
                      {vibe.icon}
                    </div>
                    <div>
                      <div className={`text-sm font-bold ${isSelected ? 'text-blue-800' : 'text-slate-700'}`}>{vibe.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{vibe.desc}</div>
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
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
              <h3 className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wide">프로젝트 컨텍스트</h3>
              <ul className="text-xs space-y-1.5 text-slate-600">
                <li className="flex justify-between"><span>용도</span><span className="font-medium">{store.buildingUse || '지정안됨'}</span></li>
                <li className="flex justify-between"><span>연면적</span><span className="font-medium">{Math.round(store.grossFloorArea || 0).toLocaleString()} ㎡</span></li>
              </ul>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || selectedVibes.length === 0}
              className={`w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold text-sm shadow-lg transition-all ${
                isGenerating || selectedVibes.length === 0
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/25 hover:-translate-y-0.5'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  디자인 논리 도출 중...
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  컨셉 솔루션 생성
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Results Area */}
        <div className="flex-1 bg-slate-50 overflow-y-auto p-6 md:p-10">
          {!conceptSet && !isGenerating ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
                <Lightbulb size={32} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">설계 논리가 기다리고 있습니다</h3>
              <p className="text-sm">테마를 선택하고 컨셉 생성 버튼을 눌러 프로젝트만의 전략을 도출해보세요.</p>
            </div>
          ) : isGenerating ? (
            <div className="h-full flex flex-col items-center justify-center space-y-8">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Cpu size={20} className="text-blue-500 animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-sm font-bold text-slate-700 animate-pulse">엔지니어링 & 디자인 로직 컴파일 중...</h3>
                <p className="text-xs text-slate-500">Universal DB에서 최적의 전략적 기둥을 매칭하고 있습니다.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-12">
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
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-700 text-slate-300 font-bold text-xs ring-4 ring-slate-800">
                           {cIdx + 1}
                          </span>
                        </div>
                        <div>
                          <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-700 text-slate-300 text-[10px] font-bold tracking-wider uppercase mb-3">
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
                       
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         {concept.pillars.map((pillar, pIdx) => (
                           <div key={pIdx} className="bg-slate-50 rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
                             {/* Decoration strip */}
                             <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                             
                             <div className="flex items-start gap-4 mb-5">
                               <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
                                 {getPillarIcon(pIdx)}
                               </div>
                               <div>
                                 <h4 className="font-bold text-slate-800 text-sm leading-snug">{pillar.name}</h4>
                                 <p className="text-xs text-slate-500 mt-1 leading-relaxed">{pillar.description}</p>
                               </div>
                             </div>

                             <div className="space-y-3 border-t border-slate-200 pt-5">
                               {pillar.solutions.map((sol, sIdx) => (
                                 <div key={sIdx} className="flex gap-3 items-start">
                                   <div className="mt-0.5"><ArrowRight size={14} className="text-slate-400" /></div>
                                   <div>
                                     <span className="block text-[10px] font-bold text-indigo-600 mb-0.5">{sol.type}</span>
                                     <span className="block text-xs font-medium text-slate-700 leading-snug">{sol.spec}</span>
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
      </div>
    </div>
  );
}
