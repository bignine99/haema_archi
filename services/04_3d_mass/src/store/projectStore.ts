import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { searchKakaoAddress, getVworldParcel, fetchSurroundingBuildings, type KakaoAddressResult, type ParcelResult, type RealBuilding } from '@/services/gisApi';
import { calculateMaxEnvelope, ZONE_REGULATIONS, type MaxEnvelopeResult, type SetbackResult } from '@/services/regulationEngine';
import type { SiteAnalysisResult } from '@/services/siteAnalysisService';
import type { RegulationAnalysisResult } from '@/services/regulationAnalysisService';
import type { LandUseRegulationResult } from '@/services/landUseService';
import { type ParsedProjectData } from '@/services/documentParser';
import { generateSpaceProgramWithAI } from '@/services/geminiSpaceService';

// ─── 건축 용도 타입 ───
export type BuildingUse =
    | '다가구주택' | '다세대주택' | '공동주택(아파트)' | '오피스텔'
    | '근린생활시설' | '업무시설(오피스)' | '숙박시설' | '청년주택'
    | '교육연구시설' | '의료시설' | '종교시설';

// ─── Phase B: 공간 프로그래밍 모델 ───
export interface BarrierFreeChecklist {
    rampSlopeConfig: number;       // 경사로 기울기 기준 (예: 18)
    corridorWidth: number;         // 최소 복도 폭
    wheelchairRotation: string;    // 회전 공간 규격
    elevatorCapacity: string;      // 권장 엘리베이터 사양
}

export interface Room {
    id: string;
    name: string;
    netArea: number;       // 전용면적
    commonArea: number;    // 공용면적
    totalArea: number;     // 합계
    isRequired: boolean;   // 법적 필수 여부
}

export interface Zone {
    id: string;
    name: string;
    rooms: Room[];
    zoneTotalArea: number; // 합계
}

export interface FloorZoning {
    id: string;
    floor: string;                 // 예: '1F', 'B1F'
    primaryUse: string;            // 예: 돌봄교실
    secondaryUse: string[];        // 예: ['시청각교육실', '식당']
    targetAgeGroup: string;        // 예: 유/초등, 중학, 고등
    assignedArea: number;          // 층 배분 면적 (예상 연면적 할당 단위)
    zones: Zone[];                 // NEW: 4Depth 조닝
    floorTotalArea: number;        // NEW: 계산된 전체 층 면적
    height?: number;               // NEW: 층고
}

// ─── 필지 데이터 인터페이스 ───
export interface ParcelData {
    id: string;
    address: string;
    pnu: string;
    landArea: number;
    polygon: [number, number][];
    zoneType: string;
    buildingCoverageLimit: number;
    floorAreaRatioLimit: number;
    maxHeight: number;
    roadWidth: number;
    northAngle: number;
    shapeLabel: string;
    centerLng: number;
    centerLat: number;
}

// ─── 폴리곤 유틸리티 ───
export function polygonCentroid(pts: [number, number][]): [number, number] {
    if (!pts || pts.length === 0) return [0, 0];
    let cx = 0, cy = 0;
    for (const [x, y] of pts) { cx += x; cy += y; }
    return [cx / pts.length, cy / pts.length];
}

export function polygonBBox(pts: [number, number][]) {
    if (!pts || pts.length === 0) return { minX: 0, maxX: 0, minY: 0, maxY: 0, width: 0, height: 0 };
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const [x, y] of pts) {
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
    return { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY };
}

// ─── 주변 환경 데이터 인터페이스 (Forma/TestFit 스타일) ───
export interface NearbyBuilding {
    id: string;
    x: number; z: number;       // 대지 중심 기준 위치 (m)
    width: number; depth: number;
    height: number;              // 건물 높이 (m)
    floors: number;
    use: 'residential' | 'commercial' | 'office' | 'mixed' | 'parking';
    color?: string;
    polygon?: [number, number][]; // WGS84 좌표계 폴리곤
    heightSource?: 'register' | 'floors' | 'estimate'; // 높이 데이터 출처
}

export interface RoadSegment {
    id: string;
    points: [number, number][];  // 도로 중심선 좌표 (대지 중심 기준)
    width: number;               // 도로 폭 (m)
    name?: string;
    type: 'main' | 'local' | 'alley';
}

export interface TreeData {
    x: number; z: number;
    height: number;              // 수목 높이 (m)
    canopyRadius: number;        // 수관 반경
    type: 'deciduous' | 'conifer' | 'palm';
}

export interface SiteContext {
    buildings: NearbyBuilding[];
    roads: RoadSegment[];
    trees: TreeData[];
}

// ─── 매스 엔진 Wing 데이터 (Skill 7 백엔드 응답) ───
export interface MassingWing {
    id: string;
    label: string;
    width: number;
    depth: number;
    height: number;
    x: number;
    y: number;
    z: number;
    rotation: number;
    floors: number;
    floor_height: number;
    floor_area_sqm: number;
    primary_use: string;
    footprint_coords: number[][];
}

export interface MassingResult {
    typology_type: string;
    typology_label: string;
    wings: MassingWing[];
    total_footprint_area_sqm: number;
    total_gfa_sqm: number;
    calculated_coverage_pct: number;
    calculated_far_pct: number;
    max_height_m: number;
    total_floors: number;
    estimated_units: number;
    buildable_polygon: number[][];
    buildable_area_sqm: number;
    site_area_sqm: number;
    error?: string;
    warnings: string[];
}

export type TypologyType = 'SINGLE_BLOCK' | 'TOWER_PODIUM' | 'L_SHAPE' | 'U_SHAPE' | 'H_SHAPE' | 'PARALLEL' | 'COURTYARD' | 'STAGGERED';

export const TYPOLOGY_LABELS: Record<TypologyType, string> = {
    SINGLE_BLOCK: '단일 블록',
    TOWER_PODIUM: '타워 + 포디엄',
    L_SHAPE: 'ㄱ자형',
    U_SHAPE: 'ㄷ자형',
    H_SHAPE: 'H자형',
    PARALLEL: '평행동',
    COURTYARD: '중정형',
    STAGGERED: '엇갈림',
};

