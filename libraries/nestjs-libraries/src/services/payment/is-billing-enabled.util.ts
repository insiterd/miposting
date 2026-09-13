import { HttpException, HttpStatus } from '@nestjs/common';

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

/**
 * Algunos endpoints de billing (prorate, cupones de descuento, "finish trial"
 * anticipado, cargos/reembolsos, reembolsos de chatbase) son conceptos
 * exclusivos de Stripe que nunca se migraron a la interfaz de gateway
 * agnostica (PaymentGatewayInterface) porque PayPal no los soporta.
 *
 * Sin este guard, esos endpoints llaman a la API de Stripe sin importar el
 * PAYMENT_GATEWAY activo; sin STRIPE_SECRET_KEY (deploy en PayPal), Stripe
 * responde 401, ese 401 se propaga tal cual como respuesta del endpoint, y
 * el interceptor global del frontend (layout.context.tsx) trata cualquier
 * 401 como "sesion invalida" y desloguea al usuario — bug real ya visto dos
 * veces en produccion (prorate y subscription/tiers).
 *
 * Por eso el guard lanza 400, nunca 401: aunque algun caller del frontend se
 * nos escape sin gatear, no debe volver a disparar ese logout global.
 */
export function assertStripeGateway(): void {
  if (process.env.PAYMENT_GATEWAY !== 'stripe') {
    throw new HttpException(
      'This feature is only available with Stripe billing.',
      HttpStatus.BAD_REQUEST
    );
  }
}
