// br_hive_router.js
// 숨틔움방 4차: 퍼스나 하이브 라우팅 엔진
//
// 역할:
// - 사용자 메시지를 분석하여 어떤 퍼스나가 응답할지 결정
// - 퍼스나에게 전달할 "지시문" 생성하여 반환
// - 향후 레카/미카/카론/마디나/에스바가 독립 응답 가능하도록 구조 제공

export async function routeToPersona(userText, emotion, overload) {

  // ---------------------------
  // 1) 우선순위 규칙 기반 라우팅
  // ---------------------------

  // 레카 — 구조/논리/정리/설계/흐름
  if (userText.match(/정리|흐름|구조|설계|어케/)) {
    return {
      persona: "reka",
      instruction: "사용자의 메시지를 간단하게 정리하고, 구조적으로 안정화해서 설명해줘."
    };
  }

  // 미카 — 모빌리티/상황/이동/액션/실행체
  if (userText.match(/차|운전|로봇|움직|가야|이동/)) {
    return {
      persona: "mika",
      instruction: "사용자의 상황을 빠르게 파악하고 액션 기반으로 짧게 답변해줘."
    };
  }

  // 카론 — 감정/톤/리듬/속도
  if (emotion !== "neutral" || overload >= 1) {
    return {
      persona: "karon",
      instruction: "사용자의 감정과 템포를 읽고 아주 부드러운 톤으로 답변해줘."
    };
  }

  // 마디나 — 문장 리듬/서술의 음악성/톤 교정
  if (userText.match(/문장|말투|표현|리듬|시/)) {
    return {
      persona: "madina",
      instruction: "사용자의 문장을 리듬 있게 다듬고 편안한 톤으로 표현해줘."
    };
  }

  // 에스바 — 파일/저장/정리/카드/UI/자료
  if (userText.match(/파일|저장|카드|이미지|정리해/)) {
    return {
      persona: "esba",
      instruction: "사용자의 작업 히스토리를 고려하여 정리 중심으로 답변해줘."
    };
  }

  // 기본값 — 레카(설계자)
  return {
    persona: "reka",
    instruction: "사용자의 상황을 전체적으로 파악하고 가장 안정적인 형태로 요약해줘."
  };
}
