-- Milestone 3 migration

-- A1 Roles & helpers
create table if not exists public.admin_users(
  user_id uuid primary key,
  role text check (role in ('admin','super_admin')) not null,
  created_at timestamptz default now()
);

create or replace function public.is_admin(uid uuid) returns boolean
language sql stable as $$
  select exists(
    select 1 from public.admin_users
    where user_id = uid and role in ('admin','super_admin')
  );
$$;

create or replace function public.is_super_admin(uid uuid) returns boolean
language sql stable as $$
  select exists(
    select 1 from public.admin_users
    where user_id = uid and role = 'super_admin'
  );
$$;

-- A2 Doctors & applications hardening
create table if not exists public.doctors(
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  registry_no text,
  status text check (status in ('pending','approved','rejected')) default 'pending',
  created_at timestamptz default now()
);

alter table public.applications
  add column if not exists status text check (status in ('submitted','approved','rejected')) default 'submitted',
  add column if not exists processed_by uuid references auth.users(id),
  add column if not exists processed_at timestamptz;

-- A3 Content auto-updated timestamps
alter table public.articles add column if not exists updated_at timestamptz default now();
alter table public.announcements add column if not exists updated_at timestamptz default now();
alter table public.events add column if not exists updated_at timestamptz default now();

create or replace function public.set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger articles_updated before update on public.articles
for each row execute function public.set_updated_at();
create trigger announcements_updated before update on public.announcements
for each row execute function public.set_updated_at();
create trigger events_updated before update on public.events
for each row execute function public.set_updated_at();

-- A4 Wallet passes metadata
create table if not exists public.wallet_passes(
  user_id uuid references auth.users(id) on delete cascade,
  platform text check (platform in ('apple','google')) not null,
  status text check (status in ('issued','revoked','error')) default 'issued',
  token text,
  issued_at timestamptz default now(),
  primary key(user_id, platform)
);

-- A5 Zoom meetings
create table if not exists public.zoom_meetings(
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  starts_at timestamptz,
  duration_minutes int,
  join_url text,
  host_url text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create table if not exists public.zoom_attendees(
  meeting_id uuid references public.zoom_meetings(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  primary key(meeting_id, user_id)
);

-- A6 Admin email inbox
create table if not exists public.emails(
  id bigserial primary key,
  subject text,
  "from" text,
  "to" text,
  snippet text,
  html text,
  created_at timestamptz default now()
);

-- Audit logs
create table if not exists public.audit_logs(
  id bigserial primary key,
  at timestamptz default now(),
  actor uuid,
  action text,
  entity text,
  entity_id text,
  meta jsonb
);

-- A7 Storage RLS policies
-- public-assets bucket
alter table storage.objects enable row level security;

create policy "Public assets are readable by anyone" on storage.objects
  for select using (bucket_id = 'public-assets');

create policy "Admin manages public assets" on storage.objects
  for all using (
    bucket_id = 'public-assets' and public.is_admin(auth.uid())
  ) with check (
    bucket_id = 'public-assets' and public.is_admin(auth.uid())
  );

-- doctor-docs bucket
create policy "Doctors read own docs" on storage.objects
  for select using (
    bucket_id = 'doctor-docs' and (
      metadata ->> 'owner_id' = auth.uid()::text or public.is_admin(auth.uid())
    )
  );

create policy "Doctors manage own docs" on storage.objects
  for insert using (
    bucket_id = 'doctor-docs' and (
      metadata ->> 'owner_id' = auth.uid()::text or public.is_admin(auth.uid())
    )
  ) with check (
    bucket_id = 'doctor-docs' and (
      metadata ->> 'owner_id' = auth.uid()::text or public.is_admin(auth.uid())
    )
  );

create policy "Doctors update own docs" on storage.objects
  for update using (
    bucket_id = 'doctor-docs' and (
      metadata ->> 'owner_id' = auth.uid()::text or public.is_admin(auth.uid())
    )
  ) with check (
    bucket_id = 'doctor-docs' and (
      metadata ->> 'owner_id' = auth.uid()::text or public.is_admin(auth.uid())
    )
  );

create policy "Doctors delete own docs" on storage.objects
  for delete using (
    bucket_id = 'doctor-docs' and (
      metadata ->> 'owner_id' = auth.uid()::text or public.is_admin(auth.uid())
    )
  );

-- A8 RLS policies for tables
alter table public.articles enable row level security;
alter table public.announcements enable row level security;
alter table public.events enable row level security;
alter table public.applications enable row level security;
alter table public.doctors enable row level security;
alter table public.admin_users enable row level security;
alter table public.emails enable row level security;
alter table public.wallet_passes enable row level security;
alter table public.zoom_meetings enable row level security;
alter table public.zoom_attendees enable row level security;
alter table public.audit_logs enable row level security;

-- Public read
create policy "Public read articles" on public.articles for select using (true);
create policy "Public read announcements" on public.announcements for select using (true);
create policy "Public read events" on public.events for select using (true);

-- Admin write
create policy "Admin write articles" on public.articles for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "Admin write announcements" on public.announcements for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "Admin write events" on public.events for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- Applications
create policy "Applications insert" on public.applications for insert with check (true);
create policy "Applications select/update admin" on public.applications for all using (public.is_admin(auth.uid()));

-- Doctors
create policy "Doctors select self or admin" on public.doctors for select using (id = auth.uid() or public.is_admin(auth.uid()));
create policy "Doctors update self or admin" on public.doctors for update using (id = auth.uid() or public.is_admin(auth.uid())) with check (id = auth.uid() or public.is_admin(auth.uid()));

-- Admin users
create policy "Super admin manage" on public.admin_users for all using (public.is_super_admin(auth.uid())) with check (public.is_super_admin(auth.uid()));
create policy "Prevent delete super" on public.admin_users for delete using (role <> 'super_admin');

-- Emails & wallet passes & zoom & audit
create policy "Admin read emails" on public.emails for select using (public.is_admin(auth.uid()));
create policy "Admin read wallet passes" on public.wallet_passes for select using (public.is_admin(auth.uid()));
create policy "Admin read meetings" on public.zoom_meetings for select using (public.is_admin(auth.uid()));
create policy "Admin read attendees" on public.zoom_attendees for select using (public.is_admin(auth.uid()));
create policy "Admin read audit" on public.audit_logs for select using (public.is_admin(auth.uid()));

create policy "Doctor view own meetings" on public.zoom_meetings for select using (
  public.is_admin(auth.uid()) or exists (
    select 1 from public.zoom_attendees za
    where za.meeting_id = id and za.user_id = auth.uid()
  )
);

create policy "Doctor view own wallet" on public.wallet_passes for select using (user_id = auth.uid() or public.is_admin(auth.uid()));

-- end of migration
