import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "Política de Privacidad — Level Growth",
  description: "Política de privacidad de Level Growth Agency. Información sobre el tratamiento de datos personales según la Ley 25.326.",
};

export default function PrivacidadPage() {
  return (
    <main className="py-[clamp(5rem,12vw,10rem)] px-[clamp(1.5rem,5vw,4rem)]">
      <div className="max-w-[680px] mx-auto">

        <p className="font-body text-xs text-lg-text-muted mb-4">Última actualización: mayo de 2026</p>
        <h1 className="font-display font-bold text-[clamp(1.75rem,4vw,2.5rem)] text-lg-text leading-tight mb-12">
          Política de Privacidad
        </h1>

        <h2 className="font-display font-medium text-[1.5rem] text-lg-text mt-0 mb-4 leading-snug">
          1. Responsable del tratamiento de datos
        </h2>
        <p className="font-body text-[1rem] text-lg-text-secondary leading-[1.75] mb-5">
          El responsable del tratamiento de los datos personales recolectados a través de este sitio web es:
        </p>
        <p className="font-body text-[1rem] text-lg-text-secondary leading-[1.75] mb-5">
          <strong className="text-lg-text font-medium">Santiago Medina — Level Growth Agency</strong><br />
          Sitio web:{" "}
          <a href="https://levelgrowthagency.com" className="text-lg-green hover:underline">
            levelgrowthagency.com
          </a><br />
          Email de contacto:{" "}
          <a href="mailto:santiago@levelgrowthagency.com" className="text-lg-green hover:underline">
            santiago@levelgrowthagency.com
          </a><br />
          Córdoba, Argentina
        </p>

        <h2 className="font-display font-medium text-[1.5rem] text-lg-text mt-12 mb-4 leading-snug">
          2. Datos que recolectamos
        </h2>
        <p className="font-body text-[1rem] text-lg-text-secondary leading-[1.75] mb-5">
          Recolectamos únicamente los datos que vos nos proporcionás de forma voluntaria a través del formulario de contacto del sitio:
        </p>
        <ul className="flex flex-col gap-2 mb-5">
          {["Nombre", "Dirección de correo electrónico", "Número de teléfono (si lo proporcionás)", "Mensaje o consulta"].map((item) => (
            <li key={item} className="flex items-start gap-2 font-body text-sm text-lg-text-secondary">
              <span className="text-lg-green shrink-0 mt-0.5">→</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="font-body text-[1rem] text-lg-text-secondary leading-[1.75] mb-5">
          <strong className="text-lg-text font-medium">No recolectamos</strong> datos de pago, datos sensibles ni información sin tu consentimiento explícito.
        </p>

        <h2 className="font-display font-medium text-[1.5rem] text-lg-text mt-12 mb-4 leading-snug">
          3. Finalidad del tratamiento
        </h2>
        <p className="font-body text-[1rem] text-lg-text-secondary leading-[1.75] mb-5">
          Los datos que nos enviás a través del formulario de contacto se utilizan exclusivamente para:
        </p>
        <ul className="flex flex-col gap-2 mb-5">
          {[
            "Responder tu consulta o solicitud",
            "Enviarte información sobre nuestros servicios si lo solicitás",
            "Coordinar una reunión o propuesta de trabajo",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 font-body text-sm text-lg-text-secondary">
              <span className="text-lg-green shrink-0 mt-0.5">→</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="font-body text-[1rem] text-lg-text-secondary leading-[1.75] mb-5">
          No utilizamos tus datos para campañas de email marketing sin tu consentimiento previo.
        </p>

        <h2 className="font-display font-medium text-[1.5rem] text-lg-text mt-12 mb-4 leading-snug">
          4. Almacenamiento de los datos
        </h2>
        <p className="font-body text-[1rem] text-lg-text-secondary leading-[1.75] mb-5">
          Los datos enviados a través del formulario de contacto llegan directamente a nuestra casilla de correo electrónico (santiago@levelgrowthagency.com) y{" "}
          <strong className="text-lg-text font-medium">no se almacenan en ninguna base de datos externa</strong>.
        </p>
        <p className="font-body text-[1rem] text-lg-text-secondary leading-[1.75] mb-5">
          Los correos se conservan mientras sean relevantes para la relación comercial y se eliminan a solicitud del usuario o cuando dejan de tener utilidad.
        </p>

        <h2 className="font-display font-medium text-[1.5rem] text-lg-text mt-12 mb-4 leading-snug">
          5. Herramientas de análisis y seguimiento
        </h2>
        <p className="font-body text-[1rem] text-lg-text-secondary leading-[1.75] mb-5">
          Este sitio utiliza{" "}
          <strong className="text-lg-text font-medium">Microsoft Clarity</strong>, una herramienta de análisis de comportamiento de usuarios desarrollada por Microsoft. Clarity puede recolectar información sobre cómo interactuás con el sitio web, incluyendo:
        </p>
        <ul className="flex flex-col gap-2 mb-5">
          {[
            "Movimientos del mouse y clics",
            "Mapas de calor y grabaciones de sesión (anonimizadas)",
            "Datos de navegación agregados",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 font-body text-sm text-lg-text-secondary">
              <span className="text-lg-green shrink-0 mt-0.5">→</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="font-body text-[1rem] text-lg-text-secondary leading-[1.75] mb-5">
          Esta información se utiliza exclusivamente para mejorar la experiencia del usuario en el sitio. Microsoft Clarity procesa los datos de acuerdo con su propia Política de Privacidad, disponible en:{" "}
          <a
            href="https://privacy.microsoft.com/privacystatement"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg-green hover:underline"
          >
            privacy.microsoft.com/privacystatement
          </a>
        </p>

        <h2 className="font-display font-medium text-[1.5rem] text-lg-text mt-12 mb-4 leading-snug">
          6. Compartición de datos con terceros
        </h2>
        <p className="font-body text-[1rem] text-lg-text-secondary leading-[1.75] mb-5">
          <strong className="text-lg-text font-medium">No vendemos, cedemos ni compartimos tus datos personales con terceros</strong>, salvo en los siguientes casos excepcionales:
        </p>
        <ul className="flex flex-col gap-2 mb-5">
          {[
            "Cuando sea requerido por ley o autoridad competente",
            "Con proveedores de servicios tecnológicos estrictamente necesarios para el funcionamiento del sitio (como Microsoft Clarity), quienes están obligados contractualmente a mantener la confidencialidad",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 font-body text-sm text-lg-text-secondary">
              <span className="text-lg-green shrink-0 mt-0.5">→</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <h2 className="font-display font-medium text-[1.5rem] text-lg-text mt-12 mb-4 leading-snug">
          7. Tus derechos (Ley 25.326)
        </h2>
        <p className="font-body text-[1rem] text-lg-text-secondary leading-[1.75] mb-5">
          De acuerdo con la{" "}
          <strong className="text-lg-text font-medium">Ley Nacional N° 25.326 de Protección de Datos Personales</strong>{" "}
          de la República Argentina, tenés derecho a:
        </p>
        <ul className="flex flex-col gap-2 mb-5">
          {[
            { bold: "Acceder", rest: " a los datos personales que tenemos sobre vos" },
            { bold: "Rectificar", rest: " datos incorrectos o desactualizados" },
            { bold: "Suprimir", rest: " tus datos cuando ya no sean necesarios" },
            { bold: "Oponerte", rest: " al tratamiento de tus datos en determinadas circunstancias" },
          ].map((item) => (
            <li key={item.bold} className="flex items-start gap-2 font-body text-sm text-lg-text-secondary">
              <span className="text-lg-green shrink-0 mt-0.5">→</span>
              <span><strong className="text-lg-text font-medium">{item.bold}</strong>{item.rest}</span>
            </li>
          ))}
        </ul>
        <p className="font-body text-[1rem] text-lg-text-secondary leading-[1.75] mb-5">
          Para ejercer cualquiera de estos derechos, podés contactarnos en:{" "}
          <a href="mailto:santiago@levelgrowthagency.com" className="text-lg-green hover:underline">
            santiago@levelgrowthagency.com
          </a>
        </p>
        <p className="font-body text-[1rem] text-lg-text-secondary leading-[1.75] mb-5">
          La Dirección Nacional de Protección de Datos Personales (DNPDP) es el organismo de control en Argentina. Podés encontrar más información en:{" "}
          <a
            href="https://www.argentina.gob.ar/aaip/datospersonales"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg-green hover:underline"
          >
            argentina.gob.ar/aaip/datospersonales
          </a>
        </p>

        <h2 className="font-display font-medium text-[1.5rem] text-lg-text mt-12 mb-4 leading-snug">
          8. Seguridad
        </h2>
        <p className="font-body text-[1rem] text-lg-text-secondary leading-[1.75] mb-5">
          Implementamos medidas técnicas y organizativas razonables para proteger tus datos personales contra el acceso no autorizado, la pérdida o la alteración. El sitio opera bajo protocolo HTTPS.
        </p>

        <h2 className="font-display font-medium text-[1.5rem] text-lg-text mt-12 mb-4 leading-snug">
          9. Cambios en esta política
        </h2>
        <p className="font-body text-[1rem] text-lg-text-secondary leading-[1.75] mb-5">
          Nos reservamos el derecho de actualizar esta Política de Privacidad en cualquier momento. Cuando lo hagamos, actualizaremos la fecha de &ldquo;última actualización&rdquo; al inicio de este documento. Te recomendamos revisarla periódicamente.
        </p>

        <h2 className="font-display font-medium text-[1.5rem] text-lg-text mt-12 mb-4 leading-snug">
          10. Contacto
        </h2>
        <p className="font-body text-[1rem] text-lg-text-secondary leading-[1.75] mb-5">
          Si tenés dudas, consultas o solicitudes relacionadas con esta política, podés escribirnos a:{" "}
          <a href="mailto:santiago@levelgrowthagency.com" className="text-lg-green hover:underline">
            santiago@levelgrowthagency.com
          </a>
        </p>

      </div>
    </main>
  );
}
