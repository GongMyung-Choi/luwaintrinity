import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function loadCards() {
    const { data, error } = await supabase
        .from("breathing_cards")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    const box = document.getElementById("cards_list");
    box.innerHTML = data.map(card => `
        <div class="card_item">
            <h3>${card.title ?? "제목 없음"}</h3>
            <p>${card.content}</p>
            <small>${card.tags?.join(", ") ?? ""}</small>
            <hr>
        </div>
    `).join("");
}

loadCards();
