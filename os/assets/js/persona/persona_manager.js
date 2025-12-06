// /os/assets/js/persona/persona_manager.js
import { supabase } from "../core/supabase_client.js";

export const PersonaManager = {
  async saveProfile(payload) {
    const { error } = await supabase
      .from("persona_profiles")
      .upsert(payload, { onConflict: "persona_key" });

    return { error };
  },

  async getProfile(key) {
    const { data, error } = await supabase
      .from("persona_profiles")
      .select("*")
      .eq("persona_key", key)
      .maybeSingle();

    return { data, error };
  }
};
