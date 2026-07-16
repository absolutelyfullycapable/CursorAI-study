import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "채용 — MAISON ÉCLAT",
  description:
    "메종 에클라와 함께할 머천다이저(MD)를 찾습니다. 담당 업무와 자격 요건을 확인하세요.",
}

const responsibilities = [
  "시즌별 상품 기획 및 라인업(상품 구성) 설계",
  "판매·재고 데이터 분석 기반의 물량 및 운영 관리",
  "협력 공방·협력사와의 생산 일정, 원가 관리",
  "트렌드·시장 조사와 신상품 소싱",
  "온라인·오프라인 채널의 상품 운영 및 성과 관리",
]

const requirements = [
  "패션·리테일 MD 경력 3년 이상",
  "엑셀 등 데이터 분석 도구 활용 능숙",
  "상품 기획부터 운영까지 전반에 대한 이해",
  "유관 부서와의 원활한 커뮤니케이션 및 협업 능력",
]

const preferred = [
  "컨템포러리·디자이너 브랜드 근무 경험",
  "지속가능 패션 및 소재에 대한 이해",
  "생산 공방과의 협업 경험",
  "영어 또는 기타 외국어 활용 가능",
]

const benefits = [
  "정규직 (수습 3개월), 주 5일 근무",
  "서울 성수동 아틀리에 근무",
  "자사 제품 구매 지원",
  "교육비 및 도서 구입비 지원",
]

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          홈으로 돌아가기
        </Link>

        <div className="mt-10 max-w-3xl">
          <p className="font-display text-xs font-medium uppercase tracking-[0.32em] text-muted-foreground">
            Careers
          </p>
          <h1 className="mt-5 text-balance break-keep font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground lg:text-6xl">
            함께 만들 사람을 찾습니다
          </h1>
          <p className="mt-6 text-pretty leading-relaxed text-muted-foreground lg:text-lg">
            메종 에클라는 오래 입을수록 멋있어지는 옷을 만듭니다. 그 가치를
            상품으로 완성해 줄 머천다이저(MD)를 찾고 있습니다.
          </p>
        </div>

        <section className="mt-16 border-t border-border pt-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-display text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Position
              </p>
              <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-foreground lg:text-4xl">
                머천다이저 (MD)
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              정규직 · 서울 성수동 아틀리에
            </p>
          </div>

          <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h3 className="font-serif text-xl font-semibold text-foreground">
                담당 업무
              </h3>
              <ul className="mt-5 space-y-3">
                {responsibilities.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-pretty leading-relaxed text-muted-foreground"
                  >
                    <span className="mt-2 size-1.5 shrink-0 bg-foreground" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-xl font-semibold text-foreground">
                자격 요건 <span className="text-muted-foreground">(필수)</span>
              </h3>
              <ul className="mt-5 space-y-3">
                {requirements.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-pretty leading-relaxed text-muted-foreground"
                  >
                    <span className="mt-2 size-1.5 shrink-0 bg-foreground" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-xl font-semibold text-foreground">
                우대 사항
              </h3>
              <ul className="mt-5 space-y-3">
                {preferred.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-pretty leading-relaxed text-muted-foreground"
                  >
                    <span className="mt-2 size-1.5 shrink-0 bg-border" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-xl font-semibold text-foreground">
                근무 조건 &amp; 혜택
              </h3>
              <ul className="mt-5 space-y-3">
                {benefits.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-pretty leading-relaxed text-muted-foreground"
                  >
                    <span className="mt-2 size-1.5 shrink-0 bg-border" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-16 border border-foreground bg-foreground p-8 text-background lg:p-12">
          <h3 className="font-serif text-2xl font-semibold lg:text-3xl">
            지원 방법
          </h3>
          <p className="mt-4 max-w-xl text-pretty leading-relaxed text-background/70">
            이력서와 포트폴리오를 이메일로 보내주세요. 서류 검토 후 개별적으로
            연락드리며, 면접은 1~2회에 걸쳐 진행됩니다.
          </p>
          <a
            href="mailto:careers@maisoneclat.example?subject=[지원] 머천다이저(MD) 포지션"
            className="mt-8 inline-flex items-center gap-2 bg-background px-8 py-4 text-sm font-medium uppercase tracking-wider text-foreground transition-opacity hover:opacity-90"
          >
            지원하기
            <ArrowUpRight className="size-4" />
          </a>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
