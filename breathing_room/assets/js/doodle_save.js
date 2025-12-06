import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function saveDoodle() {
    const canvas = document.getElementById("doodle_canvas");
    const title = document.getElementById("doodle_title").value;
    const user = (await supabase.auth.getUser()).data.user;

    if (!canvas) {
        alert("캔버스 없음");
        return;
    }

    // 1) 캔버스 -> Base64
    const base64 = canvas.toDataURL("image/png");

    // 2) Base64 -> Blob
    const blob = await (await fetch(base64)).blob();

    // 3) Supabase Storage 업로드
    const filename = `doodles/${user.id}_${Date.now()}.png`;

    const { data: uploadData, error: uploadError } = await supabase.storage
        .from("luwain-storage")
        .upload(filename, blob, {
            contentType: "image/png"
        });

    if (uploadError) {
        console.error(uploadError);
        alert("업로드 실패");
        return;
    }

    const publicUrl = supabase.storage
        .from("luwain-storage")
        .getPublicUrl(filename)
        .data.publicUrl;

    // 4) DB 저장
    const { data, error } = await supabase
        .from("breathing_doodles")
        .insert({
            user_id: user.id,
            image_url: publicUrl,
            title
        })
        .select()
        .single();

    if (error) {
        console.error(error);
        alert("DB 저장 실패");
        return;
    }

    alert("저장 완료!");
}
