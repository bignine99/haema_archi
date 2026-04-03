import React, { useMemo, useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, ComposedChart, Line,
    Treemap, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    AreaChart, Area
} from 'recharts';

// 세계적으로 증명된 전문 데이터 시각화 컬러 파레트 (Tableau 10 - 명확하고 세련된 엔지니어링 표준)
const COLORS = [
    '#4E79A7', // Standard Blue
    '#F28E2B', // Standard Orange
    '#E15759', // Standard Red
    '#76B7B2', // Teal/Cyan
    '#59A14F', // Green
    '#EDC948', // Yellow/Gold
    '#B07AA1', // Purple
    '#FF9DA7', // Pink
    '#9C755F', // Brown
    '#BAB0AC'  // Gray
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-slate-200 p-3 rounded shadow-xl text-xs text-slate-800">
                <p className="font-semibold mb-2 border-b border-slate-200 pb-1 text-slate-900">{label || payload[0]?.name}</p>
                {payload.map((p: any, i: number) => (
                    <div key={i} className="flex justify-between gap-4 items-center mt-1">
                        <span style={{ color: p.color !== '#ffffff' ? p.color : '#64748b' }} className="font-medium flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-sm inline-block" style={{ backgroundColor: p.color !== '#ffffff' ? p.color : '#cbd5e1' }}></span>
                            {p.name}
                        </span>
                        <span className="font-semibold text-slate-900">
                            {typeof p.value === 'number' && p.value > 1000 ? p.value.toLocaleString() : p.value}
                            {p.name.includes('%') || p.name.includes('비율') || p.name.includes('률') ? '%' : (p.name.includes('수') || p.name.includes('개') ? '개' : ' ㎡')}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

// 실(Room) 단위 트리맵 커스텀 박스
const CustomTreemapContent = (props: any) => {
    const { depth, x, y, width, height, index, name, value, zoneName, spaceType, root } = props;
    
    // Treemap은 깊이별로 요소를 렌더링함. 최하위 노드(Room, depth 2)만 그리면 됨
    if (depth !== 2) return null;
    
    // 부모 Zone 기준으로 컬러 매핑 (전용공간은 Zone 색상, 공용공간은 통일된 회색)
    let zoneIndex = 0;
    if (root && root.children) {
        zoneIndex = root.children.findIndex((c: any) => c.name === zoneName);
        if (zoneIndex === -1) zoneIndex = 0;
    }
    
    const isCommon = spaceType === 'common';
    const fillColor = isCommon ? '#cbd5e1' : COLORS[zoneIndex % COLORS.length];
    const textColor = isCommon ? '#334155' : '#ffffff';
    const subTextColor = isCommon ? '#64748b' : '#ffffff';

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: fillColor,
                    stroke: '#ffffff',
                    strokeWidth: 1.5,
                    strokeOpacity: 1,
                }}
                className="transition-all duration-300 hover:opacity-80"
            />
            {width > 60 && height > 30 && (
                <text x={x + 6} y={y + 18} fill={textColor} fontSize={11}>
                    {name}
                </text>
            )}
            {width > 60 && height > 45 && value && (
                <text x={x + 6} y={y + 32} fill={subTextColor} fontSize={10} opacity={0.9}>
                    {value.toLocaleString()} ㎡
                </text>
            )}
        </g>
    );
};

export function StatisticsChartPanel() {
    const { floorZoning, grossFloorArea, landArea, floorAreaRatioLimit, buildingCoverageLimit } = useProjectStore();
    const [treemapFloor, setTreemapFloor] = useState<string>('all');

    // 1. 층별 면적 데이터 (전용/공용 Stacked)
    const floorData = useMemo(() => {
        return floorZoning.map(f => {
            let net = 0, common = 0;
            f.zones.forEach(z => {
                z.rooms.forEach(r => {
                    net += typeof r.netArea === 'number' ? r.netArea : 0;
                    common += typeof r.commonArea === 'number' ? r.commonArea : 0;
                });
            });
            return {
                name: f.floor,
                '전용면적': net,
                '공용면적': common,
                '총면적': net + common
            };
        });
    }, [floorZoning]);

    // 2. 글로벌 전용/공용 합산 데이터 (Pie)
    const globalNetCommonData = useMemo(() => {
        let totalNet = 0, totalCommon = 0;
        floorData.forEach(f => {
            totalNet += f['전용면적'];
            totalCommon += f['공용면적'];
        });
        return [
            { name: '전용면적', value: totalNet },
            { name: '공용면적', value: totalCommon }
        ];
    }, [floorData]);

    // 3. 주요 클러스터 (Zone) 데이터
    const zoneData = useMemo(() => {
        const zoneMap = new Map<string, number>();
        floorZoning.forEach(f => {
            f.zones.forEach(z => {
                const existing = zoneMap.get(z.name) || 0;
                zoneMap.set(z.name, existing + z.zoneTotalArea);
            });
        });

        const sorted = Array.from(zoneMap.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        if (sorted.length > 6) {
            const top5 = sorted.slice(0, 5);
            const othersValue = sorted.slice(5).reduce((acc, curr) => acc + curr.value, 0);
            return [...top5, { name: '기타공용', value: othersValue }];
        }
        return sorted;
    }, [floorZoning]);

    // 4. 실(Room) 개수 및 평균 면적 (Composed Bar/Line)
    const roomStatsData = useMemo(() => {
        return floorZoning.map(f => {
            let count = 0;
            let totalRoomArea = 0;
            f.zones.forEach(z => {
                z.rooms.forEach(r => {
                    count += 1;
                    totalRoomArea += r.totalArea;
                });
            });
            return {
                name: f.floor,
                '실 개수(방 수)': count,
                '평균면적(㎡)': count > 0 ? Number((totalRoomArea / count).toFixed(1)) : 0
            };
        });
    }, [floorZoning]);

    // 5. 트리맵 데이터 (상세 실 단위 및 전용/공용 분할 표시)
    const treemapData = useMemo(() => {
        const targetFloors = treemapFloor === 'all' 
            ? floorZoning 
            : floorZoning.filter(f => f.floor === treemapFloor);

        // Zone 별로 그룹화하여 Room 맵핑 (같은 부서의 실끼리 모이도록)
        const zoneMap = new Map<string, any[]>();
        
        targetFloors.forEach(f => {
            f.zones.forEach(z => {
                const rooms: any[] = [];
                z.rooms.forEach(r => {
                    const prefix = treemapFloor === 'all' ? `[${f.floor}] ` : '';
                    if (r.netArea > 0) {
                        rooms.push({
                            name: `${prefix}${r.name}`,
                            size: r.netArea,
                            zoneName: z.name,
                            spaceType: 'net'
                        });
                    }
                    if (r.commonArea > 0) {
                        rooms.push({
                            name: `${prefix}${r.name} (공용)`,
                            size: r.commonArea,
                            zoneName: z.name,
                            spaceType: 'common'
                        });
                    }
                });
                
                if (rooms.length > 0) {
                    const existing = zoneMap.get(z.name) || [];
                    zoneMap.set(z.name, [...existing, ...rooms]);
                }
            });
        });

        const result = Array.from(zoneMap.entries()).map(([zoneName, rooms]) => ({
            name: zoneName,
            children: rooms
        }));

        return result;
    }, [floorZoning, treemapFloor]);

    // 6. 단위 공간 랭킹 (Horizontal Bar)
    const topRoomsData = useMemo(() => {
        const all: any[] = [];
        floorZoning.forEach(f => f.zones.forEach(z => z.rooms.forEach(r => {
            if (r.totalArea > 0) all.push({ name: `${r.name}(${f.floor})`, '면적': r.totalArea });
        })));
        return all.sort((a, b) => b['면적'] - a['면적']).slice(0, 10).reverse();
    }, [floorZoning]);

    // 7. 레이더 데이터
    const radarData = useMemo(() => {
        return zoneData.slice(0, 6).map(z => ({ subject: z.name, A: z.value }));
    }, [zoneData]);

    // 8. 층별 공용공간 효율 추이
    const coreRateData = useMemo(() => {
        return floorData.map(f => ({
            name: f.name, '공용면적비율(%)': f.총면적 > 0 ? Number(((f.공용면적 / f.총면적) * 100).toFixed(1)) : 0
        }));
    }, [floorData]);


    // 9. 법정 한도 계산
    const buildingFootprint = landArea * (buildingCoverageLimit / 100);
    const actualGFA = grossFloorArea > 0 ? grossFloorArea : landArea * (floorAreaRatioLimit / 100);
    
    const maxFloorArea = Math.max(...floorData.map(f => f.총면적), 0);
    const coveragePercent = buildingFootprint > 0 ? Math.min(100, (maxFloorArea / buildingFootprint) * 100) : 0;
    
    const totalAssignedArea = floorData.reduce((acc, f) => acc + f.총면적, 0);
    const farPercent = actualGFA > 0 ? Math.min(100, (totalAssignedArea / actualGFA) * 100) : 0;

    if (!floorZoning || floorZoning.length === 0) return null;

    return (
        <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto pb-12 bg-[#F8FAFC] relative h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
            
            <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight">ENGINEERING ANALYTICS DASHBOARD</h2>
                    <p className="text-xs text-slate-500 font-medium">프로젝트 정밀 공간 분석 (Total: {totalAssignedArea.toLocaleString()} ㎡)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-6 pt-4">
                
                {/* 1. 계획률 한계치 (Progress - 스팬 2) */}
                <div className="col-span-1 md:col-span-2 bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col justify-around min-h-[220px]">
                    <h3 className="text-slate-800 text-[13px] font-bold mb-6 tracking-wide uppercase">Volume Compliance Limitations</h3>
                    <div className="flex flex-col gap-8">
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <h4 className="text-[12px] font-bold text-slate-700">MAXIMUM FOOTPRINT (건폐율 한도)</h4>
                                    <p className="text-[10px] text-slate-500 font-medium mt-1">
                                        Peak Floor: {maxFloorArea.toLocaleString()} ㎡ / Limit: {buildingFootprint.toLocaleString(undefined, { maximumFractionDigits: 0 })} ㎡
                                    </p>
                                </div>
                                <span className="text-[16px] font-bold tracking-tight" style={{ color: COLORS[0] }}>{coveragePercent.toFixed(1)}%</span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full rounded-sm transition-all duration-1000" style={{ width: `${Math.min(100, coveragePercent)}%`, backgroundColor: COLORS[0] }}></div></div>
                        </div>
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <h4 className="text-[12px] font-bold text-slate-700">GROSS FLOOR AREA (용적률 한도)</h4>
                                    <p className="text-[10px] text-slate-500 font-medium mt-1">
                                        Current: {totalAssignedArea.toLocaleString()} ㎡ / Limit: {actualGFA.toLocaleString(undefined, { maximumFractionDigits: 0 })} ㎡
                                    </p>
                                </div>
                                <span className={`text-[16px] font-bold tracking-tight ${(farPercent > 100) ? 'text-red-600' : 'text-slate-800'}`}>{farPercent.toFixed(1)}%</span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full rounded-sm transition-all duration-1000 ${(farPercent > 100) ? 'bg-red-500' : 'bg-slate-700'}`} style={{ width: `${Math.min(100, farPercent)}%` }}></div></div>
                        </div>
                    </div>
                </div>

                {/* 2. 공간 면적 구성도 (Treemap - 스팬 2) */}
                <div className="col-span-1 md:col-span-2 bg-white border border-slate-200 rounded-lg p-0 shadow-sm group relative overflow-hidden flex flex-col min-h-[300px]">
                    <div className="px-5 py-3 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                        <div>
                            <h3 className="text-slate-800 text-[13px] font-bold tracking-wide uppercase">Area Treemap Configurator</h3>
                            <span className="text-[9px] text-slate-500 block mt-1">Hierarchy: Zones ➔ Detailed Rooms</span>
                        </div>
                        
                        {/* Floor Dropdown Selector */}
                        <select 
                            value={treemapFloor}
                            onChange={(e) => setTreemapFloor(e.target.value)}
                            className="bg-white text-slate-700 border border-slate-300 rounded px-3 py-1.5 outline-none text-[11px] font-bold cursor-pointer hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            <option value="all">전체 층 (All Floors)</option>
                            {floorZoning.map(f => (
                                <option key={f.floor} value={f.floor}>{f.floor} 맵 모아보기</option>
                            ))}
                        </select>
                    </div>
                    <div className="h-[260px] w-full text-xs relative z-10 flex-1 p-3">
                        {treemapData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <Treemap
                                    data={treemapData}
                                    dataKey="size"
                                    aspectRatio={4 / 3}
                                    stroke="#fff"
                                    content={<CustomTreemapContent />}
                                >
                                    <Tooltip content={<CustomTooltip />} />
                                </Treemap>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs text-center border border-dashed border-slate-300 rounded">
                                해당 층에 배정된 실 공간 데이터가 없습니다.
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. 층별 면적 현황 (총 면적 Bar) */}
                <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                    <h3 className="text-slate-800 text-[12px] font-bold mb-4 tracking-wide uppercase">Floor Envelope Profile</h3>
                    <div className="h-[240px] w-full text-[10px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={floorData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                                <Bar dataKey="총면적" fill={COLORS[0]} radius={[2, 2, 0, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 4. 평균 공간 (Stacked Bar) */}
                <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                    <h3 className="text-slate-800 text-[12px] font-bold mb-4 tracking-wide uppercase">Core Efficiency Stack</h3>
                    <div className="h-[240px] w-full text-[10px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={floorData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} iconType="circle" />
                                <Bar dataKey="전용면적" stackId="a" fill={COLORS[0]} radius={[0, 0, 0, 0]} barSize={32} />
                                <Bar dataKey="공용면적" stackId="a" fill={COLORS[2]} radius={[2, 2, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 5. 공용면적 효율성 추적 (Area) */}
                <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                    <h3 className="text-slate-800 text-[12px] font-bold mb-4 tracking-wide uppercase">Core Ratio Trajectory</h3>
                    <div className="h-[240px] w-full text-[10px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={coreRateData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={COLORS[3]} stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor={COLORS[3]} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false}/>
                                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false}/>
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="공용면적비율(%)" stroke={COLORS[3]} strokeWidth={2.5} fillOpacity={1} fill="url(#colorArea)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 6. 전체 비율 (Pie) */}
                <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col">
                    <h3 className="text-slate-800 text-[12px] font-bold mb-4 tracking-wide uppercase">Global Net/Gross Balance</h3>
                    <div className="h-[240px] w-full text-[10px] flex-1 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={globalNetCommonData} cx="50%" cy="45%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">
                                    <Cell fill={COLORS[0]} />
                                    <Cell fill={COLORS[2]} />
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px' }} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 7. 최다 면적 실(Room) Top 10 (Horizontal Bar - 스팬 2) */}
                <div className="col-span-1 md:col-span-2 bg-white border border-slate-200 rounded-lg p-5 shadow-sm mt-0 md:-mt-[4.5rem]">
                    <h3 className="text-slate-800 text-[12px] font-bold mb-4 tracking-wide uppercase">Mega-Room Scale Rankings</h3>
                    <div className="h-[280px] w-full text-[10px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topRoomsData} layout="vertical" margin={{ top: 0, right: 40, left: 30, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#475569' }} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                                <Bar dataKey="면적" fill={COLORS[4]} radius={[0, 4, 4, 0]} barSize={16} label={{ position: 'right', fill: '#64748b', fontSize: 11, formatter: (val: any) => typeof val === 'number' ? val.toLocaleString() : val }} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 8. 부서/조닝(Zone) 클러스터 규모 (Pie) */}
                <div className="col-span-1 bg-white border border-slate-200 rounded-lg p-5 shadow-sm mt-0 md:-mt-[4.5rem]">
                    <h3 className="text-slate-800 text-[12px] font-bold mb-4 tracking-wide uppercase">Zone Cluster Distributions</h3>
                    <div className="h-[280px] w-full text-[10px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={zoneData} cx="50%" cy="40%" innerRadius={0} outerRadius={80} dataKey="value" stroke="#fff" strokeWidth={2}>
                                    {zoneData.map((e, i) => <Cell key={`c-${i}`} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 9. 방 개수 & 평균 면적 흐름 (Composed) */}
                <div className="col-span-1 lg:col-span-2 xl:col-span-1 bg-white border border-slate-200 rounded-lg p-5 shadow-sm mt-0 md:-mt-[4.5rem]">
                    <h3 className="text-slate-800 text-[12px] font-bold mb-4 tracking-wide uppercase">Spatial Fragmentation Index</h3>
                    <div className="h-[280px] w-full text-[10px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={roomStatsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
                                <YAxis yAxisId="left" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis yAxisId="right" orientation="right" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                                <Bar yAxisId="left" dataKey="실 개수(방 수)" fill={COLORS[5]} barSize={24} radius={[2, 2, 0, 0]} />
                                <Line yAxisId="right" type="monotone" dataKey="평균면적(㎡)" stroke={COLORS[6]} strokeWidth={3} dot={{ r: 4, fill: COLORS[6], stroke: '#fff', strokeWidth: 2 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 10. 상위 부서 다면적 평가 레이더 (Radar - 스팬 4) */}
                <div className="col-span-1 md:col-span-2 xl:col-span-4 bg-white border border-slate-200 rounded-xl p-8 shadow-sm mb-6 relative overflow-hidden flex flex-col items-center">
                    <h3 className="text-slate-800 text-[14px] font-bold text-center w-full z-10 mb-2 tracking-widest uppercase">Purpose-driven Volume Balancing</h3>
                    <p className="text-slate-500 text-[11px] text-center w-full z-10 mb-8 font-medium">Radar analysis of the top 6 architectural functions</p>
                    
                    <div className="h-[350px] w-full text-[11px] z-10 max-w-2xl bg-white rounded-full flex items-center justify-center p-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3"/>
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: '#94a3b8' }} tickCount={4} axisLine={false} />
                                <Radar name="점유 면적 (㎡)" dataKey="A" stroke={COLORS[0]} fill={COLORS[0]} fillOpacity={0.2} strokeWidth={2.5} />
                                <Tooltip content={<CustomTooltip />} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}
