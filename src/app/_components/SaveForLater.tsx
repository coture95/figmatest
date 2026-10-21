"use client";

import { saveForLater } from "../_lib/saved";
import { buttonClass } from "./buttonStyle";

export default function SaveForLater({ planId }: { planId: string }) {
  return (
    <button
      type="button"
      onClick={() => saveForLater(planId)}
      className={buttonClass({ variant: "secondary", size: "xl" })}
    >
      나중에 다시 확인
    </button>
  );
}
