import type { EstadoCobro } from "@/lib/types";

const ESTILOS: Record<EstadoCobro, { clase: string; texto: string }> = {
  al_dia: { clase: "bg-emerald-50 text-emerald-700 ring-emerald-600/20", texto: "Al día" },
  vence_pronto: { clase: "bg-amber-50 text-amber-700 ring-amber-600/20", texto: "Vence pronto" },
  vencido: { clase: "bg-red-50 text-red-700 ring-red-600/20", texto: "Vencido" },
  pagado: { clase: "bg-slate-50 text-slate-600 ring-slate-500/20", texto: "Pagado" },
};

export function EstadoBadge({ estado }: { estado: EstadoCobro }) {
  const { clase, texto } = ESTILOS[estado];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${clase}`}
    >
      {texto}
    </span>
  );
}
