import { useProjectStore } from '@/store/projectStore';

const GEMINI_MODEL = 'gemini-2.5-flash';

export interface ConceptSolution {
  spec: string;
  type: string;
}

export interface StrategicPillar {
  name: string;
  description: string;
  solutions: ConceptSolution[];
}

export interface GeneratedConcept {
  id: string; // for internal mapping
  vibe: string;
  philosophy: string;
  pillars: StrategicPillar[];
}

export interface DesignConceptSetResult {
  concepts: GeneratedConcept[];
}

export async function generateDesignConcepts(vibes: string[]): Promise<DesignConceptSetResult | null> {
  const store = useProjectStore.getState();
  const apiKey = store.geminiApiKey;

  if (!apiKey) {
    console.error('[발생 오류] API API 키가 입력되지 않았습니다.');
    throw new Error('API 키가 없습니다.');
  }

  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  // 프로젝트 메타데이터 바인딩
  const projectType = store.buildingUse || '건축물';
  const grossFloorArea = Math.round(store.grossFloorArea || 0).toLocaleString();
  const address = store.address || '위치 미지정';

  // 동적으로 사용할 Vibe 리스트를 포맷
  const vibeString = vibes.length > 0 ? vibes.join(', ') : '포괄적(General)';

  // 프롬프트 작성
  const prompt = `당신은 대한민국 최고의 건축 설계 전략가(Chief Design Officer)이자 기획자입니다.
현재 프로젝트 정보는 다음과 같습니다:
- 프로젝트 용도: ${projectType}
- 연면적: ${grossFloorArea}㎡
- 대지위치: ${address}

사용자가 선택한 디자인 Vibe(분위기 및 지향점)는 다음과 같습니다: [${vibeString}]

이 프로젝트에 완벽히 부합하는 3단계 논리 구조(Philosophy -> Strategic Pillars -> Detailed Solutions)를 갖춘 혁신적인 건축 설계 컨셉을 설계하세요.
총 3개의 개별적이고 서로 차별화되는 컨셉(Concept)을 생성하세요.

[매혹적인 문구 작성을 위한 3대 원칙]
1. 추상적 가치의 시각화 (Metaphor): 단순히 연결한다가 아니라 구체적 비유(예: 숲의 숨결, 성장의 궤적)를 사용하세요.
2. 역설적 결합 (Paradox): 상반된 가치를 결합해 설계 난이도와 창의성을 증명하세요 (예: 닫힌 대지 속 열린 오아시스).
3. 사용자 중심의 서사 (Narrative): 사용자(아이, 교사, 직장인, 방문객, 지역주민 등)의 움직임, 시선, 일상이 묘사된 살아있는 스토리텔링을 곁들이세요.

[요구사항]
1. 1단계 메인 테마 (Philosophy): 프로젝트의 정체성을 압축해 심사위원을 단숨에 매료시키는 철학적 서사가 담긴 강력한 슬로건.
   (예: "감각의 숲, 일상을 깨우는 숨쉬는 캠퍼스", "보이지 않는 기술, 가장 따뜻한 배려가 되다")
2. 2단계 전략적 기둥 (Strategic Pillars): 메인 테마를 실현하는 3가지 설계 공간/시스템 방향. 기능 모음이 아니라 공간에 생명력을 주는 시적이고 직관적인 명명(예: "공유의 거점: 문턱 낮은 웰컴 로비", "안전의 기술: 사고를 미리 읽는 스마트 코어"). description에는 반드시 사용자 행동과 서사를 1~2문장으로 녹여내세요.
3. 3단계 세부 솔루션 (Detailed Solutions): 서사를 뒷받침하여 신뢰를 주는 압도적이고 구체적인 "엔지니어링/물리적 지표"를 2개씩 포함.
   (예: 연면적의 15% 이상을 지역 개방형 다목적 라운지로 할애, 보행폭 3.3m 확보로 병목 현상 제로화, 66인승 대형 엘리베이터 2대, 실내 소음 35dB 이하 등 프로젝트 용도에 맞게 적용)

반드시 아래 JSON 형식으로만 반환하고 다른 마크다운이나 텍스트를 포함하지 마세요. (JSON 속성은 정확히 지켜주세요)
{
  "concepts": [
    {
      "vibe": "선택된 Vibe 매칭 (예: 인간 중심형)",
      "philosophy": "메인 테마 슬로건 (1문장)",
      "pillars": [
        {
          "name": "기둥 이름 (예: 성장과 보호의 Core Hub)",
          "description": "기둥의 철학적, 공간적 설명 (1~2문장)",
          "solutions": [
            { "spec": "구체적인 엔지니어링 지표나 설계 기준 (단수형 문장)", "type": "접근성 / 에너지 / 공간효율 등" },
            { "spec": "두 번째 세부 솔루션", "type": "카테고리" }
          ]
        }
      ]
    }
  ]
}

주의사항:
- 각 Concept 당 pillars는 정확히 3개 생성하세요.
- 각 pillar별로 solutions는 2개씩 생성하세요. (구체적 수치 포함 필수)
- JSON 구문 에러가 없도록 큰따옴표 이스케이프에 주의하세요.
`;

  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
            temperature: 0.8, // 다양성을 위해 온도를 약간 높임
            maxOutputTokens: 8192,
            responseMimeType: 'application/json',
            thinkingConfig: {
                thinkingBudget: 0
            }
        },
      }),
    });

    if (!response.ok) {
        if (response.status >= 500) {
            throw new Error(`구글 Gemini 서버 일시 오류입니다(${response.status}). 다시 시도해 주세요.`);
        }
        throw new Error(`API 호출 실패: ${response.status}`);
    }

    const data = await response.json();
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
        throw new Error('응답을 파싱할 수 없습니다.');
    }

    const parsed: DesignConceptSetResult = JSON.parse(content);

    // 고유 ID 주입
    parsed.concepts.forEach(concept => {
        concept.id = Math.random().toString(36).substring(2, 9);
    });

    return parsed;

  } catch (err) {
      console.error('[대지분석] 컨셉 생성 오류:', err);
      throw err;
  }
}
