"""
══════════════════════════════════════════════
규제 코드별 상세 정보 사전 v2
══════════════════════════════════════════════

VWorld getLandUseAttr API는 규제 코드/명칭만 반환합니다.
이 모듈은 코드 접두어를 기반으로 관련 법령, 행위제한, 설계 영향,
조례 수준 상세 기준(건폐율/용적률/높이/주차/용도/조경 등)을 제공합니다.

작성일: 2026-03-06
업데이트: 2026-03-19 — 조례 상세 정보 대폭 보강
"""

from typing import Optional
from pydantic import BaseModel, Field


class OrdinanceDetails(BaseModel):
    """지자체 조례 수준의 상세 기준"""
    building_coverage: str = Field("", description="건폐율 상세 (조례 조항 포함)")
    floor_area_ratio: str = Field("", description="용적률 상세")
    height_limit: str = Field("", description="높이제한")
    setback: str = Field("", description="대지 안의 공지 / 건축선 후퇴거리")
    parking: str = Field("", description="주차기준")
    landscape: str = Field("", description="조경 기준")
    sunlight_regulation: str = Field("", description="일조권 사선제한")
    permitted_uses: list[str] = Field(default_factory=list, description="허용 용도")
    prohibited_uses: list[str] = Field(default_factory=list, description="금지/제한 용도")


class RegulationDetail(BaseModel):
    """규제 항목의 상세 정보"""
    related_law: str = Field("", description="관련 법령")
    restriction_summary: str = Field("", description="행위제한 요약")
    design_impact: str = Field("", description="설계 영향")
    management_agency: str = Field("", description="관리기관")
    key_restrictions: list[str] = Field(default_factory=list, description="핵심 제한사항 (빠른 스캔용)")
    ordinance_details: Optional[OrdinanceDetails] = Field(None, description="조례 수준 상세 기준")


# ══════════════════════════════════════════════
# 규제 코드 → 상세 정보 매핑
# ══════════════════════════════════════════════

