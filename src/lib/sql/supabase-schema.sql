create table if not exists public.reviews (
  id bigint primary key,
  output text not null,
  drain text not null,
  satisfaction text not null,
  created_at date not null
);

create table if not exists public.tasks (
  id bigint primary key,
  title text not null,
  completed boolean not null default false,
  created_at timestamptz not null,
  completed_at timestamptz
);

alter table public.reviews enable row level security;
alter table public.tasks enable row level security;

create policy "allow anon read write reviews" on public.reviews
  for all
  to anon
  using (true)
  with check (true);

create policy "allow anon read write tasks" on public.tasks
  for all
  to anon
  using (true)
  with check (true);

