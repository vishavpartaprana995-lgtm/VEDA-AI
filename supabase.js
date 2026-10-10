import { createClient } from
"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://ybaxstdfcjpvilnyfibb.supabase.co";

const SUPABASE_KEY = "sb_publishable_1wv-rkmqh64smbv-vob82g_t2EPs5FE";

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

