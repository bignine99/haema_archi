---
description: 특수 엔지니어링 AI 검토 — 음향 계획, 스마트 빌딩(IBMS), 디지털 트윈 및 BIM 설계
---

# 건축설계 자동화 AI — 특수 엔지니어링 분석 모듈 SKILL 프레임워크
> HAEMA ARCHI · Phase C. 엔지니어링 · 인공지능 특수/디지털 설계 · V3.0 AI Simulated · v2.0

---

## 시스템 개요

| 항목 | 내용 |
|------|------|
| 모듈명 | 인공지능 특수/융합 엔지니어링 모듈 (AI Special & Digital Engineering) |
| 소속 Phase | Phase C. 엔지니어링 (Engineering Evaluation) |
| 문서 성격 | 실시간 실내 공간 음향 해석, 스마트 빌딩 제어망 모델링, 3D BIM 간섭 매트릭스 |
| 버전 | V3.0 AI Simulated |
| 핵심 기술 | RT60 잔향 시뮬레이션, BIM 간섭(Clash) Matrix, IBMS/IoT 스케줄링 |

---

## 1. I-Series: AI 기반 특수·디지털 융합 마스터플랜 (SKILL Modules)

기능명 접두사 **'I'**는 **Intelligence & Integration(지능 및 통합)**을 상징합니다. 고품질의 공간 쾌적성을 보장하고 디지털 시점의 준공 시뮬레이터를 구현하기 위한 5대 모듈로 구성됩니다.

### 🎧 I1 (AcousticOptima): 공간 음향 및 차음 시뮬레이터 (Acoustics)
- **개념**: 특수 목적 실(다목적 체육관, 음악치료실, 회의실 등)의 소음/잔향 주파수를 파동 연산
- **성능 통제**:
  - 목적별 적정 잔향시간(RT60) 가이드: 대공연장 1.5초 이상, 교실 0.5초 등 동적 판별.
  - 외부 소음 및 시스템(기계실) 소음 차단 지표(STC 50 이상, 경량충격음 58dB 이하)에 따른 방음벽 두께 환산.

### 🌐 I2 (SmartIBMS): 통합 스마트 빌딩 관제망 (Smart Building System)
- **개념**: 건물의 재실자 인지, 환경 센싱, 에너지 제어를 총괄하는 통합망 모델링.
- **시나리오 렌더링**:
  - `출근/집중 모드` (조명 On, CO2 감지 외기 급기) 및 `화재/재난 모드` (제연기류 On, 엘리베이터 귀환 등)에 대한 행동 트리(Action Tree) 생성.
  - PM2.5, 온도, 누수 센서 등의 IoT 디바이스 배치 최적화 맵핑.

### 🧱 I3 (BIM-ClashAnalyzer): 다분야 간섭 탐지 엔진 (Digital Clash)
- **개념**: 건축, 구조, 설비, 전기 배관 레이어가 서로 충돌하는 지점을 설계 단계에서 입체적으로 찾아내는 가상 시뮬레이터.
- **예방 설계**:
  - 휠체어 램프 / 무장애(BF) 스페이스 구간에 기계 환기 덕트나 구조 보가 침범(Soft/Hard Clash)하는 포인트를 검출하여 설계자에게 Alert 경보 제공.

### 🔲 I4 (ParametricFacade): 파라메트릭 외피 최적화 엔진
- **개념**: 일사 열취득(SHGC) 저감과 자연 채광, 심미성을 동시 충족하는 파라메트릭 스킨 알고리즘.
- **제어 루프**:
  - Rhino/Grasshopper 연계 로직을 모사하여 외벽 패널/루버의 방위별 각도를 일조 시뮬레이션에 맞춰 동적 조율 추론.

### 🤖 I5 (TwinSync): 생애주기 디지털 트윈 
- **개념**: 시공/운영 단계에서 실제 설비 교체 주기, 에너지 사용 패턴(Predictive Maintenance)을 준공 전 가상 시뮬레이션으로 예행연습.
- **적용**: 건물 용도에 따른 향후 30년간의 LCC 설비 유지보수 포인트 스캔.

---

## 2. 디지털 엔지니어링 연산 파이프라인 (Digital Pipeline)

### 2-1. 지능형 음향 제어 분기
- 공간의 Volume(체적)과 마감재의 흠음계수(α)를 입력받아 Sabine 공식을 통한 RT60 예측 곡선 생성
- "수중운동실(울림 심함)"이나 "음악치료실"이 용도 필터(`useProjectStore`)에 잡힐 경우, 다공질 흡음재 및 차음 씰링 특수 마감재 예산 자동 추가.

### 2-2. BIM LOD (Level of Development) 통제 프로토콜
- 현재 "기본설계(Basic Design)" 단계에 맞춰 **LOD 200~300** 수준(건축 요소의 대략적 형태, 치수, 위치 확보)을 목표 설정
- CDE(Common Data Environment) 파일 규칙 기반 데이터 파싱 논리 점검.

---

## 3. UI 구현 및 리액트 연동 프로세스 (Implementation Workflow)

이 SKILL 명세(C-5)를 바탕으로 프론트엔드 React 컴포넌트(`SpecialEngineeringPanel.tsx`)를 구축할 때, 다음 기술적 지침을 준수해야 합니다.

### 3-1. Project Store 연계 (Dynamic Rendering)
- `useProjectStore`의 `projectName` 및 `buildingUse`(예: 특수학교, 병원) 데이터를 감지하여 **"무장애/배리어프리(BF) 디지털 가상 스캐닝"** 항목이 특별 활성화되게 합니다.
- 병원이나 특수학교의 경우 **I1 음향 모듈**을 통해 민감한 재실자를 보호하기 위한 STC 곡선과 저소음 모드가 중앙에 동적 노출되어야 합니다.

### 3-2. "Cyber-Dashboard" 분석 시각화 패턴 (12-Grid System)
Haema V3.0 UI 테마 중 융합과 미래 첨단을 상징하는 `Teal/Violet/Slate` 계열를 베이스 컬러로 렌더링합니다.

- **[ZONE 1] 실내 음향 및 잔향(RT) 데시보드**: (Col: 1~5)
  - 주파수별(Hz) 목표 잔향시간과 시뮬레이션 결과를 Line Chart로 비교.
  - 방음/차음 대상(예: 기계실 진동음) 방어 그래픽.

- **[ZONE 2] BIM 간섭 레이더 / 파라메트릭 시각화**: (Col: 6~12)
  - 구조/건축/설비 간의 3D 공간 Clash 검출률 매트릭스 도식.
  - IoT 제어반(IBMS) 맵. 건물의 출근/퇴근/재난 시나리오가 스텝별(Steps)로 순차 점등되는 사이버네틱 UI 컴포넌트 삽입.

- **[ZONE 3] 리스크 관리 (Risk Management)**: (Bottom 12-Col Full-width)
  - "특수치료실 정밀기기 층간 소음 전이", "다분야 BIM 좌표 부정합", "IBMS 시스템 초기 도입 예산 초과" 등 특수 엔지니어링 이슈를 시각화하고 해결안을 표기.

---
> **최종 버전**: 2026.04.05 업데이트
> **상태**: Verified V3.0 (AI Simulated Workflow Compatible)
