/**
 * Reemplaza los ~10 checks sueltos de `!!process.env.STRIPE_PUBLISHABLE_KEY`
 * que habia por todo el backend para decidir "¿hay billing configurado, o
 * es una instancia self-hosted sin restricciones?". Ese check nunca supo de
 * PayPal: con PAYMENT_GATEWAY=paypal y sin Stripe, todos esos sitios
 * asumian billing apagado y otorgaban acceso ilimitado (tier por defecto
 * ULTIMATE, sin limite de canales, sin enforcement de permisos, etc.) —
 * bug real encontrado probando el checkout de PayPal en produccion.
 *
 * Mismo criterio que `billingEnabled` en variable.context.tsx (frontend).
 */
export function isBillingEnabled(): boolean {
  return !!process.env.STRIPE_PUBLISHABLE_KEY || !!process.env.PAYPAL_CLIENT_ID;
}
