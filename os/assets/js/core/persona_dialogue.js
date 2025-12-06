// /os/assets/js/core/persona_dialogue.js

import { supabase } from "./supabase_client.js";

// 기본 퍼스나 (변경 가능)
const DEFAULT_PERSONA = "reka";

// 대사 데이터 불러오기 (로컬 JSON → 추후 Supabase 가능)
async function loadDialogueMap() {
  const res = await fetch("/os/assets/dialog/br_dialog_map.json");
  return await res.json();
}

// 숨틔움방에 메시지 넣는 헬퍼
export function setDialogue(targetId, text) {
  const box = document.getElementById(targetId);
  if (box) box.innerHTML = text;
}

// 퍼스나 말투 적용 전체 엔진
export async function applyPersonaDialogue(contextKey) {
  const dmap = await loadDialogueMap();

  const { data } = await supabase
    .from("persona_profiles")
    .select("*")
    .eq("persona_key", DEFAULT_PERSONA)
    .maybeSingle();

  const personaKey = data?.persona_key || DEFAULT_PERSONA;
  const personaSet = dmap[personaKey] || dmap["default"];

  const msg = personaSet[contextKey] || personaSet["default"];

  return msg;
}
