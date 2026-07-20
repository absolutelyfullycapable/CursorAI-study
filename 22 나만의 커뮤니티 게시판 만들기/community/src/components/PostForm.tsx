"use client";

import { useActionState } from "react";
import type { ActionState } from "@/actions/posts";
import { getPublicImageUrl } from "@/lib/utils";

type PostFormProps = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  initialTitle?: string;
  initialContent?: string;
  initialImagePath?: string | null;
  submitLabel: string;
  showRemoveImage?: boolean;
};

export function PostForm({
  action,
  initialTitle = "",
  initialContent = "",
  initialImagePath = null,
  submitLabel,
  showRemoveImage = false,
}: PostFormProps) {
  const [state, formAction, pending] = useActionState(action, {} as ActionState);
  const currentImage = getPublicImageUrl(initialImagePath);

  return (
    <form action={formAction} className="card space-y-4 p-5">
      {state.error ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-[13px] text-red-600">{state.error}</p>
      ) : null}

      <div>
        <label htmlFor="title" className="mb-1.5 block text-[13px] font-semibold text-ink">
          제목
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={initialTitle}
          maxLength={200}
          className="input-field"
        />
      </div>

      <div>
        <label htmlFor="content" className="mb-1.5 block text-[13px] font-semibold text-ink">
          내용
        </label>
        <textarea
          id="content"
          name="content"
          rows={8}
          defaultValue={initialContent}
          className="input-field resize-y"
        />
      </div>

      <div>
        <label htmlFor="image" className="mb-1.5 block text-[13px] font-semibold text-ink">
          이미지 첨부 (선택, 5MB 이하)
        </label>
        {currentImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={currentImage}
            alt="현재 첨부 이미지"
            className="mb-2 max-h-48 rounded-xl object-cover"
          />
        ) : null}
        <input
          id="image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="block w-full text-[13px] text-muted file:mr-3 file:rounded-full file:border-0 file:bg-surface-muted file:px-3 file:py-1.5 file:text-[13px] file:font-semibold file:text-ink"
        />
        {showRemoveImage && currentImage ? (
          <label className="mt-2 flex items-center gap-2 text-[13px] text-muted">
            <input type="checkbox" name="remove_image" />
            기존 이미지 삭제
          </label>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="btn-primary px-5 py-2 text-[13px] disabled:opacity-60"
      >
        {pending ? "저장 중..." : submitLabel}
      </button>
    </form>
  );
}
