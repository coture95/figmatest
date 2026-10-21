"use client";

import { useState } from "react";
import { insertSavedPlan } from "../_lib/saved";
import { buttonClass } from "./buttonStyle";
import { useGoBack } from "./useGoBack";

/*
 * 나중에 다시 확인 버튼 (F12, 완료 후 변경 요청과 Supabase 연결로 동작 변경).
 * 누르면 이 요금제를 DB(saved_plans)에 저장하고, 성공하면 이전 페이지로 이동한다.
 * 저장 직후 화면에 따로 표시하는 것은 없다. 실패하면 이동하지 않고 버튼 위에 한 줄 안내를 보인다.
 * 저장을 지우는 방법과 유효기간은 [문서에 없음].
 */
export default function SaveForLater({ planId }: { planId: string }) {
  const goBack = useGoBack();
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
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          const ok = await insertSavedPlan(planId);
          setBusy(false);
          if (ok) {
            setFailed(false);
            goBack();
          } else {
            setFailed(true);
          }
        }}
        className={buttonClass({ variant: "secondary", size: "xl" })}
      >
        나중에 다시 확인
      </button>
    </>
  );
}
