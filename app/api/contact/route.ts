import { NextResponse } from "next/server";
import { Resend } from "resend";

const FROM_EMAIL = process.env.FROM_EMAIL ?? "santiago@levelgrowthagency.com";
const TO_EMAIL   = process.env.TO_EMAIL   ?? "santiago@levelgrowthagency.com";

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

  const necesidad = necesidadLabel[body.necesidad] ?? body.necesidad;

  try {
    /* ── EMAIL A: Notificación interna ───────── */
    await resend.emails.send({
      from:    `Level Growth <${FROM_EMAIL}>`,
      to:      TO_EMAIL,
      subject: `Nuevo lead — ${body.nombre}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px 0">
          <h2 style="margin:0 0 24px;font-size:20px;color:#111">
            Nuevo lead del formulario de contacto
          </h2>

          <table style="font-size:14px;border-collapse:collapse;width:100%;color:#333">
            <tr style="border-bottom:1px solid #eee">
              <td style="padding:10px 0;color:#888;width:130px">Nombre</td>
              <td style="padding:10px 0"><strong>${body.nombre}</strong></td>
            </tr>
            <tr style="border-bottom:1px solid #eee">
              <td style="padding:10px 0;color:#888">Email</td>
              <td style="padding:10px 0">
                <a href="mailto:${body.email}" style="color:#3FC87A">${body.email}</a>
              </td>
            </tr>
            ${body.whatsapp ? `
            <tr style="border-bottom:1px solid #eee">
              <td style="padding:10px 0;color:#888">WhatsApp</td>
              <td style="padding:10px 0">
                <a href="https://wa.me/${body.whatsapp.replace(/\D/g, "")}" style="color:#3FC87A">${body.whatsapp}</a>
              </td>
            </tr>` : ""}
            ${body.sitio ? `
            <tr style="border-bottom:1px solid #eee">
              <td style="padding:10px 0;color:#888">Sitio web</td>
              <td style="padding:10px 0">
                <a href="${body.sitio}" style="color:#3FC87A" target="_blank">${body.sitio}</a>
              </td>
            </tr>` : ""}
            <tr style="border-bottom:1px solid #eee">
              <td style="padding:10px 0;color:#888">Necesidad</td>
              <td style="padding:10px 0">${necesidad}</td>
            </tr>
          </table>

          <h3 style="margin:24px 0 8px;font-size:15px;color:#111">Descripción del negocio</h3>
          <p style="font-size:14px;color:#333;line-height:1.7;margin:0;background:#f9f9f9;padding:14px 16px;border-radius:6px;border-left:3px solid #3FC87A">
            ${body.mensaje.replace(/\n/g, "<br>")}
          </p>
        </div>
      `,
    });

    /* ── EMAIL B: Confirmación al prospecto ──── */
    await resend.emails.send({
      from:    `Santiago de Level Growth <${FROM_EMAIL}>`,
      to:      body.email,
      subject: "Recibimos tu consulta — Level Growth",
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px 0;color:#333">
          <p style="font-size:16px;margin:0 0 20px">Hola ${body.nombre},</p>

          <p style="font-size:15px;line-height:1.7;margin:0 0 16px">
            Recibimos tu consulta. Te respondo personalmente
            en <strong>menos de 48 horas hábiles</strong> con un análisis de tu situación.
          </p>

          <p style="font-size:15px;line-height:1.7;margin:0 0 16px">
            Si necesitás respuesta más rápida, podés escribirme directo por WhatsApp:
          </p>

          <p style="margin:0 0 28px">
            <a
              href="https://wa.me/5493512613927"
              style="display:inline-block;background:#25D366;color:white;font-size:14px;font-weight:600;padding:10px 20px;border-radius:6px;text-decoration:none"
            >
              Escribir por WhatsApp
            </a>
          </p>

          <p style="font-size:15px;line-height:1.7;margin:0 0 32px">
            Mientras tanto, si querés avanzar algo, contame un poco más sobre tu negocio respondiendo este email.
          </p>

          <p style="font-size:14px;color:#888;margin:0;border-top:1px solid #eee;padding-top:20px">
            Santiago<br>
            <strong style="color:#333">Level Growth</strong><br>
            <a href="https://levelgrowth.com.ar" style="color:#3FC87A">levelgrowth.com.ar</a>
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
