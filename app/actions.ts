"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { obtenerMentorId } from "@/lib/datos";

export async function marcarPagoRecibido(cuotaId: string, fechaPago: string, monto: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("pagos_recibidos")
    .upsert({ cuota_id: cuotaId, fecha_pago: fechaPago, monto }, { onConflict: "cuota_id" });

  if (error) throw error;
  revalidatePath("/");
}

export async function marcarContactadoHoy(estudianteId: string) {
  const supabase = await createClient();
  const hoy = new Date().toISOString().slice(0, 10);
  const { error } = await supabase
    .from("estudiantes")
    .update({ ultimo_contacto: hoy })
    .eq("id", estudianteId);

  if (error) throw error;
  revalidatePath("/");
}

export interface CuotaFormulario {
  fecha_pactada: string;
  monto: number;
}

export async function crearEstudiante(datos: {
  nombre: string;
  fecha_inicio: string;
  valor_total_acordado: number;
  cuotas: CuotaFormulario[];
}) {
  if (!datos.nombre.trim()) throw new Error("El nombre es obligatorio.");
  if (datos.cuotas.length < 1 || datos.cuotas.length > 2) {
    throw new Error("El plan de pago debe tener entre 1 y 2 cuotas.");
  }

  const supabase = await createClient();
  const mentorId = await obtenerMentorId(supabase);

  const { data: estudiante, error: errorEstudiante } = await supabase
    .from("estudiantes")
    .insert({
      mentor_id: mentorId,
      nombre: datos.nombre.trim(),
      fecha_inicio: datos.fecha_inicio,
      valor_total_acordado: datos.valor_total_acordado,
    })
    .select("id")
    .single();

  if (errorEstudiante) throw errorEstudiante;

  const cuotasParaInsertar = datos.cuotas.map((c, i) => ({
    estudiante_id: estudiante.id,
    numero_cuota: i + 1,
    fecha_pactada: c.fecha_pactada,
    monto: c.monto,
  }));

  const { error: errorCuotas } = await supabase.from("cuotas").insert(cuotasParaInsertar);
  if (errorCuotas) throw errorCuotas;

  revalidatePath("/");
  return estudiante.id;
}

export async function archivarEstudiante(estudianteId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("estudiantes")
    .update({ estado: "terminado" })
    .eq("id", estudianteId);

  if (error) throw error;
  revalidatePath("/");
}

interface GastoFormulario {
  id?: string;
  nombre_del_gasto: string;
  monto_mensual: number;
}

export async function guardarGastoFijo(datos: GastoFormulario) {
  const supabase = await createClient();

  if (datos.id) {
    const { error } = await supabase
      .from("gastos_fijos")
      .update({
        nombre_del_gasto: datos.nombre_del_gasto,
        monto_mensual: datos.monto_mensual,
      })
      .eq("id", datos.id);
    if (error) throw error;
  } else {
    const mentorId = await obtenerMentorId(supabase);
    const { error } = await supabase.from("gastos_fijos").insert({
      mentor_id: mentorId,
      nombre_del_gasto: datos.nombre_del_gasto,
      monto_mensual: datos.monto_mensual,
    });
    if (error) throw error;
  }

  revalidatePath("/");
  revalidatePath("/gastos");
}

export async function eliminarGastoFijo(gastoId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("gastos_fijos").delete().eq("id", gastoId);
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/gastos");
}

export async function login(email: string, password: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
