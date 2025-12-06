// /includes/with_ai.js
// AI 울림 가이드: 입력 → AI 백엔드 호출 → 응답 출력

const aiInput = document.getElementById("aiInput");
const askBtn = document.getElementById("askBtn");
const aiResponse = document.getElementById("aiResponse");

// TODO: 실제 사용하는 API 엔드포인트로 바꾸면 됨.
// 예: "/api/with_ai" 또는 Supabase Functions URL 등
const AI_API_ENDPOINT = "/api/with_ai";

async function askGuidance() {
  if (!aiInput || !aiResponse) return;

  const text = aiInput.value.trim();
  if (!text) return;

  aiResponse.textContent = "울림을 정리하고 있습니다…";

  try {
    const res = await fetch(AI_API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: text })
    });

    if (!res.ok) {
      throw new Error("AI API 응답 오류");
    }

    const data = await res.json();
    const output =
      data.message || data.answer || data.result || "응답을 해석할 수 없습니다.";

    aiResponse.textContent = output;
  } catch (err) {
    console.error(err);
    aiResponse.textContent = "지금은 울림 안내를 불러오지 못했습니다.";
  }
}

if (askBtn) {
  askBtn.addEventListener("click", askGuidance);
}
