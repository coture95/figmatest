-- 요금제 추천·구독 서비스 초기 스키마
-- 실행: Supabase 대시보드 > SQL Editor에 이 파일 전체를 붙여 넣고 Run. 여러 번 실행해도 안전하다(idempotent).
-- 개인정보 컬럼은 없다. 고객 구분은 브라우저가 만든 익명 UUID(client_id)로만 한다.

-- 1) 요금제 (읽기 전용 기준 데이터) ---------------------------------------------
create table if not exists public.plans (
  id          text primary key,                      -- URL의 planId와 같다: basic, standard, premium
  name        text    not null,
  price       integer not null check (price >= 0),   -- 월 요금(원)
  data_gb     integer not null check (data_gb >= 0), -- 데이터 제공량(GB)
  voice       text    not null,                      -- 통화 제공량 표시값 (예: '50분', '무제한')
  sms         text    not null,                      -- 문자 제공량 표시값 (예: '50건', '무제한')
  sort_order  integer not null default 0
);

insert into public.plans (id, name, price, data_gb, voice, sms, sort_order) values
  ('basic',    '베이직',   4900,  3,  '50분',   '50건',   1),
  ('standard', '스탠다드', 9900,  10, '100분',  '100건',  2),
  ('premium',  '프리미엄', 19900, 30, '무제한', '무제한', 3)
on conflict (id) do update set
  name = excluded.name, price = excluded.price, data_gb = excluded.data_gb,
  voice = excluded.voice, sms = excluded.sms, sort_order = excluded.sort_order;

-- 2) 변경 신청: 구독 신청 화면에서 최종 완료하면 접수된다(실제 요금제 변경은 하지 않는다) ----
create table if not exists public.change_requests (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid        not null,
  plan_id     text        not null references public.plans (id),  -- 변경 대상 요금제
  status      text        not null default 'received' check (status in ('received')),
  created_at  timestamptz not null default now()
);
create index if not exists change_requests_client_idx on public.change_requests (client_id, created_at desc);

-- 3) 상담 요청: 입력 없이 접수만 한다 -----------------------------------------------
create table if not exists public.consult_requests (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid        not null,
  plan_id     text        not null references public.plans (id),
  source      text        not null check (source in ('detail', 'subscribe')),  -- 요금제 상세 / 구독 신청 화면
  created_at  timestamptz not null default now()
);
create index if not exists consult_requests_client_idx on public.consult_requests (client_id, created_at desc);

-- 4) 나중에 다시 확인: 고객당 요금제 하나와 저장 시각. 쌓기만 하고 가장 최근 행을 쓴다 --------
create table if not exists public.saved_plans (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid        not null,
  plan_id     text        not null references public.plans (id),
  saved_at    timestamptz not null default now()
);
create index if not exists saved_plans_client_idx on public.saved_plans (client_id, saved_at desc);

-- 5) 보안(RLS): 끔. 테스트용 DB라 사용자가 직접 정했다. ------------------------------------------
-- 주의: RLS가 꺼져 있으면 anon 키(브라우저에 노출되는 키)만 알아도 4개 테이블을 읽고 쓰고 지울 수 있다.
--       실제 서비스로 쓰기 전에 RLS를 켜고 정책을 만들어야 한다. (이전 안은 git 기록 12d4af0에 있다.)
alter table public.plans             disable row level security;
alter table public.change_requests   disable row level security;
alter table public.consult_requests  disable row level security;
alter table public.saved_plans       disable row level security;

-- 이전 실행에서 만든 정책이 남아 있으면 지운다.
drop policy if exists plans_read on public.plans;
drop policy if exists change_requests_insert on public.change_requests;
drop policy if exists consult_requests_insert on public.consult_requests;
drop policy if exists saved_plans_insert on public.saved_plans;

-- 브라우저(anon, authenticated)가 4개 테이블을 모두 쓸 수 있게 권한을 연다.
grant select, insert, update, delete
  on public.plans, public.change_requests, public.consult_requests, public.saved_plans
  to anon, authenticated;
