export const metadata = {
  title: "Política de Privacidad — miposting",
  description:
    "Política de privacidad del servicio miposting, operado por InsiteRD.",
};

export default function Privacy() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="mb-2 text-4xl font-bold md:text-5xl">
          Política de Privacidad
        </h1>
        <p className="mb-8 text-gray-500">
          Última actualización: junio 2026
        </p>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              1. Responsable del Tratamiento
            </h2>
            <p>
              miposting es un servicio operado por <strong>InsiteRD</strong>.
              Somos responsables del tratamiento de tus datos personales en el
              contexto del servicio.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              2. Datos que Recogemos
            </h2>

            <h3 className="mb-1 mt-4 font-medium text-gray-900">
              2.1 Datos que nos proporcionas
            </h3>
            <ul className="ml-6 list-disc space-y-1">
              <li>Nombre, correo electrónico y contraseña (al registrarte)</li>
              <li>Información de perfil (foto, biografía, sitio web)</li>
              <li>Contenido que programas y publicas</li>
              <li>Conexiones a redes sociales (tokens de acceso)</li>
              <li>Información de facturación</li>
            </ul>

            <h3 className="mb-1 mt-4 font-medium text-gray-900">
              2.2 Datos recogidos automáticamente
            </h3>
            <ul className="ml-6 list-disc space-y-1">
              <li>Dirección IP</li>
              <li>Tipo de navegador y dispositivo</li>
              <li>Páginas visitadas y acciones en la plataforma</li>
              <li>Cookies funcionales y analíticas</li>
            </ul>

            <h3 className="mb-1 mt-4 font-medium text-gray-900">
              2.3 Datos de redes sociales
            </h3>
            <p>
              Cuando conectas una red social, accedemos a la información
              permitida por los permisos que otorgaste, que puede incluir:
            </p>
            <ul className="ml-6 mt-1 list-disc space-y-1">
              <li>Perfil público e información básica</li>
              <li>Lista de páginas y cuentas gestionadas</li>
              <li>Métricas y rendimiento de publicaciones</li>
            </ul>
            <p className="mt-2">
              Solo publicamos contenido en tu nombre cuando tú lo programas y
              autorizas expresamente.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              3. Finalidad del Tratamiento
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="py-2 pr-4 font-medium">Finalidad</th>
                    <th className="py-2 font-medium">Base Legal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 pr-4">
                      Proveer el servicio de programación y publicación
                    </td>
                    <td className="py-2">Ejecución del contrato</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 pr-4">
                      Facturación y gestión de pagos
                    </td>
                    <td className="py-2">Obligación legal</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 pr-4">
                      Mejorar y optimizar la plataforma
                    </td>
                    <td className="py-2">Interés legítimo</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 pr-4">
                      Comunicaciones de servicio (notificaciones, facturas)
                    </td>
                    <td className="py-2">Ejecución del contrato</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 pr-4">
                      Marketing y comunicaciones promocionales
                    </td>
                    <td className="py-2">Consentimiento</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              4. Almacenamiento y Seguridad
            </h2>
            <ul className="ml-6 list-disc space-y-1">
              <li>Tus datos se almacenan en servidores seguros</li>
              <li>
                Toda la comunicación está encriptada en tránsito (TLS/SSL)
              </li>
              <li>
                Los datos sensibles se almacenan con encriptación en reposo
              </li>
              <li>
                El acceso a datos está restringido al personal autorizado
              </li>
              <li>Realizamos copias de seguridad periódicas</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              5. Retención de Datos
            </h2>
            <ul className="ml-6 list-disc space-y-1">
              <li>
                Mantenemos tus datos mientras tu cuenta esté activa y mientras
                sea necesario para prestarte el servicio
              </li>
              <li>
                Al cancelar tu cuenta, eliminamos tus datos en un plazo máximo
                de 30 días
              </li>
              <li>
                Los datos de facturación se retienen por 5 años para cumplir con
                obligaciones fiscales
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              6. Tus Derechos
            </h2>
            <p>
              De acuerdo con la Ley 172-13 de Protección de Datos Personales de
              la República Dominicana y el Reglamento General de Protección de
              Datos (RGPD) de la Unión Europea, tienes los siguientes derechos:
            </p>
            <ul className="ml-6 mt-2 list-disc space-y-1">
              <li>
                <strong>Acceso:</strong> saber qué datos personales tenemos
                tuyos
              </li>
              <li>
                <strong>Rectificación:</strong> solicitar la corrección de datos
                inexactos
              </li>
              <li>
                <strong>Supresión:</strong> solicitar la eliminación de tus
                datos
              </li>
              <li>
                <strong>Portabilidad:</strong> recibir tus datos en un formato
                estructurado
              </li>
              <li>
                <strong>Oposición:</strong> objetar el tratamiento de tus datos
                para ciertas finalidades
              </li>
              <li>
                <strong>Limitación:</strong> restringir el tratamiento de tus
                datos
              </li>
            </ul>
            <p className="mt-3">
              Para ejercer cualquiera de estos derechos, escríbenos a{" "}
              <a
                href="mailto:info@insiterd.app"
                className="text-blue-600 underline hover:text-blue-800"
              >
                info@insiterd.app
              </a>
              . Responderemos a tu solicitud en un plazo máximo de 30 días.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              7. Compartición de Datos con Terceros
            </h2>
            <p className="mb-2">
              No vendemos tus datos personales a terceros. Para proveer el
              servicio, compartimos datos con los siguientes proveedores:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="py-2 pr-4 font-medium">Tercero</th>
                    <th className="py-2 font-medium">Propósito</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 pr-4">Proveedor de hosting</td>
                    <td className="py-2">
                      Alojamiento y procesamiento de datos
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 pr-4">Stripe</td>
                    <td className="py-2">
                      Procesamiento de pagos y facturación
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 pr-4">OpenAI</td>
                    <td className="py-2">
                      Generación de contenido con inteligencia artificial
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 pr-4">
                      Redes sociales (Meta, X, LinkedIn, etc.)
                    </td>
                    <td className="py-2">
                      Publicación de contenido que programes
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              8. Cookies
            </h2>
            <ul className="ml-6 list-disc space-y-1">
              <li>
                <strong>Funcionales:</strong> necesarias para el funcionamiento
                del sistema (sesión, autenticación)
              </li>
              <li>
                <strong>Analíticas:</strong> para mejorar la plataforma y
                entender cómo se usa. Puedes desactivarlas desde la
                configuración de tu navegador
              </li>
              <li>
                No utilizamos cookies de terceros para publicidad
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              9. Transferencias Internacionales
            </h2>
            <p>
              Tus datos pueden ser procesados en servidores ubicados fuera de
              la República Dominicana. En tales casos, aseguramos que se
              aplican garantías adecuadas mediante cláusulas contractuales
              estándar u otros mecanismos equivalentes.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              10. Cambios a esta Política
            </h2>
            <p>
              Podemos actualizar esta política de privacidad periódicamente. Te
              notificaremos cualquier cambio significativo con al menos 15 días
              de antelación por correo electrónico.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              11. Contacto
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
