import Image from "next/image"
import { atelier } from "@/app/site-images"

export function AtelierSection() {
  return (
    <section id="atelier" className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative overflow-hidden rounded-lg">
          <Image
            src={atelier}
            alt="메종 에클라 아틀리에에서 작업 중인 장인"
            width={800}
            height={900}
            unoptimized
            className="h-[400px] w-full object-cover lg:h-[560px]"
          />
        </div>

        <div>
          <p className="font-display text-xs font-medium uppercase tracking-[0.32em] text-accent">
            The Atelier
          </p>
          <h2 className="mt-5 text-balance font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground lg:text-5xl">
            서울 성수동, 우리의 아틀리에
          </h2>
          <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
            모든 메종 에클라의 옷은 성수동 아틀리에에서 태어납니다. 원단을
            고르는 순간부터 마지막 단추를 다는 순간까지, 우리의 장인들은
            한 벌의 옷을 작품처럼 다룹니다.
          </p>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            우리는 빠른 생산보다 올바른 생산을 택합니다. 그것이 오래
            입을 수 있는 옷, 그리고 더 나은 내일을 위한 길이라 믿습니다.
          </p>

          <blockquote className="mt-10 border-l-2 border-accent pl-6">
            <p className="font-serif text-xl font-medium leading-relaxed text-foreground lg:text-2xl">
              “좋은 옷은 결국 사람을 향합니다. 우리는 입는 사람을 먼저
              생각합니다.”
            </p>
            <footer className="mt-4 text-sm text-muted-foreground">
              이서윤 · 크리에이티브 디렉터
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  )
}
