"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { type NoteColor } from "@/lib/notes"

async function requireUser() {
  const user = await getCurrentUser()
  if (!user) throw new Error("로그인이 필요합니다.")
  return user
}

export async function createNote(data: {
  title: string
  content: string
  color: NoteColor
}) {
  const user = await requireUser()

  const note = await prisma.note.create({
    data: {
      title: data.title,
      content: data.content,
      color: data.color,
      userId: user.id,
    },
  })

  revalidatePath("/")
  return note
}

export async function updateNote(
  id: string,
  data: { title: string; content: string; color: NoteColor },
) {
  const user = await requireUser()

  await prisma.note.updateMany({
    where: { id, userId: user.id },
    data: {
      title: data.title,
      content: data.content,
      color: data.color,
    },
  })

  revalidatePath("/")
}

export async function togglePinNote(id: string) {
  const user = await requireUser()

  const note = await prisma.note.findFirst({
    where: { id, userId: user.id },
  })
  if (!note) return

  await prisma.note.update({
    where: { id },
    data: { pinned: !note.pinned },
  })

  revalidatePath("/")
}

export async function deleteNote(id: string) {
  const user = await requireUser()

  await prisma.note.deleteMany({
    where: { id, userId: user.id },
  })

  revalidatePath("/")
}
