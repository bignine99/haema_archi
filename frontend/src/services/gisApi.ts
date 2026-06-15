/**
 * GIS API Service - 카카오 + Vworld API 연동
 * 
 * 워크플로우:
 *   1. Kakao REST API: 주소 → 위경도(WGS84) + 법정동코드
 *   2. Vworld Data API: 좌표 → 지적도 필지 폴리곤(WKT/GeoJSON)
 *   3. 좌표 변환: WGS84(도) → 로컬 미터(m) → 3D 렌더링
 */

const KAKAO_REST_KEY = import.meta.env.VITE_KAKAO_REST_KEY || '';
const VWORLD_API_KEY = import.meta.env.VITE_VWORLD_API_KEY || '';
const BUILDING_REGISTER_API_KEY = import.meta.env.VITE_BUILDING_REGISTER_API_KEY || '';

// ──── 환경 변수 검증 (앱 시작 시 1회 실행) ────
const _envChecks = [
  { name: 'KAKAO_REST_KEY', value: KAKAO_REST_KEY, critical: true },
  { name: 'VWORLD_API_KEY', value: VWORLD_API_KEY, critical: true },
  { name: 'BUILDING_REGISTER_API_KEY', value: BUILDING_REGISTER_API_KEY, critical: false },
];
const _missingEnv = _envChecks.filter(e => !e.value);
if (_missingEnv.length > 0) {
  const critical = _missingEnv.filter(e => e.critical);
  const optional = _missingEnv.filter(e => !e.critical);
  if (critical.length > 0) {
    console.error(
      `%c[GIS] ⛔ 필수 API 키 누락! 주소검색/지도가 작동하지 않습니다.\n` +
      `누락된 키: ${critical.map(e => e.name).join(', ')}\n` +
      `해결: services/04_3d_mass/.env.example 을 참고하여 .env 파일을 확인하세요.`,
      'color: #ef4444; font-weight: bold; font-size: 14px;'
    );
  }
  if (optional.length > 0) {
    console.warn(
      `[GIS] ⚠️ 선택 API 키 미설정: ${optional.map(e => e.name).join(', ')} (일부 기능 제한)`
    );
  }
} else {
  console.log(
    `%c[GIS] ✅ 모든 API 키 정상 로드 (KAKAO: ${KAKAO_REST_KEY.substring(0, 6)}…, VWORLD: ${VWORLD_API_KEY.substring(0, 8)}…)`,
    'color: #22c55e;'
  );
}

// WFS 마이크로서비스 호출 타임아웃 (ms)
const WFS_TIMEOUT_MS = 5000;

export const BUILDING_USE_COLORS: Record<string, string> = {
    residential: '#e2e8f0',
    commercial: '#cbd5e1',
    office: '#d4d4d8',
    mixed: '#d6d3d1',
    parking: '#c7c7c7',
};

// ─── 타입 정의 ───

export interface KakaoAddressResult {
    address_name: string;
    address_type: string;
    x: string; // longitude
    y: string; // latitude
    address?: {
        address_name: string;
        b_code: string;
        h_code: string;
        region_1depth_name: string;
        region_2depth_name: string;
        region_3depth_name: string;
        mountain_yn: string;
        main_address_no: string;
        sub_address_no: string;
    };
    road_address?: {
        address_name: string;
        building_name: string;
        zone_no: string;
    };
}

export interface ParcelResult {
    pnu: string;
    polygonLocal: [number, number][]; // 로컬 좌표 (미터)
    polygonWGS84: [number, number][]; // 원본 WGS84 좌표
    centerLng: number;
    centerLat: number;
    area: number; // ㎡
    jibun: string;
    addr: string;
}

export interface RealBuilding {
    id: string;
    name: string;
    category: string;        // 카카오 카테고리명 또는 건물 분류
    categoryGroup: string;   // 카테고리 그룹코드
    x: number;               // 로컬 미터 (대지 중심 기준)
    z: number;               // 로컬 미터
    lng: number;             // WGS84
    lat: number;             // WGS84
    width: number;           // 폭 (m)
    depth: number;           // 깊이 (m)
    height: number;          // 높이 (m) — 건축물대장 heit 또는 층수×3m
    floors: number;          // 층수
    use: 'residential' | 'commercial' | 'office' | 'school' | 'public' | 'mixed' | 'industrial' | 'natural';
    color: string;           // 3D 렌더링 색상
    distance: number;        // 대지 중심에서의 거리 (m)
    polygon?: [number, number][]; // 실제 평면 폴리곤 좌표 (로컬 미터)
    heightSource?: 'register' | 'floors' | 'estimate'; // 높이 데이터 출처
}

// 건축물대장 API 응답 타입 (추후 연동용)
export interface BuildingRegisterInfo {
    bldNm: string;           // 건물명
    mainPurpsCdNm: string;   // 주용도
    grndFlrCnt: number;      // 지상층수
    ugrndFlrCnt: number;     // 지하층수
    heit: number;            // 건물 높이 (m) ⭐ 핵심
    totArea: number;         // 연면적 (㎡)
    strctCdNm: string;       // 구조
    roofCdNm: string;        // 지붕구조
    platPlc: string;         // 지번주소
}

