import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useProjectStore, type ParcelData } from '@/store/projectStore';
import { Layers, Plus, Trash2, GripVertical, AlertTriangle, Send, Loader2, Wand2 } from 'lucide-react';
import { msaSyncService } from '@/services/msaSyncService';
import { StatisticsChartPanel } from './StatisticsChartPanel';
import DocumentUploader from '@/components/ui/DocumentUploader';
function ParcelShape({ polygon, size = 28, active = false }: {
    polygon: [number, number][]; size?: number; active?: boolean;
}) {
    const xs = polygon.map(p => p[0]); const ys = polygon.map(p => p[1]);
    const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    const w = maxX - minX || 1; const h = maxY - minY || 1; const pad = 3;
    const pts = polygon.map(([x, y]) =>
        `${pad + ((x - minX) / w) * (size - pad * 2)},${pad + ((y - minY) / h) * (size - pad * 2)}`
    ).join(' ');
    return (
        <svg width={size} height={size} className="shrink-0">
            <polygon points={pts} fill={active ? '#dbeafe' : '#f1f5f9'} stroke={active ? '#3b82f6' : '#94a3b8'} strokeWidth="1.5" />
        </svg>
    );
}


export default function SpaceProgrammingPanel() {
    const {
        floorZoning, updateFloorZoning, addFloorZoning, removeFloorZoning,
        moveRoomToFloor, autoGenerateSpaceProgram, rescaleSpaceProgram,
        address, landArea, zoneType, buildingCoverageLimit, floorAreaRatioLimit,
        totalFloors, grossFloorArea, manualGrossFloorArea, setManualGrossFloorArea
    } = useProjectStore();
    
    const store = useProjectStore();
    
    // Fallback 통계
    const actualGFA = grossFloorArea > 0 ? grossFloorArea : landArea * (floorAreaRatioLimit / 100);
    const buildingFootprint = landArea * (buildingCoverageLimit / 100);

    const stateContext = useProjectStore(s => ({
        siteId: s.selectedParcelId,
        polygon: s.landPolygon,
        coverageLimit: s.buildingCoverageLimit || 60,
        farLimit: s.floorAreaRatioLimit || 200
    }));

    const [isSyncing, setIsSyncing] = useState(false);
    const [syncError, setSyncError] = useState<string | null>(null);
    const [syncSuccess, setSyncSuccess] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const [activeTab, setActiveTab] = useState<'overview' | 'spaces' | 'charts'>('overview');

    const handleAddFloor = () => {
        addFloorZoning({
            floor: '신규 층',
            primaryUse: '용도 미정',
            secondaryUse: [],
            targetAgeGroup: '공통',
            assignedArea: 1000,
            floorTotalArea: 0,
            height: 4.0,
            zones: []
        });
    };

    const handleAutoGenerate = async () => {
        setIsGenerating(true);
        try {
            await autoGenerateSpaceProgram();
        } catch (error: any) {
            console.error('Auto Generate Error:', error);
            alert(`AI 구성 중 오류가 발생했습니다:\n${error.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleReconfigure = async () => {
        if (!rescaleSpaceProgram()) {
            // 빈 상태여서 리스케일링 할 수 없는 경우 AI 새로 생성
            await handleAutoGenerate();
        }
    };

    // DND Handlers
    const handleDragStart = (e: React.DragEvent, roomId: string, sourceFloorId: string) => {
        e.dataTransfer.setData('roomId', roomId);
        e.dataTransfer.setData('sourceFloorId', sourceFloorId);
        e.dataTransfer.effectAllowed = 'move';
        const target = e.target as HTMLElement;
        setTimeout(() => target.classList.add('opacity-50'), 0);
    };

    const handleDragEnd = (e: React.DragEvent) => {
        const target = e.target as HTMLElement;
        target.classList.remove('opacity-50');
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        e.currentTarget.classList.add('bg-blue-50', 'bg-opacity-50');
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.currentTarget.classList.remove('bg-blue-50', 'bg-opacity-50');
    };

    const handleDrop = (e: React.DragEvent, targetFloorId: string) => {
        e.preventDefault();
        e.currentTarget.classList.remove('bg-blue-50', 'bg-opacity-50');
        const roomId = e.dataTransfer.getData('roomId');
        const sourceFloorId = e.dataTransfer.getData('sourceFloorId');
        if (roomId && sourceFloorId && sourceFloorId !== targetFloorId) {
            moveRoomToFloor(roomId, sourceFloorId, targetFloorId);
        }
    };

    // 통계 계산
    const totalAssignedArea = floorZoning.reduce((acc, f) => acc + (f.floorTotalArea || 0), 0);
    const remainingArea = actualGFA - totalAssignedArea;
    const progressPercent = actualGFA > 0 ? Math.min(100, (totalAssignedArea / actualGFA) * 100) : 0;
    const isAreaOverWarning = progressPercent > 100 || remainingArea < 0;

    // Phase C 통신 연동 (MSA)
    const handleSyncToMassEngine = async () => {
        setIsSyncing(true); setSyncError(null); setSyncSuccess(false);
        try {
            const payload = {
                siteId: stateContext.siteId || 'unknown_site',
                buildLinePolygon: stateContext.polygon || [],
                floors: floorZoning.map(f => ({
                    level: parseInt(f.floor.replace(/[^0-9\-]/g, '')) || 1,
                    targetArea: f.floorTotalArea,
                    height: f.height || 4.0,
                    primaryUsages: [f.primaryUse].concat(f.secondaryUse).filter(Boolean)
                })),
                constraints: {
                    maxCoverage: stateContext.coverageLimit,
                    maxFAR: stateContext.farLimit
                }
            };
            await msaSyncService.syncScaleData(payload);
            setSyncSuccess(true);
            setTimeout(() => setSyncSuccess(false), 3000);
        } catch (err: any) {
            console.error('Failed to sync to Phase C:', err);
            setSyncError(err.message || '매스 생성 연동에 실패했습니다.');
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 bg-white flex justify-between items-center shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                        <Layers size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">층별 조닝 & 스페이스 프로그램</h2>
                        <p className="text-sm text-slate-500 mt-1">지침에 따른 설계개요 도출 및 층별 조닝 면적표</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleAutoGenerate}
                        disabled={isGenerating}
                        className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-[11px] font-bold rounded-lg transition-all"
                    >
                        {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                        과업지시서 기반 자동 구성
                    </button>
                    <div className="w-px h-6 bg-slate-300 mx-1"></div>
                    {syncError && <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded hidden lg:block">{syncError}</span>}
                    {syncSuccess && <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded hidden lg:block">매스 엔진 연동 완료 ✓</span>}
                    <button
                        onClick={handleSyncToMassEngine}
                        disabled={isSyncing}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md transition-all disabled:opacity-50"
                    >
                        {isSyncing ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        Phase C 실시간 매스 연동
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-200 bg-white px-6 pt-2 gap-2 shrink-0 justify-center">
                <button onClick={() => setActiveTab('overview')} className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors ${activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>건축개요 및 시설면적표</button>
                <button onClick={() => setActiveTab('spaces')} className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors ${activeTab === 'spaces' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>층별 세부용도 및 면적표</button>
                <button onClick={() => setActiveTab('charts')} className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors ${activeTab === 'charts' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>시설면적 세부 분석(차트)</button>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-50">
                
                {activeTab === 'overview' && (
                <div className="p-6 flex flex-col xl:flex-row gap-6 max-w-[1400px] mx-auto w-full">
                    {/* 왼쪽 컬럼: 주소검색, 지시서, 건축 개요 */}
                    <div className="w-full xl:w-1/2 space-y-6 flex flex-col shrink-0">

                        {/* ────── 과업지시서 업로드 ────── */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                            <DocumentUploader compact />
                        </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden shrink-0">
                        <div className="bg-slate-800 text-white px-4 py-3 border-b border-slate-700">
                            <h3 className="font-bold text-[13px]">설계개요</h3>
                        </div>
                        <div className="p-0">
                            <table className="w-full text-[11px] text-left">
                                <tbody className="divide-y divide-slate-100">
                                    <tr>
                                        <th className="py-3 px-4 bg-slate-50 text-slate-600 font-semibold w-1/3">대지위치</th>
                                        <td className="py-3 px-4 text-slate-800 break-all">{address}</td>
                                    </tr>
                                    <tr>
                                        <th className="py-3 px-4 bg-slate-50 text-slate-600 font-semibold">대지면적</th>
                                        <td className="py-3 px-4 text-slate-800">{landArea.toLocaleString()} ㎡</td>
                                    </tr>
                                    <tr>
                                        <th className="py-3 px-4 bg-slate-50 text-slate-600 font-semibold">지역지구</th>
                                        <td className="py-3 px-4 text-slate-800">{zoneType}</td>
                                    </tr>
                                    <tr>
                                        <th className="py-3 px-4 bg-slate-50 text-slate-600 font-semibold align-middle">연면적 목표</th>
                                        <td className="py-3 px-4 text-slate-800">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <div className="relative flex items-center">
                                                    <input 
                                                        type="number"
                                                        value={manualGrossFloorArea || actualGFA}
                                                        onChange={(e) => setManualGrossFloorArea(e.target.value ? Number(e.target.value) : null)}
                                                        className="w-28 pl-2 pr-6 py-1.5 bg-white border border-slate-200 rounded text-right text-blue-700 font-bold focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                                                    />
                                                    <span className="absolute right-2 text-slate-400 pointer-events-none">㎡</span>
                                                </div>
                                                <button 
                                                    onClick={handleReconfigure}
                                                    disabled={isGenerating}
                                                    className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 font-bold rounded flex items-center gap-1 transition-colors"
                                                >
                                                    {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                                                    적용 및 재구성
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="py-3 px-4 bg-slate-50 text-slate-600 font-semibold">건축면적</th>
                                        <td className="py-3 px-4 text-slate-800">최대 {buildingFootprint.toLocaleString(undefined, { maximumFractionDigits: 2 })} ㎡</td>
                                    </tr>
                                    <tr>
                                        <th className="py-3 px-4 bg-slate-50 text-slate-600 font-semibold">건폐율</th>
                                        <td className="py-3 px-4 text-slate-800">{buildingCoverageLimit} % 이하</td>
                                    </tr>
                                    <tr>
                                        <th className="py-3 px-4 bg-slate-50 text-slate-600 font-semibold">용적률</th>
                                        <td className="py-3 px-4 text-slate-800">{floorAreaRatioLimit} % 이하</td>
                                    </tr>
                                    <tr>
                                        <th className="py-3 px-4 bg-slate-50 text-slate-600 font-semibold">층수 (기준)</th>
                                        <td className="py-3 px-4 text-slate-800">지하 1층, 지상 {totalFloors - 1}층</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-3 shrink-0">
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <h3 className="text-[14px] font-bold text-slate-700">연면적 배분 현황</h3>
                                <p className="text-[11px] text-slate-500">지정면적 합계 / 목표 연면적</p>
                            </div>
                            <div className="text-right">
                                <span className={`text-[20px] font-bold tracking-tight ${isAreaOverWarning ? 'text-red-500' : 'text-emerald-600'}`}>
                                    {totalAssignedArea.toLocaleString()}
                                </span>
                                <span className="text-[13px] font-medium text-slate-500 ml-1">/ {actualGFA.toLocaleString(undefined, { maximumFractionDigits: 0 })} ㎡</span>
                            </div>
                        </div>
                        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
                            <div 
                                className={`h-full transition-all duration-500 ${isAreaOverWarning ? 'bg-red-500' : 'bg-emerald-500'}`}
                                style={{ width: `${Math.min(100, progressPercent)}%` }}
                            />
                        </div>
                        {isAreaOverWarning && (
                            <p className="text-sm text-red-500 font-semibold text-right flex items-center justify-end gap-1 mt-1">
                                <AlertTriangle size={14} /> 한도 초과.
                            </p>
                        )}
                    </div>
                    </div>

                    {/* 오른쪽 컬럼 자리: 추가적인 공간이나 빈 공간 확보 */}
                    <div className="w-full xl:w-1/2 flex flex-col shrink-0 gap-6">
                         <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden shrink-0">
                             <div className="bg-slate-800 text-white px-5 py-4 border-b border-slate-700 flex justify-between items-center">
                                 <h3 className="font-bold text-[14px]">층별 면적 소계 요약</h3>
                             </div>
                             <div className="p-0">
                                 <table className="w-full text-sm text-left">
                                     <thead className="bg-slate-50 border-b border-slate-200">
                                         <tr>
                                             <th className="py-3 px-5 text-slate-600 font-semibold w-1/4">층별</th>
                                             <th className="py-3 px-5 text-slate-600 font-semibold w-1/4">주용도</th>
                                             <th className="py-3 px-5 text-slate-600 font-semibold w-1/4 text-right">층별 소계(㎡)</th>
                                             <th className="py-3 px-5 text-slate-600 font-semibold text-right">전체 대비 비중</th>
                                         </tr>
                                     </thead>
                                     <tbody className="divide-y divide-slate-100">
                                         {floorZoning.map(fz => {
                                             const ratio = actualGFA > 0 ? ((fz.floorTotalArea / actualGFA) * 100).toFixed(1) : '0.0';
                                             return (
                                                 <tr key={fz.id} className="hover:bg-slate-50/50">
                                                     <td className="py-3 px-5 text-slate-800 font-semibold">{fz.floor}</td>
                                                     <td className="py-3 px-5 text-slate-600">{fz.primaryUse}</td>
                                                     <td className="py-3 px-5 text-right font-bold text-blue-700">{fz.floorTotalArea.toLocaleString()}</td>
                                                     <td className="py-3 px-5 text-right text-slate-500">{ratio}%</td>
                                                 </tr>
                                             );
                                         })}
                                         <tr className="bg-slate-100 border-t-2 border-slate-300">
                                              <td colSpan={2} className="py-3 px-5 font-bold text-slate-800 text-center">총계</td>
                                              <td className="py-3 px-5 text-right font-bold text-blue-800">{totalAssignedArea.toLocaleString()}</td>
                                              <td className="py-3 px-5 text-right font-bold text-slate-600 max-w-[120px]">
                                                 <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-1 inline-block align-middle mb-1 border border-slate-300">
                                                    <div className={`h-full ${isAreaOverWarning ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, progressPercent)}%` }}></div>
                                                 </div>
                                                 <div className="text-xs">{progressPercent.toFixed(1)}%</div>
                                              </td>
                                         </tr>
                                     </tbody>
                                 </table>
                             </div>
                         </div>
                    </div>
                </div>
                )}

                {/* Tab 2: 층별 세부용도 및 면적표 (디테일 뷰) */}
                {activeTab === 'spaces' && (
                <div className="p-4 flex h-full">
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
                        <h3 className="font-bold text-slate-800 text-[13px] flex items-center gap-2">
                            층별 세부용도 및 면적표
                            <span className="text-[10px] font-normal text-slate-500 ml-1">(Drag & Drop 조닝 지원)</span>
                        </h3>
                        <button 
                            onClick={handleAddFloor}
                            className="px-2.5 py-1.5 text-[11px] font-medium text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-md flex items-center gap-1 transition-colors"
                        >
                            <Plus size={12} /> 층 추가
                        </button>
                    </div>
                    {/* 듀얼 스크롤바 방지를 위해 overflow-auto를 삭제하고 자연스럽게 늘어나게 함. 가로 스크롤은 필요 시 overflow-x-auto만 유지. */}
                    <div className="flex-1 overflow-x-auto p-3">
                        <table className="w-full text-[11px] text-left border-collapse min-w-[600px] border border-slate-300">
                            <thead className="bg-slate-100 border-b-2 border-slate-400">
                                <tr>
                                    <th className="py-2.5 px-4 font-bold text-slate-700 w-16 text-center border border-slate-300" rowSpan={2}>층별</th>
                                    <th className="py-2.5 px-4 font-bold text-slate-700 border border-slate-300 text-center" rowSpan={2}>용도 (Room)</th>
                                    <th className="py-2 px-4 font-bold text-slate-700 text-center border border-slate-300" colSpan={3}>바닥면적(㎡)</th>
                                    <th className="py-2.5 px-2 font-bold text-slate-700 border border-slate-300 w-12 text-center" rowSpan={2}>삭제</th>
                                </tr>
                                <tr>
                                    <th className="py-2 px-4 font-medium text-slate-700 text-right border border-slate-300 w-24 bg-white/50">전용면적</th>
                                    <th className="py-2 px-4 font-medium text-slate-700 text-right border border-slate-300 w-24 bg-white/50">공용면적</th>
                                    <th className="py-2 px-4 font-bold text-slate-800 text-right border border-slate-300 w-28 bg-slate-200/50">합계</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* 총계 Row */}
                                <tr className="bg-slate-800 text-white font-bold text-[12px]">
                                    <td className="py-2.5 px-4 text-center border-r border-slate-700">총계</td>
                                    <td className="py-2.5 px-4 border-r border-slate-700 text-center">-</td>
                                    <td className="py-2.5 px-4 text-right border-r border-slate-700">-</td>
                                    <td className="py-2.5 px-4 text-right border-r border-slate-700">-</td>
                                    <td className="py-2.5 px-4 text-right text-amber-300 border-r border-slate-700">{totalAssignedArea.toLocaleString()}</td>
                                    <td className="py-2.5 px-2 border-l border-slate-700 bg-slate-900"></td>
                                </tr>

                                {floorZoning.map(fz => {
                                    return (
                                        <React.Fragment key={fz.id}>
                                            <tr 
                                                className="bg-slate-50 border-t-2 border-slate-300 group transition-colors"
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onDrop={(e) => handleDrop(e, fz.id)}
                                            >
                                                <td className="py-2 px-4 text-center font-bold text-slate-800 border-x border-slate-300 bg-white shadow-[inset_4px_0_0_0_#94a3b8]">
                                                    <input 
                                                        value={fz.floor}
                                                        onChange={e => updateFloorZoning(fz.id, { floor: e.target.value })}
                                                        className="w-full text-center bg-transparent border-b border-transparent hover:border-slate-300 focus:outline-none" 
                                                    />
                                                </td>
                                                <td className="py-2 px-4 font-bold text-slate-700 border-r border-slate-300 flex items-center justify-between bg-slate-100 min-h-[46px]">
                                                    <span>소계 ({fz.primaryUse})</span>
                                                </td>
                                                <td className="py-2 px-4 text-right border-r border-slate-300 text-slate-500 bg-slate-50">-</td>
                                                <td className="py-2 px-4 text-right border-r border-slate-300 text-slate-500 bg-slate-50">-</td>
                                                <td className="py-2 px-4 text-right font-bold text-blue-800 bg-blue-50 border-r border-slate-300">{fz.floorTotalArea.toLocaleString()}</td>
                                                <td className="py-2 px-2 border-r border-slate-300 text-center bg-white">
                                                    <button onClick={() => removeFloorZoning(fz.id)} className="text-slate-300 hover:text-red-500 p-1 mx-auto block">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </td>
                                            </tr>

                                            {fz.zones.map(zone => (
                                                <React.Fragment key={zone.id}>
                                                    {zone.rooms.map((room, idx) => (
                                                        <tr 
                                                            key={room.id}
                                                            draggable
                                                            onDragStart={(e) => handleDragStart(e, room.id, fz.id)}
                                                            onDragEnd={handleDragEnd}
                                                            className="hover:bg-blue-50/50 group cursor-grab active:cursor-grabbing transition-colors border-b border-slate-200"
                                                        >
                                                            <td className="border-x border-slate-300 bg-white"></td>
                                                            <td className="py-1.5 px-3 text-slate-700 border-r border-slate-300 flex items-center pr-2">
                                                                <span className="text-slate-300 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity -ml-3 mr-1">
                                                                    <GripVertical size={12} />
                                                                </span>
                                                                <span className="flex-1 truncate text-[11px] font-medium">{room.name}</span>
                                                                {room.isRequired && <span className="ml-2 text-[9px] bg-red-100 text-red-700 px-1 py-0.5 rounded shrink-0 font-bold">필수</span>}
                                                            </td>
                                                            <td className="py-1.5 px-3 text-right text-slate-600 border-r border-slate-300 font-mono text-[11px]">
                                                                <input
                                                                    type="number"
                                                                    value={room.netArea}
                                                                    onChange={(e) => useProjectStore.getState().updateRoomArea(fz.id, zone.id, room.id, 'netArea', Number(e.target.value))}
                                                                    className="w-[60px] text-right bg-transparent border-b border-transparent hover:border-blue-300 focus:outline-none focus:border-blue-500 focus:bg-blue-50/30 transition-colors"
                                                                />
                                                            </td>
                                                            <td className="py-1.5 px-3 text-right text-slate-600 border-r border-slate-300 font-mono text-[11px]">
                                                                <input
                                                                    type="number"
                                                                    value={room.commonArea}
                                                                    onChange={(e) => useProjectStore.getState().updateRoomArea(fz.id, zone.id, room.id, 'commonArea', Number(e.target.value))}
                                                                    className="w-[60px] text-right bg-transparent border-b border-transparent hover:border-blue-300 focus:outline-none focus:border-blue-500 focus:bg-blue-50/30 transition-colors"
                                                                />
                                                            </td>
                                                            <td className="py-1.5 px-3 text-right font-semibold text-slate-700 border-r border-slate-300 font-mono bg-slate-50 text-[10px]">
                                                                {room.totalArea.toLocaleString()}
                                                            </td>
                                                            <td className="border-r border-slate-300 bg-white"></td>
                                                        </tr>
                                                    ))}
                                                </React.Fragment>
                                            ))}
                                            
                                            {/* 빈 층일 경우 드래그 안내 메시지 영역 */}
                                            {fz.floorTotalArea === 0 && (
                                                <tr>
                                                    <td className="border-x border-slate-300 bg-white"></td>
                                                    <td colSpan={4} className="py-4 text-center text-[10px] text-slate-400 border-r border-slate-300 bg-slate-50/50">
                                                        이곳으로 실(Room)을 드래그 앤 드롭 하거나, 추가 버튼을 사용하세요.
                                                    </td>
                                                    <td className="border-r border-slate-300"></td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                </div>
                )}
                
                {/* Tab 3: 시설면적 세부 분석 (차트) */}
                {activeTab === 'charts' && (
                <div className="p-4 h-full">
                    {/* 하단 통계 차트 영역을 전체 화면 탭으로 활용 */}
                    <StatisticsChartPanel />
                </div>
                )}
                
            </div>
        </div>
    );
}
