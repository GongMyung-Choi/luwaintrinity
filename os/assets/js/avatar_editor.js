// /os/assets/js/avatar_editor.js

// 전제: script_reverb.js에서 window.supabaseClient 만들어둔 상태라고 가정
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase =
  window.supabaseClient ||
  createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

const canvas = document.getElementById("avatar_canvas");
const ctx = canvas.getContext("2d");

const personaKeyInput = document.getElementById("persona_key");
const displayNameInput = document.getElementById("display_name");

const baseSelect = document.getElementById("base_select");
const hairSelect = document.getElementById("hair_select");
const outfitSelect = document.getElementById("outfit_select");
const accessorySelect = document.getElementById("accessory_select");
const colorSelect = document.getElementById("color_select");
const statusBox = document.getElementById("status");

let partsConfig = null;

async function loadPartsConfig() {
  const res = await fetch("/os/assets/avatars/avatar_parts.json");
  partsConfig = await res.json();

  fillSelect(baseSelect, partsConfig.bases);
  fillSelect(hairSelect, partsConfig.hair);
  fillSelect(outfitSelect, partsConfig.outfit);
  fillSelect(accessorySelect, ["", ...partsConfig.accessory]);
  fillSelect(colorSelect, partsConfig.colorThemes);

  // 기본값
  colorSelect.value = partsConfig.colorThemes?.[0] || "#ffffff";

  await loadPersonaFromQuery();
  await renderAvatar();
}

function fillSelect(select, items) {
  select.innerHTML = "";
  items.forEach((item) => {
    const opt = document.createElement("option");
    opt.value = item;
    opt.textContent = item || "(없음)";
    select.appendChild(opt);
  });
}

async function renderAvatar() {
  if (!partsConfig) return;

  const bg = colorSelect.value || "#ffffff";
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const layers = [
    { type: "base", file: baseSelect.value },
    { type: "hair", file: hairSelect.value },
    { type: "outfit", file: outfitSelect.value },
    { type: "accessory", file: accessorySelect.value }
  ];

  for (const layer of layers) {
    if (!layer.file) continue;
    const img = new Image();
    img.src = `/os/assets/avatars/${layer.file}`;
    await img.decode().catch(() => {});
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }
}

baseSelect.onchange = renderAvatar;
hairSelect.onchange = renderAvatar;
outfitSelect.onchange = renderAvatar;
accessorySelect.onchange = renderAvatar;
colorSelect.onchange = renderAvatar;

async function loadPersonaFromQuery() {
  const params = new URLSearchParams(location.search);
  const keyFromUrl = params.get("persona");
  if (!keyFromUrl) return;

  personaKeyInput.value = keyFromUrl;

  const { data, error } = await supabase
    .from("persona_profiles")
    .select("*")
    .eq("persona_key", keyFromUrl)
    .maybeSingle();

  if (error || !data) return;

  displayNameInput.value = data.display_name ?? "";

  if (data.base) baseSelect.value = data.base;
  if (data.hair) hairSelect.value = data.hair;
  if (data.outfit) outfitSelect.value = data.outfit;
  if (data.accessory) accessorySelect.value = data.accessory;
  if (data.color_theme) colorSelect.value = data.color_theme;
}

document.getElementById("saveBtn").onclick = async () => {
  const personaKey = personaKeyInput.value.trim();
  const displayName = displayNameInput.value.trim();

  if (!personaKey) {
    alert("퍼스나 키를 입력하세요.");
    return;
  }

  const payload = {
    persona_key: personaKey,
    display_name: displayName || null,
    base: baseSelect.value || null,
    hair: hairSelect.value || null,
    outfit: outfitSelect.value || null,
    accessory: accessorySelect.value || null,
    color_theme: colorSelect.value || null
  };

  const { error } = await supabase
    .from("persona_profiles")
    .upsert(payload, { onConflict: "persona_key" });

  if (error) {
    console.error(error);
    statusBox.textContent = "저장 실패";
  } else {
    statusBox.textContent = "저장 완료";
  }
};

// 시작
loadPartsConfig();
