/**
 * 토지이용규제정보 조례분석 서비스 v2
 * Python 백엔드 (포트 8010) /api/land-use 호출
 * 
 * 업데이트: 2026-03-19 — OrdinanceDetails, key_restrictions 추가
 */

export interface PnuInfo {
  pnu: string;
  address_full: string;
  b_code: string;
  sido: string;
  sigungu: string;
  dong: string;
}

export interface OrdinanceDetails {
  building_coverage: string;
  floor_area_ratio: string;
  height_limit: string;
  setback: string;
  parking: string;
  landscape: string;
  sunlight_regulation: string;
  permitted_uses: string[];
  prohibited_uses: string[];
}

export interface RegulationDetail {
  related_law: string;
  restriction_summary: string;
  design_impact: string;
  management_agency: string;
  key_restrictions: string[];
  ordinance_details: OrdinanceDetails | null;
}

export interface LandUseRegulationItem {
  pnu: string;
  regulation_name: string;
  regulation_code: string;
  regulation_type: string;
  building_coverage_rate: number | null;
  floor_area_ratio: number | null;
  law_name: string;
  article_name: string;
  restriction_content: string;
  management_agency: string;
  detail: RegulationDetail | null;
}

export interface LandUseRegulationResult {
  pnu_info: PnuInfo;
  total_count: number;
  regulations: LandUseRegulationItem[];
  zone_types: string[];
  max_building_coverage: number | null;
  max_floor_area_ratio: number | null;
  special_zones: string[];
  error: string | null;
}

/**
 * 주소로 토지이용규제 조례 분석
 */
export async function analyzeLandUse(address: string): Promise<LandUseRegulationResult> {
  const url = `/land-use-api/api/land-use?address=${encodeURIComponent(address)}`;
  
  console.log('[조례분석] 요청:', address);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`백엔드 서버(포트 8010) 연결 오류 또는 HTTP ${response.status}`);
    }
    
    const result: LandUseRegulationResult = await response.json();
  
    if (result.error) {
      throw new Error(`조례분석 오류: ${result.error}`);
    }
    
    console.log('[조례분석] 완료:', result.total_count, '건');
    return result;
  } catch (err: any) {
    if (err.message?.includes('Failed to fetch') || err.message?.includes('ECONNREFUSED')) {
      throw new Error('토지이용규제 백엔드 서비스(포트 8010)와 연결할 수 없습니다. \n' +
                '서버가 실행 중인지 확인해주세요 (명령어: npm run dev:landuse)');
    }
    throw err;
  }
}
