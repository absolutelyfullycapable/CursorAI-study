import "server-only"

import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session"

export type CurrentUser = {
  id: string
  email: string
  name: string
}

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await getSession()
  if (!session?.userId) return null

  return prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true },
  })
})
