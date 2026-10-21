"use client";

import { useState } from "react";
import { buttonClass } from "./buttonStyle";

export default function ConsultRequest() {
  const [requested, setRequested] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      {requested && (
        <p role="status" className="text-body-small font-medium text-text-secondary">
          상담 요청이 접수되었어요
        </p>
      )}
      <button
        type="button"
        disabled={requested}
        onClick={() => setRequested(true)}
        className={buttonClass({ variant: "secondary", size: "xl", disabled: requested })}
      >
        상담 요청
      </button>
    </div>
  );
}
