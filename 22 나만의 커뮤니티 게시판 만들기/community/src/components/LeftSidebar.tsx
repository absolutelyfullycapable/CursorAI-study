"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "홈", icon: HomeIcon },
  { href: "/posts/new", label: "글 쓰기", icon: WriteIcon },
  { href: "/me", label: "내 정보", icon: UserIcon },
];

export function LeftSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[200px] shrink-0 self-start lg:block">
      <nav className="sticky top-[72px] flex flex-col gap-0.5">
        {links.map((link) => {
          const active =
            link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[14px] font-semibold tracking-tight transition ${
                active
                  ? "bg-white text-brand shadow-sm ring-1 ring-border"
                  : "text-muted hover:bg-white/70 hover:text-ink"
              }`}
            >
              <Icon active={active} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`h-4 w-4 ${active ? "text-brand" : "text-current"}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
    </svg>
  );
}

function WriteIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`h-4 w-4 ${active ? "text-brand" : "text-current"}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M12 20h9" strokeLinecap="round" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" />
    </svg>
  );
}

function UserIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`h-4 w-4 ${active ? "text-brand" : "text-current"}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 19.5c1.8-3 4.2-4.5 7-4.5s5.2 1.5 7 4.5" strokeLinecap="round" />
    </svg>
  );
}
