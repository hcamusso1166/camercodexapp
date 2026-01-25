import { APP_CONFIG } from "../config/appConfig.js";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const supabase = createClient(
  APP_CONFIG.SUPABASE_URL,
  APP_CONFIG.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true, // clave para OAuth (Google)
    },
  }
);
