"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";

/* ─── Tipos ───────────────────────────────── */
interface FormData {
  nombre:    string;
  email:     string;
  whatsapp?: string;
  sitio?:    string;
  necesidad: string;
  mensaje:   string;
}

type FormStatus = "idle" | "loading" | "success" | "error";

/* ─── Estilos de campo ────────────────────── */
const inputClass = [
  "w-full bg-lg-bg-tertiary border border-white/[0.08] rounded-lg px-4 py-3",
  "font-body text-sm text-lg-text placeholder:text-lg-text-muted",
  "focus:outline-none focus:border-lg-green/30 focus:ring-1 focus:ring-lg-green/20",
  "transition-colors duration-200",
].join(" ");

const errorClass = "mt-1 text-xs text-red-400 font-body";

/* ─── Componente ──────────────────────────── */
export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Error en el servidor");

      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  /* Pantalla de éxito */
  if (status === "success") {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-16">
        <div className="w-14 h-14 rounded-full bg-lg-green/10 border border-lg-green/30 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3FC87A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="font-display font-medium text-xl text-lg-text">
          ¡Solicitud recibida!
        </h3>
        <p className="font-body text-sm text-lg-text-secondary max-w-[360px] leading-[1.7]">
          Te vamos a contactar en las próximas 48 horas hábiles con el diagnóstico
          de tu negocio. Revisá tu bandeja de entrada.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="font-body text-sm text-lg-text-muted hover:text-lg-text transition-colors duration-200 mt-2"
        >
          Enviar otra consulta
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>

      {/* Nombre */}
      <div>
        <label className="block font-body text-xs text-lg-text-muted tracking-[0.08em] uppercase mb-2">
          Nombre <span className="text-lg-green">*</span>
        </label>
        <input
          type="text"
          placeholder="Juan García"
          className={inputClass}
          {...register("nombre", { required: "El nombre es obligatorio", minLength: { value: 2, message: "Mínimo 2 caracteres" } })}
        />
        {errors.nombre && <p className={errorClass}>{errors.nombre.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block font-body text-xs text-lg-text-muted tracking-[0.08em] uppercase mb-2">
          Email <span className="text-lg-green">*</span>
        </label>
        <input
          type="email"
          placeholder="juan@tuempresa.com"
          className={inputClass}
          {...register("email", {
            required: "El email es obligatorio",
            pattern:  { value: /^\S+@\S+\.\S+$/, message: "Email inválido" },
          })}
        />
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </div>

      {/* WhatsApp + Sitio web — fila */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block font-body text-xs text-lg-text-muted tracking-[0.08em] uppercase mb-2">
            WhatsApp <span className="text-lg-text-muted">(opcional)</span>
          </label>
          <input
            type="tel"
            placeholder="+54 9 11 1234-5678"
            className={inputClass}
            {...register("whatsapp")}
          />
        </div>
        <div>
          <label className="block font-body text-xs text-lg-text-muted tracking-[0.08em] uppercase mb-2">
            Sitio web <span className="text-lg-text-muted">(opcional)</span>
          </label>
          <input
            type="url"
            placeholder="https://tuempresa.com"
            className={inputClass}
            {...register("sitio")}
          />
        </div>
      </div>

      {/* ¿Qué necesitás? */}
      <div>
        <label className="block font-body text-xs text-lg-text-muted tracking-[0.08em] uppercase mb-2">
          ¿Qué necesitás? <span className="text-lg-green">*</span>
        </label>
        <div className="relative">
          <select
            className={[inputClass, "appearance-none pr-10 cursor-pointer"].join(" ")}
            {...register("necesidad", { required: "Seleccioná una opción" })}
            defaultValue=""
          >
            <option value="" disabled className="bg-lg-bg-tertiary text-lg-text-muted">
              Seleccioná una opción
            </option>
            <option value="auditoria"    className="bg-lg-bg-tertiary">Auditoría gratis</option>
            <option value="landing"      className="bg-lg-bg-tertiary">Landing page</option>
            <option value="publicidad"   className="bg-lg-bg-tertiary">Gestión de publicidad</option>
            <option value="funnel"       className="bg-lg-bg-tertiary">Funnel completo</option>
            <option value="orientacion"  className="bg-lg-bg-tertiary">No sé, necesito orientación</option>
          </select>
          {/* Flecha custom */}
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg-text-muted">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M2 4l4 4 4-4" />
            </svg>
          </div>
        </div>
        {errors.necesidad && <p className={errorClass}>{errors.necesidad.message}</p>}
      </div>

      {/* Mensaje */}
      <div>
        <label className="block font-body text-xs text-lg-text-muted tracking-[0.08em] uppercase mb-2">
          Contanos brevemente sobre tu negocio <span className="text-lg-green">*</span>
        </label>
        <textarea
          rows={4}
          placeholder="A qué se dedica tu negocio, cuál es tu producto o servicio, cuánto tiempo llevan activos..."
          className={[inputClass, "resize-none"].join(" ")}
          {...register("mensaje", {
            required:  "Este campo es obligatorio",
            minLength: { value: 20, message: "Mínimo 20 caracteres" },
          })}
        />
        {errors.mensaje && <p className={errorClass}>{errors.mensaje.message}</p>}
      </div>

      {/* Error general */}
      {status === "error" && (
        <p className="text-sm text-red-400 font-body text-center">
          Hubo un error al enviar. Intentá de nuevo o escribinos por WhatsApp.
        </p>
      )}

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        disabled={status === "loading"}
        className="w-full justify-center mt-2"
      >
        {status === "loading" ? "Enviando..." : "Enviar solicitud →"}
      </Button>

    </form>
  );
}
