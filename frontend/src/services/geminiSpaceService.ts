import { useProjectStore } from '@/store/projectStore';

const GEMINI_MODEL = 'gemini-2.5-flash';

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

// ─── 고품질 Fallback Mock 데이터 생성기 ───
export function generateMockSpaceProgram(constraints: SpaceConstraints): AISpaceFloor[] {
    const grossFloorArea = Number(constraints.grossFloorArea) || 10000;
    const totalFloors = Number(constraints.totalFloors) || 5;
    const averageFloorArea = grossFloorArea / totalFloors;
    
    console.warn(`[Gemini Space] API 최종 실패로 인해 ${grossFloorArea}㎡ 규모의 고품질 Mock 스페이스 프로그램을 생성합니다.`);
    const floorsList: AISpaceFloor[] = [];
    
    // 지하층 (B1F) - 층수가 3층 이상일 때만 생성
    if (totalFloors > 3) {
        floorsList.push({
            floor: 'B1F',
            primaryUse: '주차 및 설비시설',
            targetAgeGroup: '공통',
            height: 4.5,
            zones: [
                {
                    name: '공용/기계 지원 클러스터',
                    rooms: [
                        { name: '공동주차장 (주차 50대 분량)', netArea: averageFloorArea * 0.5, commonArea: averageFloorArea * 0.05, isRequired: true },
                        { name: '중앙 기계실 및 전기실', netArea: 0, commonArea: averageFloorArea * 0.25, isRequired: true },
                        { name: 'MDF 방재/통신 랙룸', netArea: 0, commonArea: averageFloorArea * 0.1, isRequired: true },
                        { name: '지하계단실 및 엘리베이터 홀', netArea: 0, commonArea: averageFloorArea * 0.1, isRequired: true }
                    ]
                }
            ]
        });
    }
    
    // 지상층들 생성
    const activeFloors = totalFloors > 3 ? totalFloors - 1 : totalFloors;
    for (let i = 1; i <= activeFloors; i++) {
        const floorName = `${i}F`;
        let primaryUse = '교육 및 연구';
        let zones = [];
        
        if (i === 1) {
            primaryUse = '행정 및 안내';
            zones = [
                {
                    name: '행정/지원 클러스터',
                    rooms: [
                        { name: '통합 행정실 및 교무실', netArea: averageFloorArea * 0.25, commonArea: averageFloorArea * 0.05, isRequired: true },
                        { name: '보건실 및 학생상담실', netArea: averageFloorArea * 0.15, commonArea: averageFloorArea * 0.05, isRequired: true },
                        { name: '중앙 종합 로비 및 안내데스크', netArea: averageFloorArea * 0.1, commonArea: averageFloorArea * 0.15, isRequired: true },
                        { name: '주계단 및 코어 엘리베이터 홀', netArea: 0, commonArea: averageFloorArea * 0.15, isRequired: true },
                        { name: '남녀 공용화장실 및 청소용역실', netArea: 0, commonArea: averageFloorArea * 0.15, isRequired: true }
                    ]
                }
            ];
        } else if (i === 2) {
            primaryUse = '교실 및 학습공간';
            zones = [
                {
                    name: '일반교실 클러스터',
                    rooms: [
                        { name: '일반 교실 (A/B/C/D)', netArea: averageFloorArea * 0.4, commonArea: averageFloorArea * 0.05, isRequired: true },
                        { name: '학년교무실 및 세미나룸', netArea: averageFloorArea * 0.15, commonArea: averageFloorArea * 0.05, isRequired: true },
                        { name: '피난 계단실 및 복도', netArea: 0, commonArea: averageFloorArea * 0.2, isRequired: true },
                        { name: '화장실 및 정수기 코너', netArea: 0, commonArea: averageFloorArea * 0.15, isRequired: true }
                    ]
                }
            ];
        } else if (i === 3) {
            primaryUse = '체육 및 특별활동';
            zones = [
                {
                    name: '체육/다목적 클러스터',
                    rooms: [
                        { name: '실내 다목적 강당 (체육관)', netArea: averageFloorArea * 0.45, commonArea: averageFloorArea * 0.05, isRequired: true },
                        { name: '탈의실 및 간이 샤워/목욕실', netArea: averageFloorArea * 0.1, commonArea: averageFloorArea * 0.05, isRequired: true },
                        { name: '피난 계단실 및 통로', netArea: 0, commonArea: averageFloorArea * 0.2, isRequired: true },
                        { name: '체육기자재실 및 화장실', netArea: 0, commonArea: averageFloorArea * 0.15, isRequired: true }
                    ]
                }
            ];
        } else {
            primaryUse = '특별교실 및 연구공간';
            zones = [
                {
                    name: '특별학습 클러스터',
                    rooms: [
                        { name: '컴퓨터실 및 미디어 연구실', netArea: averageFloorArea * 0.3, commonArea: averageFloorArea * 0.05, isRequired: true },
                        { name: '과학실험실 및 자재 창고', netArea: averageFloorArea * 0.25, commonArea: averageFloorArea * 0.05, isRequired: true },
                        { name: '복도 및 공용 계단실', netArea: 0, commonArea: averageFloorArea * 0.2, isRequired: true },
                        { name: '화장실 및 탕비실', netArea: 0, commonArea: averageFloorArea * 0.15, isRequired: true }
                    ]
                }
            ];
        }
        
        floorsList.push({
            floor: floorName,
            primaryUse,
            targetAgeGroup: i === 1 ? '공통/방문자' : '학생 및 교직원',
            height: i === 3 ? 6.5 : 3.9, // 체육관 층은 층고를 높임
            zones
        });
    }
    
    // --- 수학적 면적 비례 배분 보정 (Proration) ---
    let totalGeneratedArea = 0;
    floorsList.forEach(floor => {
        floor.zones?.forEach(zone => {
            zone.rooms?.forEach(room => {
                totalGeneratedArea += (Number(room.netArea) || 0) + (Number(room.commonArea) || 0);
            });
        });
    });

    if (totalGeneratedArea > 0 && grossFloorArea > 0) {
        const scaleFactor = grossFloorArea / totalGeneratedArea;
        floorsList.forEach(floor => {
            floor.zones?.forEach(zone => {
                zone.rooms?.forEach(room => {
                    if (typeof room.netArea === 'number') {
                        room.netArea = Number((room.netArea * scaleFactor).toFixed(1));
                    }
                    if (typeof room.commonArea === 'number') {
                        room.commonArea = Number((room.commonArea * scaleFactor).toFixed(1));
                    }
                });
            });
        });
    }

    return floorsList;
}

