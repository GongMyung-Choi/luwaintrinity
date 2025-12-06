import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function saveClip() {
    const text = document.getElementById("clip_text").value;
    const mood = document.getElementById("clip_mood")?.value ?? null;

    if (!text.trim()) {
        alert("내용을 입력해주세요.");
        return;
    }

    const user = (await supabase.auth.getUser()).data.user;

    const { data, error } = await supabase
        .from("breathing_clips")
        .insert({
            user_id: user.id,
            text,
            mood
        })
        .select()
        .single();

    if (error) {
        console.error(error);
        alert("저장 실패");
        return;
    }

    alert("저장됨!");
    document.getElementById("clip_text").value = "";
}

document.getElementById("clip_save_btn").onclick = saveClip;
