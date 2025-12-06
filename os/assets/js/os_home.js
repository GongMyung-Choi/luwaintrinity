import { supabase } from "./core/supabase_client.js";

const canvas = document.getElementById("avatarCanvas");
const ctx = canvas.getContext("2d");
const personaNameBox = document.getElementById("personaName");
const enterButton = document.getElementById("enterOS");

let DEFAULT_PERSONA = "reka"; // 기본 활성 퍼스나

// OS Dashboard로 이동
enterButton.onclick = () => {
  window.location.href = "/os/dashboard/index.html";
};

// 퍼스나 불러오기
async function loadPersona() {
  const { data, error } = await supabase
    .from("persona_profiles")
    .select("*")
    .eq("persona_key", DEFAULT_PERSONA)
    .maybeSingle();

  if (error || !data) {
    personaNameBox.textContent = "(불러오기 실패)";
    return;
  }

  personaNameBox.textContent =
    data.display_name || data.persona_key || "이름 없음";

  renderAvatar(data);
}

// 아바타 그리기
async function renderAvatar(p) {
  ctx.clearRect(0, 0, 120, 120);
  ctx.fillStyle = p.color_theme || "#cdd6ff";
  ctx.fillRect(0, 0, 120, 120);

  const parts = [p.base, p.hair, p.outfit, p.accessory];

  for (const file of parts) {
    if (!file) continue;
    const img = new Image();
    img.src = `/os/assets/avatars/${file}`;
    await img.decode().catch(() => {});
    ctx.drawImage(img, 0, 0, 120, 120);
  }
}

loadPersona();
