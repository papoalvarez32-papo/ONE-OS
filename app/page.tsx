import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { obtenerEstudiantesConDetalle, obtenerGastosFijos } from "@/lib/datos";
import {
  cobrosDeLaSemana,
  renovacionesProximas,
  resumenDelMes,
  seguimientosPendientes,
} from "@/lib/calculos";
import { ResumenMes } from "./components/ResumenMes";
import { CobrosSemana } from "./components/CobrosSemana";
import { RenovacionesProximas } from "./components/RenovacionesProximas";
import { Seguimientos } from "./components/Seguimientos";
import { FormularioAlta } from "./components/FormularioAlta";
import { BotonSalir } from "./components/BotonSalir";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const [estudiantes, gastos] = await Promise.all([
    obtenerEstudiantesConDetalle(supabase),
    obtenerGastosFijos(supabase),
  ]);

  const resumen = resumenDelMes(estudiantes, gastos);
  const cobros = cobrosDeLaSemana(estudiantes);
  const renovaciones = renovacionesProximas(estudiantes);
  const seguimientos = seguimientosPendientes(estudiantes);

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">One OS</h1>
          <p className="text-sm text-slate-500">Emprenderme Máster</p>
        </div>
        <div className="flex items-center gap-3">
          <FormularioAlta />
          <Link href="/gastos" className="text-sm text-slate-500 hover:text-slate-900">
            Gastos fijos
          </Link>
          <BotonSalir />
        </div>
      </header>

      <div className="flex flex-col gap-6">
        <ResumenMes resumen={resumen} />
        <CobrosSemana cobros={cobros} />
        <RenovacionesProximas renovaciones={renovaciones} />
        <Seguimientos seguimientos={seguimientos} />
      </div>
    </div>
  );
}
