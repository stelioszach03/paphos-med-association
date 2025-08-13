import { lucia } from "@/lib/auth/lucia";
import { db } from "@/db/client";
import { adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function requireAdmin() {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  
  if (!sessionId) {
    throw new Error("Unauthorized: No session");
  }

  const { session, user } = await lucia.validateSession(sessionId);
  
  if (!session || !user) {
    throw new Error("Unauthorized: Invalid session");
  }

  // Check if user is admin
  const admin = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.userId, user.id))
    .limit(1);

  if (admin.length === 0) {
    throw new Error("Forbidden: Not an admin");
  }

  return { user, admin: admin[0] };
}

export async function getSession() {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  
  if (!sessionId) {
    return { session: null, user: null };
  }

  return await lucia.validateSession(sessionId);
}