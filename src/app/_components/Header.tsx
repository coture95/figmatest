import Link from "next/link";
import { ArrowLeftIcon, Logo } from "./icons";

type HeaderProps =
  | { type: "root"; title: string }
  | { type: "default"; title: string; backHref: string };

export default function Header(props: HeaderProps) {
  if (props.type === "root") {
    return (
      <header className="flex h-14 shrink-0 items-center gap-3 bg-bg-surface px-4 py-1">
        <h1 className="flex-1 text-heading-h4 font-bold text-text-primary">{props.title}</h1>
        <Logo />
      </header>
    );
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 bg-bg-surface px-4 py-1">
      <Link href={props.backHref} aria-label="뒤로 가기" className="flex size-6 shrink-0">
        <ArrowLeftIcon />
      </Link>
      <h1 className="flex-1 text-center text-subtitle font-semibold text-text-primary">
        {props.title}
      </h1>
      <div className="size-6 shrink-0" aria-hidden="true" />
    </header>
  );
}
