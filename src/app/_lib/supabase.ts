import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getClientId } from "./client-id";

/*
 * Supabase 브라우저용 클라이언트 (한 개만 만들어 재사용한다).
 * 브라우저에서만 호출한다: 만들 때 localStorage의 client_id를 읽어 x-client-id 헤더에 싣는다.
 * 브라우저에서 쓰는 공개 키(NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)만 쓴다.
 * 서비스 롤 키는 브라우저 코드에 쓰지 않는다. 키 값은 코드·주석·로그에 적지 않는다.
 * 환경 변수는 Next가 빌드 때 값을 끼워 넣으므로 process.env.이름을 그대로 적어야 한다.
 */
let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase 환경 변수가 없어요. .env.local에 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY를 설정하세요.",
    );
  }
  // 로그인이 없어서, 서버의 RLS 정책이 이 헤더 값(client_id)으로 "본인 행"만 허용한다.
  // 헤더가 없거나 insert하는 client_id와 다르면 모든 쓰기·읽기가 실패한다.
  client = createClient(url, key, {
    global: { headers: { "x-client-id": getClientId() } },
  });
  return client;
}
