import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// ⬇️ 여기에 공명의 Supabase URL & KEY 넣기
const supabase = createClient(https://omchtafaqgkdwcrwscrp.supabase.co, eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tY2h0YWZhcWdrZHdjcndzY3JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODIyNjMsImV4cCI6MjA3NDQ1ODI2M30.vGV6Gfgi1V8agiwL03ho2R7BAwv4CrTp6-RGH0S3-4g
);

// URL에서 ?name=퍼스나이름 읽기
const params = new URLSearchParams(window.location.search);
const personaName = params.get("name");

async function loadPersona() {
    if (!personaName) {
        document.body.innerHTML = "<h2>퍼스나 이름이 지정되지 않았습니다.</h2>";
        return;
    }

    // 1) persona_instances 조회
    const { data: persona, error: pErr } = await supabase
        .from("persona_instances")
        .select("id, name, archetype_id")
        .eq("name", personaName)
        .single();

    if (pErr || !persona) {
        document.body.innerHTML = "<h2>퍼스나를 찾을 수 없습니다.</h2>";
        return;
    }

    document.getElementById("persona-name").innerText = persona.name;

    // 2) 원형 명칭 불러오기
    const { data: arc } = await supabase
        .from("persona_archetypes")
        .select("name")
        .eq("id", persona.archetype_id)
        .single();

    document.getElementById("persona-archetype").innerText =
        "원형: " + arc.name;

    // 3) 사물함 불러오기
    const { data: locker } = await supabase
        .from("persona_storage")
        .select("*")
        .eq("persona_id", persona.id)
        .order("created_at", { ascending: false });

    document.getElementById("locker-entries").innerHTML =
        locker.length === 0
            ? "<div>기록 없음</div>"
            : locker
                  .map(
                      v =>
                          `<div class='entry'><b>[${v.entry_type}]</b> ${v.content}</div>`
                  )
                  .join("");

    // 4) 활동 로그
    const { data: logs } = await supabase
        .from("persona_activity_log")
        .select("*")
        .eq("persona_id", persona.id)
        .order("created_at", { ascending: false });

    document.getElementById("activity-log").innerHTML =
        logs.length === 0
            ? "<div>기록 없음</div>"
            : logs
                  .map(
                      v =>
                          `<div class='log'><b>${v.activity_type}</b>: ${v.description}</div>`
                  )
                  .join("");

    // 5) 자동 제안 불러오기
    const { data: sugg } = await supabase
        .from("persona_suggestions")
        .select("*")
        .eq("persona_name", personaName)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

    if (sugg) {
        document.getElementById("suggestion-summary").innerText =
            "요약: " + sugg.summary;
        document.getElementById("suggestion-traits").innerText =
            "특성: " + (sugg.traits?.join(", ") || "-");
        document.getElementById("suggestion-actions").innerText =
            "행동: " + (sugg.recommended_actions?.join(", ") || "-");
    }
}

loadPersona();
