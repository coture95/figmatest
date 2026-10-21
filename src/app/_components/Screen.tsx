import type { ReactNode } from "react";

type ScreenProps = {
  header: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
};

export default function Screen({ header, footer, children }: ScreenProps) {
  return (
    <div className="mx-auto flex h-dvh w-full max-w-mobile flex-col bg-bg-surface">
      {header}
      <main className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">{children}</main>
      {footer}
    </div>
  );
}
