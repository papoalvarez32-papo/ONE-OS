import type { ResumenMes as ResumenMesTipo } from "@/lib/types";
import { formatearMonto } from "@/lib/formato";

export function ResumenMes({ resumen }: { resumen: ResumenMesTipo }) {
  const items: { label: string; valor: number; destacar?: boolean }[] = [
    { label: "Facturado", valor: resumen.facturado },
    { label: "Cobrado", valor: resumen.cobrado },
    { label: "Pendiente", valor: resumen.pendiente },
    { label: "Utilidad", valor: resumen.utilidad, destacar: true },
  ];

  return (
    <section className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 sm:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="bg-white px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {item.label}
          </p>
          <p
            className={`tabular-nums text-lg font-semibold ${
              item.destacar
                ? item.valor >= 0
                  ? "text-emerald-700"
                  : "text-red-700"
                : "text-slate-900"
            }`}
          >
            {formatearMonto(item.valor)}
          </p>
        </div>
      ))}
    </section>
  );
}
