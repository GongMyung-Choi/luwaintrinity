import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function uploadGalleryImage() {
    const user = (await supabase.auth.getUser()).data.user;

    const fileInput = document.getElementById("gallery_file");
    const title = document.getElementById("gallery_title").value;
    const description = document.getElementById("gallery_description").value;
    const isPublic = document.getElementById("gallery_public").checked;

    if (!fileInput.files.length) {
        alert("이미지 파일을 선택하세요.");
        return;
    }

    const file = fileInput.files[0];
    const ext = file.name.split(".").pop();
    const filename = `gallery/${user.id}_${Date.now()}.${ext}`;

    // 1) 스토리지 업로드
    const { error: uploadError } = await supabase.storage
        .from("luwain-storage")
        .upload(filename, file);

    if (uploadError) {
        console.error(uploadError);
        alert("업로드 실패");
        return;
    }

    // 2) 이미지 URL 얻기
    const publicUrl = supabase.storage
        .from("luwain-storage")
        .getPublicUrl(filename)
        .data.publicUrl;

    // 3) DB 저장
    const { error: insertErr } = await supabase
        .from("breathing_gallery")
        .insert({
            user_id: user.id,
            image_url: publicUrl,
            title,
            description,
            is_public: isPublic
        });

    if (insertErr) {
        console.error(insertErr);
        alert("DB 저장 실패");
        return;
    }

    alert("등록 완료!");
    location.reload();
}

document.getElementById("gallery_upload_btn").onclick = uploadGalleryImage;
