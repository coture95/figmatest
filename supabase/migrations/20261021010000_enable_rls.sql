-- RLS 켜기 (첫 마이그레이션 20261021000000_init_plan_change.sql 실행 후에 실행한다). 여러 번 실행해도 안전하다.
--
-- !! 실행 순서 주의 !!
-- 앱이 모든 요청에 x-client-id 헤더를 보내는 버전으로 먼저 배포한 뒤에 이 SQL을 실행한다.
-- 헤더 없는 이전 버전 앱은 이 SQL 실행 직후부터 저장·신청·상담이 모두 실패한다.
--
-- 방식: 로그인이 없으므로 브라우저가 만든 익명 UUID(client_id)를 x-client-id 헤더로 보내고,
--       정책이 "행의 client_id = 헤더의 client_id"인 경우에만 허용한다. 이 UUID가 사실상 본인 확인 값이다.
--       그래서 다른 사람의 신청·상담·저장 내역은 읽을 수 없고, UUID를 모르는 사람은 접근하지 못한다.
--
-- 되돌리기(RLS 다시 끄기): 첫 마이그레이션의 5번 항목(disable row level security + grant)을 다시 실행한다.

-- 1) 요청 헤더에서 client_id를 꺼내는 함수. 헤더가 없거나 UUID 형식이 아니면 null -> 어떤 행도 일치하지 않는다.
create or replace function public.request_client_id()
returns uuid
language sql
stable
as $$
  select case
    when h ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then h::uuid
    else null
  end
  from (
    select nullif(current_setting('request.headers', true), '')::json ->> 'x-client-id' as h
  ) s
$$;

grant execute on function public.request_client_id() to anon, authenticated;

-- 2) RLS 켜기
alter table public.plans             enable row level security;
alter table public.change_requests   enable row level security;
alter table public.consult_requests  enable row level security;
alter table public.saved_plans       enable row level security;

-- 3) 정책
-- 요금제: 누구나 읽기만
drop policy if exists plans_read on public.plans;
create policy plans_read on public.plans
  for select to anon, authenticated using (true);

-- 변경 신청 / 상담 요청 / 나중에 다시 확인: 본인(client_id 일치) 행만 추가·읽기. 수정·삭제 정책은 없다.
drop policy if exists change_requests_insert_own on public.change_requests;
create policy change_requests_insert_own on public.change_requests
  for insert to anon, authenticated
  with check (client_id = public.request_client_id() and status = 'received');
drop policy if exists change_requests_select_own on public.change_requests;
create policy change_requests_select_own on public.change_requests
  for select to anon, authenticated using (client_id = public.request_client_id());

drop policy if exists consult_requests_insert_own on public.consult_requests;
create policy consult_requests_insert_own on public.consult_requests
  for insert to anon, authenticated
  with check (client_id = public.request_client_id());
drop policy if exists consult_requests_select_own on public.consult_requests;
create policy consult_requests_select_own on public.consult_requests
  for select to anon, authenticated using (client_id = public.request_client_id());

drop policy if exists saved_plans_insert_own on public.saved_plans;
create policy saved_plans_insert_own on public.saved_plans
  for insert to anon, authenticated
  with check (client_id = public.request_client_id());
drop policy if exists saved_plans_select_own on public.saved_plans;
create policy saved_plans_select_own on public.saved_plans
  for select to anon, authenticated using (client_id = public.request_client_id());

-- 이전 "RLS 끔" 단계에서 열어 둔 정책 이름이 남아 있으면 지운다(첫 마이그레이션 개정 이전 이름).
drop policy if exists change_requests_insert on public.change_requests;
drop policy if exists consult_requests_insert on public.consult_requests;
drop policy if exists saved_plans_insert on public.saved_plans;

-- 4) 권한을 최소로: 수정·삭제는 막고, 추가·읽기만 연다. (service role 키는 RLS와 권한을 우회하므로 서버 작업은 영향 없다.)
revoke all on public.plans, public.change_requests, public.consult_requests, public.saved_plans from anon, authenticated;
grant select on public.plans to anon, authenticated;
grant select, insert on public.change_requests, public.consult_requests, public.saved_plans to anon, authenticated;
