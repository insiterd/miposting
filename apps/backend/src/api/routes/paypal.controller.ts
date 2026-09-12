import { Controller, HttpException, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { SubscriptionService } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/subscription.service';
import { OrganizationService } from '@gitroom/nestjs-libraries/database/prisma/organizations/organization.service';
import { pricing } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/pricing';
import { makeId } from '@gitroom/nestjs-libraries/services/make.is';
import { findTierAndPeriodByPlanId } from '@gitroom/nestjs-libraries/services/payment/paypal-plans';
import { verifyPayPalWebhookSignature } from '@gitroom/nestjs-libraries/services/payment/paypal-webhook.util';

/**
 * Payload de un webhook de PayPal, tal como llega por HTTP (snake_case) —
 * distinto del camelCase que usa el SDK para sus propias respuestas, porque
 * esto se parsea directo del body sin pasar por el deserializador del SDK.
 */
interface PayPalWebhookEvent {
  event_type: string;
  resource: {
    id?: string; // ID de la suscripcion
    plan_id?: string;
    custom_id?: string; // organizationId, ver paypal.gateway.ts
    status?: string;
  };
}

@ApiTags('PayPal')
@Controller('/paypal')
export class PayPalController {
  constructor(
    private _subscriptionService: SubscriptionService,
    private _organizationService: OrganizationService
  ) {}

  @Post('/')
  async webhook(@Req() req: Request) {
    const event = req.body as PayPalWebhookEvent;

    const verified = await verifyPayPalWebhookSignature(
      {
        authAlgo: req.headers['paypal-auth-algo'] as string,
        certUrl: req.headers['paypal-cert-url'] as string,
        transmissionId: req.headers['paypal-transmission-id'] as string,
        transmissionSig: req.headers['paypal-transmission-sig'] as string,
        transmissionTime: req.headers['paypal-transmission-time'] as string,
      },
      event
    ).catch(() => false);

    if (!verified) {
      throw new HttpException('Invalid PayPal webhook signature', 400);
    }

    try {
      switch (event.event_type) {
        case 'BILLING.SUBSCRIPTION.ACTIVATED':
        case 'BILLING.SUBSCRIPTION.UPDATED':
          return this.upsertSubscription(event);
        case 'BILLING.SUBSCRIPTION.CANCELLED':
        case 'BILLING.SUBSCRIPTION.EXPIRED':
          return this.removeSubscription(event);
        default:
          return { ok: true };
      }
    } catch (e) {
      throw new HttpException(e, 500);
    }
  }

  private async upsertSubscription(event: PayPalWebhookEvent) {
    const { id: subscriptionId, plan_id, custom_id: organizationId } =
      event.resource;

    if (!subscriptionId || !plan_id || !organizationId) {
      return { ok: true };
    }

    const tierAndPeriod = findTierAndPeriodByPlanId(plan_id);
    if (!tierAndPeriod) {
      // plan_id no mapeado en paypal-plans.ts — no deberia pasar si Fase 4
      // configuro las variables de entorno correctamente.
      return { ok: false };
    }

    const org = await this._organizationService.getOrgById(organizationId);
    if (!org) {
      return { ok: false };
    }

    // A diferencia de Stripe (donde paymentId es un customer id separado de
    // la suscripcion), para PayPal paymentId ES el subscription id — ver
    // nota (1) en paypal.gateway.ts.
    if (org.paymentId !== subscriptionId) {
      await this._subscriptionService.updateCustomerId(
        organizationId,
        subscriptionId
      );
    }

    return this._subscriptionService.createOrUpdateSubscription(
      event.resource.status !== 'ACTIVE',
      makeId(10),
      subscriptionId,
      pricing[tierAndPeriod.billing].channel!,
      tierAndPeriod.billing,
      tierAndPeriod.period,
      null,
      undefined,
      organizationId
    );
  }

  private async removeSubscription(event: PayPalWebhookEvent) {
    const { id: subscriptionId } = event.resource;
    if (!subscriptionId) {
      return { ok: true };
    }
    await this._subscriptionService.deleteSubscription(subscriptionId);
    return { ok: true };
  }
}
