// /includes/with_ai.js

const aiInput = document.getElementById("aiInput");
const askBtn = document.getElementById("askBtn");
const aiResponse = document.getElementById("aiResponse");

async function askGuidance() {
  const text = (aiInput?.value || "").trim();
  if (!text) return;

  aiResponse.textContent = "정리 중…";

  // 1) 입력 자체를 DB에 저장
  const user = await getCurrentUser();
  const base = {
    input_text: text,
    created_at: new Date().toISOString(),
  };
  if (user) base.user_id = user.id;

  // 2) AI 응답 생성 (임시 — 나중에 네가 원하는 방식으로 교체)
  const aiAnswer = `울림 처리 결과\n(${text.length}자 입력)`;  

  base.ai_answer = aiAnswer;

  // 3) DB 저장
  await supabase.from("reverberation_ai_guide").insert(base);

  // 4) 화면 출력
  aiResponse.textContent = aiAnswer;
}

if (askBtn) askBtn.addEventListener("click", askGuidance);