REGULATION_DETAIL_DB: dict[str, dict] = {

    # ═══ 용도지역 (주거) ═══
    "UQA110": {
        "related_law": "국토계획법 제36조, 동법시행령 제30조",
        "restriction_summary": "전용주거지역: 양호한 주거환경 보호. 단독주택 중심, 4층 이하",
        "design_impact": "건폐율 50%, 용적률 50~100%. 저층 단독주택 위주 개발",
        "management_agency": "시·군·구청 도시과",
        "key_restrictions": ["4층 이하 제한", "단독주택 중심", "근린생활시설 제한적 허용"],
        "ordinance_details": {
            "building_coverage": "50% 이하 (국토계획법 시행령 제84조)",
            "floor_area_ratio": "50~100% (서울시 조례 제55조 기준 100%)",
            "height_limit": "4층 이하 권장. 가로구역별 높이제한 별도 적용 (건축법 제60조)",
            "setback": "전면: 건축선 후퇴 1.5m 이상, 측면/후면: 0.5m 이상 (건축법 시행령 제80조의2)",
            "parking": "단독주택: 시설면적 150㎡ 초과 시 1대 (주차장법 시행령 별표1)",
            "landscape": "면적 200㎡ 이상 시 대지면적의 10% 이상 (건축법 제42조, 서울시 15%)",
            "sunlight_regulation": "정북일조 사선제한: 9m 이하 1.5m 이격, 9m 초과 시 H×0.5 이격 (건축법 시행령 §86)",
            "permitted_uses": ["단독주택", "다가구주택", "종교시설", "근린생활시설(일부)"],
            "prohibited_uses": ["공동주택(아파트)", "판매시설", "업무시설", "숙박시설", "공장"],
        },
    },
    "UQA111": {
        "related_law": "국토계획법 제36조, 동법시행령 제30조",
        "restriction_summary": "제1종전용주거: 단독주택 중심 양호한 주거환경 보호",
        "design_impact": "건폐율 50%, 용적률 50~100%. 단독·다가구주택 가능",
        "management_agency": "시·군·구청 도시과",
        "key_restrictions": ["4층 이하", "단독주택 위주", "공동주택 원칙 불가"],
        "ordinance_details": {
            "building_coverage": "50% 이하 (서울시 조례 50%)",
            "floor_area_ratio": "100% 이하 (서울시 조례 제55조)",
            "height_limit": "4층 이하. 가로구역별 높이제한 적용",
            "setback": "전면: 1.5m, 측면: 0.5m, 정북: 1.5m~H/2 (§86)",
            "parking": "단독주택: 150㎡ 초과 시 1대",
            "landscape": "200㎡ 이상 시 10~15%",
            "sunlight_regulation": "정북일조 사선제한 적용",
            "permitted_uses": ["단독주택", "다가구주택", "종교시설", "동사무소"],
            "prohibited_uses": ["아파트", "연립주택", "다세대주택", "판매시설", "업무시설"],
        },
    },
    "UQA112": {
        "related_law": "국토계획법 제36조, 동법시행령 제30조",
        "restriction_summary": "제2종전용주거: 공동주택 중심 양호한 주거환경 보호",
        "design_impact": "건폐율 50%, 용적률 100~150%. 공동주택 일부 허용",
        "management_agency": "시·군·구청 도시과",
        "key_restrictions": ["저층 공동주택 허용", "아파트 가능(규모 제한)"],
        "ordinance_details": {
            "building_coverage": "50% 이하 (서울시 조례 40%)",
            "floor_area_ratio": "150% 이하 (서울시 조례 120%)",
            "height_limit": "7층 이하 권장. 가로구역별 높이제한 적용",
            "setback": "전면: 2m, 측면: 1m, 정북: 1.5m~H/2",
            "parking": "공동주택: 세대당 1대 (주차장법 시행령)",
            "landscape": "대지면적의 15% 이상 (서울시 조례)",
            "sunlight_regulation": "정북일조 + 인동간격 확보 (건축법 §61)",
            "permitted_uses": ["단독주택", "공동주택(아파트·연립·다세대)", "종교시설", "근린생활시설(제한)"],
            "prohibited_uses": ["판매시설", "업무시설", "숙박시설", "공장", "위락시설"],
        },
    },
    "UQA121": {
        "related_law": "국토계획법 제36조, 동법시행령 제30조",
        "restriction_summary": "제1종일반주거: 저층 위주 주거 환경 보호",
        "design_impact": "건폐율 60%, 용적률 100~200%. 4층 이하 중심 개발",
        "management_agency": "시·군·구청 도시과",
        "key_restrictions": ["4층 이하", "건폐율 60%", "저층 주거 환경 보호"],
        "ordinance_details": {
            "building_coverage": "60% 이하 (서울시 조례 60%)",
            "floor_area_ratio": "200% 이하 (서울시 조례 150%)",
            "height_limit": "4층 이하 (서울시 도시계획 조례 §30). 가로구역별 최고높이 적용",
            "setback": "전면도로 폭 6m 미만: 건축선 후퇴 1m. 측면: 0.5m. 정북: 1.5m~H/2",
            "parking": "다가구주택: 시설면적 150㎡당 1대. 근린생활: 134㎡당 1대",
            "landscape": "대지면적 200㎡ 이상 시 10% 이상 (서울시 15%)",
            "sunlight_regulation": "정북일조 사선제한: 9m 이하→1.5m, 9m 초과→H×0.5. 인접대지 일조 2시간 확보",
            "permitted_uses": ["단독주택", "다가구주택", "제1종 근린생활시설", "종교시설", "교육연구시설(학교)"],
            "prohibited_uses": ["아파트(5층 이상)", "판매시설(1000㎡ 초과)", "숙박시설", "공장", "위락시설"],
        },
    },
    "UQA122": {
        "related_law": "국토계획법 제36조, 동법시행령 제30조",
        "restriction_summary": "제2종일반주거: 중층 위주 주거 환경 조성",
        "design_impact": "건폐율 60%, 용적률 150~250%. 18층 이하 공동주택 가능. 지자체 조례에 따라 층수 제한 가능",
        "management_agency": "시·군·구청 도시과",
        "key_restrictions": ["건폐율 60%", "용적률 250% 이하", "18층 이하(서울시 7~15층 세분화)"],
        "ordinance_details": {
            "building_coverage": "60% 이하 (서울시 조례)",
            "floor_area_ratio": "250% 이하 (서울시 제1종: 200%, 제2종: 250%)",
            "height_limit": "18층 이하 (법정). 서울시 7층/12층/15층 세분화 운용",
            "setback": "전면: 도로폭 기준 후퇴. 측면: 0.5~1m. 정북: H/2",
            "parking": "공동주택: 세대당 1대 (전용 85㎡ 초과 시 1.2대). 근린생활: 134㎡당 1대",
            "landscape": "대지면적 200㎡ 이상 시 15% (서울시), 공동주택 단지 30% 이상",
            "sunlight_regulation": "정북일조 사선제한 + 인동간격(H×0.8 이상). 일조 2시간/연속 4시간 확보",
            "permitted_uses": ["단독주택", "공동주택(아파트 18층 이하)", "제1·2종 근린생활시설", "종교시설", "교육연구시설"],
            "prohibited_uses": ["숙박시설(관광호텔 제외)", "위락시설", "공장", "위험물저장처리시설"],
        },
    },
    "UQA123": {
        "related_law": "국토계획법 제36조, 동법시행령 제30조",
        "restriction_summary": "제3종일반주거: 중·고층 주거 환경 조성",
        "design_impact": "건폐율 50%, 용적률 200~300%. 층수 제한 없음. 고층 공동주택 가능",
        "management_agency": "시·군·구청 도시과",
        "key_restrictions": ["건폐율 50%", "용적률 300% 이하", "층수 제한 없음"],
        "ordinance_details": {
            "building_coverage": "50% 이하 (서울시 조례 50%)",
            "floor_area_ratio": "300% 이하 (서울시 조례 250~300%)",
            "height_limit": "층수 제한 없음. 가로구역별 높이제한 적용. 일조권 사선제한으로 실질적 높이 결정",
            "setback": "전면: 도로폭 기준 후퇴. 측면: 1m. 정북: H/2. 공동주택은 인동간격 적용",
            "parking": "공동주택: 세대당 1대(85㎡ 초과 1.2대). 업무: 150㎡당 1대",
            "landscape": "500㎡ 이상 시 15%. 공동주택 단지 30% 이상 (서울시 조례)",
            "sunlight_regulation": "정북일조 사선제한 + 인동간격(H×1.0 이상). 동지일 기준 일조 2시간 확보",
            "permitted_uses": ["단독주택", "공동주택(층수 무제한)", "근린생활시설", "교육연구시설", "업무시설(일부)"],
            "prohibited_uses": ["위락시설", "공장", "위험물저장처리시설", "동물관련시설"],
        },
    },
    "UQA130": {
        "related_law": "국토계획법 제36조, 동법시행령 제30조",
        "restriction_summary": "준주거: 주거+상업 혼합 지역",
        "design_impact": "건폐율 70%, 용적률 200~500%. 주상복합 가능. 위락시설 일부 제한",
        "management_agency": "시·군·구청 도시과",
        "key_restrictions": ["건폐율 70%", "용적률 법정 500%", "주상복합·근린상업 혼합"],
        "ordinance_details": {
            "building_coverage": "70% 이하 (서울시 조례 60%)",
            "floor_area_ratio": "500% 이하 (서울시 조례 400%)",
            "height_limit": "층수 제한 없음. 가로구역별 높이제한 적용",
            "setback": "전면: 도로폭 기준 후퇴. 측면: 0.5m",
            "parking": "근린생활: 134㎡당 1대. 판매: 150㎡당 1대. 주택: 세대당 1대",
            "landscape": "대지면적 200㎡ 이상 시 10~15%",
            "sunlight_regulation": "정북일조 사선제한 적용 (주거용 건축물). 상업용은 완화",
            "permitted_uses": ["주택(주상복합 포함)", "근린생활시설", "판매시설", "업무시설", "숙박시설(일부)"],
            "prohibited_uses": ["위락시설(일부)", "공장", "위험물저장처리시설"],
        },
    },

    # ═══ 용도지역 (상업) ═══
    "UQA210": {
        "related_law": "국토계획법 제36조, 동법시행령 제30조",
        "restriction_summary": "중심상업: 도심·부도심 상업·업무 기능 핵심",
        "design_impact": "건폐율 90%, 용적률 400~1500%. 대규모 상업·업무시설 가능",
        "management_agency": "시·군·구청 도시과",
        "key_restrictions": ["건폐율 90%", "용적률 최대 1500%", "주거비율 제한"],
        "ordinance_details": {
            "building_coverage": "90% 이하 (서울시 조례 60%)",
            "floor_area_ratio": "1500% 이하 (서울시 조례 1000%)",
            "height_limit": "제한 없음. 가로구역별 높이제한 적용",
            "setback": "전면: 건축지정선 적용 (도심부 가로활성화). 대지 안의 공지 최소",
            "parking": "업무: 150㎡당 1대. 판매: 150㎡당 1대. 문화집회: 100석당 1대",
            "landscape": "대지면적의 5~10% (상업지 완화 적용)",
            "sunlight_regulation": "일조권 사선제한 비적용 (상업지역 특례). 채광 확보만 검토",
            "permitted_uses": ["업무시설", "판매시설", "숙박시설", "문화집회시설", "주상복합(주거비율제한)"],
            "prohibited_uses": ["공장", "위험물저장처리시설", "동물관련시설", "자원순환관련시설"],
        },
    },
    "UQA220": {
        "related_law": "국토계획법 제36조, 동법시행령 제30조",
        "restriction_summary": "일반상업: 일반 상업·업무 기능 담당",
        "design_impact": "건폐율 80%, 용적률 300~1300%. 다양한 용도 건축 가능",
        "management_agency": "시·군·구청 도시과",
        "key_restrictions": ["건폐율 80%", "용적률 1300% 이하", "가로활성화 건축지정선 적용 가능"],
        "ordinance_details": {
            "building_coverage": "80% 이하 (서울시 조례 60%)",
            "floor_area_ratio": "1300% 이하 (서울시 조례 800%)",
            "height_limit": "제한 없음. 가로구역별 높이제한 적용 (건축법 §60)",
            "setback": "전면: 도로폭 기준 후퇴 (8m 미만 시 가각전제). 측면: 민법 0.5m",
            "parking": "업무: 150㎡당 1대. 판매: 150㎡당 1대. 숙박: 객실당 0.5대",
            "landscape": "대지면적 200㎡ 이상 시 5~10%",
            "sunlight_regulation": "일조권 사선제한 비적용 (상업지역). 공동주택 건축 시 인동간격 적용",
            "permitted_uses": ["판매시설", "업무시설", "숙박시설", "문화집회시설", "운동시설", "주상복합"],
            "prohibited_uses": ["공장(일부)", "위험물저장처리시설", "동물관련시설"],
        },
    },
    "UQA230": {
        "related_law": "국토계획법 제36조, 동법시행령 제30조",
        "restriction_summary": "근린상업: 근린 생활 편의 제공",
        "design_impact": "건폐율 70%, 용적률 200~900%. 소규모 상가·근린생활시설 중심",
        "management_agency": "시·군·구청 도시과",
        "key_restrictions": ["건폐율 70%", "용적률 900% 이하", "근린생활 밀착형 상업"],
        "ordinance_details": {
            "building_coverage": "70% 이하 (서울시 조례 60%)",
            "floor_area_ratio": "900% 이하 (서울시 조례 600%)",
            "height_limit": "제한 없음. 가로구역별 높이제한 적용",
            "setback": "전면: 도로폭 기준. 측면: 0.5m",
            "parking": "근린생활: 134㎡당 1대. 판매: 150㎡당 1대",
            "landscape": "200㎡ 이상 시 5~10%",
            "sunlight_regulation": "일조권 사선제한 비적용 (상업지역)",
            "permitted_uses": ["근린생활시설", "판매시설", "업무시설", "숙박시설(일부)", "의료시설"],
            "prohibited_uses": ["위험물저장처리시설", "동물관련시설(대규모)"],
        },
    },
    "UQA240": {
        "related_law": "국토계획법 제36조, 동법시행령 제30조",
        "restriction_summary": "유통상업: 유통기능 증진 지역",
        "design_impact": "건폐율 80%, 용적률 200~1100%. 물류·유통시설 중심",
        "management_agency": "시·군·구청 도시과",
        "key_restrictions": ["물류·유통 특화", "대형 차량 동선 확보 필요"],
        "ordinance_details": {
            "building_coverage": "80% 이하 (서울시 조례 60%)",
            "floor_area_ratio": "1100% 이하 (서울시 조례 600%)",
            "height_limit": "제한 없음. 가로구역별 높이제한 적용",
            "setback": "전면: 대형차량 진출입 고려 후퇴. 하역장 확보 필수",
            "parking": "창고: 350㎡당 1대. 판매: 150㎡당 1대. 화물차 주차 별도 확보",
            "landscape": "200㎡ 이상 시 5%",
            "sunlight_regulation": "비적용 (상업지역)",
            "permitted_uses": ["판매시설", "운수시설", "창고시설", "업무시설", "운동시설"],
            "prohibited_uses": ["주거시설(주상복합 제외)", "위락시설", "동물관련시설"],
        },
    },

    # ═══ 용도지역 (공업) ═══
    "UQA310": {
        "related_law": "국토계획법 제36조",
        "restriction_summary": "전용공업: 중화학·공해성 공업 배치",
        "design_impact": "건폐율 70%, 용적률 150~300%. 주거 용도 불가",
        "management_agency": "시·군·구청 도시과",
        "key_restrictions": ["주거 용도 절대 불가", "중화학공업 특화", "환경영향평가 필수"],
        "ordinance_details": {
            "building_coverage": "70% 이하 (서울시 조례 60%)",
            "floor_area_ratio": "300% 이하 (서울시 조례 200%)",
            "height_limit": "제한 없음 (산업 특성상)",
            "setback": "전면: 도로폭 기준. 인접 주거지 경계 완충녹지 10m 이상",
            "parking": "공장: 200㎡당 1대",
            "landscape": "대지면적의 10% 이상. 외곽부 차폐식재",
            "sunlight_regulation": "비적용 (공업지역)",
            "permitted_uses": ["공장", "창고시설", "위험물저장처리시설", "자원순환관련시설"],
            "prohibited_uses": ["주택(모든 유형)", "학교", "병원", "숙박시설", "판매시설(대규모)"],
        },
    },
    "UQA320": {
        "related_law": "국토계획법 제36조",
        "restriction_summary": "일반공업: 환경악화 우려 적은 공업 배치",
        "design_impact": "건폐율 70%, 용적률 200~350%. 일부 주거 가능",
        "management_agency": "시·군·구청 도시과",
        "key_restrictions": ["환경 친화적 공업", "근린생활시설 일부 허용"],
        "ordinance_details": {
            "building_coverage": "70% 이하 (서울시 조례 60%)",
            "floor_area_ratio": "350% 이하 (서울시 조례 200%)",
            "height_limit": "제한 없음",
            "setback": "전면: 도로폭 기준 후퇴",
            "parking": "공장: 200㎡당 1대. 근린생활: 134㎡당 1대",
            "landscape": "10% 이상",
            "sunlight_regulation": "비적용",
            "permitted_uses": ["공장", "창고시설", "근린생활시설", "업무시설(일부)"],
            "prohibited_uses": ["아파트", "단독주택(일부 제한)", "학교", "병원", "숙박시설"],
        },
    },
    "UQA330": {
        "related_law": "국토계획법 제36조",
        "restriction_summary": "준공업: 경공업·주거·상업·업무 혼합",
        "design_impact": "건폐율 70%, 용적률 200~400%. 주상복합 가능",
        "management_agency": "시·군·구청 도시과",
        "key_restrictions": ["주거·상업 혼합 허용", "경공업+주상복합 가능"],
        "ordinance_details": {
            "building_coverage": "70% 이하 (서울시 조례 60%)",
            "floor_area_ratio": "400% 이하 (서울시 조례 400%)",
            "height_limit": "제한 없음. 주거용은 일조권 사선제한 적용",
            "setback": "전면 도로폭 기준. 공동주택: 정북일조 사선제한 적용",
            "parking": "공장: 200㎡당 1대. 주택: 세대당 1대. 업무: 150㎡당 1대",
            "landscape": "10~15%",
            "sunlight_regulation": "주거용 건축물에 한해 정북일조 사선제한 적용",
            "permitted_uses": ["공장(경공업)", "주택(주상복합)", "근린생활시설", "업무시설", "판매시설"],
            "prohibited_uses": ["위락시설", "위험물저장처리시설(대규모)"],
        },
    },

    # ═══ 용도지역 (녹지) ═══
    "UQA410": {
        "related_law": "국토계획법 제36조",
        "restriction_summary": "보전녹지: 도시 자연환경·경관·산림·녹지 보전",
        "design_impact": "건폐율 20%, 용적률 50~80%. 건축 대부분 제한. 기존 건축물 증축도 까다로움",
        "management_agency": "시·군·구청 도시과",
        "key_restrictions": ["건폐율 20%", "4층 이하", "건축 행위 극도 제한"],
        "ordinance_details": {
            "building_coverage": "20% 이하",
            "floor_area_ratio": "80% 이하 (서울시 조례 50%)",
            "height_limit": "4층 이하",
            "setback": "자연환경 보전 목적 이격 필요",
            "parking": "해당 시설 기준 적용",
            "landscape": "대지면적의 30% 이상 권장",
            "sunlight_regulation": "적용",
            "permitted_uses": ["농림축산업 시설", "종교시설(소규모)", "공익시설(한정)"],
            "prohibited_uses": ["주택(원칙)", "상업시설", "공장", "숙박시설"],
        },
    },
    "UQA420": {
        "related_law": "국토계획법 제36조",
        "restriction_summary": "생산녹지: 농업적 생산 활동 보전",
        "design_impact": "건폐율 20%, 용적률 50~100%. 농업 관련 시설 위주",
        "management_agency": "시·군·구청 도시과",
        "key_restrictions": ["농업 관련 시설만 허용", "4층 이하"],
        "ordinance_details": {
            "building_coverage": "20% 이하",
            "floor_area_ratio": "100% 이하 (서울시 조례 50%)",
            "height_limit": "4층 이하",
            "setback": "농지 보전 목적 이격",
            "parking": "해당 시설 기준 적용",
            "landscape": "20% 이상",
            "sunlight_regulation": "적용",
            "permitted_uses": ["농업시설", "축산시설", "창고(농산물)", "주택(농업인)"],
            "prohibited_uses": ["상업시설", "공장(비농업)", "숙박시설", "위락시설"],
        },
    },
    "UQA430": {
        "related_law": "국토계획법 제36조",
        "restriction_summary": "자연녹지: 도시 녹지공간 확보, 보전 필요성 낮은 지역",
        "design_impact": "건폐율 20%, 용적률 50~100%. 4층 이하 제한. 불가피한 경우만 개발 허용",
        "management_agency": "시·군·구청 도시과",
        "key_restrictions": ["건폐율 20%", "4층 이하", "개발행위 허가 필수"],
        "ordinance_details": {
            "building_coverage": "20% 이하",
            "floor_area_ratio": "100% 이하 (서울시 조례 50~100%)",
            "height_limit": "4층 이하 (건축법 시행령)",
            "setback": "전면: 2m 이상, 측면/후면: 1m 이상",
            "parking": "해당 시설 기준",
            "landscape": "대지면적의 20% 이상",
            "sunlight_regulation": "정북일조 사선제한 적용 (주거용)",
            "permitted_uses": ["단독주택", "종교시설", "학교", "의료시설(소규모)", "근린생활시설(소규모)"],
            "prohibited_uses": ["아파트", "대규모 판매시설", "공장", "숙박시설", "위락시설"],
        },
    },

    # ═══ 관리/농림/자연환경보전 ═══
    "UQB100": {
        "related_law": "국토계획법 제36조",
        "restriction_summary": "보전관리: 자연환경 보호·관리",
        "design_impact": "건폐율 20%, 용적률 80%. 개발 극도 제한",
        "management_agency": "시·군·구청",
        "key_restrictions": ["개발 극도 제한", "자연환경 보전 의무"],
    },
    "UQB200": {
        "related_law": "국토계획법 제36조",
        "restriction_summary": "생산관리: 농림업 생산 관리",
        "design_impact": "건폐율 20%, 용적률 80%. 농림 관련 시설 위주",
        "management_agency": "시·군·구청",
        "key_restrictions": ["농림업 위주", "비농업 건축 제한"],
    },
    "UQB300": {
        "related_law": "국토계획법 제36조",
        "restriction_summary": "계획관리: 계획적·체계적 관리 필요 지역",
        "design_impact": "건폐율 40%, 용적률 100%. 비도시지역 중 개발 여건이 좋은 곳",
        "management_agency": "시·군·구청",
        "key_restrictions": ["건폐율 40%", "용적률 100%", "개발행위허가 필수"],
        "ordinance_details": {
            "building_coverage": "40% 이하",
            "floor_area_ratio": "100% 이하",
            "height_limit": "3~4층 이하 권장",
            "setback": "전면: 2m 이상. 측면/후면: 1m 이상",
            "parking": "해당 시설 기준",
            "landscape": "15% 이상",
            "sunlight_regulation": "적용 (주거용)",
            "permitted_uses": ["단독주택", "근린생활시설(소규모)", "종교시설", "교육시설(학교)"],
            "prohibited_uses": ["대규모 공장", "위락시설", "위험물저장처리"],
        },
    },

    # ═══ 도시계획시설 (공원) ═══
    "UQT200": {
        "related_law": "도시공원 및 녹지 등에 관한 법률",
        "restriction_summary": "도시공원: 도시 자연경관 보호·시민 건강증진",
        "design_impact": "공원시설 외 건축행위 금지. 개발행위 극도 제한. 인접지 조경·일조 검토",
        "management_agency": "시·군·구청 공원녹지과",
        "key_restrictions": ["공원 부지 내 건축 불가", "인접 대지 조경·이격 검토"],
    },
    "UQT210": {
        "related_law": "도시공원 및 녹지 등에 관한 법률 제15조",
        "restriction_summary": "어린이공원: 어린이 놀이·휴식 공간. 최소면적 1,500㎡ 이상",
        "design_impact": "공원 부지 내 건축 제한. 인접 대지는 이격거리·일조 확보·소음 저감 검토 필요",
        "management_agency": "시·군·구청 공원녹지과",
        "key_restrictions": ["최소 1,500㎡ 확보", "소음 저감 설계 필요"],
    },
    "UQT220": {
        "related_law": "도시공원 및 녹지 등에 관한 법률 제15조",
        "restriction_summary": "근린공원: 주민 보건·휴양·정서함양 공간",
        "design_impact": "공원 내 건축제한·통과도로 금지. 인접지 건축 시 공원 접근성·조경 배치 고려",
        "management_agency": "시·군·구청 공원녹지과",
        "key_restrictions": ["통과도로 금지", "인접지 접근성 고려"],
    },
    "UQT230": {
        "related_law": "도시공원 및 녹지 등에 관한 법률",
        "restriction_summary": "소공원: 소규모 토지 활용 도시민 휴식 공간",
        "design_impact": "공원시설 외 건축 불가. 면적 250㎡ 이상",
        "management_agency": "시·군·구청 공원녹지과",
        "key_restrictions": ["최소 250㎡", "건축 불가"],
    },

    # ═══ 도시계획시설 (도로) ═══
    "UQS110": {
        "related_law": "도시계획시설 규칙 제9조",
        "restriction_summary": "도시계획도로: 도시 내 일반도로",
        "design_impact": "도로 부지 내 건축 불가. 건축선 후퇴(setback) 검토 필요. 차량 진출입 위치 제한 가능",
        "management_agency": "시·군·구청 도시과",
        "key_restrictions": ["도로 부지 건축 불가", "건축선 후퇴 검토", "진출입 위치 제한"],
    },
    "UQS120": {
        "related_law": "도시계획시설 규칙 제10조",
        "restriction_summary": "자동차전용도로: 고속 차량 이동 전용",
        "design_impact": "소음·진동 대책 필요. 차량 직접 진출입 불가. 방음벽·완충녹지 검토",
        "management_agency": "시·군·구청 도시과",
        "key_restrictions": ["직접 진출입 불가", "방음벽 필수", "완충녹지 확보"],
    },
    "UQS200": {
        "related_law": "도시계획시설 규칙",
        "restriction_summary": "광장: 도시 교통·문화·환경 공간",
        "design_impact": "부지 내 건축 불가. 지하공간 활용 가능성 검토",
        "management_agency": "시·군·구청 도시과",
        "key_restrictions": ["지상부 건축 불가", "지하 활용 가능"],
    },

    # ═══ 용도지구 ═══
    "UQG100": {
        "related_law": "국토계획법 제37조",
        "restriction_summary": "경관지구: 경관 보전·관리·형성",
        "design_impact": "건축물 높이·형태·색채 심의 필요. 스카이라인·조망권 확보 요구",
        "management_agency": "시·군·구청 도시과",
        "key_restrictions": ["경관심의 필수", "높이·형태·색채 제한", "조망권 확보"],
    },
    "UQH100": {
        "related_law": "국토계획법 제37조",
        "restriction_summary": "고도지구: 환경보전 위한 건축물 높이 제한",
        "design_impact": "최고고도·최저고도 지정. 절대높이 제한 직접 적용. 사전 확인 필수",
        "management_agency": "시·군·구청 도시과",
        "key_restrictions": ["절대높이 제한 적용", "사전 확인 필수"],
    },
    "UQI100": {
        "related_law": "국토계획법 제37조, 건축법 제51조",
        "restriction_summary": "방화지구: 화재 위험 예방 지역",
        "design_impact": "주요 구조부 내화구조 의무. 방화문·방화셔터 필수. 외벽 마감재 불연재료. 공사비 증가 고려",
        "management_agency": "소방서·시·군·구청",
        "key_restrictions": ["내화구조 의무", "불연재료 외벽", "방화문/셔터 필수", "공사비 10~15% 증가"],
    },
    "UQK100": {
        "related_law": "국토계획법 제37조",
        "restriction_summary": "보존지구: 문화재·전통건축 보존 지역",
        "design_impact": "문화재 주변 건축 심의. 높이·형태·색채 제한 강화. 현상변경 허가 필요",
        "management_agency": "문화재청·시·군·구청",
        "key_restrictions": ["문화재 심의 필수", "현상변경 허가 필요", "높이·형태 제한"],
    },
    "UQF100": {
        "related_law": "국토계획법 제37조",
        "restriction_summary": "방재지구: 풍수해·산사태 등 재해 예방",
        "design_impact": "방재시설 설치 의무. 지반 조사 강화. 우수저류시설 검토",
        "management_agency": "시·군·구청 안전과",
        "key_restrictions": ["방재시설 설치 의무", "지반 조사 강화", "우수저류시설 검토"],
    },

    # ═══ 용도구역 ═══
    "UQQ100": {
        "related_law": "국토계획법 제51조",
        "restriction_summary": "지구단위계획구역: 토지이용 합리화·기능 증진·환경 개선",
        "design_impact": "별도 지구단위계획 지침 적용. 건축물 용도·규모·배치·동선 세부 규정. 건폐율/용적률 완화 가능",
        "management_agency": "시·군·구청 도시과",
        "key_restrictions": ["지구단위계획 지침 사전 확인 필수", "건폐율/용적률 완화 가능", "건축심의 필수"],
    },
    "UQQ200": {
        "related_law": "국토계획법 제38조",
        "restriction_summary": "개발제한구역(그린벨트): 도시 무질서 확산 방지",
        "design_impact": "신규 건축 원칙적 불가. 기존 건축물 개축·증축 제한적 허용. 허가 매우 까다로움",
        "management_agency": "국토교통부·시·군·구청",
        "key_restrictions": ["신규 건축 원칙 불가", "개축/증축 제한적 허용", "허가 매우 까다로움"],
    },

    # ═══ 기타 규제구역 (교육/환경/보호) ═══
    "UQE100": {
        "related_law": "교육환경 보호에 관한 법률, 학교보건법",
        "restriction_summary": "절대보호구역 (절대정화구역): 학교 출입문 기준 50m 이내",
        "design_impact": "학교보건법에 따라 유해시설(오락실, 숙박시설, PC방 등) 전면 금지. 교육연구시설 건축 시 교실 조도 300Lux 이상, 환기량(21.6㎥/인·h) 등 교육환경 기준 적용 검토",
        "management_agency": "관할 교육청",
        "key_restrictions": ["출입문 50m 이내", "유해시설 전면 금지", "조도 300Lux / 환기량 기준", "교육환경평가 검토"],
    },
    "UQE200": {
        "related_law": "교육환경 보호에 관한 법률, 학교보건법",
        "restriction_summary": "상대보호구역 (상대정화구역): 학교 경계 기준 200m 이내",
        "design_impact": "학교보건법에 따른 일부 유해업소 제한 (교육환경보호위원회 심의 시 예외적 허용). 교육/학교시설 건축 시 교실 조도 300Lux 이상 및 환기 기준 준수 필요",
        "management_agency": "관할 교육청",
        "key_restrictions": ["학교 경계 200m 이내", "유해시설 원칙적 제한", "교육청 심의 가능", "조도 300Lux / 환기량 기준"],
    },
    "UBB100": {
        "related_law": "가축전염병예방법 제17조",
        "restriction_summary": "가축사육제한구역: 가축사육 제한·금지",
        "design_impact": "축사·가축분뇨 관련시설 설치 제한. 일반 건축에는 직접 영향 없음",
        "management_agency": "시·군·구청 축산과",
        "key_restrictions": ["축사 설치 제한"],
    },
    "URD100": {
        "related_law": "군사기지 및 군사시설 보호법 제4조",
        "restriction_summary": "대공방어협조구역: 군사시설 보호 목적",
        "design_impact": "고층건축물(항공장애물) 사전 협의 필요. 높이 제한 가능. 군부대 사전 협의 절차 추가",
        "management_agency": "국방부·관할 군부대",
        "key_restrictions": ["고층 건축 시 군 사전 협의", "높이 제한 가능"],
    },
    "URD110": {
        "related_law": "군사기지 및 군사시설 보호법 제4조",
        "restriction_summary": "비행안전구역: 항공기 비행 안전 확보",
        "design_impact": "절대높이 제한 엄격 적용. 구역별 높이기준 상이. 군 사전 협의 필수",
        "management_agency": "국방부·관할 군부대",
        "key_restrictions": ["절대높이 제한", "군 사전 협의 필수"],
    },
    "URD200": {
        "related_law": "군사기지 및 군사시설 보호법",
        "restriction_summary": "군사시설보호구역: 군 시설 보호",
        "design_impact": "건축행위 사전 허가·협의 필요. 개발행위 제한",
        "management_agency": "국방부·관할 군부대",
        "key_restrictions": ["건축 사전 허가 필요", "개발행위 제한"],
    },
    "URH100": {
        "related_law": "문화재보호법 제13조",
        "restriction_summary": "역사문화환경 보존지역",
        "design_impact": "문화재 영향 검토 의무. 높이·규모·디자인 심의. 현상변경 허가 필요",
        "management_agency": "문화재청",
        "key_restrictions": ["문화재 영향 검토", "현상변경 허가"],
    },
    "URA100": {
        "related_law": "수도법 제7조",
        "restriction_summary": "상수원보호구역: 상수원 수질 보전",
        "design_impact": "오염물질 배출시설 설치 금지. 건축 시 오수처리 강화",
        "management_agency": "환경부·수도사업자",
        "key_restrictions": ["오염 배출시설 금지", "오수처리 강화"],
    },
    "URC100": {
        "related_law": "산지관리법 제4조",
        "restriction_summary": "보전산지: 산림보전 의무 지역",
        "design_impact": "산지전용허가 매우 까다로움. 건축 원칙적 제한",
        "management_agency": "산림청·시·군·구청",
        "key_restrictions": ["산지전용허가 필수", "건축 원칙적 제한"],
    },
}


