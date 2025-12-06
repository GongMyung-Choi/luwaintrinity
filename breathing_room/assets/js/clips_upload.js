import { createClient } from "https://esm.sh/@supabase/supabase-js";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function uploadClip() {
    const user = (await supabase.auth.getUser()).data.user;

    const fileInput = document.getElementById("clip_file");
    const title = document.getElementById("clip_title").value;
    const tags = document.getElementById("clip_tags").value
        .split(",")
        .map(t => t.trim())
        .filter(t => t.length > 0);

    if (!fileInput.files.length) {
        alert("동영상 파일을 선택하세요.");
        return;
    }

    const file = fileInput.files[0];
    const ext = file.name.split(".").pop();
    const filename = `clips/${user.id}_${Date.now()}.${ext}`;

    // 1) 스토리지 업로드
    const { error: uploadError } = await supabase.storage
        .from("luwain-storage")
        .upload(filename, file);

    if (uploadError) {
        console.error(uploadError);
        alert("업로드 실패");
        return;
    }

    // 2) 공개 URL 가져오기
    const publicUrl = supabase.storage
        .from("luwain-storage")
        .getPublicUrl(filename).data.publicUrl;

    // 3) DB 기록
    const { error: dbError } = await supabase
        .from("breathing_clips")
        .insert({
            user_id: user.id,
            title,
            video_url: publicUrl,
            tags
        });

    if (dbError) {
        console.error(dbError);
        alert("DB 저장 실패");
        return;
    }

    alert("영상 클립이 저장되었습니다!");
    location.reload();
}

document.getElementById("clip_upload_btn").onclick = uploadClip;
