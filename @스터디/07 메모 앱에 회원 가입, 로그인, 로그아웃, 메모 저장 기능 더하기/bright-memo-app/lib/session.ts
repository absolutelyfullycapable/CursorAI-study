import "server-only"

import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"

const COOKIE_NAME = "session"
const MAX_AGE = 60 * 60 * 24 * 7

const encodedKey = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "dev-insecure-secret-change-me",
)

export type SessionPayload = {
  userId: string
}

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey)
}

export async function decrypt(token?: string): Promise<SessionPayload | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    })
    return { userId: String(payload.userId) }
  } catch {
    return null
  }
}

export async function createSession(userId: string): Promise<void> {
  const token = await encrypt({ userId })
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  })
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  return decrypt(cookieStore.get(COOKIE_NAME)?.value)
}
