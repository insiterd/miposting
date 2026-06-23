"use client";

import { useState } from "react";

const faqs = [
  {
    q: "¿Qué es miposting?",
    a: "miposting es una plataforma todo-en-uno para programar, publicar y analizar contenido en redes sociales. Está diseñada para agencias de marketing y creadores de contenido en República Dominicana.",
  },
  {
    q: "¿Tiene prueba gratuita?",
    a: "Sí, ofrecemos 7 días de prueba gratuita sin compromiso. Puedes cancelar en cualquier momento desde la configuración, sin hablar con nadie.",
  },
  {
    q: "¿Qué plataformas soporta?",
    a: "Soporta más de 28 plataformas incluyendo Instagram, TikTok, LinkedIn, X (Twitter), YouTube, Facebook, Threads, Pinterest, Dribbble, Discord, Slack, Telegram, Reddit, y más.",
  },
  {
    q: "¿Puedo invitar a mi equipo?",
    a: "Sí, puedes invitar a miembros de tu equipo, asignar roles y colaborar en la creación de contenido. Los planes superiores incluyen miembros de equipo ilimitados.",
  },
  {
    q: "¿Cómo funciona la inteligencia artificial?",
    a: "Nuestro agente IA te ayuda a generar ideas, escribir copies, crear imágenes y videos cortos, y programar publicaciones automáticamente.",
  },
  {
    q: "¿Puedo cancelar mi suscripción?",
    a: "Sí, puedes cancelar en cualquier momento desde la configuración de tu cuenta. No necesitas hablar con nadie ni enviar correos.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="mx-auto max-w-3xl pb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Preguntas Frecuentes
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Todo lo que necesitas saber antes de empezar.
            </p>
          </div>

          <div className="mx-auto max-w-3xl space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <button
                  className="flex w-full items-center justify-between px-6 py-4 text-left text-base font-medium text-gray-900"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <svg
                    className={`h-5 w-5 text-gray-400 transition-transform ${open === i ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {open === i && (
                  <div className="border-t border-gray-100 px-6 py-4 text-sm text-gray-600">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
