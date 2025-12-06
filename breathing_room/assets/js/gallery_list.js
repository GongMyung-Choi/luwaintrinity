import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function loadGallery() {
    const { data, error } = await supabase
        .from("breathing_gallery")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    const box = document.getElementById("gallery_list");

    box.innerHTML = data.map(item => `
        <div class="gallery_item">
            <img src="${item.image_url}" style="max-width:100%; border-radius:8px;">
            <h3>${item.title ?? ""}</h3>
            <p>${item.description ?? ""}</p>
            <small>${new Date(item.created_at).toLocaleString()}</small>
            <hr>
        </div>
    `).join("");
}

loadGallery();
