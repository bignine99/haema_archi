---
description: 첨단 전기/통신 엔지니어링 AI 시뮬레이션 — 수변전, 조명, 보안, BEMS 연동 분석
---

# 건축설계 자동화 AI — 전기·통신 엔지니어링 분석 모듈 SKILL 프레임워크
> HAEMA ARCHI · Phase C. 엔지니어링 · 인공지능 전기/스마트제어 설계 · V3.0 AI Simulated · v2.0

---

## 시스템 개요

| 항목 | 내용 |
|------|------|
| 모듈명 | 인공지능 전기·통신 엔지니어링 모듈 (AI Electrical & Telecom Engineering) |
| 소속 Phase | Phase C. 엔지니어링 (Engineering Evaluation) |
| 문서 성격 | 실시간 수변전 전력량 산출, 생체리듬 조명 시뮬레이션, 스마트 안전망 가시화 |
| 버전 | V3.0 AI Simulated |
| 핵심 기술 | AI 변압기 용량 산출(KEC 기준), DALI 생체리듬 디밍(Dimming) 제어, BEMS 피크전력 방어 |

---

## 1. H-Series: AI 기반 전기/통신 솔루션 마스터플랜 (SKILL Modules)

기능명 접두사 **'H'**는 **High-Voltage & Hub(전력 및 통신 허브)**를 상징하며, 각 모듈은 프로젝트 데이터(`useProjectStore`)의 기준 연면적 및 특수 용도를 분석하여 안정적인 전력망을 실시간으로 설계합니다.

### ⚡ H1 (PowerGrid): AI 수변전 및 비상전원 시뮬레이터
- **개념**: 기계 동력 펌프 부하, 전등 부하, 특수 기기(의료시설 등)의 전력 사용량을 합산하여 22.9kV 고압 수전 및 적정 변압기 용량(kVA)을 자동 산출.
- **신뢰도 통제**: 
  - 병원/데이터센터 등 특수 건축물 판독 시 정전 대비 `2회선 수전(Dual Feed)` 설계 강제 매핑.
  - 소방설비(제연팬, 스프링클러) 구동을 위한 비상발전기(디젤 72시간) 용량 역산 지원.

### 💡 H2 (SmartLight): 눈부심 방지 및 생체리듬 통합 제어
- **개념**: 학교 및 병동 특화형 안구 보호 조명 시스템 (Flicker-Free, Glare 억제).
- **시각 제어 알고리즘**:
  - DALI(Digital Addressable Lighting Interface) 기반의 시간대별 색온도 자동 변환 (아침 집중력, 점심 휴식 톤).
  - LPD(조명 밀도) 한계치(학교 기준 11W/㎡ 이하)를 준수하는 LED 수량 배치.

### 📡 H3 (NetworkHub): 초고속 정보통신 및 무정전 관제망
- **개념**: 광케이블 백본 기반 10Gbps의 네트워크 무손실 환경 구축 및 전산실 서버 UPS 백업 최적화.
- **배치 엔진**:
  - 각 층 EPS(전기 샤프트) 및 IDF(통신 배전실) 면적 최소 확보 자동 경고 시스템 연동.
  - 메인 서버실/방재센터 무정전전원장치(UPS) 백업 가동률(100% Load 기준 30분) 시각화.

### 🚨 H4 (SafetyAlarm): 지능형 통합 보안망 체계
- **개념**: 단순 CCTV를 넘어선 행동 인식형 AI 감시 체계 및 돌발 상황 응급 비상 콜 제어.
- **안전망 통제**:
  - 휠체어 전용 화장실 및 수중운동실 등 밀폐 구역 내 방수용 비상호출벨 무선 연동 라인 구축.
  - AI 얼굴인식 출입통제(ACS)와 건물 방재 시스템 연계 시나리오 설정.

### 🧠 H5 (BEMS-Core): 지능형 건물 통제 센터
- **개념**: 건물 에너지 관리 시스템(BEMS/BAS) 핵심 소프트웨어의 BACnet 통신 표준화 통제.
- **수요 반응 제어**: 
  - 한여름 14:00~16:00 전력 피크 한계(Demand Limit) 도달 시 공조기 인버터 자동 하향 알고리즘.

---

## 2. 수변전 최적화 및 스마트 네트워크 로직 (Electric Pipeline)

### 2-1. 하이브리드 부하 용량 산정 로직
- 상시 동력 부하(HVAC) + 특수 목적 부하(의료장비, 서버기기 등 수용률 1.0)를 나누어 계산
- 산출된 용량 합계에서 안전 여유율(Safety Factor) 20%를 적용하여 변압기 손실 극복 설계 유도

### 2-2. 약전/통신/소방 케이블 동적 맵핑 (Cable Trace)
- 통신 라인(UTP Cat.6A)과 고전압 간선 트레이의 이격거리(Noise Interference 방지) 확보 여부 검증
- 소방 팬 및 피난 유도등은 `FR-CV/HFIX(내화/저독성)` 케이블 사용 강제 매핑 알고리즘

---

## 3. UI 구현 및 리액트 연동 프로세스 (Implementation Workflow)

이 SKILL 명세(C-4)를 바탕으로 프론트엔드 React 컴포넌트(`ElectricalEngineeringPanel.tsx`)를 구축할 때, 다음 기술적 지침을 준수해야 합니다.

### 3-1. Project Store 연계 (Dynamic Rendering)
- `useProjectStore`에서 가져온 특수 용도 여부에 따라 **"수전 방식"** 및 **"비상전원 신뢰도"**가 자동으로 바뀝니다.
- `Education`/`Hospital` 지정 시, H2 모듈(SmartLight)의 **Flicker-Free 조명 및 눈부심 방지 특수 디밍** 카드가 화면의 중앙에 크게 활성화되어 부각되어야 합니다.

### 3-2. "Cyber-Dashboard" 분석 시각화 패턴 (12-Grid System)
현 시점의 Haema V3.0 UI 테마 중 에너지를 상징하는 `Amber` 및 제어/스마트망을 상징하는 `Indigo/Purple`을 주 컬러 톤으로 활용합니다.

- **[ZONE 1] 수변전 용량 및 UPS 운영 대시보드**: (Col: 1~5)
  - 변압기 사용률, UPS 백업 남은 시간 등을 원형 프로그레스(Circle Progress) 바 UI로 표출.
  - 고압 22.9kV 수전망 및 비상발전기 연계 단선결선도(Single Line Diagram) 미니맵 렌더링.
  
- **[ZONE 2] BEMS 전력 피크 및 스마트 조명 시스템**: (Col: 6~12)
  - Area Chart 시각화를 통해 시간대별(00:00~24:00) 예상 전력 소비량 곡선과 Demand Limit 선을 교차.
  - 시간대(아침, 점심, 저녁)별 조도 및 색온도(K) 변화를 스펙트럼 그라데이션 SVG바로 표시 (H2 연동).

- **[ZONE 3] 리스크 관리 (Risk Management)**: (Bottom 12-Col Full-width)
  - 프로젝트 특화 보안 이슈 표출.
  - 예: "발전기실 배기 소음 민원", "수중운동실 100% 방수형 콘센트 누락", "심적 불안 유도형 조명 사용 지양" 등의 경고문구와 해결 솔루션을 강렬한 Badge와 함께 시각화.

---
> **최종 버전**: 2026.04.05 업데이트
> **상태**: Verified V3.0 (AI Simulated Workflow Compatible)