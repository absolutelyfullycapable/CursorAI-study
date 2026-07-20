import { Header } from "@/components/Header";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { PostCard } from "@/components/PostCard";
import { fetchPostsWithMeta } from "@/lib/posts";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const posts = await fetchPostsWithMeta(query || undefined);

  const supabase = await createClient();
  const [{ count: memberCount }, { count: postCount }] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("posts").select("*", { count: "exact", head: true }),
  ]);

  return (
    <div className="min-h-screen">
      <Header query={query} />
      <div className="mx-auto flex max-w-6xl items-start gap-5 px-4 py-5">
        <LeftSidebar />
        <main className="min-w-0 flex-1 space-y-2.5">
          <section className="animate-fade-up card px-4 py-4 sm:px-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-brand text-[18px] font-bold text-white">
                  c
                </div>
                <div>
                  <h1 className="text-[20px] font-bold tracking-tight text-ink">
                    r/community
                  </h1>
                  <p className="text-[13px] text-muted">
                    {query ? `"${query}" 검색 결과` : "오늘의 이야기를 나눠 보세요"}
                  </p>
                </div>
              </div>
              <Link
                href="/posts/new"
                className="btn-primary hidden px-3.5 py-2 text-[13px] sm:inline-flex"
              >
                글 쓰기
              </Link>
            </div>
          </section>

          {posts.length === 0 ? (
            <div className="card px-6 py-14 text-center">
              <p className="text-[14px] text-muted">
                {query
                  ? "검색 결과가 없습니다."
                  : "아직 게시글이 없습니다. 첫 글을 작성해 보세요!"}
              </p>
              {!query ? (
                <Link
                  href="/posts/new"
                  className="btn-primary mt-4 inline-flex px-4 py-2 text-[13px]"
                >
                  첫 글 작성하기
                </Link>
              ) : null}
            </div>
          ) : (
            posts.map((post, index) => (
              <div
                key={post.id}
                className="animate-fade-up"
                style={{ animationDelay: `${Math.min(index, 5) * 35}ms` }}
              >
                <PostCard post={post} />
              </div>
            ))
          )}
        </main>
        <RightSidebar
          memberCount={memberCount ?? 0}
          postCount={postCount ?? 0}
        />
      </div>
    </div>
  );
}
