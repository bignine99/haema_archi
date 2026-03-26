/**
 * GIS API Service - 카카오 + Vworld API 연동
 * 
 * 워크플로우:
 *   1. Kakao REST API: 주소 → 위경도(WGS84) + 법정동코드
 *   2. Vworld Data API: 좌표 → 지적도 필지 폴리곤(WKT/GeoJSON)
 *   3. 좌표 변환: WGS84(도) → 로컬 미터(m) → 3D 렌더링
 */

const KAKAO_REST_KEY = process.env.KAKAO_REST_KEY || '';
const VWORLD_API_KEY = process.env.VWORLD_API_KEY || '';
const BUILDING_REGISTER_API_KEY = process.env.BUILDING_REGISTER_API_KEY || '';

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
