import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/actions/auth";
import { SearchForm } from "@/components/SearchForm";

export async function Header({ query = "" }: { query?: string }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let username: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();
    username = profile?.username ?? null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[56px] max-w-6xl items-center gap-3 px-4">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-brand text-[13px] font-bold tracking-tight text-white transition group-hover:brightness-110">
            c
          </span>
          <span className="hidden text-[17px] font-bold tracking-tight text-ink sm:inline">
            community
          </span>
        </Link>

        <div className="mx-auto w-full max-w-lg">
          <SearchForm initialQuery={query} />
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {user ? (
            <>
              <Link
                href="/me"
                aria-label={username ? `내 정보 (${username})` : "내 정보"}
                className="inline-flex items-center gap-2 rounded-full px-2 py-1.5 text-[13px] font-semibold text-ink transition hover:bg-surface-muted"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-soft text-[12px] font-bold text-brand">
                  {(username ?? "?").slice(0, 1)}
                </span>
                <span>내 정보</span>
                {username ? (
                  <span className="hidden max-w-[5.5rem] truncate font-medium text-muted sm:inline">
                    {username}
                  </span>
                ) : null}
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="rounded-full px-3 py-1.5 text-[13px] font-semibold text-muted transition hover:bg-surface-muted hover:text-ink"
                >
                  로그아웃
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/signup"
                className="rounded-full px-3 py-1.5 text-[13px] font-semibold text-ink transition hover:bg-surface-muted"
              >
                가입
              </Link>
              <Link href="/login" className="btn-primary px-3.5 py-1.5 text-[13px]">
                로그인
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
