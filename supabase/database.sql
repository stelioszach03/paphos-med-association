-- Enable extensions used by Supabase
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  created_at timestamp with time zone default now()
);
alter table public.profiles enable row level security;

-- Admin Users (role-based access)
create table if not exists public.admin_users (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  role text not null check (role in ('admin','super_admin')),
  created_at timestamptz default now()
);
alter table public.admin_users enable row level security;

-- Doctors profile (subset of profiles that are doctors)
create table if not exists public.doctors (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  registry_no text not null,
  specialty text,
  local_association text,
  photo_url text,
  created_at timestamptz default now()
);
alter table public.doctors enable row level security;

-- Applications (membership requests)
create table if not exists public.applications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id),
  full_name text not null,
  email text not null,
  phone text,
  registry_no text,
  notes text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz default now()
);
alter table public.applications enable row level security;

-- Memberships (approved members)
create table if not exists public.memberships (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  status text not null check (status in ('active','suspended','expired')) default 'active',
  approved_by uuid references public.admin_users(user_id),
  approved_at timestamptz
);
alter table public.memberships enable row level security;

-- Content tables
create table if not exists public.articles (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  summary text,
  content text,
  lang text not null default 'el' check (lang in ('el','en','ru','zh')),
  created_by uuid references public.admin_users(user_id),
  created_at timestamptz default now()
);
alter table public.articles enable row level security;

create table if not exists public.announcements (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  summary text,
  content text,
  lang text not null default 'el' check (lang in ('el','en','ru','zh')),
  created_by uuid references public.admin_users(user_id),
  created_at timestamptz default now()
);
alter table public.announcements enable row level security;

create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  description text,
  location text,
  start_at timestamptz,
  end_at timestamptz,
  lang text not null default 'el' check (lang in ('el','en','ru','zh')),
  created_by uuid references public.admin_users(user_id),
  created_at timestamptz default now()
);
alter table public.events enable row level security;

-- Passes (Wallet)
create table if not exists public.passes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  platform text not null check (platform in ('apple','google')),
  serial text unique,
  status text not null default 'active' check (status in ('active','revoked','expired')),
  created_at timestamptz default now()
);
alter table public.passes enable row level security;

-- Utility functions for RLS
create or replace function public.is_admin() returns boolean
language sql stable as $$
  select exists(select 1 from public.admin_users au where au.user_id = auth.uid() and au.role in ('admin','super_admin'));
$$;

create or replace function public.is_super_admin() returns boolean
language sql stable as $$
  select exists(select 1 from public.admin_users au where au.user_id = auth.uid() and au.role = 'super_admin');
$$;

-- Trigger: create profile on new auth user
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id, email) values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS Policies

-- profiles
drop policy if exists "profiles_self_select" on public.profiles;
create policy "profiles_self_select" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- admin_users
drop policy if exists "admin_users_read_admins" on public.admin_users;
create policy "admin_users_read_admins" on public.admin_users
  for select using (public.is_admin());

drop policy if exists "admin_users_insert_by_super" on public.admin_users;
create policy "admin_users_insert_by_super" on public.admin_users
  for insert with check (public.is_super_admin());

drop policy if exists "admin_users_update_by_super" on public.admin_users;
create policy "admin_users_update_by_super" on public.admin_users
  for update using (public.is_super_admin()) with check (public.is_super_admin());

drop policy if exists "admin_users_delete_only_super_can_delete_admin" on public.admin_users;
create policy "admin_users_delete_only_super_can_delete_admin" on public.admin_users
  for delete using (public.is_super_admin() and role = 'admin');
-- Note: Super Admin rows are non-deletable by policy (role='super_admin' won't match above)

-- doctors
drop policy if exists "doctors_self_select" on public.doctors;
create policy "doctors_self_select" on public.doctors
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "doctors_self_upsert" on public.doctors;
create policy "doctors_self_upsert" on public.doctors
  for insert with check (auth.uid() = user_id);
create policy "doctors_self_update" on public.doctors
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- applications
drop policy if exists "applications_owner_or_admin" on public.applications;
create policy "applications_owner_or_admin" on public.applications
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "applications_insert_any_user" on public.applications;
create policy "applications_insert_any_user" on public.applications
  for insert with check (auth.uid() = user_id or auth.uid() is null);
-- allow unauthenticated submission: user_id nullable

drop policy if exists "applications_update_admin_only" on public.applications;
create policy "applications_update_admin_only" on public.applications
  for update using (public.is_admin()) with check (public.is_admin());

-- memberships
drop policy if exists "memberships_select_owner_or_admin" on public.memberships;
create policy "memberships_select_owner_or_admin" on public.memberships
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "memberships_admin_manage" on public.memberships;
create policy "memberships_admin_manage" on public.memberships
  for insert with check (public.is_admin());
create policy "memberships_admin_update" on public.memberships
  for update using (public.is_admin()) with check (public.is_admin());

-- content: public read, admin write
drop policy if exists "articles_read_all" on public.articles;
create policy "articles_read_all" on public.articles
  for select using (true);

drop policy if exists "articles_admin_write" on public.articles;
create policy "articles_admin_write" on public.articles
  for insert with check (public.is_admin());
create policy "articles_admin_update" on public.articles
  for update using (public.is_admin()) with check (public.is_admin());
create policy "articles_admin_delete" on public.articles
  for delete using (public.is_admin());

drop policy if exists "announcements_read_all" on public.announcements;
create policy "announcements_read_all" on public.announcements
  for select using (true);
drop policy if exists "announcements_admin_write" on public.announcements;
create policy "announcements_admin_write" on public.announcements
  for insert with check (public.is_admin());
create policy "announcements_admin_update" on public.announcements
  for update using (public.is_admin()) with check (public.is_admin());
create policy "announcements_admin_delete" on public.announcements
  for delete using (public.is_admin());

drop policy if exists "events_read_all" on public.events;
create policy "events_read_all" on public.events
  for select using (true);
drop policy if exists "events_admin_write" on public.events;
create policy "events_admin_write" on public.events
  for insert with check (public.is_admin());
create policy "events_admin_update" on public.events
  for update using (public.is_admin()) with check (public.is_admin());
create policy "events_admin_delete" on public.events
  for delete using (public.is_admin());

-- Storage buckets for docs and avatars
insert into storage.buckets (id, name, public) values ('doctor-docs','doctor-docs', false)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('avatars','avatars', false)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('public-assets','public-assets', true)
  on conflict (id) do nothing;

-- Storage policies
create policy if not exists "doctor_docs_read_own_or_admin"
  on storage.objects for select
  using (
    bucket_id = 'doctor-docs' and
    ( auth.uid() = owner or public.is_admin() )
  );

create policy if not exists "doctor_docs_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'doctor-docs' and auth.uid() = owner
  );

create policy if not exists "avatars_read_own_or_admin"
  on storage.objects for select
  using (bucket_id = 'avatars' and (auth.uid() = owner or public.is_admin()));

create policy if not exists "avatars_insert_own"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.uid() = owner);

-- Demo seed
insert into public.announcements (title, slug, summary, content, lang) values
('Καλωσήρθατε στο νέο μας site','welcome','Επανεκκίνηση της ψηφιακής παρουσίας μας.','Περισσότερα σύντομα.','el')
on conflict do nothing;
