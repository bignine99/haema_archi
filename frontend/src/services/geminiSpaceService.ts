import { useProjectStore } from '@/store/projectStore';

const GEMINI_MODEL = 'gemini-2.5-flash-lite';

export interface AISpaceRoom {
    name: string;
    netArea: number;
    commonArea: number;
    isRequired: boolean;
}

export interface AISpaceZone {
    name: string;
    rooms: AISpaceRoom[];
}

export interface AISpaceFloor {
    floor: string;
    primaryUse: string;
    targetAgeGroup: string;
    height: number;
    zones: AISpaceZone[];
}

export interface SpaceConstraints {
    grossFloorArea: number;
    buildingFootprint: number;
    buildingCoverageLimit: number;
    floorAreaRatioLimit: number;
    totalFloors: number;
}

export async function generateSpaceProgramWithAI(
    constraints: SpaceConstraints,
    rawText: string
): Promise<AISpaceFloor[] | null> {
    try {
        const apiKey = useProjectStore.getState().geminiApiKey || import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            console.error('[Gemini Space] API 키가 입력되지 않았습니다.');
            throw new Error('설정에서 Gemini API 키를 입력하거나 .env(또는 webpack.config.js 환경변수)에 GEMINI_API_KEY를 설정해주세요.');
        }

        const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

        let docContext = rawText || "건축 설계 과업지시서 데이터가 없습니다.";
        // 입력 문자열 크기 제한 대폭 확대 (Gemini 2.5 Flash Lite는 1M 토큰 지원, 원문의 스페이스 프로그램 누락 방지)
        if (docContext.length > 500000) {
            docContext = docContext.substring(0, 250000) + '\n\n... (중간 생략) ...\n\n' + docContext.substring(docContext.length - 250000);
        }

    const prompt = `당신은 대한민국 최고의 건축 스페이스 프로그래머입니다.
아래 제공된 '건축 과업지시서'를 분석하여 층별 세부용도 및 면적표(Space Program)를 JSON 배열로 생성하세요.

★ [절대 준수 제약조건 - 수학적 검증 필수!!!]
1. 목표 연면적 (Gross Floor Area, GFA): ${constraints.grossFloorArea.toFixed(2)} ㎡
2. 모든 층의 (netArea + commonArea) 총합은 반드시 목표 연면적의 95% ~ 100% 사이(${ (constraints.grossFloorArea * 0.95).toFixed(0) }㎡ ~ ${constraints.grossFloorArea.toFixed(0)}㎡) 가 되도록 전체 잉여 면적을 남김없이 분배하세요!!! (매우 중요: 현재 ${constraints.grossFloorArea.toFixed(0)}㎡ 규모의 큰 건물을 설계 중인데 너무 작게 만들지 마세요.)
3. 법정 건폐율 기준: ${constraints.buildingCoverageLimit.toFixed(2)}%, 용적률: ${constraints.floorAreaRatioLimit.toFixed(2)}%
4. 단일 층의 합계 면적이 절대로 '최대 건축면적(Building Footprint)'인 ${constraints.buildingFootprint.toFixed(2)} ㎡를 초과하지 않는 선에서 층수를 분할하세요. 기준 층수: 약 ${constraints.totalFloors}개 층.
5. 공간 분배 원칙: 복도, 계단, 코어, 설비실, 지하 주차장 등 건축물에서 큰 비중을 차지하는 '공용면적(commonArea)'에 충분히 거대한 면적(예: 수백 ~ 수천 ㎡)을 할당하여 전체 연면적 목표를 반드시 달성하세요.
6. 만약 원문 데이터에 요구되는 스페이스가 구체적으로 나열되어 있다면, "절대로 임의로 통폐합(축약)하지 말고" 원문에 나온 모든 개별 실(Room) 단위(예: 교무실, 행정실, 교장실, 회의실, 방송실, 식당 등)를 생략 없이 최대한 자세하게 쪼개서 (층당 10~25개 내외) 생성하세요.
7. 면적을 큰 덩어리 1, 2개로 짐작해서 분배하지 말고, ${constraints.grossFloorArea.toFixed(0)}㎡ 수준의 대형 프로젝트임을 감안하여 단위 면적의 크기를 스케일에 맞게 분배하세요.

[층 및 면적 분배 가이드]
- "netArea"는 전용면적, "commonArea"는 공용면적입니다. (단위: ㎡)
- "isRequired"는 필수 설치 실 여부(true/false)입니다.
- 통상적으로 지하는 주차장/기계실 등이며, 1층은 관리/행정/로비, 그 위층은 주 사용처(교실 등)에 맞게 배치하세요.
- 총합이 ${constraints.grossFloorArea.toFixed(2)}㎡에 가까워질 때까지 리스트를 풍부하게 작성하세요.
- 각 층의 층고(height)는 용도에 맞게 지정하세요. (주차장 4.5m, 교육/일반실 3.9m 등)

[반환 형식 예시 (세부분류 강조)]
반드시 다음 구조의 순수 JSON 배열만 반환하세요 (마크다운 백틱 제외).
[
  {
    "floor": "B1F",
    "primaryUse": "주차/설비",
    "targetAgeGroup": "공통",
    "height": 4.5,
    "zones": [
       {
         "name": "지원 클러스터",
         "rooms": [
            { "name": "기계실", "netArea": 0, "commonArea": 200, "isRequired": true },
            { "name": "전기실", "netArea": 0, "commonArea": 150, "isRequired": true },
            { "name": "발전기실", "netArea": 0, "commonArea": 50, "isRequired": true }
         ]
       }
    ]
  },
  {
    "floor": "1F",
    "primaryUse": "행정 및 공용",
    "targetAgeGroup": "공통",
    "height": 4.2,
    "zones": [
       {
         "name": "행정 클러스터",
         "rooms": [
            { "name": "행정실", "netArea": 80, "commonArea": 20, "isRequired": true },
            { "name": "교장실", "netArea": 60, "commonArea": 10, "isRequired": true },
            { "name": "회의실", "netArea": 40, "commonArea": 5, "isRequired": true },
            { "name": "방송실", "netArea": 30, "commonArea": 0, "isRequired": true },
            { "name": "수유실", "netArea": 15, "commonArea": 0, "isRequired": false }
         ]
       }
    ]
  }
]

[과업지시서 원문 데이터]
${docContext}
`;

        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.2, // 보수적인 면적 계산 유도
                    maxOutputTokens: 8192, // 대규모 층별 세부 실 명세 생성을 위한 최대 토큰으로 상향
                    responseMimeType: 'application/json',
                }
            })
        });

        if (!response.ok) {
            console.error('[Gemini Space] API 호출 실패:', response.statusText);
            throw new Error(`AI 호출 실패: ${response.statusText}`);
        }

        const result = await response.json();
        let content = result?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!content) {
            throw new Error('응답에 텍스트가 없습니다.');
        }

        // Clean markdown backticks if any
        const match = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        const cleanContent = match ? match[1].trim() : content.trim();

        const parsed: AISpaceFloor[] = JSON.parse(cleanContent);
        return parsed;

    } catch (error) {
        console.error('[Gemini Space] 오류:', error);
        throw error;
    }
}
