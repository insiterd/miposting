/**
 * Mapea tier + periodo -> Plan ID de PayPal (creado a mano en PayPal Dashboard,
 * Fase 4). Los IDs no existen hasta que se crean los 6 planes reales; hasta
 * entonces estas variables quedan vacias y cualquier intento de checkout con
 * PayPal falla explicitamente (ver paypal.gateway.ts).
 */
export type PayPalTier = 'STANDARD' | 'PRO' | 'ULTIMATE';
export type PayPalPeriod = 'MONTHLY' | 'YEARLY';

export const paypalPlanMapping: Record<PayPalTier, Record<PayPalPeriod, string>> = {
  STANDARD: {
    MONTHLY: process.env.PAYPAL_PLAN_STANDARD_MONTHLY || '',
    YEARLY: process.env.PAYPAL_PLAN_STANDARD_YEARLY || '',
  },
  PRO: {
    MONTHLY: process.env.PAYPAL_PLAN_PRO_MONTHLY || '',
    YEARLY: process.env.PAYPAL_PLAN_PRO_YEARLY || '',
  },
  ULTIMATE: {
    MONTHLY: process.env.PAYPAL_PLAN_ULTIMATE_MONTHLY || '',
    YEARLY: process.env.PAYPAL_PLAN_ULTIMATE_YEARLY || '',
  },
};

/** Busca a que tier/periodo corresponde un plan_id de PayPal (usado por el webhook). */
export function findTierAndPeriodByPlanId(
  planId: string
): { billing: PayPalTier; period: PayPalPeriod } | null {
  for (const billing of Object.keys(paypalPlanMapping) as PayPalTier[]) {
    for (const period of Object.keys(
      paypalPlanMapping[billing]
    ) as PayPalPeriod[]) {
      if (paypalPlanMapping[billing][period] === planId) {
        return { billing, period };
      }
    }
  }
  return null;
}
