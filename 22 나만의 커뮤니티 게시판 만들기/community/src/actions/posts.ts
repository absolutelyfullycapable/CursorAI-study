"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ActionState = {
  error?: string;
  success?: string;
};

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null as null };
  return { supabase, user };
}

export async function createPost(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "로그인이 필요합니다." };

  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const image = formData.get("image");

  if (!title) return { error: "제목을 입력해 주세요." };

  let imagePath: string | null = null;

  if (image instanceof File && image.size > 0) {
    if (!image.type.startsWith("image/")) {
      return { error: "이미지 파일만 업로드할 수 있습니다." };
    }
    if (image.size > 5 * 1024 * 1024) {
      return { error: "이미지는 5MB 이하만 가능합니다." };
    }

    const ext = image.name.split(".").pop()?.toLowerCase() || "jpg";
    imagePath = `${user.id}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(imagePath, image, { contentType: image.type, upsert: false });

    if (uploadError) return { error: uploadError.message };
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({
      author_id: user.id,
      title,
      content,
      image_path: imagePath,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/");
  redirect(`/posts/${data.id}`);
}

export async function updatePost(
  postId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "로그인이 필요합니다." };

  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const image = formData.get("image");
  const removeImage = formData.get("remove_image") === "on";

  if (!title) return { error: "제목을 입력해 주세요." };

  const { data: existing, error: fetchError } = await supabase
    .from("posts")
    .select("author_id, image_path")
    .eq("id", postId)
    .single();

  if (fetchError || !existing) return { error: "글을 찾을 수 없습니다." };
  if (existing.author_id !== user.id) return { error: "수정 권한이 없습니다." };

  let imagePath = existing.image_path as string | null;

  if (removeImage && imagePath) {
    await supabase.storage.from("post-images").remove([imagePath]);
    imagePath = null;
  }

  if (image instanceof File && image.size > 0) {
    if (!image.type.startsWith("image/")) {
      return { error: "이미지 파일만 업로드할 수 있습니다." };
    }
    if (image.size > 5 * 1024 * 1024) {
      return { error: "이미지는 5MB 이하만 가능합니다." };
    }

    if (imagePath) {
      await supabase.storage.from("post-images").remove([imagePath]);
    }

    const ext = image.name.split(".").pop()?.toLowerCase() || "jpg";
    imagePath = `${user.id}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(imagePath, image, { contentType: image.type, upsert: false });

    if (uploadError) return { error: uploadError.message };
  }

  const { error } = await supabase
    .from("posts")
    .update({ title, content, image_path: imagePath })
    .eq("id", postId);

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath(`/posts/${postId}`);
  redirect(`/posts/${postId}`);
}

export async function deletePost(postId: string) {
  const { supabase, user } = await requireUser();
  if (!user) redirect("/login");

  const { data: existing } = await supabase
    .from("posts")
    .select("author_id, image_path")
    .eq("id", postId)
    .single();

  if (!existing || existing.author_id !== user.id) {
    redirect(`/posts/${postId}`);
  }

  if (existing.image_path) {
    await supabase.storage.from("post-images").remove([existing.image_path]);
  }

  await supabase.from("posts").delete().eq("id", postId);

  revalidatePath("/");
  redirect("/");
}
