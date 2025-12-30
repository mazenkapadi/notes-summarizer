import {createClient} from '@supabase/supabase-js';

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function saveNote(
    title: string,
    original: string,
    summary: string
) {
    const {data, error} = await supabase
        .from("notes")
        .insert([
            {
                title,
                original_content: original,
                summary,
                user_id: null, // explicitly anonymous
            },
        ])
        .select()
        .single();

    if (error) throw error;
    return data;
}
