import {
  Client,
  Environment,
  OAuthAuthorizationController,
} from '@paypal/paypal-server-sdk';

/**
 * El SDK oficial de PayPal (@paypal/paypal-server-sdk) solo cubre 5 APIs
 * (Orders, Payments, Vault, Transaction Search, Subscriptions) — la API de
 * verificacion de firma de webhooks (Notifications API v1) NO esta incluida.
 * Se llama manualmente: se pide un access token con el mismo cliente/secreto
 * via el controller de OAuth que si trae el SDK, y se hace la llamada REST
 * directa a /v1/notifications/verify-webhook-signature.
 *
 * A diferencia de Stripe (que valida localmente con HMAC sobre el body
 * crudo), PayPal delega la verificacion a su propio servidor: se le manda el
 * evento ya parseado como JSON, no los bytes crudos.
 */

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
const oAuthController = new OAuthAuthorizationController(client);

const baseUrl =
  process.env.PAYPAL_MODE === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

async function getAccessToken(): Promise<string> {
  const basicAuth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64');

  const { result } = await oAuthController.requestToken({
    authorization: `Basic ${basicAuth}`,
  });

  if (!result.accessToken) {
    throw new Error('PayPal no devolvio un access token');
  }
  return result.accessToken;
}

export interface PayPalWebhookHeaders {
  authAlgo: string;
  certUrl: string;
  transmissionId: string;
  transmissionSig: string;
  transmissionTime: string;
}

export async function verifyPayPalWebhookSignature(
  headers: PayPalWebhookHeaders,
  webhookEvent: unknown
): Promise<boolean> {
  if (!process.env.PAYPAL_WEBHOOK_ID) {
    throw new Error('PAYPAL_WEBHOOK_ID no esta configurado');
  }

  const accessToken = await getAccessToken();

  const response = await fetch(
    `${baseUrl}/v1/notifications/verify-webhook-signature`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_algo: headers.authAlgo,
        cert_url: headers.certUrl,
        transmission_id: headers.transmissionId,
        transmission_sig: headers.transmissionSig,
        transmission_time: headers.transmissionTime,
        webhook_id: process.env.PAYPAL_WEBHOOK_ID,
        webhook_event: webhookEvent,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `PayPal verify-webhook-signature respondio ${response.status}`
    );
  }

  const data = (await response.json()) as { verification_status?: string };
  return data.verification_status === 'SUCCESS';
}
