"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ReactionType } from "@/lib/types";

export async function toggleReaction(
  postId: string,
  reactionType: ReactionType,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "로그인이 필요합니다." };

  const { data: existing } = await supabase
    .from("post_reactions")
    .select("id, reaction_type")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing?.reaction_type === reactionType) {
    await supabase.from("post_reactions").delete().eq("id", existing.id);
  } else if (existing) {
    await supabase
      .from("post_reactions")
      .update({ reaction_type: reactionType })
      .eq("id", existing.id);
  } else {
    await supabase.from("post_reactions").insert({
      post_id: postId,
      user_id: user.id,
      reaction_type: reactionType,
    });
  }

  revalidatePath("/");
  revalidatePath(`/posts/${postId}`);
  return { success: true };
}
