/*
 * 익명 고객 ID(client_id) 만들기·읽기. 개인정보 없는 UUID이며 브라우저 localStorage에 한 번 만들어 재사용한다.
 * supabase.ts(헤더)와 saved.ts(insert·select)가 같은 값을 쓰도록 이 파일 한 곳에서만 만든다.
 * 브라우저에서만 호출한다(서버 렌더링 중에는 호출하지 않는다).
 */
const CLIENT_ID_KEY = "plans:client-id";

// 저장소를 쓸 수 없을 때도 이번 방문 동안은 같은 값을 쓰도록 메모리에 담아 둔다([문서에 없음]).
let cached: string | null = null;

/** 익명 고객 ID를 돌려준다. 없으면 crypto.randomUUID()로 만들어 localStorage에 저장한다. */
export function getClientId(): string {
  if (cached) return cached;
  try {
    const existing = window.localStorage.getItem(CLIENT_ID_KEY);
    if (existing) {
      cached = existing;
      return existing;
    }
    const created = crypto.randomUUID();
    window.localStorage.setItem(CLIENT_ID_KEY, created);
    cached = created;
    return created;
  } catch {
    cached = crypto.randomUUID();
    return cached;
  }
}
