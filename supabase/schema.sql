create extension if not exists pgcrypto;
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  mobile text,
  password_hash text not null,
  created_at timestamptz default now()
);
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  token text unique not null,
  user_id uuid not null references users(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_id text unique not null,
  user_id uuid not null references users(id) on delete cascade,
  customer jsonb not null default '{}'::jsonb,
  items jsonb not null default '[]'::jsonb,
  total numeric(12,2) not null default 0,
  payment_method text,
  status text not null default 'Confirmed',
  created_at timestamptz default now()
);
create table if not exists wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  product_id text not null,
  product jsonb not null,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);
create index if not exists sessions_token_idx on sessions(token);
create index if not exists orders_user_idx on orders(user_id, created_at desc);
create index if not exists wishlist_user_idx on wishlists(user_id);
