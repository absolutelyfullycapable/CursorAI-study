const words = [
  "NEW SEASON 26",
  "지속가능한 소재",
  "MADE IN SEOUL",
  "타임리스 무드",
  "장인의 손길",
  "SUSTAINABLE STYLE",
]

export function BrandMarquee() {
  return (
    <section
      aria-label="브랜드 가치"
      className="border-y border-border bg-foreground py-5 text-background"
    >
      <div className="flex overflow-hidden">
        <div className="flex shrink-0 animate-[marquee_28s_linear_infinite] items-center gap-10 pr-10">
          {[...words, ...words].map((w, i) => (
            <span key={i} className="flex items-center gap-10 whitespace-nowrap">
              <span className="font-display text-base font-medium uppercase tracking-[0.18em] sm:text-lg">
                {w}
              </span>
              <span className="text-background/40">✦</span>
            </span>
          ))}
        </div>
        <div
          aria-hidden="true"
          className="flex shrink-0 animate-[marquee_28s_linear_infinite] items-center gap-10 pr-10"
        >
          {[...words, ...words].map((w, i) => (
            <span key={i} className="flex items-center gap-10 whitespace-nowrap">
              <span className="font-display text-base font-medium uppercase tracking-[0.18em] sm:text-lg">
                {w}
              </span>
              <span className="text-background/40">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