// ─── Mock 필지별 주변 환경 데이터 ───
export const MOCK_SITE_CONTEXTS: Record<string, SiteContext> = {
    'gangnam-yeoksam': {
        // 역삼동 — 다세대/근생 밀집, 이면도로 패턴
        buildings: [
            // 북쪽 건물들
            { id: 'n1', x: -5, z: -25, width: 12, depth: 10, height: 15, floors: 5, use: 'residential' },
            { id: 'n2', x: 12, z: -28, width: 14, depth: 12, height: 18, floors: 6, use: 'residential' },
            { id: 'n3', x: 30, z: -22, width: 10, depth: 10, height: 12, floors: 4, use: 'residential' },
            // 남쪽 건물들 (도로 건너편)
            { id: 's1', x: -8, z: 30, width: 15, depth: 12, height: 12, floors: 4, use: 'commercial', color: '#b8c4d0' },
            { id: 's2', x: 10, z: 32, width: 18, depth: 10, height: 9, floors: 3, use: 'commercial', color: '#b8c4d0' },
            { id: 's3', x: 32, z: 28, width: 12, depth: 14, height: 21, floors: 7, use: 'mixed' },
            // 동쪽
            { id: 'e1', x: 35, z: -5, width: 10, depth: 15, height: 15, floors: 5, use: 'residential' },
            { id: 'e2', x: 38, z: 12, width: 12, depth: 10, height: 9, floors: 3, use: 'residential' },
            // 서쪽
            { id: 'w1', x: -22, z: -8, width: 14, depth: 12, height: 18, floors: 6, use: 'residential' },
            { id: 'w2', x: -25, z: 8, width: 10, depth: 10, height: 12, floors: 4, use: 'residential' },
            { id: 'w3', x: -18, z: 22, width: 16, depth: 8, height: 6, floors: 2, use: 'commercial', color: '#b8c4d0' },
            // 먼 배경 건물들
            { id: 'bg1', x: -45, z: -40, width: 20, depth: 15, height: 36, floors: 12, use: 'office' },
            { id: 'bg2', x: 50, z: -45, width: 18, depth: 18, height: 45, floors: 15, use: 'office' },
            { id: 'bg3', x: -50, z: 45, width: 22, depth: 14, height: 30, floors: 10, use: 'mixed' },
            { id: 'bg4', x: 55, z: 40, width: 16, depth: 20, height: 24, floors: 8, use: 'residential' },
        ],
        roads: [
            { id: 'r1', points: [[-60, 20], [70, 20]], width: 8, name: '역삼로', type: 'main' },
            { id: 'r2', points: [[-15, -50], [-15, 70]], width: 6, name: '이면도로', type: 'local' },
            { id: 'r3', points: [[-60, -15], [70, -15]], width: 4, type: 'alley' },
            { id: 'r4', points: [[28, -50], [28, 70]], width: 4, type: 'alley' },
        ],
        trees: [
            { x: -12, z: 18, height: 6, canopyRadius: 2.5, type: 'deciduous' },
            { x: 25, z: 19, height: 5, canopyRadius: 2, type: 'deciduous' },
            { x: -20, z: -15, height: 7, canopyRadius: 3, type: 'deciduous' },
            { x: 35, z: -15, height: 5, canopyRadius: 2, type: 'deciduous' },
            { x: -30, z: 0, height: 4, canopyRadius: 1.5, type: 'conifer' },
            { x: -30, z: 10, height: 4.5, canopyRadius: 1.5, type: 'conifer' },
            { x: 45, z: 5, height: 5, canopyRadius: 2, type: 'deciduous' },
            { x: -10, z: -35, height: 6, canopyRadius: 2.5, type: 'deciduous' },
            { x: 20, z: -38, height: 5, canopyRadius: 2, type: 'deciduous' },
            { x: -40, z: 30, height: 4, canopyRadius: 1.8, type: 'conifer' },
            { x: 48, z: -30, height: 5, canopyRadius: 2, type: 'deciduous' },
            { x: -8, z: 45, height: 6, canopyRadius: 2.5, type: 'deciduous' },
        ],
    },
    'seocho-seocho': {
        // 서초동 — 대형 상업/업무 건물, 넓은 도로
        buildings: [
            // 북쪽
            { id: 'n1', x: 0, z: -40, width: 25, depth: 20, height: 45, floors: 15, use: 'office' },
            { id: 'n2', x: 35, z: -35, width: 20, depth: 18, height: 36, floors: 12, use: 'office' },
            { id: 'n3', x: -35, z: -38, width: 18, depth: 16, height: 30, floors: 10, use: 'mixed' },
            // 남쪽
            { id: 's1', x: -10, z: 45, width: 30, depth: 15, height: 24, floors: 8, use: 'commercial', color: '#b8c4d0' },
            { id: 's2', x: 30, z: 48, width: 22, depth: 18, height: 33, floors: 11, use: 'office' },
            { id: 's3', x: -40, z: 42, width: 16, depth: 14, height: 18, floors: 6, use: 'commercial', color: '#b8c4d0' },
            // 동쪽
            { id: 'e1', x: 55, z: 0, width: 22, depth: 22, height: 54, floors: 18, use: 'office' },
            { id: 'e2', x: 50, z: 25, width: 18, depth: 15, height: 27, floors: 9, use: 'mixed' },
            // 서쪽
            { id: 'w1', x: -50, z: -5, width: 20, depth: 20, height: 42, floors: 14, use: 'office' },
            { id: 'w2', x: -48, z: 20, width: 15, depth: 18, height: 21, floors: 7, use: 'residential' },
            // 배경
            { id: 'bg1', x: -70, z: -60, width: 30, depth: 25, height: 60, floors: 20, use: 'office' },
            { id: 'bg2', x: 75, z: -50, width: 25, depth: 20, height: 75, floors: 25, use: 'office' },
            { id: 'bg3', x: 0, z: 75, width: 35, depth: 20, height: 48, floors: 16, use: 'mixed' },
        ],
        roads: [
            { id: 'r1', points: [[-90, 30], [100, 30]], width: 20, name: '서초대로', type: 'main' },
            { id: 'r2', points: [[40, -70], [40, 90]], width: 12, name: '서초중앙로', type: 'main' },
            { id: 'r3', points: [[-90, -25], [100, -25]], width: 8, name: '이면도로', type: 'local' },
            { id: 'r4', points: [[-30, -70], [-30, 90]], width: 6, type: 'local' },
        ],
        trees: [
            // 가로수 (서초대로)
            { x: -60, z: 30, height: 8, canopyRadius: 3, type: 'deciduous' },
            { x: -40, z: 30, height: 7, canopyRadius: 2.5, type: 'deciduous' },
            { x: -20, z: 30, height: 8, canopyRadius: 3, type: 'deciduous' },
            { x: 0, z: 30, height: 7.5, canopyRadius: 2.5, type: 'deciduous' },
            { x: 20, z: 30, height: 8, canopyRadius: 3, type: 'deciduous' },
            { x: 60, z: 30, height: 7, canopyRadius: 2.5, type: 'deciduous' },
            { x: 80, z: 30, height: 8, canopyRadius: 3, type: 'deciduous' },
            // 기타
            { x: -55, z: -15, height: 6, canopyRadius: 2, type: 'conifer' },
            { x: 60, z: -20, height: 6, canopyRadius: 2, type: 'conifer' },
            { x: -20, z: 55, height: 5, canopyRadius: 2, type: 'deciduous' },
            { x: 50, z: 60, height: 7, canopyRadius: 2.5, type: 'deciduous' },
        ],
    },
};

// ─── Mock 필지 데이터 (예시 2개) ───
export const MOCK_PARCELS: ParcelData[] = [
    {
        id: 'gangnam-yeoksam',
        address: '서울특별시 강남구 역삼동 123-45',
        pnu: '1168010100-10123-0045',
        landArea: 330,
        polygon: [[0, 0], [20, 0], [20, 16.5], [0, 16.5]],
        zoneType: '제2종 일반주거지역',
        buildingCoverageLimit: 60,
        floorAreaRatioLimit: 250,
        maxHeight: 50,
        roadWidth: 8,
        northAngle: 0,
        shapeLabel: '직사각형',
        centerLng: 127.0366, centerLat: 37.5007,
    },
    {
        id: 'seocho-seocho',
        address: '서울특별시 서초구 서초동 567-89',
        pnu: '1165010100-10567-0089',
        landArea: 600,
        polygon: [[0, 0], [30, 0], [32, 10], [28, 22], [10, 24], [0, 18]],
        zoneType: '일반상업지역',
        buildingCoverageLimit: 80,
        floorAreaRatioLimit: 800,
        maxHeight: 100,
        roadWidth: 20,
        northAngle: 0,
        shapeLabel: '대형 육각형',
        centerLng: 127.0128, centerLat: 37.4913,
    },
];

