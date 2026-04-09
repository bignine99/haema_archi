import React, { useState } from 'react';
import { ChevronDown, ChevronRight, ClipboardList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RegulationCategory } from '@/services/regulationAnalysisService';
import { CATEGORY_ICONS } from './constants';
import { LawCard } from './LawCard';

export function CategoryAccordion({ category }: { category: RegulationCategory }) {
    const [open, setOpen] = useState(category.requiredCount > 0);
    const Icon = CATEGORY_ICONS[category.id] || ClipboardList;
    const applicableLaws = category.laws.filter(l => l.risk !== 'na');
    const naLaws = category.laws.filter(l => l.risk === 'na');

    return (
        <div className="rounded-lg border border-slate-200 overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center gap-3 px-4 py-3.5 bg-white hover:bg-slate-50 transition-colors text-left"
            >
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <span className="text-[14px] font-bold text-slate-800 block">{category.title}</span>
                    <span className="text-[12px] text-slate-500">
                        {category.totalCount}개 법규 적용
                        {category.requiredCount > 0 && (
                            <span className="text-red-600 font-semibold ml-2">
                                {category.requiredCount}건 필수
                            </span>
                        )}
                    </span>
                </div>
                {open ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 bg-slate-50/50 border-t border-slate-100">
                            <div className="pt-3 grid grid-cols-2 gap-3">
                                {applicableLaws.map((law, i) => (
                                    <LawCard key={i} law={law} />
                                ))}
                            </div>
                            {naLaws.length > 0 && (
                                <div className="text-[12px] text-slate-400 italic pt-2 mt-2 border-t border-slate-100">
                                    해당없음: {naLaws.map(l => l.name).join(', ')}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