// ─── WGS84 → 로컬 미터 좌표 변환 ───
// 서울 기준 (lat ≈ 37.5°): 1° lng ≈ 88,300m, 1° lat ≈ 111,320m

function wgs84ToLocalMeters(
    coords: [number, number][],
    centerLng: number,
    centerLat: number
): [number, number][] {
    const latToM = 111320;
    const lngToM = 111320 * Math.cos(centerLat * Math.PI / 180);

    return coords.map(([lng, lat]) => [
        (lng - centerLng) * lngToM,
        (lat - centerLat) * latToM,
    ]);
}

// 면적 계산 (Shoelace formula)
function computeArea(pts: [number, number][]): number {
    let area = 0;
    const n = pts.length;
    for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        area += pts[i][0] * pts[j][1];
        area -= pts[j][0] * pts[i][1];
    }
    return Math.abs(area) / 2;
}

// ─── 1. 카카오 주소 검색 ───

export async function searchKakaoAddress(query: string): Promise<KakaoAddressResult[]> {
    if (!query.trim()) return [];

    const url = `/kakao-api/v2/local/search/address.json?query=${encodeURIComponent(query)}&size=5`;

    const res = await fetch(url, {
        headers: { 'Authorization': `KakaoAK ${KAKAO_REST_KEY}` },
    });

    if (!res.ok) {
        const errText = await res.text();
        console.error('Kakao API error:', res.status, errText);
        try {
            const errObj = JSON.parse(errText);
            if (errObj.message) {
                throw new Error(`카카오 API 거부: ${errObj.message}`);
            }
        } catch (e) {
            // JSON 파싱 실패시 기본 메시지
        }
        throw new Error(`카카오 API 오류 (${res.status}): 활성화 설정을 확인해주세요.`);
    }

    const data = await res.json();
    return data.documents || [];
}

// ─── 2. Vworld 지적도 폴리곤 조회 ───

export async function getVworldParcel(lng: number, lat: number): Promise<ParcelResult | null> {
    // Vworld Data API 2.0 - GetFeature
    // 연속지적도 필지 레이어로 공간 검색
    const layers = ['LP_PA_CBND_BUBUN', 'LT_C_ADSIGOT'];
    const domainCandidates = [
        'http://localhost',
        window.location.origin,
        'http://localhost:3004',
    ];

    for (const layer of layers) {
        for (const domain of domainCandidates) {
            try {
                const url = `/vworld-api/req/data?` +
                    `service=data&request=GetFeature&data=${layer}` +
                    `&key=${VWORLD_API_KEY}` +
                    `&domain=${encodeURIComponent(domain)}` +
                    `&geomFilter=POINT(${lng} ${lat})` +
                    `&geometry=true&crs=EPSG:4326&format=json&size=1`;

                console.log(`[GIS] Vworld 요청 (${layer}), domain=${domain}:`, url);
                const res = await fetch(url);

                if (!res.ok) {
                    console.warn(`[GIS] Vworld ${layer} HTTP 에러 (domain=${domain}):`, res.status);
                    continue;
                }

                const data = await res.json();
                console.log(`[GIS] Vworld ${layer} 응답 (domain=${domain}):`, data);

                if (data?.response?.status === 'ERROR') {
                    console.warn(`[GIS] Vworld ${layer} API 에러: ${data?.response?.error?.text || '?'} (domain=${domain})`);
                    continue;
                }

                const features = data?.response?.result?.featureCollection?.features;
                if (!features || features.length === 0) {
                    console.warn(`[GIS] Vworld ${layer} (domain=${domain}): 피처 없음`);
                    continue;
                }

                const feature = features[0];
                const geom = feature.geometry;
                const props = feature.properties || {};

                // Polygon 또는 MultiPolygon 처리
                let rawCoords: [number, number][];
                if (geom.type === 'MultiPolygon') {
                    rawCoords = geom.coordinates[0][0]; // 첫 번째 폴리곤의 외곽 링
                } else if (geom.type === 'Polygon') {
                    rawCoords = geom.coordinates[0]; // 외곽 링
                } else {
                    console.warn(`[GIS] 지원하지 않는 geometry type:`, geom.type);
                    continue;
                }

                // 마지막 점이 첫 점과 같으면 제거 (닫힌 폴리곤)
                if (rawCoords.length > 1) {
                    const first = rawCoords[0];
                    const last = rawCoords[rawCoords.length - 1];
                    if (Math.abs(first[0] - last[0]) < 1e-10 && Math.abs(first[1] - last[1]) < 1e-10) {
                        rawCoords = rawCoords.slice(0, -1);
                    }
                }

                // 중심점 계산
                let cLng = 0, cLat = 0;
                for (const [lo, la] of rawCoords) { cLng += lo; cLat += la; }
                cLng /= rawCoords.length;
                cLat /= rawCoords.length;

                // WGS84 → 로컬 미터 변환
                const localCoords = wgs84ToLocalMeters(rawCoords, cLng, cLat);
                const area = computeArea(localCoords);

                console.log(`[GIS] ✅ 필지 발견: PNU=${props.pnu}, 면적=${area.toFixed(1)}㎡, 꼭짓점=${localCoords.length}개`);

                return {
                    pnu: props.pnu || props.PNU || '',
                    polygonLocal: localCoords,
                    polygonWGS84: rawCoords,
                    centerLng: cLng,
                    centerLat: cLat,
                    area: Math.round(area),
                    jibun: props.jibun || props.JIBUN || '',
                    addr: props.addr || props.ADDR || '',
                };
            } catch (err) {
                console.warn(`[GIS] Vworld ${layer} 실패 (domain=${domain}):`, err);
                continue;
            }
        }
    }

    return null;
}

