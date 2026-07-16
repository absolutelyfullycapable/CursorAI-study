"use client"

import { useActionState, useState } from "react"
import { useFormStatus } from "react-dom"
import { Sun } from "lucide-react"
import { login, signup, type AuthState } from "@/app/actions/auth"
import { cn } from "@/lib/utils"

type Mode = "login" | "signup"

const initialState: AuthState = {}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 w-full rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "처리 중..." : label}
    </button>
  )
}

export function AuthForm() {
  const [mode, setMode] = useState<Mode>("login")
  const action = mode === "login" ? login : signup
  const [state, formAction] = useActionState(action, initialState)

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <Sun className="h-7 w-7" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-foreground">
              햇살 메모
            </h1>
            <p className="mt-1 text-sm font-semibold text-muted-foreground">
              {mode === "login"
                ? "다시 오신 것을 환영해요!"
                : "지금 가입하고 메모를 시작하세요."}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-full bg-secondary p-1">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={cn(
                  "rounded-full py-2 text-sm font-bold transition-colors",
                  mode === m
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {m === "login" ? "로그인" : "회원가입"}
              </button>
            ))}
          </div>

          <form action={formAction} className="flex flex-col gap-3">
            {mode === "signup" && (
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="name"
                  className="text-xs font-bold text-foreground/70"
                >
                  이름
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="홍길동"
                  className="w-full rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-ring/40"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-xs font-bold text-foreground/70"
              >
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-ring/40"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-xs font-bold text-foreground/70"
              >
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                placeholder={
                  mode === "login" ? "비밀번호" : "6자 이상 입력하세요"
                }
                className="w-full rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-ring/40"
              />
            </div>

            {state.error && (
              <p className="rounded-xl bg-destructive/10 px-4 py-2.5 text-sm font-semibold text-destructive">
                {state.error}
              </p>
            )}

            <SubmitButton label={mode === "login" ? "로그인" : "회원가입"} />
          </form>
        </div>
      </div>
    </div>
  )
}
