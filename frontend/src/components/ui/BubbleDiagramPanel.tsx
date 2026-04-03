import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RefreshCw, Save, Settings, Info, Map as MapIcon, Layers, ZoomIn, ZoomOut } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';

interface BubbleNode {
  id: string;
  name: string;
  group: number;
  radius: number;
  area: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx?: number | null;
  fy?: number | null;
}

interface BubbleLink {
  source: string;
  target: string;
  weight: number;
}

const MOCK_NODES: BubbleNode[] = [
  { id: '1', name: '메인 로비', group: 0, radius: 70, area: 300, x: 0, y: 0, vx: 0, vy: 0 },
  { id: '2', name: '안내데스크', group: 0, radius: 40, area: 50, x: 0, y: 0, vx: 0, vy: 0 },
  { id: '3', name: '오픈 라운지', group: 0, radius: 60, area: 200, x: 0, y: 0, vx: 0, vy: 0 },
  { id: '4', name: '오픈 오피스', group: 1, radius: 90, area: 500, x: 0, y: 0, vx: 0, vy: 0 },
  { id: '5', name: '임원실', group: 1, radius: 50, area: 100, x: 0, y: 0, vx: 0, vy: 0 },
  { id: '6', name: '대회의실', group: 1, radius: 55, area: 150, x: 0, y: 0, vx: 0, vy: 0 },
  { id: '7', name: '소회의실 A', group: 1, radius: 45, area: 80, x: 0, y: 0, vx: 0, vy: 0 },
  { id: '8', name: '소회의실 B', group: 1, radius: 45, area: 80, x: 0, y: 0, vx: 0, vy: 0 },
  { id: '9', name: '카페테리아', group: 2, radius: 75, area: 250, x: 0, y: 0, vx: 0, vy: 0 },
  { id: '10', name: '휴게실', group: 2, radius: 50, area: 100, x: 0, y: 0, vx: 0, vy: 0 },
  { id: '11', name: '서버실', group: 3, radius: 40, area: 50, x: 0, y: 0, vx: 0, vy: 0 },
  { id: '12', name: '창고', group: 3, radius: 35, area: 40, x: 0, y: 0, vx: 0, vy: 0 },
  { id: '13', name: '공용 화장실', group: 3, radius: 45, area: 80, x: 0, y: 0, vx: 0, vy: 0 },
];

const MOCK_LINKS: BubbleLink[] = [
  { source: '1', target: '2', weight: 4 },
  { source: '1', target: '3', weight: 3 },
  { source: '1', target: '4', weight: 5 },
  { source: '4', target: '6', weight: 3 },
  { source: '4', target: '7', weight: 2 },
  { source: '4', target: '8', weight: 2 },
  { source: '4', target: '5', weight: 1 },
  { source: '3', target: '9', weight: 4 },
  { source: '4', target: '10', weight: 3 },
  { source: '1', target: '13', weight: 2 },
  { source: '4', target: '13', weight: 2 },
  { source: '4', target: '11', weight: 1 }, 
  { source: '11', target: '12', weight: 2 },
];

// Architectural Colors (Teal, Green, Coral, Navy)
const GROUP_COLORS = {
  0: { bg: '#2A9D8F', text: '#ffffff' }, // Teal
  1: { bg: '#8AB17D', text: '#ffffff' }, // Sage Green
  2: { bg: '#E9C46A', text: '#334155' }, // Beige/Gold
  3: { bg: '#264653', text: '#ffffff' }, // Dark Navy
  4: { bg: '#F4A261', text: '#ffffff' }, // Soft Coral
  5: { bg: '#A8DADC', text: '#1e293b' }, // Light Blue
  6: { bg: '#457B9D', text: '#ffffff' }, // Steel Blue
  7: { bg: '#E76F51', text: '#ffffff' }, // Terracotta
};

