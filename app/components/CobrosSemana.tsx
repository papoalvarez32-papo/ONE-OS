"use client";

import { useState, useTransition } from "react";
import type { CobroSemana } from "@/lib/types";
import { formatearFecha, formatearMonto } from "@/lib/formato";
import { marcarPagoRecibido } from "@/app/actions";
import { EstadoBadge } from "./EstadoBadge";

export function CobrosSemana({ cobros }: { cobros: CobroSemana[] }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-900">Cobros de esta semana</h2>
        <p className="text-sm text-slate-500">¿A quién le cobro?</p>
      </div>

      {cobros.length === 0 ? (
        <p className="px-5 py-6 text-sm text-slate-500">No hay cobros pendientes esta semana.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {cobros.map((c) => (
            <FilaCobro key={c.cuota_id} cobro={c} />
          ))}
        </ul>
      )}
    </section>
  );
}

function FilaCobro({ cobro }: { cobro: CobroSemana }) {
  const [abierto, setAbierto] = useState(false);
  const [fechaPago, setFechaPago] = useState(() => new Date().toISOString().slice(0, 10));
  const [pending, startTransition] = useTransition();

  function confirmar() {
    startTransition(async () => {
      await marcarPagoRecibido(cobro.cuota_id, fechaPago, cobro.monto);
      setAbierto(false);
    });
  }

  return (
    <li className="flex flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="font-medium text-slate-900">{cobro.nombre}</span>
        <EstadoBadge estado={cobro.estado} />
      </div>

      <div className="flex items-center gap-4">
        <span className="tabular-nums text-sm text-slate-500">
          {formatearFecha(cobro.fecha_pactada)}
        </span>
        <span className="tabular-nums font-medium text-slate-900">
          {formatearMonto(cobro.monto)}
        </span>

        {abierto ? (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={fechaPago}
              onChange={(e) => setFechaPago(e.target.value)}
              className="rounded-md border border-slate-300 px-2 py-1 text-sm"
            />
            <button
              onClick={confirmar}
              disabled={pending}
              className="rounded-md bg-emerald-600 px-3 py-1 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {pending ? "..." : "Confirmar"}
            </button>
            <button
              onClick={() => setAbierto(false)}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAbierto(true)}
            className="rounded-md bg-slate-900 px-3 py-1 text-sm font-medium text-white hover:bg-slate-800"
          >
            Marcar pagado
          </button>
        )}
      </div>
    </li>
  );
}
