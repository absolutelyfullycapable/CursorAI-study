const stats = [
  { value: "2009", label: "설립 연도" },
  { value: "48", label: "전국 매장 수" },
  { value: "1.2M", label: "누적 고객" },
  { value: "92%", label: "재구매율" },
]

export function StorySection() {
  return (
    <section id="story" className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="font-display text-xs font-medium uppercase tracking-[0.32em] text-accent">
            Our Story
          </p>
          <h2 className="mt-5 text-balance font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground lg:text-5xl">
            한 벌의 옷에 담는 진심
          </h2>
        </div>
        <div className="space-y-6 lg:col-span-7">
          <p className="text-pretty text-lg leading-relaxed text-foreground/90">
            메종 에클라는 2009년 서울의 작은 공방에서 시작되었습니다. 빠르게
            소비되고 버려지는 옷이 아니라, 오래 입을수록 빛나는 옷을 만들고
            싶었습니다.
          </p>
          <p className="text-pretty leading-relaxed text-muted-foreground">
            우리는 한 벌의 옷이 누군가의 하루를, 그리고 그 사람의 태도를
            바꿀 수 있다고 믿습니다. 그래서 소재 하나, 바느질 한 땀까지
            타협하지 않습니다. 자연에서 온 정직한 소재와 숙련된 장인의
            손길이 만나, 시간이 지나도 변하지 않는 가치를 완성합니다.
          </p>
        </div>
      </div>

      <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-background p-6 lg:p-8">
            <dt className="font-display text-4xl font-semibold tracking-tight text-foreground lg:text-5xl">
              {s.value}
            </dt>
            <dd className="mt-2 text-sm text-muted-foreground">{s.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
