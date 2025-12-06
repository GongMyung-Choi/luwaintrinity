import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function logPersonaEvent(personaId, eventType, eventData) {
    return await supabase
        .from('persona_logs')
        .insert({
            persona_id: personaId,
            event_type: eventType,
            event_data: eventData
        });
}
