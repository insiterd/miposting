import { Organization } from '@prisma/client';
import { BillingSubscribeDto } from '@gitroom/nestjs-libraries/dtos/billing/billing.subscribe.dto';

/**
 * Contrato comun entre gateways de pago (Stripe/PayPal).
 *
 * Cubre solo lo que de verdad es intercambiable entre ambos: alta de cliente,
 * checkout, alta/consulta/baja de suscripcion y el link al portal de
 * facturacion. Deliberadamente fuera de este contrato (se quedan en
 * StripeService, sin equivalente PayPal por ahora):
 *  - chatbaseRefund / chatbaseRefundPreview (logica de negocio sobre Charge)
 *  - checkDiscount / applyDiscount (cupones via Stripe Promotion Codes)
 *  - prorate (PayPal no tiene API de proration para suscripciones — ver Fase 3.5)
 *  - finishTrial / checkSubscription (atados a metadata especifica de Stripe)
 *  - lifetimeDeal (no requiere abstraccion: ya es agnostico al gateway)
 */
export interface PaymentGatewayInterface {
  createOrGetCustomer(organization: Organization): Promise<string>;
  getCustomerByOrganizationId(organizationId: string): Promise<string | null>;

  embedded(
    uniqueId: string,
    organizationId: string,
    userId: string,
    body: BillingSubscribeDto,
    allowTrial: boolean
  ): Promise<unknown>;

  subscribe(
    uniqueId: string,
    organizationId: string,
    userId: string,
    body: BillingSubscribeDto,
    allowTrial: boolean
  ): Promise<unknown>;

  getCustomerSubscriptions(organizationId: string): Promise<unknown>;

  setToCancel(
    organizationId: string
  ): Promise<{ id: string; cancel_at?: Date }>;

  cancelSubscription(organizationId: string): Promise<{ cancelled: boolean }>;

  createBillingPortalLink(customer: string): Promise<{ url: string }>;
}
