"use client";

import { useActionState } from "react";
import { updateProfile } from "@/actions/profile";
import type { Profile } from "@/lib/types";

export function ProfileForm({ profile, email }: { profile: Profile; email: string }) {
  const [state, formAction, pending] = useActionState(updateProfile, {});

  return (
    <form action={formAction} className="card space-y-4 p-5 sm:p-6">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-brand-soft text-[18px] font-bold text-brand">
          {profile.username.slice(0, 1)}
        </span>
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-ink">내 정보</h1>
          <p className="text-[13px] text-muted">프로필을 업데이트해 보세요</p>
        </div>
      </div>

      {state.error ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-[13px] text-red-600">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="rounded-xl bg-emerald-50 px-3 py-2 text-[13px] text-emerald-700">
          {state.success}
        </p>
      ) : null}

      <div>
        <label className="mb-1.5 block text-[13px] font-semibold text-ink">이메일</label>
        <p className="rounded-xl bg-surface-muted px-3 py-2.5 text-[13px] text-muted">{email}</p>
      </div>

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
          defaultValue={profile.username}
          className="input-field"
        />
      </div>

      <div>
        <label htmlFor="bio" className="mb-1.5 block text-[13px] font-semibold text-ink">
          소개
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          defaultValue={profile.bio ?? ""}
          className="input-field resize-y"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="btn-primary px-5 py-2 text-[13px] disabled:opacity-60"
      >
        {pending ? "저장 중..." : "저장"}
      </button>
    </form>
  );
}