// ─── 3. 통합 조회: 주소 → 좌표 → 폴리곤 ───

export async function searchAndGetParcel(address: string): Promise<{
    kakaoResult: KakaoAddressResult;
    parcel: ParcelResult | null;
} | null> {
    const addresses = await searchKakaoAddress(address);
    if (addresses.length === 0) return null;

    const addr = addresses[0];
    const lng = parseFloat(addr.x);
    const lat = parseFloat(addr.y);

    console.log(`[GIS] 카카오 좌표: lng=${lng}, lat=${lat}, 주소=${addr.address_name}`);

    const parcel = await getVworldParcel(lng, lat);

    return { kakaoResult: addr, parcel };
}
// ─── 3-1. 건축물대장 API — 실측 높이(heit) 조회 ───

/**
 * 카카오 역지오코딩: 좌표 → 법정동코드(b_code) 추출
 * PNU에서 시군구코드(5자리) + 법정동코드(5자리)를 얻기 위함
 */
async function reverseGeocode(lng: number, lat: number): Promise<{ sigunguCd: string; bjdongCd: string } | null> {
    try {
        const url = `/kakao-api/v2/local/geo/coord2regioncode.json?x=${lng}&y=${lat}`;
        const res = await fetch(url, {
            headers: { 'Authorization': `KakaoAK ${KAKAO_REST_KEY}` },
        });
        if (!res.ok) return null;
        const data = await res.json();
        const doc = data.documents?.find((d: any) => d.region_type === 'B'); // 법정동
        if (!doc) return null;
        const code = doc.code; // 예: "1168010300" (10자리)
        return {
            sigunguCd: code.substring(0, 5),  // 11680 (강남구)
            bjdongCd: code.substring(5, 10),  // 10300 (역삼동)
        };
    } catch {
        return null;
    }
}

/**
 * 건축물대장 표제부 조회 — 법정동 내 건물들의 실측 높이(heit) 일괄 조회
 * End Point: https://apis.data.go.kr/1613000/BldRgstHubService/getBrTitleInfo
 */
export async function fetchBuildingHeights(
    sigunguCd: string,
    bjdongCd: string,
    numOfRows: number = 100
): Promise<Map<string, BuildingRegisterInfo>> {
    const heightMap = new Map<string, BuildingRegisterInfo>();

    if (!BUILDING_REGISTER_API_KEY) {
        console.warn('[건축물대장] API 키 미설정');
        return heightMap;
    }

    try {
        // 프록시 경유 호출 (CORS 회피)
        const encodedKey = encodeURIComponent(BUILDING_REGISTER_API_KEY);
        const url = `/building-api/1613000/BldRgstHubService/getBrTitleInfo` +
            `?serviceKey=${encodedKey}` +
            `&sigunguCd=${sigunguCd}` +
            `&bjdongCd=${bjdongCd}` +
            `&_type=json` +
            `&numOfRows=${numOfRows}` +
            `&pageNo=1`;

        console.log(`[건축물대장] 표제부 조회: 시군구=${sigunguCd}, 법정동=${bjdongCd}`);
        console.log(`[건축물대장] 키 앞 10자: "${BUILDING_REGISTER_API_KEY.substring(0, 10)}...", 길이: ${BUILDING_REGISTER_API_KEY.length}`);
        let res = await fetch(url);

        // 첫 번째 시도 실패 시 → 인코딩 없이 키 직접 전달 재시도
        if (!res.ok && res.status === 401) {
            console.warn(`[건축물대장] 첫 번째 시도 HTTP ${res.status} → 인코딩 없이 재시도`);
            const url2 = `/building-api/1613000/BldRgstHubService/getBrTitleInfo` +
                `?serviceKey=${BUILDING_REGISTER_API_KEY}` +
                `&sigunguCd=${sigunguCd}` +
                `&bjdongCd=${bjdongCd}` +
                `&_type=json` +
                `&numOfRows=${numOfRows}` +
                `&pageNo=1`;
            res = await fetch(url2);
        }

        if (!res.ok) {
            console.warn(`[건축물대장] HTTP ${res.status}`);
            return heightMap;
        }

        const data = await res.json();
        const items = data?.response?.body?.items?.item;

        if (!items) {
            console.warn('[건축물대장] 응답에 items 없음');
            return heightMap;
        }

        // 단일 항목이면 배열이 아닐 수 있음
        const itemList = Array.isArray(items) ? items : [items];

        for (const item of itemList) {
            const heit = parseFloat(item.heit) || 0;
            const grndFlrCnt = parseInt(item.grndFlrCnt) || 0;
            const platPlc = item.platPlc || '';
            const bldNm = item.bldNm || '';
            const bun = item.bun || '';
            const ji = item.ji || '';

            // 높이 정보가 유효한 건물만 저장
            if (heit > 0 || grndFlrCnt > 0) {
                // 키: "시군구_법정동_번_지" (건물 식별)
                const key = `${sigunguCd}_${bjdongCd}_${bun.replace(/^0+/, '')}_${ji.replace(/^0+/, '')}`;
                heightMap.set(key, {
                    bldNm,
                    mainPurpsCdNm: item.mainPurpsCdNm || '',
                    grndFlrCnt,
                    ugrndFlrCnt: parseInt(item.ugrndFlrCnt) || 0,
                    heit,
                    totArea: parseFloat(item.totArea) || 0,
                    strctCdNm: item.strctCdNm || '',
                    roofCdNm: item.roofCdNm || '',
                    platPlc,
                });
            }
        }

        console.log(`[건축물대장] ✅ ${heightMap.size}개 건물 높이 데이터 확보 (총 ${itemList.length}건 중)`);
        return heightMap;
    } catch (e) {
        console.warn('[건축물대장] API 호출 실패:', e);
        return heightMap;
    }
}

