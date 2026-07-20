import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { LeftSidebar } from "@/components/LeftSidebar";
import { PostForm } from "@/components/PostForm";
import { createPost } from "@/actions/posts";
import { createClient } from "@/lib/supabase/server";

export default async function NewPostPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto flex max-w-6xl items-start gap-5 px-4 py-5">
        <LeftSidebar />
        <main className="min-w-0 flex-1 space-y-3">
          <h1 className="text-[22px] font-bold tracking-tight text-ink">게시물 만들기</h1>
          <PostForm action={createPost} submitLabel="게시하기" />
        </main>
      </div>
    </div>
  );
}
