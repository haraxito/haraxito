import { createClient } from "@supabase/supabase-js";
import { getEnvVar, validateEnvVars } from "./env";

// Get Supabase URL from environment
const supabaseUrl = getEnvVar("NEXT_PUBLIC_SUPABASE_URL");
const supabaseAnonKey = getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY");

// Validate environment variables before creating clients
const envValidation = validateEnvVars();

// Client-side Supabase client (anon key)
export let supabase: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error);
    supabase = null;
  }
} else {
  if (envValidation.errors.length > 0) {
    console.error("Supabase initialization failed:", envValidation.errors);
  }
}

// Admin client (server-side only) using service role key
// This bypasses RLS and should ONLY be used in server-side code
export function supabaseAdmin() {
  const serviceRoleKey = getEnvVar("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase admin client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables"
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Helper function to check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return (
    supabase !== null &&
    supabaseUrl !== undefined &&
    supabaseAnonKey !== undefined
  );
}

// Export validation result for use in API routes
export { envValidation };
