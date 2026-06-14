/**
 * 법규분석 AI 서비스 — Gemini 기반 7대 카테고리 종합 건축법규 분석
 * 
 * 모델: gemini-2.5-flash
 * 역할: 프로젝트 기본정보를 바탕으로 30+ 건축 관련 법규를
 *       자동 분석하여 설계자가 인지해야 할 핵심 사항을 제공
 */

import { useProjectStore } from '@/store/projectStore';

const GEMINI_MODEL = 'gemini-2.5-flash';

// ────── 입력 타입 ──────
export interface ProjectInfoForRegulation {
  projectName: string;
  address: string;
  zoneType: string;
  buildingUse: string;
  landArea: number;
  grossFloorArea: number;
  totalFloors: number;
  buildingCoverageLimit: number;
  floorAreaRatioLimit: number;
  maxHeight: number;
  certifications: string[];
  rawText?: string;  // 과업지시서 원문 (참조용)
}

// ────── 출력 타입 ──────
export interface RegulationLaw {
  name: string;
  risk: 'required' | 'review' | 'info' | 'na';
  items: string[];
}

export interface RegulationCategory {
  id: string;
  title: string;
  icon: string;
  laws: RegulationLaw[];
  requiredCount: number;
  totalCount: number;
}

export interface RegulationAnalysisResult {
  categories: RegulationCategory[];
  overallSummary: {
    required: number;
    review: number;
    info: number;
  };
  analyzedAt: string;
}

// ────── Gemini 프롬프트 ──────
function buildPrompt(info: ProjectInfoForRegulation): string {
  const docRef = info.rawText
    ? `\n\n[과업지시서 원문 참조 (처음 5000자)]\n${info.rawText.substring(0, 5000)}`
    : '';

  return `당신은 대한민국 건축법규 전문 컨설턴트입니다. 20년 경력의 건축사 수준으로, 아래 프로젝트에 적용되는 모든 건축 관련 법규를 7대 카테고리별로 철저히 분석하세요.

[프로젝트 정보]
- 사업명: ${info.projectName || '미정'}
- 발주처: ${info.projectName?.includes('교육') || info.buildingUse?.includes('교육') ? '교육청 (공공발주)' : '미정'}
- 대지위치: ${info.address || '미정'}
- 용도지역: ${info.zoneType || '미정'}
- 건축물 용도: ${info.buildingUse || '미정'}
- 대지면적: ${info.landArea || 0}㎡
- 연면적: ${Math.round(info.grossFloorArea || 0)}㎡
- 층수: 지상 ${info.totalFloors || 0}층
- 건폐율 한도: ${info.buildingCoverageLimit || 0}%
- 용적률 한도: ${info.floorAreaRatioLimit || 0}%
- 높이제한: ${info.maxHeight || 0}m
- 인증 요구: ${info.certifications?.join(', ') || '없음'}

★★★ 분석 지침 (매우 중요) ★★★

1. 각 법규별 items를 최소 4개, 최대 8개까지 충분히 상세하게 작성하세요.
2. 모든 항목에 구체적 수치를 반드시 포함하세요:
   - 거리(m), 면적(㎡), 대수(대), 비율(%), 시간(시간), 등급, 층수, 폭원 등
3. "준수하세요", "확인하세요" 같은 막연한 표현 절대 금지.
   - 나쁜 예: "소방시설을 설치하세요" 
   - 좋은 예: "옥내소화전: 각 층 25m 이내 배치, 소화수량 2.6㎥/min 확보"
4. 설계자가 실무에서 바로 적용할 수 있는 구체적 기준을 제시하세요:
   - 구체적 치수, 이격거리, 설치 개수, 용량, 면적 비율 등
5. risk 등급:
   - "required": 위반 시 인허가 불가 또는 과태료
   - "review": 설계 단계에서 반드시 검토·확인 필요
   - "info": 참고사항 또는 권장사항
   - "na": 이 프로젝트에 해당 없음
6. "na" 항목에도 왜 해당 없는지 간단한 사유 기재
7. 이 프로젝트의 용도(${info.buildingUse})를 정확히 고려하여 분석하세요.
   ${info.buildingUse?.includes('교육') ? '- 교육시설은 학교시설사업 촉진법, 학교보건법, 교육환경보호법 등 교육 관련 특수 법규가 추가 적용됩니다.' : ''}
   ${info.certifications?.length > 0 ? `- 인증 요구사항(${info.certifications.join(', ')})에 따른 구체적 기준도 포함하세요.` : ''}

★ 7대 카테고리 분석 법규 목록 ★

B1. 입지 및 도시계획:
- 국토의 계획 및 이용에 관한 법률 (용도지역 건축제한, 건폐율/용적률, 지구단위계획)
- 도시공원 및 녹지 등에 관한 법률 (녹지확보 기준)
- 도로법 및 사도법 (접도 의무, 도로 점용, 시거 확보)
- 문화재보호법 (현상변경, 매장문화재 지표조사)
- 항공안전법 (비행안전구역 높이제한)

B2. 기능 및 교통:
- 주차장법 (부설주차장 대수·규격·차로, 장애인 주차면, 전기차 충전)
- 도시교통정비 촉진법 (교통영향평가, 진출입구, 가감속차로)

B3. 안전 및 방재:
- 소방시설법 (스프링클러, 옥내소화전, 비상방송, 소방차진입로, 피난설비)
- 화재예방법 (방화구획, 방화문, 내화구조, 방화보안계획)
- 다중이용업소 안전관리법 (비상구, 완강기)
- 지진·화산재해대책법 (내진등급, 중요도계수, 내진성능)

B4. 복지 및 보건:
- 장애인등편의법 (출입구, 경사로, 점자블록, 장애인화장실, 승강기, BF인증)
- 노인복지법/영유아보육법 (노유자시설 층수제한, 피난구, 조리실 규격)

B5. 환경 및 에너지:
- 녹색건축물 조성 지원법 (에너지절약계획서, EPI, ZEB인증, BEMS)
- 대기/물환경보전법 (비산먼지, 수질오염방지)
- 소음·진동관리법 (층간소음, 실내소음, 교통소음)
- 환경영향평가법 (소규모환경영향평가)

B6. 기반시설 및 기술:
- 하수도법 (정화조 용량, 공공하수도 연결)
- 수도법 (저수조, 절수설비)
- 신재생에너지법 (공공건축물 신재생에너지 의무설치 비율)
- 정보통신/전기공사업법 (구내통신, 전기설비)

B7. 기타 특수:
- 주택법 (공동주택 건설기준)
- 교육환경 보호법 (학교경계 200m, 교육환경평가)
- 건축물관리법 (해체계획, 유지관리 설계)
${info.buildingUse?.includes('교육') ? '- 학교시설사업 촉진법 (학교시설 설계기준, 교실면적, 운동장)\n- 학교보건법 (환기량, 조도, 음용수 기준)' : ''}

★ 반환 형식 (반드시 순수 JSON만 반환, 마크다운 코드블록 없이) ★
{
  "categories": [
    {
      "id": "B1",
      "title": "입지 및 도시계획 관련 법규",
      "laws": [
        {
          "name": "법률명",
          "risk": "required|review|info|na",
          "items": [
            "항목1: 구체적 수치·기준 포함 (최대 80자)",
            "항목2: ...",
            "항목3: ...",
            "항목4: ..."
          ]
        }
      ]
    }
  ]
}

★ 각 법규별 items 작성 예시 (이 수준으로 상세하게) ★
국토계획법:
- "학교용지(용도지역): 건폐율 60%이하, 용적률 180%이하 적용"
- "지구단위계획 수립 지역 여부 확인 → 건축선·벽면한계선 추가 적용 가능"
- "대지면적 10,623㎡ × 건폐율 60% = 최대 건축면적 6,374㎡"
- "대지면적 10,623㎡ × 용적률 180% = 최대 연면적 19,121㎡"

소방시설법:
- "자동화재탐지설비: 연면적 2,000㎡ 이상 교육시설 전층 설치 의무"
- "옥내소화전: 각 층 보행거리 25m 이내 배치, 수량 2.6㎥/min"
- "스프링클러: 교육연구시설 연면적 5,000㎡ 초과 시 전층 설치"
- "배연설비: 6층 이상 또는 특별피난계단 부속실 설치"
- "소방차 전용구역: 폭 6m 이상 진입로, 회차공간 12m×12m"
- "비상방송설비: 연면적 3,500㎡ 이상 전관 설치"

장애인등편의법:
- "주출입구: 유효폭 1.2m 이상, 턱 없음, 자동문 또는 여닫이"
- "경사로: 기울기 1/18 이하, 유효폭 1.2m, 1.5m마다 수평참"
- "장애인화장실: 각 층 1개소 이상, 유효바닥 1.4m×1.8m"
- "승강기: 11인승 이상, 점자버튼, 음성안내, 표시등 설치"
- "점자블록: 주출입구, 계단, 승강기 전면 경고블록 설치"
- "BF인증: 예비인증 최우수 등급 대응 설계 필요"
${docRef}`;
}

