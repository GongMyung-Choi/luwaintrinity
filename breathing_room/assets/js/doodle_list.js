import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function loadDoodles() {
    const user = (await supabase.auth.getUser()).data.user;

    const { data, error } = await supabase
        .from("breathing_doodles")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    const box = document.getElementById("doodle_list");

    box.innerHTML = data.map(d => `
        <div class="doodle_item">
            <img src="${d.image_url}" style="max-width:100%; border:1px solid #ccc;">
            <p>${d.title ?? ''}</p>
            <small>${new Date(d.created_at).toLocaleString()}</small>
            <hr>
        </div>
    `).join("");
}

loadDoodles();
