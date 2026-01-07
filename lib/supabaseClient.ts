import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mnjrloqjkpdktkptzjum.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client (server-side only) using service role key
export const supabaseAdmin = () =>
  createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
