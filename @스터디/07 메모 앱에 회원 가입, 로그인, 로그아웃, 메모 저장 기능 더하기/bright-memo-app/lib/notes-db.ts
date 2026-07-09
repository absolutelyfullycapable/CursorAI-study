import "server-only"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import type { Note, NoteColor } from "@/lib/notes"

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
  }).format(date)
}

function toNote(row: {
  id: string
  title: string
  content: string
  color: string
  pinned: boolean
  updatedAt: Date
}): Note {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    color: row.color as NoteColor,
    date: formatDate(row.updatedAt),
    pinned: row.pinned,
  }
}

export async function getNotesForUser(): Promise<Note[]> {
  const user = await getCurrentUser()
  if (!user) return []

  const rows = await prisma.note.findMany({
    where: { userId: user.id },
    orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
  })

  return rows.map(toNote)
}
