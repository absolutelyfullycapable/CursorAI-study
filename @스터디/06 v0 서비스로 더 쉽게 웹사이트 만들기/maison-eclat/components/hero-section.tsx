import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { heroFashion } from "@/app/site-images"

export function HeroSection() {
  return (
    <section id="top" className="mx-auto max-w-7xl px-6 pt-12 pb-16 lg:px-10 lg:pt-20">
      <p className="mb-6 text-center font-display text-xs font-medium uppercase tracking-[0.35em] text-muted-foreground">
        Est. 2009 — Seoul
      </p>
      <h1 className="mx-auto max-w-5xl break-keep text-center font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-8xl">
        오래 입을수록
        <br />
        <span className="box-decoration-clone bg-foreground px-3 leading-tight text-background">
          멋있어지는
        </span>{' '}
        옷
      </h1>
      <p className="mx-auto mt-8 max-w-2xl text-pretty text-center text-base leading-relaxed text-muted-foreground lg:text-lg">
        빠르게 사라지는 유행 대신, 매일 손이 가는 옷을 만듭니다. 정직한
        소재와 깊이 있는 디자인으로 완성하는 라이프스타일 패션 하우스.
      </p>

      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="#collections"
          className="inline-flex items-center gap-2 bg-foreground px-8 py-4 text-sm font-medium uppercase tracking-wider text-background transition-opacity hover:opacity-90"
        >
          신상 컬렉션 보기
          <ArrowRight className="size-4" />
        </a>
        <a
          href="#story"
          className="inline-flex items-center gap-2 border border-foreground px-8 py-4 text-sm font-medium uppercase tracking-wider text-foreground transition-colors hover:bg-foreground hover:text-background"
        >
          브랜드 스토리
        </a>
      </div>

      <div className="relative mt-16 overflow-hidden rounded-lg">
        <Image
          src={heroFashion}
          alt="메종 에클라의 시그니처 컬렉션을 착용한 모델"
          width={1600}
          height={900}
          priority
          unoptimized
          className="h-[420px] w-full object-cover object-top sm:h-[560px] lg:h-[680px]"
        />
      </div>
    </section>
  )
}
