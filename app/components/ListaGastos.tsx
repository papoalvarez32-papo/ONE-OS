"use client";

import { useState, useTransition } from "react";
import type { GastoFijo } from "@/lib/types";
import { formatearMonto } from "@/lib/formato";
import { eliminarGastoFijo, guardarGastoFijo } from "@/app/actions";

export function ListaGastos({ gastos }: { gastos: GastoFijo[] }) {
  const [nombre, setNombre] = useState("");
  const [monto, setMonto] = useState("");
  const [pending, startTransition] = useTransition();

  function agregar(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim() || !monto) return;
    startTransition(async () => {
      await guardarGastoFijo({ nombre_del_gasto: nombre.trim(), monto_mensual: Number(monto) });
      setNombre("");
      setMonto("");
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <ul className="divide-y divide-slate-100">
          {gastos.length === 0 && (
            <li className="px-5 py-6 text-sm text-slate-500">No hay gastos fijos registrados.</li>
          )}
          {gastos.map((g) => (
            <FilaGasto key={g.id} gasto={g} />
          ))}
        </ul>
        {gastos.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3">
            <span className="text-sm font-medium text-slate-700">Total mensual</span>
            <span className="tabular-nums text-sm font-semibold text-slate-900">
              {formatearMonto(gastos.reduce((s, g) => s + g.monto_mensual, 0))}
            </span>
          </div>
        )}
      </section>

      <form
        onSubmit={agregar}
        className="flex items-end gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div className="flex-1">
          <label className="mb-1 block text-xs text-slate-500">Nombre del gasto</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="ej. Skool"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="w-40">
          <label className="mb-1 block text-xs text-slate-500">Monto mensual</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          Agregar
        </button>
      </form>
    </div>
  );
}

function FilaGasto({ gasto }: { gasto: GastoFijo }) {
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState(gasto.nombre_del_gasto);
  const [monto, setMonto] = useState(String(gasto.monto_mensual));
  const [pending, startTransition] = useTransition();

  function guardar() {
    startTransition(async () => {
      await guardarGastoFijo({
        id: gasto.id,
        nombre_del_gasto: nombre.trim(),
        monto_mensual: Number(monto),
      });
      setEditando(false);
    });
  }

  function eliminar() {
    startTransition(async () => {
      await eliminarGastoFijo(gasto.id);
    });
  }

  if (editando) {
    return (
      <li className="flex items-center gap-2 px-5 py-3">
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="flex-1 rounded-md border border-slate-300 px-2 py-1 text-sm"
        />
        <input
          type="number"
          min="0"
          step="0.01"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          className="w-32 rounded-md border border-slate-300 px-2 py-1 text-sm"
        />
        <button
          onClick={guardar}
          disabled={pending}
          className="rounded-md bg-slate-900 px-3 py-1 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          Guardar
        </button>
        <button
          onClick={() => setEditando(false)}
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          Cancelar
        </button>
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between px-5 py-3">
      <span className="text-slate-900">{gasto.nombre_del_gasto}</span>
      <div className="flex items-center gap-4">
        <span className="tabular-nums text-sm text-slate-700">
          {formatearMonto(gasto.monto_mensual)}
        </span>
        <button
          onClick={() => setEditando(true)}
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          Editar
        </button>
        <button
          onClick={eliminar}
          disabled={pending}
          className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
        >
          Eliminar
        </button>
      </div>
    </li>
  );
}
