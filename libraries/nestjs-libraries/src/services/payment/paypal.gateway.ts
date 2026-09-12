import { Injectable } from '@nestjs/common';
import { Organization } from '@prisma/client';
import {
  Client,
  Environment,
  SubscriptionsController,
} from '@paypal/paypal-server-sdk';
import { PaymentGatewayInterface } from '@gitroom/nestjs-libraries/services/payment/payment-gateway.interface';
import { BillingSubscribeDto } from '@gitroom/nestjs-libraries/dtos/billing/billing.subscribe.dto';
import { OrganizationService } from '@gitroom/nestjs-libraries/database/prisma/organizations/organization.service';
import { SubscriptionService } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/subscription.service';
import { makeId } from '@gitroom/nestjs-libraries/services/make.is';
import { paypalPlanMapping } from '@gitroom/nestjs-libraries/services/payment/paypal-plans';

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID || '',
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
  },
  environment:
    process.env.PAYPAL_MODE === 'production'
      ? Environment.Production
      : Environment.Sandbox,
});
const subscriptionsController = new SubscriptionsController(client);

/**
 * Implementacion PayPal del contrato comun (Fase 2).
 *
 * Diferencias de fondo con Stripe que NO se pueden abstraer y quedan
 * documentadas aqui en vez de disimuladas:
 *
 * 1. PayPal Subscriptions API no tiene un objeto "Customer" persistente que
 *    se cree por adelantado como Stripe. `organization.paymentId` para el
 *    camino PayPal guarda el ID de la SUSCRIPCION de PayPal (no un customer
 *    id), porque es lo unico que PayPal expone como referencia estable.
 *    Por eso `createOrGetCustomer` no llama a ninguna API — no hay nada que
 *    crear todavia; el ID real solo existe despues de que el comprador
 *    aprueba la suscripcion (webhook BILLING.SUBSCRIPTION.ACTIVATED).
 *
 * 2. La creacion de la suscripcion ocurre del lado del FRONTEND (Fase 3),
 *    via el SDK JS de PayPal (`actions.subscription.create({plan_id,
 *    custom_id})`) — es el patron de integracion recomendado para Smart
 *    Buttons y evita que el backend necesite crear la suscripcion el mismo.
 *    `embedded()`/`subscribe()` aqui solo RESUELVEN el plan_id correcto; no
 *    llaman a la API de PayPal salvo cuando el organizacion ya tiene una
 *    suscripcion activa y esta cambiando de plan (reviseSubscription, que
 *    si requiere al backend).
 *
 * 3. PayPal cancela subscripciones de forma INMEDIATA. No existe un
 *    equivalente nativo al "cancel_at_period_end" de Stripe. `setToCancel`
 *    aqui cancela ya mismo — no hay periodo de gracia — a diferencia del
 *    comportamiento de StripeGateway. Implementar una gracia real
 *    requeriria un job programado (Temporal) que llame al cancel de PayPal
 *    en la fecha correcta; queda fuera del alcance de esta fase.
 */
@Injectable()
export class PayPalGateway implements PaymentGatewayInterface {
  constructor(
    private _organizationService: OrganizationService,
    private _subscriptionService: SubscriptionService
  ) {}

  async createOrGetCustomer(organization: Organization): Promise<string> {
    // Ver nota (1) de la clase: no hay API de "customer" en PayPal
    // Subscriptions. paymentId solo se conoce tras la aprobacion del
    // comprador, y se persiste desde el webhook, no desde aqui.
    return organization.paymentId || '';
  }

  async getCustomerByOrganizationId(
    organizationId: string
  ): Promise<string | null> {
    const org = await this._organizationService.getOrgById(organizationId);
    return org?.paymentId ?? null;
  }

  private resolvePlanId(body: BillingSubscribeDto): string {
    const planId =
      paypalPlanMapping[body.billing as 'STANDARD' | 'PRO' | 'ULTIMATE']?.[
        body.period as 'MONTHLY' | 'YEARLY'
      ];
    if (!planId) {
      throw new Error(
        `No hay un plan de PayPal configurado para ${body.billing}/${body.period}. ` +
          `Crear el plan en PayPal Dashboard (Fase 4) y setear la variable de entorno correspondiente.`
      );
    }
    return planId;
  }

  async embedded(
    _uniqueId: string,
    organizationId: string,
    _userId: string,
    body: BillingSubscribeDto,
    _allowTrial: boolean
  ) {
    // La creacion real de la suscripcion la hace el frontend con el SDK de
    // PayPal (ver nota 2). Aqui solo resolvemos el plan_id y devolvemos el
    // organizationId como custom_id, para poder correlacionar el webhook.
    return {
      planId: this.resolvePlanId(body),
      customId: organizationId,
    };
  }

  async subscribe(
    uniqueId: string,
    organizationId: string,
    userId: string,
    body: BillingSubscribeDto,
    allowTrial: boolean
  ) {
    const org = await this._organizationService.getOrgById(organizationId);
    const planId = this.resolvePlanId(body);

    // Si ya tiene una suscripcion PayPal activa, es un cambio de plan:
    // esto SI requiere al backend (el frontend no puede hacer un "revise").
    // PayPal puede pedir que el comprador re-apruebe el cambio; si la
    // respuesta trae un link "approve", el frontend debe redirigir ahi en
    // vez de asumir que el cambio ya quedo aplicado.
    if (org?.paymentId) {
      const { result } = await subscriptionsController.reviseSubscription({
        id: org.paymentId,
        body: { planId },
      });
      const approveUrl = result.links?.find((l) => l.rel === 'approve')?.href;
      return { id: org.paymentId, revised: true, approveUrl };
    }

    // Suscriptor nuevo: mismo camino que embedded(), el frontend crea la
    // suscripcion via SDK JS de PayPal.
    return this.embedded(uniqueId, organizationId, userId, body, allowTrial);
  }

  async getCustomerSubscriptions(organizationId: string) {
    const org = await this._organizationService.getOrgById(organizationId);
    if (!org?.paymentId) {
      return null;
    }
    const { result } = await subscriptionsController.getSubscription({
      id: org.paymentId,
    });
    return result;
  }

  /**
   * Ver nota (3) de la clase: PayPal no soporta cancelacion al final del
   * periodo. Esto cancela de inmediato, igual que cancelSubscription().
   */
  async setToCancel(
    organizationId: string
  ): Promise<{ id: string; cancel_at?: Date }> {
    const id = makeId(10);
    await this.cancelSubscription(organizationId);
    return { id, cancel_at: new Date() };
  }

  async cancelSubscription(
    organizationId: string
  ): Promise<{ cancelled: boolean }> {
    const org = await this._organizationService.getOrgById(organizationId);
    if (!org?.paymentId) {
      throw new Error('No PayPal subscription found for this organization');
    }

    await subscriptionsController.cancelSubscription({
      id: org.paymentId,
      body: { reason: 'Cancelled by customer' },
    });
    await this._subscriptionService.deleteSubscription(org.paymentId);

    return { cancelled: true };
  }

  /**
   * PayPal no tiene un billing portal como Stripe. Apunta a la pagina de
   * billing propia de la app (Fase 3.5 debe agregarle un boton de
   * cancelar/gestionar que llame a los endpoints ya existentes de
   * billing.controller.ts).
   */
  async createBillingPortalLink(
    _customer: string
  ): Promise<{ url: string }> {
    return { url: `${process.env.FRONTEND_URL}/billing` };
  }
}
