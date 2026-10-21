import { getSupabase } from "./supabase";

/*
 * DB 저장·읽기 모음 (Supabase). 모두 브라우저(클라이언트 컴포넌트)에서만 호출한다.
 * 고객 구분은 개인정보 없는 익명 UUID(client_id)이며, 브라우저 localStorage에 한 번 만들어 재사용한다.
 * 저장을 지우는 방법과 유효기간은 [문서에 없음].
 */
const CLIENT_ID_KEY = "plans:client-id";

export type SavedPlan = { planId: string; savedAt: string };
export type ConsultSource = "detail" | "subscribe";

/** 익명 고객 ID를 돌려준다. 없으면 crypto.randomUUID()로 만들어 localStorage에 저장한다. */
export function getClientId(): string {
  try {
    const existing = window.localStorage.getItem(CLIENT_ID_KEY);
    if (existing) return existing;
    const created = crypto.randomUUID();
    window.localStorage.setItem(CLIENT_ID_KEY, created);
    return created;
  } catch {
    // 저장소를 쓸 수 없으면 이번 방문에서만 쓰는 ID를 쓴다([문서에 없음]).
    return crypto.randomUUID();
  }
}

/** 성공하면 true, 실패하면 원인을 console.error로만 남기고 false를 돌려준다. */
async function insertRow(table: string, row: Record<string, string>): Promise<boolean> {
  try {
    const { error } = await getSupabase().from(table).insert(row);
    if (error) {
      console.error(`${table} insert 실패`, error);
      return false;
    }
    return true;
  } catch (e) {
    console.error(`${table} insert 실패`, e);
    return false;
  }
}

/** 구독 신청의 "신청": 변경 신청을 접수한다(status는 DB 기본값 received). */
export function insertChangeRequest(planId: string): Promise<boolean> {
  return insertRow("change_requests", { client_id: getClientId(), plan_id: planId });
}

/** 상담 요청: source는 요금제 상세 detail, 구독 신청 subscribe. */
export function insertConsultRequest(planId: string, source: ConsultSource): Promise<boolean> {
  return insertRow("consult_requests", { client_id: getClientId(), plan_id: planId, source });
}

/** 나중에 다시 확인: 쌓기만 하고, 읽을 때 가장 최근 행을 쓴다. */
export function insertSavedPlan(planId: string): Promise<boolean> {
  return insertRow("saved_plans", { client_id: getClientId(), plan_id: planId });
}

/** 이 고객의 가장 최근 저장 1행(saved_at 내림차순). 없거나 읽기에 실패하면 null. */
export async function fetchLatestSaved(): Promise<SavedPlan | null> {
  try {
    const { data, error } = await getSupabase()
      .from("saved_plans")
      .select("plan_id, saved_at")
      .eq("client_id", getClientId())
      .order("saved_at", { ascending: false })
      .limit(1);
    if (error) {
      console.error("saved_plans 읽기 실패", error);
      return null;
    }
    const row = data?.[0];
    return row ? { planId: row.plan_id as string, savedAt: row.saved_at as string } : null;
  } catch (e) {
    console.error("saved_plans 읽기 실패", e);
    return null;
  }
}
