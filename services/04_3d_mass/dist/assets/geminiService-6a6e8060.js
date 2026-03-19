import{a8 as f}from"./index-4518325a.js";const h="gemini-2.5-flash-lite",N=`당신은 건축 설계 전문가입니다. 아래 "과업지시서" 원문을 매우 꼼꼼하게 읽고 분석한 후, 설계자가 반드시 인지해야 할 핵심 사항만 추출하여 JSON 형식으로 제공하세요.

★ 핵심 원칙 ★
1. 원문을 그대로 복사하지 마세요. 반드시 핵심만 요약하세요.
2. 각 항목은 1줄(최대 50자) 이내의 불릿 스타일로 작성하세요.
3. 구체적인 숫자(면적, 거리, 기간, 등급 등)는 반드시 포함하세요.
4. 제목, 소제목, 법규 명칭만 나열하지 마세요.
5. "~하여야 한다", "~에 의거하여" 같은 관료적 표현은 제거하세요.
6. 설계자가 실무에서 바로 활용할 수 있는 액션 가능한 정보만 포함하세요.

★ 반환 형식 (반드시 순수 JSON만 반환) ★
{
  "designDirection": ["설계 방향 핵심 3~5개 (예: 친환경 패시브 설계 적용, ZEB 4등급 인증 필수)"],
  "generalGuidelines": ["일반지침 핵심 4~6개 (예: 착수일로부터 180일 이내 설계 완료, VE 2회 실시 필수)"],
  "designGuidelines": ["설계지침 핵심 4~6개 (예: 복도폭 2.4m 이상 확보, 내진 I등급 적용, 층고 3.6m 이상)"],
  "keyNotes": ["주요 확인사항 4~6개 (예: 석면 자재 사용 절대 금지, 소방차 진입로 6m 확보 필수)"],
  "deliverables": ["성과품 키워드 (예: 기본설계도서, 실시설계도서, 구조계산서)"],
  "certifications": ["인증 사항 (예: ZEB 4등급, BF 예비인증, CPTED)"]
}

★ 좋은 예시 ★
- "착수일로부터 180일 이내 실시설계 완료"
- "내진 I등급 적용, 중요도 계수 1.5"
- "복도폭 최소 2.4m, 계단폭 1.5m 이상"
- "배기구 이격거리 5m 이상 확보"
- "제로에너지건축물 4등급 예비인증 필수"
- "소방차 진입로 6m 이상 확보"

★ 나쁜 예시 (이렇게 작성하지 마세요) ★
- "건축법 시행령 제46조에 의거하여 방화구획을 설치하여야 한다" → 너무 길고 법률 인용
- "일반사항" → 제목만 나열
- "관련 법규 및 기준 적용 준수" → 원론적 문구

과업지시서 원문:
`;async function S(G){var o,r,l,a,c,g,d,u,m;try{const i=f.getState().geminiApiKey;if(!i)return console.error("[Gemini] API 키가 입력되지 않았습니다."),null;const y=`https://generativelanguage.googleapis.com/v1beta/models/${h}:generateContent?key=${i}`;let n=G;n.length>15e3&&(n=n.substring(0,1e4)+`

... (중간 생략) ...

`+n.substring(n.length-5e3));const t=await fetch(y,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:N+n}]}],generationConfig:{temperature:.2,maxOutputTokens:2048,responseMimeType:"application/json"}})});if(!t.ok)return console.error("[Gemini] API 호출 실패:",t.status,t.statusText),null;const s=await t.json(),p=(c=(a=(l=(r=(o=s==null?void 0:s.candidates)==null?void 0:o[0])==null?void 0:r.content)==null?void 0:l.parts)==null?void 0:a[0])==null?void 0:c.text;if(!p)return console.error("[Gemini] 응답에 텍스트 없음"),null;const e=JSON.parse(p);return console.log("[Gemini] 분석 완료:",{designDirection:((g=e.designDirection)==null?void 0:g.length)||0,generalGuidelines:((d=e.generalGuidelines)==null?void 0:d.length)||0,designGuidelines:((u=e.designGuidelines)==null?void 0:u.length)||0,keyNotes:((m=e.keyNotes)==null?void 0:m.length)||0}),{designDirection:e.designDirection||[],generalGuidelines:e.generalGuidelines||[],designGuidelines:e.designGuidelines||[],keyNotes:e.keyNotes||[],deliverables:e.deliverables||[],certifications:e.certifications||[]}}catch(i){return console.error("[Gemini] 오류:",i),null}}export{S as analyzeWithGemini};
