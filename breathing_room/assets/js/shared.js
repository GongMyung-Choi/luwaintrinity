import { supabase } from "./core.js";

export async function shareItem(original_item_id, owner_id, owner_type, type, title, description, content_base64, extra) {

    const { data, error } = await supabase
        .from("shared_items")
        .insert({
            original_item_id,
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
