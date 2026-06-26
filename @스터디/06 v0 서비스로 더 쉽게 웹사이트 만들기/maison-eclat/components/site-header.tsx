"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"

const navItems = [
  { label: "브랜드", href: "/#story" },
  { label: "컬렉션", href: "/#collections" },
  { label: "철학", href: "/#philosophy" },
  { label: "아틀리에", href: "/#atelier" },
  { label: "문의", href: "/#contact" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <a
          href="/"
          className="font-display text-xl font-bold uppercase tracking-[0.12em] text-foreground"
        >
          MAISON ÉCLAT
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm tracking-wide text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <a
            href="/#contact"
            className="inline-flex items-center bg-foreground px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-background transition-opacity hover:opacity-90"
          >
            상담 예약
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          onClick={() => setOpen((v) => !v)}
          className="text-foreground md:hidden"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <nav className="flex flex-col px-6 py-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-border/40 py-3 text-sm tracking-wide text-foreground last:border-0"
              >
                {item.label}
              </a>
            ))}
            <a
              href="/#contact"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center justify-center bg-foreground px-5 py-3 text-sm font-medium uppercase tracking-wider text-background"
            >
              상담 예약
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