/**
 * VWorld 건물 데이터에 건축물대장 실측 높이를 보강
 * - VWorld LT_C_SPBD에서 가져온 건물에 대해 같은 법정동의 건축물대장 데이터를 매칭
 * - heit(실측 높이)가 있으면 기존 층수×3m 높이를 교체
 */
export async function enrichBuildingsWithRegisterHeight(
    buildings: RealBuilding[],
    centerLng: number,
    centerLat: number
): Promise<RealBuilding[]> {
    if (!BUILDING_REGISTER_API_KEY || buildings.length === 0) {
        return buildings;
    }

    // 1. 중심 좌표로 법정동 코드 조회
    const region = await reverseGeocode(centerLng, centerLat);
    if (!region) {
        console.warn('[건축물대장] 역지오코딩 실패 — 높이 보강 스킵');
        return buildings;
    }

    // 2. 해당 법정동의 건물 높이 일괄 조회
    const heightMap = await fetchBuildingHeights(region.sigunguCd, region.bjdongCd, 200);
    if (heightMap.size === 0) {
        console.warn('[건축물대장] 높이 데이터 없음 — 층수 기반 유지');
        return buildings; // 하지만 Vworld 에는 용도코드가 없으므로 보강 필요
    }

    const parseBuildingUse = (nm: string, defaultUse: any = 'residential') => {
        if (!nm) return defaultUse;
        if (nm.includes('주택') || nm.includes('아파트') || nm.includes('다세대') || nm.includes('단독') || nm.includes('다중')) return 'residential';
        if (nm.includes('근린') || nm.includes('위락') || nm.includes('판매') || nm.includes('상업') || nm.includes('숙박')) return 'commercial';
        if (nm.includes('업무') || nm.includes('오피스텔')) return 'office';
        if (nm.includes('교육') || nm.includes('학교') || nm.includes('연구')) return 'school';
        if (nm.includes('공공') || nm.includes('문화') || nm.includes('종교') || nm.includes('의료') || nm.includes('노유자') || nm.includes('수련')) return 'public';
        if (nm.includes('공장') || nm.includes('창고') || nm.includes('운수') || nm.includes('산업') || nm.includes('자동차') || nm.includes('방송')) return 'industrial';
        return defaultUse;
    };

    // 3. 각 건물에 실측 높이 및 용도 보강
    let enriched = 0;
    const enrichedBuildings = buildings.map(b => {
        let bestMatch: BuildingRegisterInfo | null = null;
        let bestScore = 0;

        for (const [, info] of heightMap) {
            let score = 0;

            // 건물명 매칭 (부분 일치)
            if (b.name && info.bldNm && b.name.length > 1 && info.bldNm.includes(b.name)) {
                score += 3;
            }

            // 층수 매칭 (±2층 이내)
            if (info.grndFlrCnt > 0 && Math.abs(b.floors - info.grndFlrCnt) <= 2) {
                score += 2;
            }

            // 층수 정확 일치
            if (info.grndFlrCnt > 0 && b.floors === info.grndFlrCnt) {
                score += 3;
            }

            // VWorld API의 면적 조건 (약간의 오차 허용) - 구현 생략

            if (score > bestScore) {
                bestScore = score;
                bestMatch = info;
            }
        }

        // 보강: 매칭 성공 시 실측 높이와 용도 적용 (score >= 2 의미있는 매칭일 경우)
        if (bestMatch && bestScore >= 2) {
            enriched++;
            
            // 용도 매핑
            const updatedUse = parseBuildingUse(bestMatch.mainPurpsCdNm, b.use);
            const updatedColor = BUILDING_USE_COLORS[updatedUse] || (updatedUse === 'school' ? '#c4b5fd' : updatedUse === 'public' ? '#93c5fd' : updatedUse === 'industrial' ? '#a8a29e' : '#e2e8f0');

            return {
                ...b,
                use: updatedUse,
                category: bestMatch.mainPurpsCdNm || b.category,
                color: updatedColor,
                height: bestMatch.heit > 0 ? bestMatch.heit : b.height,
                floors: bestMatch.grndFlrCnt > 0 ? bestMatch.grndFlrCnt : b.floors,
                heightSource: bestMatch.heit > 0 ? 'register' : b.heightSource,
            };
        }

        // 매칭 실패 시 동일 법정동 평균 층고 비율 적용
        // (건축물대장 데이터가 있는 건물들의 평균 층고를 계산하여 적용)
        const avgFloorHeight = calculateAvgFloorHeight(heightMap);
        if (avgFloorHeight > 0 && b.floors > 0) {
            return {
                ...b,
                height: b.floors * avgFloorHeight,
                heightSource: 'floors' as const,
            };
        }

        return { ...b, heightSource: 'estimate' as const };
    });

    console.log(`[건축물대장] ✅ ${enriched}/${buildings.length}개 건물에 실측 높이 적용 (평균층고: ${calculateAvgFloorHeight(heightMap).toFixed(2)}m)`);
    return enrichedBuildings;
}

