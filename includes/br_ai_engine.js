// br_ai_engine.js
// 숨틔움 고급 알고리즘 엔진 3차 버전
// 기능: 감정 분석 / 톤 조절 / 부하 판단 / 요약 / 안정화 변환

export async function processBreathingAI(userText) {

  // -----------------------------
  // 1) 감정 분석 (GPT 기반)
  // -----------------------------
  const emotionRes = await fetch("/os/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "너는 감정 분석기다. 문장에서 감정만 단일 단어로 출력해라. 예: calm, stressed, angry, confused, tired, neutral" },
        { role: "user", content: userText }
      ],
      max_tokens: 5
    })
  }).then(r => r.json()).catch(() => null);

  const emotion = emotionRes?.choices?.[0]?.message?.content?.trim() || "neutral";

  
  // -----------------------------
  // 2) 부하(Overload) 신호 감지
  // -----------------------------
  const overloadRes = await fetch("/os/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "문장이 복잡하거나 급하거나 혼란스러우면 1, 안정적이면 0을 출력해라." },
        { role: "user", content: userText }
      ],
      max_tokens: 2
    })
  }).then(r => r.json()).catch(() => null);

  const overload = Number(overloadRes?.choices?.[0]?.message?.content?.trim()) || 0;


  // -----------------------------
  // 3) 문장 요약 (핵심만 압축)
  // -----------------------------
  const summaryRes = await fetch("/os/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "사용자의 메시지를 핵심만 남기고 1~2줄로 아주 짧게 요약하라." },
        { role: "user", content: userText }
      ],
      max_tokens: 60
    })
  }).then(r => r.json()).catch(() => null);

  const summary = summaryRes?.choices?.[0]?.message?.content?.trim() || userText;


  // -----------------------------
  // 4) 톤 안정화 변환 (숨틔움 톤)
  // -----------------------------
  const toneRes = await fetch("/os/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
너는 '숨틔움 보조 톤 변환기'이다.  
사용자의 말투를 다음 기준으로 바꿔라:

- 짧게 (1~2 문장)
- 부드럽게
- 압박감 없이
- 불안감 낮추는 말투
- 위로하려 하지 말고 '정리해주는' 느낌
- 필요하면 '천천히 해도 돼' 같은 템포 안정 추가

출력은 변환된 문장만.
          `
        },
        { role: "user", content: summary }
      ],
      max_tokens: 120
    })
  }).then(r => r.json()).catch(() => null);

  const softened = toneRes?.choices?.[0]?.message?.content?.trim() || summary;


  // -----------------------------
  // 5) 종합 결과 반환
  // -----------------------------
  return {
    emotion,
    overload,
    summary,
    softened
  };
}
