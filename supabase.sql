-- Schema: Auto Glass Booking (rendez_vous)
-- Creates table and Row Level Security (RLS) policies

create schema if not exists public;

create table if not exists public.rendez_vous (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  client_nom text not null,
  client_telephone text not null,
  client_email text null,
  vehicule_infos text not null,
  type_service text not null check (type_service in ('DOMICILE','ATELIER')),
  adresse_intervention text null,
  date_souhaitee date not null,
  statut text not null default 'Nouveau',
  -- Ensure address presence only for DOMICILE
  constraint adresse_domicle_check check (
    (type_service = 'DOMICILE' and adresse_intervention is not null)
    or (type_service = 'ATELIER' and adresse_intervention is null)
  )
);

comment on table public.rendez_vous is 'Prise de rendez-vous pare-brise';
comment on column public.rendez_vous.type_service is 'DOMICILE ou ATELIER';
comment on column public.rendez_vous.adresse_intervention is 'Adresse si DOMICILE';

-- Indexes for admin dashboard sorting/filtering
create index if not exists rendez_vous_created_at_idx on public.rendez_vous (created_at desc);
create index if not exists rendez_vous_date_souhaitee_idx on public.rendez_vous (date_souhaitee);
create index if not exists rendez_vous_type_service_idx on public.rendez_vous (type_service);

-- Enable Row Level Security
alter table public.rendez_vous enable row level security;

-- Public insert: allow both anon and authenticated users to insert bookings
create policy if not exists "public_insert_rendez_vous"
  on public.rendez_vous
  for insert
  to anon, authenticated
  with check (true);

-- Admin read policy: allow only authenticated users with JWT claim role=admin
create policy if not exists "admins_can_select_rendez_vous"
  on public.rendez_vous
  for select
  to authenticated
  using ((auth.jwt() ->> 'role') = 'admin');

-- Service role bypass (server-side only). This is safe for server usage.
create policy if not exists "service_role_can_select_rendez_vous"
  on public.rendez_vous
  for select
  to service_role
  using (true);