/**
 * 건축물대장 데이터에서 평균 층고(m/층) 계산
 */
function calculateAvgFloorHeight(heightMap: Map<string, BuildingRegisterInfo>): number {
    let totalHeight = 0;
    let totalFloors = 0;

    for (const [, info] of heightMap) {
        if (info.heit > 0 && info.grndFlrCnt > 0) {
            totalHeight += info.heit;
            totalFloors += info.grndFlrCnt;
        }
    }

    return totalFloors > 0 ? totalHeight / totalFloors : 3.0; // 기본값 3m/층
}

// ─── 3-2. vWorld 건물 데이터 조회 (폴리곤 + 층수) ───

export async function getVworldBuildings(centerLng: number, centerLat: number, radius: number = 500): Promise<RealBuilding[]> {
    const bboxRadius = radius / 100000;
    const minX = centerLng - bboxRadius;
    const minY = centerLat - bboxRadius;
    const maxX = centerLng + bboxRadius;
    const maxY = centerLat + bboxRadius;
    const layer = 'LT_C_SPBD';

    // VWorld 도메인 인증이 엄격 → 등록된 서비스URL(http://localhost)를 최우선 시도
    const domainCandidates = [
        'http://localhost',
        window.location.origin,
        'http://localhost:3004',
    ];

    for (const domain of domainCandidates) {
        const url = `/vworld-api/req/data?service=data&request=GetFeature&data=${layer}&key=${VWORLD_API_KEY}&domain=${encodeURIComponent(domain)}&geomFilter=BOX(${minX},${minY},${maxX},${maxY})&geometry=true&crs=EPSG:4326&format=json&size=1000`;

        try {
            console.log(`[GIS] VWorld 건물 요청: domain=${domain}`);
            const res = await fetch(url);
            if (!res.ok) { console.warn(`[GIS] VWorld HTTP ${res.status} (domain=${domain})`); continue; }
            const data = await res.json();

            // 내부 에러 체크 (200이지만 INCORRECT_KEY 등)
            if (data?.response?.status === 'ERROR') {
                console.warn(`[GIS] VWorld 에러: ${data?.response?.error?.text || '?'} (domain=${domain})`);
                continue;
            }

            const features = data?.response?.result?.featureCollection?.features;
            if (!features || features.length === 0) {
                console.warn(`[GIS] VWorld domain=${domain}: 피처 없음`);
                continue;
            }

            console.log(`[GIS] ✅ VWorld domain=${domain} → ${features.length}개 피처`);
            const buildings: RealBuilding[] = [];
            const seen = new Set<string>();

            for (const feature of features) {
                const props = feature.properties || {};
                const geom = feature.geometry;
                if (!geom) continue;

                const bdtypCd = props.bdtyp_cd || props.BDTYP_CD || '';
                const bdName = props.buld_nm || props.BULD_NM || props.name || '';
                const bdMgtSn = props.bd_mgt_sn || props.BD_MGT_SN || '';

                // 비건물 구조물 필터링 (가설, 교량 등)
                const excludeKeywords = ['교량', '고가교', '고가도로', '육교', '지하보도', '지하차도', '가로등', '전신주', '배수로', '캐노피', '가설건축물', '컨테이너'];
                if (excludeKeywords.some(k => bdName.includes(k))) continue;

                // VWorld의 BDTYP_CD는 '01000'(단독주택), '03000'(제1종근생), '14000'(업무시설) 등 5자리 문자열 형태일 수 있습니다.
                // 첫 2자리를 잘라서 대표 코드로 사용합니다.
                const mainCd = bdtypCd.length >= 2 ? bdtypCd.substring(0, 2) : bdtypCd;
                const bdtypNum = parseInt(mainCd, 10);
                
                // 25번 이상 코드는 기타 인프라 시설일 가능성이 높음
                if (!isNaN(bdtypNum) && bdtypNum >= 25 && bdtypNum > 0) continue;

                // 건물용도 정밀 분류
                let use: RealBuilding['use'] = 'residential';
                let color = BUILDING_USE_COLORS['residential'] || '#e2e8f0';
                let category = '주거/기타';

                if (bdName.includes('아파트') || mainCd === '02') { use = 'residential'; category = '아파트'; }
                else if (['03', '04', '07', '15', '16'].includes(mainCd) || bdName.includes('상가') || bdName.includes('마트')) { use = 'commercial'; color = BUILDING_USE_COLORS['commercial']; category = '상업/판매/숙박'; }
                else if (['10'].includes(mainCd) || bdName.includes('학교') || bdName.includes('대학')) { use = 'school'; color = '#c4b5fd'; category = '학교/교육'; }
                else if (['05', '06', '09', '11', '12', '13'].includes(mainCd) || bdName.includes('병원') || bdName.includes('교회')) { use = 'public'; color = '#93c5fd'; category = '공공/문화/종교'; }
                else if (['14'].includes(mainCd) || bdName.includes('관공서') || bdName.includes('센터') || bdName.includes('빌딩') || bdName.includes('회관')) { use = 'office'; color = BUILDING_USE_COLORS['office']; category = '업무시설'; }
                else if (['08', '17', '18', '21'].includes(mainCd) || bdName.includes('공장') || bdName.includes('창고') || bdName.includes('주차')) { use = 'industrial'; color = '#a8a29e'; category = '산업/운수/주차장'; }

                // 0층 건물 기본값 적용 (스킵하지 않음)
                let floors = parseInt(props.gro_flo_co || props.GRO_FLO_CO || '0', 10);
                let heightSource: 'register' | 'floors' | 'estimate' = 'floors';
                if (floors <= 0) {
                    floors = 1;
                    heightSource = 'estimate';
                }
                const height = floors * 3.0;

                let rawCoords: [number, number][];
                if (geom.type === 'MultiPolygon') rawCoords = geom.coordinates[0][0];
                else if (geom.type === 'Polygon') rawCoords = geom.coordinates[0];
                else continue;

                let cLng = 0, cLat = 0;
                let pMinX = Infinity, pMinY = Infinity, pMaxX = -Infinity, pMaxY = -Infinity;
                for (const [lng, lat] of rawCoords) {
                    cLng += lng; cLat += lat;
                    if (lng < pMinX) pMinX = lng; if (lng > pMaxX) pMaxX = lng;
                    if (lat < pMinY) pMinY = lat; if (lat > pMaxY) pMaxY = lat;
                }
                cLng /= rawCoords.length; cLat /= rawCoords.length;

                const key = `${cLng.toFixed(4)}_${cLat.toFixed(4)}`;
                if (seen.has(key)) continue;
                seen.add(key);

                const [localX, localZ] = wgs84ToLocalMeters([[cLng, cLat]], centerLng, centerLat)[0];
                const dist = Math.sqrt(localX * localX + localZ * localZ);

                // ─── [Fix 1] 10m 미만(대지 자체) 또는 500m 초과 건물 제외 ───
                if (dist < 10 || dist > radius) continue;

                const pts = wgs84ToLocalMeters([[pMinX, pMinY], [pMaxX, pMaxY]], cLng, cLat);
                const width = Math.abs(pts[1][0] - pts[0][0]) || 10;
                const depth = Math.abs(pts[1][1] - pts[0][1]) || 10;

                // ─── [Fix 4] 비정상적 형상 필터링 ───
                // 가로:세로 비율 검사 완화 (긴 상가 등 포함)
                const aspectRatio = Math.max(width, depth) / Math.min(width, depth);
                if (aspectRatio > 25) continue;

                // 면적이 너무 작은 구조물 제외 (4㎡ 미만 = 가로등 기둥 등)
                const buildingArea = width * depth;
                if (buildingArea < 4) continue;

                buildings.push({
                    id: `vw_${bdMgtSn || buildings.length}`,
                    name: bdName, category, categoryGroup: bdtypCd,
                    x: localX, z: localZ, lng: cLng, lat: cLat,
                    width: width * 0.9, depth: depth * 0.9,
                    height, floors, use, color, distance: dist,
                    polygon: wgs84ToLocalMeters(rawCoords, centerLng, centerLat),
                    heightSource,
                });
            }

            buildings.sort((a, b) => a.distance - b.distance);
            console.log(`[GIS] ✅ VWorld 건물 ${buildings.length}개 파싱 완료`);
            return buildings;
        } catch (e) {
            console.warn(`[GIS] VWorld 실패 (domain=${domain}):`, e);
            continue;
        }
    }

    console.warn(`[GIS] ⚠️ VWorld 모든 도메인 실패`);
    return [];
}

