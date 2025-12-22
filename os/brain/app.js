// /app.js

const output = document.getElementById("output");
const input = document.getElementById("input");
const send = document.getElementById("send");

// ✅ 기본 UI(어두움 방지). CSS로 해도 되지만 급하면 JS로 박아버림.
document.body.style.background = "#f6f6f6";
document.body.style.color = "#111";
output.style.minHeight = "60vh";
output.style.padding = "12px";
output.style.background = "#fff";
output.style.border = "1px solid #ddd";
output.style.borderRadius = "10px";
output.style.overflowY = "auto";

input.style.width = "70%";
input.style.padding = "12px";
input.style.fontSize = "16px";
input.style.borderRadius = "10px";
input.style.border = "1px solid #bbb";

send.style.padding = "12px 18px";
send.style.fontSize = "16px";
send.style.borderRadius = "10px";
send.style.border = "0";
send.style.cursor = "pointer";

// ✅ 엔터 = 전송 (PC)
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    send.click();
  }
});

function addLine(who, text) {
  const div = document.createElement("div");
  div.style.padding = "10px 12px";
  div.style.margin = "8px 0";
  div.style.borderRadius = "10px";
  div.style.border = "1px solid #eee";
  div.style.whiteSpace = "pre-wrap";
  div.style.wordBreak = "break-word";

  if (who === "YOU") {
    div.style.background = "#fff8d6";
  } else if (who === "REKA") {
    div.style.background = "#eaf3ff";
  } else {
    div.style.background = "#ffecec";
    div.style.border = "1px solid #ffb7b7";
  }

  div.innerHTML = `<b>${who}:</b> ${escapeHtml(text)}`;
  output.appendChild(div);
  output.scrollTop = output.scrollHeight;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

send.onclick = async () => {
  const msg = input.value.trim();
  if (!msg) return;

  addLine("YOU", msg);
  input.value = "";
  input.focus();

  // 전송 중 표시(침묵 방지)
  const thinking = document.createElement("div");
  thinking.style.opacity = "0.7";
  thinking.style.padding = "8px 0";
  thinking.textContent = "REKA: …";
  output.appendChild(thinking);
  output.scrollTop = output.scrollHeight;

  try {
    const r = await fetch("/api/brain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg }),
    });

    const text = await r.text(); // 먼저 raw로
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: "Invalid JSON from /api/brain", details: text };
    }

    thinking.remove();

    if (!r.ok) {
      addLine("ERR", `${data.error || "Request failed"}\n${data.details || ""}`);
      return;
    }

    addLine("REKA", data.reply || "(빈 응답)");
  } catch (e) {
    thinking.remove();
    addLine("ERR", `네트워크/스크립트 에러: ${String(e?.message || e)}`);
  }
};
