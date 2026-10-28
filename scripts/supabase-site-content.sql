-- Contenido editable de la web (se maneja desde Madre).
-- Ejecutar en Supabase -> SQL Editor. Se puede correr mas de una vez sin romper nada.
-- No toca la tabla reservations ni ningun dato existente.

-- 1) Quien puede editar. Sin politicas: nadie la modifica por la API, solo desde este SQL Editor.
create table if not exists public.site_admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table public.site_admins enable row level security;

create or replace function public.es_admin_del_sitio()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.site_admins where user_id = auth.uid());
$$;

-- 2) Contenido: una fila por seccion, con el valor en JSON.
create table if not exists public.site_content (
  key text primary key check (key in ('contacto', 'eventos', 'galeria', 'paquetes', 'mapa', 'textos')),
  value jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;

drop policy if exists "site_content lectura publica" on public.site_content;
create policy "site_content lectura publica"
  on public.site_content for select to anon, authenticated using (true);

drop policy if exists "site_content escribe admin" on public.site_content;
create policy "site_content escribe admin"
  on public.site_content for all to authenticated
  using (public.es_admin_del_sitio())
  with check (public.es_admin_del_sitio());

-- 3) Historial: cada cambio guarda el valor anterior (permite deshacer). Solo lo ve el admin.
create table if not exists public.site_content_historial (
  id bigint generated always as identity primary key,
  key text not null,
  value_anterior jsonb,
  value_nuevo jsonb,
  cambiado_por uuid,
  cambiado_en timestamptz not null default now()
);
alter table public.site_content_historial enable row level security;

drop policy if exists "historial lo ve el admin" on public.site_content_historial;
create policy "historial lo ve el admin"
  on public.site_content_historial for select to authenticated
  using (public.es_admin_del_sitio());

create or replace function public.site_content_guardar_historial()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.site_content_historial (key, value_anterior, value_nuevo, cambiado_por)
  values (new.key, case when tg_op = 'UPDATE' then old.value end, new.value, auth.uid());
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_content_historial_trg on public.site_content;
create trigger site_content_historial_trg
  before insert or update on public.site_content
  for each row execute function public.site_content_guardar_historial();

-- 4) Carpeta publica de fotos (solo imagenes, hasta 5 MB). Cualquiera las ve; solo el admin sube o borra.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('sitio', 'sitio', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = true,
      file_size_limit = 5242880,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "sitio escribe admin" on storage.objects;
create policy "sitio escribe admin"
  on storage.objects for all to authenticated
  using (bucket_id = 'sitio' and public.es_admin_del_sitio())
  with check (bucket_id = 'sitio' and public.es_admin_del_sitio());

-- 5) PASO FINAL, despues de crear tu usuario en Authentication -> Users:
--    reemplaza el texto por el UID de ese usuario y ejecuta SOLO esta linea.
-- insert into public.site_admins (user_id) values ('PEGAR-AQUI-EL-UID');