// ─── 과업지시서 원본 데이터 (전 페이지 공유) ───
export interface DocumentInfo {
    fileName: string;
    uploadedAt: string;
    rawData: ParsedProjectData;
}

// ─── 프로젝트 상태 ───
export interface ProjectState {
    projectName: string;
    address: string;
    pnu: string;
    landArea: number;
    landPolygon: [number, number][];

    zoneType: string;
    buildingCoverageLimit: number;
    floorAreaRatioLimit: number;
    maxHeight: number;

    buildingUse: BuildingUse;
    floorHeight: number;
    commercialFloors: number;
    residentialFloors: number;
    totalFloors: number;

    grossFloorArea: number;
    achievedFAR: number;
    parkingRequired: number;

    // 과업지시서 추가 데이터
    constructionCost: string;
    designScope: string;
    certifications: string[];
    documentInfo: DocumentInfo | null;

    // 과업지시서 세부 섹션
    generalGuidelines: string[];   // 일반지침
    designGuidelines: string[];    // 설계지침
    deliverables: string[];        // 성과품
    keyNotes: string[];            // 주요 확인사항
    facilityList: string[];        // 시설 목록
    designDirection: string[];     // 설계 방향

    // ── Persistent Analysis States ──
    siteAnalysisResult: SiteAnalysisResult | null;
    setSiteAnalysisResult: (result: SiteAnalysisResult | null) => void;
    regulationAnalysisResult: RegulationAnalysisResult | null;
    setRegulationAnalysisResult: (result: RegulationAnalysisResult | null) => void;
    ordinanceResult: LandUseRegulationResult | null;
    setOrdinanceResult: (result: LandUseRegulationResult | null) => void;

    // Phase B State
    barrierFreeChecklist: BarrierFreeChecklist;
    floorZoning: FloorZoning[];
    setBarrierFreeChecklist: (data: Partial<BarrierFreeChecklist>) => void;
    updateFloorZoning: (id: string, data: Partial<FloorZoning>) => void;
    addFloorZoning: (data: Omit<FloorZoning, 'id'>) => void;
    removeFloorZoning: (id: string) => void;
    addRoomToFloor: (floorId: string, room: Omit<Room, 'id'>) => void;
    removeRoomFromFloor: (floorId: string, roomId: string) => void;
    moveRoomToFloor: (roomId: string, sourceFloorId: string, targetFloorId: string) => void;
    updateRoomArea: (floorId: string, zoneId: string, roomId: string, field: 'netArea' | 'commonArea', value: number) => void;
    autoGenerateSpaceProgram: () => Promise<void>;

    // Step 2
    selectedParcelId: string | null;
    roadWidth: number;
    shapeLabel: string;
    isRealParcel: boolean;
    apiError: string | null;
    kakaoResults: KakaoAddressResult[];
    centerLat: number;
    centerLng: number;
    polygonWGS84: [number, number][] | null;
    realSurroundingBuildings: RealBuilding[];

    // Step 3: 법규 엔진
    maxEnvelope: MaxEnvelopeResult | null;
    showMaxEnvelope: boolean;
    northAngle: number;

    selectedFloor: number | null;
    isLoading: boolean;

    // ── 매스 엔진 (Skill 7-8) ──
    massingWings: MassingWing[];
    selectedTypology: TypologyType;
    massingResult: MassingResult | null;
    allTypologyResults: MassingResult[];
    massingLoading: boolean;
    massingError: string | null;
    showMassing: boolean;

    // ── 법규 완화 (인센티브) 적용 ──
    incentives: {
        publicOpenSpace: boolean;    // 공개공지 (용적률, 높이 +20%)
        greenBuilding: boolean;      // 녹색건축/ZEB 등 (건폐, 용적, 높이 +15%)
        intelligentBuilding: boolean;// 지능형건축물 (건폐, 용적, 높이 +15%)
        greenRoof: boolean;          // 옥상녹화 (건폐율, 용적률 +5%)
    };
    setIncentives: (updates: Partial<ProjectState['incentives']>) => void;

    // ── 시뮬레이션 (일조, 그림자) ──
    showSunlight: boolean;
    simulationMonth: number;
    simulationDay: number;
    simulationHour: number;
    showShadowAnalysis: boolean;

    // 액션
    setAddress: (address: string) => void;
    setZoneType: (zone: string) => void;
    setBuildingUse: (use: BuildingUse) => void;
    setFloorHeight: (h: number) => void;
    setCommercialFloors: (n: number) => void;
    setResidentialFloors: (n: number) => void;
    setSelectedFloor: (f: number | null) => void;
    setShowMaxEnvelope: (show: boolean) => void;
    setNorthAngle: (angle: number) => void;
    selectParcel: (id: string) => void;
    searchRealAddress: (query: string) => Promise<KakaoAddressResult[]>;
    loadRealParcel: (kakaoResult: KakaoAddressResult) => Promise<void>;
    updateFromDocument: (fileName: string, parsedData: ParsedProjectData) => void;
    recalculate: () => void;

    // 사용자 입력 API 키
    geminiApiKey: string;
    setGeminiApiKey: (key: string) => void;

    // ── 매스 액션 ──
    setSelectedTypology: (type: TypologyType) => void;
    generateMassing: (typology?: TypologyType | 'ALL') => Promise<void>;
    setShowMassing: (show: boolean) => void;

    // ── 시뮬레이션 액션 ──
    setShowSunlight: (show: boolean) => void;
    setSimulationDate: (month: number, day: number) => void;
    setSimulationHour: (hour: number) => void;
    setShowShadowAnalysis: (show: boolean) => void;

    // ── AI 코파일럿 채팅 상태 ──
    chatLoading: boolean;
    aiComment: string | null;
    sendMassingChat: (msg: string) => Promise<void>;
}

// ─── 법규 기반 계산 로직 ───
function regulationCalculate(state: Partial<ProjectState>) {
    const landArea = state.landArea || 300;
    const zoneType = state.zoneType || '제2종 일반주거지역';
    const buildingUse = state.buildingUse || '오피스텔';
    const floorHeight = state.floorHeight || 3.3;
    const commercialFloors = state.commercialFloors ?? 2;
    const residentialFloors = state.residentialFloors ?? 8;
    const roadWidth = state.roadWidth || 8;
    const northAngle = (state as any).northAngle || 0;
    const polygon = state.landPolygon || [[0, 0], [20, 0], [20, 16.5], [0, 16.5]];

    const coverageLimit = (state.buildingCoverageLimit || 60) / 100;
    const farLimit = (state.floorAreaRatioLimit || 200) / 100;

    // 과업지시서에서 설정된 totalFloors가 있으면 그 값을 보존
    const hasDocument = !!(state as any).documentInfo;
    const documentTotalFloors = hasDocument ? (state as any).totalFloors : undefined;
    const documentGrossFloorArea = hasDocument ? (state as any).grossFloorArea : undefined;

    const totalFloors = documentTotalFloors || (commercialFloors + residentialFloors);

    // 연면적: 과업지시서 값이 있으면 사용, 없으면 계산
    let grossFloorArea: number;
    if (documentGrossFloorArea && documentGrossFloorArea > 0) {
        grossFloorArea = documentGrossFloorArea;
    } else {
        const footprint = landArea * coverageLimit;
        const calculatedGross = footprint * totalFloors;
        const maxGross = landArea * farLimit;
        grossFloorArea = Math.min(calculatedGross, maxGross);
    }

    const achievedFAR = landArea > 0 ? (grossFloorArea / landArea) * 100 : 0;

    // 법규 엔진으로 Max Envelope 계산
    const envelope = calculateMaxEnvelope({
        landArea,
        landPolygon: polygon as [number, number][],
        zoneType,
        buildingUse,
        floorHeight,
        roadWidth,
        northAngle,
        commercialFloors,
        residentialFloors,
    });

    return {
        totalFloors,
        grossFloorArea,
        achievedFAR: Math.min(achievedFAR, farLimit * 100),
        parkingRequired: envelope.parkingRequired,
        maxEnvelope: envelope,
    };
}

