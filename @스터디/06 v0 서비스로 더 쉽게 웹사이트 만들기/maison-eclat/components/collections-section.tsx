import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import {
  collectionWomen,
  collectionMen,
  collectionAccessories,
} from "@/app/site-images"

const collections = [
  {
    title: "우먼",
    count: "124 PRODUCTS",
    desc: "절제된 실루엣과 부드러운 소재의 우먼 컬렉션",
    image: collectionWomen,
  },
  {
    title: "맨",
    count: "98 PRODUCTS",
    desc: "정제된 테일러링으로 완성한 맨 컬렉션",
    image: collectionMen,
  },
  {
    title: "액세서리",
    count: "76 PRODUCTS",
    desc: "차림을 완성하는 가죽 소품과 액세서리",
    image: collectionAccessories,
  },
]

export function CollectionsSection() {
  return (
    <section id="collections" className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="font-display text-xs font-medium uppercase tracking-[0.32em] text-accent">
            Collections
          </p>
          <h2 className="mt-5 text-balance font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground lg:text-5xl">
            계절을 담은 컬렉션
          </h2>
        </div>
        <a
          href="#contact"
          className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          전체 컬렉션 보기 →
        </a>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {collections.map((c) => (
          <a
            key={c.title}
            href="#collections"
            className="group block"
          >
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src={c.image}
                alt={`${c.title} 컬렉션`}
                width={600}
                height={750}
                unoptimized
                className="h-[360px] w-full object-cover transition-transform duration-700 group-hover:scale-105 lg:h-[440px]"
              />
              <span className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-background/90 text-foreground transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <ArrowUpRight className="size-5" />
              </span>
            </div>
            <div className="mt-5">
              <p className="font-display text-xs tracking-[0.2em] text-muted-foreground">
                {c.count}
              </p>
              <h3 className="mt-2 font-serif text-2xl font-semibold text-foreground">
                {c.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
