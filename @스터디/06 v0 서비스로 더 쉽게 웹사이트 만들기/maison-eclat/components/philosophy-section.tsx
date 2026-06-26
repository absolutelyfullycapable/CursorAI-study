import { Leaf, Scissors, HeartHandshake } from "lucide-react"

const values = [
  {
    icon: Leaf,
    title: "지속가능한 소재",
    desc: "유기농 코튼, 재생 울, 친환경 가공을 거친 소재만을 사용합니다. 환경에 대한 책임은 선택이 아닌 기본입니다.",
  },
  {
    icon: Scissors,
    title: "장인의 손길",
    desc: "30년 경력의 패턴사와 봉제 장인이 한 벌 한 벌 정성을 더합니다. 기계가 대신할 수 없는 디테일을 추구합니다.",
  },
  {
    icon: HeartHandshake,
    title: "정직한 가격",
    desc: "불필요한 유통 단계를 줄여, 합당한 가치를 합리적인 가격으로 전합니다. 좋은 옷은 누구나 누릴 수 있어야 합니다.",
  },
]

export function PhilosophySection() {
  return (
    <section
      id="philosophy"
      className="border-y border-border bg-secondary/50"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="max-w-2xl">
          <p className="font-display text-xs font-medium uppercase tracking-[0.32em] text-accent">
            Philosophy
          </p>
          <h2 className="mt-5 text-balance font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground lg:text-5xl">
            우리가 일하는 방식
          </h2>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {values.map((v) => (
            <div key={v.title}>
              <span className="flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                <v.icon className="size-6" />
              </span>
              <h3 className="mt-6 font-serif text-2xl font-semibold text-foreground">
                {v.title}
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
