import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 저장
export async function savePersonaData(personaId, key, valueObj) {
    const { data, error } = await supabase
        .from('persona_storage')
        .insert({
            persona_id: personaId,
            key,
            value: valueObj
        })
        .select()
        .single();

    if (error) {
        console.error(error);
        return { error };
    }
    return data;
}

// 불러오기
export async function loadPersonaData(personaId, key) {
    const { data, error } = await supabase
        .from('persona_storage')
        .select('value')
        .eq('persona_id', personaId)
        .eq('key', key)
        .maybeSingle();

    if (error) {
        console.error(error);
        return null;
    }
    return data?.value ?? null;
}
