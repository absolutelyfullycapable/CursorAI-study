"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/actions/posts";
import type { SupabaseClient } from "@supabase/supabase-js";

async function uploadCommentImage(
  supabase: SupabaseClient,
  userId: string,
  image: File,
): Promise<{ path?: string; error?: string }> {
  if (!image.type.startsWith("image/")) {
    return { error: "이미지 파일만 업로드할 수 있습니다." };
  }
  if (image.size > 5 * 1024 * 1024) {
    return { error: "이미지는 5MB 이하만 가능합니다." };
  }

  const ext = image.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${userId}/comments/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("post-images")
    .upload(path, image, { contentType: image.type, upsert: false });

  if (error) return { error: error.message };
  return { path };
}

export async function createComment(
  postId: string,
  parentId: string | null,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "로그인이 필요합니다." };

  const content = String(formData.get("content") ?? "").trim();
  const image = formData.get("image");
  const hasImage = image instanceof File && image.size > 0;

  if (!content && !hasImage) {
    return { error: "내용 또는 이미지를 입력해 주세요." };
  }

  let imagePath: string | null = null;
  if (hasImage && image instanceof File) {
    const uploaded = await uploadCommentImage(supabase, user.id, image);
    if (uploaded.error) return { error: uploaded.error };
    imagePath = uploaded.path ?? null;
  }

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    author_id: user.id,
    content,
    parent_id: parentId,
    image_path: imagePath,
  });

  if (error) {
    if (imagePath) {
      await supabase.storage.from("post-images").remove([imagePath]);
    }
    return { error: error.message };
  }

  revalidatePath(`/posts/${postId}`);
  return { success: parentId ? "답글이 등록되었습니다." : "댓글이 등록되었습니다." };
}

export async function updateComment(
  commentId: string,
  postId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "로그인이 필요합니다." };

  const content = String(formData.get("content") ?? "").trim();
  const image = formData.get("image");
  const removeImage = formData.get("remove_image") === "on";
  const hasImage = image instanceof File && image.size > 0;

  const { data: existing, error: fetchError } = await supabase
    .from("comments")
    .select("author_id, image_path")
    .eq("id", commentId)
    .single();

  if (fetchError || !existing) return { error: "댓글을 찾을 수 없습니다." };
  if (existing.author_id !== user.id) return { error: "수정 권한이 없습니다." };

  let imagePath = existing.image_path as string | null;

  if (removeImage && imagePath) {
    await supabase.storage.from("post-images").remove([imagePath]);
    imagePath = null;
  }

  if (hasImage && image instanceof File) {
    if (imagePath) {
      await supabase.storage.from("post-images").remove([imagePath]);
    }
    const uploaded = await uploadCommentImage(supabase, user.id, image);
    if (uploaded.error) return { error: uploaded.error };
    imagePath = uploaded.path ?? null;
  }

  if (!content && !imagePath) {
    return { error: "내용 또는 이미지를 입력해 주세요." };
  }

  const { error } = await supabase
    .from("comments")
    .update({ content, image_path: imagePath })
    .eq("id", commentId)
    .eq("author_id", user.id);

  if (error) return { error: error.message };

  revalidatePath(`/posts/${postId}`);
  return { success: "댓글이 수정되었습니다." };
}

export async function deleteComment(commentId: string, postId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data: existing } = await supabase
    .from("comments")
    .select("author_id, image_path")
    .eq("id", commentId)
    .single();

  if (!existing || existing.author_id !== user.id) return;

  // 자식 답글 이미지도 함께 정리
  const { data: children } = await supabase
    .from("comments")
    .select("image_path")
    .eq("parent_id", commentId);

  const paths = [
    existing.image_path,
    ...(children?.map((c) => c.image_path) ?? []),
  ].filter((p): p is string => Boolean(p));

  if (paths.length > 0) {
    await supabase.storage.from("post-images").remove(paths);
  }

  await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("author_id", user.id);

  revalidatePath(`/posts/${postId}`);
}
