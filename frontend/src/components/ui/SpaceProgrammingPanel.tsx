import React, { useState } from 'react';
import { useProjectStore, type FloorZoning, type Zone, type Room } from '@/store/projectStore';
import { Layers, Bus, Plus, Trash2, Maximize2, ChevronDown, ChevronRight, GripVertical, AlertTriangle, Send, Loader2 } from 'lucide-react';
import { msaSyncService } from '@/services/msaSyncService';

export default function SpaceProgrammingPanel() {
    const floorZoning = useProjectStore(s => s.floorZoning);
    const updateFloorZoning = useProjectStore(s => s.updateFloorZoning);
    const addFloorZoning = useProjectStore(s => s.addFloorZoning);
    const removeFloorZoning = useProjectStore(s => s.removeFloorZoning);
    // grossFloorArea may not be immediately available in the new store version, replacing with a fallback calculation if not found
    const grossFloorArea = useProjectStore(s => (s as any).grossFloorArea) || 10000;
    const moveRoomToFloor = useProjectStore(s => s.moveRoomToFloor);
    
    const stateContext = useProjectStore(s => ({
        siteId: (s as any).selectedParcelId,
        polygon: (s as any).landPolygon,
        coverageLimit: (s as any).buildingCoverageLimit || 60,
        farLimit: (s as any).floorAreaRatioLimit || 200
    }));

    const [expandedFloors, setExpandedFloors] = useState<Record<string, boolean>>({});
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncError, setSyncError] = useState<string | null>(null);
    const [syncSuccess, setSyncSuccess] = useState(false);

    const toggleFloor = (id: string) => {
        setExpandedFloors(prev => ({ ...prev, [id]: !prev[id] }));
    };

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

    // DND Handlers
    const handleDragStart = (e: React.DragEvent, roomId: string, sourceFloorId: string) => {
        e.dataTransfer.setData('roomId', roomId);
        e.dataTransfer.setData('sourceFloorId', sourceFloorId);
        e.dataTransfer.effectAllowed = 'move';
        
        const target = e.target as HTMLElement;
        setTimeout(() => {
            target.classList.add('opacity-50');
        }, 0);
    };

    const handleDragEnd = (e: React.DragEvent) => {
        const target = e.target as HTMLElement;
        target.classList.remove('opacity-50');
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        e.currentTarget.classList.add('bg-blue-50');
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.currentTarget.classList.remove('bg-blue-50');
    };

    const handleDrop = (e: React.DragEvent, targetFloorId: string) => {
        e.preventDefault();
        e.currentTarget.classList.remove('bg-blue-50');
        
        const roomId = e.dataTransfer.getData('roomId');
        const sourceFloorId = e.dataTransfer.getData('sourceFloorId');
        
        if (roomId && sourceFloorId && sourceFloorId !== targetFloorId) {
            moveRoomToFloor(roomId, sourceFloorId, targetFloorId);
        }
    };

    // 통계 계산
    const totalAssignedArea = floorZoning.reduce((acc, f) => acc + (f.floorTotalArea || 0), 0);
    const remainingArea = grossFloorArea - totalAssignedArea;
    const progressPercent = grossFloorArea > 0 ? Math.min(100, (totalAssignedArea / grossFloorArea) * 100) : 0;

    // Phase C 통신 연동 (MSA)
    const handleSyncToMassEngine = async () => {
        setIsSyncing(true);
        setSyncError(null);
        setSyncSuccess(false);

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

    const isAreaOverWarning = progressPercent > 100 || (remainingArea < 0);

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
                        <p className="text-sm text-slate-500 mt-1">생애주기별 수직 조닝 및 공간 데이터를 관리합니다.</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    {syncError && <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded hidden lg:block">{syncError}</span>}
                    {syncSuccess && <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded hidden lg:block">매스 엔진 연동 완료 ✓</span>}
                    <button
                        onClick={handleSyncToMassEngine}
                        disabled={isSyncing}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSyncing ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        Phase C 실시간 매스 연동
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-5xl mx-auto space-y-6">

                    {/* 상단 통계 바 */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4">
                        <div className="flex justify-between items-end">
                            <div>
                                <h3 className="text-sm font-bold text-slate-700">전체 스페이스 배분 현황</h3>
                                <p className="text-xs text-slate-500">지정된 층별 총 면적의 합계 / 허용 연면적 (임시 10,000㎡)</p>
                            </div>
                            <div className="text-right">
                                <span className={`text-2xl font-bold ${isAreaOverWarning ? 'text-red-500' : 'text-emerald-600'}`}>
                                    {totalAssignedArea.toLocaleString()}
                                </span>
                                <span className="text-sm font-medium text-slate-500 ml-1">/ {grossFloorArea.toLocaleString()} ㎡</span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden relative">
                            <div 
                                className={`h-full transition-all duration-500 ${isAreaOverWarning ? 'bg-red-500' : 'bg-emerald-500'}`}
                                style={{ width: `${Math.min(100, progressPercent)}%` }}
                            />
                        </div>

                        {isAreaOverWarning && (
                            <p className="text-xs text-red-500 font-semibold text-right flex items-center justify-end gap-1">
                                <AlertTriangle size={14} /> 연면적 한도를 초과했습니다. 조닝 배분을 다시 조정하세요.
                            </p>
                        )}
                    </div>

                    {/* 주요 층별 조닝 트리 */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <Maximize2 size={16} className="text-slate-400" />
                                층별 실(Room) 구성 (Drag & Drop)
                            </h3>
                            <button 
                                onClick={handleAddFloor}
                                className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md flex items-center gap-1 transition-colors"
                            >
                                <Plus size={14} /> 층 추가
                            </button>
                        </div>

                        <div className="flex flex-col divide-y divide-slate-100">
                            {floorZoning.map(fz => {
                                const isExpanded = expandedFloors[fz.id] !== false;
                                
                                return (
                                    <div 
                                        key={fz.id} 
                                        className="w-full flex flex-col group transition-colors"
                                    >
                                        {/* Floor Row (Level 1) */}
                                        <div 
                                            className="flex items-center px-4 py-3 bg-white hover:bg-slate-50 transition-colors"
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={(e) => handleDrop(e, fz.id)}
                                        >
                                            <button 
                                                onClick={() => toggleFloor(fz.id)}
                                                className="p-1 text-slate-400 hover:text-slate-600 mr-2 rounded hover:bg-slate-100"
                                            >
                                                {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                            </button>
                                            
                                            <div className="w-24 shrink-0">
                                                <input 
                                                    value={fz.floor}
                                                    onChange={e => updateFloorZoning(fz.id, { floor: e.target.value })}
                                                    className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none py-1 font-bold text-slate-800" 
                                                />
                                            </div>

                                            <div className="w-40 shrink-0">
                                                <input
                                                    value={fz.primaryUse}
                                                    onChange={e => updateFloorZoning(fz.id, { primaryUse: e.target.value })}
                                                    className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none py-1 text-sm text-slate-600"
                                                    placeholder="핵심 용도"
                                                />
                                            </div>

                                            <div className="flex-1 px-4 text-xs text-slate-500 hidden md:flex items-center">
                                                <span className="truncate">보조: {fz.secondaryUse.join(', ') || '-'}</span>
                                            </div>

                                            <div className="w-24 shrink-0 flex items-center gap-1 mx-2 border-l border-slate-200 pl-4 text-xs text-slate-500">
                                                <span>층고:</span>
                                                <input 
                                                    type="number" step="0.1"
                                                    value={fz.height || 4.2}
                                                    onChange={e => updateFloorZoning(fz.id, { height: Number(e.target.value) })}
                                                    className="w-10 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none text-right font-medium" 
                                                />
                                                <span>m</span>
                                            </div>

                                            <div className="w-24 shrink-0 flex flex-col items-end justify-center pr-4">
                                                <span className="text-xs text-slate-400">Total Area</span>
                                                <div className="font-bold text-slate-700">
                                                    {fz.floorTotalArea.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">㎡</span>
                                                </div>
                                            </div>

                                            <div className="w-10 shrink-0 flex justify-end">
                                                <button 
                                                    onClick={() => removeFloorZoning(fz.id)}
                                                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Children (Zones & Rooms) */}
                                        {isExpanded && fz.zones.map(zone => (
                                            <div key={zone.id} className="pl-12 pr-4 py-3 border-t border-slate-50 bg-slate-50/50 flex flex-col gap-2">
                                                <div className="flex justify-between px-2 text-xs font-semibold text-slate-500 mb-1">
                                                    <span>{zone.name}</span>
                                                    <span>Zone 합계: {zone.zoneTotalArea.toLocaleString()} ㎡</span>
                                                </div>

                                                <div className="space-y-2">
                                                    {zone.rooms.map(room => (
                                                        <div 
                                                            key={room.id}
                                                            draggable
                                                            onDragStart={(e) => handleDragStart(e, room.id, fz.id)}
                                                            onDragEnd={handleDragEnd}
                                                            className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing transition-shadow ml-2"
                                                        >
                                                            <div className="text-slate-300 px-1"><GripVertical size={16} /></div>
                                                            <div className="w-2 shrink-0 flex justify-center">
                                                                {room.isRequired && <span className="w-2 h-2 rounded-full bg-blue-500" title="법적 필수 실"></span>}
                                                            </div>
                                                            <div className="w-48 font-semibold text-slate-700 text-sm pl-2">
                                                                {room.name}
                                                            </div>
                                                            <div className="flex-1 flex justify-end items-center gap-6 text-xs text-slate-500">
                                                                <div className="flex flex-col items-end">
                                                                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">전용면적</span>
                                                                    <span className="font-mono bg-slate-50 px-1 rounded">{room.netArea.toLocaleString()}</span>
                                                                </div>
                                                                <div className="flex flex-col items-end">
                                                                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">공용면적</span>
                                                                    <span className="font-mono bg-slate-50 px-1 rounded">{room.commonArea.toLocaleString()}</span>
                                                                </div>
                                                                <div className="flex flex-col items-end w-24">
                                                                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">합계</span>
                                                                    <span className="font-bold text-slate-700 font-mono text-sm">{room.totalArea.toLocaleString()} ㎡</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {zone.rooms.length === 0 && (
                                                        <div className="text-xs text-center p-4 text-slate-400 bg-white/50 border border-dashed border-slate-200 rounded ml-2">
                                                            이 조지에 배치된 실이 없습니다. 이 층으로 실을 드래그하세요.
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* 무장애 관련 섹션 (기존 코드 유지) */}
                    <div className="bg-amber-50 rounded-xl shadow-sm border border-amber-100 flex gap-4 p-5">
                        <div className="p-3 bg-white rounded-full h-fit shrink-0 shadow-sm border border-amber-200 text-amber-500">
                            <Bus size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-amber-900 mb-1">안전 중심 보차 분리 및 승하차 (드롭오프)</h3>
                            <p className="text-sm text-amber-800/80 mb-4">휠체어 사용자 특성을 반영한 수직 동선 설계안입니다.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