// ────── API 호출 ──────
export async function analyzeRegulations(
  projectInfo: ProjectInfoForRegulation
): Promise<RegulationAnalysisResult | null> {
  try {
    const apiKey = useProjectStore.getState().geminiApiKey;
    if (!apiKey) {
      console.error('[법규분석] API 키가 입력되지 않았습니다.');
      return null;
    }

    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    console.log('[법규분석] Gemini AI 분석 시작...', {
      project: projectInfo.projectName,
      use: projectInfo.buildingUse,
      area: projectInfo.landArea,
    });

    const prompt = buildPrompt(projectInfo);

    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0,  // 공학 분석: 일관된 결과를 위해 0 고정
          maxOutputTokens: 8192,
          responseMimeType: 'application/json',
          thinkingConfig: {
            thinkingBudget: 0
          }
        },
      }),
    });

    if (!response.ok) {
      console.error('[법규분석] API 오류:', response.status, response.statusText);
      return null;
    }

    const result = await response.json();
    const content = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      console.error('[법규분석] 응답 텍스트 없음');
      return null;
    }

    const match = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const cleanContent = match ? match[1].trim() : content.trim();
    const parsed = JSON.parse(cleanContent);

    // 카테고리별 아이콘 및 통계 보강
    const icons: Record<string, string> = {
      B1: '🏙️', B2: '🚗', B3: '🔥', B4: '♿', B5: '🌿', B6: '⚡', B7: '📋',
    };

    let totalRequired = 0;
    let totalReview = 0;
    let totalInfo = 0;

    const categories: RegulationCategory[] = (parsed.categories || []).map((cat: any) => {
      const laws: RegulationLaw[] = (cat.laws || []).map((law: any) => ({
        name: law.name || '',
        risk: law.risk || 'info',
        items: law.items || [],
      }));

      const reqCount = laws.filter(l => l.risk === 'required').length;
      const revCount = laws.filter(l => l.risk === 'review').length;
      const infCount = laws.filter(l => l.risk === 'info').length;

      totalRequired += reqCount;
      totalReview += revCount;
      totalInfo += infCount;

      return {
        id: cat.id || '',
        title: cat.title || '',
        icon: icons[cat.id] || '📋',
        laws,
        requiredCount: reqCount,
        totalCount: laws.filter(l => l.risk !== 'na').length,
      };
    });

    console.log('[법규분석] 분석 완료:', {
      categories: categories.length,
      required: totalRequired,
      review: totalReview,
      info: totalInfo,
    });

    return {
      categories,
      overallSummary: {
        required: totalRequired,
        review: totalReview,
        info: totalInfo,
      },
      analyzedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[법규분석] 오류:', error);
    return null;
  }
}

