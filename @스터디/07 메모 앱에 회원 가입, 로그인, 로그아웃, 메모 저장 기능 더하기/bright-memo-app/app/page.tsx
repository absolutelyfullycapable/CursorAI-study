import { AuthForm } from "@/components/auth-form"
import { NotesApp } from "@/components/notes-app"
import { getCurrentUser } from "@/lib/auth"
import { getNotesForUser } from "@/lib/notes-db"

export default async function Page() {
  const user = await getCurrentUser()

  if (!user) {
    return <AuthForm />
  }

  const notes = await getNotesForUser()

  return <NotesApp user={user} initialNotes={notes} />
}
