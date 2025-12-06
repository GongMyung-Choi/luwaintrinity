import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 퍼스나 생성
export async function createPersona(name, archetypeCode) {
    // 1) archetype id 찾기
    const { data: archetypes, error: aErr } = await supabase
        .from('persona_archetypes')
        .select('id')
        .eq('code', archetypeCode)
        .single();

    if (aErr) {
        console.error(aErr);
        return { error: "Archetype not found" };
    }

    // 2) 퍼스나 생성
    const { data, error } = await supabase
        .from('persona_instances')
        .insert({
            name,
            archetype_id: archetypes.id,
        })
        .select()
        .single();

    if (error) {
        console.error(error);
        return { error: "Failed to create persona" };
    }

    return data;
}
