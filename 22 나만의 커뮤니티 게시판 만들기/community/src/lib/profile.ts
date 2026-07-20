import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

/** 프로필이 없으면 메타데이터/이메일로 생성 (가입 트리거 누락 대비) */
export async function ensureProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: existing } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) return existing;

  const metaUsername = String(user.user_metadata?.username ?? "").trim();
  const emailName = user.email?.split("@")[0] ?? "";
  const username = (metaUsername || emailName || `user_${user.id.slice(0, 8)}`).slice(
    0,
    30,
  );

  const { data: created, error } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      username: username.length >= 2 ? username : `user_${user.id.slice(0, 8)}`,
      bio: "",
    })
    .select("*")
    .single();

  if (error) {
    // 동시 생성 등으로 이미 있으면 다시 조회
    const { data: again } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    return again;
  }

  return created;
}
