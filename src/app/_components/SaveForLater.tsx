"use client";

import { saveForLater } from "../_lib/saved";
import { buttonClass } from "./buttonStyle";
import { useGoBack } from "./useGoBack";

/*
 * 나중에 다시 확인 버튼 (F12, 완료 후 변경 요청으로 동작 변경).
 * 누르면 이 요금제와 저장 시각을 브라우저에만 저장하고 이전 페이지로 이동한다.
 * 저장 직후 화면에 따로 표시하는 것은 없다. 저장을 지우는 방법과 유효기간은 [문서에 없음].
 */
export default function SaveForLater({ planId }: { planId: string }) {
  const goBack = useGoBack();

  return (
    <button
      type="button"
      onClick={() => {
        saveForLater(planId);
        goBack();
      }}
      className={buttonClass({ variant: "secondary", size: "xl" })}
    >
      나중에 다시 확인
    </button>
  );
}
