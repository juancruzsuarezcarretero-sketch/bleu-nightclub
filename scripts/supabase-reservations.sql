-- Ejecutar en Supabase → SQL Editor

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nombre text not null,
  whatsapp text not null,
  fecha date not null,
  personas integer not null check (personas >= 1 and personas <= 99),
  sector text not null,
  seleccion text not null,
  precio text not null,
  mensaje text,
  motivo text not null default 'Reservas'
);

alter table public.reservations enable row level security;

create policy "Allow anonymous insert on reservations"
  on public.reservations
  for insert
  to anon
  with check (true);
