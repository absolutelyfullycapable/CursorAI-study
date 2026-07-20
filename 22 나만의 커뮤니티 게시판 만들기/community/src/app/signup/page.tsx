import { Header } from "@/components/Header";
import { AuthForm } from "@/components/AuthForm";
import { signUp } from "@/actions/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function SignupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/");

  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex justify-center px-4 py-12">
        <AuthForm action={signUp} mode="signup" />
      </div>
    </div>
  );
}