// ─── 4. 카카오 카테고리 검색으로 주변 실제 건물 조회 (Fallback) ───

// 카카오 카테고리 그룹코드
const CATEGORY_GROUPS = [
    { code: 'SC4', label: '학교', use: 'school' as const, height: 15, floors: 4, width: 40, depth: 30, color: '#c4b5fd' },
    { code: 'HP8', label: '병원', use: 'public' as const, height: 18, floors: 5, width: 35, depth: 25, color: '#fca5a5' },
    { code: 'PO3', label: '관공서', use: 'public' as const, height: 12, floors: 4, width: 25, depth: 20, color: '#93c5fd' },
    { code: 'BK9', label: '은행', use: 'commercial' as const, height: 9, floors: 3, width: 15, depth: 12, color: '#fde68a' },
    { code: 'MT1', label: '대형마트', use: 'commercial' as const, height: 12, floors: 3, width: 50, depth: 40, color: '#fdba74' },
    { code: 'CT1', label: '문화시설', use: 'public' as const, height: 15, floors: 4, width: 30, depth: 25, color: '#a5b4fc' },
    { code: 'AT4', label: '관광명소', use: 'public' as const, height: 9, floors: 2, width: 20, depth: 15, color: '#86efac' },
    { code: 'SW8', label: '지하철역', use: 'public' as const, height: 6, floors: 1, width: 20, depth: 15, color: '#c4b5fd' },
    { code: 'CE7', label: '카페', use: 'commercial' as const, height: 6, floors: 2, width: 10, depth: 8, color: '#fcd34d' },
    { code: 'CS2', label: '편의점', use: 'commercial' as const, height: 4, floors: 1, width: 8, depth: 6, color: '#d4d4d8' },
];

