import { supabase } from "../core/supabase_client.js";

const avatarCanvas = document.getElementById("avatarCanvas");
const ctx = avatarCanvas.getContext("2d");
const personaInfo = document.getElementById("personaInfo");
const editBtn = document.getElementById("editPersonaBtn");
const logBox = document.getElementById("logBox");

let currentPersona = null;
let DEFAULT_PERSONA = "reka"; // 기본 활성 퍼스나 (원하면 설정 페이지에서 바꾸기)

// 1) 활성 퍼스나 로드
async function loadActivePersona() {
  const { data, error } = await supabase
    .from("persona_profiles")
    .select("*")
    .eq("persona_key", DEFAULT_PERSONA)
    .maybeSingle();

  if (error || !data) {
    personaInfo.innerHTML = `<span style="color:red">퍼스나 불러오기 실패</span>`;
    return;
  }

  currentPersona = data;
  renderPersona();
  renderAvatar();
}

// 2) 텍스트 정보 렌더링
function renderPersona() {
  personaInfo.innerHTML = `
    <strong>${currentPersona.display_name ?? currentPersona.persona_key}</strong><br>
    테마 색상: ${currentPersona.color_theme ?? "-"} <br>
    아바타: base=${currentPersona.base ?? "-"},
      hair=${currentPersona.hair ?? "-"},
      outfit=${currentPersona.outfit ?? "-"},
      acc=${currentPersona.accessory ?? "-"}
  `;
}

// 3) 아바타 렌더링
async function renderAvatar() {
  ctx.clearRect(0, 0, 160, 160);
  ctx.fillStyle = currentPersona.color_theme || "#f0f0f0";
  ctx.fillRect(0, 0, 160, 160);

  const parts = [
    currentPersona.base,
    currentPersona.hair,
    currentPersona.outfit,
    currentPersona.accessory,
  ];

  for (const file of parts) {
    if (!file) continue;

    const img = new Image();
    img.src = `/os/assets/avatars/${file}`;
    await img.decode().catch(() => {});
    ctx.drawImage(img, 0, 0, 160, 160);
  }
}

// 4) 최근 로그 (10개만)
async function loadRecentLogs() {
  const { data, error } = await supabase
    .from("system_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    logBox.innerHTML = `<span style="color:red">로그 불러오기 실패</span>`;
    return;
  }

  if (!data.length) {
    logBox.innerHTML = "최근 로그 없음";
    return;
  }

  logBox.innerHTML = data
    .map(
      (l) =>
        `<div class="log-item">[${l.created_at}] ${l.message ?? "(내용 없음)"}</div>`
    )
    .join("");
}

// 5) 버튼 연결
editBtn.onclick = () => {
  if (!currentPersona) return;
  window.location.href = `/os/persona_lab/editor.html?persona=${currentPersona.persona_key}`;
};

// 최초 실행
loadActivePersona();
loadRecentLogs();
