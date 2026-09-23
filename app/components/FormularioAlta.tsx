"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { crearEstudiante, type CuotaFormulario } from "@/app/actions";

export function FormularioAlta() {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [nombre, setNombre] = useState("");
  const [fechaInicio, setFechaInicio] = useState(() => new Date().toISOString().slice(0, 10));
  const [valorTotal, setValorTotal] = useState("");
  const [cuotas, setCuotas] = useState<CuotaFormulario[]>([{ fecha_pactada: "", monto: 0 }]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function reset() {
    setNombre("");
    setFechaInicio(new Date().toISOString().slice(0, 10));
    setValorTotal("");
    setCuotas([{ fecha_pactada: "", monto: 0 }]);
    setError(null);
  }

  function actualizarCuota(i: number, campo: keyof CuotaFormulario, valor: string) {
    setCuotas((prev) =>
      prev.map((c, idx) =>
        idx === i ? { ...c, [campo]: campo === "monto" ? Number(valor) : valor } : c,
      ),
    );
  }

  function agregarCuota() {
    if (cuotas.length >= 2) return;
    setCuotas((prev) => [...prev, { fecha_pactada: "", monto: 0 }]);
  }

  function quitarCuota(i: number) {
    setCuotas((prev) => prev.filter((_, idx) => idx !== i));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (cuotas.some((c) => !c.fecha_pactada || c.monto <= 0)) {
      setError("Cada cuota necesita fecha y monto.");
      return;
    }

    startTransition(async () => {
      try {
        await crearEstudiante({
          nombre,
          fecha_inicio: fechaInicio,
          valor_total_acordado: Number(valorTotal),
          cuotas,
        });
        reset();
        setAbierto(false);
        router.refresh();
      } catch {
        setError("No se pudo guardar. Intenta de nuevo.");
      }
    });
  }

  if (!abierto) {
    return (
      <button
        onClick={() => setAbierto(true)}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        + Nuevo estudiante
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-slate-900/40 px-4">
      <form
        onSubmit={onSubmit}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
      >
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Nuevo estudiante</h2>

        <label className="mb-1 block text-sm font-medium text-slate-700">Nombre</label>
        <input
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="mb-4 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />

        <label className="mb-1 block text-sm font-medium text-slate-700">Fecha de inicio</label>
        <input
          type="date"
          required
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          className="mb-4 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />

        <label className="mb-1 block text-sm font-medium text-slate-700">
          Valor total acordado
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          required
          value={valorTotal}
          onChange={(e) => setValorTotal(e.target.value)}
          className="mb-4 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />

        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">Plan de pago (máx. 2 cuotas)</span>
          {cuotas.length < 2 && (
            <button
              type="button"
              onClick={agregarCuota}
              className="text-sm text-slate-600 underline hover:text-slate-900"
            >
              + Agregar cuota
            </button>
          )}
        </div>

        {cuotas.map((cuota, i) => (
          <div key={i} className="mb-3 flex items-end gap-2">
            <div className="flex-1">
              <label className="mb-1 block text-xs text-slate-500">Fecha cuota {i + 1}</label>
              <input
                type="date"
                required
                value={cuota.fecha_pactada}
                onChange={(e) => actualizarCuota(i, "fecha_pactada", e.target.value)}
                className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs text-slate-500">Monto</label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={cuota.monto || ""}
                onChange={(e) => actualizarCuota(i, "monto", e.target.value)}
                className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
              />
            </div>
            {cuotas.length > 1 && (
              <button
                type="button"
                onClick={() => quitarCuota(i)}
                className="pb-1.5 text-sm text-red-600 hover:text-red-800"
              >
                Quitar
              </button>
            )}
          </div>
        ))}

        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              reset();
              setAbierto(false);
            }}
            className="rounded-md px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {pending ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
