import type { SupabaseClient } from "@supabase/supabase-js";
import type { EstudianteConDetalle, GastoFijo } from "./types";

type Cliente = SupabaseClient;

export async function obtenerEstudiantesConDetalle(
  supabase: Cliente,
): Promise<EstudianteConDetalle[]> {
  const { data, error } = await supabase
    .from("estudiantes")
    .select(
      `
      id, mentor_id, nombre, fecha_inicio, valor_total_acordado, ultimo_contacto, estado,
      cuotas (
        id, estudiante_id, numero_cuota, fecha_pactada, monto,
        pagos_recibidos ( id, cuota_id, fecha_pago, monto )
      )
    `,
    )
    .order("fecha_inicio", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((est) => ({
    id: est.id,
    mentor_id: est.mentor_id,
    nombre: est.nombre,
    fecha_inicio: est.fecha_inicio,
    valor_total_acordado: Number(est.valor_total_acordado),
    ultimo_contacto: est.ultimo_contacto,
    estado: est.estado,
    cuotas: (est.cuotas ?? [])
      .map((c) => ({
        id: c.id,
        estudiante_id: c.estudiante_id,
        numero_cuota: c.numero_cuota,
        fecha_pactada: c.fecha_pactada,
        monto: Number(c.monto),
        pago: c.pagos_recibidos?.[0]
          ? {
              id: c.pagos_recibidos[0].id,
              cuota_id: c.pagos_recibidos[0].cuota_id,
              fecha_pago: c.pagos_recibidos[0].fecha_pago,
              monto: Number(c.pagos_recibidos[0].monto),
            }
          : null,
      }))
      .sort((a, b) => a.numero_cuota - b.numero_cuota),
  }));
}

export async function obtenerGastosFijos(supabase: Cliente): Promise<GastoFijo[]> {
  const { data, error } = await supabase
    .from("gastos_fijos")
    .select("id, mentor_id, nombre_del_gasto, monto_mensual")
    .order("nombre_del_gasto", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((g) => ({
    id: g.id,
    mentor_id: g.mentor_id,
    nombre_del_gasto: g.nombre_del_gasto,
    monto_mensual: Number(g.monto_mensual),
  }));
}

export async function obtenerMentorId(supabase: Cliente): Promise<string> {
  const { data, error } = await supabase.from("mentores").select("id").limit(1).single();
  if (error) throw error;
  return data.id;
}
