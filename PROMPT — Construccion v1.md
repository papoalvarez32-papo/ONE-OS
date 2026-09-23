# PROMPT — CONSTRUCCIÓN DE LA V1 DEL ONE OS

> Listo para pegar en Claude Code, en una carpeta nueva del proyecto.
> Basado en [`REQUISITOS v1.md`](REQUISITOS%20v1.md) + decisiones técnicas del 15-sep: **Vercel + base de datos en la nube**, **formulario simple** (sin chat de migración por texto libre).

---

```
Quiero que construyas la versión 1 de "One OS": una aplicación web privada
para que un solo usuario (David) lleve el control de pagos y relación con
los estudiantes de su programa de mentoría "Emprenderme Máster".

CONTEXTO DEL NEGOCIO

David vende dos programas:
- Emprenderme Máster: alto ticket, semestral (6 meses), cobro manual acordado
  en la llamada de venta, máximo 2 cuotas por estudiante.
- Emprenderme ONE: membresía mensual/anual, cobro automático por Skool.

Esta app es SOLO para Máster. ONE queda fuera porque ya cobra solo.

Hoy David lleva todo esto en una nota del celular y le toma una semana
después de cerrado el mes cuadrar cuánto facturó. Quiere dejar de hacerlo así.

QUIÉN LA USA

Un solo usuario: David. No hay cuentas de estudiante, no hay multi-tenant
en la interfaz — pero diseña el modelo de datos pensando en que en el
futuro podría haber más de un mentor usando su propia instancia (no lo
construyas ahora, solo no cierres esa puerta con decisiones de esquema
que sean caras de deshacer después).

STACK

- Frontend: página web desplegada en Vercel.
- Backend/datos: Supabase (Postgres) para persistencia en la nube.
- Autenticación: login simple de usuario y contraseña para David
  (un solo usuario fijo, no necesita ser multi-usuario en el auth tampoco).
- Sin dependencias innecesarias — prioriza simplicidad sobre framework.

MODELO DE DATOS

Tabla de estudiantes, con estos campos (son los que David dijo que
necesita tener a la mano, textual):

- nombre
- fecha_inicio        (clave: de aquí se calcula la renovación a 6 meses)
- valor_total_acordado
- plan_de_pago        (estructura de cuotas: fecha pactada + monto por cuota,
                        máximo 2 cuotas)
- pagos_recibidos     (registro de qué se pagó y cuándo, con fecha REAL de
                        pago, que puede ser distinta a la fecha pactada)
- ultimo_contacto     (fecha, se actualiza con un clic desde la interfaz)
- estado              (activo / terminado, para poder archivar sin borrar)

Tabla de gastos_fijos:
- nombre_del_gasto (ej. "Skool", "Zoom", "ManyChat")
- monto_mensual
- son mayormente fijos — no necesitas lógica de variabilidad, solo un
  monto editable por gasto.

LAS CINCO FUNCIONES DE LA V1 (en orden de prioridad para David)

1. COBROS DE LA SEMANA (prioridad #1)
   - Lista de quién debe pagar en los próximos 7 días: nombre, monto, fecha
     pactada.
   - Un botón para marcar el pago como recibido, pidiendo la fecha real
     de pago (puede ser distinta a la pactada).
   - Estado visual por fila: al día / vence pronto (próximos 3 días) /
     vencido (ya pasó la fecha y no se marcó como pagado).

2. RENOVACIONES PRÓXIMAS (el hallazgo que más valor tiene)
   - Se calcula sola: fecha_inicio + 6 meses.
   - Ventana de anticipación: mostrar a quien le falten entre 0 y 4 semanas
     para cumplir el semestre.
   - No requiere que David ingrese nada adicional — solo la fecha_inicio
     que ya está en el modelo de datos.

3. CUÁNTO FACTURÉ ESTE MES
   - Total facturado en el mes en curso (suma de lo que vence este mes
     según los planes de pago activos).
   - Total efectivamente cobrado (suma de pagos_recibidos con fecha real
     dentro del mes en curso).
   - Pendiente por cobrar (la diferencia).
   - Utilidad del mes: total cobrado menos la suma de gastos_fijos.
   - Esto se alimenta SOLO de los datos que ya existen en las otras
     tablas — no es una pantalla de captura manual.

4. GASTOS FIJOS
   - Tabla simple: agregar, editar, eliminar un gasto con su nombre y
     monto mensual.
   - Se refleja automáticamente en el cálculo de utilidad del punto 3.

5. RECORDATORIOS
   - De pago: cualquier cobro vencido o próximo a vencer aparece resaltado
     (esto puede vivir dentro de la misma vista del punto 1, no hace
     falta una pantalla aparte).
   - De seguimiento: lista de estudiantes cuyo ultimo_contacto es de
     hace más de 14 días. Un botón "marcar contactado hoy" que actualiza
     la fecha con un clic.

CÓMO SE CARGAN LOS DATOS (el punto crítico)

David dijo textualmente que "alimentarlo" es lo que más le preocupa —
si es tedioso, no lo va a usar. La decisión es:

- UN FORMULARIO SIMPLE, tanto para la carga inicial (migrar lo que hoy
  tiene en su nota del celular) como para dar de alta un estudiante nuevo
  después. No hay flujo de importación masiva ni de texto libre — es el
  mismo formulario corto en los dos casos.
- El formulario de alta pide solo: nombre, fecha_inicio, valor_total_acordado,
  y las fechas/montos de las cuotas del plan de pago (máximo 2 filas).
  Nada más. Si un campo no es indispensable para las 5 funciones de
  arriba, no va en el formulario.
- Marcar un pago como recibido y marcar "contactado hoy" deben ser UN
  CLIC desde la lista, nunca un formulario aparte.

LA PANTALLA PRINCIPAL

Debe responder en los primeros 10 segundos las dos preguntas que David
dijo que necesita ver un lunes en la mañana:
  - "¿A quién le cobro esta semana?"
  - "¿A quién se le está por vencer el programa?"

Estructura sugerida de arriba hacia abajo:
  1. Resumen del mes (facturado / cobrado / pendiente / utilidad) — franja
     compacta arriba, no el foco principal.
  2. Cobros de esta semana — la lista más prominente.
  3. Renovaciones próximas — segunda lista, igual de visible.
  4. Recordatorios de seguimiento — una franja más discreta, más abajo.

NO INCLUIR EN ESTA VERSIÓN (fuera de alcance, decisión ya tomada)

- Nada sobre el progreso o las fases del estudiante en el programa — eso
  lo resuelve otra herramienta de David (el "Mapa del Mentor"), no esta.
- Notas de texto libre por cliente.
- Cualquier vista o dato relacionado con el programa ONE (solo Máster).
- Integración con Skool (queda para una segunda fase).
- Cuentas de acceso para los estudiantes.
- Agenda o calendario de sesiones 1:1 — David ya lo ve en Google Calendar.

DIRECCIÓN VISUAL

Interfaz sobria, de negocio, sin decoración innecesaria — algo que David
abra todos los lunes sin fricción. Prioriza que los números y fechas sean
legibles de un vistazo (usa alineación tabular para montos y fechas) y que
el estado de cada fila (al día / vence pronto / vencido) se distinga por
color sin depender solo del texto.

CRITERIO DE ÉXITO

David abre la app un lunes, en 10 segundos sabe a quién cobrarle y a
quién se le vence el programa, y dar de alta un estudiante nuevo le toma
menos de un minuto.

Empieza por el modelo de datos en Supabase, luego el formulario de alta
y las acciones de un clic (marcar pagado, marcar contactado), y al final
las vistas de resumen — así cada pieza es usable apenas la termines,
sin depender de las demás.
```
