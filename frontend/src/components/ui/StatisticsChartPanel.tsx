import React, { useMemo, useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, ComposedChart, Line,
    Treemap, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    AreaChart, Area, ReferenceLine, ReferenceArea,
    ScatterChart, Scatter, ZAxis
} from 'recharts';

const COLORS = [
    '#f97316', '#ea580c', '#c2410c', '#fb923c', '#64748b',
    '#f59e0b', '#94a3b8', '#d97706', '#475569', '#fbbf24'
];

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
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

// ─── Custom Treemap Content ───────────────────────────────────────────────────
const CustomTreemapContent = (props: any) => {
    const { depth, x, y, width, height, name, value, zoneName, spaceType, root } = props;

    if (depth !== 2) return null;

    let zoneIndex = 0;
    if (root && root.children) {
        zoneIndex = root.children.findIndex((c: any) => c.name === zoneName);
        if (zoneIndex === -1) zoneIndex = 0;
    }

    const isCommon = spaceType === 'common';
    const fillColor = isCommon ? '#cbd5e1' : COLORS[zoneIndex % COLORS.length];
    const textColor = isCommon ? '#334155' : '#ffffff';
    const subTextColor = isCommon ? '#475569' : 'rgba(255,255,255,0.82)';

    // style 속성으로 강제 적용 — SVG 브라우저 기본 bold 오버라이드 방지
    const nameStyle: React.CSSProperties = {
        fontSize: '11px',
        fontWeight: 400,
        fontFamily: "Inter, 'Noto Sans KR', Arial, sans-serif",
        letterSpacing: '-0.01em',
        userSelect: 'none',
    };
    const sizeStyle: React.CSSProperties = {
        ...nameStyle,
        fontSize: '10px',
        opacity: 0.82,
    };

    return (
        <g>
            <rect
                x={x} y={y} width={width} height={height}
                style={{ fill: fillColor, stroke: '#ffffff', strokeWidth: 1.5 }}
            />
            {width > 58 && height > 28 && (
                <text
                    x={x + 7} y={y + 16}
                    fill={textColor}
                    style={nameStyle}
                    textRendering="optimizeLegibility"
                >
                    {name}
                </text>
            )}
            {width > 58 && height > 46 && value && (
                <text
                    x={x + 7} y={y + 30}
                    fill={subTextColor}
                    style={sizeStyle}
                    textRendering="optimizeLegibility"
                >
                    {value.toLocaleString()} ㎡
                </text>
            )}
        </g>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────────
export function StatisticsChartPanel() {
    const { floorZoning, grossFloorArea, landArea, floorAreaRatioLimit, buildingCoverageLimit } = useProjectStore();
    const [treemapFloor, setTreemapFloor] = useState<string>('all');

    // 1. 층별 면적 (전용/공용 Stacked)
    const floorData = useMemo(() => {
        return floorZoning.map(f => {
            let net = 0, common = 0;
            f.zones.forEach(z => z.rooms.forEach(r => {
                net += typeof r.netArea === 'number' ? r.netArea : 0;
                common += typeof r.commonArea === 'number' ? r.commonArea : 0;
            }));
            return { name: f.floor, '전용면적': net, '공용면적': common, '총면적': net + common };
        });
    }, [floorZoning]);

    // 2. 전용/공용 합산 (Pie)
    const globalNetCommonData = useMemo(() => {
        let totalNet = 0, totalCommon = 0;
        floorData.forEach(f => { totalNet += f['전용면적']; totalCommon += f['공용면적']; });
        return [{ name: '전용면적', value: totalNet }, { name: '공용면적', value: totalCommon }];
    }, [floorData]);

    // 3. 클러스터 (Zone) 데이터
    const zoneData = useMemo(() => {
        const zoneMap = new Map<string, number>();
        floorZoning.forEach(f => f.zones.forEach(z => {
            zoneMap.set(z.name, (zoneMap.get(z.name) || 0) + z.zoneTotalArea);
        }));
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

    // 4. 실 개수 & 평균 면적 (Composed)
    const roomStatsData = useMemo(() => {
        return floorZoning.map(f => {
            let count = 0, totalRoomArea = 0;
            f.zones.forEach(z => z.rooms.forEach(r => { count++; totalRoomArea += r.totalArea; }));
            return { name: f.floor, '실 개수(방 수)': count, '평균면적(㎡)': count > 0 ? Number((totalRoomArea / count).toFixed(1)) : 0 };
        });
    }, [floorZoning]);

    // 5. 트리맵 데이터
    const treemapData = useMemo(() => {
        const targetFloors = treemapFloor === 'all' ? floorZoning : floorZoning.filter(f => f.floor === treemapFloor);
        const zoneMap = new Map<string, any[]>();
        targetFloors.forEach(f => {
            f.zones.forEach(z => {
                const rooms: any[] = [];
                z.rooms.forEach(r => {
                    const prefix = treemapFloor === 'all' ? `[${f.floor}] ` : '';
                    if (r.netArea > 0) rooms.push({ name: `${prefix}${r.name}`, size: r.netArea, zoneName: z.name, spaceType: 'net' });
                    if (r.commonArea > 0) rooms.push({ name: `${prefix}${r.name} (공용)`, size: r.commonArea, zoneName: z.name, spaceType: 'common' });
                });
                if (rooms.length > 0) zoneMap.set(z.name, [...(zoneMap.get(z.name) || []), ...rooms]);
            });
        });
        return Array.from(zoneMap.entries()).map(([zoneName, rooms]) => ({ name: zoneName, children: rooms }));
    }, [floorZoning, treemapFloor]);

    // 6. 단위 공간 랭킹 Top10
    const topRoomsData = useMemo(() => {
        const all: any[] = [];
        floorZoning.forEach(f => f.zones.forEach(z => z.rooms.forEach(r => {
            if (r.totalArea > 0) all.push({ name: `${r.name}(${f.floor})`, '면적': r.totalArea });
        })));
        return all.sort((a, b) => b['면적'] - a['면적']).slice(0, 10).reverse();
    }, [floorZoning]);

    // 7. 레이더
    const radarData = useMemo(() => zoneData.slice(0, 6).map(z => ({ subject: z.name, A: z.value })), [zoneData]);

    // 8. 공용면적 효율 추이
    const coreRateData = useMemo(() => {
        return floorData.map(f => ({
            name: f.name,
            '공용면적비율(%)': f.총면적 > 0 ? Number(((f['공용면적'] / f.총면적) * 100).toFixed(1)) : 0
        }));
    }, [floorData]);

    // 신규 A. 층고 프로파일
    const floorHeightData = useMemo(() => {
        return floorZoning.map(f => ({
            name: f.floor,
            '층고(m)': (f as any).height ?? 0,
            '바닥면적': f.floorTotalArea,
        }));
    }, [floorZoning]);

    // 신규 B. 실 면적 분포 히스토그램
    const areaHistogramData = useMemo(() => {
        const bins = [
            { label: '0~100㎡', min: 0, max: 100, count: 0, area: 0 },
            { label: '100~300㎡', min: 100, max: 300, count: 0, area: 0 },
            { label: '300~600㎡', min: 300, max: 600, count: 0, area: 0 },
            { label: '600~1000㎡', min: 600, max: 1000, count: 0, area: 0 },
            { label: '1000㎡+', min: 1000, max: Infinity, count: 0, area: 0 },
        ];
        floorZoning.forEach(f => f.zones.forEach(z => z.rooms.forEach(r => {
            const bin = bins.find(b => r.totalArea >= b.min && r.totalArea < b.max);
            if (bin) { bin.count++; bin.area += r.totalArea; }
        })));
        return bins.map(b => ({ name: b.label, '실 개수': b.count, '면적 합계': Math.round(b.area) }));
    }, [floorZoning]);

    // 신규 C. 전용/공용 산점도
    const scatterData = useMemo(() => {
        const pts: { x: number; y: number; z: number; name: string; floor: string }[] = [];
        floorZoning.forEach(f => f.zones.forEach(z => z.rooms.forEach(r => {
            if (r.totalArea > 0) pts.push({ x: r.netArea, y: r.commonArea, z: r.totalArea, name: r.name, floor: f.floor });
        })));
        return pts;
    }, [floorZoning]);

    // 신규 D. 층별 체적 & 밀도
    const areaDensityData = useMemo(() => {
        return floorZoning.filter(f => f.floorTotalArea > 0).map(f => {
            const h = (f as any).height ?? 3.3;
            return {
                name: f.floor,
                '체적(㎡×m)': Math.round(f.floorTotalArea * h),
                '면적밀도': Number((f.floorTotalArea / h).toFixed(1)),
            };
        });
    }, [floorZoning]);

    // 신규 E. Occupancy Capacity & Egress Load
    const occupancyData = useMemo(() => {
        return floorZoning.map(f => {
            let totalNet = 0;
            f.zones.forEach(z => z.rooms.forEach(r => totalNet += r.netArea));
            const occupancy = Math.round(totalNet / 9.3); // 상업/업무 일반적 피난 9.3 sqm per person 기준
            const egressWidth = Number((occupancy * 0.005).toFixed(1)); // 명당 0.005m 복도/계단 폭 (예시 기준)
            return {
                name: f.floor,
                '최대수용인원(명)': occupancy,
                '요구피난폭(m)': egressWidth
            };
        });
    }, [floorZoning]);

    // 9. 법정 한도 계산
    const buildingFootprint = landArea * (buildingCoverageLimit / 100);
    const actualGFA = grossFloorArea > 0 ? grossFloorArea : landArea * (floorAreaRatioLimit / 100);
    const maxFloorArea = Math.max(...floorData.map(f => f.총면적), 0);
    const coveragePercent = buildingFootprint > 0 ? Math.min(100, (maxFloorArea / buildingFootprint) * 100) : 0;
    const totalAssignedArea = floorData.reduce((acc, f) => acc + f.총면적, 0);
    const farPercent = actualGFA > 0 ? Math.min(100, (totalAssignedArea / actualGFA) * 100) : 0;
    const remainingArea = actualGFA - totalAssignedArea;

    // Z6 · RoomTag 기준 분류
    const roomTagStats = useMemo(() => {
        const counts = { legal: 0, project: 0, recommended: 0, optional: 0 };
        const areas = { legal: 0, project: 0, recommended: 0, optional: 0 };
        floorZoning.forEach(f => f.zones.forEach(z => z.rooms.forEach(r => {
            const tag = (r as any).roomTag || (r.isRequired ? 'legal' : 'optional');
            if (tag in counts) {
                counts[tag as keyof typeof counts]++;
                areas[tag as keyof typeof areas] += r.totalArea;
            }
        })));
        return [
            { name: '법정필수', count: counts.legal, area: areas.legal, color: '#EF4444' },
            { name: '사업필수', count: counts.project, area: areas.project, color: '#3B82F6' },
            { name: '권장', count: counts.recommended, area: areas.recommended, color: '#10B981' },
            { name: '선택', count: counts.optional, area: areas.optional, color: '#94A3B8' },
        ].filter(d => d.count > 0);
    }, [floorZoning]);

    // Z6 · Legal Compliance Heatmap
    const legalHeatmapData = useMemo(() => {
        const LEGAL_STANDARDS: Record<string, number> = {
            '교장실': 33, '행정실': 50, '보건실': 33,
            '일반교실': 66, '유치원 교실': 50, '초등 일반교실': 66,
            '중학 일반교실': 72, '고등 일반교실': 72, '식당': 200,
        };
        return floorZoning.map(f => {
            let legalCount = 0, totalLegal = 0;
            f.zones.forEach(z => z.rooms.forEach(r => {
                const min = LEGAL_STANDARDS[r.name];
                if (min !== undefined) { totalLegal++; if (r.totalArea >= min) legalCount++; }
            }));
            const rate = totalLegal > 0 ? Math.round((legalCount / totalLegal) * 100) : null;
            return { floor: f.floor, rate, legalCount, totalLegal };
        });
    }, [floorZoning]);

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

                {/* Z1. Volume Compliance */}
                <div className="col-span-1 md:col-span-2 bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col justify-around min-h-[220px]">
                    <h3 className="text-slate-800 text-[13px] font-bold mb-1 tracking-wide uppercase">Z1. Volume Compliance Limitations</h3>
                    <p className="text-[10px] text-slate-500 mb-4">용적률 및 건폐율 법정 한도 도달 모니터링</p>
                    <div className="flex flex-col gap-5">
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <h4 className="text-[12px] font-bold text-slate-700">MAXIMUM FOOTPRINT (건폐율 한도)</h4>
                                    <p className="text-[10px] text-slate-500 font-medium mt-1">Peak Floor: {maxFloorArea.toLocaleString()} ㎡ / Limit: {buildingFootprint.toLocaleString(undefined, { maximumFractionDigits: 0 })} ㎡</p>
                                </div>
                                <span className="text-[16px] font-bold tracking-tight" style={{ color: COLORS[0] }}>{coveragePercent.toFixed(1)}%</span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full rounded-sm transition-all duration-1000" style={{ width: `${Math.min(100, coveragePercent)}%`, backgroundColor: COLORS[0] }}></div></div>
                        </div>
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <h4 className="text-[12px] font-bold text-slate-700">TARGET FLOOR AREA (목표 연면적)</h4>
                                    <p className="text-[10px] text-slate-500 font-medium mt-1">Current: {totalAssignedArea.toLocaleString()} ㎡ / Target: {actualGFA.toLocaleString(undefined, { maximumFractionDigits: 0 })} ㎡</p>
                                    <p className="text-[9px] text-slate-400 mt-0.5" title={`${landArea} × ${floorAreaRatioLimit}% = ${(landArea * (floorAreaRatioLimit / 100)).toLocaleString()}`}>
                                        (법정 최대 연면적: {(landArea * (floorAreaRatioLimit / 100)).toLocaleString(undefined, { maximumFractionDigits: 0 })} ㎡)
                                    </p>
                                </div>
                                <span className={`text-[16px] font-bold tracking-tight ${farPercent > 100 ? 'text-red-600' : 'text-slate-800'}`}>{farPercent.toFixed(1)}%</span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full rounded-sm transition-all duration-1000 ${farPercent > 100 ? 'bg-red-500' : 'bg-slate-700'}`} style={{ width: `${Math.min(100, farPercent)}%` }}></div></div>
                        </div>
                        <div className={`rounded-lg p-3 border ${remainingArea >= 0 ? 'bg-orange-50 border-orange-200' : 'bg-red-50 border-red-200'}`}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="text-[11px] font-bold text-slate-700">REMAINING AREA (잔여 배분 가능)</h4>
                                    <p className="text-[10px] text-slate-500 mt-0.5">{remainingArea >= 0 ? '추가 배분 가능한 면적' : '목표 초과 — 검토 필요'}</p>
                                </div>
                                <span className={`text-[18px] font-bold ${remainingArea >= 0 ? 'text-orange-700' : 'text-red-600'}`}>{Math.abs(remainingArea).toLocaleString()} ㎡</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Z2. Floor Envelope Profile */}
                <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                    <h3 className="text-slate-800 text-[12px] font-bold mb-1 tracking-wide uppercase">Z2. Floor Envelope Profile</h3>
                    <p className="text-[9px] text-slate-400 mb-3">층별 면적 구성 및 매스 볼륨 프로파일</p>
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

                {/* Z3. Core Efficiency Stack */}
                <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                    <h3 className="text-slate-800 text-[12px] font-bold mb-1 tracking-wide uppercase">Z3. Core Efficiency Stack</h3>
                    <p className="text-[9px] text-slate-400 mb-3">층별 전용면적 대비 공용면적 효율 스택</p>
                    <div className="h-[240px] w-full text-[10px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={floorData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} iconType="circle" />
                                <Bar dataKey="전용면적" stackId="a" fill={COLORS[0]} barSize={32} />
                                <Bar dataKey="공용면적" stackId="a" fill={COLORS[2]} radius={[2, 2, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Z4. Core Ratio Trajectory */}
                <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                    <h3 className="text-slate-800 text-[12px] font-bold mb-1 tracking-wide uppercase">Z4. Core Ratio Trajectory</h3>
                    <p className="text-[9px] text-slate-400 mb-3">목표 범위: 20~35% (교육/업무시설 권장)</p>
                    <div className="h-[220px] w-full text-[10px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={coreRateData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={COLORS[3]} stopOpacity={0.4} />
                                        <stop offset="95%" stopColor={COLORS[3]} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 50]} />
                                <Tooltip content={<CustomTooltip />} />
                                <ReferenceArea y1={20} y2={35} fill="#10B98120" stroke="#10B981" strokeDasharray="4 2" strokeWidth={1} />
                                <ReferenceLine y={20} stroke="#10B981" strokeDasharray="3 2" strokeWidth={1.5} label={{ value: '20%', fill: '#10B981', fontSize: 9, position: 'right' }} />
                                <ReferenceLine y={35} stroke="#F59E0B" strokeDasharray="3 2" strokeWidth={1.5} label={{ value: '35%', fill: '#F59E0B', fontSize: 9, position: 'right' }} />
                                <Area type="monotone" dataKey="공용면적비율(%)" stroke={COLORS[3]} strokeWidth={2.5} fillOpacity={1} fill="url(#colorArea)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Z5. Global Net/Gross Balance */}
                <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col">
                    <h3 className="text-slate-800 text-[12px] font-bold mb-1 tracking-wide uppercase">Z5. Global Net/Gross Balance</h3>
                    <p className="text-[9px] text-slate-400 mb-3">건물 전체 전용면적 vs 공용면적 총량 비율</p>
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

                {/* Z6. Mega-Room Scale Rankings */}
                <div className="col-span-1 md:col-span-2 bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                    <h3 className="text-slate-800 text-[12px] font-bold mb-1 tracking-wide uppercase">Z6. Mega-Room Scale Rankings</h3>
                    <p className="text-[9px] text-slate-400 mb-3">단일 공간 기준 최대 면적 상위 10개 실 랭킹</p>
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

                {/* Z7. Zone Cluster Distributions */}
                <div className="col-span-1 bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                    <h3 className="text-slate-800 text-[12px] font-bold mb-1 tracking-wide uppercase">Z7. Zone Cluster Distributions</h3>
                    <p className="text-[9px] text-slate-400 mb-3">전체 조닝별(기능별) 공간 점유 비율</p>
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

                {/* Z8. Spatial Fragmentation Index */}
                <div className="col-span-1 lg:col-span-2 xl:col-span-1 bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                    <h3 className="text-slate-800 text-[12px] font-bold mb-1 tracking-wide uppercase">Z8. Spatial Fragmentation Index</h3>
                    <p className="text-[9px] text-slate-400 mb-3">층별 실 개수와 평균 면적 간의 파편화 지수 (공간 밀도)</p>
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

                {/* Z9. Legal Compliance Heatmap */}
                <div className="col-span-1 md:col-span-2 bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                    <h3 className="text-slate-800 text-[12px] font-bold mb-1 tracking-wide uppercase">Z9. Legal Compliance Heatmap</h3>
                    <p className="text-[9px] text-slate-400 mb-4">층별 법정 기준 적합 비율 (법정 기준 실 보유 층만 표시)</p>
                    <div className="flex flex-col gap-2">
                        {legalHeatmapData.filter(d => d.totalLegal > 0).map(d => {
                            const color = d.rate === null ? '#CBD5E1' : d.rate! >= 80 ? '#10B981' : d.rate! >= 50 ? '#F59E0B' : '#EF4444';
                            const label = d.rate === null ? 'N/A' : d.rate! >= 80 ? '양호' : d.rate! >= 50 ? '검토필요' : '미달';
                            return (
                                <div key={d.floor} className="flex items-center gap-3">
                                    <span className="text-[11px] font-bold text-slate-700 w-8 text-right shrink-0">{d.floor}</span>
                                    <div className="flex-1 h-6 bg-slate-100 rounded-md overflow-hidden relative">
                                        <div className="h-full rounded-md transition-all duration-700" style={{ width: `${d.rate ?? 0}%`, backgroundColor: color, opacity: 0.7 }} />
                                        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-slate-700">
                                            {d.rate !== null ? `${d.rate}% (${d.legalCount}/${d.totalLegal} 적합)` : '법정 기준 실 없음'}
                                        </span>
                                    </div>
                                    <span className="text-[9px] font-bold shrink-0" style={{ color }}>{label}</span>
                                </div>
                            );
                        })}
                        {legalHeatmapData.every(d => d.totalLegal === 0) && (
                            <div className="text-center text-slate-400 text-[11px] py-4">법정 기준이 있는 실이 없습니다.</div>
                        )}
                    </div>
                </div>

                {/* Z10. Remaining Area Allocator */}
                <div className="col-span-1 md:col-span-2 bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                    <h3 className="text-slate-800 text-[12px] font-bold mb-1 tracking-wide uppercase">Z10. Remaining Area Allocator</h3>
                    <p className="text-[9px] text-slate-400 mb-3">RoomTag 기준 면적 구성 비율</p>
                    <div className="h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={roomTagStats} cx="50%" cy="45%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="area" nameKey="name" stroke="none">
                                    {roomTagStats.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                </Pie>
                                <Tooltip formatter={(val: any, name: any) => [`${typeof val === 'number' ? val.toLocaleString() : val} ㎡`, String(name ?? '')]} />
                                <Legend verticalAlign="bottom" height={30} wrapperStyle={{ fontSize: '10px' }} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Z11. Floor Height Profile */}
                <div className="col-span-1 md:col-span-2 bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                    <h3 className="text-slate-800 text-[12px] font-bold mb-1 tracking-wide uppercase">Z11. Floor Height Profile</h3>
                    <p className="text-[9px] text-slate-400 mb-3">층별 층고(m) vs 바닥면적(㎡) 비교</p>
                    <div className="h-[240px] w-full text-[10px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={floorHeightData} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
                                <YAxis yAxisId="left" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis yAxisId="right" orientation="right" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 6]} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }} iconType="circle" />
                                <Bar yAxisId="left" dataKey="바닥면적" fill={COLORS[0]} opacity={0.75} barSize={28} radius={[3, 3, 0, 0]} />
                                <Line yAxisId="right" type="monotone" dataKey="층고(m)" stroke={COLORS[1]} strokeWidth={2.5} dot={{ r: 4, fill: COLORS[1], stroke: '#fff', strokeWidth: 2 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Z12. Room Area Distribution */}
                <div className="col-span-1 md:col-span-2 bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                    <h3 className="text-slate-800 text-[12px] font-bold mb-1 tracking-wide uppercase">Z12. Room Area Distribution</h3>
                    <p className="text-[9px] text-slate-400 mb-3">실 면적 구간별 개수 분포 (히스토그램)</p>
                    <div className="h-[240px] w-full text-[10px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={areaHistogramData} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 9.5 }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
                                <YAxis yAxisId="left" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis yAxisId="right" orientation="right" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }} iconType="circle" />
                                <Bar yAxisId="left" dataKey="실 개수" fill={COLORS[4]} barSize={36} radius={[3, 3, 0, 0]} label={{ position: 'top', fill: '#475569', fontSize: 10, formatter: (v: any) => v > 0 ? `${v}개` : '' }} />
                                <Line yAxisId="right" type="monotone" dataKey="면적 합계" stroke={COLORS[2]} strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3, fill: COLORS[2] }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Z13. Net vs Common Scatter */}
                <div className="col-span-1 md:col-span-2 bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                    <h3 className="text-slate-800 text-[12px] font-bold mb-1 tracking-wide uppercase">Z13. Net vs Common Scatter</h3>
                    <p className="text-[9px] text-slate-400 mb-3">X=전용면적 · Y=공용면적 · 원 크기=합계면적</p>
                    <div className="h-[240px] w-full text-[10px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis type="number" dataKey="x" name="전용면적" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} label={{ value: '전용(㎡)', position: 'insideBottomRight', offset: -5, fill: '#94a3b8', fontSize: 9 }} />
                                <YAxis type="number" dataKey="y" name="공용면적" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} label={{ value: '공용(㎡)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 9 }} />
                                <ZAxis type="number" dataKey="z" range={[30, 400]} />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => {
                                    if (active && payload && payload[0]) {
                                        const d = payload[0].payload;
                                        return (
                                            <div className="bg-white border border-slate-200 p-2 rounded shadow-xl text-[10px]">
                                                <p className="font-bold text-slate-800 mb-1">{d.name} ({d.floor})</p>
                                                <p className="text-slate-600">전용: <strong>{d.x.toLocaleString()} ㎡</strong></p>
                                                <p className="text-slate-600">공용: <strong>{d.y.toLocaleString()} ㎡</strong></p>
                                                <p className="text-slate-600">합계: <strong>{d.z.toLocaleString()} ㎡</strong></p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }} />
                                <Scatter data={scatterData} fill={COLORS[0]} fillOpacity={0.65} stroke={COLORS[0]} strokeWidth={1} />
                                <ReferenceLine segment={[{ x: 0, y: 0 }, { x: 1500, y: 450 }]} stroke="#F59E0B" strokeDasharray="5 3" strokeWidth={1.5} label={{ value: '공용=전용×30%', fill: '#F59E0B', fontSize: 8, position: 'insideTopRight' }} />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Z14. Purpose-driven Volume Balancing */}
                <div className="col-span-1 md:col-span-2 xl:col-span-4 bg-white border border-slate-200 rounded-lg py-5 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
                    <h3 className="text-slate-800 text-[14px] font-bold text-center w-full z-10 mb-2 tracking-widest uppercase">Z14. Purpose-driven Volume Balancing</h3>
                    <p className="text-slate-500 text-[11px] text-center w-full z-10 mb-8 font-medium">상위 6개 건축 기능에 대한 목적 기반 볼륨 레이더 분석</p>
                    <div className="h-[350px] w-full text-[11px] z-10 max-w-2xl flex items-center justify-center p-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: '#94a3b8' }} tickCount={4} axisLine={false} />
                                <Radar name="점유 면적 (㎡)" dataKey="A" stroke={COLORS[0]} fill={COLORS[0]} fillOpacity={0.2} strokeWidth={2.5} />
                                <Tooltip content={<CustomTooltip />} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* ── 최하단 전체 너비 Treemap (col-span-4) ── */}
                <div className="col-span-1 md:col-span-2 xl:col-span-4 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden mb-6">
                    <div className="px-6 py-5 border-b border-slate-200 flex flex-col justify-center items-center bg-slate-50/60 gap-3 text-center">
                        <div>
                            <h3 className="text-slate-800 text-[14px] font-bold tracking-wide uppercase">Z15. Area Treemap Configurator</h3>
                            <span className="text-[10px] text-slate-500 block mt-0.5">Hierarchy: Zones ➔ Detailed Rooms — 조닝별/실별 면적 구성도</span>
                        </div>
                        <select
                            value={treemapFloor}
                            onChange={(e) => setTreemapFloor(e.target.value)}
                            className="bg-white text-slate-700 border border-orange-300 rounded-lg px-6 py-2 outline-none text-[12px] font-bold cursor-pointer hover:bg-orange-50 transition-colors shadow-sm focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="all">전체 층 (All Floors)</option>
                            {floorZoning.map(f => (
                                <option key={f.floor} value={f.floor}>{f.floor} 맵 모아보기</option>
                            ))}
                        </select>
                    </div>
                    <div className="h-[420px] w-full p-4">
                        {treemapData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <Treemap
                                    data={treemapData}
                                    dataKey="size"
                                    aspectRatio={16 / 7}
                                    stroke="#fff"
                                    content={<CustomTreemapContent />}
                                >
                                    <Tooltip content={<CustomTooltip />} />
                                </Treemap>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-lg">
                                해당 층에 배정된 실 공간 데이터가 없습니다.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
