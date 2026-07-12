import PageIllustration from "@/components/page-illustration";

export default function HeroHome() {
  return (
    <section className="relative">
      <PageIllustration />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pb-12 pt-32 md:pb-20 md:pt-40">
          <div className="pb-12 text-center md:pb-16">
            <div className="mb-6 border-y [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-300/.8),transparent)1]" data-aos="zoom-y-out">
              <div className="mx-auto max-w-[180px] py-2">
                <img src="/miposting-favi.png" alt="miposting" className="w-full" />
              </div>
            </div>
            <h1 className="mb-6 border-y text-5xl font-bold [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-300/.8),transparent)1] md:text-6xl" data-aos="zoom-y-out" data-aos-delay={150}>
              Gestiona tus redes sociales <br className="max-lg:hidden" />
              desde un solo lugar
            </h1>
            <div className="mx-auto max-w-3xl">
              <p className="mb-8 text-lg text-gray-700" data-aos="zoom-y-out" data-aos-delay={300}>
                Programa, publica y analiza contenido en 28+ plataformas sociales. 
                La herramienta todo-en-uno para agencias de marketing en República Dominicana.
              </p>
              <div className="relative before:absolute before:inset-0 before:border-y before:[border-image:linear-gradient(to_right,transparent,--theme(--color-slate-300/.8),transparent)1]">
                <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center" data-aos="zoom-y-out" data-aos-delay={450}>
                  <a className="btn group mb-4 w-full bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-sm hover:bg-[length:100%_150%] sm:mb-0 sm:w-auto" href="https://app.miposting.com/register">
                    <span className="relative inline-flex items-center">
                      Prueba Gratis 7 Días{" "}
                      <span className="ml-1 tracking-normal text-blue-300 transition-transform group-hover:translate-x-0.5">
                        -&gt;
                      </span>
                    </span>
                  </a>
                  <a className="btn w-full bg-white text-gray-800 shadow-sm hover:bg-gray-50 sm:ml-4 sm:w-auto" href="#features">
                    Ver Funcionalidades
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
