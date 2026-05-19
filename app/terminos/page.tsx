import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "Términos y Condiciones — Level Growth",
  description: "Términos y condiciones de uso del sitio web de Level Growth Agency. Ley aplicable: República Argentina.",
};

export default function TerminosPage() {
  return (
    <main className="py-[clamp(5rem,12vw,10rem)] px-[clamp(1.5rem,5vw,4rem)]">
      <div className="max-w-[680px] mx-auto">

        <p className="font-body text-xs text-lg-text-muted mb-4">Última actualización: mayo de 2026</p>
        <h1 className="font-display font-bold text-[clamp(1.75rem,4vw,2.5rem)] text-lg-text leading-tight mb-12">
          Términos y Condiciones
        </h1>

        <h2 className="font-display font-medium text-[1.5rem] text-lg-text mt-0 mb-4 leading-snug">
          1. Aceptación de los términos
        </h2>
        <p className="font-body text-[1rem] text-lg-text-secondary leading-[1.75] mb-5">
          Al acceder y utilizar el sitio web{" "}
          <a href="https://levelgrowthagency.com" className="text-lg-green hover:underline">
            levelgrowthagency.com
          </a>
          , aceptás estos Términos y Condiciones en su totalidad. Si no estás de acuerdo con alguno de estos términos, te pedimos que no utilices el sitio.
        </p>

        <h2 className="font-display font-medium text-[1.5rem] text-lg-text mt-12 mb-4 leading-snug">
          2. Sobre Level Growth Agency
        </h2>
        <p className="font-body text-[1rem] text-lg-text-secondary leading-[1.75] mb-5">
          Level Growth es una agencia de crecimiento digital con sede en Córdoba, Argentina, que ofrece servicios de desarrollo web, publicidad digital, SEO y optimización de conversión. El responsable es Santiago Medina (
          <a href="mailto:santiago@levelgrowthagency.com" className="text-lg-green hover:underline">
            santiago@levelgrowthagency.com
          </a>
          ).
        </p>

        <h2 className="font-display font-medium text-[1.5rem] text-lg-text mt-12 mb-4 leading-snug">
          3. Uso del sitio web
        </h2>
        <p className="font-body text-[1rem] text-lg-text-secondary leading-[1.75] mb-5">
          Este sitio web tiene carácter informativo y comercial. Al utilizarlo, te comprometés a:
        </p>
        <ul className="flex flex-col gap-2 mb-5">
          {[
            "Hacer un uso lícito y apropiado del sitio",
            "No intentar acceder a sistemas o datos de forma no autorizada",
            "No reproducir, distribuir ni utilizar el contenido del sitio sin autorización previa",
            "No utilizar el sitio para enviar comunicaciones no solicitadas (spam)",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 font-body text-sm text-lg-text-secondary">
              <span className="text-lg-green shrink-0 mt-0.5">→</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <h2 className="font-display font-medium text-[1.5rem] text-lg-text mt-12 mb-4 leading-snug">
          4. Propiedad intelectual
        </h2>
        <p className="font-body text-[1rem] text-lg-text-secondary leading-[1.75] mb-5">
          Todo el contenido publicado en este sitio — incluyendo textos, diseños, logotipos, imágenes, código fuente y estructura visual — es propiedad de Level Growth Agency o de sus respectivos autores, y está protegido por las leyes de propiedad intelectual vigentes en Argentina.
        </p>
        <p className="font-body text-[1rem] text-lg-text-secondary leading-[1.75] mb-5">
          Queda expresamente prohibida su reproducción, distribución, modificación o uso comercial sin autorización escrita previa de Level Growth Agency.
        </p>

        <h2 className="font-display font-medium text-[1.5rem] text-lg-text mt-12 mb-4 leading-snug">
          5. Servicios ofrecidos
        </h2>
        <p className="font-body text-[1rem] text-lg-text-secondary leading-[1.75] mb-5">
          La información sobre servicios publicada en este sitio tiene carácter orientativo. Las condiciones específicas de cada servicio (alcance, plazos, precios y entregables) se definen mediante propuesta comercial y acuerdo escrito entre las partes.
        </p>
        <p className="font-body text-[1rem] text-lg-text-secondary leading-[1.75] mb-5">
          Level Growth Agency se reserva el derecho de modificar, suspender o discontinuar cualquier servicio en cualquier momento, sin previo aviso.
        </p>

        <h2 className="font-display font-medium text-[1.5rem] text-lg-text mt-12 mb-4 leading-snug">
          6. Formulario de contacto
        </h2>
        <p className="font-body text-[1rem] text-lg-text-secondary leading-[1.75] mb-5">
          Al completar el formulario de contacto de este sitio, confirmás que la información proporcionada es veraz y que consentís el tratamiento de tus datos según nuestra{" "}
          <a href="/privacidad" className="text-lg-green hover:underline">
            Política de Privacidad
          </a>
          . El envío del formulario no implica la contratación de ningún servicio ni genera ninguna obligación comercial entre las partes.
        </p>

        <h2 className="font-display font-medium text-[1.5rem] text-lg-text mt-12 mb-4 leading-snug">
          7. Enlaces a sitios de terceros
        </h2>
        <p className="font-body text-[1rem] text-lg-text-secondary leading-[1.75] mb-5">
          Este sitio puede contener enlaces a sitios web de terceros. Level Growth Agency no tiene control sobre el contenido de esos sitios y no asume responsabilidad alguna por su contenido, políticas de privacidad o prácticas.
        </p>

        <h2 className="font-display font-medium text-[1.5rem] text-lg-text mt-12 mb-4 leading-snug">
          8. Limitación de responsabilidad
        </h2>
        <p className="font-body text-[1rem] text-lg-text-secondary leading-[1.75] mb-5">
          Level Growth Agency no se responsabiliza por:
        </p>
        <ul className="flex flex-col gap-2 mb-5">
          {[
            "Interrupciones o errores en el funcionamiento del sitio",
            "Daños directos o indirectos derivados del uso o imposibilidad de uso del sitio",
            "Resultados específicos de negocio derivados del uso de nuestros servicios, los cuales dependen de múltiples factores externos",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 font-body text-sm text-lg-text-secondary">
              <span className="text-lg-green shrink-0 mt-0.5">→</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <h2 className="font-display font-medium text-[1.5rem] text-lg-text mt-12 mb-4 leading-snug">
          9. Modificaciones de los términos
        </h2>
        <p className="font-body text-[1rem] text-lg-text-secondary leading-[1.75] mb-5">
          Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios entrarán en vigor desde su publicación en el sitio. El uso continuado del sitio después de la publicación de los cambios implica la aceptación de los nuevos términos.
        </p>

        <h2 className="font-display font-medium text-[1.5rem] text-lg-text mt-12 mb-4 leading-snug">
          10. Ley aplicable y jurisdicción
        </h2>
        <p className="font-body text-[1rem] text-lg-text-secondary leading-[1.75] mb-5">
          Estos Términos y Condiciones se rigen por las leyes de la{" "}
          <strong className="text-lg-text font-medium">República Argentina</strong>. Para cualquier controversia que surja en relación con estos términos, las partes se someten a la jurisdicción de los{" "}
          <strong className="text-lg-text font-medium">tribunales ordinarios de la ciudad de Córdoba, Argentina</strong>.
        </p>

        <h2 className="font-display font-medium text-[1.5rem] text-lg-text mt-12 mb-4 leading-snug">
          11. Contacto
        </h2>
        <p className="font-body text-[1rem] text-lg-text-secondary leading-[1.75] mb-5">
          Para cualquier consulta relacionada con estos términos:
        </p>
        <p className="font-body text-[1rem] text-lg-text-secondary leading-[1.75] mb-5">
          <strong className="text-lg-text font-medium">Santiago Medina — Level Growth Agency</strong><br />
          Email:{" "}
          <a href="mailto:santiago@levelgrowthagency.com" className="text-lg-green hover:underline">
            santiago@levelgrowthagency.com
          </a><br />
          Sitio web:{" "}
          <a href="https://levelgrowthagency.com" className="text-lg-green hover:underline">
            levelgrowthagency.com
          </a>
        </p>

      </div>
    </main>
  );
}
