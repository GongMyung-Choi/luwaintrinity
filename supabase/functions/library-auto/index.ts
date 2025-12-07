import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js";

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const payload = await req.json();
  const path = payload?.record?.name || "";
  const filename = path.split("/").pop();
  const folder = path.split("/")[0];

  const tableMap = {
    "library": "ai_library",
    "human_library": "human_library",
  };

  if (tableMap[folder]) {
    await supabase.from(tableMap[folder]).insert({
      filename: filename,
      title: filename.replace(/\.[^/.]+$/, ""),
      created_at: new Date().toISOString()
    });
  }

  return new Response("OK");
});
