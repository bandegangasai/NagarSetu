/**
 * Supabase client configuration module.
 * Provides production-ready Supabase integration when credentials exist in .env,
 * and gracefully delegates to local persistence adapter for offline/demo operation.
 */

export interface SupabaseConfig {
  url?: string;
  anonKey?: string;
  isConfigured: boolean;
}

export function getSupabaseConfig(): SupabaseConfig {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const isConfigured = Boolean(
    url &&
    anonKey &&
    !url.includes('your-project-id') &&
    !anonKey.includes('your-anon-public-key')
  );

  return {
    url,
    anonKey,
    isConfigured
  };
}
