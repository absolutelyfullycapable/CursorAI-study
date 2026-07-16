"use client"

import { useState } from "react"

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <section id="contact" className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="font-display text-xs font-medium uppercase tracking-[0.32em] text-background/60">
              Newsletter
            </p>
            <h2 className="mt-5 text-balance font-serif text-4xl font-semibold leading-tight tracking-tight lg:text-5xl">
              새로운 컬렉션을 가장 먼저 만나보세요
            </h2>
            <p className="mt-6 max-w-md text-pretty leading-relaxed text-background/70">
              메종 에클라의 신상품 소식과 한정 컬렉션, 그리고 브랜드의
              이야기를 이메일로 전해드립니다.
            </p>
          </div>

          <div className="flex flex-col justify-center">
            {submitted ? (
              <div className="rounded-lg border border-background/20 bg-background/5 p-8 text-center">
                <p className="font-serif text-2xl font-semibold">감사합니다</p>
                <p className="mt-2 text-background/70">
                  메종 에클라의 소식을 곧 받아보실 수 있습니다.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setSubmitted(true)
                }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="name" className="sr-only">
                    이름
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="이름"
                    className="w-full border border-background/20 bg-background/5 px-4 py-3.5 text-background placeholder:text-background/50 focus:border-background focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">
                    이메일
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="이메일 주소"
                    className="w-full border border-background/20 bg-background/5 px-4 py-3.5 text-background placeholder:text-background/50 focus:border-background focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-background px-6 py-3.5 text-sm font-medium text-foreground transition-opacity hover:opacity-90"
                >
                  구독하기
                </button>
                <p className="text-xs text-background/50">
                  구독 시 개인정보 처리방침에 동의하는 것으로 간주됩니다.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
