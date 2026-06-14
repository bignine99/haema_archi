import { useProjectStore } from '@/store/projectStore';

const GEMINI_MODEL = 'gemini-2.5-flash';

export interface SpecializedDesignInput {
    projectName: string;
    buildingUse: string;
    rawText?: string;
    grossFloorArea: number;
    siteAnalysis?: any;
    regulationAnalysis?: any;
    characteristicsAnalysis?: any;
    spaceStrategy?: any;
}

export interface SpecializedDesignProposal {
    branding: string;
    slogan: string;
    masterplanDesc: string;
    weLiving: { title: string; desc: string };
    weLinking: { title: string; desc: string };
    weLearning: { title: string; desc: string };
    policyTitle: string;
    policyDesc: string;
    policyTags: string[];
    clusterTitle: string;
    clusterSteps: { step: number; name: string; color: string; sub: string }[];
    clusterFloors: string[];
    loopTitle: string;
    analyzedAt?: string;
}

function buildPrompt(info: SpecializedDesignInput): string {
    const docRef = info.rawText
        ? `\n\n[과업지시서 원문 요약/발췌]\n${info.rawText.substring(0, 3000)}`
        : '';
        
    const phaseA_B = `
[사전 분석 결과 (Phase A & B)]
- 입지/환경 분석(Site Analysis): ${info.siteAnalysis ? JSON.stringify(info.siteAnalysis).substring(0, 1000) : '정보 없음'}
- 법규 분석(Regulation): ${info.regulationAnalysis ? JSON.stringify(info.regulationAnalysis).substring(0, 1000) : '정보 없음'}
- 특성 분석(Characteristics): ${info.characteristicsAnalysis ? JSON.stringify(info.characteristicsAnalysis).substring(0, 1000) : '정보 없음'}
- 공간 전략(Space Strategy): ${info.spaceStrategy ? JSON.stringify(info.spaceStrategy).substring(0, 1000) : '정보 없음'}
`;

    return `당신은 대한민국 최고의 마스터플래너이자 건축 브랜딩 전문가입니다. 
아래 프로젝트 정보와 과업지시서, 그리고 Phase A & B 사전 분석 결과를 종합적으로 분석하여, 이 프로젝트에 가장 창의적이고 혁신적인 '특화설계 제안서(Specialized Design Proposal)'에 들어갈 독창적인 콘텐츠를 JSON으로 생성하세요. 완전히 새로운 관점과 트렌디한 네이밍을 제시해야 합니다.

[프로젝트 정보]
- 사업명: ${info.projectName || '미정'}
- 건축물 용도: ${info.buildingUse || '미정'}
- 예정 연면적: ${info.grossFloorArea}㎡
${phaseA_B}

★ 반드시 아래 JSON 형식으로만 반환해야 합니다. 다른 말은 덧붙이지 마세요. JSON 포맷팅 중 특수문자 등에 유의하여 유효한 JSON을 반환하세요. ★

[JSON 스키마와 작성 지침]
{
  "branding": "프로젝트의 맥락(입지, 공간전략)을 반영한 1~3단어 영문 브랜딩 명칭 (예: Bio-Link Hub, Eco-Void Campus 등, 기존 배열에 없던 완전히 새로운 명칭)",
  "slogan": "새로운 브랜딩을 설명하는 한 줄의 매력적인 국문 슬로건",
  "masterplanDesc": "사전 분석 결과의 제약과 잠재력을 극복/활용하는 마스터플랜에 대한 3~4줄 분량의 전문가적인 서술",
  "weLiving": {
    "title": "We-LIVING (또는 유사한 창의적 칭호)",
    "desc": "특성 분석에 기반하여 공공성/지역상생을 위해 제안하는 10~25자 내외의 혁신적 콘셉트"
  },
  "weLinking": {
    "title": "We-LINKING (또는 유사한 창의적 칭호)",
    "desc": "입지 환경과 동선 분석에 기반한 입체적 연결성에 관한 10~25자 내외의 혁신적 콘셉트"
  },
  "weLearning": {
    "title": "We-[A-Z 단어]", 
    "desc": "프로젝트 핵심 목표(Space Strategy)에 기반한 독창적 프로그램 제안 및 10~25자 내외 콘셉트"
  },
  "policyTitle": "국가 정책/트렌드를 선도하는 전략적 제목 (예: 탄소중립 기반 지역거점 스마트플랫폼)",
  "policyDesc": "과업지시서와 법규 제약을 넘어서 어떻게 공공자산으로서 가치를 창출하는지에 대한 서술형 설명",
  "policyTags": [
    "정책/제안 특장점 1 (15자 내외)",
    "정책/제안 특장점 2 (15자 내외)",
    "정책/제안 특장점 3 (15자 내외)"
  ],
  "clusterTitle": "새롭게 조닝된 4단계 집중 클러스터의 제목 (예: 4단계 스마트 융합 코어 조닝)",
  "clusterSteps": [
    { "step": 1, "name": "1단계 창의적 공간명", "color": "emerald 또는 blue 또는 orange 중 택1", "sub": "공간 전략을 반영한 세부 기능 2개" },
    { "step": 2, "name": "2단계 창의적 공간명", "color": "emerald", "sub": "세부 기능 설명" },
    { "step": 3, "name": "3단계 창의적 공간명", "color": "blue", "sub": "세부 기능 설명" },
    { "step": 4, "name": "4단계 창의적 공간명", "color": "orange", "sub": "세부 기능 설명" }
  ],
  "clusterFloors": [
    "1F: 공간의 프로그램과 흐름 반영 요약",
    "2F: 공간의 프로그램과 흐름 반영 요약",
    "3F: 공간의 프로그램과 흐름 반영 요약",
    "4F: 공간의 프로그램과 흐름 반영 요약"
  ],
  "loopTitle": "이 프로젝트만의 특화된 동선/루프망 타이틀 (예: 무장애 3D 순환 인프라망)"
}
${docRef}`;
}

export async function analyzeSpecializedDesign(
    input: SpecializedDesignInput
): Promise<SpecializedDesignProposal | null> {
    try {
        const apiKey = useProjectStore.getState().geminiApiKey;
        if (!apiKey) {
            console.error('[특화설계분석] API 키가 입력되지 않았습니다.');
            return null;
        }

        const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
        const prompt = buildPrompt(input);

        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2500,
                    responseMimeType: 'application/json',
                },
            }),
        });

        if (!response.ok) {
            console.error('[특화설계분석] API 오류:', response.status);
            return null;
        }

        const result = await response.json();
        const content = result?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!content) return null;

        const match = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        const cleanContent = match ? match[1].trim() : content.trim();

        const parsed = JSON.parse(cleanContent);

        return {
            ...parsed,
            analyzedAt: new Date().toISOString(),
        };
    } catch (error) {
        console.error('[특화설계분석] 파싱 오류:', error);
        return null;
    }
}
