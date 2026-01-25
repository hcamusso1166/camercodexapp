import { APP_CONFIG } from "../config/appConfig.js";
import { supabase } from "./supabaseClient.js";

export async function requireAuth({ returnTo = "/" } = {}) {
  // Modo emergencia: acceso irrestricto
  if (!APP_CONFIG.ACCESS_CONTROL_ENABLED) return { ok: true, user: null };

  const { data } = await supabase.auth.getSession();
  const session = data?.session;

  if (session?.user) {
    return { ok: true, user: session.user };
  }

  const url = new URL("/js/auth/login.html", window.location.origin);
  url.searchParams.set("returnTo", returnTo);
  window.location.replace(url.toString());
  return { ok: false, user: null };
}
