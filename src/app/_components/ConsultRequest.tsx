"use client";

import { useEffect, useRef, useState } from "react";
import { buttonClass } from "./buttonStyle";
import { useGoBack } from "./useGoBack";

/*
 * 상담 요청 버튼 (F11, 완료 후 변경 요청으로 동작 변경).
 * 입력 없이 접수하고, 접수되면 화면 가운데에 안내 팝업을 띄운다.
 * 팝업의 "확인"을 누르면 팝업을 닫고 이전 페이지로 이동한다.
 * Esc로 닫으면 이동 없이 팝업만 닫는다([문서에 없음]: 사용자 변경 요청에서 정한 동작).
 * 팝업은 Design.md에 컴포넌트가 없어 기존 토큰(흰 배경, 모서리 16, 알파 0.1 검정 딤)으로 만들었다.
 */
export default function ConsultRequest() {
  const [open, setOpen] = useState(false);
  const goBack = useGoBack();
  const confirmRef = useRef<HTMLButtonElement>(null);

  // 팝업이 열려 있는 동안: 확인 버튼으로 포커스를 옮기고, Esc 키는 이동 없이 닫기만 한다.
  useEffect(() => {
    if (!open) return;
    confirmRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={buttonClass({ variant: "secondary", size: "xl" })}
      >
        상담 요청
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.1)] p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="consult-dialog-message"
            className="flex w-full max-w-80 flex-col gap-6 rounded-2xl bg-bg-surface p-6"
          >
            <p
              id="consult-dialog-message"
              className="text-center text-body font-semibold text-text-primary"
            >
              상담 요청이 접수되었어요
            </p>
            <button
              ref={confirmRef}
              type="button"
              onClick={() => {
                setOpen(false);
                goBack();
              }}
              className={buttonClass({ variant: "primary", size: "xl" })}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}
