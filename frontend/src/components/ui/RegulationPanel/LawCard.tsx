import React, { useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useProjectStore } from '@/store/projectStore';
import { RegulationLaw, analyzeSingleLawDetail, ProjectInfoForRegulation } from '@/services/regulationAnalysisService';
import { RiskBadge } from './RiskBadge';
import { LawDetailModal } from './LawDetailModal';

export function LawCard({ law }: { law: RegulationLaw }) {
    const store = useProjectStore();
    const [showDetail, setShowDetail] = useState(false);
    const [detailItems, setDetailItems] = useState<string[] | null>(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);

    const handleDetailClick = async () => {
        if (detailItems) {
            setShowDetail(!showDetail);
            return;
        }

        setIsLoadingDetail(true);
        try {
            const projectInfo: ProjectInfoForRegulation = {
                projectName: store.projectName,
                address: store.address,
                zoneType: store.zoneType,
                buildingUse: store.buildingUse,
                landArea: store.landArea,
                grossFloorArea: store.grossFloorArea,
                totalFloors: store.totalFloors,
                buildingCoverageLimit: store.buildingCoverageLimit,
                floorAreaRatioLimit: store.floorAreaRatioLimit,
                maxHeight: store.maxHeight,
                certifications: store.certifications,
            };
            const items = await analyzeSingleLawDetail(projectInfo, law.name);
            setDetailItems(items);
            setShowDetail(true);
        } catch (err) {
            console.error('세부 분석 오류:', err);
        } finally {
            setIsLoadingDetail(false);
        }
    };

    return (
        <div className={`rounded-lg border transition-all flex flex-col h-full ${law.risk === 'required' ? 'bg-red-50/50 border-red-200' :
            law.risk === 'review' ? 'bg-amber-50/50 border-amber-200' :
                law.risk === 'na' ? 'bg-slate-50/50 border-slate-200 opacity-50' :
                    'bg-orange-50/30 border-orange-200'
            }`}>
            <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[14px] font-bold text-slate-800">{law.name}</span>
                    <RiskBadge risk={law.risk} />
                </div>
                <ul className="space-y-1.5 flex-1">
                    {law.items.slice(0, 3).map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-[13px] text-slate-700">
                            <span className="text-slate-400 mt-0.5 shrink-0">•</span>
                            <span className="leading-relaxed line-clamp-2">{item}</span>
                        </li>
                    ))}
                    {law.items.length > 3 && (
                        <li className="text-[12px] text-slate-400 italic pl-4">
                            외 {law.items.length - 3}건...
                        </li>
                    )}
                </ul>

                {law.risk !== 'na' && (
                    <button
                        onClick={handleDetailClick}
                        disabled={isLoadingDetail}
                        className="mt-3 w-full py-2 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-2 transition-all
                            bg-white/80 text-slate-600 border border-slate-200 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50/50 hover:shadow-sm"
                    >
                        {isLoadingDetail ? (
                            <>
                                <Loader2 size={13} className="animate-spin" />
                                AI 상세 분석 중...
                            </>
                        ) : (
                            <>
                                <Search size={13} />
                                세부내용보기
                            </>
                        )}
                    </button>
                )}
            </div>

            <AnimatePresence>
                {showDetail && detailItems && detailItems.length > 0 && (
                    <LawDetailModal law={law} items={detailItems} onClose={() => setShowDetail(false)} />
                )}
            </AnimatePresence>
        </div>
    );
}
