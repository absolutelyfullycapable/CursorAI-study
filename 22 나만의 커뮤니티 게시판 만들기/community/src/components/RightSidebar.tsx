import Link from "next/link";

export function RightSidebar({
  postCount,
  memberCount,
}: {
  postCount: number;
  memberCount: number;
}) {
  return (
    <aside className="hidden w-[280px] shrink-0 self-start xl:block">
      <div className="sticky top-[72px] overflow-hidden rounded-[14px] border border-border bg-surface">
        <div className="h-1.5 bg-brand" />
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-brand-soft text-[15px] font-bold text-brand">
              c
            </div>
            <div>
              <h2 className="text-[15px] font-bold tracking-tight text-ink">
                r/community
              </h2>
              <p className="text-[12px] text-muted">열린 이야기 공간</p>
            </div>
          </div>

          <p className="mt-3 text-[13px] leading-relaxed text-muted">
            글을 쓰고, 반응하고, 댓글로 의견을 나눠 보세요.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-surface-muted px-3 py-2.5">
              <p className="text-[16px] font-bold tabular-nums tracking-tight text-ink">
                {memberCount}
              </p>
              <p className="text-[11px] font-medium text-muted">멤버</p>
            </div>
            <div className="rounded-xl bg-surface-muted px-3 py-2.5">
              <p className="text-[16px] font-bold tabular-nums tracking-tight text-ink">
                {postCount}
              </p>
              <p className="text-[11px] font-medium text-muted">게시글</p>
            </div>
          </div>

          <Link
            href="/posts/new"
            className="btn-primary mt-4 flex w-full items-center justify-center py-2.5 text-[13px]"
          >
            게시물 만들기
          </Link>
        </div>
      </div>
    </aside>
  );
}
