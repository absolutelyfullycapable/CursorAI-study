import Link from "next/link"

const columns = [
  {
    title: "쇼핑",
    links: [
      { label: "우먼", href: "#" },
      { label: "맨", href: "#" },
      { label: "액세서리", href: "#" },
      { label: "신상품", href: "#" },
      { label: "베스트셀러", href: "#" },
    ],
  },
  {
    title: "브랜드",
    links: [
      { label: "브랜드 스토리", href: "/#story" },
      { label: "아틀리에", href: "/#atelier" },
      { label: "지속가능성", href: "/#philosophy" },
      { label: "채용", href: "/careers" },
      { label: "프레스", href: "#" },
    ],
  },
  {
    title: "고객 지원",
    links: [
      { label: "배송 안내", href: "#" },
      { label: "교환 및 반품", href: "#" },
      { label: "사이즈 가이드", href: "#" },
      { label: "자주 묻는 질문", href: "#" },
      { label: "매장 찾기", href: "#" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-display text-xl font-bold uppercase tracking-[0.12em] text-foreground">
              MAISON ÉCLAT
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              오래 입을수록 멋있어지는 옷. 서울에서 시작된 라이프스타일 패션
              하우스입니다.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <h3 className="text-sm font-medium text-foreground">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-2">
            <h3 className="text-sm font-medium text-foreground">팔로우</h3>
            <ul className="mt-4 space-y-3">
              {["Instagram", "YouTube", "Pinterest"].map((s) => (
                <li key={s}>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} MAISON ÉCLAT. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground">
              이용약관
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground">
              개인정보 처리방침
            </a>
          </div>
        </div>
      </div>

      <div className="overflow-hidden border-t border-border">
        <p className="select-none whitespace-nowrap py-6 text-center font-display text-[18vw] font-bold uppercase leading-none tracking-tight text-secondary lg:text-[14vw]">
          MAISON ÉCLAT
        </p>
      </div>
    </footer>
  )
}
