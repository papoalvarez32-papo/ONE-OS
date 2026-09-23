import type {
  CobroSemana,
  EstadoCobro,
  EstudianteConDetalle,
  GastoFijo,
  RenovacionProxima,
  ResumenMes,
  SeguimientoPendiente,
} from "./types";

const DIA_MS = 24 * 60 * 60 * 1000;

function hoy(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseFecha(iso: string): Date {
  const d = new Date(iso + "T00:00:00");
  return d;
}

function diasEntre(desde: Date, hasta: Date): number {
  return Math.round((hasta.getTime() - desde.getTime()) / DIA_MS);
}

export function fechaRenovacion(fechaInicioIso: string): Date {
  const d = parseFecha(fechaInicioIso);
  const renovacion = new Date(d);
  renovacion.setMonth(renovacion.getMonth() + 6);
  return renovacion;
}

function estadoDeCuota(fechaPactadaIso: string, pagada: boolean): EstadoCobro {
  if (pagada) return "pagado";
  const dias = diasEntre(hoy(), parseFecha(fechaPactadaIso));
  if (dias < 0) return "vencido";
  if (dias <= 3) return "vence_pronto";
  return "al_dia";
}

/** Cobros con fecha pactada dentro de los próximos 7 días, o ya vencidos y sin pagar. */
export function cobrosDeLaSemana(estudiantes: EstudianteConDetalle[]): CobroSemana[] {
  const resultado: CobroSemana[] = [];
  for (const est of estudiantes) {
    if (est.estado !== "activo") continue;
    for (const cuota of est.cuotas) {
      if (cuota.pago) continue; // ya pagada, no es un cobro pendiente
      const dias = diasEntre(hoy(), parseFecha(cuota.fecha_pactada));
      const dentroDeLaSemana = dias <= 7;
      const vencido = dias < 0;
      if (!dentroDeLaSemana && !vencido) continue;
      resultado.push({
        estudiante_id: est.id,
        nombre: est.nombre,
        cuota_id: cuota.id,
        monto: cuota.monto,
        fecha_pactada: cuota.fecha_pactada,
        estado: estadoDeCuota(cuota.fecha_pactada, false),
      });
    }
  }
  return resultado.sort(
    (a, b) => parseFecha(a.fecha_pactada).getTime() - parseFecha(b.fecha_pactada).getTime(),
  );
}

/** Estudiantes activos a quienes les faltan entre 0 y 4 semanas para cumplir el semestre. */
export function renovacionesProximas(estudiantes: EstudianteConDetalle[]): RenovacionProxima[] {
  const resultado: RenovacionProxima[] = [];
  for (const est of estudiantes) {
    if (est.estado !== "activo") continue;
    const renovacion = fechaRenovacion(est.fecha_inicio);
    const dias = diasEntre(hoy(), renovacion);
    const semanas = dias / 7;
    if (semanas < 0 || semanas > 4) continue;
    resultado.push({
      estudiante_id: est.id,
      nombre: est.nombre,
      fecha_inicio: est.fecha_inicio,
      fecha_renovacion: renovacion.toISOString().slice(0, 10),
      semanas_restantes: Math.max(0, Math.round(semanas * 10) / 10),
    });
  }
  return resultado.sort((a, b) => a.semanas_restantes - b.semanas_restantes);
}

/** Estudiantes activos cuyo último contacto fue hace más de 14 días. */
export function seguimientosPendientes(estudiantes: EstudianteConDetalle[]): SeguimientoPendiente[] {
  const resultado: SeguimientoPendiente[] = [];
  for (const est of estudiantes) {
    if (est.estado !== "activo") continue;
    const dias = diasEntre(parseFecha(est.ultimo_contacto), hoy());
    if (dias <= 14) continue;
    resultado.push({
      estudiante_id: est.id,
      nombre: est.nombre,
      ultimo_contacto: est.ultimo_contacto,
      dias_desde_contacto: dias,
    });
  }
  return resultado.sort((a, b) => b.dias_desde_contacto - a.dias_desde_contacto);
}

/** Resumen del mes en curso: facturado, cobrado, pendiente y utilidad. */
export function resumenDelMes(
  estudiantes: EstudianteConDetalle[],
  gastos: GastoFijo[],
  referencia: Date = hoy(),
): ResumenMes {
  const mes = referencia.getMonth();
  const anio = referencia.getFullYear();
  const enElMes = (iso: string) => {
    const d = parseFecha(iso);
    return d.getMonth() === mes && d.getFullYear() === anio;
  };

  let facturado = 0;
  let cobrado = 0;

  for (const est of estudiantes) {
    for (const cuota of est.cuotas) {
      if (enElMes(cuota.fecha_pactada)) {
        facturado += cuota.monto;
      }
      if (cuota.pago && enElMes(cuota.pago.fecha_pago)) {
        cobrado += cuota.pago.monto;
      }
    }
  }

  const gastosTotal = gastos.reduce((suma, g) => suma + g.monto_mensual, 0);

  return {
    facturado,
    cobrado,
    pendiente: Math.max(0, facturado - cobrado),
    gastos: gastosTotal,
    utilidad: cobrado - gastosTotal,
  };
}
