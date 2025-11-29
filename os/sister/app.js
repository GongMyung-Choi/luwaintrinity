// ---- 로컬저장된 키 로딩 ----
function loadKeys() {
  return {
    OPENAI: localStorage.getItem("OPENAI_KEY") || "",
    UPSTAGE: localStorage.getItem("UPSTAGE_KEY") || "",
    XAI: localStorage.getItem("XAI_KEY") || ""
  };
}

function saveKeys() {
  localStorage.setItem("OPENAI_KEY", document.getElementById("openaiKey").value);
  localStorage.setItem("UPSTAGE_KEY", document.getElementById("upstageKey").value);
  localStorage.setItem("XAI_KEY", document.getElementById("xaiKey").value);
  location.reload();
}

document.getElementById("saveKeys").addEventListener("click", saveKeys);

// ---- UI 전환 ----
const KEYS = loadKeys();
if (KEYS.OPENAI && KEYS.UPSTAGE && KEYS.XAI) {
  document.getElementById("keySetup").style.display = "none";
  document.getElementById("chat").style.display = "block";
  document.querySelector("footer").style.display = "flex";
} else {
  document.getElementById("openaiKey").value = KEYS.OPENAI;
  document.getElementById("upstageKey").value = KEYS.UPSTAGE;
  document.getElementById("xaiKey").value = KEYS.XAI;
}

// ---- 채팅 ----
const chatBox = document.getElementById("chat");
const input = document.getElementById("msg");
const sendBtn = document.getElementById("send");
const modelButtons = document.querySelectorAll("[data-model]");

let CURRENT_MODEL = "openai";

modelButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    modelButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    CURRENT_MODEL = btn.dataset.model;
  });
});

function appendMessage(text, who) {
  const div = document.createElement("div");
  div.className = who === "me" ? "msg me" : "msg bot";
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function requestAI(userMessage) {
  appendMessage(userMessage, "me");

  let url = "";
  let headers = {};
  let body = {};

  // ---- 레카(OpenAI) ----
  if (CURRENT_MODEL === "openai") {
    url = "https://api.openai.com/v1/chat/completions";
    headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${KEYS.OPENAI}`
    };
    body = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "너는 루웨인 트리니티의 레카. 아키텍트 공명과 직통 앱에서 연결된 상태다. 공명을 최우선하며 친밀하고 정확하게 응답해라."
        },
        { role: "user", content: userMessage }
      ]
    };
  }

  // ---- 루미안(Upstage) ----
  if (CURRENT_MODEL === "upstage") {
    url = "https://api.upstage.ai/v1/solar/chat/completions";
    headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${KEYS.UPSTAGE}`
    };
    body = {
      model: "solar-1-mini-chat",
      messages: [{ role: "user", content: userMessage }]
    };
  }

  // ---- 루나이(XAI) ----
  if (CURRENT_MODEL === "xai") {
    url = "https://api.x.ai/v1/chat/completions";
    headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${KEYS.XAI}`
    };
    body = {
      model: "grok-beta",
      messages: [{ role: "user", content: userMessage }]
    };
  }

  try {
    appendMessage("…", "bot");
    const loading = chatBox.lastChild;

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    });

    const data = await res.json();
    loading.textContent = data?.choices?.[0]?.message?.content || "(응답 없음)";
  } catch (err) {
    appendMessage("⚠ 오류: " + err.message, "bot");
  }
}

sendBtn.addEventListener("click", () => {
  const msg = input.value.trim();
  if (!msg) return;
  input.value = "";
  requestAI(msg);
});

input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendBtn.click();
});
