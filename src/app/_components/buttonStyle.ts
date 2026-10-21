type ButtonStyleOptions = {
  variant: "primary" | "secondary";
  size: "sm" | "xl";
  disabled?: boolean;
};

export function buttonClass({ variant, size, disabled = false }: ButtonStyleOptions): string {
  const base = "inline-flex items-center justify-center rounded-lg px-6 text-body";
  const sizing = size === "xl" ? "h-13 w-full py-4" : "h-10.5 shrink-0 py-2";

  if (disabled) {
    return `${base} ${sizing} cursor-not-allowed bg-fill-disabled font-medium text-text-on-disabled`;
  }
  if (variant === "primary") {
    return `${base} ${sizing} bg-fill-primary font-semibold text-text-on-dark hover:bg-fill-primary-hover`;
  }
  return `${base} ${sizing} border border-border-default bg-surface-default font-semibold text-text-primary hover:bg-bg-subtle`;
}
