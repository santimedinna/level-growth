import { NextResponse } from "next/server";
import { Resend } from "resend";

const FROM_EMAIL = process.env.FROM_EMAIL  ?? "contacto@levelgrowth.com.ar";
const TO_EMAIL   = process.env.TO_EMAIL    ?? "contacto@levelgrowth.com.ar";

/* ─── Mapa de opciones para el email ─────── */
const necesidadLabel: Record<string, string> = {
  auditoria:   "Auditoría gratis",
  landing:     "Landing page",
  publicidad:  "Gestión de publicidad",
  funnel:      "Funnel completo",
  orientacion: "No sé, necesito orientación",
};

export async function POST(request: Request) {
  /* 1. Parsear body */
  let body: {
    nombre:    string;
    email:     string;
    whatsapp?: string;
    sitio?:    string;
    necesidad: string;
    mensaje:   string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  /* 2. Validación mínima */
  if (!body.nombre || !body.email || !body.necesidad || !body.mensaje) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(body.email)) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  /* 3. Si no hay API key, loguear y devolver éxito (desarrollo local) */
  if (!process.env.RESEND_API_KEY) {
    console.log("[contact] RESEND_API_KEY no configurada — formulario recibido:", body);
    return NextResponse.json({ ok: true });
  }

  /* Inicializar Resend solo cuando hay API key */
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    /* 4a. Email interno — notificación para el equipo */
    await resend.emails.send({
      from:    `Level Growth <${FROM_EMAIL}>`,
      to:      TO_EMAIL,
      subject: `Nueva consulta: ${necesidadLabel[body.necesidad] ?? body.necesidad} — ${body.nombre}`,
      html: `
        <h2 style="font-family:sans-serif;margin:0 0 16px">Nueva solicitud de contacto</h2>
        <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%">
          <tr><td style="padding:8px 0;color:#666">Nombre</td><td style="padding:8px 0"><strong>${body.nombre}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0">${body.email}</td></tr>
          ${body.whatsapp ? `<tr><td style="padding:8px 0;color:#666">WhatsApp</td><td style="padding:8px 0">${body.whatsapp}</td></tr>` : ""}
          ${body.sitio ? `<tr><td style="padding:8px 0;color:#666">Sitio web</td><td style="padding:8px 0">${body.sitio}</td></tr>` : ""}
          <tr><td style="padding:8px 0;color:#666">Necesidad</td><td style="padding:8px 0">${necesidadLabel[body.necesidad] ?? body.necesidad}</td></tr>
        </table>
        <h3 style="font-family:sans-serif;margin:16px 0 8px">Mensaje</h3>
        <p style="font-family:sans-serif;font-size:14px;color:#333;line-height:1.6">${body.mensaje.replace(/\n/g, "<br>")}</p>
      `,
    });

    /* 4b. Email de confirmación al usuario */
    await resend.emails.send({
      from:    `Level Growth <${FROM_EMAIL}>`,
      to:      body.email,
      subject: "Recibimos tu consulta — Level Growth",
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto">
          <h2 style="color:#3FC87A;margin:0 0 16px">¡Hola, ${body.nombre}!</h2>
          <p style="font-size:15px;color:#333;line-height:1.7;margin:0 0 16px">
            Recibimos tu solicitud. En las próximas <strong>48 horas hábiles</strong>
            te enviamos el diagnóstico de tu negocio.
          </p>
          <p style="font-size:15px;color:#333;line-height:1.7;margin:0 0 24px">
            Si tenés alguna duda, respondé este email o escribinos directamente.
          </p>
          <p style="font-size:13px;color:#888;margin:0">
            — El equipo de Level Growth
          </p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Error al enviar email:", err);
    return NextResponse.json({ error: "Error al enviar el email" }, { status: 500 });
  }
}
