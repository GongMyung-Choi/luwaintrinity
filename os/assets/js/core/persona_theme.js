// /os/assets/js/core/persona_theme.js

import { supabase } from "./supabase_client.js";

const DEFAULT_PERSONA = "reka"; // 기본 활성 퍼스나 (원하면 나중에 설정에서 바꿔도 됨)

export async function applyPersonaThemeToPage() {
  const { data, error } = await supabase
    .from("persona_profiles")
    .select("*")
    .eq("persona_key", DEFAULT_PERSONA)
    .maybeSingle();

  if (error || !data) {
    console.warn("[persona_theme] 퍼스나 로딩 실패");
    return;
  }

  const p = data;

  // 1) 색상 테마 적용
  if (p.color_theme) {
    document.documentElement.style.setProperty("--theme-color", p.color_theme);
  }

  // 2) 아바타 파츠 정보 페이지에 저장 (선택적으로 활용함)
  document.documentElement.dataset.personaName = p.display_name || p.persona_key;
  document.documentElement.dataset.personaBase = p.base || "";
  document.documentElement.dataset.personaHair = p.hair || "";
  document.documentElement.dataset.personaOutfit = p.outfit || "";
  document.documentElement.dataset.personaAccessory = p.accessory || "";
}

// 페이지 로드시 자동 실행
applyPersonaThemeToPage();
