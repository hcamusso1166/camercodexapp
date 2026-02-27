// /js/membership.js
// Camer Codex - Membership v1 (gating simple)

(function () {
  var KEY = "CC_MEMBERSHIP_MAX";

  function getCached() {
    var v = Number(localStorage.getItem(KEY));
    return Number.isFinite(v) ? v : null;
  }

  function setCached(v) {
    if (Number.isFinite(v)) localStorage.setItem(KEY, String(v));
  }

  async function fetchMax() {
    if (!window.supabase) throw new Error("Supabase client not found on window.supabase");

    var userResult = await window.supabase.auth.getUser();
    var au = userResult && userResult.data;
    var e1 = userResult && userResult.error;

    if (e1 || !au || !au.user || !au.user.id) {
      throw e1 || new Error("No authenticated user");
    }

    var profileResult = await window.supabase
      .from("profiles")
      .select("membership_max")
      .eq("user_id", au.user.id)
      .single();

    var data = profileResult && profileResult.data;
    var e2 = profileResult && profileResult.error;

    if (e2) throw e2;

    var rawMax = data && data.membership_max != null ? data.membership_max : 0;
    return Number(rawMax);
  }

  async function ensure() {
    var cached = getCached();
    if (cached != null) {
      window.CC_MEMBERSHIP_MAX = cached;
      return cached;
    }

    var v = await fetchMax();
    setCached(v);
    window.CC_MEMBERSHIP_MAX = v;
    return v;
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

  window.CC_Membership = { ensureMembershipMax: ensure, canAccess: canAccess, getMax: getMax };
})();