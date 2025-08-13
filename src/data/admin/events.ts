import { db } from "@/db/client";
import { events } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function listEvents() {
  return db.select().from(events).orderBy(desc(events.createdAt)).limit(50);
}
export async function getEventBySlug(slug: string) {
  return (await db.select().from(events).where(eq(events.slug, slug)).limit(1))[0] ?? null;
}
export async function createEvent(data: { title: string; slug: string; description?: string; location?: string; startAt?: Date; endAt?: Date; lang?: string; createdBy?: string; }) {
  await db.insert(events).values({ ...data, lang: data.lang ?? "el" });
}
export async function updateEvent(slug: string, data: { title?: string; slug?: string; description?: string; location?: string; startAt?: Date; endAt?: Date; lang?: string; }) {
  await db.update(events).set(data).where(eq(events.slug, slug));
}
