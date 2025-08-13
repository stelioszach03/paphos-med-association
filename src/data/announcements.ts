import { db } from "@/db/client";
import { announcements } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";

export async function listLatestAnnouncements(lang: string, limit = 3) {
  return await db
    .select()
    .from(announcements)
    .where(eq(announcements.lang, lang))
    .orderBy(desc(announcements.createdAt))
    .limit(limit);
}

export async function listAllAnnouncements(lang: string) {
  return await db
    .select()
    .from(announcements)
    .where(eq(announcements.lang, lang))
    .orderBy(desc(announcements.createdAt));
}

export async function getAnnouncementBySlug(slug: string, lang: string) {
  const result = await db
    .select()
    .from(announcements)
    .where(and(eq(announcements.slug, slug), eq(announcements.lang, lang)))
    .limit(1);
  
  return result[0] || null;
}

export async function createAnnouncement(data: {
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  lang: string;
  createdBy?: string;
}) {
  const [announcement] = await db
    .insert(announcements)
    .values(data)
    .returning();
  
  return announcement;
}

export async function updateAnnouncement(id: number, data: Partial<{
  title: string;
  slug: string;
  summary: string;
  content: string;
}>) {
  const [announcement] = await db
    .update(announcements)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(announcements.id, id))
    .returning();
  
  return announcement;
}

export async function deleteAnnouncement(id: number) {
  await db
    .delete(announcements)
    .where(eq(announcements.id, id));
}