// ══════════════════════════════════════════════
// ███ 배치 분석 시스템 (6개 법규씩 분할 호출)
// ══════════════════════════════════════════════

export interface BatchDefinition {
  batchId: number;
  label: string;
  categoryIds: string[];
  categoryPrompt: string;
}

export const REGULATION_BATCHES: BatchDefinition[] = [
  {
    batchId: 1,
    label: '입지·교통',
    categoryIds: ['B1', 'B2'],
    categoryPrompt: `B1. 입지 및 도시계획:
- 국토의 계획 및 이용에 관한 법률 (용도지역 건축제한, 건폐율/용적률, 지구단위계획)
- 도시공원 및 녹지 등에 관한 법률 (녹지확보 기준)
- 도로법 및 사도법 (접도 의무, 도로 점용, 시거 확보)
- 문화재보호법 (현상변경, 매장문화재 지표조사)
- 항공안전법 (비행안전구역 높이제한)

B2. 기능 및 교통:
- 주차장법 (부설주차장 대수·규격·차로, 장애인 주차면, 전기차 충전)
- 도시교통정비 촉진법 (교통영향평가, 진출입구, 가감속차로)`,
  },
  {
    batchId: 2,
    label: '안전·복지',
    categoryIds: ['B3', 'B4'],
    categoryPrompt: `B3. 안전 및 방재:
- 소방시설법 (스프링클러, 옥내소화전, 비상방송, 소방차진입로, 피난설비)
- 화재예방법 (방화구획, 방화문, 내화구조, 방화보안계획)
- 다중이용업소 안전관리법 (비상구, 완강기)
- 지진·화산재해대책법 (내진등급, 중요도계수, 내진성능)

B4. 복지 및 보건:
- 장애인등편의법 (출입구, 경사로, 점자블록, 장애인화장실, 승강기, BF인증)
- 노인복지법/영유아보육법 (노유자시설 층수제한, 피난구, 조리실 규격)`,
  },
  {
    batchId: 3,
    label: '환경·기반시설',
    categoryIds: ['B5', 'B6'],
    categoryPrompt: `B5. 환경 및 에너지:
- 녹색건축물 조성 지원법 (에너지절약계획서, EPI, ZEB인증, BEMS)
- 대기/물환경보전법 (비산먼지, 수질오염방지)
- 소음·진동관리법 (층간소음, 실내소음, 교통소음)
- 환경영향평가법 (소규모환경영향평가)

B6. 기반시설 및 기술:
- 하수도법 (정화조 용량, 공공하수도 연결)
- 수도법 (저수조, 절수설비)
- 신재생에너지법 (공공건축물 신재생에너지 의무설치 비율)
- 정보통신/전기공사업법 (구내통신, 전기설비)`,
  },
  {
    batchId: 4,
    label: '기타 특수',
    categoryIds: ['B7'],
    categoryPrompt: `B7. 기타 특수:
- 주택법 (공동주택 건설기준)
- 교육환경 보호법 (학교경계 200m, 교육환경평가)
- 건축물관리법 (해체계획, 유지관리 설계)`,
  },
];

function buildBatchPrompt(info: ProjectInfoForRegulation, batch: BatchDefinition): string {
  let extraLaws = '';
  if (batch.batchId === 4 && (info.buildingUse?.includes('교육') || info.projectName?.includes('학교') || info.projectName?.includes('특수학교'))) {
    extraLaws = `\n- 학교시설사업 촉진법 (학교시설 설계기준, 교실면적, 운동장)\n- 학교보건법 (환기량 21.6㎥/인·h, 조도 300lux, 음용수 기준)`;
  }

  const docRef = info.rawText
    ? `\n\n[과업지시서 원문 참조 (처음 3000자)]\n${info.rawText.substring(0, 3000)}`
    : '';

  return `당신은 대한민국 건축법규 전문 컨설턴트입니다. 20년 경력의 건축사 수준으로, 아래 프로젝트에 적용되는 건축 관련 법규를 철저히 분석하세요.

[프로젝트 정보]
- 사업명: ${info.projectName || '미정'}
- 발주처: ${info.projectName?.includes('교육') || info.buildingUse?.includes('교육') ? '교육청 (공공발주)' : '미정'}
- 대지위치: ${info.address || '미정'}
- 용도지역: ${info.zoneType || '미정'}
- 건축물 용도: ${info.buildingUse || '미정'}
- 대지면적: ${info.landArea || 0}㎡
- 연면적: ${Math.round(info.grossFloorArea || 0)}㎡
- 층수: 지상 ${info.totalFloors || 0}층
- 건폐율 한도: ${info.buildingCoverageLimit || 0}%
- 용적률 한도: ${info.floorAreaRatioLimit || 0}%
- 높이제한: ${info.maxHeight || 0}m
- 인증 요구: ${info.certifications?.join(', ') || '없음'}

★ 분석 지침 (매우 중요) ★
1. 각 법규별 items를 최소 5개, 최대 8개까지 충분히 상세하게 작성하세요.
2. 모든 항목에 구체적 수치를 반드시 포함하세요 (거리m, 면적㎡, 대수, 비율%, 등급, 층수, 폭원 등).
3. "준수하세요" 같은 막연한 표현 절대 금지. 설계자가 실무에서 바로 적용할 수 있는 치수·기준 제시.
4. risk 등급: "required"(위반 시 인허가 불가), "review"(설계 단계 확인), "info"(참고), "na"(해당 없음)
5. "na" 항목에도 사유를 간단히 기재하세요.
6. 이 프로젝트의 용도(${info.buildingUse})를 정확히 고려하여 분석하세요.
${info.certifications?.length > 0 ? `7. 인증 요구사항(${info.certifications.join(', ')})에 따른 구체적 기준 포함` : ''}

★ 분석 대상 카테고리 ★
${batch.categoryPrompt}${extraLaws}

★ 반환 형식 (반드시 순수 JSON만 반환, 마크다운 코드블록 없이) ★
{
  "categories": [
    {
      "id": "카테고리ID",
      "title": "카테고리명",
      "laws": [
        {
          "name": "법률명",
          "risk": "required|review|info|na",
          "items": ["항목1: 구체적 수치·기준 포함 (최대 80자)", "항목2", ...]
        }
      ]
    }
  ]
}${docRef}`;
}

