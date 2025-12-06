import { supabase } from "../core/supabase_client.js";

// DOM
const infoBox = document.getElementById("infoBox");
const canvas = document.getElementById("avatarCanvas");
const ctx = canvas.getContext("2d");

const editBtn = document.getElementById("editBtn");
const backBtn = document.getElementById("backBtn");

let persona = null;

// URL에서 persona key 가져오기
function getKey() {
  const p = new URLSearchParams(location.search);
  return p.get("persona");
}

async function loadPersona() {
  const key = getKey();
  if (!key) {
    infoBox.innerHTML = `<p style="color:red;">persona 파라미터가 없습니다.</p>`;
    return;
  }

  const { data, error } = await supabase
    .from("persona_profiles")
    .select("*")
    .eq("persona_key", key)
    .maybeSingle();

  if (error || !data) {
    infoBox.innerHTML = `<p style="color:red;">퍼스나 불러오기 실패</p>`;
    return;
  }

  persona = data;
  renderInfo();
  renderAvatar();
}

// 정보 패널 렌더링
function renderInfo() {
  infoBox.innerHTML = `
    <p><strong>퍼스나 키:</strong> ${persona.persona_key}</p>
    <p><strong>표시 이름:</strong> ${persona.display_name ?? "-"}</p>

    <p><strong>아바타 파츠:</strong><br>
      <span class="tag">base: ${persona.base ?? "-"}</span>
      <span class="tag">hair: ${persona.hair ?? "-"}</span>
      <span class="tag">outfit: ${persona.outfit ?? "-"}</span>
      <span class="tag">acc: ${persona.accessory ?? "-"}</span>
    </p>

    <p><strong>테마 색상:</strong><br>
      ${persona.color_theme ? `<span class="tag">${persona.color_theme}</span>` : "-"}
    </p>

    <p><strong>업데이트:</strong> ${persona.updated_at}</p>
  `;
}

// 아바타 미니 렌더
async function renderAvatar() {
  ctx.clearRect(0, 0, 200, 200);
  ctx.fillStyle = persona.color_theme || "#f0f0f0";
  ctx.fillRect(0, 0, 200, 200);

  const parts = [
    persona.base,
    persona.hair,
    persona.outfit,
    persona.accessory
  ];

  for (const file of parts) {
    if (!file) continue;

    const img = new Image();
    img.src = `/os/assets/avatars/${file}`;
    await img.decode().catch(() => {});
    ctx.drawImage(img, 0, 0, 200, 200);
  }
}

// 버튼 연결
editBtn.onclick = () => {
  if (!persona) return;
  window.location.href = `/os/persona_lab/editor.html?persona=${encodeURIComponent(
    persona.persona_key
  )}`;
};

backBtn.onclick = () => {
  window.location.href = `/os/persona_lab/persona_list.html`;
};

loadPersona();
