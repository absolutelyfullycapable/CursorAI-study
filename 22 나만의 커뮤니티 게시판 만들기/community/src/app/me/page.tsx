import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { LeftSidebar } from "@/components/LeftSidebar";
import { ProfileForm } from "@/components/ProfileForm";
import { ensureProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";

export default async function MePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profile = await ensureProfile();

  if (!profile) {
    return (
      <div className="min-h-screen">
        <Header />
        <p className="p-8 text-center text-[14px] text-muted">프로필을 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto flex max-w-6xl items-start gap-5 px-4 py-5">
        <LeftSidebar />
        <main className="min-w-0 flex-1">
          <ProfileForm profile={profile} email={user.email ?? ""} />
        </main>
      </div>
    </div>
  );
}
