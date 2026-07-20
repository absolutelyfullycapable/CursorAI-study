"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = {
  error?: string;
  success?: string;
};

export async function signUp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const username = String(formData.get("username") ?? "").trim();

  if (!email || !password || !username) {
    return { error: "모든 항목을 입력해 주세요." };
  }
  if (username.length < 2 || username.length > 30) {
    return { error: "닉네임은 2~30자로 입력해 주세요." };
  }
  if (password.length < 6) {
    return { error: "비밀번호는 6자 이상이어야 합니다." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });

  if (error) return { error: error.message };

  if (data.user) {
    await supabase.from("profiles").upsert(
      {
        id: data.user.id,
        username,
        bio: "",
      },
      { onConflict: "id" },
    );
  }

  redirect("/");
}

export async function signIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "이메일과 비밀번호를 입력해 주세요." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { error: error.message };

  if (data.user) {
    const metaUsername = String(data.user.user_metadata?.username ?? "").trim();
    const fallback =
      metaUsername ||
      data.user.email?.split("@")[0] ||
      `user_${data.user.id.slice(0, 8)}`;

    await supabase.from("profiles").upsert(
      {
        id: data.user.id,
        username: fallback.slice(0, 30),
        bio: "",
      },
      { onConflict: "id", ignoreDuplicates: true },
    );
  }

  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
