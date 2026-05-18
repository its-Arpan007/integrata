-- ============================================================
-- BUILDR — Supabase Database Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ==========================================
-- 1. PROFILES TABLE (extends auth.users)
-- ==========================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  name text not null default '',
  email text not null default '',
  avatar text default '',
  bio text default '',
  college text,
  company text,
  location text default '',
  github text,
  portfolio text,
  skills text[] default '{}',
  builder_dna jsonb default '[]',
  fun_prompts jsonb default '[]',
  ai_summary text default '',
  availability text default 'Open' check (availability in ('Full-time', 'Part-time', 'Weekends', 'Hackathons Only', 'Open')),
  interests text[] default '{}',
  online boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ==========================================
-- 2. PINGS TABLE (collaboration requests)
-- ==========================================
create table public.pings (
  id uuid default gen_random_uuid() primary key,
  from_user_id uuid references public.profiles(id) on delete cascade not null,
  to_user_id uuid references public.profiles(id) on delete cascade not null,
  message text default '',
  ai_suggested boolean default false,
  status text default 'pending' check (status in ('pending', 'accepted', 'ignored')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.pings enable row level security;

create policy "Users can view pings they sent or received"
  on public.pings for select
  using (auth.uid() = from_user_id or auth.uid() = to_user_id);

create policy "Authenticated users can send pings"
  on public.pings for insert
  with check (auth.uid() = from_user_id);

create policy "Recipients can update ping status"
  on public.pings for update
  using (auth.uid() = to_user_id);

-- ==========================================
-- 3. TEAMS TABLE
-- ==========================================
create table public.teams (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text default '',
  project text default '',
  status text default 'planning' check (status in ('planning', 'active', 'completed', 'archived')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.teams enable row level security;

create policy "Team members can view their teams"
  on public.teams for select
  using (
    exists (
      select 1 from public.team_members
      where team_members.team_id = teams.id
      and team_members.user_id = auth.uid()
    )
  );

create policy "Authenticated users can create teams"
  on public.teams for insert
  with check (auth.uid() = created_by);

create policy "Team creators can update their teams"
  on public.teams for update
  using (auth.uid() = created_by);

-- ==========================================
-- 4. TEAM_MEMBERS TABLE
-- ==========================================
create table public.team_members (
  id uuid default gen_random_uuid() primary key,
  team_id uuid references public.teams(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text default 'Member',
  joined_at timestamptz default now(),
  unique(team_id, user_id)
);

alter table public.team_members enable row level security;

create policy "Team members are viewable by team members"
  on public.team_members for select
  using (
    exists (
      select 1 from public.team_members as tm
      where tm.team_id = team_members.team_id
      and tm.user_id = auth.uid()
    )
  );

create policy "Team creators can add members"
  on public.team_members for insert
  with check (
    exists (
      select 1 from public.teams
      where teams.id = team_members.team_id
      and teams.created_by = auth.uid()
    )
    or auth.uid() = user_id
  );

-- ==========================================
-- 5. TASKS TABLE
-- ==========================================
create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  team_id uuid references public.teams(id) on delete cascade not null,
  title text not null,
  description text default '',
  status text default 'todo' check (status in ('todo', 'in-progress', 'review', 'done')),
  priority text default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  assignee_id uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.tasks enable row level security;

create policy "Team members can view tasks"
  on public.tasks for select
  using (
    exists (
      select 1 from public.team_members
      where team_members.team_id = tasks.team_id
      and team_members.user_id = auth.uid()
    )
  );

create policy "Team members can create tasks"
  on public.tasks for insert
  with check (
    exists (
      select 1 from public.team_members
      where team_members.team_id = tasks.team_id
      and team_members.user_id = auth.uid()
    )
  );

create policy "Team members can update tasks"
  on public.tasks for update
  using (
    exists (
      select 1 from public.team_members
      where team_members.team_id = tasks.team_id
      and team_members.user_id = auth.uid()
    )
  );

-- ==========================================
-- 6. MESSAGES TABLE (team chat)
-- ==========================================
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  team_id uuid references public.teams(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete set null,
  content text not null,
  type text default 'text' check (type in ('text', 'system', 'ai-suggestion')),
  created_at timestamptz default now()
);

alter table public.messages enable row level security;

create policy "Team members can view messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.team_members
      where team_members.team_id = messages.team_id
      and team_members.user_id = auth.uid()
    )
  );

create policy "Team members can send messages"
  on public.messages for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.team_members
      where team_members.team_id = messages.team_id
      and team_members.user_id = auth.uid()
    )
  );

-- ==========================================
-- 7. COMPATIBILITY CACHE TABLE
-- ==========================================
create table public.compatibility_cache (
  id uuid default gen_random_uuid() primary key,
  user1_id uuid references public.profiles(id) on delete cascade not null,
  user2_id uuid references public.profiles(id) on delete cascade not null,
  overall_score integer not null,
  dimensions jsonb default '[]',
  strengths jsonb default '[]',
  challenges jsonb default '[]',
  suggested_roles jsonb default '[]',
  ai_insight text default '',
  created_at timestamptz default now(),
  unique(user1_id, user2_id)
);

alter table public.compatibility_cache enable row level security;

create policy "Users can view their own compatibility results"
  on public.compatibility_cache for select
  using (auth.uid() = user1_id or auth.uid() = user2_id);

create policy "System can insert compatibility results"
  on public.compatibility_cache for insert
  with check (auth.uid() = user1_id or auth.uid() = user2_id);

-- ==========================================
-- 8. FUNCTIONS & TRIGGERS
-- ==========================================

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, username, name, email, avatar, github)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'user_name',
      new.raw_user_meta_data ->> 'preferred_username',
      split_part(new.email, '@', 1)
    ),
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    ),
    coalesce(new.email, ''),
    coalesce(
      new.raw_user_meta_data ->> 'avatar_url',
      'https://api.dicebear.com/9.x/notionists/svg?seed=' || new.id
    ),
    new.raw_user_meta_data ->> 'user_name'
  );
  return new;
end;
$$;

-- Trigger: auto-create profile
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at timestamps
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger pings_updated_at
  before update on public.pings
  for each row execute procedure public.handle_updated_at();

create trigger teams_updated_at
  before update on public.teams
  for each row execute procedure public.handle_updated_at();

create trigger tasks_updated_at
  before update on public.tasks
  for each row execute procedure public.handle_updated_at();

-- ==========================================
-- 9. INDEXES FOR PERFORMANCE
-- ==========================================
create index idx_profiles_username on public.profiles(username);
create index idx_pings_from_user on public.pings(from_user_id);
create index idx_pings_to_user on public.pings(to_user_id);
create index idx_pings_status on public.pings(status);
create index idx_team_members_team on public.team_members(team_id);
create index idx_team_members_user on public.team_members(user_id);
create index idx_tasks_team on public.tasks(team_id);
create index idx_tasks_assignee on public.tasks(assignee_id);
create index idx_messages_team on public.messages(team_id);
create index idx_messages_created on public.messages(created_at);

-- ==========================================
-- 10. ENABLE REALTIME
-- ==========================================
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.pings;
alter publication supabase_realtime add table public.tasks;