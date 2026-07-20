"use client";

import { useTransition } from "react";
import { deletePost } from "@/actions/posts";

export function DeletePostButton({ postId }: { postId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm("글을 삭제할까요?")) return;
        startTransition(async () => {
          await deletePost(postId);
        });
      }}
      className="rounded-full bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
    >
      {pending ? "삭제 중..." : "삭제"}
    </button>
  );
}
