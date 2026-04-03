import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectStore, TYPOLOGY_LABELS, type TypologyType } from '@/store/projectStore';
import { Boxes, RotateCw, Loader2, Maximize, Ruler, AlertCircle, CheckCircle2, ChevronRight, X, Sparkles, Send } from 'lucide-react';

export default function AIMassPanel({ onClose }: { onClose?: () => void }) {
    const store = useProjectStore();
    const [expandedType, setExpandedType] = useState<TypologyType | null>(store.selectedTypology);
    const [chatMsg, setChatMsg] = useState("");

    // Sync expandedType with selectedTypology
    useEffect(() => {
        setExpandedType(store.selectedTypology);
    }, [store.selectedTypology]);

    const handleGenerate = async (type: TypologyType | 'ALL') => {
        try {
            await store.generateMassing(type as any);
        } catch (e) {
            console.error('매스 생성 실패:', e);
        }
    };

    const handleSendChat = async (msg: string) => {
        if (!msg.trim() || store.chatLoading) return;
        setChatMsg("");
        await store.sendMassingChat(msg);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute left-4 top-20 bottom-4 w-80 bg-white/95 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-2xl flex flex-col z-30 overflow-hidden"
        >
            {/* 헤더 */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-orange-50 to-amber-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                        <Boxes size={16} className="text-orange-600" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-800">AI 매스 대안 설계</h2>
                        <p className="text-[10px] text-slate-500">법규/대지 기반 볼륨 최적화</p>
                    </div>
                </div>
                {onClose && (
                    <button onClick={onClose} className="p-1 hover:bg-orange-200/50 rounded-lg text-slate-400 transition-colors">
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* 메인 콘텐츠 (스크롤) */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-4">
                
                {/* 0. AI 채팅 (신규) */}
                <div className="bg-gradient-to-br from-indigo-50/50 to-blue-50/50 border border-indigo-100 rounded-xl p-3 shadow-inner">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Sparkles size={14} className="text-indigo-500" />
                            <span className="text-[11px] font-bold text-indigo-900">HAEMA AI 어시스턴트</span>
                        </div>
                        {store.chatLoading && <Loader2 size={12} className="animate-spin text-indigo-500" />}
                    </div>
                    {store.aiComment ? (
                        <div className="bg-white/80 border border-indigo-200 text-indigo-800 text-[10px] p-2 rounded-lg mb-2 shadow-sm leading-relaxed whitespace-pre-wrap">
                            {store.aiComment}
                        </div>
                    ) : (
                        <div className="text-[10px] text-indigo-700/70 mb-2 leading-relaxed">
                            원하시는 지시사항을 자연어로 입력하세요.<br/>(예: "건폐율을 꽉 채워서 중정형으로 뽑아줘")
                        </div>
                    )}
                    
                    <div className="relative flex flex-col gap-1.5">
                        <div className="relative">
                            <textarea
                                value={chatMsg}
                                onChange={e => setChatMsg(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendChat(chatMsg);
                                    }
                                }}
                                disabled={store.chatLoading}
                                placeholder={store.chatLoading ? "AI가 지시사항을 수행 중입니다..." : "AI에게 매스 제어 명령 내리기..."}
                                className="w-full text-[11px] bg-white border border-indigo-100 rounded-lg p-2 pr-8 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm disabled:opacity-50"
                                rows={2}
                            />
                            <button 
                                onClick={() => handleSendChat(chatMsg)}
                                disabled={!chatMsg.trim() || store.chatLoading} 
                                className="absolute bottom-1 right-1 p-1.5 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors disabled:opacity-50"
                            >
                                <Send size={12} />
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1 custom-scrollbar">
                        <button onClick={() => handleSendChat("조경 특화 및 옥상 녹화를 반영해서 중정형으로 배치해줘")} disabled={store.chatLoading} className="whitespace-nowrap px-2 py-1 bg-white border border-indigo-100 text-indigo-600 rounded-md text-[9px] hover:bg-indigo-50 shadow-sm font-medium transition-colors disabled:opacity-50">+ 조경 특화</button>
                        <button onClick={() => handleSendChat("가장 수익성이 높은 타워형으로 뽑고, 인센티브 모두 켜줘")} disabled={store.chatLoading} className="whitespace-nowrap px-2 py-1 bg-white border border-indigo-100 text-indigo-600 rounded-md text-[9px] hover:bg-indigo-50 shadow-sm font-medium transition-colors disabled:opacity-50">+ 최대 수익형</button>
                        <button onClick={() => handleSendChat("지능형 건축물 인센티브 켜고, ㄷ자형 건물로 뽑아줘")} disabled={store.chatLoading} className="whitespace-nowrap px-2 py-1 bg-white border border-indigo-100 text-indigo-600 rounded-md text-[9px] hover:bg-indigo-50 shadow-sm font-medium transition-colors disabled:opacity-50">+ 지능형 ㄷ자형</button>
                    </div>
                </div>
                
                {/* 1. 디자인 조건 요약 */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <div className="flex items-center gap-1.5 mb-2">
                        <Ruler size={12} className="text-slate-500" />
                        <span className="text-[11px] font-bold text-slate-700">입력 디자인 제약조건</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div className="flex justify-between items-center bg-white px-2 py-1.5 rounded-md border border-slate-100">
                            <span className="text-slate-500">최대 건폐율</span>
                            <span className="font-bold text-blue-600">{store.buildingCoverageLimit}%</span>
                        </div>
                        <div className="flex justify-between items-center bg-white px-2 py-1.5 rounded-md border border-slate-100">
                            <span className="text-slate-500">최대 용적률</span>
                            <span className="font-bold text-cyan-600">{store.floorAreaRatioLimit}%</span>
                        </div>
                        <div className="flex justify-between items-center bg-white px-2 py-1.5 rounded-md border border-slate-100">
                            <span className="text-slate-500">대지면적</span>
                            <span className="font-bold text-slate-700">{store.landArea.toLocaleString()}㎡</span>
                        </div>
                        <div className="flex justify-between items-center bg-white px-2 py-1.5 rounded-md border border-slate-100">
                            <span className="text-slate-500">최고 높이</span>
                            <span className="font-bold text-slate-700">{store.maxHeight}m</span>
                        </div>
                    </div>
                </div>

                {/* 1.5. 인센티브 완화 스위치 */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-emerald-100">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                            <CheckCircle2 size={12} className="text-emerald-600" />
                            <span className="text-[11px] font-bold text-slate-700">친환경·공개공지 법규 완화</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        {[
                            { id: 'publicOpenSpace', label: '공개공지 확보 (용적/높이 +20%)' },
                            { id: 'greenBuilding', label: '녹색·ZEB 인증 (건/용/높 +15%)' },
                            { id: 'intelligentBuilding', label: '지능형건축물 (건/용/높 +15%)' },
                            { id: 'greenRoof', label: '옥상녹화 등 (건/용 +5%)' }
                        ].map(({ id, label }) => {
                            const isChecked = store.incentives[id as keyof typeof store.incentives];
                            return (
                                <label key={id} className="flex items-center justify-between cursor-pointer group">
                                    <span className={`text-[10px] transition-colors ${isChecked ? 'text-emerald-700 font-bold' : 'text-slate-600 group-hover:text-slate-900'}`}>{label}</span>
                                    <div className={`w-7 h-4 rounded-full transition-colors relative shadow-inner ${isChecked ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                        <div className={`absolute top-0.5 left-0.5 bg-white w-3 h-3 rounded-full shadow transition-transform ${isChecked ? 'translate-x-3' : ''}`} />
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        className="hidden" 
                                        checked={isChecked} 
                                        onChange={(e) => store.setIncentives({ [id]: e.target.checked })} 
                                    />
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* 2. 대안 리스트 */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-slate-700">매스 대안 목록</span>
                        <button
                            onClick={() => handleGenerate('ALL')}
                            disabled={store.massingLoading}
                            className="flex items-center gap-1 px-2 py-1 rounded-md bg-orange-100 text-orange-700 text-[10px] font-semibold hover:bg-orange-200 transition-colors disabled:opacity-50"
                        >
                            {store.massingLoading ? <Loader2 size={10} className="animate-spin" /> : <RotateCw size={10} />}
                            전체 자동 생성
                        </button>
                    </div>

                    <div className="space-y-2">
                        {(Object.keys(TYPOLOGY_LABELS) as TypologyType[]).map(type => {
                            const isSelected = store.selectedTypology === type;
                            const result = store.allTypologyResults.find(r => r.typology_type === type);
                            const hasResult = !!result && !result.error;
                            const isExpanded = expandedType === type;

                            return (
                                <div key={type} className={`border rounded-xl overflow-hidden transition-all ${isSelected ? 'border-orange-400 shadow-md ring-2 ring-orange-400/20' : 'border-slate-200 hover:border-orange-300'}`}>
                                    {/* 아코디언 헤더 */}
                                    <button
                                        onClick={() => {
                                            store.setSelectedTypology(type);
                                            setExpandedType(isExpanded && isSelected ? null : type);
                                            store.setShowMassing(true); // 활성화 시 뷰어에 보이도록
                                        }}
                                        className={`w-full flex items-center justify-between p-3 text-left transition-colors ${isSelected ? 'bg-orange-50' : 'bg-white'}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${hasResult ? 'bg-green-500' : 'bg-slate-300'}`} />
                                            <div>
                                                <div className={`text-[12px] font-bold ${isSelected ? 'text-orange-900' : 'text-slate-700'}`}>
                                                    {TYPOLOGY_LABELS[type]}
                                                </div>
                                                {hasResult ? (
                                                    <div className="text-[9px] text-slate-500 mt-0.5">
                                                        건폐 {result.calculated_coverage_pct}% / 용적 {result.calculated_far_pct}%
                                                    </div>
                                                ) : (
                                                    <div className="text-[9px] text-slate-400 mt-0.5">대안 생성 대기중</div>
                                                )}
                                            </div>
                                        </div>
                                        <ChevronRight size={14} className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                    </button>

                                    {/* 아코디언 바디 */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="bg-white border-t border-slate-100 overflow-hidden"
                                            >
                                                <div className="p-3 bg-slate-50/50 space-y-3">
                                                    {hasResult ? (
                                                        <>
                                                            <div className="grid grid-cols-2 gap-2 text-[10px]">
                                                                <div className="bg-white p-2 rounded border border-slate-100">
                                                                    <div className="text-slate-400 mb-0.5">건축면적</div>
                                                                    <div className="font-bold text-slate-700">{result.total_footprint_area_sqm.toLocaleString()} ㎡</div>
                                                                </div>
                                                                <div className="bg-white p-2 rounded border border-slate-100">
                                                                    <div className="text-slate-400 mb-0.5">연면적 (GFA)</div>
                                                                    <div className="font-bold text-slate-700">{result.total_gfa_sqm.toLocaleString()} ㎡</div>
                                                                </div>
                                                                <div className="bg-white p-2 rounded border border-slate-100">
                                                                    <div className="text-slate-400 mb-0.5">건물 최고 높이</div>
                                                                    <div className="font-bold text-slate-700">{result.max_height_m} m</div>
                                                                </div>
                                                                <div className="bg-white p-2 rounded border border-slate-100">
                                                                    <div className="text-slate-400 mb-0.5">지상 층수</div>
                                                                    <div className="font-bold text-slate-700">{result.total_floors} 층</div>
                                                                </div>
                                                            </div>
                                                            {result.warnings && result.warnings.length > 0 && (
                                                                <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-[10px] text-yellow-800 flex gap-1.5 items-start">
                                                                    <AlertCircle size={12} className="shrink-0 mt-0.5 text-yellow-600" />
                                                                    <div className="flex flex-col gap-0.5">
                                                                        {result.warnings.map((w, idx) => <span key={idx}>{w}</span>)}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </>
                                                    ) : result?.error ? (
                                                        <div className="bg-red-50 border border-red-200 rounded p-2 text-[10px] text-red-600 flex gap-1.5 items-start">
                                                            <AlertCircle size={12} className="shrink-0 mt-0.5" />
                                                            <span>{result.error}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-4">
                                                            <p className="text-[11px] text-slate-400 mb-3">아직 생성된 모델이 없습니다.</p>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleGenerate(type); }}
                                                                disabled={store.massingLoading}
                                                                className="px-4 py-1.5 rounded-lg bg-orange-500 text-white text-[11px] font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 shadow-md shadow-orange-500/20"
                                                            >
                                                                {store.massingLoading ? <Loader2 size={12} className="animate-spin" /> : <Boxes size={12} />}
                                                                이 대안 생성하기
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>

            {/* 3. 에러 알림 하단 */}
            <AnimatePresence>
                {store.massingError && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="bg-red-50 border-t border-red-100 p-3 flex items-start gap-2"
                    >
                        <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-red-600 break-words">{store.massingError}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
