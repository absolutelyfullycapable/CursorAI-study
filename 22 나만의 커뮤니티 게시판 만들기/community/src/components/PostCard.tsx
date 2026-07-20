import Link from "next/link";
import { formatRelativeTime, getPublicImageUrl } from "@/lib/utils";
import type { PostWithMeta } from "@/lib/types";
import { ReactionButtons } from "@/components/ReactionButtons";

export function PostCard({ post }: { post: PostWithMeta }) {
  const imageUrl = getPublicImageUrl(post.image_path);

  return (
    <article className="card card-hover p-4">
      <div className="mb-1.5 flex flex-wrap items-center gap-1.5 text-[12px] text-muted">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-surface-muted text-[10px] font-bold text-ink/70">
          {(post.profiles?.username ?? "?").slice(0, 1)}
        </span>
        <span className="font-semibold text-ink/70">
          u/{post.profiles?.username ?? "unknown"}
        </span>
        <span className="text-border">·</span>
        <time dateTime={post.created_at}>{formatRelativeTime(post.created_at)}</time>
      </div>

      <Link href={`/posts/${post.id}`} className="block">
        <h2 className="text-[16px] font-bold leading-snug tracking-tight text-ink transition hover:text-brand">
          {post.title}
        </h2>
        {post.content ? (
          <p className="mt-1.5 line-clamp-2 whitespace-pre-wrap text-[13px] leading-relaxed text-muted">
            {post.content}
          </p>
        ) : null}
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            className="mt-3 max-h-72 w-full rounded-xl object-cover"
          />
        ) : null}
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <ReactionButtons
          postId={post.id}
          likeCount={post.like_count}
          dislikeCount={post.dislike_count}
          myReaction={post.my_reaction}
        />
        <Link
          href={`/posts/${post.id}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1.5 text-[13px] font-semibold text-ink/80 transition hover:bg-[#e9ebef]"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H8l-4 3v-4.2A8.5 8.5 0 1 1 21 11.5Z" />
          </svg>
          댓글 {post.comment_count}
        </Link>
      </div>
    </article>
  );
}
