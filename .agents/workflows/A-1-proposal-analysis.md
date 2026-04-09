---
description: 과업지시서 분석 엔진 AI 스킬 — 문서 파싱, 데이터 구조화, 설계 입력값 자동 추출
---

# 건축설계 자동화 AI — 과업지시서 분석(제원 분석) 모듈 SKILL 프레임워크
> HAEMA ARCHI · Phase A. 기획 및 법규 · 인공지능 제원 추출 · V3.0 AI Simulated · v2.0

---

## 시스템 개요

| 항목 | 내용 |
|------|------|
| 모듈명 | 인공지능 과업지시서(RFP) 제원 추출 모듈 (AI Specs Analysis Engineering) |
| 소속 Phase | Phase A. 기획 및 법규 (Planning & Regulation) |
| 문서 성격 | PDF/HWP 텍스트 자연어 처리, 사업 규모 및 인증 지표 추출기, 스코어보드 렌더러 |
| 버전 | V3.0 AI Simulated |
| 핵심 기술 | 비정형 텍스트의 정형화(Structuring), 법규 파라미터 매핑, 충돌(리스크) 스캐닝 |

---

## 1. A-Series: AI 기반 제원 추출 및 구조화 마스터플랜 (SKILL Modules)

기능명 접두사 **'A'**는 **Analysis, Assessment, Automation(분석, 평가, 자동화)**을 표방하며, 업로드된 과업지시서(PDF 문서)에서 핵심 제원을 100% 자동 추출하여 프로젝트 메타데이터(`useProjectStore`)를 초기화하는 가장 핵심적인 알고리즘 셋업입니다.

### 📝 A1 (DocParser NLP): 고정밀 자연어 문서 스캐너
- **개념**: 사업개요, 서식, 부속 서류 등 방대한 페이지 속에서 "규모", "면적", "지침" 등 특정 키워드를 역추적하여 문맥을 인식.
- **노이즈 필터링**:
  - "보도자료", "서식 안내" 등 무관한 텍스트 뭉치에서 의미 없는 데이터를 배제하고 오직 설계의 입력값(Design Input)으로 쓰일 내용만 필터링.

### ⚖️ A2 (Legal-Matrix): 규모 / 용적률 / 건폐율 강제 할당기
- **개념**: "용적률 180% 이하", "건폐율 60% 이하", "최고장애 5층 이하" 등의 물리 형태적 절대값을 스캔하여 `projectStore`의 한계치에 구속(Constraint)을 켬.
- **오차 방지**:
  - A2 엔진에 록온(Lock-on)된 층수나 연면적 데이터는 향후 B-Series(스페이스 프로그램)나 C-Series(에너지, 구조)에서 수정될 수 없도록 절대 기준선 역할을 수행.

### 🥇 A3 (Cert-Tracker): 법정 필수 인증 스코어보드
- **개념**: 정부 주도 공공 프로젝트의 수많은 의무 인증(ZEB 자립률 4등급 이상, BF 인증 예비도서 제출, 녹색건축 우수 등급 등)을 캐싱하여 리스트업.
- **후행 연동 (Dependency)**:
  - 이 데이터는 즉각적으로 C-7(친환경), C-8(에너지), C-9(BF 무장애) 모듈의 목표 점수(Target Score)로 복사됨. 

### 📚 A4 (Directive-Filter): 과업별 핵심/일반 설계지침 생성기
- **개념**: "일반교실은 남향 배치할 것", "주차 동선과 보행 동선은 완벽히 분리할 것" 같은 형태적 설계 의무를 Bullet 형태로 렌더링.
- **리스크 탐지**:
  - 지침 내용 중 모순적이거나 초과 예산이 발생할 우려가 있는 항목(예: 대지가 협소한데 광장 1000m² 요구)을 "리스크 보드"로 넘겨 현장 타당성 검토로 전환 유도.

