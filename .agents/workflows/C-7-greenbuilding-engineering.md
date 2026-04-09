---
description: 친환경 건축 (Green Building) AI 시뮬레이션 — G-SEED, ZEB, 생태/탄소, IAQ 검토
---

# 건축설계 자동화 AI — 친환경 건축(Green Building) 모듈 SKILL 프레임워크
> HAEMA ARCHI · Phase C. 엔지니어링 · 인공지능 생태/탄소저감 설계 · V3.0 AI Simulated · v2.0

---

## 시스템 개요

| 항목 | 내용 |
|------|------|
| 모듈명 | 인공지능 친환경·지속가능성 건축 모듈 (AI Green Building Engineering) |
| 소속 Phase | Phase C. 엔지니어링 (Engineering Evaluation) |
| 문서 성격 | 실내 공기질, 빗물/중수 사이클링, 자연채광 및 G-SEED/ZEB 획득 시뮬레이터 |
| 버전 | V3.0 AI Simulated |
| 핵심 기술 | PMV(열쾌적성) / DA(일조/채광) 렌더링, LCA 탄소배출 연산, 전 생애 환경평가 |

---

## 1. K-Series: AI 기반 스마트 친환경 마스터플랜 (SKILL Modules)

기능명 접두사 **'K'**는 **Kyoto/Knowledge (Eco-Sustainability)**를 상징하며, 각 모듈은 프로젝트 데이터(`useProjectStore`)의 지역 기후 특성과 면적, 요구 인원수를 받아 탄소 배출 저감과 거주성(Well-being) 향상을 동시 달성합니다.

### 🍃 K1 (Eco-SEED 360): 친환경 국가인증 평가 엔진
- **개념**: 녹색건축인증(G-SEED) 및 제로에너지건축물(ZEB) 타겟 등급을 달성하기 위한 예측 스코어링 시스템.
- **오토매틱 타겟팅**:
  - `Education`/`Public` 으로 지정된 건축물은 녹색 1등급(최우수), ZEB 5등급 이상의 의무 스코어를 자동 강제 확보.
  - 외부 조경 지반과 생태면적률(Biotope)이 40% 미만일 경우 옥상/벽면 녹화를 강제 추천.

### 🌬️ K2 (Breathe-IAQ): 지능형 공기질 보장 시스템 (Indoor Air Quality)
- **개념**: 미세먼지(PM2.5/PM10), 포름알데히드, VOC 등 유해물질을 억제·제어하는 알고리즘.
- **치유 방어 (Healthcare)**:
  - 재실자의 면역력이 취약한 경우 (병원, 특수학교 등) 준공 후 최소 14일 이상의 100% Flush-out(공기 정화 배출) 기간을 공정표(J-Series)에 의무 할당.
  - 모든 자재는 E0 등급 강제 매핑 및 CO₂ 연계 헤파필터 외기 도입량 증대 비율 연산.

### 💧 K3 (Aqua-Balance): 수자원 절약 및 중수/우수 사이클 (Water Cycle)
- **개념**: 대지 면적 대비 내리는 빗물 유입량과 건물 내 상하수도 배출량을 계산하는 워터 밸런스.
- **수처리기 로직**:
  - 수중운동실, 수영장, 대규모 입원실이 있는 프로젝트의 경우 사용수 부하가 커지므로, MBR 처리 기반의 중수도 전용 순환루프 시스템을 강제 적용.

### 📉 K4 (LCA-CarbonZero): 전생애 탄소 발자국 평가 (Life Cycle Assessment)
- **개념**: 시공, 운영, 폐기에 이르는(Life Cycle) 환경 영향(GWP, ODP)을 정량 계산.
- **자재 치환(Material Shift)**:
  - 일반 포틀랜드 시멘트 대신 고로슬래그 30% 혼합 콘크리트 및 순환골재(10%) 모델로 치환 시 줄어드는 CO₂ 톤(Ton) 수를 모니터링 표시.

### ☀️ K5 (Bio-Therapeutics): 실내 빛·열 쾌적성 시뮬레이터 (Comfort)
- **개념**: 자연채광 확보 비율(DA: Daylight Autonomy)과 열쾌적성 지수(PMV: 예상평균온열감) 평가.
- **심리/명상 치료 공간 구역화**:
  - 눈부심(Glare) 억제를 위해 직사광선을 피하는 간접 조명 및 광선반(Light Shelf)의 폭을 태양 궤적각에 맞춰 파라메트릭 연산 조절.

---

## 2. 생태-에너지 코어 연산 알고리즘 (Eco-Pipeline)

### 2-1. DA (Daylight Autonomy) 분석 루틴
- 타겟 실내 조도를 300lx로 잡고, 업무 시간 동안 50% 이상 자연 채광만으로 해당 조도를 유지하는 지 계산.
- 측창, 고측창, 옥상 천창(Skylight) 객체의 면적을 조정하며 렌더백률 조율.

### 2-2. 워터 밸런스 수식
`연간 우수 활용량 = 집수면적(Roof) × 유출계수(0.9) × 강우량(mm) × 여과계수`
- 이 값을 조경용수나 화장실 세정수로 배분하여 상수도 비용(OPEX) 절감분 산출.

---

## 3. UI 구현 및 리액트 연동 프로세스 (Implementation Workflow)

이 SKILL 명세(C-7)를 프론트엔드 React 컴포넌트(`GreenBuildingPanel.tsx`)로 구축할 때, 다음 기술적 지침을 준수해야 합니다.

### 3-1. Project Store 연계 (Dynamic Rendering)
- `useProjectStore()`의 `buildingUse`, `totalArea`, `numberOfUsers` 등을 참조하여 K1 모듈의 녹색건축인증 타겟 점수를 변동시킵니다.
- 특수 목적(`Education`, `Hospital`)일 때는 **K2(IAQ/공기질)와 K5(자연채광/쾌적성)** 카드가 최상위로 재배치되어 가장 먼저 강조 표시되도록 조건부 렌더링을 적용합니다.

### 3-2. "Cyber-Dashboard" 분석 시각화 패턴 (12-Grid System)
자연 치유, 물 순환, 무독성을 상징하는 친환경 테마 컬러 `Green/Emerald/Cyan` 을 주력으로 한 대시보드를 구축합니다.

- **[ZONE 1] 실내 공기질(IAQ) 및 빛·열환경 쾌적도 분석**: (Col: 1~6)
  - 미세먼지 방어, E0 자재, PMV 편안함 지수를 레이더 차트(Radar Chart)로 표시하여 치유 공간의 안정성을 입증.
  - Flush-out 진행 기간 게이지(Bar Chart) 연동.
  
- **[ZONE 2] 워터 밸런스 및 옥상/생태 면적 비율**: (Col: 7~12)
  - 건축 부지 대비 조경/옥상 녹화 면적을 도넛형 Area Pie로 렌더링.
  - 물방울 떨어지는 애니메이션 SVG 또는 빗물-중수 재활용 루프 다이어그램 삽입 (Liquid/Wave Flow 룩앤필).

- **[ZONE 3] 리스크 보드 (Risk Management)**: (Bottom 12-Col Full-width)
  - "옥상 치유 텃밭으로 인한 토심 증가 및 구조 하중 리스크", "친환경 비독성 인증 자재 수급 지연 예상", "초대형 천창으로 인한 하절기 온실효과/냉방 부하" 등 친환경 이면의 설계 모순(Risk)을 명시하고 타 분야(구조/설비)와의 교차 해결 방안(Mitigation)을 시각화.

---
> **최종 버전**: 2026.04.05 업데이트
> **상태**: Verified V3.0 (AI Simulated Workflow Compatible)
