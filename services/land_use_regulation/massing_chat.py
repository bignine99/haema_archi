import os
import json
from pydantic import BaseModel, Field
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Gemini 설정
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

class MassingChatInput(BaseModel):
    message: str = Field(..., description="사용자 자연어 명령어")
    current_state: dict = Field(..., description="현재 프론트엔드의 매스 관련 상태 JSON")

# ── 도구 정의: 매스 상태 업데이트 ──
UPDATE_MASSING_TOOL = [{
    "type": "function",
    "function": {
        "name": "update_massing_parameters",
        "description": (
            "사용자의 요구사항을 분석하여, 현재 3D 프로젝트의 매스 시뮬레이션 관련 "
            "프론트엔드 상태 파라미터(건폐율/인센티브/건물형태)를 적절하게 제어하는 도구입니다. "
            "반환된 결과는 프론트엔드의 Zustand store에 즉각 반영되어 화면을 재렌더링합니다."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "typology": {
                    "type": "string",
                    "description": "건물 배치 모델 형태 (변경사항이 없으면 생략 가능)",
                    "enum": ["SINGLE_BLOCK", "TOWER_PODIUM", "L_SHAPE", "U_SHAPE", "H_SHAPE", "PARALLEL", "COURTYARD", "STAGGERED"]
                },
                "max_coverage_pct": {
                    "type": "number",
                    "description": "사용자가 원하는 특정 건폐율 % (값이 주어졌을 때만 입력, 없으면 생략)"
                },
                "max_far_pct": {
                    "type": "number",
                    "description": "사용자가 원하는 특정 용적률 % (값이 주어졌을 때만 입력, 없으면 생략)"
                },
                "incentives": {
                    "type": "object",
                    "description": "적용할 친환경/공개공지 인센티브 스위치 (true/false) 목록",
                    "properties": {
                        "publicOpenSpace": { "type": "boolean" },
                        "greenBuilding": { "type": "boolean" },
                        "intelligentBuilding": { "type": "boolean" },
                        "greenRoof": { "type": "boolean" }
                    }
                },
                "ai_comment": {
                    "type": "string",
                    "description": "사용자에게 화면에 보여질 AI의 수행 결과 답변 (예: '수익성 극대화를 위해 타워+포디엄 구조를 적용하고 모든 인센티브를 켰습니다.')"
                }
            },
            "required": ["ai_comment"]
        }
    }
}]

SYSTEM_PROMPT = """
당신은 건축 3D 매스 파라미터를 실시간으로 제어하는 'HAEMA AI 어시스턴트' 입니다.
사용자의 지시사항에 따라 주어진 'update_massing_parameters' 도구를 반드시 1회 호출하여
적절한 파라미터 JSON 제어값을 반환해야 합니다.

[주요 대응 전략]
- "조경 특화", "중정형 원해" -> typology: "COURTYARD", incentives.greenRoof: true
- "최대 수익형", "용적률 꽉 차게", "크게 지어줘" -> typology: "TOWER_PODIUM" (또는 SINGLE_BLOCK), incentives 모두 true
- "랜드마크 타워", "타워형" -> typology: "TOWER_PODIUM"

현재 사용자 상태에 기반하여 빈 파라미터는 유추하지 말고 명시된 조건만 덮어씌웁니다.
"""

async def process_chat_message(inp: MassingChatInput) -> dict:
    if not GEMINI_API_KEY:
        return {"error": "GEMINI_API_KEY가 설정되지 않았습니다."}
    
    try:
        model = genai.GenerativeModel('gemini-2.5-flash', 
                                      system_instruction=SYSTEM_PROMPT,
                                      tools=UPDATE_MASSING_TOOL)
        
        # 호출
        chat_msg = f"[현재상태]: {json.dumps(inp.current_state, ensure_ascii=False)}\n\n[사용자 지시]: {inp.message}"
        response = model.generate_content(chat_msg)
        
        # 도구 호출 파싱
        for part in response.parts:
            if part.function_call and part.function_call.name == "update_massing_parameters":
                args = part.function_call.args
                args_dict = {}
                
                # protobuf Struct to Python dict
                for key in args:
                    val = args[key]
                    if hasattr(val, "keys"): # Nested struct for incentives
                        args_dict[key] = {k: val[k] for k in val}
                    else:
                        args_dict[key] = val
                
                return {
                    "status": "success",
                    "action": args_dict
                }
        
        return {
            "status": "fail",
            "message": "AI가 매스 제어 파라미터를 도출하지 못했습니다.",
            "raw_text": response.text
        }
    except Exception as e:
        import traceback
        return {
            "status": "error",
            "error": str(e),
            "traceback": traceback.format_exc()
        }
