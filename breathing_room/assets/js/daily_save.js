import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function saveDaily() {
    const user = (await supabase.auth.getUser()).data.user;
    const today = new Date().toISOString().split("T")[0];

    const feeling = document.getElementById("daily_feeling").value;
    const note = document.getElementById("daily_note").value;
    const score = parseInt(document.getElementById("daily_score").value) || null;

    // 1) 오늘 기록이 있는지 확인
    const { data: existing, error: selectErr } = await supabase
        .from("breathing_daily")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", today)
        .maybeSingle();

    if (selectErr) {
        console.error(selectErr);
        alert("조회 실패");
        return;
    }

    if (existing) {
        // 2) update
        const { error: updateErr } = await supabase
            .from("breathing_daily")
            .update({
                feeling,
                note,
                score,
                updated_at: new Date()
            })
            .eq("id", existing.id);

        if (updateErr) {
            console.error(updateErr);
            alert("수정 실패");
        } else {
            alert("업데이트 완료!");
        }

    } else {
        // 3) insert
        const { error: insertErr } = await supabase
            .from("breathing_daily")
            .insert({
                user_id: user.id,
                date: today,
                feeling,
                note,
                score
            });

        if (insertErr) {
            console.error(insertErr);
            alert("저장 실패");
        } else {
            alert("저장됨!");
        }
    }
}

document.getElementById("daily_save_btn").onclick = saveDaily;
