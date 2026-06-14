import { useProjectStore } from '@/store/projectStore';

const GEMINI_MODEL = 'gemini-2.5-flash';

export interface ProjectCharacteristicsInput {
    projectName: string;
    address: string;
    buildingUse: string;
    rawText?: string;
}

export interface CharacteristicsCategory {
    title: string;
    desc: string;
    scoreOutof25: number;
}

export interface LifecycleZoning {
    floorIndex: string;
    floorTitle: string;
    floorDesc: string;
}

export interface RegionalPoint {
    title: string;
    desc: string;
}

export interface ProjectCharacteristicsResult {
    demandStats: {
        trendCount: number;
        trendText: string;
        agreementRate: number;
        agreementText: string;
    };
    regionalAnalysis: {
        points: RegionalPoint[];
        quote: string;
    };
    lifecycleZoning: LifecycleZoning[];
    communityLink: {
        score: number;
        grade: string;
        categories: CharacteristicsCategory[];
    };
    analyzedAt: string;
}

function buildPrompt(info: ProjectCharacteristicsInput): string {
    const docRef = info.rawText
        ? `\n\n[과업지시서 원문 요약/발췌]\n${info.rawText.substring(0, 4000)}`
        : '';

    return `당신은 건축 설계 전문가이자 데이터 분석가입니다. 
아래 프로젝트 정보와 과업지시서를 바탕으로 프로젝트 특성(수요, 조닝, 커뮤니티 연계성)을 분석하여 JSON으로 반환하세요.

[프로젝트 정보]
- 사업명: ${info.projectName || '미정'}
- 대지위치: ${info.address || '미정'}
- 건축물 용도: ${info.buildingUse || '미정'}

★★★ 분석 지침 ★★★

[1. 수요 통계 (demandStats)]
- 사업명과 용도를 고려해 적절한 타겟 이용객 수(명/년)를 추정하세요 (trendCount).
- 수요 증감 추이에 대한 1줄 코멘트를 작성하세요 (trendText).
- 지역사회 건립 동의율을 0~100 사이 숫자로 추정하세요 (agreementRate). 공공 기여도가 높으면 높게 산정하세요.
- 동의율에 대한 1줄 코멘트를 작성하세요 (agreementText).

[2. 지역 분석 (regionalAnalysis)]
- 광역 인프라와의 연계, 접근성에 대한 2가지 핵심 포인트(title, desc)를 작성하세요.
- 설계 방향을 지시하는 인용구(quote) 1줄 작성 (예: "선형 공원 및 열린 외부공간 연계 계획 필수")

[3. 생애주기·수직 조닝 (lifecycleZoning)]
- 건축물 용도에 맞춰 1층부터 4층까지(또는 적절한 층) 층별 용도 및 핵심 타겟층을 작성하세요.
- floorIndex: 층수 표기 (예: "1F", "2F")
- floorTitle: 핵심 테마 (예: "최단 동선 / 보호 관리")
- floorDesc: 공간 용도 설명 (예: "유치부 및 행정지원 타워")

[4. 공생 설계 (communityLink)]
- 외부공간 개방성, 보행 동선 연계, 공용 프로그램, 시각적 공생성 등 4가지 범주(categories)에 대해 평가하세요.
- 각 범주별로 title, desc, scoreOutof25(최대 25점 만점, 소수점 첫째자리까지)를 작성하세요.
- 4가지 점수를 합산하여 총점(score, 100점 만점)을 산출하고, 90점 이상 "우수", 80점 이상 "양호", 그 외 "보통"으로 grade를 매기세요.

★ 반환 형식 (순수 JSON만 반환) ★
{
  "demandStats": { ... },
  "regionalAnalysis": { ... },
  "lifecycleZoning": [ ... ],
  "communityLink": { ... }
}
${docRef}`;
}

export async function analyzeProjectCharacteristics(
    input: ProjectCharacteristicsInput
): Promise<ProjectCharacteristicsResult | null> {
    try {
        const apiKey = useProjectStore.getState().geminiApiKey;
        if (!apiKey) {
            console.error('[특성분석] API 키가 입력되지 않았습니다.');
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
                    temperature: 0.2,
                    maxOutputTokens: 2048,
                    responseMimeType: 'application/json',
                    thinkingConfig: {
                        thinkingBudget: 0
                    }
                },
            }),
        });

        if (!response.ok) {
            console.error('[특성분석] API 오류:', response.status);
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
        console.error('[특성분석] 파싱 오류:', error);
        return null;
    }
}
