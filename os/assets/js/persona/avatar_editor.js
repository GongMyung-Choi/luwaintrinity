import { PersonaManager } from "./persona_manager.js";

const canvas = document.getElementById("avatar_canvas");
const ctx = canvas.getContext("2d");

// DOM
const personaKeyInput = document.getElementById("persona_key");
const displayNameInput = document.getElementById("display_name");

const baseSelect = document.getElementById("base_select");
const hairSelect = document.getElementById("hair_select");
const outfitSelect = document.getElementById("outfit_select");
const accessorySelect = document.getElementById("accessory_select");
const colorSelect = document.getElementById("color_select");
const statusBox = document.getElementById("status");

let partsConfig = null;

async function loadParts() {
  partsConfig = await fetch("/os/assets/avatars/avatar_parts.json").then(r => r.json());

  fillSelect(baseSelect, partsConfig.bases);
  fillSelect(hairSelect, partsConfig.hair);
  fillSelect(outfitSelect, partsConfig.outfit);
  fillSelect(accessorySelect, ["", ...partsConfig.accessory]);
  fillSelect(colorSelect, partsConfig.colorThemes);

  if (partsConfig.colorThemes.length)
    colorSelect.value = partsConfig.colorThemes[0];

  await loadExistingProfile();
  await renderAvatar();
}

function fillSelect(select, arr) {
  select.innerHTML = "";
  arr.forEach(a => {
    const opt = document.createElement("option");
    opt.value = a;
    opt.textContent = a || "(없음)";
    select.appendChild(opt);
  });
}

async function renderAvatar() {
  ctx.fillStyle = colorSelect.value || "#ffffff";
  ctx.fillRect(0, 0, 280, 280);

  const layers = [
    baseSelect.value,
    hairSelect.value,
    outfitSelect.value,
    accessorySelect.value
  ];

  for (const file of layers) {
    if (!file) continue;
    const img = new Image();
    img.src = `/os/assets/avatars/${file}`;
    await img.decode().catch(()=>{});
    ctx.drawImage(img, 0, 0, 280, 280);
  }
}

async function loadExistingProfile() {
  const params = new URLSearchParams(location.search);
  const key = params.get("persona");

  if (!key) return;

  personaKeyInput.value = key;

  const { data } = await PersonaManager.getProfile(key);
  if (!data) return;

  displayNameInput.value = data.display_name ?? "";
  if (data.base) baseSelect.value = data.base;
  if (data.hair) hairSelect.value = data.hair;
  if (data.outfit) outfitSelect.value = data.outfit;
  if (data.accessory) accessorySelect.value = data.accessory;
  if (data.color_theme) colorSelect.value = data.color_theme;
}

document.getElementById("saveBtn").onclick = async () => {
  const key = personaKeyInput.value.trim();
  if (!key) return alert("퍼스나 키 필요");

  const payload = {
    persona_key: key,
    display_name: displayNameInput.value.trim() || null,
    base: baseSelect.value || null,
    hair: hairSelect.value || null,
    outfit: outfitSelect.value || null,
    accessory: accessorySelect.value || null,
    color_theme: colorSelect.value || null
  };

  const { error } = await PersonaManager.saveProfile(payload);

  statusBox.textContent = error ? "저장 실패" : "저장 완료";
};

loadParts();
