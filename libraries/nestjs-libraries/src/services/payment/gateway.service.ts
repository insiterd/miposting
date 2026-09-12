import { Injectable } from '@nestjs/common';
import { Organization } from '@prisma/client';
import { StripeService } from '@gitroom/nestjs-libraries/services/stripe.service';
import { PayPalGateway } from '@gitroom/nestjs-libraries/services/payment/paypal.gateway';
import { PaymentGatewayInterface } from '@gitroom/nestjs-libraries/services/payment/payment-gateway.interface';
import { BillingSubscribeDto } from '@gitroom/nestjs-libraries/dtos/billing/billing.subscribe.dto';

/**
 * Orquestador: decide en runtime que gateway usar segun PAYMENT_GATEWAY y
 * delega los metodos del contrato comun. billing.controller.ts sigue
 * inyectando StripeService directamente para todo lo que queda fuera de
 * PaymentGatewayInterface (chatbase refunds, cupones, prorate, lifetime deal).
 */
@Injectable()
export class GatewayService implements PaymentGatewayInterface {
  constructor(
    private _stripeService: StripeService,
    private _payPalGateway: PayPalGateway
  ) {}

  private get activeGateway(): PaymentGatewayInterface {
    return process.env.PAYMENT_GATEWAY === 'paypal'
      ? this._payPalGateway
      : this._stripeService;
  }

  createOrGetCustomer(organization: Organization) {
    return this.activeGateway.createOrGetCustomer(organization);
  }

  getCustomerByOrganizationId(organizationId: string) {
    return this.activeGateway.getCustomerByOrganizationId(organizationId);
  }

  embedded(
    uniqueId: string,
    organizationId: string,
    userId: string,
    body: BillingSubscribeDto,
    allowTrial: boolean
  ) {
    return this.activeGateway.embedded(
      uniqueId,
      organizationId,
      userId,
      body,
      allowTrial
    );
  }

  subscribe(
    uniqueId: string,
    organizationId: string,
    userId: string,
    body: BillingSubscribeDto,
    allowTrial: boolean
  ) {
    return this.activeGateway.subscribe(
      uniqueId,
      organizationId,
      userId,
      body,
      allowTrial
    );
  }

  getCustomerSubscriptions(organizationId: string) {
    return this.activeGateway.getCustomerSubscriptions(organizationId);
  }

  setToCancel(organizationId: string) {
    return this.activeGateway.setToCancel(organizationId);
  }

  cancelSubscription(organizationId: string) {
    return this.activeGateway.cancelSubscription(organizationId);
  }

  createBillingPortalLink(customer: string) {
    return this.activeGateway.createBillingPortalLink(customer);
  }
}