### 📅 A5 (Milestone-Sync): 납품 및 성과물 아카이빙 엔진
- **개념**: "중간설계 도서 제출", "심의 도서: 50일 이내" 등 타임라인에 관한 제약을 추출하여 공정표(C-6 Cost & Schedule) 기초 데이터로 연동.
- **산출물 목록화**:
  - 조감도, 배치도, 구조계산서 등 발주처가 요구하는 성과품 항목을 Tagging하여 체크리스트 버튼 UI로 가공.

---

## 2. 제원 파싱 연산 알고리즘 (NLP Pipeline)

### 2-1. 정규식(Regex) & NLP 병합 추출식
`대지면적 추출 = Regex[/대지면적.*?\s([\d,.]+)㎡/i] or 근접 단락 NLP 분석`
- 표(Table) 형태로 묶여있는 값의 경우 열(Column) 헤더를 분석하여 `대지면적`, `연면적`, `용도지역` 등을 오차율 0%에 수렴하도록 재차 크로스 리딩.

### 2-2. Data Injection (상태 초기화)
- 추출이 끝난 배열 세트는 `store/projectStore.ts` 의 `setProjectData(...)`를 강제 트리거하여 전체 9개 엔진의 대시보드 그래프가 동시에 춤을 추도록(일괄 업데이트) 설계.

---

## 3. UI 구현 및 리액트 연동 프로세스 (Implementation Workflow)

이 SKILL 명세(A-1)를 프론트엔드 React 컴포넌트(`SpecsAnalysisPanel.tsx`)로 구축할 때, 다음 기술적 지침을 준수해야 합니다.

### 3-1. Project Store 연계 (Dynamic Rendering)
- `useProjectStore()`의 `documentInfo`가 비어있으면 초기 텅 빈 가이드라인 모드를 렌더링.
- `certifications`, `designGuidelines`, `generalGuidelines` 데이터를 순회(map)하며 미려한 Bullet 또는 Badge UI 형태로 시각화.
- 추출률(Extraction Rate) 계산식(`추출된 주요 속성 수 / 전체 타겟 속성 수 * 100`)을 도출하여 헤더 부분에 % 게이지 게이지 바로 표시.

### 3-2. "HAEMA CI" 기반 분석 시각화 패턴 (12-Grid System)
이 패널은 전체 여정의 시작점이므로, 발주처인 '해마건축사사무소'의 기업 아이덴티티(Corporate Identity)를 완벽히 반영합니다. **순백색(White) 바탕에 강렬한 검은색(True Black/Slate-900) 텍스트, 그리고 시그니처 형광 주황색(Bright Orange/Amber)을 포인트 마커 및 탭(Tab) 색상으로 강제 지정**하여 가장 전문적이고 일관성 있는 룩앤필(Look&Feel)을 연출합니다.

- **[ZONE 1] 사업규모 및 인증 데이터 체계**: (Col: 1~8)
  - 1번 구역: 사업명, 위치, 주요 용도 (우측 하단 주황색 띠 포인트 패널)
  - 2번 구역: 연면적, 층수, 건폐율, 용적률 등의 메트릭스 (검은 점선 혹은 미니멀한 무채색 보더 활용)
  - 3번 구역: 법규 및 필수 사항, 지침 (검은색 글씨에 주황색 블릿/아이콘 적용)
  
- **[ZONE 2] AI 파서(PARSER) 엔진 현황판**: (Col: 9~12)
  - 문서 파싱 뷰는 진한 다크 그레이(Dark Gray) 박스 안에 오렌지색(Orange) 로딩 애니메이션 및 텍스트 점등(Flicker) 배치.
  - 총 추출률(Extraction Rate) 게이지 바 역시 밝은 주황색(orange-500)으로 채워지도록 수정.

- **[엔지니어링 씰] (Bottom Full-width)**
  - 가장 하단 랩퍼에 `SPECS ANALYSIS` 표식과 함께 **해마 로고 컬러(주황+블랙)** 조합의 스탬프 뱃지(Seal) 부착으로 무결함 증명.

---
> **최종 버전**: 2026.04.05 업데이트
> **상태**: Verified V3.0 (AI Simulated Workflow Compatible)
> **연동 시스템**: `SpecsAnalysisPanel.tsx` / `DocumentUploader.tsx`