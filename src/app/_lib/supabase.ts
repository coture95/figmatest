import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/*
 * Supabase 브라우저용 클라이언트 (한 개만 만들어 재사용한다).
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
  client = createClient(url, key);
  return client;
}