const defaultParcel = MOCK_PARCELS[0];

export const useProjectStore = create<ProjectState>()(
    persist(
        (set, get) => ({
            projectName: '미정 프로젝트',
    address: defaultParcel.address,
    pnu: defaultParcel.pnu,
    landArea: defaultParcel.landArea,
    landPolygon: defaultParcel.polygon,

    zoneType: defaultParcel.zoneType,
    buildingCoverageLimit: defaultParcel.buildingCoverageLimit,
    floorAreaRatioLimit: defaultParcel.floorAreaRatioLimit,
    maxHeight: defaultParcel.maxHeight,

    buildingUse: '오피스텔',
    floorHeight: 3.3,
    commercialFloors: 2,
    residentialFloors: 8,
    totalFloors: 10,

    grossFloorArea: 0,
    achievedFAR: 0,
    parkingRequired: 0,

    // 과업지시서 추가 데이터
    constructionCost: '미정',
    designScope: '미정',
    certifications: [],
    documentInfo: null,

    // 과업지시서 세부 섹션
    generalGuidelines: [],
    designGuidelines: [],
    deliverables: [],
    keyNotes: [],
    facilityList: [],
    designDirection: [],

    siteAnalysisResult: null,
    setSiteAnalysisResult: (result) => set({ siteAnalysisResult: result }),
    regulationAnalysisResult: null,
    setRegulationAnalysisResult: (result) => set({ regulationAnalysisResult: result }),
    ordinanceResult: null,
    setOrdinanceResult: (result) => set({ ordinanceResult: result }),

    // Phase B: 공간 프로그래밍 초기값
    barrierFreeChecklist: {
        rampSlopeConfig: 18,
        corridorWidth: 3.3,
        wheelchairRotation: '1.4x1.4',
        elevatorCapacity: '20인승 이상 (병원용 급)',
    },
    floorZoning: [
        { 
            id: 'f_b1', floor: 'B1F', primaryUse: '주차장 / 기계실', secondaryUse: ['용역원 휴게실', '기능실'], targetAgeGroup: '공동', assignedArea: 2000,
            floorTotalArea: 2000, height: 4.5,
            zones: [
                { 
                    id: 'z_b1_1', name: '지원시설영역', zoneTotalArea: 2000, 
                    rooms: [
                        { id: 'r_1', name: '지하주차장', netArea: 1500, commonArea: 500, totalArea: 2000, isRequired: true }
                    ] 
                }
            ]
        },
        { 
            id: 'f_1', floor: '1F', primaryUse: '행정실 / 중앙로비', secondaryUse: ['카페테리아', '식당', '보건실'], targetAgeGroup: '공동', assignedArea: 1500,
            floorTotalArea: 1500, height: 4.2,
            zones: [
                { 
                    id: 'z_1_1', name: '행정지원영역', zoneTotalArea: 500, 
                    rooms: [
                        { id: 'r_2', name: '행정실', netArea: 300, commonArea: 200, totalArea: 500, isRequired: true }
                    ] 
                },
                { 
                    id: 'z_1_2', name: '공용영역', zoneTotalArea: 1000, 
                    rooms: [
                        { id: 'r_3', name: '식당', netArea: 700, commonArea: 300, totalArea: 1000, isRequired: true }
                    ] 
                }
            ]
        },
        { 
            id: 'f_2', floor: '2F', primaryUse: '유치원 / 초등 일반학급', secondaryUse: ['돌봄교실', '기초재활실', '놀이실'], targetAgeGroup: '유치원/초등', assignedArea: 1800,
            floorTotalArea: 1800, height: 3.9,
            zones: [
                { 
                    id: 'z_2_1', name: '초등학습영역', zoneTotalArea: 1800, 
                    rooms: [
                        { id: 'r_4', name: '유치원 교실', netArea: 400, commonArea: 200, totalArea: 600, isRequired: true },
                        { id: 'r_5', name: '초등 일반교실', netArea: 800, commonArea: 400, totalArea: 1200, isRequired: true }
                    ] 
                }
            ]
        },
        { 
            id: 'f_3', floor: '3F', primaryUse: '중학 일반학급', secondaryUse: ['컴퓨터실', '이동수업교실', '다목적실'], targetAgeGroup: '중학', assignedArea: 1800,
            floorTotalArea: 1800, height: 3.9,
            zones: [
                { 
                    id: 'z_3_1', name: '중학학습영역', zoneTotalArea: 1800, 
                    rooms: [
                        { id: 'r_6', name: '중학 일반교실', netArea: 1200, commonArea: 600, totalArea: 1800, isRequired: true }
                    ] 
                }
            ]
        },
        { 
            id: 'f_4', floor: '4F', primaryUse: '고등 일반학급 / 전공과', secondaryUse: ['전공실습실', '직업훈련실', '바리스타실'], targetAgeGroup: '고등', assignedArea: 2200,
            floorTotalArea: 2200, height: 3.9,
            zones: [
                { 
                    id: 'z_4_1', name: '고등학습영역', zoneTotalArea: 1000, 
                    rooms: [
                        { id: 'r_7', name: '고등 일반교실', netArea: 700, commonArea: 300, totalArea: 1000, isRequired: true }
                    ] 
                },
                { 
                    id: 'z_4_2', name: '직업훈련영역', zoneTotalArea: 1200, 
                    rooms: [
                        { id: 'r_8', name: '바리스타실', netArea: 400, commonArea: 200, totalArea: 600, isRequired: false },
                        { id: 'r_9', name: '목공실', netArea: 400, commonArea: 200, totalArea: 600, isRequired: false }
                    ] 
                }
            ]
        },
    ],

    setBarrierFreeChecklist: (data) => set(state => ({ 
        barrierFreeChecklist: { ...state.barrierFreeChecklist, ...data } 
    })),
    updateFloorZoning: (id, data) => set(state => ({
        floorZoning: state.floorZoning.map(f => f.id === id ? { ...f, ...data } : f)
    })),
    addFloorZoning: (data) => set(state => ({
        floorZoning: [...state.floorZoning, { 
            ...data, 
            id: 'f_' + Date.now(),
            zones: [{ id: 'z_' + Date.now(), name: '기본 영역', rooms: [], zoneTotalArea: 0 }],
            floorTotalArea: 0
        }]
    })),
    removeFloorZoning: (id) => set(state => ({
        floorZoning: state.floorZoning.filter(f => f.id !== id)
    })),

    addRoomToFloor: (floorId, room) => set(state => {
        const newRoom = { ...room, id: 'r_' + Date.now() };
        const newZoning = state.floorZoning.map(f => {
            if (f.id !== floorId) return f;
            
            // 기존 zone이 없으면 생성
            const zones = f.zones.length > 0 ? f.zones : [{ id: 'z_' + Date.now(), name: '기본 영역', rooms: [], zoneTotalArea: 0 }];
            const newZones = [...zones];
            
            // 첫번째 zone에 추가
            newZones[0] = {
                ...newZones[0],
                rooms: [...newZones[0].rooms, newRoom],
                zoneTotalArea: newZones[0].zoneTotalArea + newRoom.totalArea
            };
            
            const newTotal = newZones.reduce((acc, z) => acc + z.zoneTotalArea, 0);
            return { ...f, zones: newZones, floorTotalArea: newTotal, assignedArea: newTotal };
        });
        return { floorZoning: newZoning };
    }),

    removeRoomFromFloor: (floorId, roomId) => set(state => {
        const newZoning = state.floorZoning.map(f => {
            if (f.id !== floorId) return f;
            
            const newZones = f.zones.map(z => {
                const filteredRooms = z.rooms.filter(r => r.id !== roomId);
                const zoneTotal = filteredRooms.reduce((acc, r) => acc + r.totalArea, 0);
                return { ...z, rooms: filteredRooms, zoneTotalArea: zoneTotal };
            });
            
            const newTotal = newZones.reduce((acc, z) => acc + z.zoneTotalArea, 0);
            return { ...f, zones: newZones, floorTotalArea: newTotal, assignedArea: newTotal };
        });
        return { floorZoning: newZoning };
    }),

    moveRoomToFloor: (roomId, sourceFloorId, targetFloorId) => set(state => {
        if (sourceFloorId === targetFloorId) return state; // 동일 층 내 이동 무시

        let roomToMove: Pick<Room, 'id' | 'name' | 'netArea' | 'commonArea' | 'totalArea' | 'isRequired'> | null = null;
        
        // 1. 소스 층에서 실(Room) 찾고 제거
        const withoutSource = state.floorZoning.map(f => {
            if (f.id !== sourceFloorId) return f;
            
            const newZones = f.zones.map(z => {
                const r = z.rooms.find(r => r.id === roomId);
                if (r) roomToMove = r;
                
                const newRooms = z.rooms.filter(r => r.id !== roomId);
                const zoneTotal = newRooms.reduce((acc, r) => acc + r.totalArea, 0);
                return { ...z, rooms: newRooms, zoneTotalArea: zoneTotal };
            });
            const newTotal = newZones.reduce((acc, z) => acc + z.zoneTotalArea, 0);
            return { ...f, zones: newZones, floorTotalArea: newTotal, assignedArea: newTotal };
        });

        if (!roomToMove) return state; // 방을 찾지 못한 경우

        // 2. 타겟 층에 실(Room) 추가
        const withTarget = withoutSource.map(f => {
            if (f.id !== targetFloorId) return f;
            
            const zones = f.zones.length > 0 ? f.zones : [{ id: 'z_' + Date.now(), name: '추가된 영역', rooms: [], zoneTotalArea: 0 }];
            const newZones = [...zones];
            
            // 첫번째 Zone에 추가
            const targetZone = newZones[0];
            const newRooms = [...targetZone.rooms, roomToMove!];
            const zoneTotal = newRooms.reduce((acc, r) => acc + r.totalArea, 0);
            
            newZones[0] = { ...targetZone, rooms: newRooms, zoneTotalArea: zoneTotal };
            
            const newTotal = newZones.reduce((acc, z) => acc + z.zoneTotalArea, 0);
            return { ...f, zones: newZones, floorTotalArea: newTotal, assignedArea: newTotal };
        });

        return { floorZoning: withTarget };
    }),

    updateRoomArea: (floorId, zoneId, roomId, field, value) => {
        set(state => {
            const newFloorZoning = state.floorZoning.map(floor => {
                if (floor.id !== floorId) return floor;

                const newZones = floor.zones.map(zone => {
                    if (zone.id !== zoneId) return zone;

                    const newRooms = zone.rooms.map(room => {
                        if (room.id !== roomId) return room;
                        
                        const updatedRoom = { ...room, [field]: value };
                        updatedRoom.totalArea = updatedRoom.netArea + updatedRoom.commonArea;
                        return updatedRoom;
                    });

                    const newZoneTotal = newRooms.reduce((acc, r) => acc + r.totalArea, 0);
                    return { ...zone, rooms: newRooms, zoneTotalArea: newZoneTotal };
                });

                const newFloorTotal = newZones.reduce((acc, z) => acc + z.zoneTotalArea, 0);
                return { ...floor, zones: newZones, floorTotalArea: newFloorTotal, assignedArea: newFloorTotal };
            });

            return { floorZoning: newFloorZoning };
        });
        
        // 차트 등을 위해 전체 계산 로직을 호출하거나, 연면적 경고 상태를 별도로 관리할 수 있음.
    },

    autoGenerateSpaceProgram: async () => {
        const state = get();
        const targetGFA = state.grossFloorArea > 0 ? state.grossFloorArea : (state.landArea * (state.floorAreaRatioLimit / 100));
        const maxFootprint = state.landArea * (state.buildingCoverageLimit / 100);
        
        const constraints = {
            grossFloorArea: targetGFA,
            buildingFootprint: maxFootprint,
            buildingCoverageLimit: state.buildingCoverageLimit,
            floorAreaRatioLimit: state.floorAreaRatioLimit,
            totalFloors: state.totalFloors > 0 ? state.totalFloors : 5
        };

        const rawText = (state.documentInfo as any)?.rawData?.rawText || '';
        
        try {
            const aiResult = await generateSpaceProgramWithAI(constraints, rawText);
            
            if (aiResult && aiResult.length > 0) {
                let roomIdCounter = 1;
                let zoneIdCounter = 1;
                
                // 1차 파싱
                const draftFloors = aiResult.map((f, i) => {
                    const zones = f.zones.map(z => {
                        const rooms = z.rooms.map(r => ({
                            id: `r_ai_${roomIdCounter++}`,
                            name: r.name,
                            netArea: typeof r.netArea === 'number' ? r.netArea : 0,
                            commonArea: typeof r.commonArea === 'number' ? r.commonArea : 0,
                            totalArea: (typeof r.netArea === 'number' ? r.netArea : 0) + (typeof r.commonArea === 'number' ? r.commonArea : 0),
                            isRequired: Boolean(r.isRequired)
                        }));
                        const zoneTotalArea = rooms.reduce((acc, r) => acc + r.totalArea, 0);
                        return { id: `z_ai_${zoneIdCounter++}`, name: z.name, zoneTotalArea, rooms };
                    });
                    const floorTotalArea = zones.reduce((acc, z) => acc + z.zoneTotalArea, 0);
                    return {
                        id: `f_ai_${i}`,
                        floor: f.floor || `${i + 1}F`,
                        primaryUse: f.primaryUse || '용도 미지정',
                        secondaryUse: [],
                        targetAgeGroup: f.targetAgeGroup || '공통',
                        height: f.height || 4.2,
                        floorTotalArea,
                        assignedArea: floorTotalArea,
                        zones
                    };
                });

                // Safety Normalization (오차 교정)
                let finalFloors = draftFloors;

                // 1. 개별 층 건축면적(Footprint) 오버 교정
                finalFloors = finalFloors.map(f => {
                    if (f.floorTotalArea > maxFootprint) {
                        const coverageScale = (maxFootprint * 0.98) / f.floorTotalArea;
                        const zones = f.zones.map(z => {
                            const rooms = z.rooms.map(r => {
                                const net = Math.round(r.netArea * coverageScale);
                                const com = Math.round(r.commonArea * coverageScale);
                                return { ...r, netArea: net, commonArea: com, totalArea: net + com };
                            });
                            return { ...z, rooms, zoneTotalArea: rooms.reduce((a, r) => a + r.totalArea, 0) };
                        });
                        const newZoneTotal = zones.reduce((a, z) => a + z.zoneTotalArea, 0);
                        return { ...f, zones, floorTotalArea: newZoneTotal, assignedArea: newZoneTotal };
                    }
                    return f;
                });

                // 2. 전체 연면적 한도 교정
                const generatedTotalArea = finalFloors.reduce((acc, f) => acc + f.floorTotalArea, 0);

                if (generatedTotalArea > targetGFA) {
                    console.warn(`[AI Area Warning] Generated ${generatedTotalArea} > Target ${targetGFA}. Normalizing...`);
                    // 목표 연면적의 98%로 조정하여 "한도 초과" UI 방지
                    const safetyScale = (targetGFA * 0.98) / generatedTotalArea;

                    finalFloors = finalFloors.map(f => {
                        const zones = f.zones.map(z => {
                            const rooms = z.rooms.map(r => {
                                const net = Math.round(r.netArea * safetyScale);
                                const com = Math.round(r.commonArea * safetyScale);
                                return { ...r, netArea: net, commonArea: com, totalArea: net + com };
                            });
                            return { ...z, rooms, zoneTotalArea: rooms.reduce((acc, r) => acc + r.totalArea, 0) };
                        });
                        return { ...f, zones, floorTotalArea: zones.reduce((acc, z) => acc + z.zoneTotalArea, 0), assignedArea: zones.reduce((acc, z) => acc + z.zoneTotalArea, 0) };
                    });
                } else if (generatedTotalArea === 0) {
                    throw new Error("AI failed to allocate area.");
                }

                set({ floorZoning: finalFloors });
                return;
            }
        } catch (e) {
            console.error('[Space Program Generator] AI 실패, 기본 로직으로 폴백합니다.', e);
        }

        // --- Fallback (정적 스케일링 기반) ---
        const baselineGFA = 16318;
        const scale = (targetGFA * 0.95) / baselineGFA;

        const REFERENCE_MODEL = [
            {
                floor: 'B1F', primaryUse: '주차장 / 기계실', targetAgeGroup: '공통', height: 4.5,
                zones: [
                    {
                        name: '지하 공용 및 관리',
                        rooms: [
                            { name: '수중운동실', netArea: 236, commonArea: 80, isRequired: true },
                            { name: '기계/전기실', netArea: 0, commonArea: 158, isRequired: true },
                            { name: '주차장', netArea: 0, commonArea: 4121, isRequired: true }
                        ]
                    }
                ]
            },
            {
                floor: '1F', primaryUse: '행정실 / 중앙로비', targetAgeGroup: '공통', height: 4.2,
                zones: [
                    {
                        name: '학교운영 및 관리',
                        rooms: [
                            { name: '행정실/교장실', netArea: 91, commonArea: 30, isRequired: true },
                            { name: '식당/돌봄교실', netArea: 540, commonArea: 170, isRequired: true }
                        ]
                    }
                ]
            },
            {
                floor: '2F', primaryUse: '일반학급', targetAgeGroup: '학생', height: 3.9,
                zones: [
                    {
                        name: '교육',
                        rooms: [
                            { name: '일반초등 1~6', netArea: 759, commonArea: 250, isRequired: true },
                            { name: '체육관', netArea: 451, commonArea: 150, isRequired: true }
                        ]
                    }
                ]
            }
        ];

        let roomIdCounter = 1;
        let zoneIdCounter = 1;

        const newFloorZoning = REFERENCE_MODEL.map((f, i) => {
            const zones = f.zones.map(z => {
                const rooms = z.rooms.map(r => {
                    const mappedNet = Math.round(r.netArea * scale);
                    const mappedCommon = Math.round(r.commonArea * scale);
                    return {
                        id: `r_ai_${roomIdCounter++}`, name: r.name,
                        netArea: mappedNet, commonArea: mappedCommon,
                        totalArea: mappedNet + mappedCommon,
                        isRequired: r.isRequired
                    };
                });
                return { id: `z_ai_${zoneIdCounter++}`, name: z.name, zoneTotalArea: rooms.reduce((a, r) => a + r.totalArea, 0), rooms };
            });
            const floorTotalArea = zones.reduce((a, z) => a + z.zoneTotalArea, 0);
            return {
                id: `f_ai_${i}`, floor: f.floor, primaryUse: f.primaryUse,
                secondaryUse: [],
                targetAgeGroup: f.targetAgeGroup, height: f.height,
                floorTotalArea, assignedArea: floorTotalArea, zones
            };
        });

        set({ floorZoning: newFloorZoning });
    },


    selectedParcelId: defaultParcel.id,
    roadWidth: defaultParcel.roadWidth,
    shapeLabel: defaultParcel.shapeLabel,
    isRealParcel: false,
    apiError: null,
    kakaoResults: [],
    centerLat: defaultParcel.centerLat,
    centerLng: defaultParcel.centerLng,
    polygonWGS84: null,
    realSurroundingBuildings: [],

    // Step 3: 법규 엔진
    maxEnvelope: null,
    showMaxEnvelope: true,
    northAngle: defaultParcel.northAngle,

    selectedFloor: null,
    isLoading: false,

    geminiApiKey: '',

    // ── 매스 엔진 초기값 ──
    massingWings: [],
    selectedTypology: 'SINGLE_BLOCK' as TypologyType,
    massingResult: null,
    allTypologyResults: [],
    massingLoading: false,
    massingError: null,
    showMassing: true,

    // AI 코파일럿 상태 초기화
    chatLoading: false,
    aiComment: null,

    // 초기 인센티브 모두 비활성화
    incentives: {
        publicOpenSpace: false,
        greenBuilding: false,
        intelligentBuilding: false,
        greenRoof: false,
    },
    setIncentives: (updates: Partial<ProjectState['incentives']>) => {
        set((state) => ({ incentives: { ...state.incentives, ...updates } }));
    },

    // ── 시뮬레이션 (일조, 그림자) 초기값 ──
    showSunlight: false,
    simulationMonth: new Date().getMonth() + 1,
    simulationDay: new Date().getDate(),
    simulationHour: 12, // 정오
    showShadowAnalysis: false,

    setAddress: (address) => set({ address }),

    setZoneType: (zoneType) => {
        const zone = ZONE_REGULATIONS[zoneType];
        if (zone) {
            set({
                zoneType,
                buildingCoverageLimit: zone.maxBuildingCoverage,
                floorAreaRatioLimit: zone.maxFloorAreaRatio,
                maxHeight: zone.maxHeight || 100,
            });
        } else {
            set({ zoneType });
        }
        get().recalculate();
    },

    setBuildingUse: (buildingUse) => { set({ buildingUse }); get().recalculate(); },
    setFloorHeight: (floorHeight) => { set({ floorHeight }); get().recalculate(); },
    setCommercialFloors: (commercialFloors) => { set({ commercialFloors }); get().recalculate(); },
    setResidentialFloors: (residentialFloors) => { set({ residentialFloors }); get().recalculate(); },
    setSelectedFloor: (selectedFloor) => set({ selectedFloor }),
    setShowMaxEnvelope: (showMaxEnvelope) => set({ showMaxEnvelope }),
    setNorthAngle: (northAngle) => { set({ northAngle }); get().recalculate(); },
    setGeminiApiKey: (geminiApiKey: string) => set({ geminiApiKey }),
    setShowMassing: (showMassing: boolean) => set({ showMassing }),

    // ── 시뮬레이션 액션 ──
    setShowSunlight: (showSunlight) => set({ showSunlight }),
    setSimulationDate: (simulationMonth, simulationDay) => set({ simulationMonth, simulationDay }),
    setSimulationHour: (simulationHour) => set({ simulationHour }),
    setShowShadowAnalysis: (showShadowAnalysis) => set((state) => ({ 
        showShadowAnalysis,
        ...(showShadowAnalysis ? { showSunlight: true } : {}) 
    })),

    setSelectedTypology: (selectedTypology: TypologyType) => {
        const allResults = get().allTypologyResults;
        const matched = allResults.find(r => r.typology_type === selectedTypology);
        if (matched && !matched.error) {
            set({
                selectedTypology,
                massingWings: matched.wings,
                massingResult: matched,
            });
        } else {
            set({ selectedTypology });
            get().generateMassing(selectedTypology);
        }
    },

    generateMassing: async (typology?: TypologyType | 'ALL') => {
        const state = get();
        const type = typology || state.selectedTypology;

        set({ massingLoading: true, massingError: null });

        try {
            // 법규 완화 계산 적용
            let farMultiplier = 1.0;
            let heightMultiplier = 1.0;
            let coverageMultiplier = 1.0;

            if (state.incentives.publicOpenSpace) { farMultiplier += 0.2; heightMultiplier += 0.2; }
            if (state.incentives.greenBuilding) { farMultiplier += 0.15; coverageMultiplier += 0.15; heightMultiplier += 0.15; }
            if (state.incentives.intelligentBuilding) { farMultiplier += 0.15; coverageMultiplier += 0.15; heightMultiplier += 0.15; }
            if (state.incentives.greenRoof) { coverageMultiplier += 0.05; farMultiplier += 0.05; }

            const effectiveCoverage = Math.min(100, state.buildingCoverageLimit * coverageMultiplier);
            const effectiveFar = state.floorAreaRatioLimit * farMultiplier;
            const effectiveHeight = state.maxHeight * heightMultiplier;

            const body = {
                site_polygon: state.landPolygon.map(([x, y]) => [x, y]),
                typology_type: type,
                max_coverage_pct: effectiveCoverage,
                max_far_pct: effectiveFar,
                max_height_m: effectiveHeight,
                max_floors: Math.floor(effectiveHeight / state.floorHeight),
                floor_height_m: state.floorHeight,
                setback_m: 1.5,
                site_area_sqm: state.landArea,
            };

            const resp = await fetch('/massing-api/api/massing/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!resp.ok) throw new Error(`API 오류: ${resp.status}`);
            const data = await resp.json();

            if (type === 'ALL' && data.typologies) {
                // 7종 전체 결과
                const results: MassingResult[] = data.typologies;
                const best = results.find(r => !r.error) || results[0];
                set({
                    allTypologyResults: results,
                    massingResult: best,
                    massingWings: best?.wings || [],
                    selectedTypology: (best?.typology_type || 'SINGLE_BLOCK') as TypologyType,
                });
            } else {
                // 단일 타입 결과
                const result: MassingResult = data;
                if (result.error) {
                    set({ massingError: result.error });
                } else {
                    set({
                        massingResult: result,
                        massingWings: result.wings,
                    });
                    // allTypologyResults 업데이트
                    const prev = [...state.allTypologyResults];
                    const idx = prev.findIndex(r => r.typology_type === result.typology_type);
                    if (idx >= 0) prev[idx] = result; else prev.push(result);
                    set({ allTypologyResults: prev });
                }
            }
        } catch (err: any) {
            console.error('[Massing] API 오류:', err);
            set({ massingError: err.message || '매스 생성 실패' });
        } finally {
            set({ massingLoading: false });
        }
    },

    sendMassingChat: async (msg: string) => {
        set({ chatLoading: true, aiComment: null });
        try {
            const state = get();
            const body = {
                message: msg,
                current_state: {
                    typology_type: state.selectedTypology,
                    max_coverage_pct: state.buildingCoverageLimit,
                    max_far_pct: state.floorAreaRatioLimit,
                    incentives: state.incentives
                }
            };
            
            const resp = await fetch('/massing-api/api/massing/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            
            if (!resp.ok) throw new Error(`API 오류: ${resp.status}`);
            const data = await resp.json();
            
            if (data.status === 'success' && data.action) {
                const action = data.action;
                
                // Update properties based on AI response
                if (action.typology && Object.keys(TYPOLOGY_LABELS).includes(action.typology)) {
                    set({ selectedTypology: action.typology as TypologyType });
                }
                if (action.incentives) {
                    state.setIncentives(action.incentives);
                }
                if (action.max_coverage_pct) {
                    set({ buildingCoverageLimit: action.max_coverage_pct });
                }
                if (action.max_far_pct) {
                    set({ floorAreaRatioLimit: action.max_far_pct });
                }
                
                // Show AI comment briefly or store it
                console.log("AI 코멘트:", action.ai_comment);
                set({ aiComment: action.ai_comment });

                // Trigger massing generation
                await get().generateMassing(action.typology as TypologyType || state.selectedTypology);
                
            } else {
                throw new Error(data.message || data.error || 'AI 응답 오류');
            }
        } catch (err: any) {
             console.error('[Massing Chat] 오류:', err);
             set({ aiComment: `오류 발생: ${err.message}` });
        } finally {
            set({ chatLoading: false });
        }
    },

    selectParcel: (id: string) => {
        const parcel = MOCK_PARCELS.find(p => p.id === id);
        if (!parcel) return;

        const currentState = get();
        const hasDocument = !!currentState.documentInfo;

        // 기본 필지 데이터 (폴리곤, 좌표 등)는 항상 업데이트
        const parcelUpdate: Partial<ProjectState> = {
            selectedParcelId: id,
            landPolygon: parcel.polygon,
            roadWidth: parcel.roadWidth,
            shapeLabel: parcel.shapeLabel,
            centerLat: parcel.centerLat,
            centerLng: parcel.centerLng,
            polygonWGS84: null,
            isRealParcel: false,
            northAngle: parcel.northAngle,
            selectedFloor: null,
        };

        // 과업지시서가 없으면 mock 데이터의 값을 사용
        if (!hasDocument) {
            parcelUpdate.address = parcel.address;
            parcelUpdate.pnu = parcel.pnu;
            parcelUpdate.landArea = parcel.landArea;
            parcelUpdate.zoneType = parcel.zoneType;
            parcelUpdate.buildingCoverageLimit = parcel.buildingCoverageLimit;
            parcelUpdate.floorAreaRatioLimit = parcel.floorAreaRatioLimit;
            parcelUpdate.maxHeight = parcel.maxHeight;
        }
        // 과업지시서가 있으면 과업지시서 데이터를 보존 (address, landArea, zoneType 등 유지)

        set(parcelUpdate);
        get().recalculate();
    },

    searchRealAddress: async (query: string) => {
        if (!query.trim()) { set({ kakaoResults: [] }); return []; }
        try {
            set({ apiError: null });
            const results = await searchKakaoAddress(query);
            set({ kakaoResults: results });
            return results;
        } catch (err: any) {
            set({ apiError: err.message || '주소 검색 실패' });
            return [];
        }
    },

    loadRealParcel: async (kakaoResult: KakaoAddressResult) => {
        set({ isLoading: true, apiError: null });
        const hasDocument = !!get().documentInfo;

        try {
            const lng = parseFloat(kakaoResult.x);
            const lat = parseFloat(kakaoResult.y);
            const parcel = await getVworldParcel(lng, lat);

            if (parcel && parcel.polygonLocal.length >= 3) {
                const nVertices = parcel.polygonLocal.length;
                const shapeNames: Record<number, string> = { 3: '삼각형', 4: '사각형', 5: '오각형', 6: '육각형' };
                const shapeName = shapeNames[nVertices] || `${nVertices}각형`;

                // 지도에서 폴리곤/좌표 정보만 가져오기
                const mapUpdate: Partial<ProjectState> = {
                    selectedParcelId: 'real-' + Date.now(),
                    landPolygon: parcel.polygonLocal,
                    shapeLabel: `실제 필지 (${shapeName})`,
                    isRealParcel: true,
                    roadWidth: 0,
                    centerLat: parcel.centerLat,
                    centerLng: parcel.centerLng,
                    polygonWGS84: parcel.polygonWGS84,
                    selectedFloor: null,
                };

                if (hasDocument) {
                    // 과업지시서가 있으면: 폴리곤/좌표만 갱신, 면적/규제값은 과업지시서 유지
                    // 주소는 과업지시서 주소를 보존 (지도 검색은 3D 뷰 전환용)
                    mapUpdate.pnu = kakaoResult.address?.b_code || parcel.pnu || '';
                } else {
                    // 과업지시서가 없으면: 모든 데이터를 지도에서 가져오기
                    mapUpdate.address = kakaoResult.address_name;
                    mapUpdate.pnu = kakaoResult.address?.b_code || parcel.pnu || '';
                    mapUpdate.landArea = parcel.area;
                }

                set(mapUpdate);
                get().recalculate();

                // 실제 주변 건물 데이터 비동기 로드
                fetchSurroundingBuildings(parcel.centerLng, parcel.centerLat, 100)
                    .then(buildings => {
                        console.log(`[Store] 실제 주변 건물 ${buildings.length}개 로드 완료`);
                        set({ realSurroundingBuildings: buildings });
                    })
                    .catch(err => console.warn('[Store] 주변 건물 로드 실패:', err));
            } else {
                const fallback: Partial<ProjectState> = {
                    selectedParcelId: 'real-' + Date.now(),
                    shapeLabel: '폴리곤 미확인',
                    isRealParcel: true,
                    centerLat: lat,
                    centerLng: lng,
                    polygonWGS84: null,
                    apiError: 'Vworld에서 필지 폴리곤을 찾지 못했습니다.',
                };
                if (!hasDocument) {
                    fallback.address = kakaoResult.address_name;
                    fallback.pnu = kakaoResult.address?.b_code || '';
                }
                set(fallback);
            }
        } catch (err: any) {
            set({ apiError: err.message || '필지 조회 실패' });
        } finally {
            set({ isLoading: false });
        }
    },

    updateFromDocument: (fileName: string, parsedData: ParsedProjectData) => {
        const updates: Partial<ProjectState> = {};

        if (parsedData.projectName) updates.projectName = parsedData.projectName;
        if (parsedData.address) updates.address = parsedData.address;
        if (parsedData.landArea) updates.landArea = parsedData.landArea;
        if (parsedData.grossFloorArea) updates.grossFloorArea = parsedData.grossFloorArea;
        if (parsedData.commercialFloors !== undefined) updates.commercialFloors = parsedData.commercialFloors;
        if (parsedData.residentialFloors !== undefined) updates.residentialFloors = parsedData.residentialFloors;
        if (parsedData.totalFloors !== undefined) updates.totalFloors = parsedData.totalFloors;
        if (parsedData.constructionCost) updates.constructionCost = parsedData.constructionCost;
        if (parsedData.designScope) updates.designScope = parsedData.designScope;
        if (parsedData.certifications) updates.certifications = parsedData.certifications;

        // 세부 섹션
        if (parsedData.generalGuidelines) updates.generalGuidelines = parsedData.generalGuidelines;
        if (parsedData.designGuidelines) updates.designGuidelines = parsedData.designGuidelines;
        if (parsedData.deliverables) updates.deliverables = parsedData.deliverables;
        if (parsedData.keyNotes) updates.keyNotes = parsedData.keyNotes;
        if (parsedData.facilityList) updates.facilityList = parsedData.facilityList;
        if (parsedData.designDirection) updates.designDirection = parsedData.designDirection;

        // 건폐율/용적률/높이제한 — 과업지시서 값이 있으면 법정 한도 대신 과업지시서 값 적용
        if (parsedData.buildingCoverageLimit) updates.buildingCoverageLimit = parsedData.buildingCoverageLimit;
        if (parsedData.floorAreaRatioLimit) updates.floorAreaRatioLimit = parsedData.floorAreaRatioLimit;
        if (parsedData.maxHeight) updates.maxHeight = parsedData.maxHeight;

        // 용도지역 — 과업지시서에서 추출된 경우 용도지역도 업데이트
        if (parsedData.zoneType) {
            updates.zoneType = parsedData.zoneType;
        }

        // 건축 용도 매핑 (강화 + 사업명 기반 추론 fallback)
        const rawUse = parsedData.buildingUse || '';
        const rawName = parsedData.projectName || '';
        const useHint = rawUse + ' ' + rawName;  // 용도 + 사업명 모두 검색

        if (/교육|학교|특수학교|초등|중학|고등|대학|어린이집|유치원|교사/.test(useHint)) {
            updates.buildingUse = '교육연구시설';
        } else if (/병원|의료|요양|클리닉/.test(useHint)) {
            updates.buildingUse = '의료시설';
        } else if (/교회|성당|사찰|종교/.test(useHint)) {
            updates.buildingUse = '종교시설';
        } else if (/오피스텔/.test(useHint)) {
            updates.buildingUse = '오피스텔';
        } else if (/아파트|공동주택|주택단지/.test(useHint)) {
            updates.buildingUse = '공동주택(아파트)';
        } else if (/업무|사무|오피스/.test(useHint)) {
            updates.buildingUse = '업무시설(오피스)';
        } else if (rawUse) {
            // 기본 매핑 시도
            const allUses: BuildingUse[] = [
                '다가구주택', '다세대주택', '공동주택(아파트)', '오피스텔',
                '근린생활시설', '업무시설(오피스)', '숙박시설', '청년주택',
                '교육연구시설', '의료시설', '종교시설',
            ];
            const matched = allUses.find(u => {
                const base = u.split('(')[0];
                return rawUse.includes(base) || base.includes(rawUse);
            });
            updates.buildingUse = (matched || rawUse) as BuildingUse;
        }

        // 원본 과업지시서 데이터 저장
        updates.documentInfo = {
            fileName,
            uploadedAt: new Date().toLocaleString('ko-KR'),
            rawData: parsedData,
        } as DocumentInfo;

        set((state) => ({ ...state, ...updates }));
        get().recalculate();
    },

    recalculate: () => {
        const state = get();
        const result = regulationCalculate(state);
        set(result);
    },
        }),
        {
            name: 'haema-project-store', // 로컬 스토리지 키 이름
            partialize: (state) => {
                // 저장 시 불필요한/일시적인 상태(로딩, 에러 등) 제외하여 랜더링 무한 로딩 버그 방지
                const { 
                    isLoading, 
                    apiError, 
                    kakaoResults, 
                    showShadowAnalysis, 
                    showSunlight, 
                    ...rest 
                } = state as Record<string, any>;
                return rest;
            },
        }
    )
);
