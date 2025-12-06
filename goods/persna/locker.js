import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient("YOUR_SUPABASE_URL", "YOUR_PUBLIC_ANON_KEY");

// 이 파일은 persona_instances 폴더 하나에 그대로 넣으면 된다.
// <personaName> 은 URL이나 폴더명에서 읽어오도록 설계 가능.

const personaName = window.location.pathname.split("/").slice(-2)[0];

async function loadPersona() {
    // persona info
    const { data: persona } = await supabase
        .from("persona_instances")
        .select("id, name, archetype_id")
        .eq("name", personaName)
        .single();

    document.getElementById("persona-name").innerText = persona.name;

    // archetype
    const { data: arc } = await supabase
        .from("persona_archetypes")
        .select("name")
        .eq("id", persona.archetype_id)
        .single();

    document.getElementById("persona-archetype").innerText =
        "원형: " + arc.name;

    // locker entries
    const { data: locker } = await supabase
        .from("persona_storage")
        .select("*")
        .eq("persona_id", persona.id);

    document.getElementById("locker-entries").innerHTML =
        locker.map(v => `<div class='entry'><b>${v.entry_type}</b>: ${v.content}</div>`).join("");

    // activity log
    const { data: logs } = await supabase
        .from("persona_activity_log")
        .select("*")
        .eq("persona_id", persona.id);

    document.getElementById("activity-log").innerHTML =
        logs.map(v => `<div class='log'>${v.activity_type}: ${v.description}</div>`).join("");

    // suggestion
    const { data: sugg } = await supabase
        .from("persona_suggestions")
        .select("*")
        .eq("persona_name", personaName)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

    document.getElementById("suggestion-summary").innerText = sugg.summary;
    document.getElementById("suggestion-traits").innerText = sugg.traits.join(", ");
    document.getElementById("suggestion-actions").innerText = sugg.recommended_actions.join(", ");
}

loadPersona();
