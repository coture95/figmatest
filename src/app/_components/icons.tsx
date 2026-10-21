export function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-6 text-icon-default"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 5 L8 12 L15 19" />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-8 text-icon-on-dark"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12.5 L10 17.5 L19 7" />
    </svg>
  );
}

export function DoneMark() {
  return (
    <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-fill-primary">
      <CheckIcon />
    </div>
  );
}

export function Logo() {
  return (
    <svg
      viewBox="0 0 32 24"
      className="h-6 w-8 shrink-0 text-brand-primary"
      role="img"
      aria-label="로고"
    >
      <text x="0" y="19" fill="currentColor" fontWeight={700} fontSize={20}>
        U+
      </text>
    </svg>
  );
}
