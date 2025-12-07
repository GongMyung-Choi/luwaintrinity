// br_chat.js — 숨틔움방 하이브 엔진 최종본(5차)
// 기능: 
//  - DB 저장/불러오기
//  - AI 자동응답
//  - 감정/부하 분석(processBreathingAI)
//  - 퍼스나 라우팅(routeToPersona)
//  - 톤조절(부드럽고 안정된 숨틔움 톤)
//  - 퍼스나별 맞춤 지시문 적용

import { supabase } from "/os/assets/js/core/supabase_client.js";
import { processBreathingAI } from "/includes/br_ai_engine.js";
import { routeToPersona } from "/includes/br_hive_router.js";

const input = document.getElementById("chatInput");
const sendBtn = document.getElementById("chatSend");
const msgBox = document.getElementById("chatMessages");

// ---------------------- 메시지 표시 ----------------------
function renderMessage(role, text, time) {
  const div = document.createElement("div");
  div.className = role === "user" ? "msg user" : "msg ai";
  div.innerHTML = `
    <div class="bubble">${text}</div>
    <div class="time">${new Date(time).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    })}</div>
  `;
  msgBox.appendChild(div);
  msgBox.scrollTop = msgBox.scrollHeight;
}

// ---------------------- DB 로드 ----------------------
async function loadMessages() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data, error } = await supabase
    .from("breathing_messages")
    .select("*")
    .eq("user_id", user.id)
    .order("id", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  msgBox.innerHTML = "";
  data.forEach((m) => {
    const role = m.persona === "user" ? "user" : "ai";
    renderMessage(role, m.message, m.created_at);
  });
}

// ---------------------- DB 저장 ----------------------
async function saveMessage(role, text) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("breathing_messages")
    .insert({
      user_id: user.id,
      persona: role,
      message: text,
      created_at: new Date().toISOString(),
    });

  if (error) console.error(error);
}

// ---------------------- 퍼스나 응답 생성 ----------------------
async function generatePersonaReply(persona, instruction, softenedText) {
  const result = await fetch("/os/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
당신은 '${persona}' 퍼스나입니다.
아래 지시문에 따라 응답하세요:

지시문:
${instruction}

규칙:
- 숨틔움 톤 유지 (부드럽고 짧고 안정감)
- 압박 없음
- 설명은 간단하게
- 사용자에게 안전한 템포 제공
- 장황 금지
          `
        },
        { role: "user", content: softenedText }
      ],
      max_tokens: 160
    })
  }).then(r => r.json()).catch(() => null);

  return result?.choices?.[0]?.message?.content || "응답 오류";
}

// ---------------------- 전체 처리 ----------------------
async function handleSend() {
  const text = input.value.trim();
  if (!text) return;

  const now = new Date();

  // 1) 사용자 메시지 표시
  renderMessage("user", text, now);

  // 2) DB 저장
  await saveMessage("user", text);

  // 3) 입력창 비우기
  input.value = "";

  // 4) 숨틔움 엔진 분석(감정/overload/요약/톤조절)
  const aiData = await processBreathingAI(text);
  // aiData = {emotion, overload, summary, softened}

  // 5) 하이브 라우팅 엔진으로 퍼스나 결정
  const route = await routeToPersona(text, aiData.emotion, aiData.overload);
  const persona = route.persona;
  const instruction = route.instruction;

  // 6) 최종 응답 생성(선택된 퍼스나 스타일)
  const reply = await generatePersonaReply(persona, instruction, aiData.softened);

  // 7) 화면 표시
  renderMessage("ai", reply, new Date());

  // 8) DB 저장
  await saveMessage("ai", reply);
}

sendBtn.onclick = handleSend;

input.onkeydown = (e) => {
  if (e.key === "Enter") handleSend();
};

// ---------------------- 실행 ----------------------
loadMessages();
