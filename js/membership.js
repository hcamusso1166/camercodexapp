// /js/membership.js
// Camer Codex - Membership v1 (gating simple)

(function () {
  var KEY = "CC_MEMBERSHIP_MAX";
  var LEGACY_KEY = "cc_membership_max";

  function getCached() {
    var primary = Number(localStorage.getItem(KEY));
    if (Number.isFinite(primary)) return primary;

    var legacy = Number(localStorage.getItem(LEGACY_KEY));
    return Number.isFinite(legacy) ? legacy : null;
  }

  function setCached(v) {
    if (!Number.isFinite(v)) return;
    var value = String(v);
    localStorage.setItem(KEY, value);
    localStorage.setItem(LEGACY_KEY, value);
  }

  async function getAuthenticatedUser() {
    if (!window.supabase || !window.supabase.auth) {
      throw new Error("Supabase auth client not found");
    }

    // Camino simple y estable: sesión persistida del cliente.
    var sessionResult = await window.supabase.auth.getSession();
    var sessionUser = sessionResult && sessionResult.data && sessionResult.data.session && sessionResult.data.session.user;

    if (sessionUser && sessionUser.id) return sessionUser;

    // Fallback por si la sesión todavía no está hidratada.
    var userResult = await window.supabase.auth.getUser();
    var user = userResult && userResult.data && userResult.data.user;
    var err = userResult && userResult.error;

    if (err || !user || !user.id) {
      throw err || new Error("No authenticated user");
    }

        return user;
  }

  async function fetchMax() {
    if (!window.supabase) throw new Error("Supabase client not found on window.supabase");

    var user = await getAuthenticatedUser();

    // Estructura confirmada: profiles.user_id + membership_max.
        var profileResult = await window.supabase
      .from("profiles")
     .select("membership_max, display_name")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileResult && profileResult.error) {
      throw profileResult.error;
    }

    var data = profileResult && profileResult.data;
    var rawMax = data && data.membership_max != null ? data.membership_max : null;

      var parsed = Number(rawMax);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  async function ensure(forceRefresh) {
    var cached = getCached();

    // Si hay cache > 0, usarlo. Si es 0, intentar refrescar para evitar stale data.
    if (!forceRefresh && cached != null && cached > 0) {
      window.CC_MEMBERSHIP_MAX = cached;
      return cached;
    }

    if (!window.supabase || !window.supabase.auth) {
      var fallbackWithoutSupabase = cached != null ? cached : 0;
      console.info("[Membership] Supabase no está listo en esta vista; se usa membership_max local:", fallbackWithoutSupabase);
      window.CC_MEMBERSHIP_MAX = fallbackWithoutSupabase;
      return fallbackWithoutSupabase;
    }

    try {
      var v = await fetchMax();
      setCached(v);
      window.CC_MEMBERSHIP_MAX = v;
      return v;
    } catch (err) {
      console.warn("[Membership] No se pudo resolver membership_max desde Supabase:", err);
      var fallback = cached != null ? cached : 0;
      window.CC_MEMBERSHIP_MAX = fallback;
      return fallback;
    }  
  }

  function getCurrentMax() {
    if (window.CC_MEMBERSHIP_MAX != null) return Number(window.CC_MEMBERSHIP_MAX);

    var cached = getCached();
    return Number(cached != null ? cached : 0);
  }

  function canAccess(required) {
    return Number(required) <= getCurrentMax();
  }

  function getMax() {
    return getCurrentMax();
  }

    async function logCurrentUserAndMembership() {
    var userLabel = "sin sesión";

    try {
      var user = await getAuthenticatedUser();
      userLabel = user.email ? user.email + " (" + user.id + ")" : user.id;
    } catch (err) {
      console.warn("[Membership] No se pudo obtener el usuario autenticado:", err);
    }

    console.log("[Membership] Usuario logeado:", userLabel, "| Nivel de licencia (membership_max):", getCurrentMax());
  }

  window.CC_Membership = {
    ensureMembershipMax: ensure,
    canAccess: canAccess,
    getMax: getMax,
    logCurrentUserAndMembership: logCurrentUserAndMembership
  };
})();