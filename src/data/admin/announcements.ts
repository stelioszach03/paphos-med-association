import { db } from "@/db/client";
import { announcements } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function listAnnouncements() {
  return db.select().from(announcements).orderBy(desc(announcements.createdAt)).limit(50);
}
export async function getAnnouncementBySlug(slug: string) {
  return (await db.select().from(announcements).where(eq(announcements.slug, slug)).limit(1))[0] ?? null;
}
export async function createAnnouncement(data: { title: string; slug: string; summary?: string; content?: string; lang?: string; createdBy?: string; }) {
  await db.insert(announcements).values({ ...data, lang: data.lang ?? "el" });
}
export async function updateAnnouncement(slug: string, data: { title?: string; slug?: string; summary?: string; content?: string; lang?: string; }) {
  await db.update(announcements).set(data).where(eq(announcements.slug, slug));
}
