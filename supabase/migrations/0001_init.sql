-- One OS — modelo de datos v1 (solo programa "Emprenderme Máster")
--
-- Diseño pensado para un solo usuario (David) hoy, pero sin cerrar la puerta
-- a multi-mentor mañana: toda tabla de negocio lleva mentor_id, aunque hoy
-- solo exista un mentor fijo. No se construye auth/multi-tenant real en v1.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- mentores: una sola fila hoy (David). Existe para no cerrar la puerta a
-- multi-mentor después sin tener que rediseñar claves foráneas.
-- ---------------------------------------------------------------------------
create table mentores (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- estudiantes
-- ---------------------------------------------------------------------------
create table estudiantes (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references mentores(id) on delete cascade,
  nombre text not null,
  fecha_inicio date not null,
  valor_total_acordado numeric(12, 2) not null check (valor_total_acordado >= 0),
  ultimo_contacto date not null default current_date,
  estado text not null default 'activo' check (estado in ('activo', 'terminado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index estudiantes_mentor_id_idx on estudiantes(mentor_id);
create index estudiantes_estado_idx on estudiantes(estado);

-- Renovación = fecha_inicio + 6 meses. Se calcula, nunca se guarda a mano.
create or replace function fecha_renovacion(p_fecha_inicio date)
returns date
language sql
immutable
as $$
  select p_fecha_inicio + interval '6 months';
$$;

-- ---------------------------------------------------------------------------
-- cuotas: el plan de pago de cada estudiante. Máximo 2 cuotas, reforzado
-- por constraint (numero_cuota in (1,2)) además de validarse en el formulario.
-- ---------------------------------------------------------------------------
create table cuotas (
  id uuid primary key default gen_random_uuid(),
  estudiante_id uuid not null references estudiantes(id) on delete cascade,
  numero_cuota smallint not null check (numero_cuota in (1, 2)),
  fecha_pactada date not null,
  monto numeric(12, 2) not null check (monto >= 0),
  created_at timestamptz not null default now(),
  unique (estudiante_id, numero_cuota)
);

create index cuotas_estudiante_id_idx on cuotas(estudiante_id);
create index cuotas_fecha_pactada_idx on cuotas(fecha_pactada);

-- ---------------------------------------------------------------------------
-- pagos_recibidos: qué se pagó y cuándo REALMENTE (puede diferir de la
-- fecha pactada de la cuota). Una cuota tiene a lo sumo un pago.
-- ---------------------------------------------------------------------------
create table pagos_recibidos (
  id uuid primary key default gen_random_uuid(),
  cuota_id uuid not null unique references cuotas(id) on delete cascade,
  fecha_pago date not null,
  monto numeric(12, 2) not null check (monto >= 0),
  created_at timestamptz not null default now()
);

create index pagos_recibidos_fecha_pago_idx on pagos_recibidos(fecha_pago);

-- ---------------------------------------------------------------------------
-- gastos_fijos
-- ---------------------------------------------------------------------------
create table gastos_fijos (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references mentores(id) on delete cascade,
  nombre_del_gasto text not null,
  monto_mensual numeric(12, 2) not null check (monto_mensual >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index gastos_fijos_mentor_id_idx on gastos_fijos(mentor_id);

-- ---------------------------------------------------------------------------
-- updated_at automático
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger estudiantes_set_updated_at
  before update on estudiantes
  for each row execute function set_updated_at();

create trigger gastos_fijos_set_updated_at
  before update on gastos_fijos
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security: la app usa un único usuario autenticado (David) vía
-- Supabase Auth y la service/anon key con políticas simples de "autenticado
-- puede todo". No hay acceso público.
-- ---------------------------------------------------------------------------
alter table mentores enable row level security;
alter table estudiantes enable row level security;
alter table cuotas enable row level security;
alter table pagos_recibidos enable row level security;
alter table gastos_fijos enable row level security;

create policy "authenticated_full_access" on mentores
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authenticated_full_access" on estudiantes
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authenticated_full_access" on cuotas
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authenticated_full_access" on pagos_recibidos
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authenticated_full_access" on gastos_fijos
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- Semilla: el único mentor de hoy.
-- ---------------------------------------------------------------------------
insert into mentores (nombre) values ('David');