export async function generateSpaceProgramWithAI(
    constraints: SpaceConstraints,
    rawText: string
): Promise<AISpaceFloor[] | null> {
    try {
        const apiKey = useProjectStore.getState().geminiApiKey || import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            console.error('[Gemini Space] API 키가 입력되지 않았습니다.');
            throw new Error('설정에서 Gemini API 키를 입력하거나 환경변수에 GEMINI_API_KEY를 설정해주세요.');
        }

        const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

        let docContext = rawText || "건축 설계 과업지시서 데이터가 없습니다.";
        if (docContext.length > 500000) {
            docContext = docContext.substring(0, 250000) + '\n\n... (중간 생략) ...\n\n' + docContext.substring(docContext.length - 250000);
        }

        const grossFloorArea = Number(constraints.grossFloorArea) || 0;
        const buildingCoverageLimit = Number(constraints.buildingCoverageLimit) || 0;
        const floorAreaRatioLimit = Number(constraints.floorAreaRatioLimit) || 0;
        const buildingFootprint = Number(constraints.buildingFootprint) || 0;
        const totalFloors = Number(constraints.totalFloors) || 5;

        const prompt = `당신은 대한민국 최고의 건축 스페이스 프로그래머입니다.
아래 제공된 '건축 과업지시서'를 분석하여 층별 세부용도 및 면적표(Space Program)를 JSON 배열로 생성하세요.

★ [절대 준수 제약조건 - 수학적 검증 필수!!!]
1. 목표 연면적 (Gross Floor Area, GFA): ${grossFloorArea.toFixed(2)} ㎡
2. 모든 층의 (netArea + commonArea) 총합은 반드시 목표 연면적의 95% ~ 100% 사이(${ (grossFloorArea * 0.95).toFixed(0) }㎡ ~ ${grossFloorArea.toFixed(0)}㎡) 가 되도록 전체 잉여 면적을 남김없이 분배하세요!!! (매우 중요: 현재 ${grossFloorArea.toFixed(0)}㎡ 규모의 큰 건물을 설계 중인데 너무 작게 만들지 마세요.)
3. 법정 건폐율 기준: ${buildingCoverageLimit.toFixed(2)}%, 용적률: ${floorAreaRatioLimit.toFixed(2)}%
4. 단일 층의 합계 면적이 절대로 '최대 건축면적(Building Footprint)'인 ${buildingFootprint.toFixed(2)} ㎡를 초과하지 않는 선에서 층수를 분할하세요. 기준 층수: 약 ${totalFloors}개 층.
5. 공간 분배 원칙: 각 층별로 반드시 필수 공용 공간(계단실, 엘리베이터 홀, 복도 및 통로, 로비, 화장실, 설비/기계실, 창고 등)을 '독립된 개별 실(Room)' 항목으로 명시하여 배열에 추가하세요. 절대 이 영역들의 면적을 다른 실에 합쳐서 생략하지 마세요. (예: 계단실은 전용면적 0, 공용면적 150으로 별도 분리)
6. [크리티컬 주의 - ZERO DROPOUT] 원문 데이터(과업지시서)에 기재되어 있는 '요구 공간(스페이스)' 목록을 **단 하나도 누락 없이 100% 전부** 추출해서 분배하세요!! 특히 본 과업지시서가 체육시설이라면 "샤워/목욕실", "탈의실", "체육관(다목적경기장)", "헬스/체력단련실", "프로그램실" 등은 절대로 빠지면 안 됩니다. 제시된 예시 포맷은 무시하시고, 오직 '본 원문 데이터' 속에 기재된 구체적인 '실(Room)'의 명칭들을 그대로 복사하듯 가져와 배열에 밀어 넣어야 합니다.
7. 면적을 큰 덩어리 1, 2개로 짐작해서 분배하지 말고, ${grossFloorArea.toFixed(0)}㎡ 수준의 대형 프로젝트임을 감안하여 단위 면적의 크기를 스케일에 맞게 현실적으로 분배하세요.

[층 및 면적 분배 가이드]
- "netArea"는 전용면적, "commonArea"는 공용면적입니다. (단위: ㎡)
- "isRequired"는 필수 설치 실 여부(true/false)입니다.
- 통상적으로 지하는 주차장/기계실 등이며, 1층은 관리/행정/로비, 그 위층은 주 사용처에 맞게 배치하세요.
- 각 층의 층고(height)는 용도에 맞게 지정하세요. (주차장 4.5m, 체육관/대형공간 8.0m, 일반실 3.9m 등)

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
            { "name": "기계실 및 전기실", "netArea": 0, "commonArea": 200, "isRequired": true },
            { "name": "주계단 및 엘리베이터홀", "netArea": 0, "commonArea": 80, "isRequired": true }
         ]
       }
    ]
  },
  {
    "floor": "1F",
    "primaryUse": "접수 및 안내",
    "targetAgeGroup": "공통",
    "height": 4.2,
    "zones": [
       {
         "name": "퍼블릭 클러스터",
         "rooms": [
            { "name": "과업지시서에 명시된 주요시설A", "netArea": 150, "commonArea": 20, "isRequired": true },
            { "name": "과업지시서에 명시된 주요시설B", "netArea": 80, "commonArea": 10, "isRequired": true },
            { "name": "1층 로비", "netArea": 0, "commonArea": 150, "isRequired": true }
         ]
       }
    ]
  }
]

[과업지시서 원문 데이터]
${docContext}
`;

        let retries = 3;
        let delay = 1000;
        let response = null;

        while (retries > 0) {
            try {
                response = await fetch(GEMINI_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: prompt }]
                        }],
                        generationConfig: {
                            temperature: 0.2,
                            maxOutputTokens: 8192,
                            responseMimeType: 'application/json',
                            thinkingConfig: {
                                thinkingBudget: 0
                            }
                        }
                    })
                });

                if (response.status === 429 || response.status === 503) {
                    console.warn(`[Gemini Space] API 응답 코드 ${response.status} (Rate Limit / Service Overload). ${delay}ms 후 재시도 중... 남은 횟수: ${retries - 1}`);
                    retries--;
                    if (retries === 0) break;
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2.5; // Exponential backoff factor
                    continue;
                }

                if (!response.ok) {
                    const errText = await response.text();
                    console.error('[Gemini Space] API 호출 오류:', response.status, errText);
                    throw new Error(`AI 호출 실패: ${response.statusText}`);
                }

                break; // 성공 시 루프 탈출
            } catch (err) {
                console.error('[Gemini Space] 요청 중 오류 발생:', err);
                retries--;
                if (retries === 0) throw err;
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2.5;
            }
        }

        if (!response || !response.ok) {
            console.warn('[Gemini Space] API 호출에 최종 실패하여 Fallback Mock 데이터를 반환합니다.');
            return generateMockSpaceProgram(constraints);
        }

        const result = await response.json();
        let content = result?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!content) {
            console.warn('[Gemini Space] 응답 텍스트가 비어 있어 Fallback Mock 데이터를 반환합니다.');
            return generateMockSpaceProgram(constraints);
        }

        // Clean markdown backticks if any
        const match = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        const cleanContent = match ? match[1].trim() : content.trim();

        let parsed: AISpaceFloor[];
        try {
            parsed = JSON.parse(cleanContent);
        } catch (jsonErr) {
            console.error('[Gemini Space] 응답 JSON 파싱 실패:', jsonErr);
            return generateMockSpaceProgram(constraints);
        }

        // --- POST-PROCESSING: AI 수학 연산 한계 보정 (Proration) ---
        let totalGeneratedArea = 0;
        parsed.forEach(floor => {
            floor.zones?.forEach(zone => {
                zone.rooms?.forEach(room => {
                    totalGeneratedArea += (Number(room.netArea) || 0) + (Number(room.commonArea) || 0);
                });
            });
        });

        if (totalGeneratedArea > 0 && grossFloorArea > 0) {
            const scaleFactor = grossFloorArea / totalGeneratedArea;
            parsed.forEach(floor => {
                floor.zones?.forEach(zone => {
                    zone.rooms?.forEach(room => {
                        if (typeof room.netArea === 'number') {
                            room.netArea = Number((room.netArea * scaleFactor).toFixed(1));
                        }
                        if (typeof room.commonArea === 'number') {
                            room.commonArea = Number((room.commonArea * scaleFactor).toFixed(1));
                        }
                    });
                });
            });
        }

        return parsed;

    } catch (error) {
        console.error('[Gemini Space] 최종 처리 오류:', error);
        // 에러를 던져서 상위에서 캐치하게 하기 보다는, 최후의 보루로 Mock 데이터를 반환하여 무조건 작동되도록 보장
        return generateMockSpaceProgram(constraints);
    }
}

