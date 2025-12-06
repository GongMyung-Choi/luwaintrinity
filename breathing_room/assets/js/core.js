import { createClient } from "https://esm.sh/@supabase/supabase-js";

export const supabase = createClient(
    "https://YOUR_URL.supabase.co",
    "YOUR_ANON_KEY"
);

// Base64 변환
export function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// 공통 INSERT
export async function saveMyItem({ owner_id, owner_type, type, title, description, content_base64, extra }) {
    const { data, error } = await supabase
        .from("my_items")
        .insert({
            owner_id,
            owner_type,
            type,
            title,
            description,
            content_base64,
            extra
        })
        .select();

    if (error) throw error;
    return data[0];
}
