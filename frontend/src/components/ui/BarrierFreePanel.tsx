import React from 'react';
import { useProjectStore } from '@/store/projectStore';
import { ShieldCheck, Info } from 'lucide-react';

export default function BarrierFreePanel() {
    const bfChecklist = useProjectStore(s => s.barrierFreeChecklist);
    const setBfChecklist = useProjectStore(s => s.setBarrierFreeChecklist);

    return (
        <div className="flex flex-col h-full bg-slate-50/50">
            {/* 상단 헤더 영역 */}
            <div className="p-6 border-b border-slate-200 bg-white flex justify-between items-center shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">특화설계 & BF 검증</h2>
                        <p className="text-sm text-slate-500 mt-1">생애주기 맞춤형 건축 및 무장애(Barrier-Free) 특화 요구사항을 검토합니다.</p>
                    </div>
                </div>
            </div>

            {/* 메인 컨텐츠 영역 */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    
                    {/* 안내 패널 */}
                    <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 flex gap-3 text-orange-800">
                        <Info className="shrink-0 mt-0.5" size={20} />
                        <div className="text-sm">
                            <p className="font-semibold mb-1">과업지시서 기반 특화사항 연동 안내</p>
                            <p className="opacity-90">특수학교 과업지시서에서 추출된 정성적 데이터를 기반으로 BF(무장애) 지표 및 거점 클러스터를 설정하고 시뮬레이션에 반영합니다. 현재 값은 `App.tsx`의 전역 상태 스토어에 보존됩니다.</p>
                        </div>
                    </div>

                    {/* 주요 BF 설정 폼 */}
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
                            <h3 className="font-bold text-slate-800">기본 무장애(Barrier-Free) 설계 기준</h3>
                        </div>
                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-600">경사로 기울기 기준</label>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-500">1 /</span>
                                    <input 
                                        type="number" 
                                        value={bfChecklist.rampSlopeConfig}
                                        onChange={e => setBfChecklist({ rampSlopeConfig: Number(e.target.value) })}
                                        className="w-20 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400">※ 휠체어 사용자를 위해 통상 1/12 이하 적용, 특수학교는 1/18 권장</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-600">복도 유효 폭 (m)</label>
                                <input 
                                    type="number"
                                    step="0.1"
                                    value={bfChecklist.corridorWidth}
                                    onChange={e => setBfChecklist({ corridorWidth: Number(e.target.value) })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                                <p className="text-[10px] text-slate-400">※ 양방향 교행 진입장벽을 낮추기 위한 편복도 규격 (권장 3.3m 이상)</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-600">휠체어 회전반경 (m x m)</label>
                                <input 
                                    type="text"
                                    value={bfChecklist.wheelchairRotation}
                                    onChange={e => setBfChecklist({ wheelchairRotation: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                                <p className="text-[10px] text-slate-400">※ 실내 점프, 교차점, 화장실 앞 여유 공간</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-600">추천 엘리베이터 사양</label>
                                <input 
                                    type="text"
                                    value={bfChecklist.elevatorCapacity}
                                    onChange={e => setBfChecklist({ elevatorCapacity: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                                <p className="text-[10px] text-slate-400">※ 베드형 엘리베이터(병원급) 투입 권장 규모 표기</p>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
