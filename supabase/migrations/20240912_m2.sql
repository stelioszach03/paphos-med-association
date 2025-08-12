-- Milestone 2 schema additions

-- A1 helpers & roles
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text check (role in ('admin','super_admin')),
  created_at timestamptz default now()
);

create or replace function public.is_admin(uid uuid) returns boolean
language sql stable as $$
  select exists(select 1 from public.admin_users where user_id = uid and role in ('admin','super_admin'));
$$;

create or replace function public.is_super_admin(uid uuid) returns boolean
language sql stable as $$
  select exists(select 1 from public.admin_users where user_id = uid and role = 'super_admin');
$$;

-- A2 doctors & applications
-- rename column user_id -> id if present
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='doctors' AND column_name='user_id') THEN
    ALTER TABLE public.doctors RENAME COLUMN user_id TO id;
  END IF;
END $$;

create table if not exists public.doctors (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  registry_no text,
  status text check (status in ('pending','approved','rejected')) default 'pending',
  created_at timestamptz default now()
);
alter table public.doctors add column if not exists full_name text;
alter table public.doctors add column if not exists email text;
alter table public.doctors add column if not exists phone text;
alter table public.doctors add column if not exists registry_no text;
alter table public.doctors add column if not exists status text check (status in ('pending','approved','rejected')) default 'pending';
alter table public.doctors add column if not exists created_at timestamptz default now();

alter table public.applications alter column status set default 'submitted';
alter table public.applications drop constraint if exists applications_status_check;
alter table public.applications add constraint applications_status_check check (status in ('submitted','approved','rejected'));
alter table public.applications add column if not exists processed_by uuid;
alter table public.applications add column if not exists processed_at timestamptz;
alter table public.applications add column if not exists email_enc bytea;
alter table public.applications add column if not exists phone_enc bytea;
alter table public.applications add column if not exists notes_enc bytea;

-- A3 content updated_at
alter table public.articles add column if not exists updated_at timestamptz default now();
alter table public.announcements add column if not exists updated_at timestamptz default now();
alter table public.events add column if not exists updated_at timestamptz default now();

create or replace function public.set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on public.articles;
create trigger set_updated_at before update on public.articles for each row execute procedure public.set_updated_at();
drop trigger if exists set_updated_at on public.announcements;
create trigger set_updated_at before update on public.announcements for each row execute procedure public.set_updated_at();
drop trigger if exists set_updated_at on public.events;
create trigger set_updated_at before update on public.events for each row execute procedure public.set_updated_at();

-- A4 wallet passes
create table if not exists public.wallet_passes (
  user_id uuid references auth.users(id) on delete cascade,
  platform text check (platform in ('apple','google')),
  status text check (status in ('issued','revoked','error')) default 'issued',
  token text,
  issued_at timestamptz default now(),
  primary key (user_id, platform)
);
alter table public.wallet_passes enable row level security;

-- A5 zoom meetings
create table if not exists public.zoom_meetings (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  starts_at timestamptz,
  duration_minutes int,
  join_url text,
  host_url text,
  created_by uuid,
  created_at timestamptz default now()
);
alter table public.zoom_meetings enable row level security;

create table if not exists public.zoom_attendees (
  meeting_id uuid references public.zoom_meetings(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  primary key (meeting_id, user_id)
);
alter table public.zoom_attendees enable row level security;

-- A6 admin email inbox
create table if not exists public.emails (
  id bigserial primary key,
  subject text,
  "from" text,
  "to" text,
  snippet text,
  html text,
  created_at timestamptz default now()
);
alter table public.emails enable row level security;

-- A7 policies
-- wallet_passes: admin only
create policy if not exists "wallet_passes_admin_all" on public.wallet_passes
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- zoom_meetings: admins, or doctors joined via zoom_attendees
create policy if not exists "zoom_meetings_admin_select" on public.zoom_meetings
  for select using (public.is_admin(auth.uid()));
create policy if not exists "zoom_meetings_doctor_select" on public.zoom_meetings
  for select using (exists (select 1 from public.zoom_attendees za where za.meeting_id = id and za.user_id = auth.uid()));
create policy if not exists "zoom_meetings_admin_write" on public.zoom_meetings
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- zoom_attendees
create policy if not exists "zoom_attendees_admin_all" on public.zoom_attendees
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy if not exists "zoom_attendees_doctor_read" on public.zoom_attendees
  for select using (user_id = auth.uid());

-- emails: admin only
create policy if not exists "emails_admin_all" on public.emails
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
