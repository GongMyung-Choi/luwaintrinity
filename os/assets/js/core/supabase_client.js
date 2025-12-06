// /os/assets/js/core/supabase_client.js
import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { CONFIG } from "./config.js";

export const supabase = createClient(
  CONFIG.SUPABASE_URL,
  CONFIG.SUPABASE_ANON_KEY
);