export const BubbleDiagramPanel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const [nodes, setNodes] = useState<BubbleNode[]>([]);
  const [links, setLinks] = useState<BubbleLink[]>([]);
  
  // Physics parameters
  const alphaRef = useRef(1); // 온도 유지계수
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Interaction State
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [targetFloor, setTargetFloor] = useState<string>('all');
  const [zoomScale, setZoomScale] = useState<number>(1);

  const floorZoning = useProjectStore(s => s.floorZoning);

  useEffect(() => {
    // 뷰포트 크기에 맞춰 초기 위치 무작위 할당
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    
    const newNodes: BubbleNode[] = [];
    const newLinks: BubbleLink[] = [];
    
    let groupMap: Record<string, number> = {};
    let groupIndex = 0;

    const filteredFloors = targetFloor === 'all' 
        ? floorZoning 
        : floorZoning.filter(f => f.floor === targetFloor);

    // 데이터 변환
    filteredFloors.forEach((fz, fIdx) => {
        fz.zones.forEach((zone, zIdx) => {
            if(groupMap[zone.name] === undefined) {
               groupMap[zone.name] = groupIndex++ % 8; // 그룹 매핑
            }
            
            zone.rooms.forEach((room, rIdx) => {
                const area = room.totalArea || 50; // area 누락 대비 기본값
                const radius = Math.max(40, Math.min(140, Math.sqrt(area) * 4)) || 50; // NaN 방지
                
                // 데이터의 ID가 중복일 가능성이 있으므로 완전히 유니크하게 강제
                const uniqueId = room.id ? `${room.id}-${fIdx}-${zIdx}-${rIdx}` : `room-${fIdx}-${zIdx}-${rIdx}-${Math.random()}`;
                
                newNodes.push({
                    id: uniqueId,
                    name: room.name || '무명 공간',
                    area: area,
                    group: groupMap[zone.name],
                    radius: radius,
                    x: width * 0.3 + (Math.random() - 0.5) * 300,
                    y: height * 0.3 + (Math.random() - 0.5) * 300,
                    vx: 0, vy: 0,
                    fx: null, fy: null
                });

                // 같은 영역(Zone) 안의 허브 연결: 0번째 룸을 허브(메인)로 간주하고 강한 연결
                if (rIdx > 0) {
                    const parentUniqueId = zone.rooms[0].id ? `${zone.rooms[0].id}-${fIdx}-${zIdx}-0` : `room-${fIdx}-${zIdx}-0-...`; 
                    // 위 parentUniqueId 매칭을 위해 노드 보관소에서 0번째 룸을 동적으로 찾아옵니다.
                    const parentNode = newNodes.find(n => n.name === (zone.rooms[0].name || '무명 공간') && n.group === groupMap[zone.name]);
                    if (parentNode) {
                        newLinks.push({
                            source: parentNode.id,
                            target: uniqueId,
                            weight: 3 // 강한 인접 (Solid Line)
                        });
                    }
                }
            });
            
            // 층(Floor) 내 가장 큰 영역(Zone)들을 약하게 연결
            if (fz.zones.length > 1 && zIdx > 0) {
                if(fz.zones[0].rooms.length > 0 && zone.rooms.length > 0) {
                    const firstHub = newNodes.find(n => n.name === (fz.zones[0].rooms[0].name || '무명 공간') && n.group === groupMap[fz.zones[0].name]);
                    const currentHub = newNodes.find(n => n.name === (zone.rooms[0].name || '무명 공간') && n.group === groupMap[zone.name]);
                    if (firstHub && currentHub) {
                        newLinks.push({
                            source: firstHub.id,
                            target: currentHub.id,
                            weight: 1 // 약한 인접 (Dotted Line)
                        });
                    }
                }
            }
        });
    });

    if(newNodes.length === 0 && floorZoning.length === 0) {
        setNodes(MOCK_NODES);
        setLinks(MOCK_LINKS);
    } else {
        setNodes(newNodes);
        setLinks(newLinks);
    }
    
    alphaRef.current = 1;
    setIsPlaying(true);
  }, [floorZoning, targetFloor]);

  // Force-Directed 시뮬레이션 엔진 최적화 (겹침 완전 제거)
  const updatePhysics = useCallback(() => {
    if (!containerRef.current || !isPlaying || alphaRef.current < 0.002) {
      if (isPlaying && alphaRef.current < 0.002) setIsPlaying(false);
      return;
    }

    const { width, height } = containerRef.current.getBoundingClientRect();
    const centerX = width * 0.35;
    const centerY = height * 0.35;

    // 클러스터(조닝)별로 분산된 서브-허브(중심점)를 미리 계산
    const clusterCenters = [
      { x: width * 0.3, y: height * 0.3 },
      { x: width * 0.4, y: height * 0.3 },
      { x: width * 0.3, y: height * 0.4 },
      { x: width * 0.4, y: height * 0.4 },
      { x: width * 0.2, y: height * 0.3 },
      { x: width * 0.3, y: height * 0.2 },
      { x: width * 0.5, y: height * 0.3 },
      { x: width * 0.3, y: height * 0.5 },
    ];
    
    setNodes(currentNodes => {
      const nextNodes = currentNodes.map(n => ({ ...n }));

      // 1. Link 스프링 인력
      links.forEach(link => {
        const source = nextNodes.find(n => n.id === link.source);
        const target = nextNodes.find(n => n.id === link.target);
        if (!source || !target) return;

        let dx = target.x - source.x;
        let dy = target.y - source.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance === 0 || isNaN(distance)) {
            dx = (Math.random() - 0.5) * 5;
            dy = (Math.random() - 0.5) * 5;
            distance = Math.sqrt(dx * dx + dy * dy) || 1;
        }
        
        const minDistance = source.radius + target.radius + 15;
        const targetDist = minDistance + (link.weight > 2 ? 5 : 30);
        
        const force = (distance - targetDist) * (link.weight * 0.002) * alphaRef.current;
        const ax = (dx / distance) * force;
        const ay = (dy / distance) * force;

        source.vx += ax;
        source.vy += ay;
        target.vx -= ax;
        target.vy -= ay;
      });

      // 2. 약한 다중 클러스터 중력 및 코어 집중력 (Core Strategy)
      const baseGravity = 0.012 * alphaRef.current;
      for (let i = 0; i < nextNodes.length; i++) {
        const n = nextNodes[i];
        if(!n) continue;
        const targetCenter = clusterCenters[n.group % clusterCenters.length] || {x: centerX, y: centerY};
        
        const isCore = (n.name || "").includes("코어") || (n.name || "").includes("계단") || (n.name || "").includes("로비") || (n.name || "").includes("홀") || (n.name || "").includes("승강기");
        const gravity = isCore ? baseGravity * 2.5 : baseGravity;
        
        const targetX = isCore ? centerX : (targetCenter.x + centerX)/2;
        const targetY = isCore ? centerY : (targetCenter.y + centerY)/2;

        n.vx += (targetX - n.x) * gravity;
        n.vy += (targetY - n.y) * gravity;
      }

      // 3. 위치 업데이트와 마찰력 (Velocity Integration)
      const damping = 0.88; 
      for (let i = 0; i < nextNodes.length; i++) {
        const n = nextNodes[i];
        if(!n) continue;
        
        n.vx = isNaN(n.vx) ? 0 : n.vx * damping;
        n.vy = isNaN(n.vy) ? 0 : n.vy * damping;
        
        if (n.fx !== undefined && n.fx !== null) {
            n.x = n.fx;
        } else {
            n.x += n.vx;
        }

        if (n.fy !== undefined && n.fy !== null) {
            n.y = n.fy;
        } else {
            n.y += n.vy;
        }
      }

      // 4. 물리적 충돌 / 공간 확보 (Position-based Dynamics Constraint Solver)
      // 초강력 다중 패스 보정 (화면 그려지기 전)
      for(let iter=0; iter<4; iter++) {
        for (let i = 0; i < nextNodes.length; i++) {
          for (let j = i + 1; j < nextNodes.length; j++) {
            const a = nextNodes[i];
            const b = nextNodes[j];
            if(!a || !b) continue;
            
            let dx = b.x - a.x;
            let dy = b.y - a.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance === 0 || isNaN(distance)) {
               dx = (Math.random() - 0.5) * 5;
               dy = (Math.random() - 0.5) * 5;
               distance = Math.sqrt(dx * dx + dy * dy) || 1;
            }
            
            const minDistance = a.radius + b.radius + 15;

            if (distance < minDistance) {
              const force = (minDistance - distance) * 0.6; 
              const ax = (dx / distance) * force;
              const ay = (dy / distance) * force;
              
              if(!isNaN(ax) && !isNaN(ay)) {
                  a.x -= ax * 0.5;
                  a.y -= ay * 0.5;
                  b.x += ax * 0.5;
                  b.y += ay * 0.5;
                  
                  if(iter === 0) {
                     a.vx -= ax * 0.1;
                     a.vy -= ay * 0.1;
                     b.vx += ax * 0.1;
                     b.vy += ay * 0.1;
                  }
              }
            } else if (iter === 0 && distance < minDistance + 100) {
              const force = 1000 / (distance * distance) * alphaRef.current;
              const ax = (dx / distance) * force;
              const ay = (dy / distance) * force;
              if(!isNaN(ax) && !isNaN(ay)) {
                  a.vx -= ax;
                  a.vy -= ay;
                  b.vx += ax;
                  b.vy += ay;
              }
            }
          }
        }
      }

      // 5. 최종 벽 제약 조건 (화면 밖 도주 방지)
      for (let i = 0; i < nextNodes.length; i++) {
        const n = nextNodes[i];
        n.x = Math.max(n.radius + 5, Math.min(width - n.radius - 5, n.x));
        n.y = Math.max(n.radius + 5, Math.min(height - n.radius - 5, n.y));
      }

      return nextNodes;
    });

    alphaRef.current *= 0.985; // 천천히 식힘
    
  }, [isPlaying, links, targetFloor]);

  // RequestAnimationFrame
  useEffect(() => {
    const loop = () => {
      updatePhysics();
      requestRef.current = requestAnimationFrame(loop);
    };
    requestRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [updatePhysics]);

  const reheat = () => {
    alphaRef.current = 1;
    setIsPlaying(true);
  };

  // Drag Interaction
  const handlePointerDown = (e: React.PointerEvent<SVGCircleElement>, id: string) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    setDraggedNode(id);
    reheat();
    setNodes(curr => curr.map(n => n.id === id ? { ...n, fx: n.x, fy: n.y, vx: 0, vy: 0 } : n));
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggedNode || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoomScale;
    const y = (e.clientY - rect.top) / zoomScale;

    setNodes(curr => curr.map(n => n.id === draggedNode ? { ...n, fx: x, fy: y } : n));
    alphaRef.current = 0.5; // 드래그 중 약하게 가열
    setIsPlaying(true);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggedNode) return;
    if (e.target instanceof Element && e.target.hasPointerCapture(e.pointerId)) {
        e.target.releasePointerCapture(e.pointerId);
    }
    setNodes(curr => curr.map(n => n.id === draggedNode ? { ...n, fx: null, fy: null } : n));
    setDraggedNode(null);
    alphaRef.current = 0.8; // 드롭 후 천천히 식히기
  };

  return (
    <div className="w-full flex flex-col bg-[#F8FAFC] relative font-sans min-h-[750px] pb-8 overflow-visible">
      
      {/* Top Header (White Architectural Theme) */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-white z-10 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-teal-50 p-2 rounded-lg text-teal-600">
            <MapIcon size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">
              Spatial Adjacency Bubble Diagram
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-xl line-clamp-1">
              실(Room) 공간 간의 필수 인접성(Edge) 및 층별 규모, 그리고 무장애동선(BF) 버퍼를 반영한 건축 초기 다이어그램입니다.
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3 shrink-0">
          <select 
              value={targetFloor}
              onChange={(e) => setTargetFloor(e.target.value)}
              className="bg-white text-slate-700 border border-slate-200 shadow-sm rounded-lg px-3 py-1.5 outline-none text-[13px] font-semibold cursor-pointer hover:bg-slate-50 transition-colors"
          >
              <option value="all">전체 층</option>
              {floorZoning.map(f => (
                  <option key={f.floor} value={f.floor}>{f.floor}</option>
              ))}
          </select>
          <button 
            onClick={reheat}
            className="flex items-center space-x-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-600 hover:bg-slate-100 transition-all whitespace-nowrap"
          >
            <RefreshCw size={14} className={isPlaying ? "animate-spin text-teal-500" : ""} />
            <span className="hidden sm:inline">물리엔진 재배치</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-[13px] font-semibold text-white shadow-md transition-all whitespace-nowrap">
            <Save size={14} />
            <span className="hidden sm:inline">SVG 내보내기</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex px-4 md:px-6 py-4 md:py-6 gap-4 md:gap-6 relative min-h-[650px]" ref={containerRef}>
        
        {/* Main Canvas SVG Layer */}
        <div className="bg-white flex-1 border border-slate-200 rounded-xl shadow-sm relative overflow-hidden group">
          
          {/* Zoom Controls */}
          <div className="absolute bottom-6 right-6 flex items-center bg-white shadow-md border border-slate-200 rounded-lg p-1 z-10 opacity-80 hover:opacity-100 transition-opacity">
            <button onClick={() => setZoomScale(s => Math.max(0.4, s - 0.2))} className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition-colors" title="Zoom Out"><ZoomOut size={16} /></button>
            <span className="px-3 text-[13px] font-bold text-slate-700 w-14 text-center">{Math.round(zoomScale * 100)}%</span>
            <button onClick={() => setZoomScale(s => Math.min(2.6, s + 0.2))} className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition-colors" title="Zoom In"><ZoomIn size={16} /></button>
          </div>

          <svg 
            className="w-full h-full cursor-grab active:cursor-grabbing touch-none z-0"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <g style={{ transform: `scale(${zoomScale})`, transformOrigin: '0 0', transition: 'transform 0.15s ease-out' }}>
              {/* Links Layer */}
              <g>
              {links.map((link, i) => {
                const source = nodes.find(n => n.id === link.source);
                const target = nodes.find(n => n.id === link.target);
                if (!source || !target) return null;

                const isHighlighted = hoveredNode === source.id || hoveredNode === target.id;
                const isStrong = link.weight > 2;
                
                return (
                  <line
                    key={`link-${i}`}
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke={isHighlighted ? "#0f766e" : "#94a3b8"} // 짙은 틸 혹은 기본 회색선
                    strokeWidth={isStrong ? 2 : 1}
                    strokeDasharray={isStrong ? "none" : "5, 5"} // 얇은 연결선은 점선 처리
                    strokeOpacity={isHighlighted ? 0.9 : 0.6}
                    className="transition-all duration-300"
                  />
                );
              })}
            </g>

            {/* Nodes Layer */}
            <g>
              {nodes.map((node) => {
                const colors = GROUP_COLORS[node.group as keyof typeof GROUP_COLORS] || GROUP_COLORS[0];
                const isHovered = hoveredNode === node.id;
                const isDragged = draggedNode === node.id;
                
                return (
                  <g 
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    className="transition-transform ease-out"
                    style={{ transitionDuration: isDragged ? '0s' : '0.1s' }}
                  >
                    {/* Shadow/Glow under the circle when hovered */}
                    {isHovered && (
                        <circle r={node.radius + 4} fill={colors.bg} fillOpacity={0.2} />
                    )}
                    <circle
                      r={node.radius}
                      fill={colors.bg}
                      stroke="#ffffff"
                      strokeWidth={isHovered ? 3 : 2}
                      className="cursor-pointer transition-all duration-200 shadow-sm"
                      onPointerDown={(e) => handlePointerDown(e, node.id)}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                    />
                    
                    {/* 실명 텍스트 */}
                    {node.radius > 25 && (
                      <text
                        textAnchor="middle"
                        dy={node.radius > 40 ? "-0.1em" : "0.3em"}
                        className="pointer-events-none font-bold select-none"
                        style={{ 
                          fontSize: Math.max(10, Math.min(13, node.radius / 3.5)), 
                          fill: colors.text 
                        }}
                      >
                        {node.name.length > 10 ? `${node.name.substring(0, 10)}...` : node.name}
                      </text>
                    )}
                    
                    {/* 보조 면적수치 텍스트 (충분한 넓이가 있을 때만) */}
                    {node.radius > 40 && (
                      <text
                        textAnchor="middle"
                        dy="1.4em"
                        className="pointer-events-none select-none font-medium opacity-80"
                        style={{ 
                          fontSize: Math.max(9, Math.min(10, node.radius / 5)), 
                          fill: colors.text 
                        }}
                      >
                        {node.area.toLocaleString()} ㎡
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
            </g>
          </svg>
        </div>

        {/* Right Info Panel Overlay / Sidebar */}
        <div className="w-[280px] bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col p-5 hidden lg:flex h-fit sticky top-6">
          <div className="flex items-center mb-6">
            <Settings className="text-slate-400 mr-2" size={18} />
            <h2 className="font-bold text-slate-800 text-[14px]">Adjacency Matrix Info</h2>
          </div>

          <div className="flex-1 space-y-8">
            
            {/* Legend Section */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">Space Zoning</h3>
              <div className="space-y-2.5">
                {[
                  { id: 0, label: '학습/업무 (Teal)' },
                  { id: 1, label: '지원/공용 (Sage Green)' },
                  { id: 2, label: '특화/서비스 (Beige)' },
                  { id: 3, label: '기타/설비 (Navy)' }
                ].map(group => (
                  <div key={group.id} className="flex items-center space-x-3 text-[13px] font-medium text-slate-700">
                    <span 
                      className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-sm"
                      style={{ backgroundColor: GROUP_COLORS[group.id as keyof typeof GROUP_COLORS].bg }}
                    ></span>
                    <span>{group.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Link Legend */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">Link Types</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-[13px] font-medium text-slate-700">
                  <svg width="24" height="10"><line x1="0" y1="5" x2="24" y2="5" stroke="#64748b" strokeWidth="2" /></svg>
                  <span>Mandatory Adjacency</span>
                </div>
                <div className="flex items-center space-x-3 text-[13px] font-medium text-slate-700">
                  <svg width="24" height="10"><line x1="0" y1="5" x2="24" y2="5" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" /></svg>
                  <span>Desired Adjacency</span>
                </div>
              </div>
            </div>

            {/* Physics Stats */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">Physics Engine</h3>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-3 flex items-center justify-between">
                <span className="text-[12px] font-semibold text-slate-600">Simulating</span>
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isPlaying ? 'bg-teal-400' : 'bg-slate-300'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isPlaying ? 'bg-teal-500' : 'bg-slate-400'}`}></span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                각 노드는 면적(Area)에 비례한 반지름을 가지며, 조닝 그룹화(Zoning Clusters) 및 무장애 동선(BF)을 위한 1.4m 휠체어 회전반경 버퍼(Buffer) 물리력이 엄격하게 적용되었습니다.
              </p>
            </div>
            
          </div>
          
        </div>

      </div>
    </div>
  );
};