// 카카오 키워드 검색으로 아파트/주택 가져오기
const KEYWORD_SEARCHES = [
    { keyword: '아파트', use: 'residential' as const, height: 45, floors: 15, width: 50, depth: 15, color: '#e2e8f0' },
    { keyword: '빌라', use: 'residential' as const, height: 15, floors: 5, width: 12, depth: 10, color: '#e2e8f0' },
    { keyword: '오피스텔', use: 'mixed' as const, height: 36, floors: 12, width: 20, depth: 18, color: '#d4d4d8' },
    { keyword: '공장', use: 'industrial' as const, height: 10, floors: 2, width: 40, depth: 30, color: '#a8a29e' },
];

async function kakaoKeywordSearch(
    keyword: string,
    lng: number,
    lat: number,
    radius: number = 500
): Promise<any[]> {
    try {
        const url = `/kakao-api/v2/local/search/keyword.json?query=${encodeURIComponent(keyword)}&x=${lng}&y=${lat}&radius=${radius}&size=15&sort=distance`;
        const res = await fetch(url, {
            headers: { 'Authorization': `KakaoAK ${KAKAO_REST_KEY}` },
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.documents || [];
    } catch {
        return [];
    }
}

async function kakaoCategorySearch(
    categoryGroup: string,
    lng: number,
    lat: number,
    radius: number = 500
): Promise<any[]> {
    try {
        const url = `/kakao-api/v2/local/search/category.json?category_group_code=${categoryGroup}&x=${lng}&y=${lat}&radius=${radius}&size=15&sort=distance`;
        const res = await fetch(url, {
            headers: { 'Authorization': `KakaoAK ${KAKAO_REST_KEY}` },
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.documents || [];
    } catch {
        return [];
    }
}

export async function fetchSurroundingBuildings(
    centerLng: number,
    centerLat: number,
    radius: number = 200
): Promise<RealBuilding[]> {
    console.log(`[GIS] 주변 건물 검색 시작: (${centerLng}, ${centerLat}), 반경=${radius}m`);

    // 1단계: VWorld Data API 직접 건물 데이터 조회 (폴리곤)
    // (기존의 /massing-api WFS 프록시 호출은 모든 용도가 '주거'로 고정되는 한계가 있어 직결 API를 최우선으로 사용합니다)
    const vworldBuildings = await getVworldBuildings(centerLng, centerLat, radius);
    let buildingsToReturn = vworldBuildings;

    if (vworldBuildings.length > 0) {
        console.log(`[GIS] ✅ VWorld Data API에서 ${vworldBuildings.length}개 건물 로드 (순수 형태물)`);
        // ★ 2단계: 건축물대장 실측 높이 및 용도 보강
        buildingsToReturn = await enrichBuildingsWithRegisterHeight(vworldBuildings, centerLng, centerLat);
    }

    // 3단계: 카카오 검색을 통해 건물 용도 파악 안된 애들에게 용도 주입 및 VWorld 미존재 시 Fallback 사용
    console.log(`[GIS] 카카오 카테고리 검색을 통한 최종 보강...`);
    
    // 카카오 카테고리 검색 수행
    const categoryPromises = CATEGORY_GROUPS.map(async (cat) => {
        const docs = await kakaoCategorySearch(cat.code, centerLng, centerLat, radius);
        return { cat, docs };
    });
    
    const categoryResults = await Promise.all(categoryPromises);
    
    // Vworld 폴리곤 안에 속해있는지 검사하는 인하우스 함수
    const pointInPolygon = (point: [number, number], vs: [number, number][]) => {
        let x = point[0], y = point[1];
        let inside = false;
        for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            let xi = vs[i][0], yi = vs[i][1];
            let xj = vs[j][0], yj = vs[j][1];
            let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    };

    if (buildingsToReturn.length > 0) {
        // 이미 Vworld 로 조회된 건물이 있을 경우 Kakao 결과를 활용해 용도 보충
        let updatedCount = 0;
        for (const { cat, docs } of categoryResults) {
            for (const doc of docs) {
                const bLng = parseFloat(doc.x);
                const bLat = parseFloat(doc.y);
                const [localX, localZ] = wgs84ToLocalMeters([[bLng, bLat]], centerLng, centerLat)[0];
                
                // 어떤 건물의 폴리곤 안/바운딩 박스 안에 들어가는지 확인
                for (const b of buildingsToReturn) {
                    if (b.use !== 'residential' && b.use !== 'mixed') continue; // 이미 확실한 용도가 있으면 스킵
                    
                    if (b.polygon && b.polygon.length > 3) {
                        if (pointInPolygon([localX, localZ], b.polygon)) {
                            // 이 건물은 이 카테고리에 해당함
                            b.use = cat.use;
                            b.color = cat.color;
                            b.category = cat.label;
                            b.name = b.name || doc.place_name;
                            updatedCount++;
                            break;
                        }
                    } else {
                        // 박스 비교
                        const dist = Math.sqrt(Math.pow(b.x - localX, 2) + Math.pow(b.z - localZ, 2));
                        if (dist < Math.max(b.width, b.depth) / 2) {
                            b.use = cat.use;
                            b.color = cat.color;
                            b.category = cat.label;
                            b.name = b.name || doc.place_name;
                            updatedCount++;
                            break;
                        }
                    }
                }
            }
        }
        console.log(`[GIS] ✅ 카카오 데이터 기반으로 ${updatedCount}개 건물의 세부 용도(상업/학교 등) 업데이트 완료`);
        return buildingsToReturn;
    }

    // Vworld 건물이 전혀 없을 경우의 순수 Fallback 로직
    console.log(`[GIS] VWorld 건물 전혀 없음 → 순수 카카오 검색 Fallback 생성`);
    const fallbackBuildings: RealBuilding[] = [];
    const seen = new Set<string>();

    const fallbackCategoryPromises = CATEGORY_GROUPS.map(async (cat) => {
        const docs = await kakaoCategorySearch(cat.code, centerLng, centerLat, radius);
        return { cat, docs };
    });

    const fallbackKeywordPromises = KEYWORD_SEARCHES.map(async (kw) => {
        const docs = await kakaoKeywordSearch(kw.keyword, centerLng, centerLat, radius);
        return { kw, docs };
    });

    const fallbackCategoryResults = await Promise.all(fallbackCategoryPromises);
    const fallbackKeywordResults = await Promise.all(fallbackKeywordPromises);

    for (const { cat, docs } of fallbackCategoryResults) {
        for (const doc of docs) {
            const bLng = parseFloat(doc.x);
            const bLat = parseFloat(doc.y);
            const key = `${bLng.toFixed(5)}_${bLat.toFixed(5)}`;
            if (seen.has(key)) continue;
            seen.add(key);

            const [localX, localZ] = wgs84ToLocalMeters([[bLng, bLat]], centerLng, centerLat)[0];
            const dist = Math.sqrt(localX * localX + localZ * localZ);
            if (dist < 10) continue;

            const sizeFactor = 0.8 + Math.random() * 0.4;
            fallbackBuildings.push({
                id: `cat_${cat.code}_${doc.id || fallbackBuildings.length}`,
                name: doc.place_name || '',
                category: cat.label,
                categoryGroup: cat.code,
                x: localX,
                z: localZ,
                lng: bLng,
                lat: bLat,
                width: cat.width * sizeFactor,
                depth: cat.depth * sizeFactor,
                height: cat.height * (0.8 + Math.random() * 0.4),
                floors: cat.floors,
                use: cat.use,
                color: cat.color,
                distance: dist,
            });
        }
    }

    for (const { kw, docs } of fallbackKeywordResults) {
        for (const doc of docs) {
            const bLng = parseFloat(doc.x);
            const bLat = parseFloat(doc.y);
            const key = `${bLng.toFixed(5)}_${bLat.toFixed(5)}`;
            if (seen.has(key)) continue;
            seen.add(key);

            const [localX, localZ] = wgs84ToLocalMeters([[bLng, bLat]], centerLng, centerLat)[0];
            const dist = Math.sqrt(localX * localX + localZ * localZ);
            if (dist < 10) continue;

            const sizeFactor = 0.8 + Math.random() * 0.4;
            fallbackBuildings.push({
                id: `kw_${kw.keyword}_${doc.id || fallbackBuildings.length}`,
                name: doc.place_name || '',
                category: kw.keyword,
                categoryGroup: 'KW',
                x: localX,
                z: localZ,
                lng: bLng,
                lat: bLat,
                width: kw.width * sizeFactor,
                depth: kw.depth * sizeFactor,
                height: kw.height * (0.7 + Math.random() * 0.6),
                floors: kw.floors,
                use: kw.use,
                color: kw.color,
                distance: dist,
            });
        }
    }

    fallbackBuildings.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    console.log(`[GIS] ✅ 총 ${fallbackBuildings.length}개 실제 주변 건물 발견(Fallback)`);
    return fallbackBuildings;
}
