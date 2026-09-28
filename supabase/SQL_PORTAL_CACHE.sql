-- Guidetti Contábil V1.4 — cache de conteúdo oficial
-- Execute uma vez no Supabase > SQL Editor.
create table if not exists public.portal_cache (
  cache_key text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.portal_cache enable row level security;
-- Não crie policy pública. A Edge Function usa a service role do próprio projeto.
