"use client";

import { useTransition } from "react";
import type { SeguimientoPendiente } from "@/lib/types";
import { marcarContactadoHoy } from "@/app/actions";

export function Seguimientos({ seguimientos }: { seguimientos: SeguimientoPendiente[] }) {
  if (seguimientos.length === 0) return null;

  return (
    <section className="rounded-lg border border-slate-200 bg-slate-50">
      <div className="px-5 py-3">
        <h2 className="text-sm font-semibold text-slate-700">
          Seguimiento pendiente ({seguimientos.length})
        </h2>
      </div>
      <ul className="divide-y divide-slate-200">
        {seguimientos.map((s) => (
          <FilaSeguimiento key={s.estudiante_id} seguimiento={s} />
        ))}
      </ul>
    </section>
  );
}

function FilaSeguimiento({ seguimiento }: { seguimiento: SeguimientoPendiente }) {
  const [pending, startTransition] = useTransition();

  return (
    <li className="flex items-center justify-between px-5 py-2.5 text-sm">
      <span className="text-slate-700">
        {seguimiento.nombre}{" "}
        <span className="text-slate-400">
          — sin contacto hace {seguimiento.dias_desde_contacto} días
        </span>
      </span>
      <button
        disabled={pending}
        onClick={() => startTransition(() => marcarContactadoHoy(seguimiento.estudiante_id))}
        className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
      >
        {pending ? "..." : "Marcar contactado hoy"}
      </button>
    </li>
  );
}
