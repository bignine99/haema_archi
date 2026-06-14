
import { SiteAnalysisResult } from './siteAnalysisService';
import { RegulationAnalysisResult } from './regulationAnalysisService';
import { ProjectCharacteristicsResult } from './projectCharacteristicsService';

export interface EngineeringAnalysisInput {
    domain: string;
    domainNameKor: string;
    projectName: string;
    buildingUse: string;
    grossFloorArea: number;
    rawText: string;
    siteAnalysis: SiteAnalysisResult | null;
    regulationAnalysis: RegulationAnalysisResult | null;
    characteristicsAnalysis: ProjectCharacteristicsResult | null;
    spaceStrategy: any | null;
}

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

/* ═══════════════════════════════════════════════════════════════
   도메인별 상세 JSON 스키마 — Phase C 패널 전체 섹션 커버
   ═══════════════════════════════════════════════════════════════ */

const getDomainSchema = (domain: string, buildingUse: string): string => {
    const commonFields = `
  "systemProposals": [
    { "title": "시스템/공법명", "usage": "적용 부위", "pros": "Phase A,B 분석 결과와 연계하여 이 프로젝트에 특화된 제안 이유" }
  ],
  "riskBoard": [
    { "risk": "이 프로젝트 특성에서 유래하는 구체적 리스크", "impact": "상/중/하", "prob": "상/중/하", "solution": "프로젝트 맞춤 대응 방안" }
  ],
  "customMetrics": [
    { "label": "지표명", "value": "수치/기준" }
  ]`;

    switch (domain) {
        case 'structural':
            return `{
  ${commonFields},
  "sectionData": {
    "foundationSpecs": {
      "type": "기초 유형 (예: 매트기초, PHC말뚝, 현장타설말뚝 등) — 이 프로젝트 용도와 규모에 맞는 최적 기초",
      "qa": "허용지내력(kN/m2) 구체적 수치",
      "settlement": "예상 부등침하(mm) 수치",
      "settlementCheck": "각변위 판정 결과 (예: 1/300 이하 PASS)",
      "liquefaction": "액상화 위험도 판정 (발생확률 높음/낮음/없음)",
      "description": "기초 설계 근거 설명 (3줄, 이 프로젝트 용도와 지반 상황을 반영)"
    },
    "superStructure": [
      { "title": "구조 시스템명", "usage": "적용 부위/층", "pros": "이 건물에 적합한 이유 (Phase A,B 맥락 반영)" }
    ],
    "seismic": {
      "grade": "내진 등급 (특등급/1등급/2등급 — 건물 용도별 판단)",
      "importanceFactor": "중요도 계수 (1.0/1.2/1.5)",
      "driftLimit": "허용 층간변위 기준 (예: H/250)",
      "driftResult": "판정 결과 (PASS/FAIL)",
      "lfrs": "주 횡력저항 시스템",
      "damper": "보조 제진 메커니즘",
      "description": "이 프로젝트에 맞는 내진 설계 전략 설명 (2줄)"
    },
    "slabSystem": {
      "type": "슬래브 유형 (무량판/PT/데크 등)",
      "thickness": "슬래브 두께(mm)",
      "savings": "기존 대비 절감 효과",
      "vibration": "바닥진동 수준 (예: 1.0% g 이내)"
    },
    "monitoring": {
      "system": "구조 건전성 모니터링(SHM) 계획 요약",
      "sensors": "주요 센서 종류",
      "frequency": "계측 주기"
    }
  }
}`;

        case 'civil':
            return `{
  ${commonFields},
  "sectionData": {
    "boringLog": {
      "weatheredRockDepth": "풍화암 출현 심도 (예: GL -8.5m)",
      "groundwaterLevel": "지하수위 (예: -3.2m)",
      "soilDescription": "지층 구성 요약 (이 대지의 특성 반영 2줄)",
      "nValue": "주요 지층의 N값 (예: 사질토 N=12, 점성토 N<10)"
    },
    "foundationOpt": {
      "type": "기초 유형 (매트, 말뚝, 혼용 등)",
      "qa": "허용지내력(kN/m2)",
      "settlement": "예상 부등침하(mm)",
      "safetyFactor": "안전율(FS)",
      "description": "기초 최적화 설명 (3줄, Terzaghi 공식 등 적용 근거 포함)"
    },
    "excavation": {
      "method": "흙막이 공법 (H-Pile/CIP/Slurry Wall 등)",
      "depth": "굴착 깊이(m)",
      "heavingSF": "히빙 안전율",
      "pipingSF": "파이핑 안전율",
      "boilingSF": "보일링 안전율",
      "deepAlert": "깊은 굴착 경고 여부 (true/false)"
    },
    "buoyancy": {
      "safetyFactor": "부력 안전율(Fs) 수치",
      "anchorCount": "Rock Anchor 또는 대응체 수량",
      "anchorType": "앵커/대응 유형명",
      "description": "부력 대응 전략 설명 (2줄)"
    },
    "neighborImpact": {
      "influenceRadius": "영향권 반경 (예: H×2.0)",
      "monitoringPlan": "인접 구조물 계측 계획 (2줄)"
    }
  }
}`;

        case 'mechanical':
            return `{
  ${commonFields},
  "sectionData": {
    "hvac": {
      "load": "냉난방 부하 (W/m2 수치)",
      "ervRate": "ERV 환기율 (%)",
      "filterType": "필터 종류 (HEPA/표준 등 - 건물 용도 반영)",
      "system": "공조 시스템 유형 (VAV/CAV/FCU 등)",
      "description": "공조 전략 설명 (3줄, 이 건물 용도에 맞춤)"
    },
    "thermalSource": {
      "primarySystem": "주 열원 시스템명",
      "primaryPercent": "주 열원 비율 (%)",
      "secondarySystem": "보조 열원 시스템명",
      "secondaryPercent": "보조 열원 비율 (%)",
      "strategy": "중앙집중식/개별/하이브리드 중 택일",
      "description": "열원 계획 설명 (2줄)"
    },
    "smokeControl": {
      "pressurization": "급기가압 수치 (Pa)",
      "evParking": "전기차 주차장 소방 대책",
      "specialNote": "이 건물 용도에 특화된 소방 요구사항"
    },
    "elevator": {
      "count": "엘리베이터 대수",
      "speed": "속도 (m/s)",
      "avgWaitTime": "평균 대기시간 (초)",
      "type": "엘리베이터 유형 (승객용/화물용/비상용 등)",
      "description": "수직이동 계획 설명 (2줄)"
    }
  }
}`;

        case 'electrical':
            return `{
  ${commonFields},
  "sectionData": {
    "powerSystem": {
      "totalLoad": "총 전력 부하 (kW 또는 kVA)",
      "transformerCapacity": "수변전 용량 (kVA)",
      "voltageLevel": "수전 전압 (22.9kV 등)",
      "emergencyPower": "비상전원 용량 및 방식 (UPS/발전기 등)",
      "description": "수변전 및 전력 계획 설명 (3줄, 건물 용도 반영)"
    },
    "lighting": {
      "density": "조명 밀도 (W/m2)",
      "strategy": "조명 제어 전략 (DALI/IoT/재실감지 등)",
      "energySaving": "에너지 절감률 (%)"
    },
    "security": {
      "system": "통합 보안 시스템 구성",
      "accessControl": "출입통제 방식",
      "cctv": "CCTV 계획 요약"
    },
    "bems": {
      "integration": "BEMS 통합 범위 (HVAC/조명/전력 등)",
      "aiControl": "AI 기반 제어 전략",
      "expectedSaving": "예상 에너지 절감률 (%)"
    }
  }
}`;

        case 'special':
            return `{
  ${commonFields},
  "sectionData": {
    "acoustics": {
      "targetNC": "목표 소음 등급 (NC 또는 dB 수치)",
      "strategy": "차음/흡음 전략 (건물 용도 반영)",
      "specialZones": "특수 방음 구역 (강당/회의실/진료실 등)"
    },
    "smartBuilding": {
      "ibmsScope": "IBMS 통합 범위",
      "iotDevices": "IoT 디바이스 계획",
      "digitalTwin": "디지털 트윈 적용 계획",
      "description": "스마트 빌딩 전략 설명 (3줄)"
    },
    "bim": {
      "lodLevel": "BIM LOD 수준 (300/350/400 등)",
      "clashDetection": "간섭 검토 전략",
      "handover": "준공 후 BIM 자산 활용 계획"
    }
  }
}`;

        case 'cost':
            return `{
  ${commonFields},
  "sectionData": {
    "costBreakdown": {
      "totalCost": "총 공사비 (억원, 추정)",
      "structureCost": "구조 공사비 비율 (%)",
      "mepCost": "MEP 설비 공사비 비율 (%)",
      "finishCost": "마감 공사비 비율 (%)",
      "siteCost": "부지/토목 공사비 비율 (%)",
      "unitCost": "단위 면적당 공사비 (만원/m2)",
      "description": "공사비 산정 근거 설명 (3줄, 이 프로젝트 규모/용도 반영)"
    },
    "schedule": {
      "totalMonths": "총 공사기간 (개월)",
      "designPhase": "설계 기간 (개월)",
      "constructionPhase": "시공 기간 (개월)",
      "milestones": [
        { "phase": "공정 단계명", "duration": "소요 기간", "note": "핵심 관리 포인트" }
      ]
    },
    "veCandidates": [
      { "item": "VE 대상 항목", "saving": "절감 예상액 또는 비율", "impact": "품질 영향도 (상/중/하)" }
    ]
  }
}`;

        case 'green':
            return `{
  ${commonFields},
  "sectionData": {
    "gseed": {
      "targetGrade": "G-SEED 목표 등급 (최우수/우수/일반 등)",
      "totalScore": "예상 총점 (예: 74.2점)",
      "keyItems": [
        { "category": "평가 항목 (예: 에너지 성능, 실내환경 등)", "score": "배점 대비 득점", "strategy": "확보 전략" }
      ]
    },
    "zeb": {
      "targetGrade": "ZEB 목표 등급 (1~5등급)",
      "eerTarget": "에너지자립률 목표 (%)",
      "strategy": "ZEB 달성 전략 요약"
    },
    "iaq": {
      "co2Target": "CO2 농도 목표 (ppm)",
      "pm25Target": "PM2.5 목표 (μg/m3)",
      "ventStrategy": "환기 전략"
    },
    "ecology": {
      "biotopeRatio": "생태면적률 목표 (%)",
      "greeningPlan": "녹화 계획 요약",
      "carbonReduction": "탄소 저감 전략"
    }
  }
}`;

        case 'energy':
            return `{
  ${commonFields},
  "sectionData": {
    "passive": {
      "wallUValue": "외벽 열관류율 (W/m2K)",
      "windowUValue": "창호 열관류율 (W/m2K)",
      "airtightness": "기밀성능 등급",
      "strategy": "패시브 전략 설명 (3줄, 이 프로젝트 기후/방위 반영)"
    },
    "active": {
      "hvacEfficiency": "공조 효율 (COP 등)",
      "lightingDensity": "조명 밀도 (W/m2)",
      "controlSystem": "에너지 제어 시스템 (BEMS 등)",
      "strategy": "액티브 전략 설명 (2줄)"
    },
    "renewable": {
      "solarCapacity": "태양광 설치 용량 (kW)",
      "solarArea": "태양광 설치 면적 (m2)",
      "geoHeatPump": "지열 히트펌프 용량 (kW)",
      "annualGeneration": "연간 예상 발전량 (kWh)",
      "selfSufficiency": "에너지 자립률 (%)",
      "strategy": "신재생 에너지 전략 설명 (2줄)"
    },
    "performance": {
      "primaryEnergy": "1차 에너지 소요량 (kWh/m2·yr)",
      "energySaving": "에너지 절감률 (%)",
      "zebGrade": "ZEB 등급 달성 예측"
    }
  }
}`;

        case 'bf':
            return `{
  ${commonFields},
  "sectionData": {
    "certification": {
      "targetGrade": "BF 인증 목표 등급 (최우수/우수/일반)",
      "totalScore": "예상 총점",
      "keyItems": [
        { "category": "평가 항목 (매개시설/내부시설/위생시설/안내시설 등)", "score": "배점 대비 득점", "strategy": "이 건물 용도에 맞는 확보 전략" }
      ]
    },
    "accessRoute": {
      "mainApproach": "주 접근 경로 설계",
      "rampSpec": "경사로 규격 (기울기/폭/길이)",
      "parkingSpaces": "장애인 주차구획 수",
      "description": "접근성 설계 설명 (2줄)"
    },
    "indoorFacilities": {
      "corridorWidth": "복도 유효폭 (mm)",
      "doorWidth": "출입구 유효폭 (mm)",
      "elevatorSpec": "장애인용 엘리베이터 규격",
      "restroomCount": "장애인 화장실 개소",
      "description": "내부 시설 설명 (2줄)"
    },
    "guidance": {
      "tactilePaving": "점자블록 설치 계획",
      "signage": "안내 표지판 계획",
      "emergencyEvac": "장애인 비상대피 계획"
    }
  }
}`;

        default:
            return `{ ${commonFields}, "sectionData": {} }`;
    }
};