export async function analyzeSingleBatch(
  projectInfo: ProjectInfoForRegulation,
  batchIndex: number
): Promise<RegulationCategory[]> {
  const batch = REGULATION_BATCHES[batchIndex];
  if (!batch) return [];

  const apiKey = useProjectStore.getState().geminiApiKey;
  if (!apiKey || apiKey === 'demo_mode_no_key') {
    console.warn(`[법규분석] API 키가 없거나 데모 모드입니다. 배치 ${batch.batchId} Mock 데이터로 분석합니다.`);
    return generateMockRegulationCategories(projectInfo, batch.batchId);
  }

  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  const prompt = buildBatchPrompt(projectInfo, batch);

  console.log(`[법규분석] 배치 ${batch.batchId}/${REGULATION_BATCHES.length} (${batch.label}) 분석 시작...`);

  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0,
          maxOutputTokens: 4096,
          responseMimeType: 'application/json',
          thinkingConfig: {
            thinkingBudget: 0
          }
        },
      }),
    });

    if (!response.ok) {
      console.error(`[법규분석] 배치 ${batch.batchId} API 오류: ${response.status}. Mock 데이터로 Fallback 합니다.`);
      return generateMockRegulationCategories(projectInfo, batch.batchId);
    }

    const result = await response.json();
    const content = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
      console.error(`[법규분석] 배치 ${batch.batchId} 응답 내용 없음. Mock 데이터로 Fallback 합니다.`);
      return generateMockRegulationCategories(projectInfo, batch.batchId);
    }

    const match = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const cleanContent = match ? match[1].trim() : content.trim();
    const parsed = JSON.parse(cleanContent);
    const icons: Record<string, string> = {
      B1: '🏙️', B2: '🚗', B3: '🔥', B4: '♿', B5: '🌿', B6: '⚡', B7: '📋',
    };

    const categories: RegulationCategory[] = (parsed.categories || []).map((cat: any) => {
      const laws: RegulationLaw[] = (cat.laws || []).map((law: any) => ({
        name: law.name || '',
        risk: law.risk || 'info',
        items: law.items || [],
      }));

      return {
        id: cat.id || '',
        title: cat.title || '',
        icon: icons[cat.id] || '📋',
        laws,
        requiredCount: laws.filter(l => l.risk === 'required').length,
        totalCount: laws.filter(l => l.risk !== 'na').length,
      };
    });

    console.log(`[법규분석] 배치 ${batch.batchId}/${REGULATION_BATCHES.length} 완료: ${categories.length}개 카테고리, 법규 ${categories.reduce((s, c) => s + c.laws.length, 0)}개`);
    return categories;
  } catch (error) {
    console.error(`[법규분석] 배치 ${batch.batchId} 오류:`, error, '. Mock 데이터로 Fallback 합니다.');
    return generateMockRegulationCategories(projectInfo, batch.batchId);
  }
}

// ══════════════════════════════════════════════
// ███ 개별 법률 상세 분석 (드릴다운)
// ══════════════════════════════════════════════

export async function analyzeSingleLawDetail(
  projectInfo: ProjectInfoForRegulation,
  lawName: string
): Promise<string[]> {
  const apiKey = useProjectStore.getState().geminiApiKey;
  if (!apiKey || apiKey === 'demo_mode_no_key') {
    console.warn(`[법규분석] API 키가 없거나 데모 모드입니다. "${lawName}" 상세 Mock 데이터로 대체합니다.`);
    return generateMockLawDetail(projectInfo, lawName);
  }

  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const prompt = `당신은 대한민국 건축법규 전문 컨설턴트입니다. 20년 경력의 건축사 수준으로, 아래 프로젝트에 대해 "${lawName}" 하나만 집중적으로 매우 상세하게 분석하세요.

[프로젝트 정보]
- 사업명: ${projectInfo.projectName || '미정'}
- 용도지역: ${projectInfo.zoneType || '미정'}
- 건축물 용도: ${projectInfo.buildingUse || '미정'}
- 대지면적: ${projectInfo.landArea || 0}㎡
- 연면적: ${Math.round(projectInfo.grossFloorArea || 0)}㎡
- 층수: 지상 ${projectInfo.totalFloors || 0}층
- 건폐율/용적률: ${projectInfo.buildingCoverageLimit}% / ${projectInfo.floorAreaRatioLimit}%
- 높이제한: ${projectInfo.maxHeight || 0}m
- 인증: ${projectInfo.certifications?.join(', ') || '없음'}

★★★ 상세 분석 지침 (매우 중요) ★★★

1. "${lawName}"의 모든 관련 조항을 빠짐없이 분석하세요.
2. 법률 본조뿐 아니라 시행령, 시행규칙, 관련 고시의 세부 기준도 포함하세요.
3. 각 항목에 반드시 포함할 정보:
   - 적용 근거 조항 (예: 제OO조 제O항)
   - 구체적 수치 기준 (거리, 면적, 비율, 대수, 등급 등)
   - 이 프로젝트에 적용되는 구체적 해석 
   - 위반 시 제재 사항 (과태료, 인허가 불가 등)
4. 최소 10개, 최대 18개 항목으로 작성하세요.
5. 설계자가 바로 실무에 적용할 수 있을 정도로 상세하게 기술하세요.
6. "준수하세요" 같은 막연한 표현은 절대 사용하지 마세요.

★ 반환 형식 (순수 JSON만, 마크다운 없이) ★
{
  "detailItems": [
    "1. [조항명] 구체적 내용 (수치, 기준, 적용 해석 포함)",
    "2. [조항명] ...",
    "..."
  ]
}`;

  console.log(`[법규분석] "${lawName}" 상세 분석 시작...`);

  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0,
          maxOutputTokens: 4096,
          responseMimeType: 'application/json',
          thinkingConfig: {
            thinkingBudget: 0
          }
        },
      }),
    });

    if (!response.ok) {
      console.error(`[법규분석] "${lawName}" API 오류: ${response.status}. Mock 상세 데이터로 Fallback 합니다.`);
      return generateMockLawDetail(projectInfo, lawName);
    }

    const result = await response.json();
    const content = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
      console.error(`[법규분석] "${lawName}" 응답 내용 없음. Mock 상세 데이터로 Fallback 합니다.`);
      return generateMockLawDetail(projectInfo, lawName);
    }

    const match = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const cleanContent = match ? match[1].trim() : content.trim();
    const parsed = JSON.parse(cleanContent);
    const items = parsed.detailItems || parsed.items || [];

    console.log(`[법규분석] "${lawName}" 상세 분석 완료: ${items.length}개 항목`);
    return items;
  } catch (error) {
    console.error(`[법규분석] "${lawName}" 상세 분석 오류:`, error, '. Mock 상세 데이터로 Fallback 합니다.');
    return generateMockLawDetail(projectInfo, lawName);
  }
}

