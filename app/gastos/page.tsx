import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { obtenerGastosFijos } from "@/lib/datos";
import { ListaGastos } from "@/app/components/ListaGastos";

export const dynamic = "force-dynamic";

export default async function GastosPage() {
  const supabase = await createClient();
  const gastos = await obtenerGastosFijos(supabase);

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <header className="mb-6">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">
          ← Volver
        </Link>
        <h1 className="mt-2 text-xl font-semibold text-slate-900">Gastos fijos</h1>
      </header>

      <ListaGastos gastos={gastos} />
    </div>
  );
}
