import type { RenovacionProxima } from "@/lib/types";
import { formatearFecha } from "@/lib/formato";

export function RenovacionesProximas({ renovaciones }: { renovaciones: RenovacionProxima[] }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-900">Renovaciones próximas</h2>
        <p className="text-sm text-slate-500">¿A quién se le vence el programa?</p>
      </div>

      {renovaciones.length === 0 ? (
        <p className="px-5 py-6 text-sm text-slate-500">
          Nadie tiene el semestre por cumplirse en las próximas 4 semanas.
        </p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {renovaciones.map((r) => (
            <li
              key={r.estudiante_id}
              className="flex items-center justify-between px-5 py-3"
            >
              <span className="font-medium text-slate-900">{r.nombre}</span>
              <div className="flex items-center gap-4 text-sm">
                <span className="tabular-nums text-slate-500">
                  {formatearFecha(r.fecha_renovacion)}
                </span>
                <span
                  className={`tabular-nums rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                    r.semanas_restantes <= 1
                      ? "bg-red-50 text-red-700 ring-red-600/20"
                      : "bg-amber-50 text-amber-700 ring-amber-600/20"
                  }`}
                >
                  {r.semanas_restantes === 0
                    ? "Esta semana"
                    : `En ${r.semanas_restantes} sem.`}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
