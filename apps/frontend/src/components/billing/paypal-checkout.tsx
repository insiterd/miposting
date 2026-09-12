'use client';

import { FC, useEffect, useRef, useState } from 'react';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { useVariables } from '@gitroom/react/helpers/variable.context';

/**
 * Checkout de PayPal, bifurcado del de Stripe (embedded.billing.tsx) por
 * decision explicita: PayPal usa el Embedded Checkout prearmado de Stripe
 * como widget separado, no una UI unificada. Ver first.billing.component.tsx
 * para donde se elige cual de los dos se renderiza.
 *
 * Sin libreria npm de por medio (CLAUDE.md: "Never install frontend
 * components from npmjs, focus on writing native components") — se carga el
 * SDK JS de PayPal directamente via <script>, igual que el snippet que
 * genera PayPal Button Factory, y se llama window.paypal.Buttons() a mano.
 *
 * La creacion de la suscripcion ocurre aqui mismo, en el navegador, contra
 * la API de PayPal directamente — no hay una llamada a nuestro backend para
 * "crear" nada; el backend (GatewayService.embedded()) solo resolvio de
 * antemano el plan_id y el custom_id (ver paypal.gateway.ts). Confirmar la
 * suscripcion en nuestra DB es responsabilidad exclusiva del webhook
 * (BILLING.SUBSCRIPTION.ACTIVATED), no de este componente.
 */

interface PayPalSubscriptionActions {
  subscription: {
    create: (options: {
      plan_id: string;
      custom_id?: string;
    }) => Promise<string>;
  };
}

interface PayPalButtonsInstance {
  render: (selector: string) => void;
}

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: {
        style?: Record<string, string>;
        createSubscription: (
          data: unknown,
          actions: PayPalSubscriptionActions
        ) => Promise<string>;
        onApprove: (data: { subscriptionID?: string | null }) => void;
        onError?: (err: unknown) => void;
      }) => PayPalButtonsInstance;
    };
  }
}

const SDK_SCRIPT_ID = 'paypal-js-sdk';

function loadPayPalScript(clientId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.paypal) {
      resolve();
      return;
    }
    const existing = document.getElementById(
      SDK_SCRIPT_ID
    ) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () =>
        reject(new Error('Failed to load PayPal SDK'))
      );
      return;
    }
    const script = document.createElement('script');
    script.id = SDK_SCRIPT_ID;
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
      clientId
    )}&vault=true&intent=subscription`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load PayPal SDK'));
    document.body.appendChild(script);
  });
}

export const PayPalCheckout: FC<{
  clientId: string;
  planId: string;
  customId: string;
}> = ({ clientId, planId, customId }) => {
  const t = useT();
  const { frontEndUrl } = useVariables();
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadPayPalScript(clientId)
      .then(() => {
        if (cancelled || !containerRef.current || !window.paypal) {
          return;
        }
        // Limpiar por si el efecto corre dos veces (React strict mode)
        containerRef.current.innerHTML = '';
        const buttonId = `paypal-button-container-${planId}`;
        containerRef.current.id = buttonId;

        window.paypal
          .Buttons({
            style: {
              shape: 'rect',
              color: 'gold',
              layout: 'vertical',
              label: 'subscribe',
            },
            createSubscription: (_data, actions) => {
              return actions.subscription.create({
                plan_id: planId,
                custom_id: customId,
              });
            },
            onApprove: () => {
              // La confirmacion real (escritura en Subscription) la hace el
              // webhook BILLING.SUBSCRIPTION.ACTIVATED, no este callback.
              //
              // A proposito SIN '?check=uniqueId' (a diferencia del
              // return_url de Stripe en stripe.service.ts): ese parametro
              // hace que CheckPaymentInner llame GET /billing/check/:id,
              // que si el webhook aun no llego cae en checkSubscription()
              // -> getCustomerSubscriptions() de StripeService (Stripe-only,
              // ver payment-gateway.interface.ts), tratando el paymentId de
              // PayPal como si fuera un customer id de Stripe. El propio
              // onApprove de PayPal ya es confirmacion suficiente de que el
              // comprador aprobo.
              window.location.href = `${frontEndUrl}/launches?onboarding=true`;
            },
            onError: (err) => {
              // eslint-disable-next-line no-console
              console.error('PayPal checkout error', err);
              setError(true);
            },
          })
          .render(`#${buttonId}`);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err);
        if (!cancelled) {
          setError(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [planId, customId, clientId]);

  return (
    <div className="flex flex-col gap-[16px]">
      <div ref={containerRef} />
      {error && (
        <div className="text-red-500 text-[13px]">
          {t(
            'billing_paypal_load_error',
            'Could not load PayPal. Please try again or use Stripe.'
          )}
        </div>
      )}
      <div className="text-center text-[12px] text-textItemBlur">
        {t('billing_powered_by_paypal', 'Secure payments processed by PayPal')}
      </div>
    </div>
  );
};
