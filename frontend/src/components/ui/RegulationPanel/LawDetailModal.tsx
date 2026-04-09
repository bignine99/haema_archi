import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Info, X } from 'lucide-react';
import { RegulationLaw } from '@/services/regulationAnalysisService';
import { RiskBadge } from './RiskBadge';

interface Props {
    law: RegulationLaw;
    items: string[];
    onClose: () => void;
}

export function LawDetailModal({ law, items, onClose }: Props) {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-lg shadow-2xl w-[90%] max-w-lg max-h-[75vh] flex flex-col overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* 헤더 */}
                <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-blue-50 shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                        <BookOpen size={14} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-[14px] font-bold text-slate-800 truncate">{law.name}</h3>
                        <p className="text-[12px] text-slate-500">AI 상세 분석 · {items.length}개 조항</p>
                    </div>
                    <RiskBadge risk={law.risk} />
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors ml-1">
                        <X size={16} className="text-slate-400" />
                    </button>
                </div>
                {/* 본문 */}
                <div className="flex-1 overflow-y-auto px-5 py-4 custom-scrollbar">
                    <ol className="space-y-3">
                        {items.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-[13px] text-slate-700 leading-relaxed">
                                <span className="text-orange-400 font-mono shrink-0 mt-px text-[12px] w-5 text-right font-bold">
                                    {i + 1}.
                                </span>
                                <span>{item.replace(/^\d+\.\s*/, '')}</span>
                            </li>
                        ))}
                    </ol>
                </div>
                {/* 푸터 */}
                <div className="px-5 py-3 border-t border-slate-100 flex items-center gap-2 bg-slate-50 shrink-0">
                    <Info size={11} className="text-slate-400" />
                    <span className="text-[11px] text-slate-400 italic">AI 분석 결과 · temperature=0 · 설계 참고용</span>
                </div>
            </motion.div>
        </div>
    );
}
