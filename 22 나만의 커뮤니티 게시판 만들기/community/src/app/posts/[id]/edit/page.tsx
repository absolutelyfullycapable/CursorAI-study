import { notFound, redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { LeftSidebar } from "@/components/LeftSidebar";
import { PostForm } from "@/components/PostForm";
import { updatePost } from "@/actions/posts";
import { createClient } from "@/lib/supabase/server";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!post) notFound();
  if (post.author_id !== user.id) redirect(`/posts/${id}`);

  const boundUpdate = updatePost.bind(null, id);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto flex max-w-6xl items-start gap-5 px-4 py-5">
        <LeftSidebar />
        <main className="min-w-0 flex-1 space-y-3">
          <h1 className="text-[22px] font-bold tracking-tight text-ink">글 수정</h1>
          <PostForm
            action={boundUpdate}
            initialTitle={post.title}
            initialContent={post.content}
            initialImagePath={post.image_path}
            submitLabel="수정 완료"
            showRemoveImage
          />
        </main>
      </div>
    </div>
  );
}
