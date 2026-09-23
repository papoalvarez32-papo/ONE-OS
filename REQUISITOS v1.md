# ONE OS — REQUISITOS DE LA VERSIÓN 1

> Consolidado de las respuestas de David al cuestionario (04-sep) y las decisiones de la sesión del 08-sep.
> **Estado:** alcance cerrado y aprobado por David. Pendiente construir.
> **Compromiso:** una semana desde el 08-sep.

---

## 1. QUÉ ES

Un panel privado para que **David** lleve el control de la plata y la relación con sus estudiantes de **Emprenderme Máster**.

No es un CRM completo. No es un LMS. Es la respuesta a cuatro preguntas que hoy resuelve con una nota en el celular y una semana de trabajo manual al cierre de mes.

**Su reacción textual al mockup:**
> *"Está muy chido y muy necesario. Realmente a mí me lo han preguntado... yo tengo una nota donde escribo todo y a veces lo agendo, pero no tengo como un orden que me permita eso."*

---

## 2. DECISIONES DE ALCANCE

| Decisión | Detalle | Por qué |
|---|---|---|
| **Solo Máster** | ONE queda fuera de la v1 | ONE cobra automático por recurrencia en Skool. Meterlo sería resolver un problema que no existe |
| **Un solo usuario: David** | Sin cuentas para estudiantes | Simplifica radicalmente la construcción. Si más adelante se ofrece como producto, se agrega multi-usuario |
| **El progreso del estudiante NO va aquí** | Lo resuelve el Mapa del Mentor | David ya lo está construyendo. El OS es *la plata y la relación*; el mapa es *el avance* |
| **Sin notas por cliente** | David lo mandó a "puede esperar" | — |
| **Sin fases del programa** | David lo mandó a "puede esperar" | Se resuelve en el Mapa del Mentor |

---

## 3. LOS CINCO BLOQUES DE LA v1

### 3.1 Cobros de la semana 🔥
**Prioridad #1 declarada por David.**

Hoy lo hace así:
> *"Tengo una nota en el celular donde escribo la fecha en la que cada persona se comprometió a pagar la siguiente cuota. Reviso por ahí. Cuando ya estoy en la fecha, o uno o dos días después, le escribo, le recuerdo lo que acordamos y le paso el link o el número de cuenta."*

**Requisitos:**
- Ver quién debe pagar esta semana: nombre, monto, fecha pactada
- Marcar un pago como recibido (con fecha real de pago, que puede diferir de la pactada)
- Distinguir visualmente: al día · vence pronto · vencido
- Los acuerdos de pago se pactan en la llamada de venta y son de máximo **2 cuotas**

### 3.2 Renovaciones próximas ⭐
**El hallazgo que David no había pedido pero validó de inmediato.**

> *"Sí, porque le puedo hacer ya la tercera sesión, y esa sesión es más también una sesión de venta, literalmente."*

**Requisitos:**
- Ver quién está próximo a cumplir **6 meses** (Máster es semestral)
- Ventana de anticipación: 3–4 semanas antes
- Se calcula solo a partir de la **fecha de inicio** — un solo dato de entrada

> **Nota:** este es el bloque de mayor valor económico del OS. Hoy depende de que David se acuerde.

### 3.3 Cuánto facturé este mes
**Resuelve el dolor #1 del día a día de David.**

> *"Tener claros los ingresos y gastos del mes. Siempre me toca hacerlo manual y normalmente me demoro una semana después de que el mes ya cerró. No es ideal."*

**Requisitos:**
- Total facturado en el mes en curso
- Total cobrado (lo que efectivamente entró)
- Pendiente por cobrar
- Se alimenta solo de lo que se marca como recibido en el bloque 3.1

### 3.4 Gastos fijos 🆕
**Agregado por David en la sesión del 08-sep.**

> *"Te puede incluir como los gastos. Yo tengo suscripciones que pongo como gastos en el programa, más que todo las herramientas que pago."*

**Requisitos:**
- Lista de gastos recurrentes mensuales (suscripciones, herramientas)
- **Son mayormente fijos** — confirmado por David: *"variables son más las pasarelas de pago"*
- Se restan del facturado para dar una utilidad del mes

### 3.5 Recordatorios
Dos tipos distintos:

**De pago:** avisar cuando una cuota está por vencer o ya venció.

**De seguimiento:** quién lleva mucho sin contacto.
> *"Hacerle seguimiento a las personas. No tanto para revivir muertos, sino para preguntarles cómo van y si necesitan ayuda. Para decirles que estoy presente y pendiente."*

**Requisitos:**
- Ver quién lleva más de N días sin contacto registrado
- Marcar "contactado hoy" con un clic

---

## 4. LOS DATOS QUE NECESITA CADA ESTUDIANTE

David declaró exactamente qué necesita tener a la mano:

> *"Nombre, qué día empezó, cuánto ha pagado, y si no ha pagado completo, cuáles son las fechas de cobro o el acuerdo al que llegamos."*

