"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/actions/posts";

export async function updateProfile(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "로그인이 필요합니다." };

  const username = String(formData.get("username") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();

  if (username.length < 2 || username.length > 30) {
    return { error: "닉네임은 2~30자로 입력해 주세요." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ username, bio })
    .eq("id", user.id);

  if (error) {
    if (error.code === "23505") {
      return { error: "이미 사용 중인 닉네임입니다." };
    }
    return { error: error.message };
  }

  revalidatePath("/me");
  revalidatePath("/");
  return { success: "프로필이 저장되었습니다." };
}
