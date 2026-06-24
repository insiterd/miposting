import React from "react";

export default function FeaturesPlanet() {
  const features = [
    {
      title: "Calendario Visual",
      desc: "Arrastra y suelta tus publicaciones en un calendario intuitivo. Programa contenido para semanas o meses en segundos.",
      icon: "calendar",
    },
    {
      title: "Agente IA",
      desc: "Tu asistente personal con IA que genera ideas, escribe copies y programa publicaciones automáticamente.",
      icon: "sparkles",
    },
    {
      title: "28+ Plataformas",
      desc: "Instagram, TikTok, LinkedIn, X, YouTube, Facebook, Threads, Pinterest y más. Todas desde un solo panel.",
      icon: "grid",
    },
    {
      title: "Analíticas",
      desc: "Métricas en tiempo real de rendimiento, engagement y crecimiento en todas tus cuentas conectadas.",
      icon: "chart",
    },
    {
      title: "Equipos",
      desc: "Invita a tu equipo, asigna roles y colabora en la creación de contenido con flujos de aprobación.",
      icon: "users",
    },
    {
      title: "Contenido IA",
      desc: "Genera imágenes, videos cortos y copies con IA. Crea contenido viral sin esfuerzo.",
      icon: "magic",
    },
  ];

  const icons: Record<string, React.JSX.Element> = {
    calendar: (
      <svg className="fill-blue-500" xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24">
        <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z"/>
      </svg>
    ),
    sparkles: (
      <svg className="fill-blue-500" xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24">
        <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2zM5 16l1-3 1 3 3 1-3 1-1 3-1-3-3-1 3-1zM17 12l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z"/>
      </svg>
    ),
    grid: (
      <svg className="fill-blue-500" xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24">
        <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"/>
      </svg>
    ),
    chart: (
      <svg className="fill-blue-500" xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24">
        <path d="M5 9h3v10H5V9zm5-4h3v14h-3V5zm5 7h3v7h-3v-7z"/>
      </svg>
    ),
    users: (
      <svg className="fill-blue-500" xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg>
    ),
    magic: (
      <svg className="fill-blue-500" xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24">
        <path d="M19.5 2.5L21 4l-1.5 1.5L21 7l-1.5-1.5L18 7l1.5-1.5L18 4l1.5-1.5zM10 3L8 7 4 9l4 2 2 4 2-4 4-2-4-2-2-4zm5 11l-1.5 2.5L11 18l2.5 1.5L15 22l1.5-2.5L19 18l-2.5-1.5L15 14z"/>
      </svg>
    ),
  };

  return (
    <section id="features" className="relative before:absolute before:inset-0 before:-z-20 before:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="mx-auto max-w-3xl pb-16 text-center md:pb-20">
            <h2 className="text-3xl font-bold text-gray-200 md:text-4xl">
              Todo lo que necesitas para gestionar redes sociales
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              miposting combina programación, IA, analíticas y colaboración en equipo en una sola plataforma.
            </p>
          </div>

          <div className="grid overflow-hidden sm:grid-cols-2 lg:grid-cols-3 *:relative *:p-6 *:before:absolute *:before:bg-gray-800 *:before:[block-size:100vh] *:before:[inline-size:1px] *:before:[inset-block-start:0] *:before:[inset-inline-start:-1px] *:after:absolute *:after:bg-gray-800 *:after:[block-size:1px] *:after:[inline-size:100vw] *:after:[inset-block-start:-1px] *:after:[inset-inline-start:0] md:*:p-10">
            {features.map((f) => (
              <article key={f.title}>
                <h3 className="mb-2 flex items-center space-x-2 font-medium text-gray-200">
                  {icons[f.icon]}
                  <span>{f.title}</span>
                </h3>
                <p className="text-[15px] text-gray-400">{f.desc}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center" data-aos="zoom-y-out">
            <a
              className="btn inline-flex bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-sm hover:bg-[length:100%_150%]"
              href="https://miposting.insiterd.com/register"
            >
              <span className="relative inline-flex items-center">
                Prueba Gratis 7 Días{" "}
                <span className="ml-1 tracking-normal text-blue-300 transition-transform group-hover:translate-x-0.5">
                  -&gt;
                </span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
