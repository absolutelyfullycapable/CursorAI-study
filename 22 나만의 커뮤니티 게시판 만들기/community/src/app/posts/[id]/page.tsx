import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { LeftSidebar } from "@/components/LeftSidebar";
import { ReactionButtons } from "@/components/ReactionButtons";
import { CommentSection } from "@/components/CommentSection";
import { DeletePostButton } from "@/components/DeletePostButton";
import { fetchPostWithMeta } from "@/lib/posts";
import { createClient } from "@/lib/supabase/server";
import { formatRelativeTime, getPublicImageUrl } from "@/lib/utils";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await fetchPostWithMeta(id);
  if (!post) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: comments } = await supabase
    .from("comments")
    .select(
      "id, content, created_at, updated_at, author_id, parent_id, image_path, profiles(username)",
    )
    .eq("post_id", id)
    .order("created_at", { ascending: true });

  const imageUrl = getPublicImageUrl(post.image_path);
  const isOwner = user?.id === post.author_id;

  const normalizedComments =
    comments?.map((c) => ({
      ...c,
      parent_id: c.parent_id ?? null,
      image_path: c.image_path ?? null,
      profiles: Array.isArray(c.profiles) ? c.profiles[0] : c.profiles,
    })) ?? [];

  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto flex max-w-6xl items-start gap-5 px-4 py-5">
        <LeftSidebar />
        <main className="min-w-0 flex-1 animate-fade-up space-y-3">
          <article className="card p-5">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-[13px] text-muted">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-muted text-[11px] font-bold text-ink/70">
                {(post.profiles?.username ?? "?").slice(0, 1)}
              </span>
              <span className="font-semibold text-ink/75">
                u/{post.profiles?.username ?? "unknown"}
              </span>
              <span>·</span>
              <time dateTime={post.created_at}>
                {formatRelativeTime(post.created_at)}
              </time>
            </div>

            <h1 className="text-[24px] font-bold leading-snug tracking-tight text-ink sm:text-[28px]">
              {post.title}
            </h1>

            {post.content ? (
              <p className="mt-4 whitespace-pre-wrap text-[15px] leading-7 text-ink/90">
                {post.content}
              </p>
            ) : null}

            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt=""
                className="mt-5 max-h-[520px] w-full rounded-xl object-contain bg-surface-muted"
              />
            ) : null}

            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
              <ReactionButtons
                postId={post.id}
                likeCount={post.like_count}
                dislikeCount={post.dislike_count}
                myReaction={post.my_reaction}
              />
              {isOwner ? (
                <>
                  <Link
                    href={`/posts/${post.id}/edit`}
                    className="btn-ghost px-3 py-1.5 text-[13px]"
                  >
                    수정
                  </Link>
                  <DeletePostButton postId={post.id} />
                </>
              ) : null}
            </div>
          </article>

          <CommentSection
            postId={post.id}
            comments={normalizedComments}
            currentUserId={user?.id ?? null}
            isLoggedIn={Boolean(user)}
          />
        </main>
      </div>
    </div>
  );
}
