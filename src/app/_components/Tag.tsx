import type { ReactNode } from "react";

export default function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex w-fit items-center rounded-pill bg-border-subtle px-3 py-1 text-caption font-bold text-text-secondary">
      {children}
    </span>
  );
}
