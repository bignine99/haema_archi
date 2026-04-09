---
description: 공사비 산출 및 공정 시뮬레이션 AI 검토 — 4D/5D BIM 통합 분석
---

# 건축설계 자동화 AI — 공사비/공정(4D/5D) 관리 모듈 SKILL 프레임워크
> HAEMA ARCHI · Phase C. 엔지니어링 · 인공지능 재무/일정 설계 · V3.0 AI Simulated · v2.0

---

## 시스템 개요

| 항목 | 내용 |
|------|------|
| 모듈명 | 인공지능 공사비 및 공정 검토 모듈 (AI Cost & Schedule Engineering) |
| 소속 Phase | Phase C. 엔지니어링 (Engineering Evaluation) |
| 문서 성격 | 실시간 4D/5D BIM 데이터 연동 예산/일정 시뮬레이터 마스터플랜 |
| 버전 | V3.0 AI Simulated |
| 핵심 기술 | 머신러닝 단가 변동 예측(Escalation), CPM 기반 준공 역산 모델링, 자동 VE 산출 |

---

## 1. J-Series: AI 기반 공사 재무/일정 솔루션 마스터플랜 (SKILL Modules)

기능명 접두사 **'J'**는 **Just-in-Time & Judgment(적기 공급 및 판단)**를 상징하며, 각 모듈은 프로젝트 데이터(`useProjectStore`)의 납기일(준공 타겟)과 예산 한계 범위를 연산하여 시공성과 경제성을 100% 충족시키도록 유도합니다.

### 💰 J1 (CostOptima 5D): 지능형 공사비 (5D BIM) 추출기
- **개념**: 연면적과 건축 구조, 마감 수준(Level) 데이터를 토대로 개략 공사비 물량(BOM)을 실시간으로 추산.
- **분배 로직**:
  - `Education`/`Hospital` 분류 감지 시 기계/특수설비 분야 가중치를 전체 공사비의 25~30%까지 동적 상향.
  - 최신 국가건설기준(KCS) 단가 및 조달청 원자재 단가를 연동하여 ㎡당 단가 오차 ±5% 내 진입 유도.

### ⏱️ J2 (TimeMatrix 4D): 타임라인 (4D) 및 준공 역산 엔진
- **개념**: 건축물의 용도와 지하 층수에 맞춰 최적 시공 순서(CPM, Critical Path Method)를 부여
- **공기 최적화**:
  - 절대 공기 부족 감지 시, `Fast-Track`(설계·시공 병행) 및 `Top-Down`(역타 공법) 추천 시스템 자동 활성화.
  - 학교의 경우 "3월 개교일" 기준 역산, 병원의 경우 "무장애/의료기기 세팅 기간(3개월)" 별도 할당.

### 💡 J3 (ValueEco): AI 기반 설계 가치공학 (VE, Value Engineering)
- **개념**: 설계 공법 및 자재의 대안(Alt)을 모의 시험하여 LCC(생애주기비용) 절감 달성률 계산.
- **모의 시나리오**:
  - "RC구조 일체타설" -> "PC(프리캐스트) 모듈화" 로 변경 시 조기 준공 비용 vs 상승 단가 비교 차트화.
  - 조명 기구 및 반입 전선관 공법을 EMT/Duct 배열로 묶을 때의 에너지/인건비 절감액 시뮬레이션.

### 🏗️ J4 (Buildability): 시공성(DfMA) 및 공간 제약 시뮬레이터
- **개념**: 도심지/협소 공간에서의 장비(크레인, 펌프카) 진입 반경 및 양중 한계 검증.
- **스마트 프리패브**:
  - 모듈러 욕실(UBR), 배관(Spool) 선단 연립 등 공장 제작 후 현장 조립율(Prefabrication Ratio) 확대 플랜.

### 🛡️ J5 (RiskHedge): 재무 방어 및 예비비 알고리즘
- **개념**: 현장의 기후 조건(동절기/우기), 파업, 원자재 가격 급등으로 인한 잠재적 손실 비용(Risk Cost) 방어 로직.
- **동적 할당**:
  - 시스템 변동 계수에 따라 전체 예산의 5~10%를 예비비(Contingency)로 자동 Safe Setting.

---

## 2. 4D/5D 코어 연산 알고리즘 (Estimating Pipeline)

### 2-1. 시스템 비중 분배 연산식
`전체 예산 = (건축 60% + 기계설비 20% + 전기설비 15% + 토목/조경 5%) × (Escalation 반영)`
- 건물이 대형화/첨단화 (예: IBMS, 10Gbps 구축명령 하달) 될수록 통신 및 소방 시스템 공사비 게이지율이 실시간으로 증가.

### 2-2. 임계경로 (Critical Path) 시프트 시스템
`흙막이 -> 기초 -> 골조(기준층 1cycle/7day) -> 마감 병행`
- 골조 공사와 내외장 마감의 "병행(Overlap) 한계치"를 UI 게이지로 설정하여 공기 단축폭 및 리스크를 조율.

---

## 3. UI 구현 및 리액트 연동 프로세스 (Implementation Workflow)

이 SKILL 명세(C-6)를 프론트엔드 React 컴포넌트(`CostSchedulePanel.tsx`)로 구축할 때, 다음 기술적 지침을 준수해야 합니다.

### 3-1. Project Store 연계 (Dynamic Rendering)
- `useProjectStore()`를 통해 총 연면적(`grossFloorArea`), 예상 공기(`constructionMonths`), 용도(`buildingUse`)를 가져와 5D 공사비 차트의 Max Value를 업데이트합니다.
- 용도가 `Education`인 경우, UI 상단 일정표(Gantt/Timeline)의 끝점에 **"3월 신학기 개교"** 핀(Pin) 마커를 동적으로 고정하고 그에 따른 CPM 역산 그래프를 그립니다.

### 3-2. "Cyber-Dashboard" 분석 시각화 패턴 (12-Grid System)
Haema V3.0 UI 테마 중 예산(Emerald/Green) 및 일정/데이터(Blue) 톤을 섞어 정밀한 회계 및 관리 대시보드 룩을 구성합니다.

- **[ZONE 1] 5D AI 공사 예산 및 VE 시뮬레이터**: (Col: 1~5)
  - 파이 차트(Pie Chart)를 이용해 공종별 예산 분배 비율 시각화.
  - 가치 공학(J3) 제안 도입 전/후의 총액 변화 금액 막대 파이프그래프(Recharts).
  
- **[ZONE 2] 4D 타임라인 및 Critical Path 모델링**: (Col: 6~12)
  - X축(월단위 Month) 1~24 스케일의 Gantt Chart (CSS Grid 또는 단순 배열 블록 SVG 렌더).
  - 지반/골조/설비/마감 막대그래프 겹침 구간(Fast-Track Zone)을 하이라이팅 표시.

- **[ZONE 3] 리스크 보드 (Risk Management)**: (Bottom 12-Col Full-width)
  - 프로젝트 공정/공사비 이탈에 대한 핵심 방어책 테이블.
  - 예: "철근/콘크리트 관급 자재 수급 지연 예상", "동절기(12~2월) 콘크리트 양생용 보양 타설 비용 증대", "준공 전 BF 인증 취득 지연" 에 대한 선제적 전략(J5 모듈) 제시.

---
> **최종 버전**: 2026.04.05 업데이트
> **상태**: Verified V3.0 (AI Simulated Workflow Compatible)