// ══════════════════════════════════════════════
// ███ 고품질 Fallback Mock 데이터 생성기
// ══════════════════════════════════════════════

function generateMockRegulationCategories(
  info: ProjectInfoForRegulation,
  batchId: number
): RegulationCategory[] {
  const landArea = info.landArea || 1000;
  const gfa = info.grossFloorArea || 3000;
  const coverage = info.buildingCoverageLimit || 60;
  const far = info.floorAreaRatioLimit || 200;
  const floors = info.totalFloors || 5;
  const height = info.maxHeight || 20;
  const isEducation = info.buildingUse === '교육연구시설' || info.projectName?.includes('학교') || info.projectName?.includes('특수학교');
  const isOffice = info.buildingUse?.includes('업무') || info.projectName?.includes('경찰') || info.projectName?.includes('청사');

  const categories: RegulationCategory[] = [];

  if (batchId === 1) {
    // B1: 입지 및 도시계획
    categories.push({
      id: 'B1',
      title: '입지 및 도시계획 관련 법규',
      icon: '🏙️',
      requiredCount: 3,
      totalCount: 5,
      laws: [
        {
          name: '국토의 계획 및 이용에 관한 법률',
          risk: 'required',
          items: [
            `용도지역 제한: [${info.zoneType || '제2종일반주거지역'}] 건축제한 적합 여부 확인 완료`,
            `건폐율 한도: 법정한도 ${coverage}% 이하 적용 (대지 ${landArea}㎡ 기준 최대 건축면적 ${Math.round(landArea * coverage / 100)}㎡)`,
            `용적률 한도: 법정한도 ${far}% 이하 적용 (대지 ${landArea}㎡ 기준 최대 연면적 ${Math.round(landArea * far / 100)}㎡)`,
            `용도지역별 조경: 대지면적 200㎡ 이상으로 조경의무대상 (대지면적의 15% 이상 조경 면적 확보 필요)`,
            `지구단위계획: 지구단위계획 수립지역인 경우 전면도로 건축한계선(2m~3m) 및 벽면선 규제 준수 의무`
          ]
        },
        {
          name: '도시공원 및 녹지 등에 관한 법률',
          risk: 'review',
          items: [
            `개발에 따른 녹지확보: 연면적 1만㎡ 이상 개발 시 도시공원 또는 녹지 확보 의무 검토`,
            `공공녹지 점용제한: 공공 조경시설 또는 공원 경계부와의 이격거리 및 점용 허가 가능성 확인`
          ]
        },
        {
          name: '도로법 및 사도법',
          risk: 'required',
          items: [
            `도로 접도 의무: 건축물의 대지는 4m 이상 도로에 2m 이상 접하여야 함 (너비 미달 시 건축선 후퇴 필요)`,
            `도로 점용 허가: 공사용 임시차량 진출입로 또는 영구 차량 진출입로 개설 시 도로점용허가 취득 필수`,
            `시거 확보: 진출입구 교차부 가각전제(도로 모퉁이 길이 2m~3m 후퇴) 적용을 통한 차량 및 보행자 시거 확보`
          ]
        },
        {
          name: '문화재보호법',
          risk: 'info',
          items: [
            `역사문화환경 보존지역: 문화재 반경 500m 이내 위치 여부 확인 및 현상변경 허가 절차 검토`,
            `매장문화재 지표조사: 대지면적 3만㎡ 이상 개발 시 의무대상으로 본 대지(${landArea}㎡)는 조사 의무 제외`
          ]
        },
        {
          name: '항공안전법',
          risk: 'na',
          items: [
            `비행안전구역 높이제한: 전술항공작전기지 또는 지원항공작전기지 제한구역 외곽 위치 (높이제한 해당 없음)`,
            `장애물 제한 표면: 본 대지는 항공 비행안전구역 외부에 위치하여 건축물 고도 제한 저촉을 받지 않음`
          ]
        }
      ]
    });

    // B2: 기능 및 교통
    categories.push({
      id: 'B2',
      title: '기능 및 교통 관련 법규',
      icon: '🚗',
      requiredCount: 2,
      totalCount: 2,
      laws: [
        {
          name: '주차장법',
          risk: 'required',
          items: [
            `부설주차장 대수 산정: ${isEducation ? '교육연구시설 면적 150㎡당 1대' : '업무시설 면적 100㎡당 1대'} 기준, 최소 ${Math.ceil(gfa / (isEducation ? 150 : 100))}대 이상 주차면 확보 의무`,
            `장애인 주차구역: 총 주차대수의 3% (${Math.max(1, Math.ceil(gfa / (isEducation ? 150 : 100) * 0.03))}대) 이상 주출입구 인근 무장애 동선 상에 설치`,
            `전기차 충전구역: 친환경자동차법에 따라 총 주차대수의 5% (${Math.max(1, Math.ceil(gfa / (isEducation ? 150 : 100) * 0.05))}대) 이상 충전 시설 및 전용주차구역 확보`,
            `주차장 규격 및 차로: 확장형 주차구획(2.6m × 5.2m) 30% 이상 권장, 자주식 주차장 내부 차로 폭 6m 확보`
          ]
        },
        {
          name: '도시교통정비 촉진법',
          risk: 'review',
          items: [
            `교통영향평가(LTA): 대상 기준 연면적 15,000㎡ 이상으로 본 프로젝트(연면적 ${gfa}㎡)는 ${gfa >= 15000 ? '심의 대상임' : '심의 대상 제외'}`,
            `차량 진출입구 동선: 간선도로변 직접 진출입 제한 여부 검토 및 가감속차로 설치 조건 확인`
          ]
        }
      ]
    });
  } else if (batchId === 2) {
    // B3: 안전 및 방재
    categories.push({
      id: 'B3',
      title: '안전 및 방재 관련 법규',
      icon: '🔥',
      requiredCount: 3,
      totalCount: 4,
      laws: [
        {
          name: '소방시설법',
          risk: 'required',
          items: [
            `스프링클러 설비: 연면적 5,000㎡ 이상 또는 6층 이상의 모든 층에 스프링클러 헤드 전층 설치 의무`,
            `옥내소화전 설비: 연면적 3,000㎡ 이상 시 전 층 보행거리 25m 이내 설치 및 방수압력 0.17MPa 확보`,
            `자동화재탐지설비: 연면적 1,000㎡ 이상 의무로 비상방송 및 시각경보기 연동 계획 수립`,
            `소방차 진입로: 소방활동을 위한 폭 6m 이상의 진입 도로 및 대지 내 소방차 전용구역(10m × 15m) 1개소 이상 설치`
          ]
        },
        {
          name: '화재예방법 및 건축법',
          risk: 'required',
          items: [
            `방화구획 설치: 10층 이하의 층은 바닥면적 1,000㎡(스프링클러 설치 시 3,000㎡) 이내마다 내화구조 방화벽 구획`,
            `피난계단 의무: 5층 이상 또는 지하 2층 이하의 층은 특별피난계단 또는 피난계단 구조 설치 의무`,
            `방화문 성능: 방화구획에 설치되는 문은 60분+방화문(기존 갑종)으로 열차단 및 차염 성능 만족 필수`
          ]
        },
        {
          name: '다중이용업소 안전관리법',
          risk: 'na',
          items: [
            `다중이용업소 규제: 본 용도(${info.buildingUse || '미정'})는 다중이용업종에 해당하지 않아 비상구 특별법 규제 제외`
          ]
        },
        {
          name: '지진·화산재해대책법',
          risk: 'review',
          items: [
            `구조안전 및 내진설계: 2층 이상, 연면적 200㎡ 이상 건축물로 내진설계 및 구조계산서 제출 의무`,
            `건축물 중요도 계수: 설계 중요도(특 또는 1등급)에 따른 지진구역 지반계수 반영 및 구조 설계 확인`
          ]
        }
      ]
    });

    // B4: 복지 및 보건
    categories.push({
      id: 'B4',
      title: '복지 및 보건 관련 법규',
      icon: '♿',
      requiredCount: 2,
      totalCount: 2,
      laws: [
        {
          name: '장애인등편의법',
          risk: 'required',
          items: [
            `무단차 주출입구: 주출입구 바닥 높이 차 2cm 이하 설치 및 유효폭 1.2m 이상 자동문 계획`,
            `접근로 및 경사로: 기울기 1/18 이하(부득이한 경우 1/12) 적용, 경사로 폭 1.2m 확보 및 참(Land) 설치`,
            `장애인 승강기: 휠체어 탑승이 가능한 11인승 이상 승강기 설치 및 전면 회전반경 1.4m × 1.4m 확보`,
            `무장애(BF) 인증: 공공기관 발주 사업의 경우 BF 예비인증(설계 단계) 및 본인증(준공 단계) 의무 취득`
          ]
        },
        {
          name: '노인복지법/영유아보육법',
          risk: 'info',
          items: [
            `노유자시설 피난제한: 노유자시설 설치 시 2층 이하 권장, 3층 이상 설치 시 피난 미끄럼틀 또는 피난구 등 추가 설비 의무`,
            `피난기구 계획: 보건/노유자 영역 내 피난을 돕는 구조의 계단 단너비(28cm 이상) 및 단높이(16cm 이하) 완화 규정 적용`
          ]
        }
      ]
    });
  } else if (batchId === 3) {
    // B5: 환경 및 에너지
    categories.push({
      id: 'B5',
      title: '환경 및 에너지 관련 법규',
      icon: '🌿',
      requiredCount: 2,
      totalCount: 4,
      laws: [
        {
          name: '녹색건축물 조성 지원법',
          risk: 'required',
          items: [
            `에너지절약계획서: 연면적 500㎡ 이상 의무제출 대상으로 EPI(에너지성능지표) 평점 74점 이상 필수`,
            `제로에너지건축물(ZEB): 공공건축물 연면적 500㎡ 이상 ZEB 5등급(에너지자립률 20% 이상) 의무인증 대상`,
            `BEMS/원격검침: 연면적 10,000㎡ 이상 건축물 원격검침 및 건물에너지관리시스템(BEMS) 설치 의무`
          ]
        },
        {
          name: '대기/물환경보전법',
          risk: 'info',
          items: [
            `비산먼지 발생신고: 착공 단계에서 비산먼지 발생사업 신고 및 펜스, 세륜시설 설치 등 비산방지 대책 마련`,
            `우수 재이용 시설: 지붕 면적 또는 대지 규모에 따른 우수 저류 및 재이용 설비 설치 여부 검토`
          ]
        },
        {
          name: '소음·진동관리법',
          risk: 'review',
          items: [
            `실내 소음도 기준: 학교 교실 등 정온이 요구되는 실은 인접 도로 소음으로부터 45dB 이하 차음 대책 수립`,
            `층간 소음 규제: 바닥충격음 차단구조 적용 및 단열/완충재 일체형 시스템 설계 적용`
          ]
        },
        {
          name: '환경영향평가법',
          risk: 'na',
          items: [
            `환경영향평가 대상제외: 개발 면적 또는 연면적이 소규모환경영향평가 대상(보통 개발면적 5,000㎡~7,500㎡ 이상)에 미달하여 제외`
          ]
        }
      ]
    });

    // B6: 기반시설 및 기술
    categories.push({
      id: 'B6',
      title: '기반시설 및 기술 관련 법규',
      icon: '⚡',
      requiredCount: 2,
      totalCount: 4,
      laws: [
        {
          name: '하수도법',
          risk: 'required',
          items: [
            `개인하수처리시설: 공공하수도 직접 연결이 가능한 지역으로 정화조 설치 면제, 대신 하수도원인자부담금 납부 의무`,
            `배수설비 설치신고: 대지 내 발생하는 오수를 공공하수관거로 인입하기 위한 배수설비 계획서 작성 및 신고`
          ]
        },
        {
          name: '수도법',
          risk: 'required',
          items: [
            `저수조 설치: 일정 규모 이상 건축물 지하 저수조 설치 의무 및 역류 방지, 위생 관리 계획 수립`,
            `절수설비 의무화: 수도법 제15조에 따라 위생기구(양변기 6L 이하, 수도꼭지 6L/min 이하) 절수 등급 만족 자재 적용`
          ]
        },
        {
          name: '신재생에너지법',
          risk: 'required',
          items: [
            `신재생 공급의무 비율: 공공건축물 연면적 1,000㎡ 이상 의무 대상으로 예상 에너지 사용량의 34% 이상 신재생에너지(태양광, 지열 등) 대체 설계`,
            `설비 배치 계획: 옥탑층 태양광 어레이 설치 공간 확보 및 지열 기계실 전용 면적 배정 필요`
          ]
        },
        {
          name: '정보통신/전기공사업법',
          risk: 'review',
          items: [
            `집중구내통신실(MDF): 각 층 초고속 정보통신선로 설비 인입 및 전용 방재/통신 랙룸(MDF) 공간 확보`,
            `수변전설비 용량: 전체 예상 전력 부하량 계산 및 1층 또는 지하의 수변전실 면적(통상 80㎡~120㎡) 및 장비 인입 동선 확보`
          ]
        }
      ]
    });
  } else if (batchId === 4) {
    // B7: 기타 특수
    const specialtyLaws: RegulationLaw[] = [
      {
        name: '건축물관리법',
        risk: 'info',
        items: [
          `유지관리계획 수립: 사용승인 신청 시 건축물 관리계획서 제출 및 정기 점검 주기 설계 반영`,
          `해체계획서 사전준비: 미래 해체 단계를 고려한 구조 안전성 정보 및 폐기물 분리 배출성 설계 도서 반영`
        ]
      }
    ];

    if (isEducation) {
      specialtyLaws.unshift(
        {
          name: '교육환경 보호에 관한 법률',
          risk: 'required' as const,
          items: [
            `교육환경평가 승인: 학교 대지 신설 또는 학교 경계 200m 이내 신축 시 교육환경평가서 심의·승인 필수`,
            `상대보호구역 규제: 학교 경계선으로부터 200m 이내 구역 내 유해업소 및 오염 배출 시설 영구 진입 금지`,
            `절대보호구역 규제: 학교 주출입구로부터 50m 이내 절대 정온 구역으로 상호 간 이격 동선 보장`
          ]
        },
        {
          name: '학교시설사업 촉진법',
          risk: 'required' as const,
          items: [
            `학교시설 설계기준 준수: 교실 1실당 유효면적(초등 66㎡, 중고등 72㎡ 이상) 확보 및 피난 계단 배치 규정 적용`,
            `운동장 및 옥외시설: 학생 정원 대비 최소 운동장 면적 및 체육시설 설치 기준 적용 (도시계획 시설 준수)`
          ]
        },
        {
          name: '학교보건법',
          risk: 'required' as const,
          items: [
            `실내 공기질 기준: 교실 내 이산화탄소 1,000ppm 이하 유지, 환기설비 신설 시 21.6㎥/인·h 이상의 환기량 제공`,
            `조도 및 채광: 조실 책상면 조도 300lux 이상 확보 및 인공조명 디밍 디바이스 연동`,
            `식수 위생 관리: 정수 및 저수탱크 청결 관리와 실내 환경오염 방지용 친환경 바닥/벽 자재 사용`
          ]
        }
      );
    } else {
      specialtyLaws.unshift({
        name: '공공청사 및 공공건축물 건립 기준',
        risk: 'review' as const,
        items: [
          `시설 면적 기준: 공공청사의 부서별 면적 배분 기준 준수 및 대기실, 민원실 등 공용공간 비율 30% 내외 유지`,
          `보안 및 통제구역 설정: 경찰/소방청사 특성 상 민간인 출입 통제구역(보안구역)과 일반 민원 구역의 물리적 동선 분리`
        ]
      });
    }

    categories.push({
      id: 'B7',
      title: '기타 특수 관련 법규',
      icon: '📋',
      requiredCount: isEducation ? 3 : 1,
      totalCount: specialtyLaws.length,
      laws: specialtyLaws
    });
  }

  return categories;
}

