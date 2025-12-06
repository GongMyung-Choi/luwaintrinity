import { createClient } from "https://esm.sh/@supabase/supabase-js";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function loadClips() {
    const user = (await supabase.auth.getUser()).data.user;

    const { data, error } = await supabase
        .from("breathing_clips")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) return;

    const box = document.getElementById("clips_list");

    box.innerHTML = data.map(c => `
        <div class="clip_item">
            <h3>${c.title ?? ""}</h3>
            <video controls width="300" src="${c.video_url}"></video>
            <p>${c.tags?.join(", ") ?? ""}</p>
            <small>${new Date(c.created_at).toLocaleString()}</small>
            <hr>
        </div>
    `).join("");
}

loadClips();
