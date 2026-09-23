export type EstadoEstudiante = "activo" | "terminado";

export interface Cuota {
  id: string;
  estudiante_id: string;
  numero_cuota: 1 | 2;
  fecha_pactada: string; // ISO date
  monto: number;
}

export interface PagoRecibido {
  id: string;
  cuota_id: string;
  fecha_pago: string; // ISO date
  monto: number;
}

export interface Estudiante {
  id: string;
  mentor_id: string;
  nombre: string;
  fecha_inicio: string; // ISO date
  valor_total_acordado: number;
  ultimo_contacto: string; // ISO date
  estado: EstadoEstudiante;
}

export interface EstudianteConDetalle extends Estudiante {
  cuotas: (Cuota & { pago: PagoRecibido | null })[];
}

export interface GastoFijo {
  id: string;
  mentor_id: string;
  nombre_del_gasto: string;
  monto_mensual: number;
}

export type EstadoCobro = "al_dia" | "vence_pronto" | "vencido" | "pagado";

export interface CobroSemana {
  estudiante_id: string;
  nombre: string;
  cuota_id: string;
  monto: number;
  fecha_pactada: string;
  estado: EstadoCobro;
}

export interface RenovacionProxima {
  estudiante_id: string;
  nombre: string;
  fecha_inicio: string;
  fecha_renovacion: string;
  semanas_restantes: number;
}

export interface SeguimientoPendiente {
  estudiante_id: string;
  nombre: string;
  ultimo_contacto: string;
  dias_desde_contacto: number;
}

export interface ResumenMes {
  facturado: number;
  cobrado: number;
  pendiente: number;
  gastos: number;
  utilidad: number;
}