def get_regulation_detail(code: str, name: str = "") -> Optional[RegulationDetail]:
    """
    규제 코드 또는 명칭으로 상세 정보를 조회.
    
    조회 우선순위:
      1. 정확한 코드 매치 (UQA122)
      2. 코드 접두어 매치 (UQA12x → UQA120)
      3. 명칭 키워드 매치
    """
    def _build(info: dict) -> RegulationDetail:
        ord_data = info.get("ordinance_details")
        ord_obj = OrdinanceDetails(**ord_data) if ord_data else None
        return RegulationDetail(
            related_law=info.get("related_law", ""),
            restriction_summary=info.get("restriction_summary", ""),
            design_impact=info.get("design_impact", ""),
            management_agency=info.get("management_agency", ""),
            key_restrictions=info.get("key_restrictions", []),
            ordinance_details=ord_obj,
        )

    # 1. 정확한 코드 매치
    if code in REGULATION_DETAIL_DB:
        return _build(REGULATION_DETAIL_DB[code])
    
    # 2. 코드 접두어 매치 (점점 짧게)
    for trim_len, suffix in [(5, "0"), (4, "00"), (3, "100")]:
        if len(code) >= trim_len:
            prefix = code[:trim_len] + suffix
            if prefix in REGULATION_DETAIL_DB:
                return _build(REGULATION_DETAIL_DB[prefix])
    
    # 3. 명칭 키워드 매치
    name_clean = name.strip()
    if name_clean:
        for db_code, db_info in REGULATION_DETAIL_DB.items():
            summary = db_info.get("restriction_summary", "")
            if name_clean in summary or summary.split(":")[0].strip() in name_clean:
                return _build(db_info)
    
    return None
