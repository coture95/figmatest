"use client";

import { useRouter } from "next/navigation";
import { useState, type ComponentProps } from "react";
import { insertChangeRequest } from "../_lib/saved";
import { buttonClass } from "./buttonStyle";

/*
 * 구독 신청의 "신청" 버튼 (F9). 서버 화면에서 쓰려고 클라이언트 컴포넌트로 분리했다.
 * 누르면 변경 신청을 DB(change_requests)에 접수하고, 성공하면 신청 완료 화면으로 이동한다.
 * 실패하면 이동하지 않고 버튼 위에 한 줄 안내를 보인다. 실제 요금제 변경은 하지 않는다.
 * 게이트용 data-gate 속성은 화면 파일(page.tsx)에서 넘겨받아 그대로 단다.
 */
export default function SubmitButton({
  planId,
  ...rest
}: { planId: string } & ComponentProps<"button">) {
  const router = useRouter();
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <>
      {failed && (
        <p className="text-body-small font-medium text-text-secondary">
          저장에 실패했어요. 잠시 후 다시 시도해 주세요
        </p>
      )}
      <button
        {...rest}
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          const ok = await insertChangeRequest(planId);
          setBusy(false);
          setFailed(!ok);
          if (ok) router.push(`/plans/${planId}/subscribe/complete`);
        }}
        className={buttonClass({ variant: "primary", size: "xl" })}
      >
        신청
      </button>
    </>
  );
}
