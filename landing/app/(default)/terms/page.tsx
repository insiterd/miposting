export const metadata = {
  title: "Términos y Condiciones — miposting",
  description:
    "Términos y condiciones de uso del servicio miposting, operado por InsiteRD.",
};

export default function Terms() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="mb-8 text-4xl font-bold md:text-5xl">
          Términos y Condiciones
        </h1>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              1. Aceptación de los Términos
            </h2>
            <p>
              Al registrarte y usar miposting aceptas estos términos en su
              totalidad. Si no estás de acuerdo, no utilices el servicio.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              2. Descripción del Servicio
            </h2>
            <p>
              miposting es un SaaS que permite programar, publicar y analizar
              contenido en múltiples redes sociales. Incluye:
            </p>
            <ul className="ml-6 mt-2 list-disc space-y-1">
              <li>Programación multiplataforma</li>
              <li>Asistente de IA para generación de contenido</li>
              <li>Analíticas y reportes</li>
              <li>Colaboración en equipo</li>
              <li>Biblioteca de medios</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              3. Registro y Cuenta
            </h2>
            <ul className="ml-6 list-disc space-y-1">
              <li>Debes ser mayor de 18 años para registrarte</li>
              <li>Debes proporcionar información veraz y mantenerla actualizada</li>
              <li>Eres responsable de mantener la confidencialidad de tu contraseña</li>
              <li>
                El acceso está limitado a la cantidad de usuarios autorizados
                según el plan contratado. Queda prohibido compartir las
                credenciales de un usuario individual con terceros.
              </li>
              <li>
                Debes notificarnos inmediatamente sobre cualquier uso no
                autorizado de tu cuenta
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              4. Planes, Precios e Impuestos
            </h2>
            <ul className="ml-6 list-disc space-y-1">
              <li>Planes disponibles: Standard, Team y Pro con precios en DOP (RD$)</li>
              <li>Facturación mensual o anual (20% de descuento en plan anual)</li>
              <li>
                Período de prueba: 7 días gratis. No se requiere tarjeta de
                crédito
              </li>
              <li>Renovación automática al finalizar cada período</li>
              <li>Puedes cancelar en cualquier momento desde el panel de control</li>
              <li>Sin reembolsos por meses parciales ya facturados</li>
              <li>
                Los precios mostrados no incluyen impuestos aplicables (ITBIS
                18%), los cuales serán añadidos al momento de la facturación si
                corresponde
              </li>
              <li>
                Nos reservamos el derecho de modificar los precios con aviso
                previo de 30 días
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              5. Uso Aceptable
            </h2>
            <p className="mb-2">No está permitido:</p>
            <ul className="ml-6 list-disc space-y-1">
              <li>Usar el servicio para actividades ilegales</li>
              <li>Publicar contenido que infrinja derechos de autor</li>
              <li>Realizar spam o manipular métricas artificialmente</li>
              <li>Intentar vulnerar la seguridad del sistema</li>
              <li>Usar bots o scraping sin autorización expresa</li>
              <li>
                Violar los términos de uso de las redes sociales donde publiques
              </li>
            </ul>
            <p className="mt-3">
              El servicio depende directamente de las APIs y políticas de
              plataformas de terceros (Meta, X, LinkedIn, TikTok, YouTube, entre
              otras). No nos hacemos responsables por la suspensión, cambios de
              costos, limitaciones técnicas, eliminación de accesos o
              modificaciones unilaterales por parte de dichas plataformas, ni
              esto dará derecho a reembolsos.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              6. Contenido del Usuario
            </h2>
            <ul className="ml-6 list-disc space-y-1">
              <li>
                Tú conservas todos los derechos sobre tu contenido e
                información
              </li>
              <li>
                Nos otorgas una licencia para almacenar, procesar y distribuir
                tu contenido con el único fin de proveer el servicio
              </li>
              <li>
                No somos responsables por el contenido que publiques a través de
                la plataforma
              </li>
              <li>
                Podemos eliminar contenido que viole estos términos sin previo
                aviso
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              7. IA y Contenido Generado
            </h2>
            <ul className="ml-6 list-disc space-y-1">
              <li>
                El contenido generado por inteligencia artificial se ofrece "tal
                cual"
              </li>
              <li>
                Eres responsable de revisar y aprobar el contenido antes de
                publicarlo
              </li>
              <li>
                No garantizamos precisión, originalidad ni cumplimiento de
                derechos de autor del contenido generado por IA
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              8. Privacidad y Datos
            </h2>
            <p>
              El tratamiento de tus datos personales se rige por nuestra{" "}
              <a href="/privacy" className="text-blue-600 underline hover:text-blue-800">
                Política de Privacidad
              </a>
              , la cual forma parte integral de estos términos.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              9. Limitación de Responsabilidad
            </h2>
            <ul className="ml-6 list-disc space-y-1">
              <li>
                El servicio se provee "tal cual", sin garantías de ningún tipo
              </li>
              <li>
                No somos responsables por daños indirectos, pérdida de datos o
                interrupción del servicio
              </li>
              <li>
                Nuestra responsabilidad máxima se limita al monto total pagado
                por el servicio en los últimos 12 meses
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              10. Cancelación, Suspensión e Impago
            </h2>
            <ul className="ml-6 list-disc space-y-1">
              <li>
                Puedes cancelar tu cuenta en cualquier momento desde el panel
                de control
              </li>
              <li>
                Podemos suspender o cancelar cuentas que violen estos términos
              </li>
              <li>
                En caso de impago o fallo en la renovación automática, el
                sistema suspenderá el acceso a las funciones de programación de
                manera inmediata hasta que se regularice el balance
              </li>
              <li>
                Al cancelar tu cuenta, tus datos se eliminan en un plazo máximo
                de 30 días, salvo aquellos que debamos conservar por
                obligaciones legales o fiscales
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              11. Cambios a los Términos
            </h2>
            <p>
              Podemos modificar estos términos en cualquier momento. Te
              notificaremos con al menos 15 días de antelación por correo
              electrónico. El uso continuo del servicio después de los cambios
              constituye tu aceptación de los nuevos términos.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              12. Legislación Aplicable
            </h2>
            <p>
              Estos términos se rigen por las leyes de la República Dominicana.
              Cualquier disputa relacionada con el servicio se resolverá ante
              los tribunales competentes de Santo Domingo, República Dominicana.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              13. Contacto
            </h2>
            <p>
              miposting es un servicio operado por <strong>InsiteRD</strong>.
            </p>
            <ul className="ml-6 mt-2 list-disc space-y-1">
              <li>
                Email de contacto:{" "}
                <a
                  href="mailto:info@insiterd.app"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  info@insiterd.app
                </a>
              </li>
              <li>
                Sitio web:{" "}
                <a
                  href="https://miposting.insiterd.com"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  https://miposting.insiterd.com
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </section>
  );
}
