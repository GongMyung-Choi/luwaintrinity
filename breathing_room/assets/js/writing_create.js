import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function saveWriting() {
    const user = (await supabase.auth.getUser()).data.user;

    const folder_id = document.getElementById("folder_select").value;
    const type = document.getElementById("writing_type").value;
    const title = document.getElementById("writing_title").value;
    const content = document.getElementById("writing_content").value;

    const { error } = await supabase
        .from("writings")
        .insert({
            user_id: user.id,
            folder_id,
            type,
            title,
            content
        });

    if (error) alert("저장 실패");
    else {
        alert("저장됨!");
        location.reload();
    }
}

document.getElementById("writing_save_btn").onclick = saveWriting;
