import "server-only";
export const runtime = "nodejs";
import { z } from "zod";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { lucia } from "@/lib/auth/lucia";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { verifyPassword } from "@/lib/auth/password";

const Body = z.object({ email: z.string().email(), password: z.string().min(8) });

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = Body.safeParse(body);
  if (!parsed.success) return new Response("Invalid", { status: 400 });

  const rows = await db
    .select()
    .from(users)
    .where(eq(users.email, parsed.data.email))
    .limit(1);
  const user = rows[0];
  if (!user || !user.hashedPassword) return new Response("Unauthorized", { status: 401 });

  const ok = await verifyPassword(user.hashedPassword, parsed.data.password);
  if (!ok) return new Response("Unauthorized", { status: 401 });

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  return new Response(null, { status: 200 });
}
