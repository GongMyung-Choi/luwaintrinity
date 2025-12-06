import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function loadDaily() {
    const user = (await supabase.auth.getUser()).data.user;

    const { data, error } = await supabase
        .from("breathing_daily")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    const box = document.getElementById("daily_list");

    box.innerHTML = data.map(d => `
        <div class="daily_item">
            <h3>${d.date}</h3>
            <p>${d.feeling ?? ""}</p>
            <p>${d.note ?? ""}</p>
            ${d.score ? `<p>점수: ${d.score}</p>` : ""}
            <small>${d.updated_at ? "수정됨" : "작성됨"}</small>
            <hr>
        </div>
    `).join("");
}

loadDaily();
