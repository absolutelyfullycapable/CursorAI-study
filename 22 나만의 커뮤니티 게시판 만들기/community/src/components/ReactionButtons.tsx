"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleReaction } from "@/actions/reactions";
import type { ReactionType } from "@/lib/types";

export function ReactionButtons({
  postId,
  likeCount,
  dislikeCount,
  myReaction,
}: {
  postId: string;
  likeCount: number;
  dislikeCount: number;
  myReaction: ReactionType | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onReact(type: ReactionType) {
    startTransition(async () => {
      const result = await toggleReaction(postId, type);
      if (result?.error) {
        router.push("/login");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <button
        type="button"
        disabled={pending}
        onClick={() => onReact("like")}
        aria-pressed={myReaction === "like"}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold transition ${
          myReaction === "like"
            ? "bg-brand-soft text-brand ring-1 ring-brand/20"
            : "bg-surface-muted text-ink/80 hover:bg-[#e9ebef]"
        }`}
      >
        <ThumbUpIcon filled={myReaction === "like"} />
        좋아요
        <span className="tabular-nums">{likeCount}</span>
      </button>

      <button
        type="button"
        disabled={pending}
        onClick={() => onReact("dislike")}
        aria-pressed={myReaction === "dislike"}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold transition ${
          myReaction === "dislike"
            ? "bg-sky-50 text-sky-600 ring-1 ring-sky-200"
            : "bg-surface-muted text-ink/80 hover:bg-[#e9ebef]"
        }`}
      >
        <ThumbDownIcon filled={myReaction === "dislike"} />
        싫어요
        <span className="tabular-nums">{dislikeCount}</span>
      </button>
    </div>
  );
}

function ThumbUpIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path
        d="M7 22V11M2 13v7a2 2 0 0 0 2 2h11.2a2 2 0 0 0 1.94-1.5l2.1-7A2 2 0 0 0 17.28 11H14V5a3 3 0 0 0-3-3l-4 9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ThumbDownIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path
        d="M17 2v11M22 11V4a2 2 0 0 0-2-2H8.8a2 2 0 0 0-1.94 1.5l-2.1 7A2 2 0 0 0 6.72 13H10v6a3 3 0 0 0 3 3l4-9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
