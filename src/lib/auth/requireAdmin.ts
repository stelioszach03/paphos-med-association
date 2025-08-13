import "server-only";
import { db } from "@/db/client";
import { adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function requireAdmin(userId: string | null) {
  if (!userId) throw new Error("403");
  const rows = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.userId, userId))
    .limit(1);
  const admin = rows[0];
  if (!admin) throw new Error("403");
  return admin;
}