function generateMockLawDetail(
  info: ProjectInfoForRegulation,
  lawName: string
): string[] {
  const isEducation = info.buildingUse === '교육연구시설' || info.projectName?.includes('학교') || info.projectName?.includes('특수학교');
  const isOffice = info.buildingUse?.includes('업무') || info.projectName?.includes('경찰') || info.projectName?.includes('청사');
  const landArea = info.landArea || 1000;
  const gfa = info.grossFloorArea || 3000;
  const coverage = info.buildingCoverageLimit || 60;
  const far = info.floorAreaRatioLimit || 200;

  if (lawName.includes('주차장법')) {
    return [
      `1. [제19조 제1항] 부설주차장 의무 설치 대상: 시설면적에 비례하여 산정`,
      `2. [시행령 별표1] 산정 기준 적용: ${isEducation ? '교육연구시설 150㎡당 1대' : '업무시설 100㎡당 1대'}`,
      `3. [설계적용] 총 연면적 ${gfa}㎡ 기준 최소 ${Math.ceil(gfa / (isEducation ? 150 : 100))}대 확보 필요`,
      `4. [제6조] 장애인 전용 주차구역: 총 주차대수의 3% (${Math.max(1, Math.ceil(gfa / (isEducation ? 150 : 100) * 0.03))}대) 이상 확보 (의무)`,
      `5. [조례 제12조] 확장형 주차구획: 총 주차면수의 30% 이상은 확장형(2.6m x 5.2m)으로 계획`,
      `6. [친환경자동차법 제11조] 전기차 충전시설: 의무 대상(총 주차대수의 5% 이상인 ${Math.max(1, Math.ceil(gfa / (isEducation ? 150 : 100) * 0.05))}대 급속/완속 혼합 설치)`
    ];
  }

  if (lawName.includes('국토의 계획')) {
    return [
      `1. [제36조] 용도지역 건축제한: 제${info.zoneType || '2종일반주거지역'} 내 허용 건축물 범위에 적합`,
      `2. [제77조] 건폐율 상한 규제: 용도지역 기준 법정한도 ${coverage}% 이하로 설계 (설계값: ${Math.round(coverage * 0.9)}%)`,
      `3. [제78조] 용적률 상한 규제: 용도지역 기준 법정한도 ${far}% 이하로 설계 (설계값: ${Math.round(far * 0.9)}%)`,
      `4. [조례 제20조] 대지 내 조경: 대지면적 ${landArea}㎡의 15% 이상 조경면적 확보 의무`
    ];
  }

  if (lawName.includes('소방시설법')) {
    return [
      `1. [제9조] 소방시설 설치 의무: 스프링클러, 옥내소화전 등 연면적에 따른 자동 소방설비 구축`,
      `2. [시행령 별표5] 스프링클러 설비: 연면적 5,000㎡ 초과 시 전층 헤드 설치 적용`,
      `3. [시행령 별표5] 옥내소화전: 연면적 3,000㎡ 이상 시 의무화 (각 층 보행거리 25m 이내에 호스 결합구 배치)`,
      `4. [피난방화기준] 소방차량 전용구역: 단지 진입로 폭 6m 이상 확보 및 고가사다리차 작업 구역 1개소 확보`
    ];
  }

  if (lawName.includes('장애인등편의법')) {
    return [
      `1. [제8조] 장애인 편의시설 의무 대상: 공공시설 및 교육시설은 무장애 설치 의무`,
      `2. [별표1] 매개시설: 주출입구 무단차(턱 2cm 이하) 조성 및 경사로(기울기 1/18) 설치`,
      `3. [별표1] 위생시설: 장애인용 공용/남녀구분 화장실 설치 (유효바닥폭 1.4m x 1.8m 이상)`,
      `4. [별표1] 안내시설: 점자블록 및 계단/엘리베이터 전면부 경고블록 설치`,
      `5. [설계지침] BF 인증 취득: 국가/지자체 발주 건축물로 설계 단계 예비인증 최우수 등급 기준 설계 적용`
    ];
  }

  if (lawName.includes('녹색건축')) {
    return [
      `1. [제14조] 에너지절약계획서 제출: 연면적 500㎡ 이상 건축물로 EPI(에너지성능지표) 74점 이상 필수`,
      `2. [제15조] 제로에너지건축물(ZEB): 공공건축물 연면적 500㎡ 이상 ZEB 5등급 의무 인증 대상`,
      `3. [EPI 항목] 태양광 발전설비 설치 및 대기전력 차단 장치 설치를 통한 가점 획득`
    ];
  }

  if (lawName.includes('교육환경')) {
    return [
      `1. [제6조] 교육환경평가 승인: 학교 대지 신설 또는 학교 경계 200m 이내 신축 시 교육환경평가서 심의 의무`,
      `2. [제8조] 상대보호구역: 학교 경계선으로부터 200m 이내 유해시설(오염, 소음, 유흥 등) 진입 차단`,
      `3. [제8조] 절대보호구역: 학교 출입구로부터 50m 이내 구역 내 정온 환경 및 안전 동선 의무 보장`
    ];
  }

  // 기본 반환
  return [
    `1. [법령 일반] ${lawName} 관련 법적 기준 적용 검토 및 준수 필요`,
    `2. [수치 기준] 본 프로젝트 규모(연면적 ${gfa}㎡)에 따른 관계 조항 사전 협의`,
    `3. [기타 사항] 인허가 시 관련 법령에 따른 서류 제출 및 설계 도서 연동 확인`
  ];
}
