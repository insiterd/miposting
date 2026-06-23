export const metadata = {
  title: "Precios — miposting",
  description: "Planes flexibles para agencias y creadores de contenido en República Dominicana.",
};

import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/mes",
    desc: "Perfecto para empezar",
    features: [
      "1 canal social",
      "50 posts/mes",
      "Calendario básico",
      "1 miembro de equipo",
    ],
    cta: "Empezar Gratis",
    href: "https://insiterd.miposting.com/register",
    featured: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mes",
    desc: "Para creadores y pequeñas agencias",
    features: [
      "10 canales sociales",
      "Posts ilimitados",
      "IA Auto-complete",
      "5 miembros de equipo",
      "Analíticas avanzadas",
      "Soporte prioritario",
    ],
    cta: "Probar 7 Días",
    href: "https://insiterd.miposting.com/register",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/mes",
    desc: "Para agencias en crecimiento",
    features: [
      "Canales ilimitados",
      "Posts ilimitados",
      "IA Copilot",
      "Miembros ilimitados",
      "Api pública",
      "OAuth integraciones",
      "Soporte dedicado 24/7",
    ],
    cta: "Contactar",
    href: "#contact",
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <section className="relative mt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="mx-auto max-w-3xl pb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
              Planes flexibles para tu agencia
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Elige el plan que mejor se adapte a tus necesidades. Todos incluyen 7 días de prueba gratuita.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-8 shadow-lg ${
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

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{plan.desc}</p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>

                <ul className="mb-8 flex-1 space-y-3">
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
                  className={`inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition ${
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
