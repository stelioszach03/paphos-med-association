import "server-only";
export const runtime = "nodejs";
import { z } from "zod";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { lucia } from "@/lib/auth/lucia";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/auth/password";

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(1).optional()
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = Body.safeParse(body);
  if (!parsed.success) return new Response("Invalid", { status: 400 });
  const { email, password, fullName } = parsed.data;

  // deny duplicate
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existing.length > 0) return new Response("Email exists", { status: 409 });

  const id = crypto.randomUUID();
  const hashed = await hashPassword(password);
  await db.insert(users).values({ id, email, hashedPassword: hashed, fullName: fullName ?? null });

  const session = await lucia.createSession(id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  return new Response(null, { status: 201 });
}