export const analyzeEngineeringDomain = async (input: EngineeringAnalysisInput): Promise<any | null> => {
    const apiKey = typeof window !== 'undefined' 
        ? localStorage.getItem('arche_gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY 
        : import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error('Gemini API 키가 설정되지 않았습니다.');
    }

    const {
        domain,
        domainNameKor,
        projectName,
        buildingUse,
        grossFloorArea,
        rawText,
        siteAnalysis,
        regulationAnalysis,
        characteristicsAnalysis,
        spaceStrategy
    } = input;

    // Phase A, B 데이터를 요약
    const contextSummary = `
[프로젝트 기본 정보]
- 프로젝트명: ${projectName}
- 주 용도: ${buildingUse}
- 연면적: ${grossFloorArea} ㎡

[Phase A. 환경 분석(Site Analysis)]
- 주요 제약요소 관측: ${(siteAnalysis as any)?.riskFactors?.map((r: any) => r.risk).join(', ') || '없음'}
- 교통 및 접근 전략: ${(siteAnalysis as any)?.trafficStrategy || '미지정'}

[Phase A. 법규 검토(Regulation Analysis)]
- 건축 가능 영역 리스크: ${(regulationAnalysis as any)?.criticalRisks?.map((r: any) => r.risk).join(', ') || '최적'}
- 환경/인센티브 전략: ${(regulationAnalysis as any)?.incentiveStrategy || '미지정'}

[Phase B. 특성 도출(Characteristics Analysis)]
- 필수 도입 기능: ${(characteristicsAnalysis as any)?.functionalRequirements?.join(', ') || '없음'}
- 혁신 디자인 테마: ${(characteristicsAnalysis as any)?.designTheme || '미지정'}

[Phase B. 공간 전략(Space Strategy)]
- 조닝 핵심 개념: ${(spaceStrategy as any)?.conceptTitle || '미지정'}
    `.trim();

    const domainSchema = getDomainSchema(domain, buildingUse);

    const prompt = `
당신은 최고급 AI 마스터 엔지니어 시스템 ARCHE V3.0 입니다.
주어진 프로젝트 데이터를 정밀하게 분석하여, [Phase C: ${domainNameKor} 엔지니어링] 분야에 대한 
**이 프로젝트에만 해당하는 고도화된 전문 분석 리포트**를 작성하세요.

[절대적 규칙]
1. 단순 일반론이 아닌, 위 Phase A/B 데이터에서 도출된 이 프로젝트의 **구체적 특성**(용도: ${buildingUse}, 규모: ${grossFloorArea}㎡, 대지 제약, 도입기능)을 모든 필드에 반영하세요.
2. 모든 수치(허용지내력, 부등침하, 안전율, 부하, 용량 등)를 이 프로젝트 규모와 용도에 맞춰 **현실적인 엔지니어링 수치**로 산출하세요.
3. sectionData 내의 description 필드에는 반드시 **이 프로젝트의 고유한 조건**(용도, 특수시설, 입지조건)을 명시적으로 언급하세요.
4. systemProposals와 riskBoard에서도 일반론이 아닌 **이 건물 용도에서 발생하는 고유 리스크와 최적 시스템**을 제안하세요.
5. 최소 systemProposals 3개, riskBoard 4개, customMetrics 4개를 생성하세요.

출력은 반드시 아래 JSON 스키마를 완벽히 준수하며, 순수 JSON으로만 반환하세요 (마크다운 블록 금지).
절대로 JSON 문자열(value) 내부에 이스케이프되지 않은 따옴표(")나 개행문자(\n)를 사용하지 마세요. 반드시 올바른 JSON 문법을 지켜야 합니다.

--- JSON 스키마 ---
${domainSchema}

--- 입력 데이터 ---
1. Phase A/B 요약:
${contextSummary}

2. 과업지시서 일부(최대 4,000자):
${rawText ? rawText.substring(0, 4000) : '없음'}

순수 JSON만 반환하세요!
`;

    let retries = 3;
    let lastError: any = null;

    while (retries > 0) {
        try {
            const response = await fetch(GEMINI_API_URL + '?key=' + apiKey, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 5000,
                        responseMimeType: "application/json",
                    }
                })
            });

            if (!response.ok) {
                const errBody = await response.text();
                throw new Error(`Gemini API 호출 실패: ${response.status} - ${errBody}`);
            }

            const data = await response.json();
            const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            
            // JSON 파싱 (마크다운 백틱 제거 등)
            const match = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
            const cleanContent = match ? match[1].trim() : content.trim();

            let parsed;
            try {
                parsed = JSON.parse(cleanContent);
            } catch (e) {
                console.warn("JSON 파싱 에러:", e);
                // 강제로 오류 전파하여 재시도 루프(retries)를 실행하게 함
                throw e;
            }
            return parsed;

        } catch (error: any) {
            console.warn(`[Phase C ${domain} 엔지니어링 분석] 재시도 남은 횟수: ${retries - 1}`, error);
            lastError = error;
            retries--;
        }
    }

    console.error(`[Phase C ${domain} 엔지니어링 분석] 최종 실패:`, lastError);
    alert(`API 내부 오류(3회 재시도 실패): ${lastError?.message || '알 수 없는 오류'}`);
    return null;
};
