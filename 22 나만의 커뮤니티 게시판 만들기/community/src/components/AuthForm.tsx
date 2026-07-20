"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { AuthState } from "@/actions/auth";

export function AuthForm({
  action,
  mode,
}: {
  action: (prev: AuthState, formData: FormData) => Promise<AuthState>;
  mode: "login" | "signup";
}) {
  const [state, formAction, pending] = useActionState(action, {} as AuthState);

  return (
    <form action={formAction} className="card mx-auto w-full max-w-[400px] space-y-4 p-6 sm:p-7">
      <div className="space-y-1.5">
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-[10px] bg-brand text-[13px] font-bold text-white">
          c
        </div>
        <h1 className="text-[22px] font-bold tracking-tight text-ink">
          {mode === "login" ? "로그인" : "회원가입"}
        </h1>
        <p className="text-[13px] text-muted">
          {mode === "login"
            ? "커뮤니티에서 이어갈 이야기를 위해 로그인하세요."
            : "닉네임만 정하면 바로 시작할 수 있어요."}
        </p>
      </div>

      {state.error ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-[13px] text-red-600">{state.error}</p>
      ) : null}

      {mode === "signup" ? (
        <div>
          <label htmlFor="username" className="mb-1.5 block text-[13px] font-semibold text-ink">
            닉네임
          </label>
          <input
            id="username"
            name="username"
            required
            minLength={2}
            maxLength={30}
            className="input-field"
          />
        </div>
      ) : null}

      <div>
        <label htmlFor="email" className="mb-1.5 block text-[13px] font-semibold text-ink">
          이메일
        </label>
        <input id="email" name="email" type="email" required className="input-field" />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-[13px] font-semibold text-ink">
          비밀번호
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          className="input-field"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full py-2.5 text-[14px] disabled:opacity-60"
      >
        {pending ? "처리 중..." : mode === "login" ? "로그인" : "가입하기"}
      </button>

      <p className="text-center text-[13px] text-muted">
        {mode === "login" ? (
          <>
            계정이 없나요?{" "}
            <Link href="/signup" className="font-semibold text-brand hover:underline">
              회원가입
            </Link>
          </>
        ) : (
          <>
            이미 계정이 있나요?{" "}
            <Link href="/login" className="font-semibold text-brand hover:underline">
              로그인
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
