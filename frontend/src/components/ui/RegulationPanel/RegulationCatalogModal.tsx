import React from 'react';
import { BookOpen, AlertTriangle, Info, X } from 'lucide-react';
import { REGULATION_CATALOG } from './constants';

export function RegulationCatalogModal({ onClose }: { onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center" onClick={onClose}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div
                className="relative bg-white rounded-lg shadow-2xl border border-slate-200 max-w-3xl w-full mx-4 max-h-[85vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* 모달 헤더 */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <BookOpen size={18} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-800">분석 법규 목록 (8대 카테고리)</h3>
                            <p className="text-[10px] text-slate-500">총 26+개 법규를 프로젝트 정보 기반으로 AI가 종합 분석합니다</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                        <X size={18} className="text-slate-500" />
                    </button>
                </div>

                {/* 모달 본문 */}
                <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4 custom-scrollbar">
                    {/* 안내 배너 */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-start gap-2">
                        <Info size={14} className="text-orange-600 shrink-0 mt-0.5" />
                        <div className="text-[11px] text-orange-800 leading-relaxed">
                            <strong>분석 방식:</strong> 프로젝트 정보(용도, 면적, 층수, 인증 등)를 Gemini AI에 전달하여 각 법규별 적용 여부와
                            구체적 수치 기준을 생성합니다. <code className="bg-orange-100 px-1 rounded">temperature=0</code> 설정으로 동일 입력에 대해 항상 일관된 결과를 보장합니다.
                        </div>
                    </div>

                    {/* 리스크 등급 범례 */}
                    <div className="flex items-center gap-4 text-[10px]">
                        <span className="font-semibold text-slate-600">리스크 등급:</span>
                        <span className="flex items-center gap-1"><span className="text-red-500">🔴</span><strong>필수</strong> — 위반 시 인허가 불가</span>
                        <span className="flex items-center gap-1"><span className="text-amber-500">🟡</span><strong>검토</strong> — 설계 단계 확인 필요</span>
                        <span className="flex items-center gap-1"><span className="text-orange-500">🔵</span><strong>참고</strong> — 권장사항</span>
                        <span className="flex items-center gap-1"><span className="text-slate-400">⚪</span><strong>해당없음</strong></span>
                    </div>

                    {/* 카테고리별 법규 목록 */}
                    {REGULATION_CATALOG.map(cat => (
                        <div key={cat.id} className="rounded-lg border border-slate-200 overflow-hidden">
                            <div className="bg-slate-50 px-4 py-2.5 flex items-center gap-2 border-b border-slate-200">
                                <span className="text-base">{cat.icon}</span>
                                <span className="text-[10px] text-slate-400 font-mono">{cat.id}</span>
                                <span className="text-[12px] font-bold text-slate-800">{cat.title}</span>
                                <span className="ml-auto text-[10px] text-slate-500">{cat.laws.length}개 법규</span>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {cat.laws.map((law, i) => (
                                    <div key={i} className="px-4 py-2.5 flex items-start gap-3 hover:bg-slate-50/50 transition-colors">
                                        <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                            {i + 1}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[11px] font-bold text-slate-800">{law.name}</p>
                                            <p className="text-[10px] text-slate-500 leading-relaxed">{law.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* 하단 참고 */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                        <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-[10px] text-amber-800 leading-relaxed">
                            <strong>참고:</strong> 프로젝트 용도가 '교육연구시설'인 경우, B7 카테고리에 학교시설사업촉진법·학교보건법이 자동 추가됩니다.
                            AI 분석 결과는 설계 참고용이며, 최종 법규 적합 여부는 관할 구청 및 건축사의 확인이 필요합니다.
                        </div>
                    </div>
                </div>

                {/* 모달 푸터 */}
                <div className="px-6 py-3 border-t border-slate-200 flex justify-end shrink-0">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-lg bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition-colors"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}
