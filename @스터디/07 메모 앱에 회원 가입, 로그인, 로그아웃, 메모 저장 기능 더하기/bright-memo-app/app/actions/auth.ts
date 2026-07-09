"use server"

import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { createSession, deleteSession } from "@/lib/session"

export type AuthState = {
  error?: string
}

const signupSchema = z.object({
  name: z.string().trim().min(1, "이름을 입력해주세요."),
  email: z.email("올바른 이메일 형식이 아닙니다."),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
})

const loginSchema = z.object({
  email: z.email("올바른 이메일 형식이 아닙니다."),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
})

export async function signup(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." }
  }

  const { name, email, password } = parsed.data
  const normalizedEmail = email.toLowerCase()

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  })
  if (existing) {
    return { error: "이미 가입된 이메일입니다." }
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { name, email: normalizedEmail, passwordHash },
  })

  await createSession(user.id)
  redirect("/")
}

export async function login(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." }
  }

  const { email, password } = parsed.data
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  })

  const invalidMessage = "이메일 또는 비밀번호가 올바르지 않습니다."
  if (!user) {
    return { error: invalidMessage }
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    return { error: invalidMessage }
  }

  await createSession(user.id)
  redirect("/")
}

export async function logout(): Promise<void> {
  await deleteSession()
  redirect("/")
}
