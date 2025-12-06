import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function saveCard() {
    const title = document.getElementById("card_title").value;
    const content = document.getElementById("card_content").value;
    const tags = document.getElementById("card_tags").value.split(",").map(t => t.trim());

    const { data, error } = await supabase
        .from("breathing_cards")
        .insert({
            user_id: (await supabase.auth.getUser()).data.user.id,
            title,
            content,
            tags
        })
        .select()
        .single();

    if (error) {
        console.error(error);
        alert("카드 저장 실패");
        return;
    }

    alert("저장됨!");
    location.reload();
}

document.getElementById("save_card_btn").onclick = saveCard;
