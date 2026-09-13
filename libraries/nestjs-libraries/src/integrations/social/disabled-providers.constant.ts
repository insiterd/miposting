// Sentinel that never matches a real SubscriptionTier (STANDARD/PRO/ULTIMATE) or the
// 'FREE' fallback used when billing is disabled. Assigning this to a provider's
// `allowedPlans` disables it for every plan without relying on an empty array, which
// the gating logic (integration.manager.ts / no.auth.integrations.controller.ts) treats
// as "unrestricted" rather than "blocked". Search this constant to find every provider
// currently held back from launch.
export const COMING_SOON_PLANS = ['__COMING_SOON__'];
