export const metadata = {
  title: "Precios — miposting",
  description: "Planes flexibles para agencias y creadores de contenido en República Dominicana.",
};

import Link from "next/link";

const networks = {
  standard: [
    { name: "Facebook", color: "text-[#1877F2]", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
    { name: "Instagram", color: "text-pink-500", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
    { name: "LinkedIn", color: "text-[#0A66C2]", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
    { name: "Threads", color: "text-gray-900", vb: "0 0 640 640", path: "M436.8 302C436.2 232.4 398.5 190.5 334.8 190.5c-42.5 0-78.3 19.2-97.1 49.9l41.2 28.7c10.7-16.8 25.4-30.8 52.4-30.8 30.5 0 46.3 17 50.8 48.5-14.7-2.3-29.5-3.5-44.6-3.5-82.4 0-121.1 37.3-121.1 86.6s38.8 79.7 95.9 79.7c62.7 0 100.1-42.2 115.4-94.5 15.9 7.2 26.9 24 26.9 49.3 0 67.6-78 104.5-144.1 104.5-97.5 0-161.3-64-161.3-168.2 0-127.6 84.3-209.4 197.6-209.4 76 0 113.6 33.4 139.2 78l42-29.5c-27.8-58-89.9-99.5-183.1-99.5C196.4 80.4 95.4 185.8 95.4 338.6 95.4 478.4 194.3 559.5 312.1 559.5 409.5 559.5 507.9 502.7 507.9 405.5c0-50.8-29.2-84.5-71.1-103.5zM310.4 398.9c-21.5 0-40.4-10.2-40.4-29 0-29.6 36.4-38.6 72-38.6 13.5 0 26.8.9 38.5 3.5-8.4 38.5-33.4 64.2-70 64.2z" },
    { name: "X", color: "text-gray-900", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
  ],
  team: [
    { name: "YouTube", color: "text-[#FF0000]", path: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
    { name: "TikTok", color: "text-gray-900", path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" },
    { name: "Pinterest", color: "text-pink-600", path: "M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" },
    { name: "Dribbble", color: "text-pink-400", path: "M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4.006-.816zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.29zm10.335 3.483c-.218.29-1.91 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z" },
    { name: "GMB", color: "text-blue-600", path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" },
  ],
  pro: ["Reddit", "Discord", "Slack", "Telegram", "Medium", "Dev.to", "Hashnode", "WordPress"],
  ultimate: ["Bluesky", "Mastodon", "Kick", "Twitch", "Farcaster", "Nostr", "VK", "Lemmy", "Listmonk", "Moltbook", "Whop", "Skool", "MeWe"],
};

function NetworkIcon({ name, color, path, vb }: { name: string; color?: string; path?: string; vb?: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs" title={name}>
      {path ? (
        <svg className={`h-3.5 w-3.5 shrink-0 ${color || "text-gray-500"}`} viewBox={vb || "0 0 24 24"} fill="currentColor">
          <path d={path} />
        </svg>
      ) : (
        <div className="h-3.5 w-3.5 shrink-0 rounded-full bg-gray-300" />
      )}
      <span className="text-gray-500">{name}</span>
    </div>
  );
}

const plans = [
  {
    name: "Standard",
    price: "RD$1,250",
    period: "/mes",
    subtitle: "Ideal para emprendedores",
    desc: "Todo lo que necesitas para empezar a crecer en redes sociales",
    features: [
      "Publica hasta 400 posts al mes",
      "IA que te ayuda a escribir contenido",
      "Crea hasta 3 videos con IA al mes",
      "Importa publicaciones desde otras plataformas",
      "Acceso a la API pública",
    ],
    included: networks.standard,
    extra: null,
    cta: "Probar 7 Días Gratis",
    href: "https://miposting.insiterd.com/register",
    featured: false,
  },
  {
    name: "Team",
    price: "RD$2,000",
    period: "/mes",
    subtitle: "Ideal para negocios",
    desc: "Colabora con tu equipo y automatiza tu estrategia",
    features: [
      "Publicaciones ilimitadas",
      "IA que genera y optimiza contenido",
      "Crea hasta 10 videos con IA al mes",
      "Invita a tu equipo a colaborar",
      "Publicación automática inteligente",
    ],
    included: [...networks.standard, ...networks.team],
    extra: null,
    cta: "Probar 7 Días Gratis",
    href: "https://miposting.insiterd.com/register",
    featured: true,
  },
  {
    name: "Pro",
    price: "RD$3,500",
    period: "/mes",
    subtitle: "Ideal para agencias",
    desc: "La solución completa para profesionales del contenido",
    features: [
      "Publicaciones ilimitadas",
      "IA Copilot: tu asistente personal",
      "Crea hasta 30 videos con IA al mes",
      "Hasta 300 imágenes generadas con IA",
      "Soporte prioritario",
    ],
    included: [...networks.standard, ...networks.team],
    extra: { label: "8 redes adicionales", items: networks.pro },
    cta: "Probar 7 Días Gratis",
    href: "https://miposting.insiterd.com/register",
    featured: false,
  },
  {
    name: "Ultimate",
    price: "RD$5,000",
    period: "/mes",
    subtitle: "Ideal para empresas",
    desc: "Acceso completo a todas las plataformas y funcionalidades",
    features: [
      "Publicaciones ilimitadas",
      "Todas las funcionalidades de IA",
      "Crea hasta 60 videos con IA al mes",
      "Hasta 500 imágenes generadas con IA",
      "Hasta 10,000 webhooks",
    ],
    included: [...networks.standard, ...networks.team],
    extra: { label: "21 redes adicionales", items: networks.pro },
    cta: "Probar 7 Días Gratis",
    href: "https://miposting.insiterd.com/register",
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <section className="relative mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="mx-auto max-w-3xl pb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
              Planes flexibles para tu agencia
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Elige el plan que mejor se adapte a tus necesidades. Todos incluyen 7 días de prueba gratuita.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-6 shadow-lg ${
                  plan.featured
                    ? "border-blue-500 bg-white ring-2 ring-blue-500"
                    : "border-gray-200 bg-white"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-4 py-1 text-xs font-semibold text-white">
                    Más popular
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="mt-1 text-sm font-medium text-blue-600">{plan.subtitle}</p>
                  <p className="mt-1 text-sm text-gray-500">{plan.desc}</p>
                </div>

                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>

                <div className="mb-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Redes incluidas
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                    {plan.included.map((n) => (
                      <NetworkIcon key={n.name} {...n} />
                    ))}
                    {plan.extra && (
                      <span
                        className="cursor-pointer text-xs text-blue-600 underline decoration-dotted hover:text-blue-700"
                        title={plan.extra.items.join(", ")}
                      >
                        +{plan.extra.items.length} más
                      </span>
                    )}
                  </div>
                </div>

                <ul className="mb-6 flex-1 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="h-4 w-4 shrink-0 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                    plan.featured
                      ? "bg-blue-500 text-white shadow-sm hover:bg-blue-600"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