| Campo | Para qué | Notas |
|---|---|---|
| **Nombre** | Identificación | — |
| **Fecha de inicio** ⭐ | Calcula la renovación a 6 meses | **El campo que David no pidió pero habilita el bloque 3.2** |
| **Valor total acordado** | Base del cobro | Pactado en la llamada de venta |
| **Plan de pago** | Cuotas y fechas | Máximo 2 cuotas |
| **Pagos recibidos** | Estado de cuenta | Con fecha real |
| **Último contacto** | Alimenta los recordatorios de seguimiento | Se actualiza con un clic |

---

## 5. ⚠️ EL RIESGO CRÍTICO: CÓMO SE ALIMENTA

Los dos lo identificaron en la sesión como el punto que decide si el OS se usa o se abandona.

> **Pablo:** *"Donde veo que está el centro crítico es el tema de que sea fácil ponerle la información."*
> **David:** *"Alimentarlo. Ese es como el asterisco ahí."*

**Su preferencia declarada:** ingresar los clientes **desde la misma plataforma**, no por Excel.

**Hay que resolver antes que cualquier otra función:**
- Alta de un cliente nuevo en el menor número de campos posible
- Migración inicial de su nota del celular (una sola vez)
- Que marcar un pago o un contacto sea un clic, no un formulario

---

## 6. QUÉ NECESITA VER UN LUNES EN LA MAÑANA

Textual de David, y es el criterio de diseño de la pantalla principal:

> *"Lo que sí necesito ver: quién paga exactamente esa semana, para estar pendiente de los cobros. Y quién está próximo a cumplir los seis meses, para ir cuadrando la sesión donde le presento la continuación y cómo renovar. Eso sería lo más importante. Cuándo cobrar, y cuándo se le está acabando el programa a alguien."*

**→ La pantalla principal debe responder esas dos preguntas en los primeros 10 segundos.**

Lo que NO necesita ver ahí: las sesiones 1:1 agendadas (ya las ve en Google Calendar vía Calendly).

---

## 7. CONTEXTO DEL NEGOCIO DE DAVID

Necesario para entender por qué el OS está diseñado así.

### Sus dos programas

| | **Emprenderme Máster** | **Emprenderme ONE** |
|---|---|---|
| **Desde** | 6 meses vendiéndolo | Lanzado el 03-sep-2026 |
| **Duración** | Semestral | Membresía continua |
| **Precio** | Alto ticket | $50 USD/mes · $300 USD/año (50% desc.) |
| **Cobro** | Manual, acordado en la llamada de venta | **Automático por Skool** |
| **Promesa** | Profundizar la metodología de entrega para cobrar más sin más tiempo | Crear un modelo de negocio alrededor de su conocimiento |
| **Público** | Ya vende o lleva rato como mentor | Más inicial |
| **¿Entra al OS v1?** | ✅ Sí | ❌ No |

### Su proceso actual de onboarding (Máster)

1. Crear grupo de WhatsApp con la persona
2. Mandar link de Calendly para agendar el onboarding
3. Pedir correo para agregarla a Skool
4. Meterla al grupo de WhatsApp de mentores
5. Sesión de onboarding — *"ese día es el arranque oficial del proceso"*

> El seguimiento posterior lo hace por WhatsApp, agendando llamadas sobre la marcha.

---

## 8. FUERA DE ALCANCE DE LA v1

| Qué | Cuándo | Nota |
|---|---|---|
| **Integración con Skool** | Segunda fase — acordado | David quiere que al entrar alguien a la membresía, la info llegue sola. Buscó plugins en Skool en vivo y no encontró |
| **Progreso del estudiante** | Nunca aquí | Lo resuelve el Mapa del Mentor |
| **Notas por cliente** | Puede esperar | Declarado por David |
| **Fases del programa** | Puede esperar | Declarado por David |
| **Acceso para estudiantes** | Si se vuelve producto | Ver §9 |

---

## 9. LA POSIBILIDAD DE PRODUCTO

David lo planteó sin que se lo propusieran:

> *"¿Cómo también se puede... pues vos lo podés ofrecer como un producto? Golazo, porque al final le da orden y estructura a una persona que lo necesita."*

**La lógica:** si funciona con él, se puede ofrecer a todos los de Máster — *"porque supone que tienen sus clientes, hacen sus cobros"*.

> ⚠️ **No condiciona la v1.** Se construye primero para David, se valida, y de ahí se decide. Pero conviene no cerrar puertas técnicas que después cuesten caro (ej. que el modelo de datos soporte más de un usuario aunque la v1 no lo use).

---

## 10. DECISIONES TÉCNICAS PENDIENTES

- [ ] **Dónde vive** — se habló de Supabase como base de datos. Confirmar
- [ ] **Cómo se autentica** — usuario y contraseña simple para David
- [ ] **Cómo se alimenta** — el punto crítico del §5
- [ ] **Migración inicial** — pasar lo que tiene en la nota del celular

---

## 11. PRÓXIMO PASO

Construir la v1 con las cinco funciones, resolviendo primero la carga de datos.

**Criterio de éxito:** que David lo abra un lunes, vea en 10 segundos a quién cobrarle y a quién le está por vencer el programa, y que alimentarlo no le dé pereza.
