import { db } from "@/db/client";
import { events } from "@/db/schema";
import { desc, eq, and, gte } from "drizzle-orm";

export async function listUpcomingEvents(lang: string, limit = 3) {
  return await db
    .select()
    .from(events)
    .where(and(
      eq(events.lang, lang),
      gte(events.startAt, new Date())
    ))
    .orderBy(events.startAt)
    .limit(limit);
}

export async function listAllEvents(lang: string) {
  return await db
    .select()
    .from(events)
    .where(eq(events.lang, lang))
    .orderBy(desc(events.startAt));
}

export async function getEventBySlug(slug: string, lang: string) {
  const result = await db
    .select()
    .from(events)
    .where(and(eq(events.slug, slug), eq(events.lang, lang)))
    .limit(1);
  
  return result[0] || null;
}

export async function createEvent(data: {
  title: string;
  slug: string;
  description?: string;
  location?: string;
  startAt?: Date;
  endAt?: Date;
  lang: string;
}) {
  const [event] = await db
    .insert(events)
    .values(data)
    .returning();
  
  return event;
}

export async function updateEvent(id: number, data: Partial<{
  title: string;
  slug: string;
  description: string;
  location: string;
  startAt: Date;
  endAt: Date;
}>) {
  const [event] = await db
    .update(events)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(events.id, id))
    .returning();
  
  return event;
}

export async function deleteEvent(id: number) {
  await db
    .delete(events)
    .where(eq(events.id, id));
}