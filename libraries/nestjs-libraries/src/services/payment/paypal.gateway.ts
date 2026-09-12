import { Injectable } from '@nestjs/common';
import { Organization } from '@prisma/client';
import { PaymentGatewayInterface } from '@gitroom/nestjs-libraries/services/payment/payment-gateway.interface';
import { BillingSubscribeDto } from '@gitroom/nestjs-libraries/dtos/billing/billing.subscribe.dto';

/**
 * Implementacion PayPal del contrato comun. Placeholder de Fase 1: deja
 * GatewayService inyectable y compilando antes de escribir la integracion
 * real con la API de PayPal (Fase 2).
 */
@Injectable()
export class PayPalGateway implements PaymentGatewayInterface {
  private notImplemented(method: string): never {
    throw new Error(
      `PayPalGateway.${method} no esta implementado todavia (Fase 2)`
    );
  }

  createOrGetCustomer(_organization: Organization): Promise<string> {
    this.notImplemented('createOrGetCustomer');
  }

  getCustomerByOrganizationId(
    _organizationId: string
  ): Promise<string | null> {
    this.notImplemented('getCustomerByOrganizationId');
  }

  embedded(
    _uniqueId: string,
    _organizationId: string,
    _userId: string,
    _body: BillingSubscribeDto,
    _allowTrial: boolean
  ): Promise<unknown> {
    this.notImplemented('embedded');
  }

  subscribe(
    _uniqueId: string,
    _organizationId: string,
    _userId: string,
    _body: BillingSubscribeDto,
    _allowTrial: boolean
  ): Promise<unknown> {
    this.notImplemented('subscribe');
  }

  getCustomerSubscriptions(_organizationId: string): Promise<unknown> {
    this.notImplemented('getCustomerSubscriptions');
  }

  setToCancel(
    _organizationId: string
  ): Promise<{ id: string; cancel_at?: Date }> {
    this.notImplemented('setToCancel');
  }

  cancelSubscription(
    _organizationId: string
  ): Promise<{ cancelled: boolean }> {
    this.notImplemented('cancelSubscription');
  }

  createBillingPortalLink(_customer: string): Promise<{ url: string }> {
    this.notImplemented('createBillingPortalLink');
  }
}
