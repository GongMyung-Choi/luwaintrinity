// /os/assets/js/core/persona_loader.js

import { supabase } from "./supabase_client.js";

/**
 * 현재 퍼스나의 외형/테마 로딩
 * 사용 예: 어떤 페이지든 persona_loader.load("reka")
 */
export const persona_loader = {
  async load(personaKey) {
    const { data, error } = await supabase
      .from("persona_profiles")
      .select("*")
      .eq("persona_key", personaKey)
      .maybeSingle();

    if (error || !data) return null;

    // 테마 적용
    if (data.color_theme) {
      document.documentElement.style.setProperty(
        "--persona-theme",
        data.color_theme
      );
    }

    return data; // 외형 정보 반환
  }
};
